import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const primaryColor = "#3498DB";
  const secondaryText = "#7F8C8D";
  const darkText = "#2C3E50";

  return (
    <div style={{ backgroundColor: "#ECF0F1", minHeight: "100vh" }}>
      <div className="container py-5">
        {/* Hero Section */}
        <div className="text-center mb-5" data-aos="fade-up">
          <h1 className="display-4 fw-bold" style={{ color: darkText }}>
            About <span style={{ color: primaryColor }}>TrailSync</span>
          </h1>
          <p className="lead" style={{ color: secondaryText }}>
            TrailSync is your seamless companion for planning, managing, and joining events with integrated payments.
          </p>
        </div>

        {/* Vision Section */}
        <div className="row align-items-center mb-5">
          <div className="col-md-6 mb-4 mb-md-0" data-aos="fade-right">
            <h3 style={{ color: primaryColor }}>Our Vision</h3>
            <p style={{ color: secondaryText }}>
              At TrailSync, our mission is to simplify event management for everyone. From casual hangouts to large-scale corporate events, we offer the tools you need to succeed.
            </p>
          </div>
          <div className="col-md-6" data-aos="fade-left">
            <img src="/img/logo.png" alt="TrailSync" className="img-fluid rounded shadow" />
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="fw-bold mb-4" style={{ color: primaryColor }}>
            Features of TrailSync
          </h2>
          <div className="row g-4">
            {[
              {
                title: "Event Creation",
                text: "Easily create events with dates, locations, and participants.",
              },
              {
                title: "Seamless Payments",
                text: "Split and pay event costs using integrated systems like Razorpay.",
              },
              {
                title: "Join Events",
                text: "Discover, request, and participate in events of your interest.",
              },
            ].map((feature, idx) => (
              <div className="col-md-4" key={idx} data-aos="flip-left" data-aos-delay={idx * 100}>
                <div className="card h-100 shadow-sm border-0 rounded-4 text-center">
                  <div className="card-body">
                    <h4 className="card-title" style={{ color: darkText }}>{feature.title}</h4>
                    <p className="card-text" style={{ color: secondaryText }}>{feature.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center my-5" data-aos="fade-up">
          <p className="lead" style={{ color: secondaryText }}>
            Ready to create unforgettable events? Join TrailSync today.
          </p>
          <Link to="/create-event" className="btn btn-lg" style={{ backgroundColor: primaryColor, color: "#fff" }}>
            Start Creating Events
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="text-white pt-5 pb-3" style={{ backgroundColor: darkText }}>
        <div className="container">
          <div className="row text-md-start text-center">
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <h5 className="fw-bold">About Us</h5>
              <p className="text-light">
                TrailSync is your ultimate event management platform, helping you organize and participate in events seamlessly.
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
              <p className="mb-1">Email: contact@trailsync.com</p>
              <p className="mb-0">Phone: +1 234 567 890</p>
            </div>
          </div>
          <hr className="border-light" />
          <p className="text-center mb-0">&copy; {new Date().getFullYear()} TrailSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
