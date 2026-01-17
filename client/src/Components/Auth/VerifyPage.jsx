import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        await axios.post("/api/auth/verify-user", { token });
        setStatus("success");

        // redirect after success
        setTimeout(() => navigate("/"), 2000);
      } catch (err) {
        setStatus("error");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "loading" && <p>Verifying your email...</p>}
      {status === "success" && (
        <p className="text-green">Email verified successfully 🎉</p>
      )}
      {status === "error" && (
        <p className="text-red">Verification link is invalid or expired.</p>
      )}
    </div>
  );
};

export default VerifyPage;
