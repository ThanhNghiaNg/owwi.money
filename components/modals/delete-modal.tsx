"use client"

import type React from "react"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void | Promise<void>
  enterLabel?: string
  title?: string
  isLoading?: boolean
  content?: React.ReactNode
}

export function DeleteModal({ isOpen, onClose, onSubmit, content, enterLabel, title = "Delete", isLoading }: DeleteModalProps) {
  const { t } = useLanguage()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div>
        <div className="text-sm text-muted-foreground whitespace-pre-line">
          {content}
        </div>
      </div>
      <div className={cn("flex gap-2 pt-4", isLoading && "pointer-events-none opacity-80")}>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
          {t("modal.cancel")}
        </Button>
        <Button type="button" className="flex-1 bg-red-600" onClick={onSubmit}>
          {enterLabel || t("modal.delete")}
        </Button>
      </div>
    </Modal>
  )
}
