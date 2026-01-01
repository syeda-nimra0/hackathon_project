import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./IDCard.css";

function IDCard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rollNumber] = useState("STD-" + Math.floor(1000 + Math.random() * 9000));

  useEffect(() => {
    fetchStudentData();
  }, []);

  async function fetchStudentData() {
    try {
      const userId = auth.currentUser.uid;
      const studentDoc = await getDoc(doc(db, "students", userId));

      if (studentDoc.exists()) {
        setStudent(studentDoc.data());
      } else {
        alert("No student data found. Please complete your profile first.");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("Error loading student data: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadCard() {
    alert("Download feature will be implemented soon!");
  }

  if (loading) {
    return (
      <div className="id-page">
        <div className="loading">Loading your ID Card...</div>
      </div>
    );
  }

  if (!student || !student.enrollment) {
    return (
      <div className="id-page">
        <div className="error-message">
          <h2>⚠️ Enrollment Not Complete</h2>
          <p>Please complete your enrollment to generate your ID card.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="id-page">
      <div className="id-page-header">
        <h1>🎓 Student ID Card</h1>
        <p>Your official student identification card</p>
      </div>

      <div className="id-card">
        {/* Header */}
        <div className="id-header">
          <div className="logo">📚</div>
          <h2>Code Academy</h2>
          <span>Student Identification</span>
        </div>

        {/* Body */}
        <div className="id-body">
          <div className="photo">
            <span>👤</span>
          </div>

          <div className="info">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll No:</strong> {rollNumber}</p>
            <p><strong>Course:</strong> {student.enrollment.course}</p>
            <p><strong>Teacher:</strong> {student.enrollment.teacher}</p>
            <p><strong>Timing:</strong> {student.enrollment.timing}</p>
            <p><strong>Days:</strong> {student.enrollment.days.join(", ")}</p>
            <p><strong>Duration:</strong> {student.enrollment.duration}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="id-footer">
          <div className="signature-line">
            <span>Authorized Signature</span>
          </div>
          <div className="date">
            Issue Date: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <button className="download-btn" onClick={handleDownloadCard}>
        📥 Download ID Card
      </button>
    </div>
  );
}

export default IDCard;