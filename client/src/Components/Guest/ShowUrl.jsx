import { useContext } from "react";
import UrlContext from "../../context/UrlContext/UrlContext";

const ShowUrl = () => {
  const { guestUrls } = useContext(UrlContext);

  return (
    // Show the urls that is stored in the guest session
    <div className="flex flex-col mx-auto w-[90%] my-10">
      {guestUrls.length > 0 ? (
        <div className="table w-full ...">
          <div className="table-header-group ...">
            <div className="table-row">
              <div className="table-cell text-xl font-bold text-left ...">
                Your Trial Urls
              </div>
            </div>
          </div>
          {guestUrls.map((url) => (
            <div className="table-row-group">
              <div className="table-row" key={url._id}>
                <div className="mt-5 table-cell ...">
                  <a
                    className="text-accent text-lg font-bold"
                    href={url.longUrl}
                    target="_blank"
                  >
                    {url.shortUrl}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No trial url found</p>
      )}
    </div>
  );
};

export default ShowUrl;
