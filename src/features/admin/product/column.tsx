"use client";

import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCategoryStore from "@/store/useCategory";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { deleteCategory } from "./actions";
import { useState, useTransition } from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryType = {
  id: number;
  name: string;
  createdAt: string | Date;
};

export const columns: ColumnDef<CategoryType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "rowNumber",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="gap-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      return <span className="px-2">{cell.getValue<string>()}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<string>());
      return <span>{date.toLocaleDateString("id-ID")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      const context = useCategoryStore();
      const [isPending, startTransition] = useTransition();

      const [open, setOpen] = useState(false);

      return (
        <>
          <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={() => {
              startTransition(async () => {
                const res = await deleteCategory(payment.id);

                if (res.success) {
                  setOpen(false);
                } else {
                  console.log(res);
                }
              });
            }}
            loading={isPending}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  context.setDialog("update");
                  context.setCurrentRow(payment);
                  context.setOpen(true);
                }}
              >
                <IconEdit className="mr-1 h-4 w-4" /> Edit Data
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                }}
              >
                <IconTrash className="mr-1 h-4 w-4" /> Delete Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
