import { useContext, useEffect, useState } from "react";
import UrlContext from "../context/UrlContext";

const ShowUrl = () => {
  const { trialUrl } = useContext(UrlContext);

  return (
    // Show the urls that is stored in the localstorage
    <div className="flex flex-col mx-auto w-[90%] my-10">
      {trialUrl.length > 0 ? (
        <div className="table w-full ...">
          <div className="table-header-group ...">
            <div className="table-row">
              <div className="table-cell text-xl font-bold text-left ...">
                Your Trial Urls
              </div>
            </div>
          </div>
          {trialUrl.map((url) => (
            <div className="table-row-group">
              <div className="table-row" key={url.urlId}>
                <div className="mt-5 table-cell ...">
                  <a
                    className="text-accent text-lg font-bold"
                    href={url.bigUrl}
                    target="_blank"
                  >
                    {url.smallUrl}
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

// <li key={url.urlId}>
//   <p>Longurl: {url.bigUrl}</p>
//   <p>ShortUrl: {url.smallUrl}</p>
// </li>
