import { BrowserRouter, Routes, Route } from "react-router-dom";
import UrlProvider from "./context/UrlContext/UrlProvider";
import Guest from "./Components/Guest/Guest";
import PrivateRoute from "./Routes/PrivateRoute";
import Dashboard from "./Components/User/Dashboard";
import VerifyPage from "./Components/Auth/VerifyPage";
import NotFound from "./Components/NotFound/NotFound";

const App = () => {
  return (
    <UrlProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Guest />} />

          {/* Auth verify route */}
          <Route path="/auth/verify-user" element={<VerifyPage />} />

          {/* Not found page */}
          <Route path="*" element={<NotFound />} />
          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </UrlProvider>
  );
};

export default App;
