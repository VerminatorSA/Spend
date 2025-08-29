
export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: 'admin' | 'user';
};

export const users: User[] = [
    {
        id: 'user-001',
        name: 'Purchasing Manager',
        email: 'manager@spend.com',
        avatarUrl: 'https://picsum.photos/100/100',
        role: 'admin',
    },
    {
        id: 'user-002',
        name: 'Alicia Keys',
        email: 'alicia.keys@spend.com',
        avatarUrl: 'https://picsum.photos/100/100',
        role: 'user',
    },
    {
        id: 'user-003',
        name: 'Ben Carter',
        email: 'ben.carter@spend.com',
        avatarUrl: 'https://picsum.photos/100/100',
        role: 'user',
    },
    {
        id: 'user-004',
        name: 'Olivia Martin',
        email: 'olivia.martin@spend.com',
        avatarUrl: 'https://picsum.photos/100/100',
        role: 'user',
    }
];
