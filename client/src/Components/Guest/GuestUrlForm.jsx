import { useState, useContext } from "react";
import axios from "axios";
import ShortUrl from "./ShortUrl";
import UrlContext from "../../context/UrlContext/UrlContext";

const GuestUrlForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const { longUrl, setLongUrl, shortUrl, setShortUrl, setGuestUrls } =
    useContext(UrlContext);

  const onChangeHandler = (e) => {
    setLongUrl(e.target.value);
    setShortUrl("");
    setErrMsg("");
    setIsLoading(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // send the post request to the backend and get the short url from the backend
    try {
      setShow(true);
      setIsLoading(true);
      const getShortUrl = await axios.post("/api/guest/create-short-url/", {
        longUrl: longUrl,
      });
      setShortUrl(getShortUrl.data.shortUrl);
      setGuestUrls((prevState) => [...prevState, getShortUrl.data]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setErrMsg(error.response.data.message);
      console.log(errMsg);
    }
  };

  return (
    <div className="flex flex-col mx-auto w-[90%]">
      <h2 className="text-xl font-bold">Try it for free:</h2>
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          name="longUrl"
          value={longUrl}
          onChange={onChangeHandler}
          placeholder="Paste your long link here"
          className="rounded-md border border-accent w-full p-4 my-4 text-lg outline-none focus:border-3 ease-linear duration-200"
          required
        />
        <button
          type="submit"
          className="bg-accent text-primary rounded-lg px-5 py-2 cursor-pointer"
        >
          Shorten Url
        </button>
      </form>
      {show ? (
        <ShortUrl
          isLoading={isLoading}
          longUrl={longUrl}
          shortUrl={shortUrl}
          errMsg={errMsg}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default GuestUrlForm;
