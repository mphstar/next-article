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
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useAlertModal } from "@/store/alert-context";
import useTagStore from "@/store/useTag";
import { toast } from "sonner";
import { CategoryType } from "../category/column";
import { TagType } from "../tag/column";
import { deleteArticle } from "./actions";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ArticleType = {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: CategoryType;
  articleTags: {
    tag: TagType;
  }[];
  createdAt: string | Date;
};

export const columns: ColumnDef<ArticleType>[] = [
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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          className="gap-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Judul
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      return <span className="px-2">{cell.getValue<string>()}</span>;
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          className="gap-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kategori
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const category = cell.getValue<CategoryType>();
      return <span className="px-2">{category?.name}</span>;
    },
  },
  {
    accessorKey: "articleTags",
    header: "Tags",
    cell: ({ cell }) => {
      const tags = cell.getValue<{ tag: TagType }[]>();
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((item) => (
            <span
              key={item.tag.id}
              className="inline-flex items-center rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            >
              {item.tag.name}
            </span>
          ))}
        </div>
      );
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
      const context = useTagStore();

      const { showModal, setLoading, closeModal } = useAlertModal();

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/admin/articles/${payment.slug}`}>
                <DropdownMenuItem>
                  <IconEdit className="mr-1 h-4 w-4" /> Edit Data
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => {
                  showModal({
                    onConfirm: async () => {
                      setLoading(true);
                      const res = await deleteArticle(payment.id);

                      if (res.success) {
                        toast.success(res.message);
                        closeModal();
                      } else {
                        toast.error(res.message);
                        closeModal();
                      }

                      setLoading(false);
                    },
                  });
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
