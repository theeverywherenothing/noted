import React, { useState, useEffect } from 'react';
import authFetch from '../utils/AuthFetch';
import config from '../config';

const Report = ({ report }) => {
  const [newMessage, setNewMessage] = useState('');
  const statuses = ['REPORTED', 'INVESTIGATING', 'CLOSED'];
  const [reportData, setReportData] = useState(report);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (reportData && reportData.messages) {
      // Clear existing messages before adding
      setMessages([]);
      setMessages(reportData.messages);
    }
  }, [reportData]);

  if (!reportData) {
    return <div>Loading report...</div>;
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await authFetch(`${config.BACKEND_HOST}/report/${reportData.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setReportData(prevReportData => ({ ...prevReportData, status: newStatus }));

    } catch (error) {
      console.error("Could not update status:", error);
    }
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      try {
        const response = await authFetch(`${config.BACKEND_HOST}/report/${reportData.id}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: newMessage }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setMessages(prevMessages => [...prevMessages, newMessage]);
        setNewMessage('');
      } catch (error) {
        console.error("Could not send message:", error);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col h-full max-h-[80vh]">
      <h2 className="text-lg font-semibold mb-2">Report ID: {reportData.id}</h2>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">Status:</h3>
        <div className="flex space-x-2">
          {statuses.map((status) => (
            <button
              key={status}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${reportData.status === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } focus:outline-none`}
              onClick={() => handleStatusChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">Description:</h3>
        <p className="text-sm">{reportData.description}</p>
      </div>

      {reportData.file && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1">Image:</h3>
          <img src={reportData.file} alt="Report Image" className="rounded-lg max-h-48 object-contain" />
        </div>
      )}

      <div className="mb-4 flex-grow overflow-y-auto max-h-[40vh]">
        <h3 className="text-sm font-semibold mb-1">History/Logs:</h3>
        <div className="space-y-2">
          {messages && messages.map((message, index) => (
            <div key={index} className="text-xs">
              <span className="font-semibold">{(new Date()).toLocaleString()}</span> : {message}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-1">New Message:</h3>
        <div className="flex">
          <input
            type="text"
            className="flex-grow border rounded py-2 px-3 mr-2 text-sm focus:outline-none"
            placeholder="Write a message..."
            value={newMessage}
            onChange={handleNewMessageChange}
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm focus:outline-none"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
