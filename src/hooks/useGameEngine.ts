import { useState, useRef, useCallback, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { GameState, TileData, TileType } from '../engine/types';

// ── Tuning ───────────────────────────────────────────────────────────────────
const INITIAL_FALL_DURATION = 2200;
const MIN_FALL_DURATION = 700;
const SPEED_STEP = 8;
const SPAWN_INTERVAL_FRAC = 0.38;
const TICK_MS = 16;

// The "hit zone" expressed as fractions of board height
// Tiles whose TOP-EDGE is between these two values are hittable.
export const HIT_TOP = 0.65;
export const HIT_BOT = 0.92;

// Tile heights as fractions of board height
export const TILE_H = 0.12;
export const HOLD_TILE_H = 0.22;

// ── Helpers ──────────────────────────────────────────────────────────────────
let _idCounter = 0;
const genId = () => `t${++_idCounter}`;

const randLane = () => Math.floor(Math.random() * 4);

const randType = (): TileType => {
  const r = Math.random();
  if (r > 0.94) return TileType.GOLD;
  if (r > 0.82) return TileType.GREEN;
  return TileType.BLUE;
};

/** Fraction of the board the tile-top has traversed (0 = above screen, 1 = bottom). */
export const tileFrac = (tile: TileData, now: number): number =>
  (now - tile.spawnTime) / tile.fallDuration;

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useGameEngine() {
  const [gs, setGs] = useState<GameState>({
    score: 0,
    combo: 0,
    shields: 0,
    isGameOver: false,
    isStarted: false,
    tiles: [],
    fallDuration: INITIAL_FALL_DURATION,
  });

  // Mutable snapshot so the setInterval callback never reads stale state.
  const snap = useRef(gs);
  useEffect(() => { snap.current = gs; }, [gs]);

  // Board pixel height (set by Board's onLayout)
  const boardH = useRef(0);
  const setBoardHeight = useCallback((h: number) => { boardH.current = h; }, []);

  const lastSpawn = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── tick ────────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const s = snap.current;
    if (s.isGameOver || !s.isStarted) return;

    const now = Date.now();
    let tiles = [...s.tiles];

    // 1 ── Spawn ──────────────────────────────────────────────────────────
    const interval = s.fallDuration * SPAWN_INTERVAL_FRAC;
    if (now - lastSpawn.current >= interval) {
      lastSpawn.current = now;

      let lane = randLane();
      const prev = tiles[tiles.length - 1];
      if (prev && prev.lane === lane) lane = (lane + 1 + Math.floor(Math.random() * 3)) % 4;

      tiles.push({
        id: genId(),
        type: randType(),
        lane,
        spawnTime: now,
        fallDuration: s.fallDuration,
        hit: false,
      });
    }

    // 2 ── Detect misses ──────────────────────────────────────────────────
    let missed = false;
    const alive = tiles.filter(t => {
      if (t.hit) return false; // already scored – discard
      const frac = tileFrac(t, now);
      if (frac > HIT_BOT + 0.08) { // small grace after hit-zone bottom
        missed = true;
        return false;
      }
      return true;
    });

    if (missed) {
      if (s.shields > 0) {
        setGs(p => ({ ...p, tiles: alive, shields: p.shields - 1, combo: 0 }));
      } else {
        setGs(p => ({ ...p, isGameOver: true, tiles: alive }));
      }
      return;
    }

    // 3 ── Commit tile list if it changed ─────────────────────────────────
    if (alive.length !== s.tiles.length || tiles.length !== s.tiles.length) {
      setGs(p => ({ ...p, tiles: alive.length !== tiles.length ? alive : tiles }));
    }
  }, []);

  // ── start / stop the loop ──────────────────────────────────────────────
  useEffect(() => {
    if (gs.isGameOver || !gs.isStarted) {
      if (timer.current) { clearInterval(timer.current); timer.current = null; }
      return;
    }
    timer.current = setInterval(tick, TICK_MS);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [gs.isGameOver, gs.isStarted, tick]);

  // ── handleTap ──────────────────────────────────────────────────────────
  const handleTap = useCallback((lane: number) => {
    const s = snap.current;

    // First tap starts the game
    if (!s.isStarted) {
      lastSpawn.current = Date.now();
      setGs(p => ({ ...p, isStarted: true }));
      return true;
    }
    if (s.isGameOver) return false;

    const unhit = s.tiles.filter(t => !t.hit);
    if (unhit.length === 0) return false;

    // Magic-Tiles rules: you must tap the oldest (lowest) tile on the screen.
    // There is no vertical "hit zone" requirement - you can tap it as soon as you see it!
    unhit.sort((a, b) => a.spawnTime - b.spawnTime);
    const target = unhit[0];

    // Did they tap the correct lane for the oldest tile?
    if (target.lane === lane) {
      // ✅ HIT
      const newScore = s.score + 10 + s.combo * 2;
      const newCombo = s.combo + 1;
      const newShields = target.type === TileType.GOLD ? s.shields + 1 : s.shields;
      const newFall = Math.max(MIN_FALL_DURATION, s.fallDuration - SPEED_STEP);

      setGs(p => ({
        ...p,
        score: newScore,
        combo: newCombo,
        shields: newShields,
        fallDuration: newFall,
        tiles: p.tiles.map(t => t.id === target.id ? { ...t, hit: true } : t),
      }));
      return true;
    }

    // ❌ Tapped the wrong lane (or tapped too fast and hit an empty lane)
    if (s.shields > 0) {
      setGs(p => ({ ...p, shields: p.shields - 1, combo: 0 }));
    } else {
      setGs(p => ({ ...p, isGameOver: true }));
    }
    return false;
  }, []);

  // ── restart / revive ───────────────────────────────────────────────────
  const restartGame = useCallback(() => {
    _idCounter = 0;
    lastSpawn.current = Date.now();
    setGs({
      score: 0, combo: 0, shields: 0,
      isGameOver: false, isStarted: false,
      tiles: [], fallDuration: INITIAL_FALL_DURATION,
    });
  }, []);

  const revivePlayer = useCallback(() => {
    lastSpawn.current = Date.now();
    setGs(p => ({ ...p, isGameOver: false, tiles: [] }));
  }, []);

  return { gameState: gs, handleTap, restartGame, revivePlayer, setBoardHeight };
}
