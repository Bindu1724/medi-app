import { useState } from 'react';
import { addMedication } from '../services/medicationService';
import { getToken } from '../utils/auth';
import '../styles/medication.css';


function MedicationForm({ onAdd }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMed = await addMedication({ name, dosage }, getToken());
    onAdd(newMed);
    setName('');
    setDosage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Medication name" />
      <input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="Dosage" />
      <button type="submit">Add</button>
    </form>
  );
}

export default MedicationForm;