import React from 'react';
import { format } from 'date-fns';
import { Heart } from 'lucide-react';
import { Comment } from '../../types';

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-gray-500">
              {comment.isAnonymous ? 'Anonymous' : comment.username} • {
                format(new Date(comment.timestamp), 'MMM d, yyyy')
              }
            </p>
            <div className="flex items-center gap-1 text-gray-500">
              <Heart size={16} />
              <span className="text-sm">{comment.likes}</span>
            </div>
          </div>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;