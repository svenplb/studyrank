import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const WAITLIST_FILE = path.join(__dirname, 'waitlist.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function loadWaitlist() {
  if (!fs.existsSync(WAITLIST_FILE)) return [];
  return JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf8'));
}

function saveWaitlist(list) {
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(list, null, 2));
}

app.post('/api/waitlist', (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email.' });
  }

  const list = loadWaitlist();

  if (list.find(e => e.email === email)) {
    return res.status(409).json({ error: 'Already on the list.' });
  }

  list.push({ email, joinedAt: new Date().toISOString() });
  saveWaitlist(list);

  console.log(`[+] ${email} — total: ${list.length}`);
  res.json({ ok: true, count: list.length });
});

app.get('/api/waitlist', (req, res) => {
  const list = loadWaitlist();
  res.json({ count: list.length, emails: list });
});

app.listen(PORT, () => {
  console.log(`StudyRank server running → http://localhost:${PORT}`);
});
