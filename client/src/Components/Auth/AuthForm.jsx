import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "../../context/AuthContext/AuthContext";

const AuthForm = ({ isOpen, onClose, modalContent }) => {
  const [registerFormData, setRegisterFormData] = useState({
    profileName: "",
    email: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext);

  if (!isOpen) return null;

  const onChangeRegisterHandler = (e) => {
    const { name, value } = e.target;

    setRegisterFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onChangeLoginHandler = (e) => {
    const { name, value } = e.target;

    setLoginFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegisterClick = async (e) => {
    e.preventDefault();

    try {
      const registerUser = await axios.post("/api/auth/register", {
        profileName: registerFormData.profileName,
        email: registerFormData.email,
        password: registerFormData.password,
      });
      console.log(registerUser.data);
      onClose();
      toast.success("Successfully Registerd. Log in to your account now.");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    try {
      const loginUser = await axios.post("/api/auth/login", {
        email: loginFormData.email,
        password: loginFormData.password,
      });
      console.log(loginUser.data);
      setUser(loginUser.data.user);
      toast.success("Login Successful");
      onClose();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response.data);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-normal cursor-pointer hover:text-gray-600"
        >
          ✕
        </button>

        {modalContent === "signup" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Create account
            </h2>

            <form className="space-y-4" onSubmit={handleRegisterClick}>
              <input
                type="text"
                placeholder="Profile Name"
                name="profileName"
                value={registerFormData.profileName}
                required
                onChange={onChangeRegisterHandler}
                className="w-full rounded-lg border-2 border-accent outline-none px-4 py-2"
              />

              <input
                type="email"
                placeholder="Email"
                name="email"
                value={registerFormData.email}
                onChange={onChangeRegisterHandler}
                required
                className="w-full rounded-lg border-2 border-accent outline-none px-4 py-2"
              />

              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={registerFormData.password}
                onChange={onChangeRegisterHandler}
                className="w-full rounded-lg border-2 border-accent outline-none px-4 py-2"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-accent py-3 text-white cursor-pointer"
              >
                Sign Up
              </button>
            </form>
          </>
        )}

        {modalContent === "login" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Login to your account
            </h2>

            <form className="space-y-4" onSubmit={handleLoginClick}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={loginFormData.email}
                onChange={onChangeLoginHandler}
                required
                className="w-full rounded-lg border-2 border-accent outline-none px-4 py-2"
              />

              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                value={loginFormData.password}
                onChange={onChangeLoginHandler}
                className="w-full rounded-lg border-2 border-accent outline-none px-4 py-2"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-accent py-3 text-white cursor-pointer"
              >
                Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
