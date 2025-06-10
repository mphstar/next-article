"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { titleToSlug } from "@/lib/utils";

export const addArticle = async (ar: {
  title: string;
  content: string;
  category: {
    id: number;
  };
  tags: number[];
}) => {
  try {
    await prisma.article.create({
      data: {
        title: ar.title,
        slug: titleToSlug(ar.title),
        content: ar.content,
        categoryId: ar.category.id,
        articleTags: {
          createMany: {
            data: [
              ...ar.tags.map((item) => ({
                tagId: item,
              })),
            ],
          },
        },
      },
    });

    revalidatePath("/admin/articles");

    return {
      success: true,
      message: "Article saved successfully.",
    };
  } catch (error) {
    console.error("Error saving article:", error);

    return {
      success: false,
      message: "Failed to save article.",
    };
  }
};

export const updateArticle = async (ar: {
  id: number;
  title: string;
  content: string;
  category: {
    id: number;
  };
  tags: number[];
}) => {
  try {
    // Remove existing tags
    await prisma.articleTag.deleteMany({
      where: { articleId: ar.id },
    });

    // Update article and add new tags
    await prisma.article.update({
      where: { id: ar.id },
      data: {
        title: ar.title,
        slug: titleToSlug(ar.title),
        content: ar.content,
        categoryId: ar.category.id,
        articleTags: {
          createMany: {
            data: [
              ...ar.tags.map((item) => ({
                tagId: item,
              })),
            ],
          },
        },
      },
    });

    revalidatePath("/admin/articles");

    return {
      success: true,
      message: "Article updated successfully.",
    };
  } catch (error) {
    console.error("Error updating article:", error);

    return {
      success: false,
      message: "Failed to update article.",
    };
  }
};

export const deleteArticle = async (id: number) => {
  try {
    await prisma.article.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/articles");

    return {
      success: true,
      message: "Article deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting article:", error);

    return {
      success: false,
      message: "Failed to delete article.",
    };
  }
};

export const deleteSelectedArticle = async (id: number[]) => {
  try {
    await prisma.article.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });

    revalidatePath("/admin/articles");

    return {
      success: true,
      message: "Article deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting article:", error);

    return {
      success: false,
      message: "Failed to delete article.",
    };
  }
};
