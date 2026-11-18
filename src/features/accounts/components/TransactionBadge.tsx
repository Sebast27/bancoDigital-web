const typeStyles: Record<string, string> = {
    TRANSFER: 'bg-blue-100 text-blue-700',
    DEPOSIT: 'bg-green-100 text-green-700',
    WITHDRAWAL: 'bg-orange-100 text-orange-700',
};

const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    COMPLETED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
};

export function TypeBadge({ type }: { type: string }) {
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${typeStyles[type] ?? 'bg-slate-100 text-slate-700'}`}>
            {type}
        </span>
    );
}

export function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status] ?? 'bg-slate-100 text-slate-700'}`}>
            {status}
        </span>
    );
}