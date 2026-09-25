import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// API Keys to be added via .env
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join_job_room', (jobId) => {
    socket.join('job_' + jobId);
    console.log('Socket ' + socket.id + ' joined room job_' + jobId);
  });

  socket.on('audio_chunk', (data) => {
    // Process audio chunk using Google STT (Placeholder)
    if (GOOGLE_API_KEY) {
      // TODO: Pipe to Google STT API
    }
  });

  socket.on('dispatch_helper', (data) => {
    // Operator dispatches a helper
    const { jobId, helperName } = data;
    const otpCode = crypto.randomInt(1000, 9999).toString();
    
    // Broadcast to the parent and NRI apps that the helper is dispatched
    io.emit('job_dispatched', {
      jobId,
      helperName,
      otpCode,
      status: 'dispatched'
    });
  });

  socket.on('helper_arrived', (data) => {
    io.emit('job_arrived', {
      jobId: data.jobId,
      status: 'en_route'
    });
  });

  socket.on('verify_otp', (data) => {
    // Helper verifies OTP
    io.emit('job_completed', {
      jobId: data.jobId,
      status: 'completed'
    });
  });
});

app.post('/api/jobs/trigger', async (req, res) => {
  try {
    const { parentId, location } = req.body;
    const dummyJobId = crypto.randomUUID();

    // Trigger AI Triage (Placeholder)
    if (GEMINI_API_KEY) {
      // TODO: Call Gemini API to parse transcript
    }

    io.emit('new_sos', {
      jobId: dummyJobId,
      parentId,
      location,
      category: 'Pending Triage',
      summary: 'Awaiting audio...',
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      jobId: dummyJobId,
      message: 'SOS triggered. Connecting to operator...'
    });
  } catch (error) {
    console.error('Error triggering SOS:', error);
    res.status(500).json({ error: 'Failed to trigger SOS' });
  }
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log('?? Production Backend running on port ' + PORT);
});
