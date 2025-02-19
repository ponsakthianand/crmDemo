import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

interface ImageViewModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
}

export default function ImageViewModal({ isOpen, onClose, imageUrl }: ImageViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <div className="relative w-full h-[80vh]">
          <Image src={imageUrl || "/placeholder.svg"} alt="Full size image" layout="fill" objectFit="contain" />
        </div>
      </DialogContent>
    </Dialog>
  )
}

