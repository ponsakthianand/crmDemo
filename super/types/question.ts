import type { ObjectId } from 'mongodb';

export interface Question {
  _id: ObjectId;
  kelviId: string;
  question: string;
  askedByName: string;
  askedByPhone: string;
  createdAt: Date | string;
  answers: Answer[];
  approved: boolean;
  category: string | null; // Update to string (category ID) or null
  tags: string[];
  originalVersions?: [
    {
      kelviId: string;
      question: string;
    },
  ];
  rejectionReason?: string;
  isDuplicate?: boolean;
  duplicateOf?: string;
  isPublished: boolean;
  createdBy?: string;
  originalQuestion?: string;
  editedQuestion?: string;
  editedBy?: string;
  editedById?: string;
  editedAt?: Date;
  createdByName: string;
  createdById: string;
  rejectedBy?: string;
  rejectedById?: string;
  updatedAt?: Date;
  updatedBy?: string;
  updatedById?: string;
  relatedQuestions?: SimilarQuestion[];
  isCustomer: boolean;
}

export interface Answer {
  _id: string;
  content: string;
  answeredBy: string;
  answeredById: string;
  createdAt: Date;
  approved: boolean;
  isBlurred: boolean;
  isHidden: boolean;
  updatedAt?: Date;
  updatedBy?: string;
  updatedById?: string;
}

export interface Category {
  _id: string;
  vagaiId: string;
  name: string;
  slug: string;
  created_by: string;
  created_at: string;
  created_by_name: string;
}

export interface SimilarQuestion {
  _id: string;
  kelviId: string;
  question: string;
}
