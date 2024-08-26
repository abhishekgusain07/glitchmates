import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, type, ...props }, ref) => {
  const [hidden, setHidden] = React.useState(true);

  return (
    <div className="relative">
      <Input
        ref={ref}
        className={cn("pr-10", className)}
        type={hidden ? "Password" : "text"}
        {...props}
      />
      <button
        type="button"
        onClick={() => setHidden(!hidden)}
        className="absolute bottom-0 right-0 px-2.5 text-sm font-medium text-gray-500 rounded-md h-9 focus:text-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          width="18"
        >
          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path>
          <path
            fillRule="evenodd"
            d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
});

PasswordInput.displayName = "Input";
