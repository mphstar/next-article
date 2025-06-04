"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { HeadTablePagination } from "@/components/ui/head-table";
import { DataTablePagination } from "@/components/ui/pagination-control";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useAlertModal } from "@/store/alert-context";
import { deleteSelectedTag } from "./actions";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const { showModal, setLoading, closeModal } = useAlertModal();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: (rowSelection) => {
      setRowSelection(rowSelection);
    },
    state: {
      sorting,
      rowSelection,
    },
  });

  const handleDeleteSelectedRows = () => {
    const general = table.getFilteredSelectedRowModel().rows.map((row) => {
      const { id } = row.original as { id: number };
      return id;
    });

    showModal({
      onConfirm: async () => {
        setLoading(true);

        const res = await deleteSelectedTag(general);

        if (res.success) {
          table.setRowSelection({});
          toast.success(res.message);
          closeModal();
        } else {
          toast.error(res.message);
          closeModal();
        }

        setLoading(false);
      },
    });
  };

  return (
    <div className="">
      <HeadTablePagination table={table} action={<div></div>} />

      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="my-4 flex items-center justify-between rounded-md border bg-accent text-accent-foreground px-4 py-2">
          <span className="text-sm font-semibold">{`Selected ${
            table.getFilteredSelectedRowModel().rows.length
          } Data`}</span>

          <Button
            variant="destructive"
            size="sm"
            className="gap-1"
            onClick={() => {
              handleDeleteSelectedRows();
            }}
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
        </div>
      )}

      <div className="my-4 flex w-full flex-col rounded-md border p-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
