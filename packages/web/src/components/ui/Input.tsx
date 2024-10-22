import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { Description, Field, Input as HInput, Label } from "@headlessui/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  formError?: FieldError;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, formError, containerClassName, ...rest }, ref) => {
    return (
      <div className={clsx("w-full", containerClassName)}>
        <Field>
          <Label className="text-textSecondary text-sm/6 font-medium">{label}</Label>
          <HInput
            {...rest}
            ref={ref}
            className={clsx(
              "focus:border-primary mt-0.5 block w-full rounded border-2 px-4 py-1.5 text-sm/6 outline-none transition-all",
              formError ? "border-error hover:border-error" : "hover:border-primary border-gray-200",
              rest.className,
            )}
          />

          {formError && <Description className="text-error text-xs">{formError.message}</Description>}
        </Field>
      </div>
    );
  },
);
