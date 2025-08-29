/**
 * @fileOverview A service for interacting with task data.
 *
 * - createTask - A function that creates a new task.
 */

import { tasks, type Task } from '@/lib/tasks';
import { parseISO } from 'date-fns';

interface CreateTaskInput {
    title: string;
    description?: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate?: string;
}

/**
 * Creates a new task and adds it to the list.
 * @param input The details of the task to create.
 * @returns A promise that resolves when the task is created.
 */
export async function createTask(input: CreateTaskInput): Promise<void> {
    const newId = `task-${String(tasks.length + 1).padStart(3, '0')}`;
    
    // Convert dueDate string to Date object if it exists
    let parsedDueDate: Date | null = null;
    if (input.dueDate) {
        // Try parsing as ISO 8601 string, which includes date and time
        const date = parseISO(input.dueDate);
        if (isNaN(date.getTime())) {
            // Fallback for date only strings, adjust for timezone
            const simpleDate = new Date(input.dueDate);
            parsedDueDate = new Date(simpleDate.getTime() + simpleDate.getTimezoneOffset() * 60000);
        } else {
            parsedDueDate = date;
        }
    }
    
    const newTask: Task = {
        id: newId,
        title: input.title,
        description: input.description,
        status: 'To Do',
        priority: input.priority,
        dueDate: parsedDueDate,
        // For now, assign to the default user. In a real app, this would be the logged-in user.
        assignee: { name: 'Purchasing Manager', avatarUrl: 'https://picsum.photos/100/100' },
    };

    tasks.push(newTask);
}
