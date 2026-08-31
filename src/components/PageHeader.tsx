import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, badge, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sora tracking-tight text-[#10367D]">
            {title}
          </h1>
          {badge && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/20">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm font-medium text-[#1A4594]/85 mt-1 font-jakarta">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
