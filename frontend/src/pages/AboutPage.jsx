import React from 'react';
import '../styles/AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            <h1>About Us</h1>
            <p className="intro">Welcome to our Event Aggregator Platform! We are dedicated to bringing together college events and helping you discover exciting opportunities.</p>
            <div className="mission">
                <h2>Our Mission</h2>
                <p>Our mission is to create a vibrant community where students can easily find, participate in, and enjoy events that enhance their college experience.</p>
            </div>
            <div className="vision">
                <h2>Our Vision</h2>
                <p>We envision a world where every student is aware of and involved in events that can shape their future and foster personal growth.</p>
            </div>
            <div className="team">
                <h2>Meet the Team</h2>
                <ul>
                    <li>Ajay Arukonda - Lead Developer</li>
                    <li>Lakshmi Prasanna Dara - Community Manager</li>
                </ul>
            </div>
        </div>
    );
};

export default AboutPage;
