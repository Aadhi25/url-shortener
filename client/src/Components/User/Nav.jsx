import { useState, useContext, useEffect } from "react";
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
  const { user, signOut } = useContext(AuthContext);
  const { shortUrl } = useContext(UrlContext);

  const navigate = useNavigate();

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

          <span className="text-gray-300">|</span>

          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-800">
              {analytics.totalClicks}
            </span>
            <span>Clicks</span>
          </div>
        </div>
        {/* User Info + Sign Out */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-700 font-medium truncate max-w-[180px]">
            Logged in as: {user?.profileName}
          </span>

          <button
            onClick={handleSignOut}
            className="bg-accent text-primary px-5 py-2 rounded-lg cursor-pointer border-none hover:bg-accentHover duration-300"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
