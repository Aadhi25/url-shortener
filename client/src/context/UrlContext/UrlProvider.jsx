import { useState, useEffect } from "react";
import axios from "../../api/axios";
import UrlContext from "./UrlContext";

const UrlProvider = ({ children }) => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortString, setShortString] = useState("");
  const [session, setSession] = useState({
    isAuthenticated: false,
    urlCount: 0,
    limit: 2,
  });
  const [guestUrls, setGuestUrls] = useState([]);

  useEffect(() => {
    const getGuestUrls = async () => {
      try {
        const res = await axios.get(`/api/guest/guest-urls`);
        setGuestUrls(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getGuestUrls();
  }, []);

  useEffect(() => {
    const getSessionInfo = async () => {
      try {
        const res = await axios.get(`/api/guest/session-info`);
        console.log(res.data);
        setSession(res.data);
      } catch (error) {
        console.log(session);
        console.log(error);
      }
    };
    getSessionInfo();
  }, []);

  const handleRedirect = (shortCode) => {
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/${shortCode}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <UrlContext.Provider
      value={{
        longUrl,
        setLongUrl,
        shortUrl,
        setShortUrl,
        session,
        setSession,
        guestUrls,
        setGuestUrls,
        shortString,
        setShortString,
        handleRedirect,
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export default UrlProvider;
