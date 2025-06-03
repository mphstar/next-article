import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import ButtonAddProduct from "@/features/admin/product/button-add";
import { columns } from "@/features/admin/product/column";
import { DataTable } from "@/features/admin/product/data-table";
import FormDialog from "@/features/admin/product/form";
import { PrismaClient } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React, { Suspense } from "react";

const prisma = new PrismaClient();

export default async function page() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageContainer>
      <FormDialog />
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Category"
            description="Manage categories (Server side table functionalities.)"
          />
          <ButtonAddProduct />
        </div>
        <Separator />

        <Suspense
          fallback={
            <p className="text-muted-foreground">Loading categories...</p>
          }
        >
          <DataTable columns={columns} data={categories} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
