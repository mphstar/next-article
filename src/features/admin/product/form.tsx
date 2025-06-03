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
import { use, useEffect, useState, useTransition } from "react";
import { saveCategory, updateCategory } from "./actions";
import InputError from "@/components/ui/input-error";
import { useFormState } from "@/hooks/use-form";

const FormDialog = () => {
  const context = useCategoryStore();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<{ name?: string[]; _form?: string[] }>(
    {}
  );

  const form = useFormState({
    name: "",
  });

  useEffect(() => {
    if (context.currentRow) {
      form.setValues({
        name: context.currentRow.name || "",
      });
    }
  }, [context.currentRow]);

  const onSaveData = () => {
    const formData = new FormData();
    formData.set("name", form.values.name);

    if (context.dialog === "create") {
      startTransition(async () => {
        const res = await saveCategory(formData);

        if (res?.errors) {
          setErrors(res.errors);
          return;
        }

        if (res.success) {
          context.setOpen(false);
          setErrors({});
          form.reset();
        } else {
          console.log(res);
        }
      });
    } else {
      startTransition(async () => {
        const res = await updateCategory(formData, context.currentRow?.id);

        if (res?.errors) {
          setErrors(res.errors);
          return;
        }

        if (res.success) {
          context.setOpen(false);
          setErrors({});
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
          <form id="user-form" action={onSaveData} className="space-y-4 p-0.5">
            <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
              <Label className="col-span-2 text-right">Nama Category</Label>
              <Input
                placeholder="Masukkan nama category"
                name="name"
                className="col-span-4"
                autoComplete="off"
                value={form.values.name}
                onChange={(e) => {
                  form.handleChange(e);
                }}
              />
              {errors.name && (
                <InputError
                  className="col-span-4 col-start-3 mt-2"
                  message={errors.name.join(", ")}
                />
              )}
            </div>
          </form>
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
