import { FaUserTie } from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="flex h-16 items-center justify-between px-4 md:justify-end">
      <button onClick={onMenuClick} className="text-3xl md:hidden">
        <HiMenuAlt1 />
      </button>
      <div>
        <button className="bg-primary text-secondary rounded-full border p-2 text-2xl">
          <FaUserTie />
        </button>
      </div>
    </header>
  );
};
