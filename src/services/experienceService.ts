import { db } from './db';
import { Experience, CreateExperienceDto, CreateCommentDto, ExperienceComment } from '../types/experience';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';

class ExperienceService {
  async createExperience(userId: string, username: string, data: CreateExperienceDto): Promise<Experience> {
    const sanitizedContent = DOMPurify.sanitize(data.content);
    
    const experience: Experience = {
      id: uuidv4(),
      userId,
      title: data.title,
      content: sanitizedContent,
      tags: data.tags,
      likes: 0,
      isAnonymous: data.isAnonymous,
      author: {
        username: data.isAnonymous ? 'Anonymous' : username
      },
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending'
    };

    await db.experiences.add(experience);
    return experience;
  }

  async getExperiences(): Promise<Experience[]> {
    const experiences = await db.experiences
      .where('status')
      .equals('approved')
      .toArray();
    return experiences.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPendingExperiences(): Promise<Experience[]> {
    const experiences = await db.experiences
      .where('status')
      .equals('pending')
      .toArray();
    return experiences.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async approveExperience(id: string): Promise<void> {
    await db.experiences.update(id, { status: 'approved' });
  }

  async rejectExperience(id: string): Promise<void> {
    await db.experiences.update(id, { status: 'rejected' });
  }

  async addComment(
    experienceId: string,
    userId: string,
    username: string,
    data: CreateCommentDto
  ): Promise<ExperienceComment> {
    const experience = await db.experiences.get(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    const sanitizedContent = DOMPurify.sanitize(data.content);
    
    const comment: ExperienceComment = {
      id: uuidv4(),
      userId,
      experienceId,
      content: sanitizedContent,
      author: {
        username: data.isAnonymous ? 'Anonymous' : username
      },
      likes: 0,
      isAnonymous: data.isAnonymous,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    experience.comments.push(comment);
    await db.experiences.update(experienceId, { comments: experience.comments });
    
    return comment;
  }

  async likeExperience(experienceId: string): Promise<void> {
    const experience = await db.experiences.get(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    await db.experiences.update(experienceId, {
      likes: experience.likes + 1
    });
  }

  async likeComment(experienceId: string, commentId: string): Promise<void> {
    const experience = await db.experiences.get(experienceId);
    if (!experience) {
      throw new Error('Experience not found');
    }

    const commentIndex = experience.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }

    experience.comments[commentIndex].likes += 1;
    await db.experiences.update(experienceId, {
      comments: experience.comments
    });
  }
}

export const experienceService = new ExperienceService();