
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export type Board = {
    id: string;
    name: string;
    description: string;
    statuses: TaskStatus[];
};

export let boards: Board[] = [
    {
        id: 'board-001',
        name: 'Team A',
        description: 'Tasks for the primary development team.',
        statuses: ['To Do', 'In Progress', 'Done'],
    },
    {
        id: 'board-002',
        name: 'Team B',
        description: 'Tasks for the operations and marketing team.',
        statuses: ['To Do', 'In Progress', 'Done'],
    },
];
