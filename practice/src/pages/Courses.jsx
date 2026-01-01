import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Courses.css";

function Courses() {
  const navigate = useNavigate();

  const [coursesData, setCoursesData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [teacher, setTeacher] = useState("");
  const [timing, setTiming] = useState("");
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  // Fetch courses from Firestore
  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const courses = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // If no courses in Firestore, use default data
      if (courses.length === 0) {
        setCoursesData([
          {
            id: "1",
            title: "Web Development",
            teachers: ["Ali", "Sara", "Ahmed"],
            duration: "3 Months",
            timings: ["9am - 11am", "2pm - 4pm"]
          },
          {
            id: "2",
            title: "UI UX Design",
            teachers: ["Ayesha", "Hassan"],
            duration: "2 Months",
            timings: ["10am - 12pm", "3pm - 5pm"]
          },
          {
            id: "3",
            title: "Mobile App Development",
            teachers: ["Usman", "Fatima"],
            duration: "4 Months",
            timings: ["11am - 1pm", "5pm - 7pm"]
          }
        ]);
      } else {
        setCoursesData(courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Use default data on error
      setCoursesData([
        {
          id: "1",
          title: "Web Development",
          teachers: ["Ali", "Sara", "Ahmed"],
          duration: "3 Months",
          timings: ["9am - 11am", "2pm - 4pm"]
        },
        {
          id: "2",
          title: "UI UX Design",
          teachers: ["Ayesha", "Hassan"],
          duration: "2 Months",
          timings: ["10am - 12pm", "3pm - 5pm"]
        },
        {
          id: "3",
          title: "Mobile App Development",
          teachers: ["Usman", "Fatima"],
          duration: "4 Months",
          timings: ["11am - 1pm", "5pm - 7pm"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function toggleDay(day) {
    setDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }

  async function handleEnroll() {
    if (!selectedCourse || !teacher || !timing || days.length === 0) {
      alert("Please complete all selections");
      return;
    }

    setEnrolling(true);

    try {
      const userId = auth.currentUser.uid;
      const studentRef = doc(db, "students", userId);
      
      // Get existing student data
      const studentDoc = await getDoc(studentRef);
      
      if (!studentDoc.exists()) {
        alert("Please complete your bio data first!");
        navigate("/student-bio");
        return;
      }

      // Update student document with enrollment info
      await updateDoc(studentRef, {
        enrollment: {
          course: selectedCourse.title,
          courseId: selectedCourse.id,
          teacher: teacher,
          timing: timing,
          days: days,
          duration: selectedCourse.duration,
          enrolledAt: new Date().toISOString(),
        }
      });

      alert("Enrollment Successful! 🎉");
      navigate("/id-card");
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Error enrolling: " + error.message);
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return (
      <div className="courses-container">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Choose Your Course</h1>
        <p>Select the perfect course to start your learning journey</p>
      </div>

      {/* Courses Cards */}
      <div className="courses-grid">
        {coursesData.map(course => (
          <div
            key={course.id}
            className={`course-card ${selectedCourse?.id === course.id ? "active" : ""}`}
            onClick={() => {
              setSelectedCourse(course);
              setTeacher("");
              setTiming("");
              setDays([]);
            }}
          >
            <div className="course-icon">📚</div>
            <h3>{course.title}</h3>
            <p className="duration">⏱ {course.duration}</p>
            <p className="teachers">👨‍🏫 {course.teachers.length} Teachers</p>
          </div>
        ))}
      </div>

      {/* Enrollment Options */}
      {selectedCourse && (
        <div className="enroll-section">
          <h2>Enroll in {selectedCourse.title}</h2>
          <p className="enroll-subtitle">Complete your enrollment details below</p>

          <div className="enroll-grid">
            {/* Teacher Selection */}
            <div className="input-group">
              <label>Select Teacher</label>
              <select value={teacher} onChange={e => setTeacher(e.target.value)}>
                <option value="">Choose a teacher</option>
                {selectedCourse.teachers.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Timing Selection */}
            <div className="input-group">
              <label>Select Timing</label>
              <select value={timing} onChange={e => setTiming(e.target.value)}>
                <option value="">Choose timing</option>
                {selectedCourse.timings.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Days Selection */}
          <div className="input-group">
            <label>Select Days</label>
            <div className="days">
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => (
                <button
                  key={day}
                  type="button"
                  className={days.includes(day) ? "day active" : "day"}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="enroll-btn" 
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? "Enrolling..." : "Enroll & Generate ID Card →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Courses;