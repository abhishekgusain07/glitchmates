'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {useState} from 'react'

export const useConfirm = (
    title: string,
    message: string,
):[() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void
    }|null>(null)

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({resolve})
    })

    const handleClose = () => {
        setPromise(null)
    }
    const handleCancel = () => {
        promise?.resolve(false)
        handleClose()
    }
    const handleConfirm = () => {
        promise?.resolve(true)
        handleClose()
    }
    const ConfirmDialog = () => {
        return (
            <Dialog open={promise !== null} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{message}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='pt-2'>
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleConfirm}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return [ConfirmDialog, confirm]
}
