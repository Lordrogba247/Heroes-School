import "./Hero.css";
export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-inner">
                <div className="hero-content">
                    <h1 className="hero-heading">
                        Committed <span className="hero-heading-accent">to</span>
                        <br />
                        Excellence
                    </h1>

                    <p className="hero-text">
                        Heroes Schools foster academic, spiritual, and social growth.
                        From Nursery to Secondary, we provide a strong foundation in
                        faith and learning. Our goal is to raise students who serve both
                        God and humanity. Excellence in all aspects of life is our
                        guiding principle.
                    </p>

                    <a href="/about" className="hero-cta">
                        Read more <span className="hero-cta-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15">
                            <path d="M0 0h15v15H0z" fill="none" />
                            <path fill="currentColor" d="M11.5 3a.5.5 0 0 1 .5.5V9l-.01.102a.5.5 0 0 1-.98-.001L11 9V4.707l-6.647 6.647a.5.5 0 0 1-.707-.707L10.293 4H6a.5.5 0 0 1 0-1z" />
                        </svg>
                        </span>
                    </a>
                </div>

                <div className="hero-collage">
                    {/* The single flattened collage photo (already cut into the bolt shape in Figma) */}
                    <img
                        src="src/assets/heroesimage.png"
                        alt="Heroes College students and campus life"
                        className="hero-img-main"
                    />

                    {/* 3 badge images - drop your exported badge graphics here */}
                    <img
                        src="src/assets/instill.png"
                        alt="We instill leadership and team skills"
                        className="hero-badge hero-badge-navy"
                    />
                    <img
                        src="src/assets/ensure.png"
                        alt="We ensure learners have Vocational Skills"
                        className="hero-badge hero-badge-purple"
                    />
                    <img
                        src="src/assets/encourage.png"
                        alt="We encourage Cultural diversity"
                        className="hero-badge hero-badge-red"
                    />
                </div>
            </div>
        </section>
    );
}