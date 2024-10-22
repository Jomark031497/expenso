import { FaChevronLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Navigate back to the dashboard
    navigate("/");
  };

  if (location.pathname === "/") return null;

  return (
    <nav className="flex items-center space-x-2 p-4">
      <button onClick={handleBack} className="flex items-center text-sm">
        <FaChevronLeft className="mr-1 h-2 w-2" />
        Back to Dashboard
      </button>
    </nav>
  );
};
