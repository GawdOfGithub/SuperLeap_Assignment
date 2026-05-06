import { cn } from '@/lib/utils';
import React from 'react';
import { Users } from 'lucide-react';

export const Logo = () => {
  return (
    <a href="/">
      <div className="hover:opacity-75 transition items-center justify-center gap-x-2 flex">
        <Users className="h-6 w-6 text-indigo-600" />
        <p className={cn('text-lg text-neutral-800 pb-1 font-bold')}>LeadFlow</p>
      </div>
    </a>
  );
};
