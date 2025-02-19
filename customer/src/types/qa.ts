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
  isCustomer?: boolean;
  categoryName?: string;
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

export interface QuestionSubmission {
  question: string;
  askedByName: string;
  askedByPhone: string;
  category: string;
  tags: string[];
}

export interface QuestionRejection {
  kelviId: string;
  rejectionReason: string;
}

export interface DuplicateQuestion {
  originalQuestionId: string;
  duplicateQuestionId: string;
}

export interface AnswerSubmission {
  kelviId: string;
  content: string;
  answeredBy: string;
}

export interface PaginatedQuestions {
  questions: Question[];
  totalPages: number;
  currentPage: number;
}

export interface SimilarQuestion {
  _id: string;
  kelviId: string;
  question: string;
}

export interface QuestionSearchParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  query?: string;
}

export interface QuestionListProps {
  questions: Question[];
}

export interface PaginatedQuestionsProps {
  initialQuestions: Question[];
  totalPages: number;
  currentPage: number;
  baseUrl: string;
}

export interface CategoryListProps {
  categories: Category[];
}

export interface SimilarQuestionsProps {
  questions: SimilarQuestion[];
}

export function generateKelviId(): string {
  const timestamp = Date.now().toString().slice(-7);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return timestamp + random;
}
