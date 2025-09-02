// components/PaginationControls.tsx
type Props = {
  pageIndex: number; // 1-based
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

export default function PaginationControls({
  pageIndex,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  className,
}: Props) {
  return (
    <div className={`flex items-center justify-between ${className ?? ''}`}>
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className='inline-flex items-center rounded-xl border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50'
      >
        ← Prev
      </button>

      <span className='text-sm text-muted-foreground'>Page {pageIndex}</span>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className='inline-flex items-center rounded-xl border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50'
      >
        Next →
      </button>
    </div>
  );
}
