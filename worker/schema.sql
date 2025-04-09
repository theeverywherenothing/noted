CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex (randomblob (16)))),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS reports (
	id TEXT PRIMARY KEY DEFAULT (lower(hex (randomblob (16)))),
	incident_type TEXT NOT NULL,
	description TEXT NOT NULL,
	emotional_impact INTEGER,
	file TEXT, -- this will be an r2 file url.
	location TEXT,
	status TEXT DEFAULT 'REPORTED',
	created_at DATETIME DEFAULT (datetime ('now', 'localtime')),
	updated_at DATETIME DEFAULT (datetime ('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS messages (
	id TEXT PRIMARY KEY DEFAULT (lower(hex (randomblob (16)))),
  user_id TEXT NOT NULL,
	report_id TEXT NOT NULL,
	message TEXT NOT NULL,
	timestamp DATETIME DEFAULT (datetime ('now', 'localtime')),
	FOREIGN KEY (report_id) REFERENCES reports(id),
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TRIGGER IF NOT EXISTS update_report_timestamp AFTER
UPDATE ON reports BEGIN
UPDATE reports
SET
	updated_at = datetime ('now', 'localtime')
WHERE
	id = NEW.id;
END;