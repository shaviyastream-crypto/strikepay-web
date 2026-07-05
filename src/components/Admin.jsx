import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        status: status,
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  // 🗑 DELETE ORDER
  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "orders", id));

      setOrders((prev) =>
        prev.filter((order) => order.id !== id)
      );
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete order");
    }
  };

  // 📥 FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));

        const orderList = [];

        querySnapshot.forEach((doc) => {
          orderList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setOrders(orderList);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const pending = orders.filter(
  (o) => o.status === "Pending" || !o.status
).length;

const completed = orders.filter(
  (o) => o.status === "Completed"
).length;

const cancelled = orders.filter(
  (o) => o.status === "Cancelled"
).length;

const revenue = orders
  .filter((o) => o.status === "Completed")
  .reduce((total, order) => {
    const price = Number(
      order.package?.match(/\d+/g)?.pop() || 0
    );
    return total + price;
  }, 0);

  return (

    <section className="admin">

      <h2>Admin Dashboard</h2>
      <p>All Blood Strike Orders</p>

      <div className="stats">

  <div className="stat-card">
    <h3>🟡 Pending</h3>
    <h2>{pending}</h2>
  </div>

  <div className="stat-card">
    <h3>🟢 Completed</h3>
    <h2>{completed}</h2>
  </div>

  <div className="stat-card">
    <h3>🔴 Cancelled</h3>
    <h2>{cancelled}</h2>
  </div>

  <div className="stat-card">
    <h3>💰 Revenue</h3>
    <h2>Rs. {revenue}</h2>
  </div>

</div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search Order ID, UID, Player..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {/* ORDERS */}
      {orders
        .filter((order) => {
          const text = search.toLowerCase();

          return (
            order.orderId?.toLowerCase().includes(text) ||
            order.playerName?.toLowerCase().includes(text) ||
            order.uid?.toLowerCase().includes(text) ||
            order.whatsapp?.toLowerCase().includes(text)
          );
        })
        .map((order) => (
          <div key={order.id} className="admin-card">

            <h3>{order.orderId}</h3>

            <p>👤 {order.playerName}</p>
            <p>🎮 UID: {order.uid}</p>
            <p>💎 {order.package}</p>
            <p>📱 {order.whatsapp}</p>

            {/* STATUS */}
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
              📌 Status: {order.status || "Pending"}
            </p>

            {/* ACTIONS */}
            <div className="admin-actions">

              <button
                className="approve-btn"
                onClick={() => updateStatus(order.id, "Completed")}
              >
                ✅ Approve
              </button>

              <button
                className="reject-btn"
                onClick={() => updateStatus(order.id, "Cancelled")}
              >
                ❌ Reject
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteOrder(order.id)}
              >
                🗑 Delete
              </button>

            </div>

          </div>
        ))}
    </section>
  );
}

export default Admin;