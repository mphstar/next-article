"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useTagStore from "@/store/useTag";
import { IconPlus } from "@tabler/icons-react";
import React from "react";

const ButtonAddProduct = () => {
  const store = useTagStore();
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
