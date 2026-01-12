import {QuestionType} from "../../../generated/prisma/enums";


export class OptionDto {
    id: string;
    text: string;
    isCorrect: boolean;
    questionId: string;
}

export class QuestionDto {
    id: string;
    text: string;
    type: QuestionType;
    quizId: string;
    createdAt: Date;
    options: OptionDto[];
}

export class QuizDto {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    questions: QuestionDto[];
}

export class QuizSummaryDto {
    id: string;
    title: string;
    description: string | null;
    createdAt: Date;
    _count: {
        questions: number;
    };
}