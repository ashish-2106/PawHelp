import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <style>{`
        /* -------- GLOBAL RESET (SAFE HERE) -------- */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          margin: 0;
          padding: 0;
        }

        /* -------- SHARED CONTAINER -------- */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* -------- HOME LAYOUT -------- */
        .home-container {
          min-height: calc(100vh - 100px);
          background: linear-gradient(135deg, #f6fff9, #e3f4ee);
          font-family: "Segoe UI", sans-serif;
          display: flex;
          align-items: center;
        }

        .home-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          width: 100%;
        }

        /* -------- CONTENT -------- */
        .home-content {
          max-width: 700px;
        }

        .home-content h1 {
          font-size: 3.4rem;
          color: #1e3d2f;
          margin-bottom: 10px;
          animation: fadeIn 1s ease forwards;
        }

        .paw {
          display: inline-block;
          animation: bounce 1.6s infinite;
        }

        .tagline {
          font-size: 1.45rem;
          font-weight: 600;
          color: #2f6f4e;
          margin-top: 10px;
          opacity: 0;
          animation: fadeIn 1s ease forwards;
          animation-delay: 0.5s;
        }

        .divider-line {
          width: 225px;
          height: 4px;
          background: #2f6f4e;
          border-radius: 10px;
          margin: 18px 0;
          opacity: 0;
          animation: fadeIn 1s ease forwards;
          animation-delay: 0.8s;
        }

        .description {
          font-size: 1.08rem;
          color: #444;
          line-height: 1.7;
          margin-top: 12px;
          opacity: 0;
          animation: fadeIn 1s ease forwards;
          animation-delay: 1.1s;
        }

        /* -------- CTA -------- */
        .cta-group {
          display: flex;
          gap: 15px;
          margin-top: 30px;
          opacity: 0;
          animation: fadeIn 1s ease forwards;
          animation-delay: 1.5s;
        }

        .cta-button {
          padding: 13px 30px;
          font-size: 1rem;
          border-radius: 28px;
          background-color: #2f6f4e;
          color: white;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        .cta-button:hover {
          background-color: #24553c;
          transform: translateY(-3px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.15);
        }

        .secondary-button {
          padding: 13px 28px;
          font-size: 1rem;
          border-radius: 28px;
          background: transparent;
          color: #2f6f4e;
          border: 2px solid #2f6f4e;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .secondary-button:hover {
          background: #2f6f4e;
          color: white;
        }

        /* -------- IMAGE -------- */
        .home-image {
          animation: slideIn 1.2s ease forwards;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .home-image img {
          width: 440px;
          max-width: 100%;
          filter: drop-shadow(0 12px 25px rgba(0,0,0,0.18));
        }

        /* -------- ANIMATIONS -------- */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(45px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        /* -------- RESPONSIVE -------- */
        @media (max-width: 900px) {
          .home-inner {
            flex-direction: column;
            text-align: center;
          }

          .divider-line {
            margin: 18px auto;
          }

          .cta-group {
            justify-content: center;
            flex-wrap: wrap;
          }

          .home-image {
            margin-top: 40px;
          }
        }
      `}</style>

      <div className="home-container">
        <div className="container">
          <div className="home-inner">
            {/* LEFT CONTENT */}
            <div className="home-content">
              <h1>
                AI-Powered Animal Rescue Platform <span className="paw">🐾</span>
              </h1>

              {/* <p className="tagline">PawHelp</p> */}

              <div className="divider-line" />

              <p className="description">
                Report injured animals using images and live location. PawHelp’s
                AI detects the species, analyzes injury severity, and instantly
                notifies nearby NGOs for faster and safer rescue operations.
              </p>

              <div className="cta-group">
                <Link to="/report" className="cta-button">
                  Report an Animal
                </Link>

                <Link to="/about" className="secondary-button">
                  Learn More
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="home-image">
              <img src="hero.png" alt="Animal Rescue" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
