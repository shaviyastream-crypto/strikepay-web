function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        🎮 StrikePay LK
      </div>

      <ul className="nav-links">

  <li>
    <a href="#home">Home</a>
  </li>

  <li>
    <a href="#topup">Top Up</a>
  </li>

  <li>
    <a href="#packages">Packages</a>
  </li>

  <li>
    <a href="#support">Support</a>
  </li>

</ul>

    <button
  className="login-btn"
  onClick={() => scrollToSection("topup")}
>
  Top Up Now
</button>

    </nav>
  );
}

export default Navbar;