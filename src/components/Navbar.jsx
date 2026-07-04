function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        🎮 StrikePay LK
      </div>

      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">Top Up</a></li>
        <li><a href="#">Packages</a></li>
        <li><a href="#">Support</a></li>
      </ul>

      <button className="login-btn">
        Login
      </button>

    </nav>
  )
}

export default Navbar