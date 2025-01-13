import React from 'react';
import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <div className="h-full flex flex-col justify-center items-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-lg text-white mt-2">
            Sign in to continue to PennyPilot
          </p>
        </div>
        
        <SignIn 
          routing="path" 
          path="/sign-in" 
          afterSignIn={{
            redirectUrl: "/dashboard"
          }}
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}

export default SignInPage;