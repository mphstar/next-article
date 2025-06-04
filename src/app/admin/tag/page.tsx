import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import ButtonAddProduct from "@/features/admin/tag/button-add";
import { columns } from "@/features/admin/tag/column";
import { DataTable } from "@/features/admin/tag/data-table";
import FormDialog from "@/features/admin/tag/form";
import { PrismaClient } from "@/generated/prisma";
import React from "react";

const prisma = new PrismaClient();

export default async function page() {
  const tags = await prisma.tag.findMany({
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
            title="Tag"
            description="Manage tags (Server side table functionalities.)"
          />
          <ButtonAddProduct />
        </div>
        <Separator />

        <DataTable columns={columns} data={tags} />
      </div>
    </PageContainer>
  );
}
