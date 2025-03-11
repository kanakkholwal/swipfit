"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Fragment } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type * as z from "zod";
import { rawProductSchema } from "~/constants/product";
import { saveProduct } from "~/actions/products";

// Infer the TypeScript type from the schema
type RawProductFormValues = z.infer<typeof rawProductSchema>;

export default function ProductForm() {
  const form = useForm<RawProductFormValues>({
    resolver: zodResolver(rawProductSchema),
    defaultValues: {
      images: [{ url: "", alt: "" }],
      title: "",
      description: "",
      productUrl: "",
      price: {
        currency: "INR",
        value: 0,
      },
      brand: "",
      variants: {
        size: [],
      },
      markupMetadata: {
        sku: "",
      },
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });
  async function onSubmit(data: RawProductFormValues) {
    console.log("Form data", data);
    try {
      const response = await saveProduct(data);
      console.log(response);
    } catch (e) {
      console.log("errr", e);
    }
  }

  return (
    <Form {...form}>
      <div className="space-y-10 py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Add Product</h1>
          <p className="text-muted-foreground">
            Fill in the details to add a new product
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Product Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Value */}
          <FormField
            control={form.control}
            name="price.value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <div className="space-y-4 w-full">
                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <div className="flex items-center space-x-2 w-full">
                        <div className="flex flex-1 gap-2">
                          <FormField
                            control={form.control}
                            name={`images.${index}.url`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <Input placeholder="Image URL" {...field} />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`images.${index}.alt`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <Input placeholder="Alt Text" {...field} />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive_light"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X />
                        </Button>
                      </div>
                    </Fragment>
                  ))}
                  <Button
                    type="button"
                    onClick={() => append({ url: "", alt: "" })}
                  >
                    Add Image
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Product URL */}

          <FormField
            control={form.control}
            name="productUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product URL</FormLabel>
                <FormControl>
                  <Input placeholder="Product URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </Form>
  );
}
