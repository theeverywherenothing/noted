import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import config from '../config';

const Report = () => {
  const [incidentType, setIncidentType] = useState('0');
  const [description, setDescription] = useState('');
  const [emotionalImpact, setEmotionalImpact] = useState('1');
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(null);
  const [reportId, setReportId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [isCopied, setIsCopied] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm('Are you sure you want to submit this report?')) {
      return;
    }

    const formData = new FormData();
    formData.append('incidentType', incidentType);
    formData.append('description', description);
    formData.append('emotionalImpact', emotionalImpact);
    formData.append('address', address);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch(`${config.BACKEND_HOST}/report`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }

      const result = await response.json();
      setReportId(result.reportId);
      setModalOpen(true);
    } catch (error) {
      alert('Failed to submit report: ' + error.message);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setIncidentType('0');
    setDescription('');
    setEmotionalImpact('1');
    setAddress('');
    setFile(null);
    setCopyButtonText('Copy');
    setIsCopied(false);
  };

  const copyReportId = () => {
    navigator.clipboard.writeText(reportId);
    setCopyButtonText('Copied!');
    setIsCopied(true);
  };

  let emoji = 'Not sure';
  if (emotionalImpact === '2') {
    emoji = '😢';
  } else if (emotionalImpact === '3') {
    emoji = '😔';
  } else if (emotionalImpact === '4') {
    emoji = '😭';
  }

  return (
    <>
      <title>Report an Incident</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />

      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800 text-center">Report an Incident</h1>
              </div>
              <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700">Incident Type</label>
                    <select
                      id="incidentType"
                      name="incidentType"
                      value={incidentType}
                      onChange={(e) => setIncidentType(e.target.value)}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                      <option value="0">Select Incident Type</option>
                      <option value="1">Cyberbullying</option>
                      <option value="2">Sexual Harassment</option>
                      <option value="3">Verbal abuse</option>
                      <option value="4">Discrimination</option>
                      <option value="5">Other</option>
                    </select>
                  </div>

                  <div className="relative">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      rows="4"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Describe what happened"
                    ></textarea>
                  </div>

                  <div className="relative">
                    <label htmlFor="emotionalImpact" className="block text-sm font-medium text-gray-700">Emotional Impact (1-4)</label>
                    <input
                      type="range"
                      id="emotionalImpact"
                      name="emotionalImpact"
                      min="1"
                      max="4"
                      value={emotionalImpact}
                      onChange={(e) => setEmotionalImpact(e.target.value)}
                      className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-2xl">{emoji}</span>
                      <span className="text-gray-700 font-medium">{emotionalImpact}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                      Upload File (Screenshot, etc.)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-purple-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <FontAwesomeIcon icon={faFileUpload} size="3x" className="text-gray-400 mx-auto" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                          >
                            <span>{file ? file.name : 'Upload a file'}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Report Submitted Successfully!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your report has been submitted successfully! Please save the Report ID for future reference and tracking.
                      </p>
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded mt-2">
                        <span className="font-mono text-sm">{reportId}</span>
                        <button
                          onClick={copyReportId}
                          disabled={isCopied}
                          className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${isCopied ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isCopied ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faCopy} />} {copyButtonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Report;
