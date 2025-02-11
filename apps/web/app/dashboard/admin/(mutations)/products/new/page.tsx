"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { type Product, productSchema, PRODUCT_CATEGORIES, SUPPORTED_IMAGE_TYPES, MAX_FILE_SIZE } from "~/types/product"
import { ImagePlus, Loader2, Save, X } from "lucide-react"

export default function AddProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const { toast } = useToast()

  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      quantity: 0,
      description: "",
      category: "",
      images: [],
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (imageFiles.length + files.length > 5) {
      toast({
        title: "Error",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      })
      return
    }

    const invalidFiles = files.filter(
      file => !SUPPORTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE
    )

    if (invalidFiles.length > 0) {
      toast({
        title: "Error",
        description: "Some files are invalid. Please check file types and sizes.",
        variant: "destructive",
      })
      return
    }

    const newImageUrls = files.map(file => URL.createObjectURL(file))
    setImageFiles(prev => [...prev, ...files])
    setImageUrls(prev => [...prev, ...newImageUrls])
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: Product) => {
    setIsSubmitting(true)
    
    try {
      // Here you would implement the actual product creation logic
      // including image upload to a storage service
      
      toast({
        title: "Success",
        description: "Product added successfully",
      })
      
      form.reset()
      setImageFiles([])
      setImageUrls([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Fill in the details below to add a new product
          </p>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter product name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter SKU" />
                    </FormControl>
                    <FormDescription>
                      Unique identifier, 4-20 alphanumeric characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(Number.parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          {...field}
                          onChange={e => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter product description"
                        className="h-32"
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Product Images</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        // biome-ignore lint/a11y/noRedundantAlt: <explanation>
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {imageUrls.length < 5 && (
                    <label className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          Upload Image
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={handleImageUpload}
                        multiple
                      />
                    </label>
                  )}
                </div>
                <FormDescription>
                  Maximum 5 images, JPG/PNG only, 2MB each
                </FormDescription>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                    setImageFiles([])
                    setImageUrls([])
                  }}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Product
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}