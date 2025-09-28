import React, { memo } from 'react';
import { TrendingUp, Users, Target, Award, Globe, Shield } from 'lucide-react';

const About = memo(() => {
  const stats = [
    { label: 'Daily Users', value: '2.5M+', icon: Users },
    { label: 'News Sources', value: '500+', icon: Globe },
    { label: 'Countries Covered', value: '50+', icon: Target },
    { label: 'Years Experience', value: '8+', icon: Award }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      avatar: '👨💼',
      description: 'Former Goldman Sachs analyst with 15+ years in financial markets'
    },
    {
      name: 'Priya Sharma',
      role: 'Chief Technology Officer',
      avatar: '👩💻',
      description: 'Ex-Google engineer specializing in financial data systems'
    },
    {
      name: 'Amit Patel',
      role: 'Head of Content',
      avatar: '👨📰',
      description: 'Award-winning financial journalist with Bloomberg and Reuters'
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Research',
      avatar: '👩📊',
      description: 'PhD in Economics, former McKinsey consultant'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Accuracy',
      description: 'We verify every piece of information through multiple reliable sources before publishing.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Updates',
      description: 'Our advanced algorithms ensure you get the latest market movements as they happen.'
    },
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature is designed with our users\' financial success and convenience in mind.'
    },
    {
      icon: Globe,
      title: 'Global Perspective',
      description: 'We provide comprehensive coverage of markets worldwide, not just local news.'
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <h1>About WealthWire247</h1>
            <p className="hero-subtitle">
              Empowering investors with real-time financial insights and comprehensive market analysis since 2016.
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <stat.icon size={24} className="stat-icon" />
                  <div className="stat-info">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p>
              At WealthWire247, we believe that everyone deserves access to high-quality financial information. 
              Our mission is to democratize financial news and market insights, making them accessible to both 
              seasoned investors and newcomers to the financial world.
            </p>
            <p>
              We combine cutting-edge technology with expert analysis to deliver real-time market data, 
              breaking news, and actionable insights that help our users make informed investment decisions.
            </p>
          </div>
        </div>

        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">
                  <value.icon size={32} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">{member.avatar}</div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-section">
          <div className="contact-content">
            <h2>Get In Touch</h2>
            <p>Have questions or feedback? We'd love to hear from you.</p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Email:</strong> contact@wealthwire247.com
              </div>
              <div className="contact-item">
                <strong>Phone:</strong> +91 98765 43210
              </div>
              <div className="contact-item">
                <strong>Address:</strong> 123 Financial District, Mumbai, India 400001
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 2rem 0;
        }

        body.dark .about-page {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .hero-section {
          text-align: center;
          margin-bottom: 4rem;
        }

        .hero-content h1 {
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        body.dark .hero-subtitle {
          color: #9ca3af;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        body.dark .stat-card {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(55, 65, 81, 0.3);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          color: #667eea;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        body.dark .stat-value {
          color: #f9fafb;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        body.dark .stat-label {
          color: #9ca3af;
        }

        .mission-section,
        .contact-section {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 3rem;
          margin-bottom: 3rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        body.dark .mission-section,
        body.dark .contact-section {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(55, 65, 81, 0.3);
        }

        .section-content h2,
        .values-section h2,
        .team-section h2,
        .contact-content h2 {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        body.dark .section-content h2,
        body.dark .values-section h2,
        body.dark .team-section h2,
        body.dark .contact-content h2 {
          color: #f9fafb;
        }

        .section-content p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 1.5rem;
        }

        body.dark .section-content p {
          color: #d1d5db;
        }

        .values-section {
          margin-bottom: 4rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .value-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        body.dark .value-card {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(55, 65, 81, 0.3);
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .value-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .value-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        body.dark .value-card h3 {
          color: #f9fafb;
        }

        .value-card p {
          color: #6b7280;
          line-height: 1.6;
        }

        body.dark .value-card p {
          color: #9ca3af;
        }

        .team-section {
          margin-bottom: 4rem;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .team-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        body.dark .team-card {
          background: rgba(30, 41, 59, 0.9);
          border-color: rgba(55, 65, 81, 0.3);
        }

        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .member-avatar {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .team-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        body.dark .team-card h3 {
          color: #f9fafb;
        }

        .member-role {
          color: #667eea;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .member-description {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        body.dark .member-description {
          color: #9ca3af;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .contact-item {
          color: #4b5563;
          font-size: 1.1rem;
        }

        body.dark .contact-item {
          color: #d1d5db;
        }

        .contact-content p {
          text-align: center;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        body.dark .contact-content p {
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }

          .mission-section,
          .contact-section {
            padding: 2rem;
          }

          .values-grid,
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
});

About.displayName = 'About';

export default About;