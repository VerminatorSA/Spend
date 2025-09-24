
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { PlusCircle, KanbanSquare } from 'lucide-react';
import { boards } from '@/lib/boards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TasksListPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Task Boards">
        <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/tasks/add-board">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Board
                </Link>
            </Button>
            <Button asChild>
                <Link href="/tasks/add">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Task
                </Link>
            </Button>
        </div>
      </Header>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">All Boards</h2>
            <p className="text-muted-foreground">Select a board to view its tasks.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map(board => (
              <Link href={`/tasks/${board.id}`} key={board.id}>
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <KanbanSquare className="h-6 w-6" />
                      </div>
                      <CardTitle>{board.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{board.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
             <Link href={`/tasks/add-board`}>
                <Card className="flex h-full min-h-[178px] items-center justify-center border-2 border-dashed bg-muted/50 transition-colors hover:border-primary hover:bg-muted">
                  <div className="text-center">
                    <PlusCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 font-medium text-muted-foreground">Create New Board</p>
                  </div>
                </Card>
              </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
