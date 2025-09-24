
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
import { PlusCircle } from 'lucide-react';
import { tasks as initialTasks, type Task } from '@/lib/tasks';
import { boards as allBoards, type Board, type TaskStatus } from '@/lib/boards';
import { KanbanColumn } from '@/components/kanban-column';
import { TaskCard } from '@/components/task-card';
import { EditTaskDialog } from '@/components/edit-task-dialog';
import { updateTask } from '@/services/task-service';

export default function TaskBoardPage() {
    const params = useParams();
    const boardId = params.boardId as string;

    const [board, setBoard] = useState<Board | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        setIsClient(true);
        const currentBoard = allBoards.find(b => b.id === boardId);
        if (currentBoard) {
            setBoard(currentBoard);
            const boardTasks = initialTasks.filter(t => t.boardId === boardId);
            setTasks(boardTasks);
        }
    }, [boardId]);

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
            groupedTasks[status as TaskStatus].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
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
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6">
                 <div className="mb-4">
                    <p className="text-muted-foreground">Click on a task to edit it, or drag and drop to change its status.</p>
                </div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className={`grid h-full grid-cols-1 gap-6 md:grid-cols-${columns.length}`}>
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
