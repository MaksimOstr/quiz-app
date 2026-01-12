import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import {QuizDto, QuizSummaryDto} from "./dto/quiz-result.dto";
import {PrismaService} from "../prisma.service";
import {QuestionType, Quiz} from "../generated/prisma/client";

@Injectable()
export class QuizService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateQuizDto): Promise<QuizDto> {
        dto.questions.forEach((question, index) => {
            this.validateQuestion(question, index);
        });

        return this.prisma.quiz.create({
            data: {
                title: dto.title,
                description: dto.description,
                questions: {
                    create: dto.questions.map((q) => ({
                        text: q.text,
                        type: q.type,
                        options: {
                            create: q.options.map((o) => ({
                                text: o.text,
                                isCorrect: o.isCorrect,
                            })),
                        },
                    })),
                },
            },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });
    }

    async findAll(): Promise<QuizSummaryDto[]> {
        return this.prisma.quiz.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                _count: {
                    select: { questions: true },
                },
            },
        });
    }

    async findOne(id: string): Promise<QuizDto> {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });

        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }

        return quiz;
    }

    async remove(id: string): Promise<Quiz> {
        const quiz = await this.prisma.quiz.findUnique({ where: { id } });

        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }

        return this.prisma.quiz.delete({
            where: { id },
        });
    }

    private validateQuestion(question: CreateQuizDto['questions'][0], index: number) {
        const options = question.options;
        const correctOptions = options.filter(o => o.isCorrect);

        if (correctOptions.length === 0) {
            throw new BadRequestException(`Question #${index + 1} ("${question.text}") must have at least one correct option.`);
        }

        switch (question.type) {
            case QuestionType.TRUE_FALSE:
                if (options.length !== 2) {
                    throw new BadRequestException(`TRUE_FALSE question #${index + 1} must have exactly 2 options (True and False).`);
                }
                if (correctOptions.length !== 1) {
                    throw new BadRequestException(`TRUE_FALSE question #${index + 1} must have exactly one correct answer.`);
                }
                break;

            case QuestionType.MULTIPLE_CHOICE:
                if (options.length < 2) {
                    throw new BadRequestException(`MULTIPLE_CHOICE question #${index + 1} must have at least 2 options.`);
                }
                break;

            case QuestionType.SHORT_ANSWER:
                if (options.length !== 1) {
                    throw new BadRequestException(`SHORT_ANSWER question #${index + 1} must have exactly 1 option (the correct answer text).`);
                }
                if (!options[0].isCorrect) {
                    throw new BadRequestException(`The option for SHORT_ANSWER question #${index + 1} must be marked as correct.`);
                }
                break;
        }
    }
}