import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaSearch, FaCheckCircle, FaRegLightbulb, FaUsers, FaHandshake, FaHeadset } from "react-icons/fa";
import "../Styles/LandingPage.css";

const LandingPage = () => {
    const navigate = useNavigate();
    
    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className="landing-navbar">
                <div className="logo">JobConnect</div>
                <div className="nav-links">
                    <a href="#">Find Talent</a>
                    <a href="#">Find Work</a>
                    <a href="#">Why Us?</a>
                    <a href="#">Enterprise</a>
                </div>
                <div className="auth-buttons">
                    <button className="login-btn" onClick={() => navigate("/login")}>Log In</button>
                    <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Find the Best Talent for Your Job</h1>
                    <p>Connect with skilled professionals or land your next big gig.</p>
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input type="text" placeholder="Search for jobs or freelancers..." />
                        <button className="search-btn">Search</button>
                    </div>
                </div>
            </header>

            {/* Trusted By Section */}
            <section className="trusted-by">
                <h2>Trusted by Top Companies</h2>
                <div className="company-logos">
                    <img src="https://via.placeholder.com/100x40" alt="Company 1" />
                    <img src="https://via.placeholder.com/100x40" alt="Company 2" />
                    <img src="https://via.placeholder.com/100x40" alt="Company 3" />
                    <img src="https://via.placeholder.com/100x40" alt="Company 4" />
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <FaRegLightbulb className="step-icon" />
                        <h3>Sign Up</h3>
                        <p>Create a profile as a freelancer or an employer.</p>
                    </div>
                    <div className="step">
                        <FaSearch className="step-icon" />
                        <h3>Find Work or Talent</h3>
                        <p>Browse job listings or search for skilled professionals.</p>
                    </div>
                    <div className="step">
                        <FaCheckCircle className="step-icon" />
                        <h3>Get Hired & Paid</h3>
                        <p>Apply, collaborate, and get paid securely.</p>
                    </div>
                </div>
            </section>

            {/* Top Freelancers Section */}
            <section className="top-freelancers">
                <h2>Top Freelancers</h2>
                <div className="freelancer-grid">
                    {[
                        { name: "Alice Johnson", skill: "Web Developer", rating: "4.9/5" },
                        { name: "Mark Smith", skill: "Graphic Designer", rating: "4.8/5" },
                        { name: "Sophia Lee", skill: "Content Writer", rating: "4.7/5" }
                    ].map((freelancer, index) => (
                        <div key={index} className="freelancer-card">
                            <h3>{freelancer.name}</h3>
                            <p>{freelancer.skill}</p>
                            <p>{freelancer.rating}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Job Posting Statistics */}
            <section className="job-stats">
                <h2>Our Impact</h2>
                <div className="stats-grid">
                    <div className="stat">
                        <FaUsers className="stat-icon" />
                        <h3>50,000+</h3>
                        <p>Freelancers</p>
                    </div>
                    <div className="stat">
                        <FaHandshake className="stat-icon" />
                        <h3>30,000+</h3>
                        <p>Jobs Posted</p>
                    </div>
                    <div className="stat">
                        <FaCheckCircle className="stat-icon" />
                        <h3>10,000+</h3>
                        <p>Successful Hires</p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose-us">
                <h2>Why Choose JobConnect?</h2>
                <div className="reasons">
                    <div className="reason">
                        <h3>Fast Hiring Process</h3>
                        <p>Post jobs and find talent quickly with AI-powered matching.</p>
                    </div>
                    <div className="reason">
                        <h3>Verified Professionals</h3>
                        <p>We screen freelancers to ensure quality and professionalism.</p>
                    </div>
                    <div className="reason">
                        <h3>Secure Payments</h3>
                        <p>Our escrow system guarantees fair and safe transactions.</p>
                    </div>
                </div>
            </section>

            {/* Community & Support */}
            <section className="community-support">
                <h2>Join Our Community</h2>
                <div className="community-content">
                    <div className="community-box">
                        <FaUsers className="community-icon" />
                        <h3>Freelancer Forums</h3>
                        <p>Engage with other freelancers and share experiences.</p>
                    </div>
                    <div className="community-box">
                        <FaHeadset className="community-icon" />
                        <h3>24/7 Support</h3>
                        <p>Get help whenever you need it with our dedicated support team.</p>
                    </div>
                    <div className="community-box">
                        <FaHandshake className="community-icon" />
                        <h3>Mentorship Program</h3>
                        <p>Learn from experienced professionals in your field.</p>
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="success-stories">
                <h2>Success Stories</h2>
                <div className="testimonials">
                    <div className="testimonial">
                        <p>“JobConnect helped me land my first big client! It’s been an amazing experience.”</p>
                        <h4>- Sarah K.</h4>
                    </div>
                    <div className="testimonial">
                        <p>“Hiring top talent has never been easier. I found the perfect team for my project.”</p>
                        <h4>- Michael J.</h4>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <h2>Ready to Get Started?</h2>
                <p>Sign up now and connect with top freelancers and employers.</p>
                <button className="cta-btn">Join Now</button>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} JobConnect. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
