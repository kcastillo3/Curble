import React from 'react';
import couchImage from '../assets/couch-Photoroom.png-Photoroom.png';
import nycCouchImage from '../assets/nyc couch.png';
import earthImage from '../assets/Earth.png';

const About = () => {
  return (
    <div className="about-container">
      <section className="story-section">
        <h2>Our Story</h2>
        <p>Born from the simple idea that one person's discard could be another's treasure, 'Curble' was created to facilitate these exchanges with ease and safety. What started as a small initiative has grown into a vibrant community of sharers in NYC, environmental advocates, and individuals passionate about making a difference, one curb at a time.</p>
        <img src={couchImage} alt="Comfortable Couch" />
        </section>
      
      <section className="mission-section">
        <h2>Our Mission</h2>
        <img src={nycCouchImage} alt="Couch in NYC" />
        <p>At 'Curble', we believe in the power of community and the significant impact of sharing. Our platform is more than just a marketplace; it's a movement towards sustainability, reducing waste, and strengthening neighborhood bonds.</p>
        <p>By connecting individuals to give and get items for free, we're not only decluttering homes but also ensuring that usable goods find new life elsewhere, rather than in landfills.</p>
      </section>
      
      <section className="vision-section">
        <h2>Our Vision</h2>
        <img src={earthImage} alt="Earth" />
        <p>We envision a world where sharing becomes second nature, where communities are closely knit through acts of generosity, and sustainability is ingrained in every action we take. 'Curble' is more than a platform; it's a pledge to foster a greener, more connected world.</p>
      </section>
      
      <section className="why-section">
        <h2>Why 'Curble'?</h2>
        <ul>
          <li><strong>Community Focused:</strong> Our heart is in building strong, supportive communities where sharing is a way of life.</li>
          <li><strong>Sustainability Driven:</strong> We're committed to environmental stewardship by promoting the reuse and recycling of goods.</li>
          <li><strong>Safety Assured:</strong> Ensuring the safety and privacy of our users is paramount, making 'Curble' a trusted space for exchanges.</li>
          <li><strong>Absolutely Free:</strong> Everything on 'Curble' is free. We're powered by the belief in generosity and the joy of giving.</li>
        </ul>
        <p>Join us in making a difference, one item at a time. Welcome to 'Curble' – where every curb has a story, and every item is a gift of possibility.</p>
      </section>
    </div>
  );
}

export default About;