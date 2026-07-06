import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Packages from "./components/Packages";
import Features from "./components/Features";
import Payment from "./components/Payment";
import TopUp from "./components/TopUp";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import Login from "./components/Login";
import OrderTracker from "./components/OrderTracker";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {

  const [latestOrderId, setLatestOrderId] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();

  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Packages />
      <Features />
      <Payment />
      <TopUp setLatestOrderId={setLatestOrderId} />
      <OrderTracker latestOrderId={latestOrderId} />

      {user ? <Admin /> : <Login />}

      <Footer />
    </>
  );
}

export default App;