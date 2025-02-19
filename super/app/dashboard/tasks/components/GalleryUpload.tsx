"use client"

import type React from "react"
import { useState, useRef } from "react"
import { uploadImage } from "../actions/uploadImage"
import SavedImage from "./SavedImage"
import { ImageIcon, Loader2 } from "lucide-react"

interface ImageWithLink {
  file: File
  linkUrl: string
}

export default function GalleryUpload({ taskId, onSavedImagesChange }: { taskId: string, onSavedImagesChange: (images: any[]) => void }) {
  const [images, setImages] = useState<ImageWithLink[]>([])
  const [savedImages, setSavedImages] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null) // Ref to reset input

  const onSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file) => ({ file, linkUrl: "" }))
      setImages((prev) => [...prev, ...newImages])

      // Reset the input field so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Start Uploading
      setUploading(true)
      await uploadFiles(newImages)
      setUploading(false)
    }
  }

  const uploadFiles = async (files: ImageWithLink[]) => {
    const uploadPromises = files.map(({ file, linkUrl }) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("taskId", taskId)
      return uploadImage(formData)
    })

    try {
      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter((result) => result.success).map((result) => result.image)
      setSavedImages((prev) => [...prev, ...successfulUploads])
      setImages([])
      onSavedImagesChange([...savedImages, ...successfulUploads])
    } catch (error) {
      console.error("Error during upload:", error)
    }
  }

  const handleDelete = (imageId: string) => {
    setSavedImages((prev) => prev.filter((img) => img._id !== imageId))
  }

  return (
    <div className="space-y-4">
      <label className={`flex items-center space-x-2 cursor-pointer px-4 py-2 w-[20%] rounded-sm shadow-md transition 
        ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600 text-white"}`}>
        {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImageIcon className="h-5 w-5" />}
        <span>{uploading ? "Uploading..." : "Attach Images"}</span>
        <input
          ref={fileInputRef} // Attach ref to input
          type="file"
          accept="image/*"
          multiple
          onChange={onSelectFiles}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {/* {savedImages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Attached Images:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedImages.map((img) => (
              <SavedImage key={img._id} {...img} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}
