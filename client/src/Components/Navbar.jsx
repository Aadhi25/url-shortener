const Navbar = () => {
  return (
    <header>
      <nav className="flex justify-between items-center w-[90%] mx-auto my-5">
        <div>
          <h1 className="text-2xl font-bold">Shrink.It</h1>
        </div>
        <div flex md:flex-row flex-col>
          <button className="bg-accent text-primary px-5 py-2 rounded-lg cursor-pointer border-none hover:bg-accentHover duration-300">
            Sign Up
          </button>
          <button className="px-5 py-2 bg-primary border-1 rounded-lg border-accent text-secondary mx-2 cursor-pointer hover:bg-accent duration-400 hover:text-primary">
            Log In
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

// px-5 py-2 bg-primary border-2 rounded-lg border-accent text-secondary mx-2 cursor-pointer hover:bg-accent duration-400 hover:text-primary
