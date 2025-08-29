
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
import { PlusCircle, MoreHorizontal, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { tasks, type Task } from '@/lib/tasks';
import { format } from 'date-fns';

type SortKey = keyof Task | null;
type SortDirection = 'asc' | 'desc';

const priorityMap: Record<Task['priority'], { variant: 'destructive' | 'outline' | 'secondary', icon: React.ElementType, level: number }> = {
    'High': { variant: 'destructive', icon: ArrowUp, level: 3 },
    'Medium': { variant: 'outline', icon: ArrowRight, level: 2 },
    'Low': { variant: 'secondary', icon: ArrowDown, level: 1 },
};

export default function TasksPage() {
    const [sortedTasks, setSortedTasks] = useState<Task[]>(tasks);
    const [sortKey, setSortKey] = useState<SortKey>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const handleSort = (key: SortKey) => {
        const direction = (sortKey === key && sortDirection === 'asc') ? 'desc' : 'asc';
        setSortKey(key);
        setSortDirection(direction);

        const sorted = [...tasks].sort((a, b) => {
            if (!key) return 0;

            const aValue = a[key];
            const bValue = b[key];

            if (aValue === null) return 1;
            if (bValue === null) return -1;
            
            if (key === 'priority') {
                return (priorityMap[a.priority].level - priorityMap[b.priority].level) * (direction === 'asc' ? 1 : -1);
            }

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            
            return 0;
        });

        setSortedTasks(sorted);
    };

    const getSortIndicator = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortDirection === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    };

  return (
    <div className="flex h-full flex-col">
      <Header title="Tasks">
        <Button asChild>
          <Link href="/tasks/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
           <div>
              <h2 className="text-2xl font-bold">Task Board</h2>
              <p className="text-muted-foreground">Manage your team's tasks and track progress.</p>
            </div>
            <Card className="mt-8">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => handleSort('title')} className="cursor-pointer">
                                    <div className="flex items-center">Title {getSortIndicator('title')}</div>
                                </TableHead>
                                <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                                    <div className="flex items-center">Status {getSortIndicator('status')}</div>
                                </TableHead>
                                <TableHead onClick={() => handleSort('priority')} className="cursor-pointer">
                                    <div className="flex items-center">Priority {getSortIndicator('priority')}</div>
                                </TableHead>
                                <TableHead onClick={() => handleSort('dueDate')} className="cursor-pointer">
                                    <div className="flex items-center">Due Date {getSortIndicator('dueDate')}</div>
                                </TableHead>
                                <TableHead>Assignee</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedTasks.map((task) => {
                                const priorityConfig = priorityMap[task.priority];
                                return (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={task.status === 'Done' ? 'default' : 'secondary'}>{task.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                         <Badge variant={priorityConfig.variant} className={priorityConfig.variant === 'outline' ? 'border-yellow-500 text-yellow-500' : ''}>
                                            <priorityConfig.icon className="mr-1 h-3 w-3" />
                                            {task.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {task.dueDate ? format(task.dueDate, 'PPP') : 'No due date'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} data-ai-hint="person avatar" />
                                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
                                        </div>
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
                                                <DropdownMenuItem>Change Status</DropdownMenuItem>
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
