import React, { useState } from 'react';
import axios from 'axios';

const ExportExcel = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loadingPDF, setLoadingPDF] = useState('');
    const [error, setError] = useState('');

    const handleExport = () => {
        axios.get(`http://localhost:3000/exportAttendance/${startDate}/${endDate}`, {
            responseType: 'blob' 
        })
        .then(response => {
           
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'attendance.xlsx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link); 
        })
        .catch(error => {
            console.error('Error exporting attendance:', error);
           
        });
    };



    const handleExportJSON = () => {
        axios.get(`http://localhost:3000/exportAttendanceJSON/${startDate}/${endDate}`)
            .then(response => {
                const jsonData = JSON.stringify(response.data);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'attendance.json'); 
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link); 
            })
            .catch(error => {
                console.error('Error exporting attendance as JSON:', error);
            });
    };


    
    const handleExportPDF = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }

        setLoadingPDF(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:3000/exportAttendancePDF/${startDate}/${endDate}`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendance_${startDate}_${endDate}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError('Error exporting PDF');
            console.error('Error exporting PDF:', err);
        } finally {
            setLoadingPDF(false);
        }
    };

    return (
        <div className="wrapper max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg">
            <div className=" ">
                <h1 className="text-2xl font-bold mb-4 text-center">Export Attendance</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Start Date</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">End Date</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <button 
                    onClick={handleExport} 
                    className=" bg-green-600 text-white px-4 py-2 rounded-md text-center flex justify-center items-center m-auto mb-[2rem]"
                >
                    Export Attendance in Excel
                </button>
                <button 
                    
                    className=" bg-blue-600 text-white px-4 py-2 rounded-md text-center flex justify-center items-center m-auto mb-[2rem]"
                    onClick={handleExportJSON}>
                    Export Attendance as JSON
                </button>
                <button 
                    
                    className=" bg-blue-600 text-white px-4 py-2 rounded-md text-center flex justify-center items-center m-auto"
                    onClick={handleExportPDF}
                    >
                    Download Pdf
                </button>
            </div>
        </div>
    );
};

export default ExportExcel;