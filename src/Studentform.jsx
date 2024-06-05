
import React, { useState } from 'react';

function Studentform() {
  const [name, setName] = useState('');
  const [faculty, setFaculty] = useState('');

  const faculties = ['Somesh Sharma','rohit Jain'];


  const handleSubmit = async (event) => {
    event.preventDefault();

    const studentData = { name,faculty};

    try {
      const response = await fetch('http://localhost:3000/saveStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      if (response.ok) {
        console.log({Meassage:'Student saved'});
      } else {
        console.log('Failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>Student Information</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {/* <label htmlFor="name">Faculty:</label>
        <input
          type="text"
          id="faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          required
        /> */}
         <label htmlFor="faculty">Faculty:</label>
        {/* <select
          id="faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          required
        >
          <option value="">Select</option>
          
         
        </select> */}


        <select
          id="faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          required
        >
          <option value="">Select</option>
          {faculties.map((faculty, index) => (
            <option key={index} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>

        <button type="submit">Save Student</button>
      </form>
    </div>
  );
}

export default Studentform;
