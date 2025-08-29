
'use client';

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
import { users } from '@/lib/users';

export default function UserManagementPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="User Management">
        <Button asChild>
          <Link href="/settings/users/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
           <div>
              <h2 className="text-2xl font-bold">Users</h2>
              <p className="text-muted-foreground">Manage your team members and their permissions.</p>
            </div>
            <Card className="mt-8">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar" />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="text-sm text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </Badge>
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
                                                <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
