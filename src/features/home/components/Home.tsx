import React from 'react';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import { Button } from '@/ui/button';
import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-indigo-100 text-indigo-700 rounded-full uppercase font-poppins-bold">
          <Users className="h-6 w-6 mr-2" />
          Lead Management CRM
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6 font-poppins-bold">
          LeadFlow helps you close
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 rounded-md py-5 w-fit font-poppins-bold">
          more deals, faster.
        </div>
      </div>
      <div className={cn('text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto')}>
        Track leads through your sales pipeline from first contact to conversion. Search, filter, and manage every opportunity in one place.
      </div>
      <Button className="mt-6 bg-indigo-600 text-white hover:bg-indigo-700" size="lg">
        <Link to="/leads">Go to Leads →</Link>
      </Button>
    </div>
  );
}
