import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import {QuizDto, QuizSummaryDto} from "./dto/quiz-result.dto";
import {Quiz} from "../../generated/prisma/client";

@Injectable()
export class QuizService {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateQuizDto): Promise<QuizDto> {
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
}