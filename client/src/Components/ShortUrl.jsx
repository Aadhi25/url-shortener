import { useContext } from "react";
import UrlContext from "../context/UrlContext";

const ShortUrl = ({ errMsg, isLoading }) => {
  const { shortUrl, longUrl, countData } = useContext(UrlContext);
  if (errMsg.length >= 1) {
    return <h3 className="text-lg font-bold mt-5 text-secondary">{errMsg}</h3>;
  }

  if (countData > 2) {
    return (
      <h3 className="text-lg font-bold mt-5 text-secondary">
        Only two urls can be generated without signing in. Please log in to
        create more short urls.
      </h3>
    );
  }

  if (isLoading) {
    return <h3 className="text-lg font-bold mt-5 text-accent">Loading...</h3>;
  } else {
    return (
      <a
        className="text-accent text-lg font-bold mt-5"
        href={longUrl}
        target="_blank"
      >
        {shortUrl}
      </a>
    );
  }
};

export default ShortUrl;
