import clsx from "clsx";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  formError?: FieldError;
  children: ReactNode;
  containerClassName?: string;
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, formError, children, containerClassName, ...rest }, ref) => {
    return (
      <div className={clsx("relative w-full", containerClassName)}>
        {label ? (
          <label className="text-sm/6 font-medium text-textSecondary">
            {label}
            <select
              {...rest}
              ref={ref}
              className={clsx(
                "mt-1 block w-full appearance-none rounded border-2 bg-white px-4 py-1.5 text-textPrimary outline-none focus:border-primary",
                formError ? "border-error hover:border-error" : "border-gray-200 hover:border-primary",
              )}
            >
              {children}
            </select>
            <FaChevronDown className="group pointer-events-none absolute right-2.5 top-10 size-4" aria-hidden="true" />
          </label>
        ) : (
          <div className={clsx("relative", containerClassName)}>
            <select
              {...rest}
              ref={ref}
              className={clsx(
                "mt-1 block w-full appearance-none rounded border-2 bg-white px-4 py-1.5 text-sm/6 font-medium text-textPrimary outline-none focus:border-primary",
                formError ? "border-error hover:border-error" : "border-gray-200 hover:border-primary",
              )}
            >
              {children}
            </select>
            <FaChevronDown className="group pointer-events-none absolute right-2.5 top-3 size-4" aria-hidden="true" />
          </div>
        )}
      </div>
    );
  },
);

// <div className="w-full max-w-md">
//   <Field>
//     <Label className="text-textSecondary text-sm/6 font-medium">{label}</Label>

//     <div className="relative">
//       <HSelect
//         {...rest}
//         ref={ref}
//         className={clsx(
//           "mt-1 block w-full appearance-none rounded-lg border-2 bg-white px-3 py-1.5 text-sm/6 outline-none transition-all",
//           formError ? "border-error hover:border-error" : "hover:border-secondary border-gray-200",
//         )}
//       >
//         {children}
//       </HSelect>
//       <FaChevronDown className="group pointer-events-none absolute right-2.5 top-3 size-4" aria-hidden="true" />
//     </div>
//     {formError && <Description className="text-error text-xs">{formError.message}</Description>}
//   </Field>
// </div>
