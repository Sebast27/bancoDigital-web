const statusStyles: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: 'Activa', className: 'bg-green-100 text-green-700' },
    FROZEN: { label: 'Congelada', className: 'bg-yellow-100 text-yellow-700' },
    CLOSED: { label: 'Cerrada', className: 'bg-red-100 text-red-700' },
};

export function AccountStatusBadge({ status }: { status: string }) {
    const s = statusStyles[status] ?? { label: status, className: 'bg-slate-100 text-slate-700' };
    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${s.className}`}>{s.label}</span>
    );
}