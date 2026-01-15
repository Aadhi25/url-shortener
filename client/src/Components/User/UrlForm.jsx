import { useState, useContext } from "react";
import axios from "axios";
import UrlContext from "../../context/UrlContext/UrlContext";
import toast from "react-hot-toast";

const UrlForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { longUrl, setLongUrl, setShortUrl } = useContext(UrlContext);

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
      setIsLoading(true);
      const getShortUrl = await axios.post("/api/guest/create-short-url/", {
        longUrl: longUrl,
      });
      setShortUrl(getShortUrl.data.shortUrl);
      console.log(getShortUrl.data.shortUrl);
      setIsLoading(false);
      toast.success("Short Url created.");
      setLongUrl("");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setErrMsg(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col mx-auto w-[90%]">
      {/* <h2 className="text-xl font-bold">:</h2> */}
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
    </div>
  );
};

export default UrlForm;
