import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { PiCoins } from "react-icons/pi";

function Navbar() {
  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white hover:text-gray-300 transition duration-150">
            <PiCoins className="h-8 w-8" />
            <span>PennyPilot</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <SignedIn>
              <Link 
                to="/dashboard" 
                className="px-6 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition duration-150"
              >
                Dashboard
              </Link>
              <UserButton 
                afterSignOutAllUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-blue-400 hover:border-blue-300 transition duration-150"
                  }
                }}
              />
            </SignedIn>
            
            <SignedOut>
              <Link 
                to="/sign-in" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
              >
                Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;