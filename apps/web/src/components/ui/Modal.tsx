import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Backdrop } from "@/components/layouts/Backdrop";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger the animation
      setTimeout(() => setShowModal(true), 50);
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <dialog
          open={isOpen}
          className={clsx(
            "mx-4 max-w-md transform rounded-md bg-white p-4 text-center shadow-lg transition-all duration-300 ease-in-out md:mx-auto",
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
        >
          <div>{children}</div>
        </dialog>
      </div>

      {/* Backdrop */}
      <Backdrop isOpen={isOpen} onClick={onClose} />
    </>
  );
};
