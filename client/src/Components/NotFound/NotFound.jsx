import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <p className="text-xl mb-6">Page not found.</p>
      <Link to="/" className="px-4 py-2 bg-accent text-white rounded-lg">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
