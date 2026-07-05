import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

function OrderTracker() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkOrder = async () => {
    if (!orderId) return;

    setLoading(true);
    setOrder(null);

    try {
      const q = query(
        collection(db, "orders"),
        where("orderId", "==", orderId.trim())
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setOrder(snapshot.docs[0].data());
      } else {
        setOrder("NOT_FOUND");
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <section className="tracker">

      <h2>📦 Check Order Status</h2>

      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <button onClick={checkOrder}>
        Check Status
      </button>

      {loading && <p>Checking...</p>}

      {order === "NOT_FOUND" && (
        <p style={{ color: "red" }}>
          ❌ Order Not Found
        </p>
      )}

      {order && order !== "NOT_FOUND" && (
        <div className="tracker-result">

          <h3>{order.orderId}</h3>

          <p>👤 {order.playerName}</p>

          <p>🎮 UID: {order.uid}</p>

          <p>💎 {order.package}</p>

          <p
            style={{
              color:
                order.status === "Completed"
                  ? "#22c55e"
                  : order.status === "Cancelled"
                  ? "#ef4444"
                  : "#facc15",
              fontWeight: "bold",
            }}
          >
            📌 {order.status}
          </p>

        </div>
      )}

    </section>
  );
}

export default OrderTracker;