import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import UrlContext from "../../context/UrlContext/UrlContext";

const Nav = () => {
  const [analytics, setAnalytics] = useState({
    totalLinks: 0,
    totalClicks: 0,
  });
  const [open, setOpen] = useState(false);
  const { user, signOut } = useContext(AuthContext);
  const { shortUrl } = useContext(UrlContext);

  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const getUrlAnalytics = async () => {
      try {
        const res = await axios.get("/api/user/get-url-by-user");
        setAnalytics({
          totalLinks: res.data.noOfUrls,
          totalClicks: res.data.totalClicksOfAllUrls,
        });
      } catch (error) {
        console.log(error);
      }
    };

    getUrlAnalytics();
  }, [shortUrl]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("You are signed out.");
    navigate("/", { replace: true });
  };

  const handleDelete = async () => {
    const res = await axios.delete(
      "http://localhost:3000/api/auth/delete-account",
      {
        withCredentials: true,
      }
    );
    console.log(res.data);
    // await signOut();
    toast.success(res.data.message);
    window.location.href = "/";
  };

  return (
    <header>
      <nav className="flex justify-between items-center w-[90%] mx-auto my-5">
        <div>
          <h1 className="text-2xl font-bold">Shrink.It</h1>
        </div>
        {/* Stats Snapshot */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-800">
              {analytics.totalLinks}
            </span>
            <span>Links</span>
          </div>

          {/* <span className="text-gray-300">|</span>

          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-800">
              {analytics.totalClicks}
            </span>
            <span>Clicks</span>
          </div> */}
        </div>
        {/* User Info + Sign Out */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full px-3 py-1 hover:bg-gray-100 transition"
          >
            <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow">
              {user.profileName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user.profileName}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-65 bg-primary border border-accent rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-accent">
                <p className="text-md text-secondary font-semibold">
                  {user.profileName}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-md text-secondary"
              >
                Sign out
              </button>

              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-3 hover:bg-red-100 text-md text-red-600 cursor-pointer"
              >
                Delete account
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
