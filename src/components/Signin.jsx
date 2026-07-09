import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

function Signin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {

    const auth = getAuth();

    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("✅ Login Successful!");

    } catch (error) {

      alert(error.message);

    }

  };

  return (

    <section className="signin">

      <h2>Sign In</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleSignin}>
        Sign In
      </button>

    </section>

  );

}

export default Signin;