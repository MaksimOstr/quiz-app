'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './detail.module.css';
import {QuestionType, Quiz} from "@/lib/types/quiz";
import {getQuiz} from "@/lib/api/api";

export default function QuizDetailPage() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            getQuiz(id as string)
                .then(setQuiz)
                .catch(() => router.push('/quizzes'));
        }
    }, [id, router]);

    if (!quiz) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <button onClick={() => router.back()} className="btn btn-outline" style={{marginBottom: '1rem'}}>
                &larr; Back
            </button>

            <div className={styles.header}>
                <h1>{quiz.title}</h1>
                <p>{quiz.description}</p>
            </div>

            <div className={styles.list}>
                {quiz.questions?.map((q, idx) => (
                    <div key={q.id} className={styles.questionCard}>
                        <h3>{idx + 1}. {q.text}</h3>
                        <div className={styles.options}>
                            {q.options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`${styles.option} ${opt.isCorrect ? styles.correct : ''}`}
                                >
                                    <div className={styles.marker}>
                                        {q.type === QuestionType.MULTIPLE_CHOICE && <input type="checkbox" readOnly checked={opt.isCorrect} />}
                                        {q.type === QuestionType.TRUE_FALSE && <input type="radio" readOnly checked={opt.isCorrect} />}
                                        {q.type === QuestionType.SHORT_ANSWER && <span>A:</span>}
                                    </div>
                                    <span>{opt.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}