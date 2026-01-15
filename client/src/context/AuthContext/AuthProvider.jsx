import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Useffect is running");
    const getUserStatus = async () => {
      try {
        const res = await axios.get("/api/auth/status", {
          withCredentials: true,
        });
        console.log(res.data.user);
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUserStatus();
  }, []);

  const signOut = async () => {
    try {
      await axios.post("/api/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isOpen,
        setIsOpen,
        modalContent,
        setModalContent,
        user,
        setUser,
        loading,
        setLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
