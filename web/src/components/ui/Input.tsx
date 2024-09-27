import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { Description, Field, Input as HInput, Label } from "@headlessui/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  formError?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, formError, ...rest }, ref) => {
  return (
    <div className="w-full">
      <Field>
        <Label className="text-sm/6 font-medium text-textSecondary">{label}</Label>
        <HInput
          {...rest}
          ref={ref}
          className={clsx(
            "mt-0.5 block w-full rounded border-2 px-4 py-1.5 text-sm/6 outline-none transition-all focus:border-primary",
            formError ? "border-error hover:border-error" : "border-gray-200 hover:border-primary",
            rest.className,
          )}
        />

        {formError && <Description className="text-xs text-error">{formError.message}</Description>}
      </Field>
    </div>
  );
});
