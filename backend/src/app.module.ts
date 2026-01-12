import { Module } from '@nestjs/common';
import {QuizModule} from "./quiz/quiz.module";
import {PrismaService} from "./prisma.service";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      QuizModule,
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
      }),
  ],
    providers: [PrismaService],
})
export class AppModule {}
