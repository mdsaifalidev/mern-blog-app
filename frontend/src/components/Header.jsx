import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosInstance";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";

const Header = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Please Wait...");
    try {
      const response = await axiosInstance.post("/api/v1/auth/logout");
      toast.success(response.data.message, { id: toastId });
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <nav className="bg-white shadow-md py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <h2 className="text-3xl font-bold">Blog</h2>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {user?.role === "user" && (
            <>
              <NavLink
                to="/my-blogs"
                className={({ isActive }) =>
                  isActive
                    ? "text-sm font-semibold text-indigo-600"
                    : "text-sm font-semibold text-gray-700 hover:text-indigo-600"
                }
              >
                My Blogs
              </NavLink>
              <NavLink
                to="/create-blog"
                className={({ isActive }) =>
                  isActive
                    ? "text-sm font-semibold text-indigo-600"
                    : "text-sm font-semibold text-gray-700 hover:text-indigo-600"
                }
              >
                Create New Blog
              </NavLink>
            </>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-sm font-semibold text-indigo-600"
                  : "text-sm font-semibold text-gray-700 hover:text-indigo-600"
              }
            >
              Admin Dashboard
            </NavLink>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
