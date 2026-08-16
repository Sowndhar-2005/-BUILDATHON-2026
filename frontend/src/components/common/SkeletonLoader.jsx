import React from 'react';

export function SkeletonCard({ lines = 3, hasButton = true }) {
  return (
    <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        ))}
      </div>
      {hasButton && (
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/4 pt-2"></div>
      )}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="glass-panel p-4 rounded-2xl animate-pulse space-y-3">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="h-4 bg-slate-200 dark:bg-slate-800 rounded flex-1"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6"></div>
      </div>
      <div className="h-52 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl flex items-end justify-between p-4 gap-2">
        <div className="w-12 bg-slate-300 dark:bg-slate-700 h-2/3 rounded-t"></div>
        <div className="w-12 bg-slate-300 dark:bg-slate-700 h-4/5 rounded-t"></div>
        <div className="w-12 bg-slate-300 dark:bg-slate-700 h-1/2 rounded-t"></div>
        <div className="w-12 bg-slate-300 dark:bg-slate-700 h-3/4 rounded-t"></div>
        <div className="w-12 bg-slate-300 dark:bg-slate-700 h-5/6 rounded-t"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
