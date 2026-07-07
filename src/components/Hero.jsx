function Hero() {

  const scrollToTopUp = () => {
    const section = document.querySelector(".topup");

    if(section){
      section.scrollIntoView({
        behavior:"smooth"
      });
    }
  };


  return (

    <section className="hero" id="home">

      <div className="hero-content">

        <h1>
          StrikePay LK
        </h1>

        <h2>
          Blood Strike Top Up Store
        </h2>

        <p>
          Fast, Safe & Instant Diamond Top Up in Sri Lanka
        </p>

        <button
    onClick={() => {
        document
        .getElementById("topup")
        .scrollIntoView({
            behavior: "smooth"
        });
    }}
>
    TOP UP NOW
</button>

      </div>


    </section>

  )
}

export default Hero