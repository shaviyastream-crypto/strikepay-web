import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import "./Signup.css";
import { updateProfile } from "firebase/auth";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const handleSignup = async () => {

    if (password !== confirmPassword) {
  alert("Passwords do not match.");
  return;
}

    const auth = getAuth();

    try {

      const userCredential =
  await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(
userCredential.user,
{
displayName:name,
}
);

await setDoc(
  doc(db, "users", userCredential.user.uid),
  {
  name,
  email,
  createdAt: serverTimestamp(),
  role: "customer",
  points: 0,
}
);

      alert("✅ Account Created Successfully!");

      setEmail("");
      setPassword("");

    } catch (error) {

      alert(error.message);

    }

  };

  return (

    <section className="signup">

      <h2>Create Account</h2>

      <input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={(e) =>
    setName(e.target.value)
  }
/>

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

      <input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(e.target.value)
  }
/>

<input
  type="text"
  placeholder="WhatsApp Number"
  value={whatsapp}
  onChange={(e) =>
    setWhatsapp(e.target.value)
  }
/>

      <button onClick={handleSignup}>
        Sign Up
      </button>

    </section>

  );

}

export default Signup;