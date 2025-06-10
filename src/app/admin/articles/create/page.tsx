import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import CreateArticle from "@/features/admin/article/create/create";
import React from "react";

import './dark-custom.css'


export default async function page() {

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Create Article"
            description="Manage articles (Server side table functionalities.)"
          />
        </div>
        <Separator />
        <CreateArticle />
        
      </div>
    </PageContainer>
  );
}
