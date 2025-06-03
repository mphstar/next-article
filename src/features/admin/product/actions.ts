"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CategorySchema = z.object({
  name: z
    .string()
    .min(1, "Nama kategori wajib diisi")
    .max(50, "Terlalu panjang"),
});

export const saveCategory = async (formData: FormData) => {
  const values = {
    name: formData.get("name")?.toString() ?? "",
  };

  const result = CategorySchema.safeParse(values);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Validation failed.",
      errors,
    };
  }

  const { name } = result.data;

  try {
    await prisma.category.create({
      data: {
        name,
      },
    });

    revalidatePath("/admin/category");

    return {
      success: true,
      message: "Category saved successfully.",
    };
  } catch (error) {
    console.error("Error saving category:", error);

    return {
      success: false,
      message: "Failed to save category.",
    };
  }
};

export const updateCategory = async (formData: FormData, id: number) => {
  const values = {
    name: formData.get("name")?.toString() ?? "",
  };

  const result = CategorySchema.safeParse(values);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Validation failed.",
      errors,
    };
  }

  const { name } = result.data;

  try {
    await prisma.category.update({
      data: {
        name,
      },
      where: {
        id: id,
      },
    });

    revalidatePath("/admin/category");

    return {
      success: true,
      message: "Category updated successfully.",
    };
  } catch (error) {
    console.error("Error updating category:", error);

    return {
      success: false,
      message: "Failed to update category.",
    };
  }
};

export const deleteCategory = async (id: number) => {
  try {
    await prisma.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/category");

    return {
      success: true,
      message: "Category deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting category:", error);

    return {
      success: false,
      message: "Failed to delete category.",
    };
  }
};
