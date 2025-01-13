import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <div className="h-full flex flex-col justify-center items-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Welcome to PennyPilot
          </h1>
        </div>
        
        <SignUp 
          routing="path" 
          path="/sign-up" 
          redirectToAfterSignUp="/dashboard"
        />
      </div>
    </div>
  );
}

export default SignUpPage;