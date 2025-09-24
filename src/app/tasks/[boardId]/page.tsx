
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListTodo, Timer, CheckCircle2, AlertCircle } from 'lucide-react';
import { tasks as initialTasks, type Task } from '@/lib/tasks';
import { boards as allBoards, type Board, type TaskStatus } from '@/lib/boards';
import { KanbanColumn } from '@/components/kanban-column';
import { TaskCard } from '@/components/task-card';
import { EditTaskDialog } from '@/components/edit-task-dialog';
import { updateTask } from '@/services/task-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function TaskBoardPage() {
    const params = useParams();
    
    const [board, setBoard] = useState<Board | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        setIsClient(true);
        if (params?.boardId) {
            const boardId = params.boardId as string;
            const currentBoard = allBoards.find(b => b.id === boardId);
            if (currentBoard) {
                setBoard(currentBoard);
                const boardTasks = initialTasks.filter(t => t.boardId === boardId);
                setTasks(boardTasks);
            }
        }
    }, [params]);
    
    const projectStats = useMemo(() => {
        const totalTasks = tasks.length;
        if (totalTasks === 0) {
            return {
                progress: 0,
                counts: { 'To Do': 0, 'In Progress': 0, 'Done': 0 },
                overdue: 0,
            }
        }
        const counts = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {} as Record<TaskStatus, number>);

        const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length;
        const progress = Math.round(((counts['Done'] || 0) / totalTasks) * 100);

        return { progress, counts, overdue };
    }, [tasks]);

    const columns = useMemo(() => {
        return board?.statuses.map(status => ({
            id: status,
            title: status,
        })) || [];
    }, [board]);

    const tasksByStatus = useMemo(() => {
        const groupedTasks: Record<TaskStatus, Task[]> = board 
            ? board.statuses.reduce((acc, status) => ({...acc, [status]: []}), {} as Record<TaskStatus, Task[]>)
            : {} as Record<TaskStatus, Task[]>;
        
        tasks.forEach(task => {
            if (groupedTasks[task.status]) {
                groupedTasks[task.status].push(task);
            }
        });

        const priorityOrder: Record<Task['priority'], number> = { 'High': 1, 'Medium': 2, 'Low': 3 };
        
        for (const status in groupedTasks) {
            groupedTasks[status as TaskStatus].sort((a, b) => {
                // First, sort by priority
                const priorityDifference = priorityOrder[a.priority] - priorityOrder[b.priority];
                if (priorityDifference !== 0) {
                    return priorityDifference;
                }

                // If priorities are the same, sort by due date (soonest first)
                const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

                return dateA - dateB;
            });
        }

        return groupedTasks;
    }, [tasks, board]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );
    
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (over && active.id !== over.id) {
            const activeTaskIndex = tasks.findIndex(t => t.id === active.id);
            if (activeTaskIndex !== -1) {
                const newStatus = over.id as TaskStatus;
                
                if (board?.statuses.includes(newStatus) && tasks[activeTaskIndex].status !== newStatus) {
                     setTasks(prevTasks => {
                        const newTasks = [...prevTasks];
                        newTasks[activeTaskIndex] = { ...newTasks[activeTaskIndex], status: newStatus };
                        return newTasks;
                     });
                }
            }
        }
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
    };

    const handleTaskUpdate = async (updatedTask: Task) => {
        try {
            await updateTask(updatedTask);
            setTasks(currentTasks => currentTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setEditingTask(null);
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    if (!isClient) {
        return null; // Or a loading skeleton
    }
    
    if (!board) {
        notFound();
    }

    return (
        <div className="flex h-full flex-col">
            <Header title={board.name}>
                <Button asChild>
                    <Link href="/tasks/add">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Task
                    </Link>
                </Button>
            </Header>
            <main className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden p-4 md:p-6">
                <div className="mb-6 space-y-4">
                     <div>
                        <h2 className="text-2xl font-bold">Project Overview</h2>
                        <p className="text-muted-foreground">{board.description}</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">To Do</CardTitle>
                                <ListTodo className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projectStats.counts['To Do'] || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                                <Timer className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projectStats.counts['In Progress'] || 0}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Done</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projectStats.counts['Done'] || 0}</div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-destructive">Overdue</CardTitle>
                                <AlertCircle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive">{projectStats.overdue}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <div className="mb-1 flex justify-between text-sm text-muted-foreground">
                            <span>Overall Progress</span>
                            <span>{projectStats.progress}%</span>
                        </div>
                        <Progress value={projectStats.progress} className="h-2" />
                    </div>
                </div>
                <div className="flex-1 overflow-x-auto">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className={`grid h-full min-w-max grid-cols-1 gap-6 md:grid-cols-${columns.length}`}>
                            <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
                                {columns.map(column => (
                                    <KanbanColumn 
                                        key={column.id} 
                                        id={column.id} 
                                        title={column.title} 
                                        tasks={tasksByStatus[column.id as TaskStatus]}
                                        onEditTask={handleEditTask}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                        <DragOverlay>
                            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </main>
            {editingTask && (
                <EditTaskDialog
                    task={editingTask}
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleTaskUpdate}
                />
            )}
        </div>
    );
}
