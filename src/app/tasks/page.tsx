
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
import { KanbanColumn } from '@/components/kanban-column';
import { TaskCard } from '@/components/task-card';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done' | 'Cancelled';

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setTasks(initialTasks);
    }, []);

    const columns = useMemo(() => {
        return statuses.map(status => ({
            id: status,
            title: status,
        }));
    }, []);

    const tasksByStatus = useMemo(() => {
        const groupedTasks: Record<TaskStatus, Task[]> = {
            'To Do': [],
            'In Progress': [],
            'Done': [],
            'Cancelled': [],
        };
        tasks.forEach(task => {
            if (groupedTasks[task.status]) {
                groupedTasks[task.status].push(task);
            }
        });
        return groupedTasks;
    }, [tasks]);

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
                
                if (statuses.includes(newStatus) && tasks[activeTaskIndex].status !== newStatus) {
                     setTasks(prevTasks => {
                        const newTasks = [...prevTasks];
                        newTasks[activeTaskIndex] = { ...newTasks[activeTaskIndex], status: newStatus };
                        return newTasks;
                     });
                }
            }
        }
    };

    if (!isClient) {
        return null;
    }

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
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6">
                 <div className="mb-4">
                    <h2 className="text-2xl font-bold">Task Board</h2>
                    <p className="text-muted-foreground">Drag and drop tasks to change their status.</p>
                </div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
                         <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
                            {columns.map(column => (
                                <KanbanColumn 
                                    key={column.id} 
                                    id={column.id} 
                                    title={column.title} 
                                    tasks={tasksByStatus[column.id as TaskStatus]}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    <DragOverlay>
                        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                    </DragOverlay>
                </DndContext>
            </main>
        </div>
    );
}
