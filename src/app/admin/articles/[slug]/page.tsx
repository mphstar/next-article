import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import UpdateArticle from "@/features/admin/article/update";
import { prisma } from "@/lib/prisma";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function page({ params }: PageProps) {
  const data = await prisma.article.findUnique({
    where: {
      slug: params.slug,
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

  const category = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  if (!data) {
    return <div>Article not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 px-4 py-3">
      <div className="flex items-start justify-between">
        <Heading
          title="Update Article"
          description="Manage articles (Server side table functionalities.)"
        />
      </div>
      <Separator />
      <UpdateArticle data={data} category={category} tags={tags} />
    </div>
  );
}
