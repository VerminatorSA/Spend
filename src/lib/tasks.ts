
export type Task = {
    id: string;
    title: string;
    status: 'To Do' | 'In Progress' | 'Done' | 'Cancelled';
    priority: 'Low' | 'Medium' | 'High';
    dueDate: Date | null;
    assignee: {
        name: string;
        avatarUrl: string;
    };
};

export const tasks: Task[] = [
    {
        id: 'task-001',
        title: 'Finalize Q3 budget report',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        assignee: { name: 'Alicia Keys', avatarUrl: 'https://picsum.photos/id/1011/100/100' }
    },
    {
        id: 'task-002',
        title: 'Negotiate contract with Global Components Inc.',
        status: 'To Do',
        priority: 'High',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        assignee: { name: 'Purchasing Manager', avatarUrl: 'https://picsum.photos/100/100' }
    },
    {
        id: 'task-003',
        title: 'Review new polymer samples from Advanced Polymers',
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
        assignee: { name: 'Ben Carter', avatarUrl: 'https://picsum.photos/id/1025/100/100' }
    },
    {
        id: 'task-004',
        title: 'Onboard TechFasteners Ltd. as a new supplier',
        status: 'Done',
        priority: 'Medium',
        dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
        assignee: { name: 'Olivia Martin', avatarUrl: 'https://picsum.photos/id/1027/100/100' }
    },
    {
        id: 'task-005',
        title: 'Schedule quarterly business review with Precision Parts Co.',
        status: 'To Do',
        priority: 'Low',
        dueDate: null,
        assignee: { name: 'Alicia Keys', avatarUrl: 'https://picsum.photos/id/1011/100/100' }
    },
];
