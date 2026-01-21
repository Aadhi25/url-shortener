import { useContext } from "react";
import UrlContext from "../../context/UrlContext/UrlContext";

const ShowUrl = () => {
  const { guestUrls, handleRedirect } = useContext(UrlContext);

  return (
    // Show the urls that is stored in the guest session
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
              </tr>
            </thead>
            <tbody>
              {guestUrls.map((url) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {guestUrls.map((url) => (
          <div
            key={url._id}
            className="rounded-xl border bg-white p-4 shadow-sm"
          >
            <div className="mb-2">
              <button
                onClick={() => handleRedirect(url.shortString)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accentHover hover:underline font-medium cursor-pointer"
              >
                {url.shortUrl}
              </button>
              <p className="text-sm text-gray-500 truncate">{url.longUrl}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowUrl;
