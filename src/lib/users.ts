
export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: 'admin' | 'user';
    companyId?: string;
    divisionId?: string;
};

export const users: User[] = [
    {
        id: 'user-001',
        name: 'Purchasing Manager',
        email: 'manager@spend.com',
        avatarUrl: 'https://picsum.photos/seed/user1/100/100',
        role: 'admin',
    },
    {
        id: 'user-002',
        name: 'Alicia Keys',
        email: 'alicia.keys@spend.com',
        avatarUrl: 'https://picsum.photos/seed/user2/100/100',
        role: 'user',
        companyId: 'comp-001',
        divisionId: 'div-001',
    },
    {
        id: 'user-003',
        name: 'Ben Carter',
        email: 'ben.carter@spend.com',
        avatarUrl: 'https://picsum.photos/seed/user3/100/100',
        role: 'user',
        companyId: 'comp-002',
        divisionId: 'div-003',
    },
    {
        id: 'user-004',
        name: 'Olivia Martin',
        email: 'olivia.martin@spend.com',
        avatarUrl: 'https://picsum.photos/seed/user4/100/100',
        role: 'user',
        companyId: 'comp-001',
        divisionId: 'div-002',
    }
];
