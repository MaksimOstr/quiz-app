export enum QuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    TRUE_FALSE = 'TRUE_FALSE',
    SHORT_ANSWER = 'SHORT_ANSWER',
}

export interface Option {
    id?: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id?: string;
    text: string;
    type: QuestionType;
    options: Option[];
}

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    questions?: Question[];
    _count?: {
        questions: number;
    };
}

export interface CreateQuizDto {
    title: string;
    description?: string;
    questions: {
        text: string;
        type: QuestionType;
        options: Option[];
    }[];
}