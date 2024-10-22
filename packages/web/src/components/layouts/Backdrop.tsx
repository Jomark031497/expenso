import clsx from "clsx";

interface BackdropProps {
  isOpen: boolean;
  onClick: () => void;
}

export const Backdrop = ({ isOpen, onClick }: BackdropProps) => {
  return (
    <div
      onClick={onClick}
      className={clsx("absolute left-0 top-0 z-10 h-screen w-full bg-black/20", isOpen ? "" : "hidden")}
    />
  );
};
