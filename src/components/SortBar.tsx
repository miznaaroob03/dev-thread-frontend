'use client';
import { Flame, Clock } from 'lucide-react';

interface SortBarProps {
  currentSort: 'latest' | 'popular';
  onSortChange: (sort: 'latest' | 'popular') => void;
}

export default function SortBar({ currentSort, onSortChange }: SortBarProps) {
  return (
    <div className="bg-white p-2 rounded border border-gray-300 shadow-sm flex items-center gap-2 mb-4">
      {/* LATEST / NEW BUTTON */}
      <button
        onClick={() => onSortChange('latest')}
        className={`flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
          currentSort === 'latest'
            ? 'bg-gray-100 text-orange-600'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Clock size={16} />
        New
      </button>

      {/* POPULAR / HOT BUTTON */}
      <button
        onClick={() => onSortChange('popular')}
        className={`flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
          currentSort === 'popular'
            ? 'bg-gray-100 text-blue-600'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Flame size={16} />
        Popular
      </button>
    </div>
  );
}