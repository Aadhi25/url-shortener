import { useState, useContext } from "react";
import axios from "axios";
import ShortUrl from "./ShortUrl";
import UrlContext from "../context/UrlContext";

const CardSec = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const {
    trialUrl,
    setTrialUrl,
    longUrl,
    setLongUrl,
    shortUrl,
    setShortUrl,
    countData,
    setCountData,
  } = useContext(UrlContext);

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
      const getShortUrl = await axios.post("http://localhost:3000/trialurl/", {
        longUrl: longUrl,
      });
      if (countData < 2) {
        setTrialUrl((prevData) => [
          ...prevData,
          {
            urlId: getShortUrl.data._id,
            bigUrl: getShortUrl.data.longUrl,
            smallUrl: getShortUrl.data.shortUrl,
          },
        ]);
      }
      setShortUrl(getShortUrl.data.shortUrl);
      setCountData(countData + 1);
      // onDataSend(urlCount);
      console.log(trialUrl);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrMsg(error.response.data);
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
          className="rounded-md border border-accent w-full p-4 my-4 text-lg focus:border-3 ease-linear duration-200"
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
          countData={countData}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default CardSec;
