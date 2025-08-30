
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { users as initialUsers, type User } from '@/lib/users';
import { companies, divisions } from '@/lib/organization';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);

  return (
    <div className="flex h-full flex-col">
      <Header title="User Management">
        <Button asChild>
          <Link href="/settings/users/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite User
          </Link>
        </Button>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
           <div>
              <h2 className="text-2xl font-bold">All Users</h2>
              <p className="text-muted-foreground">Manage user accounts and their roles.</p>
            </div>
            <Card className="mt-8">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Division</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => {
                                const company = companies.find(c => c.id === user.companyId);
                                const division = divisions.find(d => d.id === user.divisionId);
                                const userInitials = `${user.firstName[0]}${user.lastName[0]}`;

                                return (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatarUrl} alt={user.firstName} data-ai-hint="person avatar" />
                                                <AvatarFallback>{userInitials}</AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell className="text-muted-foreground">{company?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-muted-foreground">{division?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Deactivate</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
