import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

function Auth({ onLoginSuccess }) {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div>
      {isSignIn ? (
        <SignIn
          onSwitchToSignUp={() => setIsSignIn(false)}
          onLoginSuccess={onLoginSuccess}
        />
      ) : (
        <SignUp onSwitchToSignIn={() => setIsSignIn(true)} />
      )}
    </div>
  );
}

export default Auth;
