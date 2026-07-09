import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";
emailjs.init("ZwiLIZoXfEYAsk8Za");

function TopUp({
  setLatestOrderId,
  selectedPackage,
}) {

    const [announcement, setAnnouncement] = useState("");
    const [announcementActive, setAnnouncementActive] = useState(false);

    useEffect(() => {

  const unsubscribe = onSnapshot(
    doc(db, "settings", "announcement"),
    (snap) => {

      if (snap.exists()) {

        setAnnouncement(
          snap.data().message
        );

        setAnnouncementActive(
          snap.data().active
        );

      }

    }
  );

  return () => unsubscribe();

}, []);


  const [uid, setUid] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [gamePackage, setGamePackage] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalGold, setTotalGold] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");


useEffect(() => {
  if (selectedPackage) {
    setGamePackage(selectedPackage);
  }
}, [selectedPackage]);

    const isStrikePass =
  gamePackage === "Strike Pass Elite" ||
  gamePackage === "Strike Pass Premium";

    useEffect(() => {

 const packages = {
  "50 + 6 Golds": {
    gold: 56,
    price: 175,
  },
  "100 + 16 Golds": {
    gold: 116,
    price: 350,
  },
  "300 + 52 Golds": {
    gold: 352,
    price: 1050,
  },
  "500 + 94 Golds": {
    gold: 594,
    price: 1750,
  },
  "1000 + 210 Golds": {
    gold: 1210,
    price: 3500,
  },
  "2000 + 486 Golds": {
    gold: 2486,
    price: 7000,
  },
  "5000 + 1380 Golds": {
    gold: 6380,
    price: 17500,
  },
  "Strike Pass Elite": {
    gold: 0,
    price: 1400,
  },
  "Strike Pass Premium": {
    gold: 0,
    price: 3150,
  },
};


  if(gamePackage && packages[gamePackage]){

    const selected = packages[gamePackage];

    setTotalGold(selected.gold * quantity);

    setTotalPrice(selected.price * quantity);

  }else{

    setTotalGold(0);
    setTotalPrice(0);

  }

}, [gamePackage, quantity]);

const finalPrice = Math.max(
  totalPrice - couponDiscount,
  0
);

const handleApplyCoupon = async () => {

  if (!couponCode) {
    setCouponMessage("Enter coupon code");
    return;
  }

  try {

    const snapshot = await getDocs(
      collection(db, "coupons")
    );

    const coupon = snapshot.docs
      .map((doc)=>({
        id: doc.id,
        ...doc.data()
      }))
      .find(
        (c)=>c.code === couponCode.toUpperCase()
      );


    if (!coupon) {
      setCouponMessage("❌ Invalid Coupon");
      setCouponDiscount(0);
      return;
    }


    if (!coupon.active) {
      setCouponMessage("❌ Coupon Disabled");
      return;
    }


    const today = new Date();
    const expiryDate = new Date(coupon.expiry);


    if (expiryDate < today) {
      setCouponMessage("❌ Coupon Expired");
      return;
    }


    if (totalPrice < coupon.minOrder) {

      setCouponMessage(
        `Minimum order Rs.${coupon.minOrder}`
      );

      return;

    }


    setCouponDiscount(coupon.discount);
    setCouponApplied(true);

    setCouponMessage(
      `✅ Coupon Applied - Rs.${coupon.discount} OFF`
    );


  }catch(error){

  console.error("Coupon Error:", error);

  setCouponMessage(error.message);

}

};

  const handleSubmit = () => {
    if (
  uid === "" ||
  gamePackage === "" ||
  whatsapp === "" ||
  email === ""
) {
      setMessage("❌ Please fill all required fields.");
      return;
    }

    setMessage("");
    setShowSummary(true);
    setLoading(false);

    console.log({
      uid,
      playerName,
      gamePackage,
      whatsapp,
    });
  };

const uploadSlip = async () => {
  const formData = new FormData();

  formData.append("file", paymentSlip);
  formData.append("upload_preset", "strikepay_slips");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/po8of84s/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  return data.secure_url;
};

const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(orderId);
    alert("✅ Order ID Copied!");
  } catch (err) {
    console.error(err);
  }
};

  const checkMyOrder = () => {
  setOrderSuccess(false);

  const tracker = document.querySelector(".tracker");

  if (tracker) {
    tracker.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
};

 const handleConfirmOrder = async () => {

  if (!paymentSlip) {
    alert("Please upload your payment slip.");
    return;
  }

  const randomId = "SP-" + Math.floor(1000 + Math.random() * 9000);

setOrderId(randomId);
setLatestOrderId(randomId);

setLoading(true);
  try {

    const slipUrl = await uploadSlip();

    await addDoc(collection(db, "orders"), {

  orderId: randomId,

  uid: uid,

  playerName: playerName,

  email: email,

  package: gamePackage,

  quantity: quantity,


  // Original price
  originalPrice: totalPrice,


  // Discount
  discount: couponDiscount,


  // Coupon name
  coupon: couponApplied
    ? couponCode.toUpperCase()
    : "",


  // Final price after discount
  price: finalPrice,


  whatsapp: whatsapp,

  slip: slipUrl,

  status: "Pending",

  createdAt: serverTimestamp(),

});
    try {

await emailjs.send(
  "service_aplvnsj",
  "template_omcjxmv",
  {
    to_email: email,
    player_name: playerName,
    order_id: randomId,
    uid: uid,
    package: gamePackage,
    quantity: quantity,
    price: finalPrice,
    whatsapp: whatsapp,
  },
  "ZwiLIZoXfEYAsk8Za"
);

console.log("Email Sent");

}
catch(emailError){

console.log("Email Failed:", emailError);

}

    const discordRes = await fetch("/.netlify/functions/discord", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  orderId: randomId,
  uid,
  playerName,
  package: gamePackage,
  quantity,
  price: finalPrice,

originalPrice: totalPrice,

discount: couponDiscount,

coupon: couponApplied
  ? couponCode.toUpperCase()
  : "",
  whatsapp,
  slip: slipUrl,
}),
});

console.log("Discord:", discordRes.status);

    setOrderSuccess(true);

    setShowSummary(false);

    setUid("");
    setPlayerName("");
    setGamePackage("");
    setWhatsapp("");
    setEmail("");
    setPaymentSlip(null);
    setShowSummary(false);
    setLoading(false);
    setQuantity(1);
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponMessage("");

} 
  
  catch (error) {

  console.error("ERROR:", error);

  alert(
    "Order saved successfully, but email notification failed."
  );

}
finally {

  setLoading(false);

}

};
  return (
    <section
  className="topup"
  id="topup"
>
  {announcementActive && announcement && (

  <div className="announcement-banner">

    📢 {announcement}

  </div>

)}
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

        <input
           type="email"
           placeholder="Email Address"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
        />

         <select
  value={gamePackage}
  onChange={(e) => setGamePackage(e.target.value)}
>
  <option value="">Select Package</option>

  <option>50 + 6 Golds</option>
  <option>100 + 16 Golds</option>
  <option>300 + 52 Golds</option>
  <option>500 + 94 Golds</option>
  <option>1000 + 210 Golds</option>
  <option>2000 + 486 Golds</option>
  <option>5000 + 1380 Golds</option>
  <option>Strike Pass Elite</option>
  <option>Strike Pass Premium</option>
</select>

        {gamePackage && !isStrikePass && (
  <>
    <p className="quantity-hint">
      💡 Need more Gold? Increase quantity below.
    </p>

    <div className="quantity-box">

      <h4>Quantity</h4>

      <div className="quantity-controls">

        <button
          type="button"
          onClick={() =>
            setQuantity(quantity > 1 ? quantity - 1 : 1)
          }
        >
          -
        </button>

        <span>{quantity}</span>

        <button
          type="button"
          onClick={() =>
            setQuantity(quantity + 1)
          }
        >
          +
        </button>

      </div>


      <div className="total-box">

        <p>
          🪙 Total Gold:
          <b> {totalGold} Golds</b>
        </p>

        <p>
          💰 Total Price:
         <b> Rs. {totalPrice.toLocaleString()}</b>
        </p>

      </div>


    </div>
  </>
)}

        <input
          type="tel"
          placeholder="WhatsApp Number"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <input
  type="text"
  placeholder="Coupon Code (Optional)"
  value={couponCode}
  onChange={(e) => setCouponCode(e.target.value)}
/>

<button
  type="button"
  className="apply-coupon-btn"
  onClick={handleApplyCoupon}
>
  Apply Coupon
</button>

{couponMessage && (
  <p className="coupon-message">
    {couponMessage}
  </p>
)}

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
          <p><b>Quantity:</b> {quantity}</p>

          <div className="price-summary">

  <p>
    💰 Original Price:
    <b> Rs. {totalPrice.toLocaleString()}</b>
  </p>


  {couponApplied && (
    <>
      <p>
        🎟 Coupon:
        <b> {couponCode.toUpperCase()}</b>
      </p>

      <p>
        💸 Discount:
        <b> - Rs. {couponDiscount.toLocaleString()}</b>
      </p>
    </>
  )}


  <hr />


  <h3>
    ✅ Final Price:
    Rs. {Math.max(
      totalPrice - couponDiscount,
      0
    ).toLocaleString()}
  </h3>

</div>


          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPaymentSlip(e.target.files[0])}
          />

          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={loading}
>
            {loading ? "⏳ Processing..." : "Confirm Order"}
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

    <div className="success-buttons">

      <button
        className="copy-order-btn"
        onClick={copyOrderId}
      >
        📋 Copy Order ID
      </button>

      <button
        className="check-order-btn"
        onClick={checkMyOrder}
      >
        🔍 Check My Order
      </button>

    </div>

  </div>

)}
    </section>
  );
}

export default TopUp;