import { useState } from "react";

function Navbar({
  openLogin,
  openSignup,
  user,
  logout,
}) {

  const [menuOpen, setMenuOpen] = useState(false);

  return (

<nav className="navbar">

  <div className="logo">
    🎮 StrikePay LK
  </div>


  <button 
    className="menu-btn"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    ☰
  </button>


  <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

    <li>
      <a href="#home" onClick={()=>setMenuOpen(false)}>
        Home
      </a>
    </li>

    <li>
      <a href="#topup" onClick={()=>setMenuOpen(false)}>
        Top Up
      </a>
    </li>

    <li>
      <a href="#packages" onClick={()=>setMenuOpen(false)}>
        Packages
      </a>
    </li>

    <li>
      <a href="#support" onClick={()=>setMenuOpen(false)}>
        Support
      </a>
    </li>

  </ul>



<div className="auth-buttons">


{
!user ? (

<>

<button
className="signin-btn"
onClick={openLogin}
>
Sign In
</button>


<button
className="signup-btn"
onClick={openSignup}
>
Sign Up
</button>

</>


)

:

(

<div className="user-box">

👤 {user.displayName || user.email}


<button
className="logout-btn"
onClick={logout}
>
Logout
</button>


</div>

)

}


</div>


</nav>

  );
}


export default Navbar;