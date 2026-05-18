const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const PORT = process.env.PORT || 4000;
const VALID_EMAIL = "player@gamed.dev";
const VALID_PASSWORD = "hunter22";

const PLATFORMS = [
  { id: "steam", name: "Steam" },
  { id: "epic", name: "Epic Games" },
  { id: "playstation", name: "PlayStation" },
  { id: "xbox", name: "Xbox" },
];

const SESSIONS_SEED = [
  { game: "Counter-Strike 2", grade: "S", apm: 312 },
  { game: "VALORANT", grade: "A", apm: 268 },
  { game: "Apex Legends", grade: "B", apm: 224 },
  { game: "Rocket League", grade: "A", apm: 184 },
  { game: "Marvel Rivals", grade: "C", apm: 197 },
];

const state = {
  user: {
    id: "u_001",
    gamedId: "GAMED-7421-X",
    displayName: "Sentinel.exe",
    gigiScore: 2147,
    globalPercentile: 98.7,
    platforms: PLATFORMS.map((p, i) => ({
      ...p,
      connected: i === 0,
    })),
  },
  sessions: SESSIONS_SEED.map((s, i) => ({
    id: `s_${i + 1}`,
    game: s.game,
    grade: s.grade,
    apm: s.apm,
    playedAt: new Date(Date.now() - (i + 1) * 22 * 60 * 60 * 1000).toISOString(),
  })),
  validTokens: new Set(),
};

const app = express();
app.use(cors());
app.use(express.json());

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !state.validTokens.has(token)) {
    return res.status(401).json({ error: "Invalid or missing token" });
  }
  next();
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const accessToken = crypto.randomBytes(24).toString("hex");
  const refreshToken = crypto.randomBytes(24).toString("hex");
  state.validTokens.add(accessToken);
  res.json({ accessToken, refreshToken, user: state.user });
});

app.get("/me", requireAuth, (_req, res) => {
  res.json(state.user);
});

app.get("/me/sessions", requireAuth, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);
  res.json({ sessions: state.sessions.slice(0, limit) });
});

app.patch("/me/platforms/:platform", requireAuth, (req, res) => {
  const { platform } = req.params;
  const { fail } = req.query;
  if (fail === "1") {
    return res
      .status(500)
      .json({ error: "Platform service unavailable. Please retry." });
  }
  const target = state.user.platforms.find((p) => p.id === platform);
  if (!target) {
    return res.status(404).json({ error: "Unknown platform" });
  }
  const connected =
    typeof req.body?.connected === "boolean" ? req.body.connected : true;
  target.connected = connected;
  res.json(state.user);
});

app.listen(PORT, () => {
  console.log(`[mock-server] listening on http://localhost:${PORT}`);
});
