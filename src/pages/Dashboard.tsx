import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { getConsultationResponse } from '../lib/openai';
import './Consultation.css'; // Import the CSS file for styling

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await getConsultationResponse(query);
      setResponse(result);
    } catch (err) {
      setError('An error occurred while fetching the response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-300">
                <FiUser className="mr-2" />
                {user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiLogOut className="mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Medical Consultation</h2>
            <form onSubmit={handleSubmit} className="mb-4">
              <textarea
                className="w-full p-2 border rounded mb-2"
                rows={5}
                placeholder="Describe your symptoms then ask a question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={loading}
              >
                {loading ? 'Consulting...' : 'Get Consultation'}
              </button>
            </form>
            {loading && (
              <div className="flex justify-center items-center mb-4">
                <div className="loader"></div>
              </div>
            )}
            {error && (
              <div className="bg-red-100 p-4 rounded mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            {response && (
              <div className="bg-custom p-4 rounded">
                <h2 className="text-xl font-semibold mb-2">AI Response:</h2>
                <p>{response}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}