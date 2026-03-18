import React, { useState } from 'react';
import axios from 'axios';
import CalendarView from './CalenderView.js';


function MedicationForm({ onAdd }) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [ampm, setAmpm] = useState('AM');
  const [dosage, setDosage] = useState('');
  const [days, setDays] = useState(1);

  const handleAdd = async (e) => {
    e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); 
    

    const res = await axios.post(
      "https://medi-app-1ujt.onrender.com/api/medications",
      {
        userId,
        name,
        time: `${time} ${ampm}`,   // include AM/PM
        dosage,
        days,
        status: "pending"
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Backend returns multiple records (insertMany)
    onAdd(res.data);
    setName('');
    setTime('');
    setDosage('');
    setDays(1);
    setAmpm('AM');
  } catch (err) {
    alert(err.response?.data?.error || "Error adding medication: "+ err.message);
  }
};

  return (
  <div className="container mt-4">
  <div className="row">
    {/* Add Medication Form */}
    <div className="col-md-6">
      <div className="card h-100 p-3 bg-success-subtle border border-success-subtle rounded-3">
        <h5 className="text-success mb-3">Add Medication</h5>
        <input
          className="form-control mb-2"
          placeholder="Medicine name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <div className="d-flex mb-2">
        <input
          className="form-control mb-0"
          type = "time"
          value={time}
          format="hh:mm a"   // ensures AM/PM
          onChange={e => setTime(e.target.value)}
        />
        <select
          className="form-select"
          value={ampm}
          onChange={e => setAmpm(e.target.value)}
        >
          <option>AM</option>
          <option>PM</option>
        </select>
      </div>

        <input
        className="form-control mb-2"
        type="text"
        placeholder="Dosage (e.g. 2 tablets)"
        value={dosage}
        onChange={e => setDosage(e.target.value)}
        />

      <div className="d-flex align-items-center mb-3">
        <label className="me-2">Days:</label>
        <input
          type="number"
          className="form-control w-25"
          min="1"
          value={days}
          onChange={e => setDays(e.target.value)}
        />
      </div>
        <button className="btn btn-success mb-3" onClick={handleAdd}>Add</button>
      </div>
  </div>

    {/* Calendar View */}
      <div className="col-md-6 p-4 bg-success-subtle border border-success-subtle rounded-3 ">
        <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div> 
    
</div>
</div>
  );
}

export default MedicationForm;



