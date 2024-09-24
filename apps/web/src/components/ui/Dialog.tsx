import { DialogPanel, DialogTitle, Dialog as HDialog, DialogBackdrop } from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

type DialogProps = {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
  title?: string;
};

export const Dialog = ({ title, close, isOpen, children }: DialogProps) => {
  return (
    <HDialog
      open={isOpen}
      onClose={close}
      transition
      className={
        "fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      }
    >
      <DialogBackdrop transition className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className={clsx(
            "relative w-full max-w-lg space-y-4 rounded bg-white duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
          )}
        >
          <button onClick={close} className="absolute right-3 top-3 rounded-full p-1 text-2xl hover:bg-gray-100">
            <IoMdClose />
          </button>

          {title && <DialogTitle className="px-4 text-lg font-bold">{title}</DialogTitle>}

          <div className="p-4">{children}</div>
        </DialogPanel>
      </div>
    </HDialog>
  );
};
