import { MAX_IMPORT_FILE_SIZE } from "~/types/product"
// import * as XLSX from "xlsx"
import { z } from "zod"

export const validateFileSize = (file: File): boolean => {
  return file.size <= MAX_IMPORT_FILE_SIZE
}

export const validateFileType = (file: File): boolean => {
  const validTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ]
  return validTypes.includes(file.type)
}

export const parseImportFile = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result
        // const workbook = XLSX.read(data, { type: "binary" })
        // const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        // const jsonData = XLSX.utils.sheet_to_json(firstSheet)
        resolve(true)
      } catch (error) {
        reject(new Error("Failed to parse file"))
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsBinaryString(file)
  })
}