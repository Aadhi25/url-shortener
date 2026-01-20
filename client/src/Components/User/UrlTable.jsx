import { useState, useEffect, useContext, useMemo } from "react";
import axios from "../../api/axios";
import UrlContext from "../../context/UrlContext/UrlContext";
import toast from "react-hot-toast";

const UrlTable = () => {
  const [urls, setUrls] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState([]);

  const { shortUrl } = useContext(UrlContext);

  const realtimeStats = useMemo(() => {
    const map = {};
    stats.forEach((s) => {
      map[s.shortString] = s.noOfClicks;
    });
    return map;
  }, [stats]);

  useEffect(() => {
    const getUrls = async () => {
      try {
        const res = await axios.get(
          `/api/user/get-url-by-user?page=${page}&limit=7`,
        );
        console.log(res.data.urls);
        setUrls(res.data.urls);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.log(error);
      }
    };

    getUrls();
  }, [shortUrl, page]);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(`/api/user/stats`);
        setStats(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getStats();
    const id = setInterval(getStats, 10000);
    return () => clearInterval(id);
  }, []);

  const handleRedirect = (shortCode) => {
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/redirect/${shortCode}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const deleteUrl = async (urlId) => {
    try {
      const res = await axios.delete(`/api/user/delete-url/${urlId}`);
      toast.success(res.data.message);
      setUrls((prevState) => prevState.filter((url) => url._id !== urlId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen mx-auto w-[90%] my-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Your URLs</h1>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-primary shadow-md">
          <table className="w-full text-md">
            <thead className="text-secondary">
              <tr>
                <th className="px-4 py-3 text-left">Short URL</th>
                <th className="px-4 py-3 text-left">Original URL</th>
                <th className="px-4 py-3 text-center">Clicks</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url) => (
                <tr
                  key={url._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-blue-600">
                    <button
                      onClick={() => handleRedirect(url.shortString)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accentHover hover:underline font-medium cursor-pointer"
                    >
                      {url.shortUrl}
                    </button>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-600">
                    {url.longUrl}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {realtimeStats[url.shortString] || url.noOfClicks}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteUrl(url._id)}
                      className="rounded-lg px-3 py-1 text-red-600 cursor-pointer hover:bg-blue-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {urls.map((url) => (
          <div
            key={url._id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="mb-2">
              <p className="font-semibold text-accentHover">{url.shortUrl}</p>
              <p className="text-sm text-gray-500 truncate">{url.longUrl}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                👁 {url.noOfClicks} clicks
              </span>
              <button className="rounded-lg px-3 py-1 text-sm text-red-600 cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg border border-accentHover cursor-pointer hover:bg-accentHover hover:text-primary disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg border border-accentHover cursor-pointer hover:bg-accentHover hover:text-primary disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UrlTable;
