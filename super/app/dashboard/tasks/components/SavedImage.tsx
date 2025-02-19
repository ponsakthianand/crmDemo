import Image from "next/image"
import { deleteImage } from "../actions/deleteImage"
import { Trash2 } from "lucide-react"

interface SavedImageProps {
  _id: string
  url: string
  taskId: string
  onDelete: (imageId: string) => void
}

export default function SavedImage({ _id, url, onDelete, taskId }: SavedImageProps) {
  const handleDelete = async () => {
    onDelete(_id)
  }

  return (
    <div className="border rounded-lg p-4 space-y-2 relative">
      <Image src={url || "/placeholder.svg"} alt="Saved image" width={200} height={200} className=" h-auto" />
      <div
        onClick={handleDelete}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors absolute top-2 right-2 cursor-pointer"
      >
        <Trash2 className="h-4 w-4 opacity-70" />
      </div>
    </div>
  )
}

