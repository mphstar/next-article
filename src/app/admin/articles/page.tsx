import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/features/admin/article/column";
import ButtonAddProduct from "@/features/admin/article/button-add";
import { DataTable } from "@/features/admin/article/data-table";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function page() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      articleTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-1 flex-col space-y-4 py-3 px-4">
      <div className="flex items-start justify-between">
        <Heading
          title="Articles"
          description="Manage articles (Server side table functionalities.)"
        />
        <ButtonAddProduct />
      </div>
      <Separator />

      <div className="w-full">
        <DataTable columns={columns} data={articles} />
      </div>
    </div>
  );
}
