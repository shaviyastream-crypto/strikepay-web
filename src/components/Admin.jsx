import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import notificationSound from "../assets/notification.mp3";
import emailjs from "@emailjs/browser";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [filter, setFilter] = useState("All");
  const lastOrderCount = useRef(0);
  const [notification, setNotification] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const navigate = useNavigate();
  const handleLogout = async () => {
  const auth = getAuth();

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/login");
    }
  });

  return () => unsubscribe();
}, [navigate]);

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
  try {
    // Order එක හොයාගන්න
    const order = orders.find((o) => o.id === id);

    // Firestore Update
    await updateDoc(doc(db, "orders", id), {
      status,
    });

    if (status === "Completed") {
      console.log(order);
      console.log("EMAIL:", order.email);
  try {
    await emailjs.send(
      "service_aplvnsj",
      "template_an4c8rw",
      {
        to_email: order.email,
        player_name: order.playerName,
        order_id: order.orderId,
        uid: order.uid,
        package: order.package,
      },
      "ZwiLIZoXfEYAsk8Za"
    );

    console.log("✅ Completion email sent");
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
}

    // UI Update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status } : o
      )
    );

    // Discord Status Update
    await fetch("/.netlify/functions/discord-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: order.orderId,
        playerName: order.playerName,
        uid: order.uid,
        package: order.package,
        status: status,
      }),
    });

  } catch (error) {
    console.error("Update Error:", error);
  }
};

  // 🗑 DELETE ORDER
  const archiveOrder = async (id) => {
  const confirmArchive = window.confirm(
    "Archive this order?"
  );

  if (!confirmArchive) return;

  try {
    await updateDoc(doc(db, "orders", id), {
      archived: true,
    });

    setOrders((prev) =>
      prev.filter((order) => order.id !== id)
    );
  } catch (error) {
    console.error(error);
    alert("Failed to archive order");
  }
};

  // 📥 FETCH ORDERS
  // 📥 FETCH ORDERS
useEffect(() => {

  const unsubscribe = onSnapshot(
    query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    ),

    (snapshot) => {

      const orderList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((order) => !order.archived);

      setOrders(orderList);

      if (isFirstLoad) {
  setIsFirstLoad(false);
} else {
  const added = snapshot.docChanges().find(
    (change) => change.type === "added"
  );

  if (added) {
    const latestOrder = {
      id: added.doc.id,
      ...added.doc.data(),
    };

    setNotification(latestOrder);

    const audio = new Audio(notificationSound);

    audio.play().catch((err) => {
      console.log(err);
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }
}

    },

    (error) => {
      console.error(error);
    }

  );

  return () => unsubscribe();

}, [isFirstLoad]);

const packagePrices = {
  "50 + 6 Golds": 175,
  "100 + 16 Golds": 350,
  "300 + 52 Golds": 1050,
  "500 + 94 Golds": 1750,
  "1000 + 210 Golds": 3500,
  "2000 + 486 Golds": 7000,
  "5000 + 1380 Golds": 17500,
  "Strike Pass Elite": 1400,
  "Strike Pass Premium": 3150,
};

  const pending = orders.filter(
  (o) => o.status === "Pending" || !o.status
).length;

const completed = orders.filter(
  (o) => o.status === "Completed"
).length;

const cancelled = orders.filter(
  (o) => o.status === "Cancelled"
).length;

const revenue = orders .
filter((o) => o.status === "Completed") 
.reduce((total, order) => { 
  const price = Number( 
    order.package?.match(/\d+/g)?.pop() || 0 ); 
    return total + price; }, 0);

    const totalRevenue = orders.reduce((total, order) => {
  const price = packagePrices[order.package] || 0;
  const quantity = order.quantity || 1;

  if (order.status === "Completed") {
    return total + price * quantity;
  }

  return total;
}, 0);

const today = new Date().toDateString();

const ordersToday = orders.filter((order) => {
  if (!order.createdAt) return false;

  const date =
    order.createdAt.seconds
      ? new Date(order.createdAt.seconds * 1000)
      : new Date(order.createdAt);

  return date.toDateString() === today;
}).length;

const revenueToday = orders
  .filter((order) => {
    if (!order.createdAt) return false;

    const date =
      order.createdAt.seconds
        ? new Date(order.createdAt.seconds * 1000)
        : new Date(order.createdAt);

    return (
      date.toDateString() === today &&
      order.status === "Completed"
    );
  })
  .reduce((total, order) => { 
    const price = Number( order.package?.match(/\d+/g)?.pop() || 0 ); 
    return total + price; }, 0)

  return (


    <section className="admin">

      <div className="admin-header">

  <div>
    <h2>🩸 StrikePay Admin</h2>
    <p>Manage Blood Strike Orders</p>
  </div>

  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    🚪 Logout
  </button>

</div>


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

  <div className="stat-card">
  <h3>Total Revenue</h3>
  <h2>
    Rs. {totalRevenue.toLocaleString()}
  </h2>
</div>

</div>

<div className="stat-card">
  <h3>📦 Orders Today</h3>
  <h2>{ordersToday}</h2>
</div>

<div className="stat-card">
  <h3>💰 Today Revenue</h3>
 <h2>Rs. {revenueToday}</h2>
  </div>

<div className="filter-buttons">

  <button onClick={() => setFilter("All")}>
    All
  </button>

  <button onClick={() => setFilter("Pending")}>
    🟡 Pending
  </button>

  <button onClick={() => setFilter("Completed")}>
    🟢 Completed
  </button>

  <button onClick={() => setFilter("Cancelled")}>
    🔴 Cancelled
  </button>

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

    if (filter !== "All") {
      if ((order.status || "Pending") !== filter) {
        return false;
      }
    }

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
            <p>
                🕒{" "}
              {order.createdAt
              ? (
                 order.createdAt.seconds
               ? new Date(order.createdAt.seconds * 1000)
               : new Date(order.createdAt)
                    ).toLocaleString()
                : "No Date"}
            </p>
            <p>📧 {order.email}</p>

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
  className="slip-btn"
  onClick={() => setSelectedSlip(order.slip)}
>
  📷 View Slip
</button>

              <button
  className="archive-btn"
  onClick={() => archiveOrder(order.id)}
>
  📦 Archive
</button>

            </div>

          </div>
        ))}

        {selectedSlip && (
  <div className="slip-modal">

    <div className="slip-content">

      <button
        className="close-btn"
        onClick={() => setSelectedSlip(null)}
      >
        ✖
      </button>

      <img
        src={selectedSlip}
        alt="Payment Slip"
      />

    </div>

  </div>
)}

{notification && (
  <div className="notification-popup">

    <h3>🔔 New Order</h3>

    <p>
      <strong>{notification.orderId}</strong>
    </p>

    <p>{notification.playerName}</p>

    <p>{notification.package}</p>

  </div>
)}

    </section>
  );
}

export default Admin;