import { useState, useEffect } from "react";
import UrlContext from "./UrlContext";

const UrlProvider = ({ children }) => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [countData, setCountData] = useState(() => {
    const storedData = localStorage.getItem("urlCount");
    return storedData ? JSON.parse(storedData) : 0;
  });
  const [trialUrl, setTrialUrl] = useState(() => {
    const storedUrl = localStorage.getItem("arrayOfObjects");
    return storedUrl ? JSON.parse(storedUrl) : [];
  });

  useEffect(() => {
    localStorage.setItem("urlCount", countData);
  }, [countData]);

  useEffect(() => {
    localStorage.setItem("arrayOfObjects", JSON.stringify(trialUrl));
  }, [trialUrl]);

  return (
    <UrlContext.Provider
      value={{
        trialUrl,
        setTrialUrl,
        longUrl,
        setLongUrl,
        shortUrl,
        setShortUrl,
        countData,
        setCountData,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export default UrlProvider;
