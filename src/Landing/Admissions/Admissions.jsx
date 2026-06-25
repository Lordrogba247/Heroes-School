import "./Admissions.css";

export default function Admissions() {
    return (
        <main className="admissions">
            <div className="admissions-container">
                <h1 className="admissions-title">Admission Procedure</h1>

                <p className="admissions-intro">The available classes are:</p>
                <ul className="admissions-intro-list">
                    <li>Creche; Nursery Classes and Primary 1-5</li>
                    <li>Jss 1-3 and SSS 1-3</li>
                </ul>

                <p className="admissions-subintro">
                    Admission Instructions for Heroes College &amp; Primary School
                </p>

                <section className="admissions-section">
                    <h2>Admission Procedure</h2>
                    <ol>
                        <li>Obtain and complete the school's admission form from the administration office or online.</li>
                        <li>
                            Submit the completed form along with the following documents:
                            <ul>
                                <li>Two passport-sized photographs of the student.</li>
                                <li>Copy of the student's birth certificate.</li>
                                <li>Previous academic records (if applicable).</li>
                                <li>Medical fitness certificate from a recognized health institution.</li>
                            </ul>
                        </li>
                        <li>Pay the non-refundable admission fee of N5,000. Proof of payment must be attached to the application.</li>
                        <li>Attend an interview and sit for the entrance examination on the assigned date.</li>
                        <li>Upon successful completion of the examination and interview, an offer of admission will be issued.</li>
                    </ol>
                </section>

                <section className="admissions-section">
                    <h2>Acceptance of Admission</h2>
                    <ul>
                        <li>Upon receipt of the provisional admission letter, fill out and sign the Acceptance of Admission form.</li>
                        <li>Pay the required school fees (detailed below) before the deadline to secure your spot.</li>
                    </ul>
                </section>

                <section className="admissions-section">
                    <h2>Payment Instructions</h2>
                    <ol>
                        <li>School fees must be paid by the second week of each term.</li>
                        <li>
                            Payment can be made via Online payment gateway and bank transfer to:
                            <ul>
                                <li>FCMB Bank: Account Number: 9122722015 (Heroes Nursery Primary &amp; Secondary School)</li>
                                <li>First Bank: Account Number: 2035749624 (Heroes Nursery and Secondary School)</li>
                            </ul>
                        </li>
                        <li>Keep proof of payment as it must be presented during registration.</li>
                    </ol>
                </section>

                <section className="admissions-section">
                    <h2>School Fees Breakdown (Per Term)</h2>
                    <ul>
                        <li>JSS 1-3: N61,000 (Boys), N65,000 (Girls)</li>
                        <li>SSS 1-3: N68,000 (Boys), N73,000 (Girls)</li>
                        <li>Additional charges may apply for uniforms, practicals, and optional school bus services.</li>
                    </ul>
                </section>

                <section className="admissions-section">
                    <h2>Uniforms and Materials</h2>
                    <ol>
                        <li>All students are required to purchase uniforms, sportswear, and cardigans directly from the school.</li>
                        <li>
                            Students must also have the following materials:
                            <ul>
                                <li>All required textbooks</li>
                                <li>Holy Bible (RSV)</li>
                                <li>Music manual, drawing sets, and stationery</li>
                            </ul>
                        </li>
                        <li>These will be checked by the class teacher at the beginning of the term.</li>
                    </ol>
                </section>

                <section className="admissions-section">
                    <h2>Resumption Date</h2>
                    <ul>
                        <li>The school will notify you of the exact resumption date following the completion of the admission process.</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}