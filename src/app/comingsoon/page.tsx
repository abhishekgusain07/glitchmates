import { MdConnectedTv } from "react-icons/md";

export default function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center">
                <MdConnectedTv className="size-10" />
                <p className="text-sm text-muted-foreground">This feature is coming soon</p>
            </div>
        </div>
    )
}