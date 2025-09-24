
import type { TaskStatus } from './boards';

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: 'Low' | 'Medium' | 'High';
    dueDate: string | null;
    assignee: {
        name: string;
        avatarUrl: string;
    };
    boardId: string;
    inventoryItems?: {
        itemId: string;
        quantity: number;
    }[];
};

export let tasks: Task[] = [
    {
        id: 'task-001',
        title: 'Finalize Q3 budget report',
        status: 'In Progress',
        priority: 'High',
        dueDate: '2024-09-15T14:00:00Z',
        assignee: { name: 'Alicia Keys', avatarUrl: 'https://picsum.photos/id/1011/100/100' },
        boardId: 'board-001',
        inventoryItems: [
            { itemId: 'item-001', quantity: 100 },
            { itemId: 'item-003', quantity: 10 },
        ],
    },
    {
        id: 'task-002',
        title: 'Negotiate contract with Global Components Inc.',
        status: 'To Do',
        priority: 'High',
        dueDate: '2024-09-20T10:00:00Z',
        assignee: { name: 'Purchasing Manager', avatarUrl: 'https://picsum.photos/100/100' },
        boardId: 'board-001'
    },
    {
        id: 'task-003',
        title: 'Review new polymer samples from Advanced Polymers',
        status: 'To Do',
        priority: 'Medium',
        dueDate: '2024-09-25T16:30:00Z',
        assignee: { name: 'Ben Carter', avatarUrl: 'https://picsum.photos/id/1025/100/100' },
        boardId: 'board-001',
        inventoryItems: [
            { itemId: 'item-002', quantity: 2 },
            { itemId: 'item-007', quantity: 1 },
        ],
    },
    {
        id: 'task-004',
        title: 'Onboard TechFasteners Ltd. as a new supplier',
        status: 'Done',
        priority: 'Medium',
        dueDate: '2024-08-28T11:00:00Z',
        assignee: { name: 'Olivia Martin', avatarUrl: 'https://picsum.photos/id/1027/100/100' },
        boardId: 'board-002'
    },
    {
        id: 'task-005',
        title: 'Schedule quarterly business review with Precision Parts Co.',
        status: 'To Do',
        priority: 'Low',
        dueDate: null,
        assignee: { name: 'Alicia Keys', avatarUrl: 'https://picsum.photos/id/1011/100/100' },
        boardId: 'board-002'
    },
    {
        id: 'task-006',
        title: 'Launch new online store marketing campaign',
        status: 'To Do',
        priority: 'High',
        dueDate: '2024-10-01T09:00:00Z',
        assignee: { name: 'Ben Carter', avatarUrl: 'https://picsum.photos/id/1025/100/100' },
        boardId: 'board-003'
    },
    {
        id: 'task-007',
        title: 'Analyze Q3 online sales data',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: '2024-10-05T17:00:00Z',
        assignee: { name: 'Ben Carter', avatarUrl: 'https://picsum.photos/id/1025/100/100' },
        boardId: 'board-003'
    },
];
