import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

function OrderTracker({ latestOrderId }) {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📋 Copy Order ID

  // 🔍 Check Order (Realtime)
  const checkOrder = () => {
    if (!orderId.trim()) {
      setOrder(null);
      return () => {};
    }

    setLoading(true);

    const q = query(
      collection(db, "orders"),
      where("orderId", "==", orderId.trim())
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          setOrder(snapshot.docs[0].data());
        } else {
          setOrder("NOT_FOUND");
        }

        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  // Auto fill latest Order ID
  useEffect(() => {
    if (latestOrderId) {
      setOrderId(latestOrderId);
    }
  }, [latestOrderId]);

  // Auto check when Order ID changes
  useEffect(() => {
    if (!orderId.trim()) return;

    const unsubscribe = checkOrder();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [orderId]);

  return (
    <section id="tracker" className="tracker">
      <h2>📦 Check Order Status</h2>

      <input
        type="text"
        placeholder="🔍 Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            checkOrder();
          }
        }}
      />

      <button onClick={checkOrder}>
        Check Status
      </button>

      {loading && (
        <p className="checking">
          ⏳ Checking your order...
        </p>
      )}

      {order === "NOT_FOUND" && (
        <p style={{ color: "red" }}>
          ❌ Order Not Found
        </p>
      )}

      

    {order && order !== "NOT_FOUND" && (

  <div className="tracker-result">

    <div className="tracker-title">
      <h3>{order.orderId}</h3>
    </div>

    <p>👤 {order.playerName}</p>
    <p>🎮 UID: {order.uid}</p>
    <p>💎 {order.package}</p>
    {order.quantity > 1 && (
  <p>
    📦 Quantity: {order.quantity}
  </p>
)}

    <div className="tracker-progress">

      <div
        className={
          order.status === "Pending" || !order.status
            ? "step active"
            : "step done"
        }
      >
        🟡 Pending
      </div>

      <div
        className={
          order.status === "Completed"
            ? "step done"
            : "step"
        }
      >
        🟢 Completed
      </div>

      <div
        className={
          order.status === "Cancelled"
            ? "step cancel"
            : "step"
        }
      >
        🔴 Cancelled
      </div>

    </div>

  </div>

)}
    </section>
  );
}

export default OrderTracker;