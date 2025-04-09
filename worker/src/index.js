import { Router, json } from 'itty-router';
import { generateRandomId, generateJWT } from './util';
import { verifyJWT } from './util';

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Access-Control-Allow-Credentials': 'true',
};

const preflight = async (req) => {
	if (req.method === 'OPTIONS') {
		return new Response(null, {
			headers: CORS_HEADERS,
		});
	}
};

const withAuthenticatedUser = async (req, env) => {
	const authHeader = req.headers.get('Authorization');
	let token = null;

	if (authHeader && authHeader.startsWith('Bearer ')) {
		token = authHeader.split(' ')[1];
	}

	const redirectURL = env.FRONTEND_HOST + '/auth';

	if (!token) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: redirectURL,
				...CORS_HEADERS,
			},
		});
	}

	try {
		console.log('checking token', token);
		const user = await verifyJWT(token, env.JWT_SECRET);

		if (!user || user.expired) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: redirectURL,
					...CORS_HEADERS,
				},
			});
		}

		req.user = user;
		return;
	} catch (err) {
		console.error('Error decoding jwt:', err);
		return new Response(null, {
			status: 302,
			headers: {
				Location: redirectURL,
				...CORS_HEADERS,
			},
		});
	}
};


const router = Router();

router.options('*', preflight);

router.use(json());

router.post('/signin', async (req, env) => {
	try {
		const { username, password } = await req.json();

		if (!username || !password) {
			return json(
				{ success: false, error: 'Missing username or password.' },
				{
					status: 400,
					headers: CORS_HEADERS,
				},
			);
		}

		const { results } = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).all();

		if (!results || results.length === 0) {
			return json(
				{ success: false, error: 'Invalid credentials.' },
				{
					status: 401,
					headers: CORS_HEADERS,
				},
			);
		}

		const user = results[0];

		if (user.password !== password) {
			return json(
				{ success: false, error: 'Invalid credentials.' },
				{
					status: 401,
					headers: CORS_HEADERS,
				},
			);
		}

		const payload = {
			id: user.id,
			username: user.username,
		};

		const token = await generateJWT(payload, env.JWT_SECRET, 60 * 60 * 24 * 30);

		return json(
			{ success: true, token: token },
			{
				status: 200,
				headers: CORS_HEADERS,
			},
		);
	} catch (error) {
		console.error('Error signing in:', error);

		return json(
			{ success: false, error: 'Failed to sign in.' },
			{
				status: 500,
				headers: CORS_HEADERS,
			},
		);
	}
});


router.post('/report', async (req, env) => {
	try {
		const formData = await req.formData();

		console.log('form data', formData)

		const incidentType = formData.get('incidentType');
		const description = formData.get('description');
		const emotionalImpact = formData.get('emotionalImpact');
		const file = formData.get('file');
		const location = formData.get('address');

		if (!incidentType || isNaN(Number(incidentType)) || Number(incidentType) < 0 || Number(incidentType) > 4) {
			return json(
				{ success: false, error: 'Missing or invalid incident type.' },
				{
					status: 400,
					headers: CORS_HEADERS,
				},
			);
		}

		if (!description || description.length <= 0) {
			return json(
				{ success: false, error: 'Missing description.' },
				{
					status: 400,
					headers: CORS_HEADERS,
				},
			);
		}

		if (!emotionalImpact) {
			return json(
				{ success: false, error: 'Missing emotional impact.' },
				{
					status: 400,
					headers: CORS_HEADERS,
				},
			);
		}

		console.log('Received incident report:', {
			incidentType,
			description,
			emotionalImpact,
			file,
			location,
		});

		const reportId = generateRandomId();

		let fileUrl = null;

		if (file) {
			// Check if file is actually a file and not just a string
			if (typeof file === 'object' && file instanceof File) {
				console.log('putting file to r2')
				const u = await env.R2_BUCKET.put(reportId, file);
				console.log('file upload operation', u);
				fileUrl = `${env.R2_BUCKET_URL}/${reportId}`;
			} else {
				console.warn('File is not a File object, skipping R2 upload.');
			}
		}

		console.log('file upload url', fileUrl);

		const { success } = await env.DB.prepare('INSERT INTO reports (id, incident_type, description, emotional_impact, file, location) VALUES (?, ?, ?, ?, ?, ?)').bind(reportId, incidentType, description, emotionalImpact, fileUrl, location).run();

		if (!success) {
			return json(
				{ success: false, error: 'Failed to report incident to the database.' },
				{
					status: 500,
					headers: CORS_HEADERS,
				},
			);
		}

		console.log('reported created with id', reportId)

		return json(
			{ success: true, message: 'Incident reported successfully!', reportId: reportId },
			{
				status: 200,
				headers: CORS_HEADERS,
			},
		);
	} catch (error) {
		console.error('Error reporting incident:', error);

		return json(
			{ success: false, error: 'Failed to report incident.' },
			{
				status: 500,
				headers: CORS_HEADERS,
			},
		);
	}
});

router.get('/reports', withAuthenticatedUser, async (req, env) => {
	try {
		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get('page')) || 1;
		const limit = parseInt(searchParams.get('limit')) || 10;
		let sortBy = searchParams.get('sort_by') || 'created_at';
		const sortOrder = searchParams.get('sort_order') || 'asc'; // 'asc' or 'desc'
		const incidentTypeFilter = searchParams.get('incident_type');

		const offset = (page - 1) * limit;

		let query = `
			SELECT 
				reports.*,
				GROUP_CONCAT(messages.message, '|||') AS messages
			FROM reports
			LEFT JOIN messages ON reports.id = messages.report_id
		`;

		if (incidentTypeFilter) {
			query += ` WHERE reports.incident_type = ${incidentTypeFilter}`;
		}

		query += ` 
			GROUP BY reports.id
			ORDER BY ${sortBy} ${sortOrder}
			LIMIT ${limit} OFFSET ${offset}
		`;

		const { results } = await env.DB.prepare(query).all();

		// Get total count for pagination
		let countQuery = 'SELECT COUNT(*) AS total FROM reports';

		if (incidentTypeFilter) {
			countQuery += ` WHERE incident_type = ${incidentTypeFilter}`;
		}

		const { results: countResult } = await env.DB.prepare(countQuery).all();
		const total = countResult[0].total;

		const reports = results.map(report => ({
			...report,
			messages: report.messages ? report.messages.split('|||') : [],
		}));

		return json(
			{
				success: true,
				reports: reports,
				pagination: {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
				},
			},
			{
				status: 200,
				headers: CORS_HEADERS,
			},
		);
	} catch (error) {
		console.error('Error fetching reports:', error);

		return json(
			{ success: false, error: 'Failed to fetch reports.' },
			{
				status: 500,
				headers: CORS_HEADERS,
			},
		);
	}
});

router.get('/report/:id', async (req, env) => {
	try {
		const reportId = req.params.id;
		const { results } = await env.DB.prepare('SELECT r.*, m.message, m.timestamp, m.user_id FROM reports r LEFT JOIN messages m ON r.id = m.report_id WHERE r.id = ? ORDER BY m.timestamp ASC').bind(reportId).all();

		if (!results || results.length === 0) {
			return json(
				{ success: false, error: 'Report not found.' },
				{
					status: 404,
					headers: CORS_HEADERS,
				},
			);
		}

		const report = {
			...results[0],
			messages: results
				.filter(r => r.message)
				.map(r => ({
					message: r.message,
					timestamp: r.timestamp,
					user_id: r.user_id,
				})),
		};

		return json(
			{ success: true, report: report },
			{
				status: 200,
				headers: CORS_HEADERS,
			},
		);
	} catch (error) {
		console.error('Error fetching report:', error);

		return json(
			{ success: false, error: 'Failed to fetch report.' },
			{
				status: 500,
				headers: CORS_HEADERS,
			},
		);
	}
});

router.put('/report/:id/status', withAuthenticatedUser, async (req, env) => {
	try {
		const params = req.params
		const reportId = params.id;
		const { status } = await req.json();

		const { success } = await env.DB.prepare('UPDATE reports SET status = ? WHERE id = ?').bind(status, reportId).run();

		if (!success) {
			return json(
				{ success: false, error: 'Failed to update report status.' },
				{
					status: 500,
					headers: CORS_HEADERS,
				},
			);
		}

		return json(
			{ success: true, message: 'Report status updated successfully!' },
			{
				status: 200,
				headers: CORS_HEADERS,
			},
		);
	} catch (error) {
		console.error('Error updating report status:', error);

		return json(
			{ success: false, error: 'Failed to update report status.' },
			{
				status: 500,
				headers: CORS_HEADERS,
			},
		);
	}
});

router.post('/report/:id/message', withAuthenticatedUser, async (req, env) => {
	try {
		const reportId = req.params.id;
		const { message } = await req.json();
		const userId = req.user.id

		const { success } = await env.DB.prepare('INSERT INTO messages (report_id, user_id, message) VALUES (?, ?, ?)').bind(reportId, userId, message).run();

		if (!success) {
			return json(
				{ success: false, error: 'Failed to add message to report.' },
				{
					status: 500,
					headers: CORS_HEADERS,
				},
			);
		}

		return json(
			{ success: true, message: 'Message added to report history!' },
			{
				status: 200,
				headers: CORS_HEADERS,
			},
		);
	} catch (error) {
		console.error('Error adding message to report:', error);

		return json(
			{ success: false, error: 'Failed to add message to report.' },
			{
				status: 500,
				headers: CORS_HEADERS,
			},
		);
	}
});


export default {
	fetch(request, env, ctx) {
		return router
			.fetch(request, env, ctx)
			.then(json)
			.catch((error) => {
				console.error('Error during fetch', error);
				return new Response('Internal Server Error', { status: 500 });
			})
			.then((response) => {
				if (response.status < 300 || response.status >= 400) {
					for (const key in CORS_HEADERS) {
						response.headers.set(key, CORS_HEADERS[key]);
					}
				}
				return response;
			});
	},
};

