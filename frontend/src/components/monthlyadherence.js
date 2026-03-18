// src/components/monthlyadherence.js
function MonthlyAdherenceProgress({ taken, missed }) {
  const total = taken + missed;
  const percent = total ? Math.round((taken / total) * 100) : 0;

  return (
    <div className="progress" style={{ height: '30px' }}>
      <div
        className="progress-bar bg-success"
        role="progressbar"
        style={{ width: `${percent}%` }}
        aria-valuenow={taken}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        {percent}%
      </div>
    </div>
  );
}

export default MonthlyAdherenceProgress;