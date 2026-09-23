import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'bharatcare.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    call_id TEXT UNIQUE NOT NULL,
    caller_name TEXT NOT NULL,
    location TEXT NOT NULL,
    urgency_level TEXT NOT NULL,
    category TEXT NOT NULL,
    required_skill TEXT NOT NULL,
    assigned_helper_name TEXT,
    otp_code TEXT,
    summary TEXT NOT NULL,
    raw_transcript TEXT,
    followup_action TEXT,
    escalate_to_emergency BOOLEAN,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Auto-seed if empty
const rowCount = db.prepare("SELECT COUNT(*) as count FROM jobs").get();
if (rowCount.count === 0) {
    console.log("Database is empty. Seeding with demo data...");
    const insertStmt = db.prepare(`
        INSERT INTO jobs (
            call_id, caller_name, location, urgency_level, category,
            required_skill, assigned_helper_name, otp_code, summary, followup_action, escalate_to_emergency, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const demoJobs = [
        ['#1047', 'Gurleen Kaur', 'Amritsar, Punjab', 'routine', 'Tech Help', 'Tech Helper', 'Rohan Singh', '1234', 'Video call screen is black.', 'No', 0, 'pending'],
        ['#1048', 'Rajesh Sharma', 'Lucknow, UP', 'urgent', 'Medical', 'Pharmacy Runner', 'Sunil Verma', '5678', 'BP medicine refill needed.', 'Deliver tonight', 0, 'pending'],
        ['#1049', 'Anita Mehra', 'Delhi', 'emergency', 'Medical', 'Paramedic', 'Preeti Gupta', '9012', 'Chest pain, feeling dizzy.', 'Call Daughter', 1, 'pending'],
        ['#1050', 'Sunita Gupta', 'Jaipur, Rajasthan', 'routine', 'Home Repair', 'Plumber', 'Ramesh Sharma', '3456', 'Geyser repair.', 'No', 0, 'completed']
    ];

    demoJobs.forEach(job => {
        insertStmt.run(...job);
    });
}

function createJob(jobData) {
    const {
        caller_name, location, urgency_level, category, required_skill, assigned_helper_name,
        summary, followup_action, escalate_to_emergency
    } = jobData;

    const call_id = '#' + Math.floor(1000 + Math.random() * 9000);
    const otp_code = Math.floor(1000 + Math.random() * 9000).toString();
    const status = 'pending';

    const stmt = db.prepare(`
        INSERT INTO jobs 
        (call_id, caller_name, location, urgency_level, category, required_skill, assigned_helper_name, otp_code, summary, followup_action, escalate_to_emergency, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
        call_id, caller_name, location, urgency_level, category,
        required_skill, assigned_helper_name, otp_code, summary, followup_action, escalate_to_emergency ? 1 : 0, status
    );
    return info.lastInsertRowid;
}

function getAllJobs() {
    return db.prepare("SELECT * FROM jobs ORDER BY id DESC").all();
}

function updateJobStatus(id, status) {
    const stmt = db.prepare("UPDATE jobs SET status = ? WHERE id = ?");
    return stmt.run(status, id);
}

function getActiveJob() {
    return db.prepare("SELECT * FROM jobs WHERE status IN ('dispatched', 'en_route') ORDER BY id DESC LIMIT 1").get();
}

export default db;
export {
    createJob,
    getAllJobs,
    updateJobStatus,
    getActiveJob
};
