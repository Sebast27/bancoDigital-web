import type { ReactNode } from 'react';

type Props = {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
};

export function EmptyState({ title, description, icon, action }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="text-slate-400 mb-3">{icon}</div>}
            <h3 className="text-lg font-medium text-slate-700">{title}</h3>
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}