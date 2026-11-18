import { Skeleton } from '../../../components/ui/Skeleton';

export function AccountCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-8 w-48" />
        </div>
    );
}

export function TransactionsTableSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-slate-50">
                <Skeleton className="h-5 w-32" />
            </div>
            <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function AccountsListSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between px-2 py-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    );
}