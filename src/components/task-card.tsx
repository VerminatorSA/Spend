
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type Task } from '@/lib/tasks';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

const priorityMap: Record<Task['priority'], { variant: 'destructive' | 'outline' | 'secondary'; icon: React.ElementType }> = {
    'High': { variant: 'destructive', icon: ArrowUp },
    'Medium': { variant: 'outline', icon: ArrowRight },
    'Low': { variant: 'secondary', icon: ArrowDown },
};

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityConfig = priorityMap[task.priority];
  const assigneeInitial = task.assignee.name.split(' ').map(n => n[0]).join('');

  if (isDragging) {
    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="h-[156px] rounded-lg border-2 border-primary bg-card" 
        />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'rounded-lg bg-card text-card-foreground shadow-sm transition-shadow',
        isOverlay && 'ring-2 ring-primary'
      )}
    >
        <CardHeader>
            <CardTitle className="text-base font-medium">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <Badge variant={priorityConfig.variant} className={priorityConfig.variant === 'outline' ? 'border-yellow-500 text-yellow-500' : ''}>
                    <priorityConfig.icon className="mr-1 h-3 w-3" />
                    {task.priority}
                </Badge>
                {task.dueDate && (
                    <span className="text-xs text-muted-foreground">
                        {format(new Date(task.dueDate), 'MMM d')}
                    </span>
                )}
            </div>
            <div className="flex items-center justify-end">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{assigneeInitial}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </CardContent>
    </div>
  );
}
