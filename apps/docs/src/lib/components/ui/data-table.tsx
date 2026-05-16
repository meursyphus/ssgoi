"use client";

/**
 * 서버사이드 페이지네이션 DataTable
 *
 * comwit query 결과를 data에 그대로 넘기고, onPageChange에 load action을 연결한다.
 *
 * @example
 * ```tsx
 * const { products, actions } = useProduct((s) => ({
 *   products: s.products,
 *   actions: s.actions,
 * }))
 *
 * <DataTable
 *   columns={columns}
 *   data={products}
 *   onPageChange={(page) => actions.loadProducts(page)}
 *   onRowClick={(item) => router.push(`/products/${item.id}`)}
 *   toolbar={<div>필터, 검색, 버튼 등 자유 배치</div>}
 * />
 * ```
 */

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/components/ui/table";
import { Button } from "@/lib/components/ui/button";

/** server/repository/types.ts의 Pageable<T>와 동일한 shape */
interface Pageable<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** comwit query 결과의 shape */
interface QueryData<T> {
  data: Pageable<T>;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  /** comwit query 결과를 그대로 넘긴다 */
  data: QueryData<TData>;
  /** 페이지 변경 시 호출 — state action의 load 함수 연결 */
  onPageChange: (page: number) => void;
  /** 행 클릭 시 호출 — 해당 행의 데이터를 넘긴다 */
  onRowClick?: (item: TData) => void;
  /** 빈 데이터 메시지 */
  emptyMessage?: string;
  /** 테이블 상단 영역 — 필터, 검색, 버튼 등 자유 배치 */
  toolbar?: React.ReactNode;
}

function DataTable<TData, TValue>({
  columns,
  data: queryData,
  onPageChange,
  onRowClick,
  emptyMessage = "데이터가 없습니다.",
  toolbar,
}: DataTableProps<TData, TValue>) {
  const { data: pageable, isLoading, isFetching } = queryData;
  const { items, total, totalPages, limit } = pageable;
  const [page, setPage] = useState(pageable.page);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: items,
    columns,
    state: {
      pagination: { pageIndex: 0, pageSize: limit },
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const rangeStart = total > 0 ? (page - 1) * limit + 1 : 0;
  const rangeEnd = Math.min(page * limit, total);

  const goToPage = (next: number) => {
    setPage(next);
    onPageChange(next);
  };

  // 첫 로딩
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-300 bg-card overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-300 bg-card overflow-hidden">
      {/* 툴바 — 필터, 검색, 버튼 등 자유 배치 */}
      {toolbar && <div className="px-4 py-3">{toolbar}</div>}

      {/* 테이블 */}
      <div
        className={
          isFetching
            ? "opacity-50 pointer-events-none transition-opacity"
            : "transition-opacity"
        }
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                  className={
                    onRowClick ? "cursor-pointer active:bg-gray-200" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-400"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50">
        <p className="text-gray-500 text-xs tabular-nums">
          {total > 0 ? `${rangeStart}–${rangeEnd} / ${total}건` : "0건"}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => goToPage(page - 1)}
            disabled={!canPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs tabular-nums min-w-[3.5rem] text-center text-gray-500">
            {page} / {totalPages || 1}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => goToPage(page + 1)}
            disabled={!canNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DataTable };
export type { DataTableProps, QueryData, Pageable };
