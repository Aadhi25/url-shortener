import { BrowserRouter, Routes, Route } from "react-router-dom";
import UrlProvider from "./context/UrlContext/UrlProvider";
import Guest from "./Components/Guest/Guest";
import PrivateRoute from "./Routes/PrivateRoute";
import Dashboard from "./Components/User/Dashboard";

const App = () => {
  return (
    <UrlProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Guest />} />

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
