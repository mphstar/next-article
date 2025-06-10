"use client"; // Jika pakai Next.js 13+ dengan App Router

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const formSchema = z.object({
  judul: z.string().min(1).max(50),
  content: z.string().min(1),
});

export default function CreateArticle() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      judul: "",
      content: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // hindari render sebelum theme siap

  const onSaveData = () => {
    console.log(form.getValues("content"));
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSaveData)}
      >
        <FormField
          control={form.control}
          name="judul"
          render={({ field }) => (
            <div className="flex flex-col space-y-2 gap-3">
              <FormLabel className="">Judul</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan judul"
                  className="col-span-4"
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

        <Button className="w-fit">Save</Button>
      </form>
    </Form>
  );
}
