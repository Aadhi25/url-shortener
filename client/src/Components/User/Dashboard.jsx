// Dashboard should have all the short url created by the user and an input field to create new short url

import Nav from "./Nav";
import UrlForm from "./UrlForm";
import UrlTable from "./UrlTable";

const Dashboard = () => {
  return (
    <div className="font-lato">
      <Nav />
      <UrlForm />
      <UrlTable />
    </div>
  );
};

export default Dashboard;
