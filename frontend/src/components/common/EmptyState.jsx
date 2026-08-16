import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ 
  icon: Icon = Inbox, 
  title = "No Data Available", 
  description = "There are no records to display at this time.", 
  actionText, 
  onAction 
}) {
  return (
    <div className="text-center py-12 px-4 glass-panel rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{description}</p>
      {actionText && (
        <button onClick={onAction} className="btn-primary !py-2 !px-4 text-xs mt-2">
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
