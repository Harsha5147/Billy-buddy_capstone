import React, { createContext, useContext, useState, useEffect } from 'react';
import { Report, Question, Experience, Answer, Comment } from '../types';
import { db } from '../services/db';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  reports: Report[];
  questions: Question[];
  experiences: Experience[];
  addReport: (reportData: Omit<Report, 'id' | 'status' | 'timestamp'>) => Promise<void>;
  addQuestion: (questionData: Omit<Question, 'id' | 'status' | 'createdAt' | 'answers'>) => Promise<void>;
  addExperience: (experienceData: any) => Promise<void>;
  addComment: (experienceId: string, commentData: { content: string; isAnonymous: boolean }) => Promise<void>;
  likeExperience: (experienceId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const refreshData = async () => {
    try {
      const [allReports, allQuestions, allExperiences] = await Promise.all([
        db.reports.toArray(),
        db.questions.toArray(),
        db.experiences.toArray()
      ]);

      setReports(allReports);
      setQuestions(allQuestions);
      setExperiences(allExperiences);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addReport = async (reportData: Omit<Report, 'id' | 'status' | 'timestamp'>) => {
    try {
      const newReport: Report = {
        id: uuidv4(),
        status: 'pending',
        timestamp: new Date(),
        ...reportData
      };

      await db.reports.add(newReport);
      await refreshData();
    } catch (error) {
      console.error('Error adding report:', error);
      throw new Error('Failed to submit report');
    }
  };

  const addQuestion = async (questionData: Omit<Question, 'id' | 'status' | 'createdAt' | 'answers'>) => {
    try {
      const newQuestion: Question = {
        id: uuidv4(),
        status: 'pending',
        createdAt: new Date(),
        answers: [],
        ...questionData
      };

      await db.questions.add(newQuestion);
      await refreshData();
    } catch (error) {
      console.error('Error adding question:', error);
      throw new Error('Failed to submit question');
    }
  };

  const addExperience = async (experienceData: any) => {
    try {
      const newExperience: Experience = {
        id: uuidv4(),
        userId: experienceData.userId,
        username: experienceData.username,
        title: experienceData.title,
        content: experienceData.content,
        timestamp: new Date(),
        tags: experienceData.tags,
        isAnonymous: experienceData.isAnonymous,
        status: 'pending',
        comments: [],
        likes: 0
      };

      await db.experiences.add(newExperience);
      await refreshData();
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  };

  const addComment = async (experienceId: string, commentData: { content: string; isAnonymous: boolean }) => {
    try {
      const experience = await db.experiences.get(experienceId);
      if (!experience) throw new Error('Experience not found');

      const newComment: Comment = {
        id: uuidv4(),
        userId: 'user-id',
        username: commentData.isAnonymous ? 'Anonymous' : 'User',
        content: commentData.content,
        timestamp: new Date(),
        isAnonymous: commentData.isAnonymous,
        likes: 0
      };

      experience.comments.push(newComment);
      await db.experiences.update(experienceId, { comments: experience.comments });
      await refreshData();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const likeExperience = async (experienceId: string) => {
    try {
      const experience = await db.experiences.get(experienceId);
      if (!experience) throw new Error('Experience not found');

      await db.experiences.update(experienceId, { likes: experience.likes + 1 });
      await refreshData();
    } catch (error) {
      console.error('Error liking experience:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      reports,
      questions,
      experiences,
      addReport,
      addQuestion,
      addExperience,
      addComment,
      likeExperience,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};