import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Pagination({ className, page, hasNextPage, onSetPage, totalCount, limit }) {
  const totalPages = totalCount ? Math.ceil(totalCount / limit) : page + (hasNextPage ? 1 : 0);
  
  // Only show 5 pages at a time, with ellipsis
  let pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first and last
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);
    pages = [1];
    if (left > 2) {
      pages.push('left-ellipsis');
    }
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }
    if (right < totalPages - 1) {
      pages.push('right-ellipsis');
    }
    pages.push(totalPages);
  }

  return (
    <ShadPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => { e.preventDefault(); if (page > 1) onSetPage(page - 1); }}
            aria-disabled={page === 1}
            disabled={page === 1}
          />
        </PaginationItem>
        {pages.map((p, idx) => {
          if (p === 'left-ellipsis' || p === 'right-ellipsis') {
            return (
              <PaginationItem key={p + idx}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={e => { e.preventDefault(); onSetPage(p); }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => { e.preventDefault(); if (hasNextPage) onSetPage(page + 1); }}
            aria-disabled={!hasNextPage}
            disabled={!hasNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
}
