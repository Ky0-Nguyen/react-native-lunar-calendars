// Several tests assert on "today", so pin the clock while leaving timers real
// (React Native Testing Library drives its own scheduling).
jest.useFakeTimers({
  doNotFake: [
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
    'setImmediate',
    'clearImmediate',
    'nextTick',
    'queueMicrotask',
    'performance',
    'requestAnimationFrame',
    'cancelAnimationFrame',
    'requestIdleCallback',
    'cancelIdleCallback',
    'hrtime'
  ]
});
// 2026-08-25 is 13/7/2026 on the Vietnamese lunar calendar.
jest.setSystemTime(new Date('2026-08-25T03:00:00.000Z'));
