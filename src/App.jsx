import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("hidden");
  const location = useLocation();

  // 每次路径变化时清除警告信息
  useEffect(() => {
    setAlertMessage("");
    setAlertClassName("hidden");
  }, [location.pathname]);

  const navigate = useNavigate();

  const logOut = () => {
    setJwtToken("");
    setAlertMessage("You have been logged out.");
    setAlertClassName("alert-success");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen text-gray-200 bg-black">
      {/* Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b shadow-lg border-gold-400">
        <h1 className="text-2xl font-bold text-gold-400">
          {jwtToken ? "Welcome Back!" : "Tag Together"}
        </h1>
        <nav className="flex items-center space-x-6 text-gray-300">
          <Link
            to="/"
            className="py-2 font-semibold transition duration-200 hover:text-gold-400"
          >
            Home
          </Link>
          <Link
            to="/leaderboard"
            className="py-2 font-semibold transition duration-200 hover:text-gold-400"
          >
            Leaderboard
          </Link>
          {jwtToken && (
            <>
              <Link
                to="/sign-up-team"
                className="py-2 font-semibold transition duration-200 hover:text-gold-400"
              >
                Sign Up Team
              </Link>
              <Link
                to="/upload-post"
                className="py-2 font-semibold transition duration-200 hover:text-gold-400"
              >
                Upload Post
              </Link>
            </>
          )}
          <button
            onClick={logOut}
            className="py-2 font-semibold transition duration-200 hover:text-red-500"
          >
            {jwtToken ? "Logout" : <Link to="/login">Login</Link>}
          </button>
        </nav>
      </header>

      {/* Alert Component */}
      {alertMessage && (
        <div
          className={`${alertClassName} mx-6 mt-4 px-4 py-3 border rounded shadow-lg bg-gray-800 text-gold-300`}
        >
          {alertMessage}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-800 rounded-t-lg shadow-inner">
        <Outlet
          context={{
            jwtToken,
            setJwtToken,
            setAlertMessage,
            setAlertClassName,
          }}
        />
      </main>

      {/* Footer */}
      <footer className="p-4 text-sm text-center text-gray-500 bg-gray-900 border-t border-gold-400">
        © {new Date().getFullYear()} Tag Together. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
