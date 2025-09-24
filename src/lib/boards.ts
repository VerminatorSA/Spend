
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export type Board = {
    id: string;
    name: string;
    description: string;
    statuses: TaskStatus[];
    companyId?: string;
    divisionId?: string;
    ownerId?: string;
};

export const GENERAL_TASKS_BOARD_ID = 'board-general';

export let boards: Board[] = [
    {
        id: GENERAL_TASKS_BOARD_ID,
        name: 'General Tasks',
        description: 'A place for all your standalone tasks.',
        statuses: ['To Do', 'In Progress', 'Done'],
    },
    {
        id: 'board-001',
        name: 'Team A',
        description: 'Tasks for the primary development team.',
        statuses: ['To Do', 'In Progress', 'Done'],
        companyId: 'comp-001',
        divisionId: 'div-001',
        ownerId: 'user-002',
    },
    {
        id: 'board-002',
        name: 'Team B',
        description: 'Tasks for the operations and marketing team.',
        statuses: ['To Do', 'In Progress', 'Done'],
        companyId: 'comp-002',
        divisionId: 'div-003',
        ownerId: 'user-003',
    },
    {
        id: 'board-003',
        name: 'Team C',
        description: 'Tasks for the retail and e-commerce team.',
        statuses: ['To Do', 'In Progress', 'Done'],
        companyId: 'comp-003',
        divisionId: 'div-005',
        ownerId: 'user-003',
    },
];
