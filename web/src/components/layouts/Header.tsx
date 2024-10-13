import { Menu, MenuButton, MenuItems, MenuItem, MenuSeparator, Button } from "@headlessui/react";
import React from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { Link, NavLink } from "react-router-dom";
import { MdSettings } from "react-icons/md";
import { FaUser, FaLock, FaWallet } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import clsx from "clsx";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { handleLogout } = useAuth();

  return (
    <>
      <header className="fixed flex h-16 w-full max-w-md items-center justify-between border-b bg-background px-4 shadow-inner">
        <Link to="/" className="text-xl font-bold tracking-wider text-primary transition-all hover:text-primary/80">
          _expenso.
        </Link>

        <Menu>
          <MenuButton className="data-[active]:text-primary">
            <HiMenuAlt1 className="size-8" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="flex w-52 origin-top-right flex-col gap-1 rounded bg-white p-4 text-textSecondary shadow transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {navLinks.map((item) => (
              <MenuItem key={item.label}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-2 rounded p-1.5 text-sm font-semibold transition duration-100 ease-in-out",
                      isActive ? "bg-primary text-white data-[focus]:bg-primary" : "data-[focus]:bg-primary/30",
                    )
                  }
                >
                  <i>{item.icon}</i>
                  {item.label}
                </NavLink>
              </MenuItem>
            ))}

            <MenuSeparator className="my-1 h-px bg-gray-200" />

            {userOptionsLinks.map((item) => (
              <MenuItem key={item.label}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-2 rounded p-1.5 text-sm font-semibold transition duration-100 ease-in-out",
                      isActive ? "bg-primary text-white data-[focus]:bg-primary" : "data-[focus]:bg-primary/30",
                    )
                  }
                >
                  <i>{item.icon}</i>
                  {item.label}
                </NavLink>
              </MenuItem>
            ))}

            <MenuItem>
              <Button
                onClick={handleLogout}
                className="w-full rounded bg-error/10 p-1.5 text-sm text-error hover:bg-error/20"
              >
                Logout
              </Button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </header>

      <div id="header-offset" className="h-16" />
    </>
  );
};

const navLinks = [
  {
    label: "Dashboard",
    path: "/",
    icon: <LuLayoutDashboard />,
  },
  {
    label: "Wallets",
    path: "/wallets",
    icon: <FaWallet />,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: <GrTransaction />,
  },
];

const userOptionsLinks = [
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
