import React,{useState} from 'react'
import StudentForm from './Studentform'
import Faculty from './Faculty'
import FacultyList from './FacultyList'
import ShowStudents from './ShowStudents';
// import "../index.css"
import "./App.css"


function App() {

    const [updateData, setUpdateData] = useState(false);

    const handleUpdate = () => {
      setUpdateData(!updateData);
    };
  return (
    <>
      <Faculty facultySaved={handleUpdate} />
    
      <StudentForm studentSaved={handleUpdate} updateData={updateData} />

      <FacultyList updateData={updateData} facultyUpdated={handleUpdate} />
      <ShowStudents updateData={updateData}/>
    </>
  )
}

export default App