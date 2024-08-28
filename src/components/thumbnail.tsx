/* eslint-disable @next/next/no-img-element */
import { XIcon } from "lucide-react"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

interface ThumbnailProps {
    url: string | null | undefined
}
const Thumbnail = ({url}: ThumbnailProps) => {
    if(!url)return null
    return (
        <Dialog>
            <DialogTrigger>
            <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
                <img
                    src={url || ""}
                    alt="message"
                    className="rounded-md object-cover size-full"
                />
            </div>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none flex items-center justify-center">
                <img
                    src={url || ""}
                    alt="message"
                    className="rounded-md object-cover size-full h-[90vh] w-auto"
                />
            </DialogContent>
        </Dialog>
            
                
    )
}

export default Thumbnail;
