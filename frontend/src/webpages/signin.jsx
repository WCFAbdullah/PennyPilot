import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn 
        routing="path" 
        path="/sign-in" 
        redirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  );
}

export default SignInPage;