import React, { useState } from 'react';
import { format } from 'date-fns';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { Experience } from '../../types';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface ExperienceCardProps {
  experience: Experience;
  onLike: (experienceId: string) => Promise<void>;
  onComment: (experienceId: string, comment: string) => Promise<void>;
  isAuthenticated: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  onLike,
  onComment,
  isAuthenticated
}) => {
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    await onLike(experience.id);
  };

  const handleCommentSubmit = async (comment: string) => {
    if (!isAuthenticated) return;
    await onComment(experience.id, comment);
    setShowComments(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
          <p className="text-sm text-gray-500">
            Shared by {experience.isAnonymous ? 'Anonymous' : experience.username} • {
              format(new Date(experience.timestamp), 'MMM d, yyyy')
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 ${
              isAuthenticated 
                ? 'text-gray-500 hover:text-red-500 transition-colors' 
                : 'text-gray-300 cursor-not-allowed'
            }`}
            disabled={!isAuthenticated}
          >
            <Heart size={20} />
            <span>{experience.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageSquare size={20} />
            <span>{experience.comments.length}</span>
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{experience.content}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {experience.tags.map(tag => (
          <span
            key={tag}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {showComments && (
        <div className="mt-4 space-y-4">
          {isAuthenticated && (
            <CommentForm onSubmit={handleCommentSubmit} />
          )}
          <CommentList comments={experience.comments} />
        </div>
      )}
    </div>
  );
};

export default ExperienceCard;