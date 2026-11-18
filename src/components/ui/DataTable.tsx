import type { ReactNode } from 'react';

type Column<T> = {
    header: string;
    accessor: (item: T) => ReactNode;
    className?: string; // Para alinear texto (ej. text-right)
};

type DataTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
    isLoading?: boolean;
};

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    emptyMessage = 'No hay registros',
    isLoading,
}: DataTableProps<T>) {
    if (isLoading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando datos...</div>;
    }

    if (data.length === 0) {
        return <div className="p-8 text-center text-slate-500">{emptyMessage}</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i} className={`px-6 py-4 ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((item) => (
                        <tr key={keyExtractor(item)} className="hover:bg-slate-50/50 transition-colors">
                            {columns.map((col, i) => (
                                <td key={i} className={`px-6 py-4 ${col.className || ''}`}>
                                    {col.accessor(item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}