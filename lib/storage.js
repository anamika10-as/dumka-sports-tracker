import fs from 'fs';
import path from 'path';
import { connectDB } from './db.js';
import Player from '../models/Player.js';
import Session from '../models/Session.js';
import Match from '../models/Match.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_PLAYERS = [
  {
    _id: 'p1',
    name: 'Rohit Soren',
    age: 17,
    sport: 'Football',
    academy: 'Dumka Sports Academy',
    contact: '+91 98765 43210',
    position: 'Striker / Forward',
    jerseyNumber: '10',
    fitnessScore: 92,
    coachNotes: 'Excellent sprint speed and finishing. Very consistent in practice.',
    active: true,
    createdAt: '2026-10-01T08:00:00.000Z',
  },
  {
    _id: 'p2',
    name: 'Ankit Kumar',
    age: 16,
    sport: 'Cricket',
    academy: 'Dumka Sports Academy',
    contact: '+91 98765 43211',
    position: 'All-Rounder (Right Arm Fast)',
    jerseyNumber: '7',
    fitnessScore: 88,
    coachNotes: 'Solid swing bowler, reliable lower-order batsman.',
    active: true,
    createdAt: '2026-10-02T08:00:00.000Z',
  },
  {
    _id: 'p3',
    name: 'Sunita Marandi',
    age: 15,
    sport: 'Football',
    academy: 'Dumka Sports Academy',
    contact: '+91 98765 43212',
    position: 'Midfielder',
    jerseyNumber: '8',
    fitnessScore: 95,
    coachNotes: 'High stamina, great passing vision. Ready for district trials.',
    active: true,
    createdAt: '2026-10-03T08:00:00.000Z',
  },
  {
    _id: 'p4',
    name: 'Prakash Hembrom',
    age: 18,
    sport: 'Cricket',
    academy: 'Dumka Sports Academy',
    contact: '+91 98765 43213',
    position: 'Top Order Batsman / WK',
    jerseyNumber: '18',
    fitnessScore: 78,
    coachNotes: 'Good stroke play, but skipped 2 recent morning fitness sessions.',
    active: true,
    createdAt: '2026-10-04T08:00:00.000Z',
  },
  {
    _id: 'p5',
    name: 'Bablu Murmu',
    age: 16,
    sport: 'Football',
    academy: 'Dumka Sports Academy',
    contact: '+91 98765 43214',
    position: 'Goalkeeper',
    jerseyNumber: '1',
    fitnessScore: 85,
    coachNotes: 'Strong reflexes, good communication with defenders.',
    active: true,
    createdAt: '2026-10-05T08:00:00.000Z',
  },
  {
    _id: 'p6',
    name: 'Pooja Kumari',
    age: 17,
    sport: 'Athletics',
    academy: 'Dumka Sports Academy',
    contact: '+91 98765 43215',
    position: '100m / 200m Sprint',
    jerseyNumber: '12',
    fitnessScore: 96,
    coachNotes: 'State trial candidate. Clocking sub-12.8s in 100m.',
    active: true,
    createdAt: '2026-10-06T08:00:00.000Z',
  },
];

const INITIAL_SESSIONS = [
  {
    _id: 's1',
    date: '2026-10-25',
    sport: 'Football',
    sessionType: 'Practice',
    academy: 'Dumka Sports Academy',
    focusArea: 'Passing drills & small sided game',
    attendance: [
      { playerId: 'p1', playerName: 'Rohit Soren', status: 'Present', notes: 'Active in drills' },
      { playerId: 'p3', playerName: 'Sunita Marandi', status: 'Present', notes: 'Exceptional work rate' },
      { playerId: 'p5', playerName: 'Bablu Murmu', status: 'Present', notes: 'Shot stopping practice' },
    ],
    totalPlayers: 3,
    presentCount: 3,
    absentCount: 0,
    createdAt: '2026-10-25T11:00:00.000Z',
  },
  {
    _id: 's2',
    date: '2026-10-27',
    sport: 'Football',
    sessionType: 'Morning Conditioning',
    academy: 'Dumka Sports Academy',
    focusArea: 'Sprint intervals & tactical formation',
    attendance: [
      { playerId: 'p1', playerName: 'Rohit Soren', status: 'Present', notes: 'Strong sprint times' },
      { playerId: 'p3', playerName: 'Sunita Marandi', status: 'Present', notes: 'Full workout completed' },
      { playerId: 'p5', playerName: 'Bablu Murmu', status: 'Absent', notes: 'Skipped practice (family event)' },
    ],
    totalPlayers: 3,
    presentCount: 2,
    absentCount: 1,
    createdAt: '2026-10-27T07:30:00.000Z',
  },
  {
    _id: 's3',
    date: '2026-10-28',
    sport: 'Cricket',
    sessionType: 'Practice',
    academy: 'Dumka Sports Academy',
    focusArea: 'Net batting against pace & death over bowling',
    attendance: [
      { playerId: 'p2', playerName: 'Ankit Kumar', status: 'Present', notes: 'Bowled 6 overs with good control' },
      { playerId: 'p4', playerName: 'Prakash Hembrom', status: 'Absent', notes: 'Skipped practice without intimation' },
    ],
    totalPlayers: 2,
    presentCount: 1,
    absentCount: 1,
    createdAt: '2026-10-28T16:00:00.000Z',
  },
];

const INITIAL_MATCHES = [
  {
    _id: 'm1',
    date: '2026-10-29',
    sport: 'Football',
    opponent: 'Deoghar FC',
    location: 'Dumka Stadium Ground',
    academyScore: '3',
    opponentScore: '1',
    result: 'Won',
    academy: 'Dumka Sports Academy',
    topScorer: 'Rohit Soren (2 goals)',
    coachNotes: 'Great victory. High team pressing worked wonders.',
    players: [
      {
        playerId: 'p1',
        playerName: 'Rohit Soren',
        played: true,
        score: 2, // 2 goals!
        assistsOrWickets: 1,
        performanceRating: 9,
        notes: 'Clinical finishing on counter-attacks.',
      },
      {
        playerId: 'p3',
        playerName: 'Sunita Marandi',
        played: true,
        score: 1, // 1 goal
        assistsOrWickets: 2,
        performanceRating: 9,
        notes: 'Controlled the midfield tempo.',
      },
      {
        playerId: 'p5',
        playerName: 'Bablu Murmu',
        played: true,
        score: 0,
        assistsOrWickets: 0,
        performanceRating: 8,
        notes: 'Made 4 crucial saves.',
      },
    ],
    createdAt: '2026-10-29T18:00:00.000Z',
  },
  {
    _id: 'm2',
    date: '2026-10-30',
    sport: 'Cricket',
    opponent: 'Ranchi Colts XI',
    location: 'Dumka District Oval',
    academyScore: '164/5 (20)',
    opponentScore: '142/9 (20)',
    result: 'Won',
    academy: 'Dumka Sports Academy',
    topScorer: 'Ankit Kumar (48 runs, 3 wkts)',
    coachNotes: 'Exciting T20 friendly. Ankit was match winner.',
    players: [
      {
        playerId: 'p2',
        playerName: 'Ankit Kumar',
        played: true,
        score: 48,
        assistsOrWickets: 3,
        performanceRating: 10,
        notes: 'Man of the Match. Fast 48 off 24 balls and 3 wickets.',
      },
      {
        playerId: 'p4',
        playerName: 'Prakash Hembrom',
        played: true,
        score: 18,
        assistsOrWickets: 0,
        performanceRating: 6,
        notes: 'Struggled with timing early in the innings.',
      },
    ],
    createdAt: '2026-10-30T17:30:00.000Z',
  },
];

function getLocalStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      players: INITIAL_PLAYERS,
      sessions: INITIAL_SESSIONS,
      matches: INITIAL_MATCHES,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { players: INITIAL_PLAYERS, sessions: INITIAL_SESSIONS, matches: INITIAL_MATCHES };
  }
}

function saveLocalStore(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Data service with MongoDB Atlas & Local Store Fallback
let dbSeeded = false;
async function seedDBIfEmpty() {
  if (dbSeeded) return;
  try {
    const count = await Player.countDocuments();
    if (count === 0) {
      await Player.insertMany(INITIAL_PLAYERS.map(({ _id, ...rest }) => rest));
      await Session.insertMany(INITIAL_SESSIONS.map(({ _id, ...rest }) => rest));
      await Match.insertMany(INITIAL_MATCHES.map(({ _id, ...rest }) => rest));
      console.log('MongoDB Atlas initialized with Dumka starter data');
    }
    dbSeeded = true;
  } catch (err) {
    console.error('Auto-seed check failed:', err.message);
  }
}

export async function getPlayers(sportFilter = null) {
  const isDB = await connectDB();
  if (isDB) {
    await seedDBIfEmpty();
    const query = { active: true };
    if (sportFilter && sportFilter !== 'All') {
      query.sport = sportFilter;
    }
    const docs = await Player.find(query).sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({ ...d, _id: d._id.toString() }));
  } else {
    const store = getLocalStore();
    let list = store.players.filter((p) => p.active !== false);
    if (sportFilter && sportFilter !== 'All') {
      list = list.filter((p) => p.sport.toLowerCase() === sportFilter.toLowerCase());
    }
    return list;
  }
}

export async function addPlayer(playerData) {
  const isDB = await connectDB();
  if (isDB) {
    const created = await Player.create({
      ...playerData,
      academy: playerData.academy || 'Dumka Sports Academy',
    });
    return { ...created.toObject(), _id: created._id.toString() };
  } else {
    const store = getLocalStore();
    const newPlayer = {
      _id: 'p_' + Date.now(),
      academy: 'Dumka Sports Academy',
      fitnessScore: 80,
      active: true,
      createdAt: new Date().toISOString(),
      ...playerData,
    };
    store.players.unshift(newPlayer);
    saveLocalStore(store);
    return newPlayer;
  }
}

export async function updatePlayer(id, updateData) {
  const isDB = await connectDB();
  if (isDB) {
    const updated = await Player.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return updated ? { ...updated, _id: updated._id.toString() } : null;
  } else {
    const store = getLocalStore();
    const index = store.players.findIndex((p) => p._id === id);
    if (index === -1) return null;
    store.players[index] = { ...store.players[index], ...updateData };
    saveLocalStore(store);
    return store.players[index];
  }
}

export async function deletePlayer(id) {
  const isDB = await connectDB();
  if (isDB) {
    await Player.findByIdAndDelete(id);
    return true;
  } else {
    const store = getLocalStore();
    store.players = store.players.filter((p) => p._id !== id);
    saveLocalStore(store);
    return true;
  }
}

export async function getSessions(sportFilter = null) {
  const isDB = await connectDB();
  if (isDB) {
    const query = {};
    if (sportFilter && sportFilter !== 'All') {
      query.sport = sportFilter;
    }
    const docs = await Session.find(query).sort({ date: -1 }).lean();
    return docs.map((d) => ({ ...d, _id: d._id.toString() }));
  } else {
    const store = getLocalStore();
    let list = store.sessions;
    if (sportFilter && sportFilter !== 'All') {
      list = list.filter((s) => s.sport.toLowerCase() === sportFilter.toLowerCase());
    }
    return list.sort((a, b) => (a.date > b.date ? -1 : 1));
  }
}

export async function addSession(sessionData) {
  const attendance = sessionData.attendance || [];
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;

  const dataToSave = {
    ...sessionData,
    academy: sessionData.academy || 'Dumka Sports Academy',
    totalPlayers: attendance.length,
    presentCount,
    absentCount,
  };

  const isDB = await connectDB();
  if (isDB) {
    const created = await Session.create(dataToSave);
    return { ...created.toObject(), _id: created._id.toString() };
  } else {
    const store = getLocalStore();
    const newSession = {
      _id: 's_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...dataToSave,
    };
    store.sessions.unshift(newSession);
    saveLocalStore(store);
    return newSession;
  }
}

export async function getMatches(sportFilter = null) {
  const isDB = await connectDB();
  if (isDB) {
    const query = {};
    if (sportFilter && sportFilter !== 'All') {
      query.sport = sportFilter;
    }
    const docs = await Match.find(query).sort({ date: -1 }).lean();
    return docs.map((d) => ({ ...d, _id: d._id.toString() }));
  } else {
    const store = getLocalStore();
    let list = store.matches;
    if (sportFilter && sportFilter !== 'All') {
      list = list.filter((m) => m.sport.toLowerCase() === sportFilter.toLowerCase());
    }
    return list.sort((a, b) => (a.date > b.date ? -1 : 1));
  }
}

export async function addMatch(matchData) {
  const isDB = await connectDB();
  if (isDB) {
    const created = await Match.create({
      ...matchData,
      academy: matchData.academy || 'Dumka Sports Academy',
    });
    return { ...created.toObject(), _id: created._id.toString() };
  } else {
    const store = getLocalStore();
    const newMatch = {
      _id: 'm_' + Date.now(),
      createdAt: new Date().toISOString(),
      ...matchData,
    };
    store.matches.unshift(newMatch);
    saveLocalStore(store);
    return newMatch;
  }
}

// Compute Trial Readiness Report across players
export async function getTrialReadinessReport() {
  const players = await getPlayers();
  const sessions = await getSessions();
  const matches = await getMatches();

  return players.map((player) => {
    // 1. Calculate Attendance
    let totalEligibleSessions = 0;
    let attendedSessions = 0;
    let skippedSessions = 0;

    sessions.forEach((s) => {
      // Check if session belongs to player's sport or general
      if (s.sport.toLowerCase() === player.sport.toLowerCase()) {
        const record = s.attendance.find((a) => a.playerId === player._id || a.playerName === player.name);
        if (record) {
          totalEligibleSessions++;
          if (record.status === 'Present') {
            attendedSessions++;
          } else if (record.status === 'Absent') {
            skippedSessions++;
          }
        }
      }
    });

    const attendanceRate = totalEligibleSessions > 0 ? Math.round((attendedSessions / totalEligibleSessions) * 100) : 100;

    // 2. Calculate Match Stats & Scoring
    let matchAppearances = 0;
    let totalScore = 0; // goals or runs or points
    let totalAssistsOrWickets = 0;
    let ratings = [];

    matches.forEach((m) => {
      if (m.sport.toLowerCase() === player.sport.toLowerCase() && m.players) {
        const rec = m.players.find((p) => p.playerId === player._id || p.playerName === player.name);
        if (rec && rec.played) {
          matchAppearances++;
          totalScore += Number(rec.score) || 0;
          totalAssistsOrWickets += Number(rec.assistsOrWickets) || 0;
          if (rec.performanceRating) {
            ratings.push(rec.performanceRating);
          }
        }
      }
    });

    const avgRating = ratings.length > 0 ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)) : 7.0;

    // 3. Compute Composite Readiness Score (0-100)
    // Formula: 45% Attendance Rate + 35% Match Performance / Rating + 20% Base Fitness Score
    const fitness = player.fitnessScore || 80;
    const ratingScore = avgRating * 10; // scale 1-10 to 10-100
    const compositeScore = Math.round(attendanceRate * 0.45 + ratingScore * 0.35 + fitness * 0.2);

    // Readiness categorization
    let status = 'Needs Practice';
    let statusColor = 'red';
    let recommendations = [];

    if (attendanceRate < 60) {
      status = 'Needs Practice';
      statusColor = 'red';
      recommendations.push('Attendance is critically low. Frequently skipped practice.');
    } else if (attendanceRate >= 80 && compositeScore >= 80) {
      status = 'Ready for Trial';
      statusColor = 'emerald';
      recommendations.push('Consistent attendance, proven in match play, and peak physical condition.');
    } else {
      status = 'On Track';
      statusColor = 'amber';
      recommendations.push('Consistent development; recommend 2 more weeks of focused tactical drills.');
    }

    if (totalScore > 0) {
      if (player.sport === 'Football') {
        recommendations.push(`Scored ${totalScore} goal${totalScore > 1 ? 's' : ''} in matches.`);
      } else if (player.sport === 'Cricket') {
        recommendations.push(`Scored ${totalScore} runs with ${totalAssistsOrWickets} wickets.`);
      } else {
        recommendations.push(`Contributed ${totalScore} points in match play.`);
      }
    }

    return {
      player,
      metrics: {
        totalEligibleSessions,
        attendedSessions,
        skippedSessions,
        attendanceRate,
        matchAppearances,
        totalScore,
        totalAssistsOrWickets,
        avgRating,
        fitnessScore: fitness,
        compositeScore,
      },
      status,
      statusColor,
      recommendations,
    };
  });
}

