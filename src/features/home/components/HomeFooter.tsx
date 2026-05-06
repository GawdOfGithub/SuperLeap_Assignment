import React from 'react';
import { Button } from '@/ui/button';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HomeFooter() {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t border bg-slate-100">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <a href="/">
          <div className="hover:opacity-75 transition items-center justify-center gap-x-2 flex">
            <Users className="h-6 w-6 text-indigo-600" />
            <p className={cn('text-lg text-neutral-800 pb-1 font-bold')}>LeadFlow</p>
          </div>
        </a>
        <div className="space-x-4 flex items-center">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">
            Terms of Service
          </Button>
        </div>
      </div>
    </div>
  );
}
