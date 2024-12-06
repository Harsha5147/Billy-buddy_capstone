import Dexie, { Table } from 'dexie';
import { Report, Question, Experience } from '../types';

class CyberGuardDB extends Dexie {
  reports!: Table<Report>;
  questions!: Table<Question>;
  experiences!: Table<Experience>;

  constructor() {
    super('CyberGuardDB');
    
    this.version(1).stores({
      reports: 'id, userId, status, severity, timestamp, bullyingType',
      questions: 'id, userId, status, createdAt, title',
      experiences: 'id, userId, status, timestamp, title, likes'
    });
  }

  async addReport(report: Omit<Report, 'id'>): Promise<string> {
    return await this.reports.add(report as Report);
  }

  async addExperience(experience: Experience): Promise<string> {
    return await this.experiences.add(experience);
  }

  async updateExperience(id: string, updates: Partial<Experience>): Promise<number> {
    return await this.experiences.update(id, updates);
  }

  async getExperienceById(id: string): Promise<Experience | undefined> {
    return await this.experiences.get(id);
  }

  async getAllExperiences(): Promise<Experience[]> {
    return await this.experiences
      .orderBy('timestamp')
      .reverse()
      .toArray();
  }
}

export const db = new CyberGuardDB();