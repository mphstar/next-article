"use client"; // Jika pakai Next.js 13+ dengan App Router

import dynamic from "next/dynamic";
import { useEffect, useState, useTransition } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useTheme } from "next-themes";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryType } from "@/features/admin/category/column";
import { TagType } from "../tag/column";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addArticle, updateArticle } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArticleType } from "./column";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const formSchema = z.object({
  title: z.string().min(1).max(255),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1, "Pilih minimal 1 tag"),
  content: z.string().min(1),
});

export default function UpdateArticle({
  data,
  category,
  tags,
}: {
  data: ArticleType;
  category: CategoryType[];
  tags: TagType[];
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      title: data.title,
      category: data.category.id.toString(),
      tags: data.articleTags.map((item) => item.tag.id.toString()),
      content: data.content,
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // hindari render sebelum theme siap

  const onSaveData = () => {
    startTransition(async () => {
      const res = await updateArticle({
        id: data.id,
        title: form.getValues("title"),
        content: form.getValues("content"),
        category: {
          id: parseInt(form.getValues("category")),
        },
        tags: form.getValues("tags").map((item) => parseInt(item)),
      });

      if (res.success) {
        toast.success(res.message);

        form.reset();
        router.push("/admin/articles");
      } else {
        console.log(res);
        toast.error(res.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSaveData)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <div className="flex flex-col space-y-2 gap-3">
              <FormLabel className="">Judul</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan judul"
                  className=""
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage className="" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <div className="flex flex-col space-y-2 gap-3">
              <FormLabel className="">Category</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {category.map((item, index) => (
                      <SelectItem key={index} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <div className="flex flex-col space-y-2 gap-3">
              <FormLabel className="">Tags</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    const selectedTag = value ? [value] : [];
                    field.onChange([
                      ...field.value,
                      ...selectedTag.filter((id) => !field.value.includes(id)),
                    ]);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags.map((item, index) => (
                      <SelectItem key={index} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              {field.value.length > 0 && (
                <div className="flex gap-2">
                  {field.value.map((tagId) => {
                    const tag = tags.find((t) => t.id.toString() === tagId);
                    return (
                      <span
                        key={tagId}
                        className="inline-flex items-center px-2 py-1 text-sm font-medium bg-gray-200 dark:bg-gray-800 rounded-full"
                      >
                        {tag?.name}
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() =>
                            field.onChange(
                              field.value.filter((id) => id !== tagId)
                            )
                          }
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <FormMessage className="" />
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <div className="flex flex-col space-y-2 gap-3">
              <FormLabel>Content</FormLabel>
              <div data-color-mode={resolvedTheme} className="">
                <MDEditor
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  height={500}
                />
              </div>
              <FormMessage className="" />
            </div>
          )}
        />

        <Button className="w-fit" disabled={isPending}>
          {isPending ? "Loading.." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
