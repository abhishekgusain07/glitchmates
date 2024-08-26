import React from "react";

interface QuotesProps extends React.PropsWithChildren {}

export const Quotes: React.FC<QuotesProps> = () => {
  return (
    <div className="relative flex-col hidden h-full p-10 text-white bg-muted lg:item- dark:border-r lg:flex">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-300 to-green-600"></div>
      <div className="relative z-20 px-5 m-auto">
        <div className="absolute select-none -top-10 -left-3">
          <span className="font-serif  text-[160px] font-bold leading-none opacity-25">
            “
          </span>
        </div>
        <blockquote className="space-y-3 ">
          <p className="text-2xl italic">
            Empowering people through seamless learning and collaboration
          </p>
          {/* <footer className="pt-3 text-md">
            Jeff Bezos <strong>Founder</strong>
          </footer> */}
        </blockquote>
      </div>
    </div>
  );
};
