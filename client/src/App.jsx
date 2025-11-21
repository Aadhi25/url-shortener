import { useState, useEffect, useContext } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import CardSec from "./Components/CardSec";
import UrlProvider from "./context/UrlProvider";
import ShowUrl from "./Components/ShowUrl";

const App = () => {
  return (
    <UrlProvider>
      <div className="font-lato">
        <Navbar />
        <Hero />
        <CardSec />
        <ShowUrl />
      </div>
    </UrlProvider>
  );
};

export default App;
