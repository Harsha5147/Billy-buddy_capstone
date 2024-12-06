import React from 'react';
import { Experience } from '../../types';
import ExperienceCard from './ExperienceCard';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface ExperienceListProps {
  experiences: Experience[];
}

const ExperienceList: React.FC<ExperienceListProps> = ({ experiences }) => {
  const { likeExperience, addComment } = useData();
  const { user } = useAuth();

  const handleLike = async (experienceId: string) => {
    if (!user) return;
    try {
      await likeExperience(experienceId);
    } catch (error) {
      console.error('Error liking experience:', error);
    }
  };

  const handleComment = async (experienceId: string, comment: string) => {
    if (!user) return;
    try {
      await addComment(experienceId, {
        content: comment,
        isAnonymous: false
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {experiences.length > 0 ? (
        experiences.map((experience) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onLike={handleLike}
            onComment={handleComment}
            isAuthenticated={!!user}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          No experiences shared yet. Be the first to share your story!
        </div>
      )}
    </div>
  );
};

export default ExperienceList;