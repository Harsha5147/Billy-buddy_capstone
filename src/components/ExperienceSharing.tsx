import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ExperienceList from './experiences/ExperienceList';
import ExperienceForm from './experiences/ExperienceForm';
import { Shield } from 'lucide-react';

const ExperienceSharing: React.FC = () => {
  const { user } = useAuth();
  const { experiences, addExperience } = useData();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      if (!user) {
        setError('You must be logged in to share your experience');
        return;
      }
      
      await addExperience({
        ...data,
        userId: user.id,
        username: user.username
      });
      setShowForm(false);
      setError(null);
    } catch (error) {
      console.error('Error submitting experience:', error);
      setError('Failed to submit your experience. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-600" size={32} />
            <h2 className="text-2xl font-bold">Community Experiences</h2>
          </div>
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Share Your Story
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && user && (
          <div className="mb-8">
            <ExperienceForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <ExperienceList experiences={experiences} />
      </div>
    </div>
  );
};

export default ExperienceSharing;