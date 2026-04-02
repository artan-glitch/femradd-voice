export default function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-card">
      <div className="aspect-[16/10] bg-muted animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="w-16 h-5 bg-muted animate-pulse rounded-full" />
          <div className="w-20 h-5 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-muted animate-pulse rounded w-full" />
          <div className="h-5 bg-muted animate-pulse rounded w-3/4" />
        </div>
        <div className="h-4 bg-muted animate-pulse rounded w-full" />
        <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
        <div className="flex items-center gap-2 mt-4">
          <div className="w-7 h-7 bg-muted animate-pulse rounded-full" />
          <div className="h-3 bg-muted animate-pulse rounded w-24" />
        </div>
      </div>
    </div>
  );
}
