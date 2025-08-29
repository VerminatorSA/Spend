
'use client';

import { Megaphone } from 'lucide-react';

const messages = [
  "Welcome to Spend! Your all-in-one procurement solution.",
  "New Feature: You can now create tasks directly from chat with Spencer.",
  "Did you know? You can press Ctrl+B to toggle the sidebar.",
  "Check out the new graphical reports on the Dashboard page."
];

export function AiTicker() {
  return (
    <div className="group/ticker relative flex h-8 items-center overflow-hidden bg-primary/10 text-primary">
      <div className="absolute inset-y-0 left-0 flex items-center px-2">
        <Megaphone className="h-4 w-4" />
      </div>
      <div className="animate-ticker-x group-hover/ticker:pause ml-8 flex min-w-full shrink-0 items-center justify-start">
        {messages.map((message, index) => (
          <div key={index} className="mx-4 whitespace-nowrap text-sm">
            <span>{message}</span>
          </div>
        ))}
      </div>
       <div className="animate-ticker-x group-hover/ticker:pause ml-8 flex min-w-full shrink-0 items-center justify-start" aria-hidden="true">
        {messages.map((message, index) => (
          <div key={index} className="mx-4 whitespace-nowrap text-sm">
            <span>{message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
