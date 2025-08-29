
'use client';

import { Megaphone } from 'lucide-react';

const messages = [
  "Welcome! I'm Spencer, your AI-powered procurement partner.",
  'New Feature: Generate reports to gain insights into your operations.',
  "Tip: Ask me for intelligent item recommendations.",
  'Press Ctrl+B to toggle the sidebar at any time.',
];

export function AiTicker() {
  return (
    <div className="relative flex overflow-hidden bg-sidebar-accent/20 text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-sidebar-accent/50">
        <Megaphone className="h-4 w-4" />
      </div>
      <div className="animate-marquee-infinite flex min-w-full shrink-0 items-center justify-around">
        {messages.map((message, index) => (
          <p key={index} className="mx-12 whitespace-nowrap text-sm">
            {message}
          </p>
        ))}
      </div>
    </div>
  );
}
