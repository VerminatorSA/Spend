
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Settings, Search } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SearchInput } from './search-input';

export function HeaderActions() {
    return (
        <TooltipProvider>
            <div className="flex items-center gap-2">
                 <SearchInput />
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/suggestions">
                                <Rocket className="h-5 w-5 text-accent" />
                                <span className="sr-only">Turbo</span>
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Turbo Suggestions</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/settings">
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Settings</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    )
}
