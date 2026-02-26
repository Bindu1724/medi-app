import { useState, useEffect } from 'react';
import MedicationForm from '../components/MedicationForm';
import MedicationList from '../components/MedicationList';
import { getMedications } from '../services/medicationService';
import { getToken } from '../utils/auth';

function MedicationPage() {
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const meds = await getMedications(getToken());
      setMedications(meds);
    }
    fetchData();
  }, []);

  const handleAdd = (newMed) => {
    setMedications([...medications, newMed]);
  };

  return (
    <div>
      <h2>Medication Tracker</h2>
      <MedicationForm onAdd={handleAdd} />
      <MedicationList medications={medications} />
    </div>
  );
}

export default MedicationPage;