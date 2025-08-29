/**
 * @fileOverview A service for interacting with task data.
 *
 * - createTask - A function that creates a new task.
 */

import { tasks, type Task } from '@/lib/tasks';

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
        const date = new Date(input.dueDate);
        // Adjust for timezone offset
        parsedDueDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
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
