"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type ImportProduct, importSchema } from "~/types/product"
import { validateFileSize, validateFileType, parseImportFile } from "@/lib/file-validation"
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"

export default function ProductImportPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewData, setPreviewData] = useState<ImportProduct[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const { toast } = useToast()

  const form = useForm({
    defaultValues: {
      file: null as unknown as FileList,
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size and type
    if (!validateFileSize(file)) {
      toast({
        title: "Error",
        description: "File size must not exceed 5MB",
        variant: "destructive",
      })
      return
    }

    if (!validateFileType(file)) {
      toast({
        title: "Error",
        description: "Invalid file type. Please upload CSV or Excel file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      const data = await parseImportFile(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Validate data structure
      const validationResult = importSchema.safeParse(data)

      if (!validationResult.success) {
        setValidationErrors(validationResult.error.errors.map(err => err.message))
        toast({
          title: "Validation Error",
          description: "Please check the file format and try again",
          variant: "destructive",
        })
      } else {
        setPreviewData(validationResult.data)
        toast({
          title: "Success",
          description: "File parsed successfully. Please review the data below.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleImport = async () => {
    // Here you would implement the actual import logic
    toast({
      title: "Success",
      description: `Imported ${previewData.length} products successfully`,
    })
    setPreviewData([])
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Import Products</h1>
          <p className="text-muted-foreground">
            Upload your product data from CSV or Excel file
          </p>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {validationErrors.length > 0 && (
                <div className="rounded-lg bg-destructive/10 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <h3 className="font-semibold">Validation Errors</h3>
                  </div>
                  <ul className="mt-2 list-disc pl-6 text-sm text-destructive">
                    {validationErrors.map((error, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </Form>
        </Card>

        {previewData.length > 0 && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Preview Data</h2>
                <Button onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Confirm Import
                </Button>
              </div>

              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Category</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((product) => (
                      <TableRow key={product.sku}>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.category || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}