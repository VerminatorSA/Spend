
export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'Super Admin' | 'Admin' | 'Manager' | 'Member';
    status: 'Active' | 'Invited' | 'Inactive';
    companyId: string;
    divisionId: string;
    avatarUrl: string;
};

export let users: User[] = [
    {
        id: 'user-001',
        firstName: 'Purchasing',
        lastName: 'Manager',
        email: 'manager@spend.com',
        role: 'Super Admin',
        status: 'Active',
        companyId: 'comp-001',
        divisionId: 'div-001',
        avatarUrl: 'https://picsum.photos/100/100',
    },
    {
        id: 'user-002',
        firstName: 'Alicia',
        lastName: 'Keys',
        email: 'alicia.keys@spend.com',
        role: 'Manager',
        status: 'Active',
        companyId: 'comp-001',
        divisionId: 'div-002',
        avatarUrl: 'https://picsum.photos/id/1011/100/100',
    },
    {
        id: 'user-003',
        firstName: 'Ben',
        lastName: 'Carter',
        email: 'ben.carter@spend.com',
        role: 'Member',
        status: 'Invited',
        companyId: 'comp-002',
        divisionId: 'div-003',
        avatarUrl: 'https://picsum.photos/id/1025/100/100',
    }
];
