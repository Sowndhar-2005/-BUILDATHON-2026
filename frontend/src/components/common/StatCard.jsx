import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', trend }) {
  const colorMap = {
    brand: 'text-brand-400 from-brand-500/20 to-brand-500/5 border-brand-500/30',
    emerald: 'text-emerald-400 from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
    amber: 'text-amber-400 from-amber-500/20 to-amber-500/5 border-amber-500/30',
    rose: 'text-rose-400 from-rose-500/20 to-rose-500/5 border-rose-500/30',
    purple: 'text-purple-400 from-purple-500/20 to-purple-500/5 border-purple-500/30',
  };

  const currentTheme = colorMap[color] || colorMap.brand;

  return (
    <div className="glass-card p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentTheme} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">{trend.label}</span>
          <span className={`font-semibold ${trend.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}

export function RiskBadge({ level, score }) {
  const badgeConfig = {
    low: {
      label: 'Low Risk',
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400'
    },
    medium: {
      label: 'Moderate',
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400'
    },
    high: {
      label: 'High Risk',
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      dot: 'bg-orange-400'
    },
    critical: {
      label: 'Critical Alert',
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
      dot: 'bg-rose-400'
    }
  };

  const cfg = badgeConfig[level?.toLowerCase()] || badgeConfig.low;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      <span>{cfg.label}</span>
      {score !== undefined && <span className="opacity-75 font-mono">({score}%)</span>}
    </span>
  );
}

export function LoadingSpinner({ text = "Loading Academic Engine..." }) {
  return (
    <div className="min-h-[250px] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-10 h-10 border-4 border-slate-800 border-t-brand-500 rounded-full animate-spin mb-3"></div>
      <p className="text-sm font-medium text-slate-400">{text}</p>
    </div>
  );
}
