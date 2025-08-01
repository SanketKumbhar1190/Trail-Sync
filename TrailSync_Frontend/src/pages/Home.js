import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

const images = [
  {
    src: "/img/img1.jpg",
    alt: "Organize Your Events",
    title: "Organize Your Events",
    caption: "Create and manage your events effortlessly with Trail Sync.",
  },
  {
    src: "/img/img2.jpg",
    alt: "Seamless Payments",
    title: "Seamless Payments",
    caption: "Split bills and pay with ease using our integrated payment system.",
  },
  {
    src: "/img/img3.jpg",
    alt: "Join Engaging Events",
    title: "Join Engaging Events",
    caption: "Find, join, and enjoy community-driven events that inspire.",
  },
];

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const primaryColor = "#3498DB";
  const secondaryText = "#7F8C8D";
  const darkText = "#2C3E50";

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* Hero */}
      <section className="container py-5 text-center" data-aos="fade-up">
        <h1 className="display-4 fw-bold" style={{ color: darkText }}>
          Welcome to <span style={{ color: primaryColor }}>Trail Sync</span>
        </h1>
        <p className="lead" style={{ color: secondaryText }}>
          Your all-in-one event management platform.
        </p>
      </section>

      {/* Carousel */}
      <section className="container mb-5" data-aos="zoom-in">
        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2500">
          <div className="carousel-inner rounded-4 shadow">
            {images.map((img, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <img
                  src={img.src}
                  className="d-block w-100"
                  alt={img.alt}
                  style={{ height: "350px", objectFit: "cover" }}
                />
                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                  <h5 style={{ color: "#fff" }}>{img.title}</h5>
                  <p style={{ color: "#e0e0e0" }}>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" />
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="container mb-5">
        <div className="row g-4">
          {[
            {
              title: "Event Creation",
              text: "Create and manage events with complete control.",
              btn: "Create an Event",
              link: "/create-event",
            },
            {
              title: "Join Events",
              text: "Explore and join events tailored to your interest.",
              btn: "View Events",
              link: "/events",
            },
            {
              title: "Track Payments",
              text: "Monitor and split event costs effortlessly.",
              btn: "My Events",
              link: "/my-events",
            },
          ].map((card, i) => (
            <div className="col-md-4" key={i} data-aos="fade-up" data-aos-delay={i * 100}>
              <div className="card h-100 shadow-sm border-0 rounded-4 text-center">
                <div className="card-body">
                  <h5 className="card-title" style={{ color: darkText }}>{card.title}</h5>
                  <p className="card-text" style={{ color: secondaryText }}>{card.text}</p>
                  <Link to={card.link} className="btn btn-primary" style={{ backgroundColor: primaryColor, border: "none" }}>
                    {card.btn}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white pt-5 pb-3" style={{ backgroundColor: darkText }}>
        <div className="container">
          <div className="row text-md-start text-center">
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <h5 className="fw-bold">About Us</h5>
              <p className="text-light">
                Trail Sync is your ultimate partner in planning, hosting, and participating in unforgettable events.
              </p>
            </div>
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <h5 className="fw-bold">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/about" className="text-white text-decoration-none">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <h5 className="fw-bold">Contact Us</h5>
              <p className="mb-1">Email: contact@trail-sync.com</p>
              <p className="mb-0">Phone: +1 234 567 890</p>
            </div>
          </div>
          <hr className="border-light" />
          <p className="text-center mb-0">&copy; {new Date().getFullYear()} Trail Sync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
