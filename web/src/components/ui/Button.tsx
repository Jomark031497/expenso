import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import { Button as HButton } from "@headlessui/react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "contained" | "outlined";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "contained", ...rest }, ref) => {
    return (
      <HButton
        {...rest}
        ref={ref}
        className={clsx(
          "rounded px-3 py-1.5 text-xs font-semibold transition-all",
          variant === "contained"
            ? "border border-primary bg-primary text-white hover:bg-primaryDark"
            : "border border-primary bg-primary/10 text-primary shadow-sm hover:shadow-sm hover:shadow-primary",
          rest.className,
        )}
      >
        {children}
      </HButton>
    );
  },
);
