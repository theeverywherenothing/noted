import React, { useState, useEffect } from 'react';
import Report from '../../components/Report';
import authFetch from '../../utils/AuthFetch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';

const Dashboard = () => {
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc');
  const [limit, setLimit] = useState(10);
  const [incidentTypeFilter, setIncidentTypeFilter] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const incidentTypeMap = {
    1: 'Cyberbullying',
    2: 'Sexual Harassment',
    3: 'Verbal abuse',
    4: 'Discrimination',
    5: 'Other',
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        let url = `${config.BACKEND_HOST}/reports?page=${currentPage}&limit=${limit}&sort_by=${sortBy}&sort_order=${sortOrder}`;
        if (incidentTypeFilter) {
          url += `&incident_type=${incidentTypeFilter}`;
        }

        const response = await authFetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReports(data.reports);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Could not fetch reports:", error);
      }
    };

    fetchReports();
  }, [currentPage, sortBy, sortOrder, limit, incidentTypeFilter]);

  const handleViewReport = (reportId) => {
    setSelectedReportId(reportId);
  };

  const handleCloseReport = () => {
    setSelectedReportId(null);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  const handleIncidentTypeFilterChange = (e) => {
    setIncidentTypeFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased">
      <div className="container mx-auto py-8 px-4">
        <header className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Reports</h2>

          {/* Filters and Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label htmlFor="sort" className="block text-gray-700 text-sm font-bold mb-2">Sort by:</label>
              <select id="sort" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={sortBy} onChange={handleSortChange}>
                <option value="created_at">Date</option>
                <option value="emotional_impact">Emotional Impact</option>
              </select>
            </div>

            <div>
              <label htmlFor="sortOrder" className="block text-gray-700 text-sm font-bold mb-2">Sort Order:</label>
              <select id="sortOrder" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={sortOrder} onChange={handleSortOrderChange}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            <div>
              <label htmlFor="limit" className="block text-gray-700 text-sm font-bold mb-2">Reports per page:</label>
              <select id="limit" className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={limit} onChange={handleLimitChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <div>
              <label htmlFor="incidentType" className="block text-gray-700 text-sm font-bold mb-2">Incident Type:</label>
              <select
                id="incidentType"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={incidentTypeFilter}
                onChange={handleIncidentTypeFilterChange}
              >
                <option value="">All</option>
                {Object.entries(incidentTypeMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Report ID</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Incident Type</th>
                  <th className="py-3 px-6 text-left">Emotional Impact</th>
                  <th className="py-3 px-6 text-left">Address</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{report.id}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{new Date(report.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{incidentTypeMap[report.incident_type] || 'Unknown'}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{report.emotional_impact}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">{report.location}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleViewReport(report.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>

        {/* Report Modal */}
        {selectedReportId && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <Report report={reports.find(report => report.id === selectedReportId)} />
              <button
                onClick={handleCloseReport}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
