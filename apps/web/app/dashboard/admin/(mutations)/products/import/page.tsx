"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { fetchAndParseProductPage } from "~/actions/products.import";

export default function ProductImportPage() {
  const { toast } = useToast();

  const [url, setUrl] = useState("");

  const handleImport = async (url: string) => {
    try {
      const product = await fetchAndParseProductPage(url);
      if (product) {
        // Handle the product data
        console.log(product);
        toast({
          title: "Product data imported successfully",
        });
      } else {
        toast({
          title: "Failed to import product data",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to import product data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-10">
      <div className="mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Import Product</h1>
          <p className="text-muted-foreground">
            Upload your product data from product page url
          </p>
        </div>

        <Card className="p-6 flex gap-3">
          <Input
            type="url"
            placeholder="Product Page URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={() => handleImport(url)}>Import</Button>
        </Card>
      </div>
    </div>
  );
}
