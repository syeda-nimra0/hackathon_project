import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./StudentBio.css";

function StudentBio() {
  const [student, setStudent] = useState({
    name: "",
    fatherName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  }

  async function handleNext(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = auth.currentUser.uid;
      
      // Save student bio to Firestore
      await setDoc(doc(db, "students", userId), {
        ...student,
        createdAt: new Date().toISOString(),
        userId: userId,
      });

      alert("Student Bio Saved Successfully! ✅");
      navigate("/courses");
    } catch (error) {
      console.error("Error saving student bio:", error);
      alert("Error saving data: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bio-container">
      {/* LEFT SIDE FORM */}
      <form className="bio-form" onSubmit={handleNext}>
        <h2>Student Bio Data</h2>

        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={student.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="fatherName"
          placeholder="Father Name"
          value={student.fatherName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={student.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={student.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          value={student.address}
          onChange={handleChange}
          rows="3"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Next → Choose Course"}
        </button>
      </form>

      {/* RIGHT SIDE LIVE PREVIEW */}
      <div className="preview-card">
        <h3>Live Preview</h3>

        <div className="card">
          <p><strong>Name:</strong> {student.name || "—"}</p>
          <p><strong>Father:</strong> {student.fatherName || "—"}</p>
          <p><strong>Email:</strong> {student.email || "—"}</p>
          <p><strong>Phone:</strong> {student.phone || "—"}</p>
          <p><strong>Address:</strong> {student.address || "—"}</p>
        </div>
      </div>
    </div>
  );
}

export default StudentBio;