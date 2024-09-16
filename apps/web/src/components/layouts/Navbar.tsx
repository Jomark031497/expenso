import { useAuth } from "@/features/auth/hooks/useAuth";
import { RiMenu4Fill } from "react-icons/ri";

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between px-2">
      <button className="rounded-full p-2 transition-all hover:bg-gray-100">
        <RiMenu4Fill className="size-6" />
      </button>

      <div>
        <button className="bg-secondary border-primary flex size-10 items-center justify-center rounded-full border-2 p-2 transition-all">
          <strong className="text-2xl">{user?.username.charAt(0).toUpperCase()}</strong>
        </button>
      </div>
    </header>
  );
};
