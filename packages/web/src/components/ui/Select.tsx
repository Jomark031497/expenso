import clsx from "clsx";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  formError?: FieldError;
  children: ReactNode;
  containerClassName?: string;
  label: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, formError, children, containerClassName, ...rest }, ref) => {
    return (
      <div className={clsx("relative w-full", containerClassName)}>
        <label className="text-textSecondary text-sm/6 font-medium">
          {label}
          <select
            {...rest}
            ref={ref}
            className={clsx(
              "text-textPrimary focus:border-primary mt-1 block w-full appearance-none rounded border-2 bg-white px-4 py-1.5 outline-none",
              formError ? "border-error hover:border-error" : "hover:border-primary border-gray-200",
            )}
          >
            {children}
          </select>
          <FaChevronDown className="group pointer-events-none absolute right-2.5 top-10 size-4" aria-hidden="true" />
        </label>
        {formError && <p className="text-error text-xs">{formError.message}</p>}
      </div>
    );
  },
);
