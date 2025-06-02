export interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Assessment {
  id: string;
  name: string;
  questions: string[];
}

export interface Question {
  id: string;
  strand: string;
  config: {
    key: string;
    options: {
      id: string;
      label: string;
      value: string;
    }[];
  };
  hint: string;
}

export interface AssessmentResponse {
  id: string;
  student: string;
  assessment: string;
  completed: string | null;
  responses: {
    questionId: string;
    response: string;
  }[];
}

export type ReportType = 'diagnostic' | 'progress' | 'feedback'; 