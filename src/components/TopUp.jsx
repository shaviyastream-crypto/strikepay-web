import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function TopUp() {
  const [uid, setUid] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [gamePackage, setGamePackage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handleSubmit = () => {
    if (uid === "" || gamePackage === "" || whatsapp === "") {
      setMessage("❌ Please fill all required fields.");
      return;
    }

    setMessage("");
    setShowSummary(true);

    console.log({
      uid,
      playerName,
      gamePackage,
      whatsapp,
    });
  };

 const handleConfirmOrder = async () => {

  if (!paymentSlip) {
    alert("Please upload your payment slip.");
    return;
  }

  const randomId = "SP-" + Math.floor(1000 + Math.random() * 9000);

  setOrderId(randomId);

  try {

    await addDoc(collection(db, "orders"), {

      orderId: randomId,
      uid: uid,
      playerName: playerName,
      package: gamePackage,
      whatsapp: whatsapp,
      status: "Pending",
      createdAt: new Date(),

    });

    await fetch("/.netlify/functions/discord", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    orderId: randomId,
    uid,
    playerName,
    package: gamePackage,
    whatsapp,
  }),
});

    setOrderSuccess(true);

  } catch (error) {

    console.error(error);

    alert("Failed to save order.");

  }

};
  return (
    <section className="topup">
      <h2>Blood Strike Top Up</h2>

      <form className="topup-form">
        <input
          type="text"
          placeholder="Blood Strike UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
        />

        <input
          type="text"
          placeholder="Player Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <select
          value={gamePackage}
          onChange={(e) => setGamePackage(e.target.value)}
        >
          <option value="">Select Package</option>
          <option>100 Gold - Rs.280</option>
          <option>300 Gold - Rs.780</option>
          <option>500 Gold - Rs.1250</option>
          <option>1000 Gold - Rs.2450</option>
        </select>

        <input
          type="tel"
          placeholder="WhatsApp Number"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <button
          type="button"
          onClick={handleSubmit}
        >
          Continue
        </button>

        {message && (
          <p className="message">
            {message}
          </p>
        )}
      </form>

      {showSummary && (
        <div className="summary">
          <h3>Order Summary</h3>

          <p><b>UID:</b> {uid}</p>
          <p><b>Player:</b> {playerName}</p>
          <p><b>Package:</b> {gamePackage}</p>
          <p><b>WhatsApp:</b> {whatsapp}</p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPaymentSlip(e.target.files[0])}
          />

          <button
            type="button"
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </button>
        </div>
      )}
      {orderSuccess && (

  <div className="success-card">

    <h2>🎉 Order Submitted!</h2>
    <p>
  <strong>Order ID:</strong> {orderId}
</p>

<p>
  <strong>Status:</strong> Pending
</p>

    <p>
      Thank you for your order.
    </p>

    <p>
      We will verify your payment and complete your top up soon.
    </p>

  </div>

)}
    </section>
  );
}

export default TopUp;