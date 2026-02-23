import { TICK_RATE_MS, MAX_TICKS_PER_FRAME } from '@/constants/gameConfig';
import { processTick } from './tickProcessor';

let running = false;
let lastTime = 0;
let accumulator = 0;
let frameId: number | null = null;

function loop(currentTime: number) {
  if (!running) return;

  const delta = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += delta;

  let ticksThisFrame = 0;
  while (accumulator >= TICK_RATE_MS && ticksThisFrame < MAX_TICKS_PER_FRAME) {
    processTick();
    accumulator -= TICK_RATE_MS;
    ticksThisFrame++;
  }

  // Cap accumulator to prevent spiral of death
  if (accumulator > TICK_RATE_MS * MAX_TICKS_PER_FRAME) {
    accumulator = 0;
  }

  frameId = requestAnimationFrame(loop);
}

export function startGameLoop() {
  if (running) return;
  running = true;
  lastTime = performance.now();
  accumulator = 0;
  frameId = requestAnimationFrame(loop);
}

export function stopGameLoop() {
  running = false;
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
}

export function isGameLoopRunning() {
  return running;
}
