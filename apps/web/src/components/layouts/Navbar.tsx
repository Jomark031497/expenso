import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggle } from "@/features/misc/hooks/useToggle";
import clsx from "clsx";
import { RiMenu4Fill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaWallet } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

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

export const Navbar = () => {
  const { user } = useAuth();

  const { close: closeNavMenu, open: openNavMenu, isOpen: isNavMenuOpen } = useToggle();
  const { close: closeUserProfileMenu, open: openUserProfileMenu, isOpen: isUserProfileMenuOpen } = useToggle();

  return (
    <header className="flex h-16 items-center justify-between px-2">
      <button onClick={openNavMenu} className="rounded-full p-2 transition-all hover:bg-gray-100">
        <RiMenu4Fill className="size-6" />
      </button>

      <div>
        <button
          onClick={openUserProfileMenu}
          className="bg-secondary border-primary flex size-10 items-center justify-center rounded-full border-2 p-2 transition-all"
        >
          <strong className="text-2xl">{user?.username.charAt(0).toUpperCase()}</strong>
        </button>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => {
          closeNavMenu();
          closeUserProfileMenu();
        }}
        className={clsx(
          isNavMenuOpen || isUserProfileMenuOpen ? "fixed left-0 top-0 z-10 h-screen w-screen bg-black/10" : "hidden",
        )}
      />

      {/* Menu Drawer Component */}
      <div
        className={clsx(
          "fixed left-0 top-0 z-40 h-screen w-80 overflow-y-auto bg-white p-4 transition-transform duration-500",
          isNavMenuOpen ? "" : "-translate-x-full",
        )}
      >
        <h5 className="text-xl font-semibold">Money Manager</h5>

        <ul className="flex flex-col gap-1 py-5">
          {navLinks.map((navLink) => (
            <li id={navLink.label} key={navLink.label}>
              <NavLink
                onClick={closeNavMenu}
                to={navLink.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 rounded p-2 font-semibold transition-all hover:bg-gray-200",
                    isActive ? "bg-primary/20 hover:bg-primary/30 text-primary" : "",
                  )
                }
              >
                <i className="text-xl">{navLink.icon}</i>
                <span className="tracking-wide">{navLink.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile Drawer Component*/}
      <div
        className={clsx(
          "fixed right-0 top-0 z-40 h-screen w-80 overflow-y-auto bg-white p-4 transition-transform duration-500",
          isUserProfileMenuOpen ? "" : "translate-x-full",
        )}
      >
        <h5 className="text-xl font-semibold">Money Manager</h5>

        <ul className="flex flex-col gap-1 py-5">
          {navLinks.map((navLink) => (
            <li id={navLink.label} key={navLink.label}>
              <NavLink
                onClick={closeNavMenu}
                to={navLink.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 rounded p-2 font-semibold transition-all hover:bg-gray-200",
                    isActive ? "bg-primary/20 hover:bg-primary/30 text-primary" : "",
                  )
                }
              >
                <i className="text-xl">{navLink.icon}</i>
                <span className="tracking-wide">{navLink.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};
