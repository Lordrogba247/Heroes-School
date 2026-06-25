import "./Unique.css";

const features = [
    {
        number: "1",
        title: "Academic Excellence",
        text: "We provide a complete learning journey from Creche to Secondary School, tailored to every stage of development. Through quality education and practical learning, students gain the knowledge, confidence, and skills needed for lifelong success.",
    },
    {
        number: "2",
        title: "Leadership & Vocational Skills",
        text: "We nurture leadership, character, and vocational skills that prepare students for future opportunities. From problem-solving to practical life skills, our learners are empowered to face challenges with confidence and purpose.",
    },
    {
        number: "3",
        title: "Values-Driven Education",
        text: 'Guided by our motto, "Serving God & Humanity," we instill the values of service, compassion, and faith. We aim to raise responsible leaders who positively impact their communities and the world.',
    },
];

export default function Unique() {
    return (
        <section className="unique">
            <p className="unique-label">We are Unique</p>

            <div className="unique-grid">
                {features.map((feature) => (
                    <div className="unique-item" key={feature.number}>
                        <span className="unique-number">{feature.number}</span>
                        <div className="unique-content">
                            <h3 className="unique-title">{feature.title}</h3>
                            <p className="unique-text">{feature.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}