import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import CreateArticle from "@/features/admin/article/create";
import React from "react";

import "../dark-custom.css";
import { prisma } from "@/lib/prisma";

export default async function page() {
  const category = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <div className="flex flex-1 flex-col space-y-4 px-4 py-3">
      <div className="flex items-start justify-between">
        <Heading
          title="Create Article"
          description="Manage articles (Server side table functionalities.)"
        />
      </div>
      <Separator />
      <CreateArticle category={category} tags={tags} />
    </div>
  );
}
