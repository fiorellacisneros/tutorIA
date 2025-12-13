'use client';

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <span className="text-lg sm:text-xl font-semibold text-gray-900">TutorIA</span>
        </Link>
        
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link
            href="/profesor"
            className="text-xs sm:text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Profesor
          </Link>
          <Link
            href="/director"
            className="text-xs sm:text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Director
          </Link>
        </div>
      </div>
    </nav>
  );
}

