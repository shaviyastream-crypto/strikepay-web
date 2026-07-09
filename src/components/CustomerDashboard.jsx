import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function CustomerDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {

  const auth = getAuth();


  if (!auth.currentUser) return;


  const q = query(
    collection(db, "orders"),
    where(
      "email",
      "==",
      auth.currentUser.email
    )
  );


  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {


      const orderList = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );


      setOrders(orderList);


    }
  );


  return () => unsubscribe();


}, []);

  const completed = orders.filter(
    (o) => o.status === "Completed"
  ).length;

  const pending = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.price || 0),
    0
  );

  return (
  <section className="customer-dashboard">

    <h2>👤 My Dashboard</h2>

    <div className="customer-stats">

      <div className="customer-card">
        <h3>{orders.length}</h3>
        <p>Total Orders</p>
      </div>

      <div className="customer-card">
        <h3>{completed}</h3>
        <p>Completed</p>
      </div>

      <div className="customer-card">
        <h3>{pending}</h3>
        <p>Pending</p>
      </div>

      <div className="customer-card">
        <h3>Rs. {totalSpent.toLocaleString()}</h3>
        <p>Total Spent</p>
      </div>

    </div>

    <h2 className="orders-title">
      📦 My Orders
    </h2>

    <div className="customer-orders">

      {orders.length === 0 ? (

        <p>No Orders Found.</p>

      ) : (

        orders.map((order) => (

          <div key={order.id} className="customer-order-card">

            <h3>{order.orderId}</h3>

            <p>🎮 UID : {order.uid}</p>

            <p>👤 Player : {order.playerName}</p>

            <p>💎 Package : {order.package}</p>

            <p>📦 Quantity : {order.quantity}</p>

            <p>💰 Price : Rs. {(order.price || 0).toLocaleString()}</p>

            <p>📧 {order.email}</p>

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

        ))

      )}

    </div>

  </section>
);
}

export default CustomerDashboard;