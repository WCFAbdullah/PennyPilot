import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./webpages/landingpage";
import Dashboard from "./webpages/dashboard";
import SignInPage from "./webpages/signin";
import Navbar from "./webpages/navbar";
import SignUpPage from "./webpages/signup";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      {/* Public routes accessible to all */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />  {/* Add sign-up route */}
      
      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <Navigate to="/sign-in" />
            </SignedOut>
          </>
        }
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;