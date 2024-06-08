import React, { useState, useEffect } from "react";
import axios from "axios";

function ShowStudents({ updateData }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchFaculties() {
    try {
      const response = await axios.get("http://localhost:3000/getFaculty");
      if (response.status === 200) {
        setTeachers(response.data);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.error("error");
    }
  }

  async function fetchStudents(faculty) {
    try {
      const response = await axios.get(`http://localhost:3000/getStudent?faculty=${faculty}`);
      if (response.status === 200) {
        setStudents(response.data);
        const initialAttendance = {};
        response.data.forEach(student => {
          initialAttendance[student._id] = { name: student.name, status: "A" };
        });
        setAttendance(initialAttendance);
      } else {
        console.log("failed");
      }
    } catch (error) {
      console.error("error");
    }
  }

  async function saveAttendance() {
    try {
      const attendanceData = Object.entries(attendance).map(([id, { name, status }]) => ({ id, name, status }));
      const response = await axios.post("http://localhost:3000/saveAttendance", 
      { attendance: attendanceData, faculty: selectedFaculty });
      if (response.status === 200) {
        setMessage('Attendance saved successfully!');
        setError('');
        console.log(response, "response");
      } else {
        setError('Failed to save attendance!');
        setMessage('');
      }
    } catch (error) {
      setError('Failed to save attendance!');
      setMessage('');
    }
  }

  useEffect(() => {
    fetchFaculties();
  }, [updateData]);

  useEffect(() => {
    if (selectedFaculty) {
      fetchStudents(selectedFaculty);
    }
  }, [selectedFaculty]);

  const toggleAttendance = (studentId) => {
    setAttendance(prevAttendance => ({
      ...prevAttendance,
      [studentId]: {
        ...prevAttendance[studentId],
        status: prevAttendance[studentId].status === "A" ? "P" : "A"
      }
    }));
  };

  return (
    <>
      <div className="wrapper mx-auto bg-white rounded-lg max-w-lg p-6 my-[3rem]">
        <label className="block text-sm font-medium text-gray-700" htmlFor="faculty">
          Select faculty
        </label>
        <select
          id="faculty"
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
        >
          <option value="" disabled>
            Select faculty
          </option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher.name}>
              {teacher.name}
            </option>
          ))}
        </select>

        {students.length > 0 && (
          <div className="students-list">
            <ul>
              {students.map((student) => (
                <li key={student._id} className="border border-rounded flex justify-between items-center p-2">
                  {student.name}
                  <button
                    onClick={() => toggleAttendance(student._id)}
                    className="ml-4 px-3 py-1 border rounded-md bg-gray-200"
                  >
                    {attendance[student._id]?.status}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className="bg-green-600 text-white mt-4 flex justify-center m-auto items-center py-2 px-4 text-sm font-medium rounded-md" type="submit" onClick={saveAttendance}>
          Save Attendance
        </button>

        {message && (
          <div className="mt-4 p-4 text-center text-green-500 font-bold text-xl rounded-md">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 text-center text-red-500 font-bold text-xl rounded-md">
            {error}
          </div>
        )}
      </div>
    </>
  );
}

export default ShowStudents;
