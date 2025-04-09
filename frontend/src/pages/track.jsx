import React, { useState } from 'react';
import authFetch from '../utils/AuthFetch';
import config from '../config';

const Track = () => {
  const [reportId, setReportId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const incidentTypeMap = {
    1: 'Cyberbullying',
    2: 'Sexual Harassment',
    3: 'Verbal abuse',
    4: 'Discrimination',
    5: 'Other',
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${config.BACKEND_HOST}/report/${reportId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReportData(data)
    } catch (e) {
      setError(e.message || 'Could not fetch report');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reportId.trim() !== '') {
      fetchReport();
    } else {
      setError('Please enter a report ID.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Track Report</h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="Enter Report ID"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Track'}
              </button>
            </form>

            {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

            {loading && <div className="mt-4 text-center">Loading...</div>}

            {reportData && reportData.report && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Report Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-2"><strong>ID:</strong> {reportData.report.id}</p>
                  <p className="text-gray-700 mb-2"><strong>Incident Type:</strong> {incidentTypeMap[reportData.report.incident_type] || reportData.report.incident_type}</p>
                  <p className="text-gray-700 mb-2"><strong>Description:</strong> {reportData.report.description}</p>
                  <p className="text-gray-700 mb-2"><strong>Emotional Impact:</strong> {reportData.report.emotional_impact}</p>
                  <p className="text-gray-700 mb-2"><strong>Location:</strong> {reportData.report.location}</p>
                  <p className="text-gray-700 mb-2"><strong>Status:</strong> {reportData.report.status}</p>
                  {reportData.report.messages && reportData.report.messages.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Messages:</h3>
                      <ul>
                        {reportData.report.messages.map((message, index) => (
                          <li key={index} className="mb-3">
                            <span className="block text-sm text-gray-500">{new Date(message.timestamp).toLocaleString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}</span>
                            <span className="text-gray-700 break-words">{message.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!reportData && !loading && !error && (
              <div className="mt-4 text-gray-500 text-center">Enter a Report ID to track.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
