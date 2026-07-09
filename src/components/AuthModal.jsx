import { useState, useEffect } from "react";
import CustomerLogin from "./CustomerLogin";
import Signup from "./Signup";

function AuthModal({
  open,
  onClose,
  defaultTab,
}) {
  const [isLogin, setIsLogin] = useState(defaultTab === "login");
  useEffect(() => {
  setIsLogin(defaultTab === "login");
}, [defaultTab]);

  if (!open) return null;

  return (
    <div className="auth-overlay">

      <div className="auth-modal">

        <button
          className="close-modal"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="auth-switch">

          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>

        </div>

        {isLogin ? <CustomerLogin /> : <Signup />}

      </div>

    </div>
  );
}

export default AuthModal;