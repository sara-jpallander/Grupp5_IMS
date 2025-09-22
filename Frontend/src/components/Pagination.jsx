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
  
  const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
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
        {pages.map(p => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              isActive={p === page}
              onClick={e => { e.preventDefault(); onSetPage(p); }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
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
