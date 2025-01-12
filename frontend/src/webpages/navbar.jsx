import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          PennyPilot
        </Link>
        
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link to="/dashboard" className="px-4 py-2 text-black rounded">
              Dashboard
            </Link>
            <UserButton afterSignOutAllUrl="/" />
          </SignedIn>
          
          <SignedOut>
            <Link to="/sign-in" className="px-4 py-2 text-black rounded">
              Sign In
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;