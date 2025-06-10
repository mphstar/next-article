"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useTagStore from "@/store/useTag";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const ButtonAddProduct = () => {
  return (
    <Link href={"/admin/articles/create"}>
      <Button className={cn(buttonVariants(), "text-xs md:text-sm")}>
        <IconPlus className="mr-2 h-4 w-4" /> Add New
      </Button>
    </Link>
  );
};

export default ButtonAddProduct;
