"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addTag = async (formData: FormData) => {
  const values = {
    name: formData.get("name")?.toString() ?? "",
  };

  const { name } = values;

  try {
    await prisma.tag.create({
      data: {
        name,
      },
    });

    revalidatePath("/admin/tag");

    return {
      success: true,
      message: "Tag saved successfully.",
    };
  } catch (error) {
    console.error("Error saving tag:", error);

    return {
      success: false,
      message: "Failed to save tag.",
    };
  }
};

export const updateTag = async (formData: FormData, id: number) => {
  const values = {
    name: formData.get("name")?.toString() ?? "",
  };

  const { name } = values;

  try {
    await prisma.tag.update({
      data: {
        name,
      },
      where: {
        id: id,
      },
    });

    revalidatePath("/admin/tag");

    return {
      success: true,
      message: "Tag updated successfully.",
    };
  } catch (error) {
    console.error("Error updating tag:", error);

    return {
      success: false,
      message: "Failed to update tag.",
    };
  }
};

export const deleteTag = async (id: number) => {
  try {
    await prisma.tag.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/tag");

    return {
      success: true,
      message: "Tag deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting tag:", error);

    return {
      success: false,
      message: "Failed to delete tag.",
    };
  }
};

export const deleteSelectedTag = async (id: number[]) => {
  try {
    await prisma.tag.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });

    revalidatePath("/admin/tag");

    return {
      success: true,
      message: "Tag deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting tag:", error);

    return {
      success: false,
      message: "Failed to delete tag.",
    };
  }
};
