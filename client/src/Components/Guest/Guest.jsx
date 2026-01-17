import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";
import Hero from "./Hero";
import GuestUrlForm from "./GuestUrlForm";
import ShowUrl from "./ShowUrl";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";

const Guest = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="font-lato">
      <Navbar />
      <Hero />
      <GuestUrlForm />
      <ShowUrl />
    </div>
  );
};

export default Guest;
