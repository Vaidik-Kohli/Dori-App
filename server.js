import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db from './db/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all jobs for the Operator Console
app.get('/api/jobs', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM jobs ORDER BY id DESC');
        const jobs = stmt.all();
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// Get the currently active dispatched job (for Helper/NRI App)
app.get('/api/jobs/active', (req, res) => {
    try {
        // Find the most recent job that isn't pending or completed
        const stmt = db.prepare("SELECT * FROM jobs WHERE status IN ('dispatched', 'en_route', 'arrived') ORDER BY id DESC LIMIT 1");
        const job = stmt.get();
        if (job) {
            res.json(job);
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch active job' });
    }
});

// Create a new job (called when Operator loads JSON)
app.post('/api/jobs', (req, res) => {
    try {
        const {
            caller_name, location, urgency_level, category,
            required_skill, assigned_helper_name, summary, raw_transcript, followup_action, escalate_to_emergency
        } = req.body;
        
        // Generate a random Call ID for realism
        const call_id = '#' + Math.floor(1000 + Math.random() * 9000);
        const otp_code = Math.floor(1000 + Math.random() * 9000).toString();

        const stmt = db.prepare(`
            INSERT INTO jobs (
                call_id, caller_name, location, urgency_level, category,
                required_skill, assigned_helper_name, otp_code, summary, raw_transcript, followup_action, escalate_to_emergency, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const info = stmt.run(
            call_id, caller_name, location, urgency_level, category,
            required_skill, assigned_helper_name, otp_code, summary, raw_transcript, followup_action, 
            escalate_to_emergency ? 1 : 0, 
            'pending'
        );
        
        io.emit('job:created');
        res.status(201).json({ success: true, id: info.lastInsertRowid, call_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

// Update job status (called when Operator dispatches or Helper accepts)
app.put('/api/jobs/:id/status', (req, res) => {
    try {
        const { status, assigned_helper_name } = req.body;
        let stmt, info;
        
        if (assigned_helper_name) {
            stmt = db.prepare('UPDATE jobs SET status = ?, assigned_helper_name = ? WHERE id = ?');
            info = stmt.run(status, assigned_helper_name, req.params.id);
        } else {
            stmt = db.prepare('UPDATE jobs SET status = ? WHERE id = ?');
            info = stmt.run(status, req.params.id);
        }
        
        if (info.changes > 0) {
            io.emit('job:updated');
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job' });
    }
});

io.on('connection', (socket) => {
    // Client connected
});

server.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
});
