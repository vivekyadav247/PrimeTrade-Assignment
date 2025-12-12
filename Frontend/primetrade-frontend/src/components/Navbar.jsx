import { useContext } from "react";
import { AuthContext } from "../context/AuthCOntext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!auth.token) return null;

  return (
    <nav className="sticky top-0 z-50 bg-linear-to-r from-slate-900 via-purple-900 to-slate-900 shadow-xl border-b border-purple-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">PrimeTrade</h2>

          <div className="flex gap-8 items-center">
            {auth.role === "admin" ? (
              <>
                <a
                  href="/admin"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/admin/users"
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Users
                </a>
              </>
            ) : (
              <a
                href="/"
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                My Tasks
              </a>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
