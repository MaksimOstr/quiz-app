'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import styles from './page.module.css';
import {Quiz} from "@/lib/types/quiz";
import {deleteQuiz, getQuizzes} from "@/lib/api/api";

export default function QuizListPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            const data = await getQuizzes();
            setQuizzes(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this quiz?')) return;

        try {
            await deleteQuiz(id);
            setQuizzes((prev) => prev.filter((q) => q.id !== id));
        } catch (error) {
            alert('Error deleting quiz');
        }
    };

    return (
        <div className="container">
            <div className={styles.header}>
                <h1>Quizzes</h1>
                <Link href="/create" className="btn btn-primary">
                    + Create Quiz
                </Link>
            </div>

            <div className={styles.grid}>
                {quizzes.map((quiz) => (
                    <Link href={`/quizzes/${quiz.id}`} key={quiz.id} className={styles.card}>
                        <div className={styles.content}>
                            <h3 className={styles.title}>{quiz.title}</h3>
                            <p className={styles.desc}>{quiz.description || 'No description'}</p>
                            <span className={styles.badge}>
                {quiz._count?.questions || 0} Questions
              </span>
                        </div>
                        <button
                            className={styles.deleteBtn}
                            onClick={(e) => handleDelete(e, quiz.id)}
                        >
                            Delete
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}