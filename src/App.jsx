import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Packages from "./components/Packages";
import Features from "./components/Features";
import Payment from "./components/Payment";
import TopUp from "./components/TopUp";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import { useState } from "react";
import Login from "./components/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Navbar />
      <Hero />
      <Packages />
      <Features />
      <Payment />
      <TopUp />

      {isLoggedIn ? (
        <Admin />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}

      <Footer />
    </>
  );
}

export default App;