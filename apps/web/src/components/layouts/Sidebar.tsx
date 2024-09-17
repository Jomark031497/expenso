import clsx from "clsx";

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-30 h-screen w-80 overflow-y-auto bg-white transition-transform duration-500 md:relative md:translate-x-0 md:border-r",
        isOpen ? "" : "-translate-x-full md:translate-x-0",
      )}
    >
      sidebar!
    </aside>
  );
};
