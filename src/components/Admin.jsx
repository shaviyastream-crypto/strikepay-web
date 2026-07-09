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
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import notificationSound from "../assets/notification.mp3";
import emailjs from "@emailjs/browser";

function Admin() {
  const [coupons, setCoupons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [filter, setFilter] = useState("All");
  const lastOrderCount = useRef(0);
  const [notification, setNotification] = useState(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [announcement, setAnnouncement] = useState("");
const [announcementActive, setAnnouncementActive] = useState(true);

  const [couponCode, setCouponCode] = useState("");
const [discount, setDiscount] = useState("");
const [minOrder, setMinOrder] = useState("");
const [expiry, setExpiry] = useState("");
  const navigate = useNavigate();
  const createCoupon = async () => {

  if (!couponCode || !discount) {
    alert("Fill all required fields");
    return;
  }

  await addDoc(collection(db, "coupons"), {
    code: couponCode.toUpperCase(),
    discount: Number(discount),
    minOrder: Number(minOrder || 0),
    expiry,
    active: true,
    createdAt: new Date(),
  });

  alert("✅ Coupon Created");

  setCouponCode("");
  setDiscount("");
  setMinOrder("");
  setExpiry("");

};

const deleteCoupon = async (id) => {

  const ok = window.confirm(
    "Delete this coupon?"
  );

  if (!ok) return;

  await deleteDoc(doc(db, "coupons", id));

  setCoupons((prev) =>
    prev.filter((coupon) => coupon.id !== id)
  );

};

const toggleCoupon = async (coupon) => {

  await updateDoc(
    doc(db, "coupons", coupon.id),
    {
      active: !coupon.active,
    }
  );

  setCoupons((prev) =>
    prev.map((c) =>
      c.id === coupon.id
        ? { ...c, active: !c.active }
        : c
    )
  );

};

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
    quantity: order.quantity,
    price: order.price,
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
        quantity: order.quantity,
        price: order.price,
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

useEffect(() => {

  const loadCoupons = async () => {

    const snapshot = await getDocs(
      collection(db, "coupons")
    );

    setCoupons(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );

  };

  loadCoupons();

}, []);

const saveAnnouncement = async () => {

  await setDoc(
    doc(db, "settings", "announcement"),
    {
      message: announcement,
      active: announcementActive,
    }
  );

  alert("✅ Announcement Saved");

};

useEffect(() => {

  const loadAnnouncement = async () => {

    const snap = await getDoc(
      doc(db, "settings", "announcement")
    );

    if (snap.exists()) {

      setAnnouncement(snap.data().message);

      setAnnouncementActive(
        snap.data().active
      );

    }

  };

  loadAnnouncement();

}, []);

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

const revenue = orders.reduce((total, order) => {
  if (order.status !== "Completed") return total;

  const price = packagePrices[order.package] || 0;
  const quantity = order.quantity || 1;

  return total + price * quantity;
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

    const price = packagePrices[order.package] || 0;

    const quantity = order.quantity || 1;

    return total + price * quantity;

  },0);

  const totalCustomers = new Set(
  orders
    .filter(order => order.email)
    .map(order => order.email)
).size;

const packageStats = {};

orders.forEach((order) => {

  if (order.status !== "Completed") return;

  if (!packageStats[order.package]) {
    packageStats[order.package] = 0;
  }

  packageStats[order.package] += order.quantity || 1;

});

const mostSoldPackage =
  Object.entries(packageStats).sort(
    (a, b) => b[1] - a[1]
  )[0];

const pendingOrders = orders.filter(
  (order) =>
    (order.status || "Pending") === "Pending"
).length;

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

<hr style={{ margin: "40px 0" }} />

<h2>📢 Announcement</h2>

<div className="coupon-form">

  <input
    type="text"
    placeholder="Announcement Message"
    value={announcement}
    onChange={(e) =>
      setAnnouncement(e.target.value)
    }
  />

  <label>

    <input
      type="checkbox"
      checked={announcementActive}
      onChange={(e) =>
        setAnnouncementActive(
          e.target.checked
        )
      }
    />

    Active

  </label>

  <button onClick={saveAnnouncement}>
    Save
  </button>

</div>

<hr style={{ margin: "40px 0" }} />

<h2>🎟 Coupon Manager</h2>

<div className="coupon-form">

  <input
  type="text"
  placeholder="Coupon Code"
  value={couponCode}
  onChange={(e)=>setCouponCode(e.target.value)}
/>

  <input
  type="number"
  placeholder="Discount (Rs)"
  value={discount}
  onChange={(e)=>setDiscount(e.target.value)}
/>

  <input
  type="number"
  placeholder="Minimum Order"
  value={minOrder}
  onChange={(e)=>setMinOrder(e.target.value)}
/>

  <input
  type="date"
  value={expiry}
  onChange={(e)=>setExpiry(e.target.value)}
/>
  <button onClick={createCoupon}>
  Create Coupon
</button>

</div>

<h3 style={{ marginTop: "30px" }}>
  🎟 Available Coupons
</h3>

<div className="coupon-list">

  {coupons.length === 0 ? (

    <p>No Coupons Found</p>

  ) : (

    coupons.map((coupon) => (

      <div
        key={coupon.id}
        className="coupon-card"
      >

        <h3>{coupon.code}</h3>

        <p>
          💰 Discount :
          Rs. {coupon.discount}
        </p>

        <p>
          🛒 Min Order :
          Rs. {coupon.minOrder}
        </p>

        <p>
          📅 Expiry :
          {coupon.expiry}
        </p>

        <p
          style={{
            color: coupon.active
              ? "#22c55e"
              : "#ef4444",
            fontWeight: "bold",
          }}
        >
          {coupon.active
            ? "🟢 Active"
            : "🔴 Disabled"}
        </p>

        <button
  className="toggle-coupon-btn"
  onClick={() => toggleCoupon(coupon)}
>
  {coupon.active
    ? "🔴 Disable"
    : "🟢 Enable"}
</button>

        <button
  className="delete-coupon-btn"
  onClick={() => deleteCoupon(coupon.id)}
>
  🗑 Delete
</button>

      </div>

    ))

  )}



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

</div>

<div className="stat-card">
  <h3>📦 Orders Today</h3>
  <h2>{ordersToday}</h2>
</div>

<div className="stat-card">
  <h3>💰 Today Revenue</h3>
 <h2>Rs. {revenueToday}</h2>
  </div>

  <div className="stat-card">
  <h3>👥 Customers</h3>
  <h2>{totalCustomers}</h2>
</div>

<div className="stat-card">
  <h3>🔥 Most Sold</h3>
  <h2>
    {mostSoldPackage
      ? mostSoldPackage[0]
      : "-"}
  </h2>
</div>

<div className="stat-card">
  <h3>📦 Pending Orders</h3>
  <h2>{pendingOrders}</h2>
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
  className="admin-search"
  placeholder="🔍 Search Order ID / UID / Player..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
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
            <p>📦 Quantity: {order.quantity || 1}</p>

<p>
  💰 Original Price:
  Rs. {order.originalPrice?.toLocaleString() || order.price?.toLocaleString()}
</p>

{order.coupon && (
  <p>
    🎟 Coupon: {order.coupon}
  </p>
)}

{order.discount > 0 && (
  <p>
    💸 Discount:
    Rs. {order.discount.toLocaleString()}
  </p>
)}

<p>
  ✅ Paid Price:
  Rs. {order.price?.toLocaleString()}
</p>

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