import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToggle } from "@/features/misc/hooks/useToggle";
import clsx from "clsx";
import { RiMenu4Fill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { GrTransaction } from "react-icons/gr";
import { Button } from "@/components/ui/Button";
import { FaUser, FaLock, FaWallet } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { FaUserTie } from "react-icons/fa6";

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

export const Navbar = () => {
  const { user, handleLogout } = useAuth();

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
      </div>

      {/* User Profile Drawer Component*/}
      <div
        className={clsx(
          "fixed right-0 top-0 z-40 h-screen w-80 overflow-y-auto bg-white transition-transform duration-500",
          isUserProfileMenuOpen ? "" : "translate-x-full",
        )}
      >
        <div className="flex h-screen flex-col">
          <div className="flex flex-1 flex-col items-center gap-4 p-4 py-16">
            <div className="flex flex-col items-center">
              <FaUserTie className="bg-primary text-secondary mb-4 rounded-full p-3 text-8xl" />

              <p className="text-textPrimary text-lg font-semibold">{user?.fullName || user?.username}</p>
              <p className="text-textSecondary text-xs tracking-wide">{user?.email}</p>
            </div>

            <ul className="flex w-full flex-col gap-1 self-start py-5">
              {userNavLinks.map((navLink) => (
                <li id={navLink.label} key={navLink.label}>
                  <NavLink
                    onClick={closeNavMenu}
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
          </div>
          <div className="flex h-16 items-center justify-center p-4">
            <Button onClick={handleLogout} className="bg-error/20 text-error hover:bg-error/30 w-full">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
