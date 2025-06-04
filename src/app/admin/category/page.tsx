import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import ButtonAddProduct from "@/features/admin/category/button-add";
import { columns } from "@/features/admin/category/column";
import { DataTable } from "@/features/admin/category/data-table";
import FormDialog from "@/features/admin/category/form";
import { PrismaClient } from "@/generated/prisma";
import React, { Suspense } from "react";

const prisma = new PrismaClient();

export default async function page() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-4">
        <FormDialog />
        <div className="flex items-start justify-between">
          <Heading
            title="Category"
            description="Manage categories (Server side table functionalities.)"
          />
          <ButtonAddProduct />
        </div>
        <Separator />

        <DataTable columns={columns} data={categories} />
      </div>
    </PageContainer>
  );
}
