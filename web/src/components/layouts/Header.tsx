import React, { useEffect, useRef } from "react";
import { useToggle } from "@/features/misc/hooks/useToggle";
import clsx from "clsx";
import { FaLock, FaUser, FaUserTie } from "react-icons/fa";
import { HiMenuAlt1 } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { handleLogout } = useAuth();

  const { isOpen, close, open } = useToggle();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  const handleUserButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  return (
    <header className="flex h-16 items-center justify-between px-4 md:justify-end">
      <button onClick={onMenuClick} className="text-3xl md:hidden">
        <HiMenuAlt1 />
      </button>
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={handleUserButtonClick}
          className="bg-primary text-secondary rounded-full border p-2 text-2xl"
        >
          <FaUserTie />
        </button>
        <div
          id="dropdown_menu"
          ref={menuRef}
          className={clsx(
            "border-borderColor absolute right-0 mt-1 flex w-56 origin-top-right flex-col gap-2 rounded-md border bg-white p-2 transition-all",
            isOpen ? "scale-100 transform opacity-100" : "pointer-events-none scale-95 transform opacity-0",
          )}
        >
          <ul className="flex w-full flex-col gap-1 self-start">
            {userNavLinks.map((navLink) => (
              <li id={navLink.label} key={navLink.label}>
                <NavLink
                  onClick={close}
                  to={navLink.path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-2 rounded p-2 font-semibold transition-all hover:bg-gray-200",
                      isActive ? "bg-primary/20 hover:bg-primary/30 text-primary" : "text-textSecondary",
                    )
                  }
                >
                  <i className="text-xl">{navLink.icon}</i>
                  <span className="tracking-wide">{navLink.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <hr />

          <div>
            <Button onClick={handleLogout} className="bg-error/10 text-error hover:bg-error/20 w-full">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

const userNavLinks = [
  {
    label: "Profile",
    path: "/user/profile",
    icon: <FaUser />,
  },
  {
    label: "Security",
    path: "/user/security",
    icon: <FaLock />,
  },
  {
    label: "Account Settings",
    path: "/user/settings",
    icon: <MdSettings />,
  },
];
