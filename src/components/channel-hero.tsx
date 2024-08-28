import { format } from "date-fns";

interface ChannelHeroProps {
    channelName: string;
    channelCreationTime: number;
}

const ChannelHero = ({channelName, channelCreationTime}: ChannelHeroProps) => {
    return (
        <div className="mt[88px] mx-5 mb-4">
            <div className="text-2xl font-bold flex items-center mb-2">
                # {channelName}
            </div>
            <p className="font-normal text-slate-500 mb-4">
                This channel was created on {format(channelCreationTime, "MMM d, yyyy")}. This is the very beginning of the <strong>{channelName}</strong> channel.
            </p>
        </div>
    )
}

export default ChannelHero;