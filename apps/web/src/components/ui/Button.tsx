import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...rest }, ref) => {
  return (
    <button
      {...rest}
      ref={ref}
      className={clsx("py rounded-md px-4 py-2 text-sm font-medium transition-all", rest.className)}
    >
      {children}
    </button>
  );
});
