import { Link } from 'react-router-dom';

function Navbar() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
 <section>
   <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="#">
            <img
              src="https://i.pinimg.com/736x/ea/2e/31/ea2e31b3b0408f6d78d594d8fc199924.jpg"
              alt="Logo"
              width="50"
              height="50"
              className="d-inline-block align-text-top"
            />
          </Link>
          <span className="navbar-brand">CampusCart</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent" >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ fontSize: '1.2rem',justifyContent: 'center', alignItems: 'center' }}>
              <li className="nav-item">
                <span className="nav-link active" onClick={() => scrollToSection('hero-section')} style={{ cursor: 'pointer', margin: '0 10px' }}>Home</span>
              </li>
              <li className="nav-item">
                <span className="nav-link active" onClick={() => scrollToSection('registration')} style={{ cursor: 'pointer', margin: '0 10px'}}>Registration</span>
              </li>
              <li className="nav-item">
                <span className="nav-link active" onClick={() => scrollToSection('about-us')} style={{ cursor: 'pointer', margin: '0 10px'}}>About Us</span>
              </li>
              <li className="nav-item">
                <span className="nav-link active" onClick={() => scrollToSection('services')} style={{ cursor: 'pointer', margin: '0 10px'}}>Services</span>
              </li>
              <li className="nav-item">
                <span className="nav-link active" onClick={() => scrollToSection('footer')} style={{ cursor: 'pointer', margin: '0 10px'}}>Contact Us</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
{/** Hero Section */}
<div className="container-fluid" id='hero-section' style={{backgroundColor: '#e2ecf6ff', position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div className="carousel-caption d-none d-md-block" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>
    <h1 className="display-4">Welcome to CampusCart</h1>
    <p className="lead">Your one-stop platform for campus buying and selling</p>
  </div>
 
</div>
<br/>
<section>
  <h2 className="text-center mb-4">User Registration</h2>
<div className="container-fluid centre my-5" id='registration'>
  <div className="row justify-content-center gap-4">
    {/* Admin Section */}
    <div className="col-md-4 p-4 shadow border rounded-4 bg-light">
      <div className="text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/128/9703/9703596.png"
          alt="Admin Icon"
          className="mx-auto d-block"
          style={{ width: '70px', height: '70px' }}
        />
      </div>
      <h2 className="mb-4 text-center">Admin Section</h2>
      <div className="text-center">
        <Link to="/admin-signup" className="btn btn-success mx-2">Register as Admin</Link>
      </div>',
    </div>

    {/* Student Section */}
    <div className="col-md-4 p-4 shadow border rounded-4 bg-light">
      <div className="text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/128/3135/3135810.png"
          alt="Student Icon"
          className="mx-auto d-block"
          style={{ width: '70px', height: '70px' }}
        />
      </div>
      <h2 className="mb-4 text-center">Student Section</h2>
      <div className="text-center">
        <Link to="/student-signup" className="btn btn-primary mx-2">Register as Student</Link>
      </div>
    </div>
  </div>
</div>

</section>
{/*about us*/}
<div className="container my-5 text-center" id='about-us'>
    <img src="https://i.pinimg.com/736x/df/e0/7a/dfe07a17c164157adbde83470fd27638.jpg" class="rounded float-start" alt="..." style={{height: '200px', width: '200px'}}/>
    <h2 className="text-right my-5">About Us</h2>
    <p className="text-center my-5" style={{ Width: '800px', margin: '0 auto' }}>
        CampusCart is a platform designed to facilitate the buying and selling of items among students on campus. 
        Whether you're looking to sell your old textbooks, buy second-hand electronics, or find a roommate, 
        CampusCart connects you with fellow students to make campus life easier and more connected.
    </p>
</div>
<br/>
{/* FAQ Section */}
<div className="container my-5" id="faq">
  <h2 className="text-center mb-4">Frequently Asked Questions</h2>
  <div className="accordion" id="faqAccordion">

    {/* Q1 */}
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          What is CampusCart?
        </button>
      </h2>
      <div
        id="collapseOne"
        className="accordion-collapse collapse show"
        aria-labelledby="headingOne"
        data-bs-parent="#faqAccordion"
      >
        <div className="accordion-body">
          CampusCart is a platform for students to buy and sell items, find roommates, and connect with campus events.
        </div>
      </div>
    </div>

    {/* Q2 */}
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingTwo">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseTwo"
          aria-expanded="false"
          aria-controls="collapseTwo"
        >
          How do I create an account?
        </button>
      </h2>
      <div
        id="collapseTwo"
        className="accordion-collapse collapse"
        aria-labelledby="headingTwo"
        data-bs-parent="#faqAccordion"
      >
        <div className="accordion-body">
          You can create an account by clicking on the "Sign Up" button on the homepage and filling out the registration form.
        </div>
      </div>
    </div>

    {/* Q3 */}
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingThree">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseThree"
          aria-expanded="false"
          aria-controls="collapseThree"
        >
          Is there a fee to use CampusCart?
        </button>
      </h2>
      <div
        id="collapseThree"
        className="accordion-collapse collapse"
        aria-labelledby="headingThree"
        data-bs-parent="#faqAccordion"
      >
        <div className="accordion-body">
          No, CampusCart is free to use for all students.
        </div>
      </div>
    </div>

  </div>
</div>

{/* Services Section */}
<div className="container my-5" id="services">
  <div className="row text-center justify-content-center g-4">

    {/* Services Card */}
    <div className="col-md-3" style={{padding: "0 15px"}}>
      <div className="p-4 border rounded shadow-sm h-100" style={{ backgroundColor: "#fdf6ec", marginBottom: "20px" }}>
        <h4 className="mb-4">Our Services</h4>
        <ul className="list-unstyled text-start">
          <li className="mb-2">📚 Buy and Sell Textbooks</li>
          <li className="mb-2">📢 Campus Events & Announcements</li>
          <li className="mb-2">🤝 Networking Opportunities</li>
        </ul>
      </div>
    </div>

    {/* Categories Card */}
    <div className="col-md-3" style={{padding: "0 15px"}}>
      <div className="p-4 border rounded shadow-sm h-100" style={{ backgroundColor: "#fdf6ec" }}>
        <h4 className="mb-4">Categories</h4>
        <ul className="list-unstyled text-start">
          <li className="mb-2">💻 Laptops</li>
          <li className="mb-2">📚 Books & Stationery</li>
          <li className="mb-2">🔌 Electronic Items</li>
          <li className="mb-2">🧳 Other</li>
        </ul>
      </div>
    </div>

    <div className="col-md-3" style={{padding: "0 15px"}}>
  <div className="p-4 border rounded shadow-sm h-100" style={{ backgroundColor: "#fdf6ec", marginBottom: "20px" }}>
    <h4 className="mb-4">Campus Resources</h4>
    <ul className="list-unstyled text-start">
      <li className="mb-2">💼 Internship Opportunities</li>
      <li className="mb-2">📑 Study Material (PYQs, Notes)</li>
      <li className="mb-2">📅 Events Calendar</li>
    </ul>
  </div>
</div>

  </div>
</div>

{/* Footer */}
<div>
  <footer className="text-center py-4" id="footer" style={{ backgroundColor: '#f1e0beff', color: 'black' }}>
    <p className="mb-2">© 2023 CampusCart. All rights reserved.</p>
    
    <p>
      Follow us on:
      <a href="https://www.email.com">
        <img 
          src="https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/112-gmail_email_mail-512.png" 
          alt="Email" 
          className="mx-2" 
          style={{ width: '30px', verticalAlign: 'middle' }} 
        />
      </a>
      <a href="https://twitter.com">
        <img 
          src="https://cdn2.iconfinder.com/data/icons/threads-by-instagram/24/x-logo-twitter-new-brand-contained-512.png" 
          alt="Twitter" 
          className="mx-2" 
          style={{ width: '30px', verticalAlign: 'middle' }} 
        />
      </a>
      <a href="https://www.instagram.com">
        <img 
          src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/instagram_icon-instagram_buttoninstegram-128.png" 
          alt="Instagram" 
          className="mx-2" 
          style={{ width: '30px', verticalAlign: 'middle' }} 
        />
      </a>
    </p>

    {/* New Section for Links */}
    <p style={{ marginTop: '10px' }}>
      <a 
        href="/report-issue" 
        style={{ margin: '0 15px', color: 'black', textDecoration: 'none', fontWeight: '500' }}
      >
        🚩 Report an Issue
      </a>
      |
      <a 
        href="/privacy-policy" 
        style={{ margin: '0 15px', color: 'black', textDecoration: 'none', fontWeight: '500' }}
      >
        📜 Privacy Policy & Terms
      </a>
    </p>
  </footer>
</div>


</section>

 );
}
export default Navbar;