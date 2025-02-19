"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import Avatar from "@/components/avatar-initials"
import LastSeen from "@/components/elements/lastSeen"

interface Comment {
  _id: string
  taskId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

interface CommentsProps {
  taskId: string
  initialComments: Comment[]
  onCommentAdded: () => void
  token?: string
}

export function Comments({ taskId, initialComments, onCommentAdded, token }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()

  const addComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch("/api/tasks/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId,
          content: newComment,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const addedComment = await response.json()
      setComments([...comments, addedComment])
      setNewComment("")
      onCommentAdded() // Call this after successfully adding a comment
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (initialComments?.length) {
      setComments(initialComments);
    }
  }, [initialComments]);

  return (
    <div className="space-y-4">
      <div className="space-y-2 mt-0">
        <h3 className="text-lg font-semibold">Comments</h3>
        <Textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <Button onClick={addComment}>Add Comment</Button>
      </div>
      <div className="space-y-5">
        {comments.map((comment) => (
          <div key={comment._id} className="flex space-x-2">
            <Avatar name={comment.userName as string} userId={comment.userId} className="!w-8 !h-8" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-start gap-2">
                <h4 className="text-sm font-semibold">{comment.userName}</h4>
                <span className="text-xs text-gray-500"><LastSeen date={comment.createdAt} isAgo={true} /></span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

