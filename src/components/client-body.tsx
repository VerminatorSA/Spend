'use client';

import { ReactNode } from 'react';

export function ClientBody({ children }: { children: ReactNode }) {
  return (
    <body className="font-sans antialiased" suppressHydrationWarning>
      {children}
    </body>
  );
}
