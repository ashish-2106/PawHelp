function About() {
  return (
    <>
      <style>{`
        /* -------- SHARED CONTAINER -------- */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* -------- PAGE BASE -------- */
        .about-page {
          background: linear-gradient(135deg, #f6fff9, #e3f4ee);
          font-family: "Segoe UI", sans-serif;
          padding: 80px 0;
        }

        /* -------- HEADER -------- */
        .about-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .about-header h1 {
          font-size: 3rem;
          color: #1e3d2f;
          margin-bottom: 12px;
        }

        .about-header p {
          font-size: 1.15rem;
          color: #2f6f4e;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .header-divider {
          width: 90px;
          height: 4px;
          background: #2f6f4e;
          border-radius: 10px;
          margin: 20px auto;
        }

        /* -------- SECTIONS -------- */
        .about-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
          margin-bottom: 80px;
        }

        .about-section.reverse {
          flex-direction: row-reverse;
        }

        .about-text {
          flex: 1;
        }

        .about-text h2 {
          font-size: 2.1rem;
          color: #1e3d2f;
          margin-bottom: 12px;
        }

        .about-text p {
          font-size: 1.05rem;
          color: #444;
          line-height: 1.7;
        }

        .about-text ul {
          margin-top: 15px;
          padding-left: 18px;
          color: #444;
        }

        .about-text li {
          margin-bottom: 8px;
        }

        /* -------- IMAGE -------- */
        .about-image {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .about-image img {
          width: 100%;
          max-width: 420px;
          border-radius: 22px;
          box-shadow: 0 14px 30px rgba(0,0,0,0.15);
        }

        /* -------- VALUES -------- */
        .values {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 60px;
        }

        .value-card {
          background: white;
          border-radius: 22px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .value-card h3 {
          color: #2f6f4e;
          margin-bottom: 10px;
        }

        .value-card p {
          font-size: 0.95rem;
          color: #444;
          line-height: 1.6;
        }

        /* -------- RESPONSIVE -------- */
        @media (max-width: 900px) {
          .about-section,
          .about-section.reverse {
            flex-direction: column;
            text-align: center;
          }

          .values {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="about-page">
        <div className="container">
          {/* HEADER */}
          <div className="about-header">
            <h1>About PawHelp 🐾</h1>
            <div className="header-divider" />
            <p>
              PawHelp is an AI-powered animal rescue platform designed to save
              lives by connecting people, technology, and rescue organizations.
            </p>
          </div>

          {/* SECTION 1 */}
          <div className="about-section">
            <div className="about-text">
              <h2>Why PawHelp?</h2>
              <p>
                Every day, countless animals suffer injuries due to accidents,
                neglect, or natural causes. Many go untreated simply because
                help doesn’t arrive on time.
              </p>
              <p>
                PawHelp bridges this gap by enabling anyone to instantly report
                injured animals using just a smartphone.
              </p>
            </div>

            <div className="about-image">
              <img src="dog1.jpeg" alt="Animal rescue" />
            </div>
          </div>

          {/* SECTION 2 */}
          <div className="about-section reverse">
            <div className="about-text">
              <h2>How Our AI Helps</h2>
              <p>
                PawHelp uses Artificial Intelligence and Computer Vision to
                analyze images of injured animals.
              </p>
              <ul>
                <li>Detects the animal species</li>
                <li>Analyzes visible injuries</li>
                <li>Estimates injury severity</li>
                <li>Generates AI-based first aid guidance</li>
              </ul>
            </div>

            <div className="about-image">
              <img src="dog2.jpeg" alt="AI analysis" />
            </div>
          </div>

          {/* SECTION 3 */}
          <div className="about-section">
            <div className="about-text">
              <h2>Connecting NGOs & Rescuers</h2>
              <p>
                Once an injury is detected, PawHelp instantly shares the report
                and live location with nearby NGOs and rescue teams, helping
                them respond faster and more efficiently.
              </p>
            </div>

            <div className="about-image">
              <img src="dog3.jpeg" alt="NGO rescue" />
            </div>
          </div>

          {/* VALUES */}
          <div className="values">
            <div className="value-card">
              <h3>Compassion</h3>
              <p>
                Every animal deserves care, dignity, and timely help.
              </p>
            </div>

            <div className="value-card">
              <h3>Technology for Good</h3>
              <p>
                We use AI responsibly to solve real-world problems.
              </p>
            </div>

            <div className="value-card">
              <h3>Community Impact</h3>
              <p>
                Empowering people and NGOs to save lives together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
