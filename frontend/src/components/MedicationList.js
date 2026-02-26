import '../styles/medication.css';

function MedicationList({ medications }) {
  return (
    <ul>
      {medications.map(med => (
        <li key={med._id}>{med.name} - {med.dosage}</li>
      ))}
    </ul>
  );
}

export default MedicationList;