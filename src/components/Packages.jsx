function Packages() {

  const packages = [
    {
      gold: "100 Gold",
      price: "Rs. 280"
    },
    {
      gold: "300 Gold",
      price: "Rs. 780"
    },
    {
      gold: "500 Gold",
      price: "Rs. 1250"
    },
    {
      gold: "1000 Gold",
      price: "Rs. 2450"
    }
  ];

  return (

    <section className="packages">

      <h2>Popular Packages</h2>

      <div className="package-grid">

        {packages.map((item, index) => (

          <div className="card" key={index}>

            <h3>{item.gold}</h3>

            <p>{item.price}</p>

            <button>Buy Now</button>

          </div>

        ))}

      </div>

    </section>

  );

}

export default Packages;