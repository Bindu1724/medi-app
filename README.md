# 🩺 Medication Management App
A full‑stack MERN application built to solve real‑world healthcare challenges: helping patients and caretakers track medication schedules, adherence, and reminders. This project demonstrates my ability to design, debug, and deliver production‑ready apps with polished UI and maintainable backend logic.

# 🚀 Live Demo
- Frontend (Netlify):https://medication-tracker-app.netlify.app
- Backend (Render): https://medi-app-1ujt.onrender.com 
- API Base URL: https://medi-app-1ujt.onrender.com/api


# 🚀 Key Features
- Authentication & Role Management:
Secure login for patients and caretakers, with role-based dashboards.
- Medication Scheduling:
Add, edit, and delete medications with dosage, frequency, and timing.
- Automatic calculation of:
    Streaks (days of consistent intake)
    Missed doses this month
    Taken doses this week
    Overall adherence rate
    Caretaker Dashboard
- Caretakers can monitor patient adherence, streaks, and missed doses in real time.
- Email Reminders:
Integrated with Nodemailer (adaptable to providers like SendGrid/Mailgun) for reliable medication reminders.
- Responsive UI:
Built with React and Bootstrap for a clean, professional interface.


# 📂 Project Structure
/medication-app
  ├── backend
  │   ├── models        # MongoDB schemas
  │   ├── routes        # Express routes
  │   └── utils         # Helper functions (adherence, streaks, etc.)
  ├── frontend
  │   ├── components    # Reusable UI components
  │   ├── pages         # Dashboard, Login, Calendar
  │   └── styles        # Bootstrap + custom CSS
  └── README.md



# ⚙️ Installation & Setup
- Clone the repository
git clone https://github.com/yourusername/medication-app.git
cd medication-app
- Install dependencies
npm install
cd frontend && npm install
- Configure environment variables Create a .env file in the backend with:
MONGO_URI=your_mongodb_connection
EMAIL_SERVICE=your_email_provider
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
- Run the app
# Start backend
npm run server

# Start frontend
cd frontend
npm start

# 🧩 My Contributions
- Designed MongoDB schemas and Express routes for medication tracking.
- Implemented backend logic for adherence metrics and streak consistency across dashboards.
- Debugged integration issues (userId mismatches, badge color inconsistencies).
- Refactored code for maintainability and scalability.
- Focused on UI polish: centered calendar, reusable CSS, and professional layouts.

# 📸 Demo Highlights
- Patient Dashboard: shows streaks, adherence, and reminders.
- Caretaker Dashboard: monitors multiple patients with real‑time updates.
- Medication Calendar: clean, centered, and responsive.

# 👩‍💻 Author
Developed by Bindu — aspiring full-stack developer passionate about building scalable, user-friendly healthcare solutions.
