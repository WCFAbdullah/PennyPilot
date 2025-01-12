import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp 
        routing="path" 
        path="/sign-up" 
        redirectToAfterSignUp="/dashboard"
      />
    </div>
  );
}

export default SignUpPage;