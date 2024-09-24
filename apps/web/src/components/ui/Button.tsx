import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as HButton } from "@headlessui/react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...rest }, ref) => {
  return (
    <HButton
      {...rest}
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded px-3 py-1.5 text-sm/6 font-semibold",
        "shadow-inner shadow-white/10",
        rest.className,
      )}
    >
      {children}
    </HButton>
  );
});
