import clsx from "clsx";
import { FaWallet } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { Link, NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
}

export const Sidebar = ({ isOpen, close }: SidebarProps) => {
  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-30 h-screen w-80 overflow-y-auto bg-white transition-transform duration-500 md:relative md:z-0 md:translate-x-0 md:border-r",
        isOpen ? "" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link
          onClick={close}
          to="/"
          className="text-xl font-bold tracking-wider text-primary transition-all hover:text-primary/80"
        >
          _expenso.
        </Link>
      </div>

      <div className="p-4">
        <ul className="flex flex-col gap-1 py-5">
          {navLinks.map((navLink) => (
            <li id={navLink.label} key={navLink.label}>
              <NavLink
                onClick={close}
                to={navLink.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 rounded p-2 font-semibold transition-all hover:bg-gray-200",
                    isActive ? "bg-primary/20 text-primary hover:bg-primary/30" : "text-textSecondary",
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
    </aside>
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
