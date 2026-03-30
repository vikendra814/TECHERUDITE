const generateSlots = (startTime, endTime) => {
  const slots = [];

  const toMins = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const toTime = (mins) => {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  let current = toMins(startTime);
  const end = toMins(endTime);

  while (current + 30 <= end) {
    slots.push({ startTime: toTime(current), endTime: toTime(current + 30) });
    current += 30;
  }

  return slots;
};

module.exports = generateSlots;
