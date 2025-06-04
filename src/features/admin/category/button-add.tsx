"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useCategoryStore from "@/store/useCategory";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

const ButtonAddProduct = () => {
  const store = useCategoryStore();
  return (
    <Button
      onClick={() => {
        store.setCurrentRow(undefined);
        store.setDialog("create");
        store.setOpen(true);
      }}
      className={cn(buttonVariants(), "text-xs md:text-sm")}
    >
      <IconPlus className="mr-2 h-4 w-4" /> Add New
    </Button>
  );
};

export default ButtonAddProduct;
