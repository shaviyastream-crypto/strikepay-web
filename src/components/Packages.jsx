function Packages({ setSelectedPackage }) {

  const packages = [
  {
    id: 1,
    gold: "50 + 6 Golds",
    goldAmount: 56,
    price: "Rs. 175",
    image: "/packages/package1.png",
  },
  {
    id: 2,
    gold: "100 + 16 Golds",
    goldAmount: 116,
    price: "Rs. 350",
    image: "/packages/package2.png",
  },
  {
    id: 3,
    gold: "300 + 52 Golds",
    goldAmount: 352,
    price: "Rs. 1050",
    image: "/packages/package3.png",
  },
  {
    id: 4,
    gold: "500 + 94 Golds",
    goldAmount: 594,
    price: "Rs. 1750",
    image: "/packages/package4.png",
  },
  {
  id: 5,
  gold: "1000 + 210 Golds",
  goldAmount: 1210,
  price: "Rs. 3500",
  image: "/packages/package5.png",
  badge: "⭐ Most Popular",
},
{
  id: 6,
  gold: "2000 + 486 Golds",
  goldAmount: 2486,
  price: "Rs. 7000",
  image: "/packages/package6.png",
  badge: "🔥 Best Value",
},
{
  id: 7,
  gold: "5000 + 1380 Golds",
  goldAmount: 6380,
  price: "Rs. 17500",
  image: "/packages/package7.png",
  badge: "💎 Mega Pack",
},
  {
    id: 8,
    gold: "Strike Pass Elite",
    goldAmount: 0,
    price: "Rs. 1400",
    image: "/packages/package8.png",
  },
  {
    id: 9,
    gold: "Strike Pass Premium",
    goldAmount: 0,
    price: "Rs. 3150",
    image: "/packages/package9.png",
  },
];

  return (
    <section className="packages" id="packages">

      <h2>Official Blood Strike Gold Packages</h2>

      <div className="package-grid">

        {packages.map((item, index) => (

          <div className="card" key={item.id}>

            {item.badge && (
  <div className="package-badge">
    {item.badge}
  </div>
)}

            <img
              src={item.image}
              alt={item.gold}
              className="package-image"
            />

            <h3>{item.gold}</h3>

            <p>{item.price}</p>

            <button
  onClick={() => {
    setSelectedPackage(item.gold);

    document
      .getElementById("topup")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
>
  Buy Now
</button>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Packages;