import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Packages from "./components/Packages";
import WhatsAppButton from "./components/WhatsAppButton";
import Features from "./components/Features";
import Payment from "./components/Payment";
import TopUp from "./components/TopUp";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import OrderTracker from "./components/OrderTracker";
import AuthModal from "./components/AuthModal"

import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "./firebase";
import CustomerDashboard from "./components/CustomerDashboard";

function App() {

  const [latestOrderId, setLatestOrderId] = useState("");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const handleLogout = async () => {

  const auth = getAuth();

  await signOut(auth);

};

  useEffect(() => {

const auth = getAuth();


const unsubscribe = onAuthStateChanged(
auth,
async(currentUser)=>{


setUser(currentUser);


if(currentUser){


const userRef = doc(
db,
"users",
currentUser.uid
);


const userSnap = await getDoc(userRef);


if(userSnap.exists()){

setUserData(userSnap.data());

}

}
else{

setUserData(null);

}


});


return ()=>unsubscribe();


},[]);

  return (
    <>
      <Navbar
  user={user}
  logout={handleLogout}
  openLogin={() => {
    setAuthTab("login");
    setShowAuthModal(true);
  }}
  openSignup={() => {
    setAuthTab("signup");
    setShowAuthModal(true);
  }}
/>

      <Hero />

      <Packages setSelectedPackage={setSelectedPackage} />

      <Features />

      <Payment />
      
      <TopUp
        setLatestOrderId={setLatestOrderId}
          selectedPackage={selectedPackage}
      />

      <OrderTracker 
         latestOrderId={latestOrderId}
      />

      <WhatsAppButton />

      {user && user.email === "shaviyastream@gmail.com" && (
  <Admin />
)}

{user && user.email !== "YOUR_ADMIN_EMAIL" && (
  <CustomerDashboard />
)}

<AuthModal
  open={showAuthModal}
  onClose={() => setShowAuthModal(false)}
  defaultTab={authTab}
/>

      <Footer />
    </>
  );
}

export default App;