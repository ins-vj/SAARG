'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface HardwareDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (seedDetected: boolean) => void
}

export function HardwareDialog({ isOpen, onClose, onConfirm }: HardwareDialogProps) {
  const [seedDetected, setSeedDetected] = useState(false)

  const handleConfirm = () => {
    onConfirm(seedDetected)
    setSeedDetected(false)
  }

  const handleCancel = () => {
    onClose()
    setSeedDetected(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hardware Verification</DialogTitle>
          <DialogDescription>
            Please verify that the seed is properly placed in the hardware device
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">Before proceeding:</p>
              <ul className="mt-2 space-y-1 ml-4 list-disc">
                <li>Ensure the seed is properly placed</li>
                <li>Make sure the hardware is connected</li>
                <li>The device should be in ideal lighting</li>
              </ul>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={seedDetected}
                onChange={(e) => setSeedDetected(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
              />
              <div className="flex items-center gap-2">
                {seedDetected && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Yes, the seed is properly placed
                </span>
              </div>
            </label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!seedDetected}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Proceed with Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
