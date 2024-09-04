import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { MdConnectedTv } from "react-icons/md";

export default function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center">
                <MdConnectedTv className="size-10" />
                <p className="text-sm text-muted-foreground">This feature is coming soon</p>
            </div>
            <div className="mt-1">
                <Button asChild>
                    <Link href="/">
                        <ArrowLeftIcon className="size-3.5 mr-1 shrink-0"/>
                        Go back
                    </Link>
                </Button>
            </div>
        </div>
    )
}