import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Load schedule dataset
const schedulePath = path.join(__dirname, 'src', 'data', 'workbookSchedule.json');
let sessions = [];
try {
  sessions = JSON.parse(fs.readFileSync(schedulePath, 'utf8'));
} catch (err) {
  console.error('Failed to load initial workbook schedule:', err);
}

// Algorithm helpers
function parseTimeToMinutes(timeStr) {
  const trimmed = (timeStr || '').trim();
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return h * 60 + m;
  }
  return null;
}

// API: Allocate
app.post('/api/allocate', (req, res) => {
  const { busNumber, arrivalTime, arrivalSoc } = req.body;
  const busNo = parseInt(busNumber, 10);
  const arrivalMinute = parseTimeToMinutes(arrivalTime);
  const soc = parseFloat(arrivalSoc);

  if (!busNo || arrivalMinute === null || isNaN(soc)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  let sessionFound = false;
  let firstSessionMissed = false;
  let sessDuration = 0;
  let timeDiff = 0.0;
  let scheduledStart = 0;
  let scheduledEnd = 0;
  let charger = 0;
  let chargingTime = 0;
  let pluginTime = 0;
  let statusCaption = '';

  const busSessions = sessions.filter(s => s.bus === busNo);

  for (const session of busSessions) {
    const sStart = session.startMinute;
    const sEnd = session.endMinute;

    if (arrivalMinute > sEnd) {
      firstSessionMissed = true;
      sessDuration = sEnd - sStart;
    } else {
      charger = session.charger;
      sessionFound = true;
      scheduledStart = sStart;
      scheduledEnd = sEnd;

      if (arrivalMinute < scheduledStart) {
        timeDiff = (scheduledStart - arrivalMinute) / 60.0;
        if (timeDiff <= 1.0) {
          chargingTime = scheduledEnd - scheduledStart;
          pluginTime = scheduledStart;
          statusCaption = 'Arrived early (<1 hr). Waiting for scheduled charger.';
          break;
        }
      }

      if (arrivalMinute < scheduledStart) {
        chargingTime = scheduledEnd - scheduledStart;
        pluginTime = scheduledStart;
      } else {
        chargingTime = scheduledEnd - arrivalMinute;
        pluginTime = arrivalMinute;
      }
      statusCaption = 'Allocated to scheduled charger.';
      break;
    }
  }

  if (!sessionFound) {
    return res.json({
      busNumber: busNo,
      arrivalMinute,
      arrivalSoc: soc,
      allocatedCharger: null,
      pluginMinute: null,
      plugoutMinute: null,
      expectedSoc: null,
      statusText: 'Bus missed all scheduled sessions.',
      isMissedAndReallocated: false,
    });
  }

  const tchg = chargingTime;
  const socGain = 0.95 * (tchg / 60.0) * (240.0 / 360.0) * 100.0;
  const socDep = Math.round((soc + socGain) * 100) / 100;
  const expectedSoc = Math.min(100, socDep);

  let finalPlugin = pluginTime;
  let finalPlugout = scheduledEnd;
  let finalCharger = charger;
  let isMissedReallocated = false;

  if (firstSessionMissed && timeDiff > 1.0) {
    const requiredEnd = arrivalMinute + sessDuration;
    for (let ch = 1; ch <= 20; ch++) {
      let isBusy = false;
      for (const existing of sessions) {
        if (existing.charger === ch) {
          if (!(requiredEnd <= existing.startMinute || arrivalMinute >= existing.endMinute)) {
            isBusy = true;
            break;
          }
        }
      }
      if (!isBusy) {
        finalPlugin = arrivalMinute;
        finalPlugout = requiredEnd;
        finalCharger = ch;
        statusCaption = `Missed session. New charger allocated: ${ch}`;
        isMissedReallocated = true;
        break;
      }
    }
  }

  res.json({
    busNumber: busNo,
    arrivalMinute,
    arrivalSoc: soc,
    allocatedCharger: finalCharger,
    pluginMinute: finalPlugin,
    plugoutMinute: finalPlugout,
    expectedSoc,
    statusText: statusCaption,
    isMissedAndReallocated: isMissedReallocated,
  });
});

// API: Sessions
app.get('/api/sessions', (req, res) => {
  res.json(sessions);
});

// Serve frontend dist if present
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`EB Scheduling WebApp Server listening on http://0.0.0.0:${PORT}`);
});
