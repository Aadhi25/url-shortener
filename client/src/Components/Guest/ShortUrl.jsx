import { useContext } from "react";
import UrlContext from "../../context/UrlContext/UrlContext";

const ShortUrl = ({ errMsg, isLoading }) => {
  const { shortUrl, longUrl } = useContext(UrlContext);
  if (errMsg.length >= 1) {
    return <h3 className="text-lg font-bold mt-5 text-secondary">{errMsg}</h3>;
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
