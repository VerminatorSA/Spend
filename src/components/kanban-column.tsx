
'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { type Task } from '@/lib/tasks';
import { TaskCard } from './task-card';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export function KanbanColumn({ id, title, tasks, onEditTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex h-full w-[320px] flex-col rounded-lg bg-muted/50"
    >
      <h3 className="p-4 text-lg font-semibold tracking-tight text-foreground">
        {title} ({tasks.length})
      </h3>
      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
          ))}
          {tasks.length === 0 && (
            <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-muted">
              <p className="text-sm text-muted-foreground">No tasks</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
