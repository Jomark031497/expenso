import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  formError?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, formError, ...rest }, ref) => {
  return (
    <div>
      <label className="flex flex-col gap-1 text-sm text-gray-500">
        {label}
        <input
          {...rest}
          ref={ref}
          className={clsx(
            "hover:border-primary/50 focus:border-primary active:border-primary rounded border-2 px-1.5 py-1.5 text-black outline-none transition-all",
            formError && "border-red-700 hover:border-red-700 focus:border-red-700 active:border-red-700",
            rest.className,
          )}
        />
      </label>
      {formError && <p className="text-sm text-red-700">{formError.message}</p>}
    </div>
  );
});
