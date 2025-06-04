"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCategoryStore from "@/store/useCategory";
import { useEffect, useTransition } from "react";
import { saveCategory, updateCategory } from "./actions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1).max(50),
});

const FormDialog = () => {
  const context = useCategoryStore();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: context.currentRow?.name || "",
    },
  });

  useEffect(() => {
    if (context.currentRow) {
      form.setValue("name", context.currentRow.name);
    }
  }, [context.currentRow]);

  const onSaveData = () => {
    const formData = new FormData();
    formData.set("name", form.getValues("name"));

    if (context.dialog === "create") {
      startTransition(async () => {
        const res = await saveCategory(formData);

        if (res.success) {
          context.setOpen(false);

          form.reset();
        } else {
          console.log(res);
        }
      });
    } else {
      startTransition(async () => {
        const res = await updateCategory(formData, context.currentRow?.id);

        if (res.success) {
          context.setOpen(false);
          form.reset();
        } else {
          console.log(res);
        }
      });
    }
  };

  return (
    <Dialog
      open={context.open}
      onOpenChange={(state) => {
        context.setOpen(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{`${
            context.dialog == "create" ? "Add" : "Update"
          } New Category`}</DialogTitle>
          <DialogDescription>
            {`${
              context.dialog == "create" ? "Create new" : "Update"
            } Category here. `}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSaveData)}
              className="space-y-4 p-0.5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-right">
                      Nama Category
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama category"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3 mt-2" />
                  </div>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => context.setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="user-form" disabled={isPending}>
            {isPending ? "Loading..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
