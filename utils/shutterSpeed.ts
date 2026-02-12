export type ShutterSpeedOption = {
  seconds: number;
  label: string;
};

const EPSILON = 1e-6;

const FULL_STOP_OPTIONS: ShutterSpeedOption[] = [
  { seconds: 30, label: '30"' },
  { seconds: 15, label: '15"' },
  { seconds: 8, label: '8"' },
  { seconds: 4, label: '4"' },
  { seconds: 2, label: '2"' },
  { seconds: 1, label: '1"' },
  { seconds: 1 / 2, label: '1/2' },
  { seconds: 1 / 4, label: '1/4' },
  { seconds: 1 / 8, label: '1/8' },
  { seconds: 1 / 15, label: '1/15' },
  { seconds: 1 / 30, label: '1/30' },
  { seconds: 1 / 60, label: '1/60' },
  { seconds: 1 / 125, label: '1/125' },
  { seconds: 1 / 250, label: '1/250' },
  { seconds: 1 / 500, label: '1/500' },
  { seconds: 1 / 1000, label: '1/1000' },
  { seconds: 1 / 2000, label: '1/2000' },
  { seconds: 1 / 4000, label: '1/4000' },
  { seconds: 1 / 8000, label: '1/8000' },
  { seconds: 1 / 16000, label: '1/16000' },
  { seconds: 1 / 32000, label: '1/32000' },
  { seconds: 1 / 64000, label: '1/64000' },
  { seconds: 1 / 128000, label: '1/128000' },
  { seconds: 1 / 256000, label: '1/256000' },
];

const THIRD_STOP_OPTIONS: ShutterSpeedOption[] = [
  { seconds: 30, label: '30"' },
  { seconds: 25, label: '25"' },
  { seconds: 20, label: '20"' },
  { seconds: 15, label: '15"' },
  { seconds: 13, label: '13"' },
  { seconds: 10, label: '10"' },
  { seconds: 8, label: '8"' },
  { seconds: 6, label: '6"' },
  { seconds: 5, label: '5"' },
  { seconds: 4, label: '4"' },
  { seconds: 3.2, label: '3.2"' },
  { seconds: 2.5, label: '2.5"' },
  { seconds: 2, label: '2"' },
  { seconds: 1.6, label: '1.6"' },
  { seconds: 1.3, label: '1.3"' },
  { seconds: 1, label: '1"' },
  { seconds: 0.8, label: '0.8"' },
  { seconds: 0.6, label: '0.6"' },
  { seconds: 0.5, label: '1/2' },
  { seconds: 0.4, label: '1/2.5' },
  { seconds: 0.3, label: '1/3' },
  { seconds: 0.25, label: '1/4' },
  { seconds: 0.2, label: '1/5' },
  { seconds: 0.15, label: '1/6' },
  { seconds: 1 / 8, label: '1/8' },
  { seconds: 0.1, label: '1/10' },
  { seconds: 1 / 13, label: '1/13' },
  { seconds: 1 / 15, label: '1/15' },
  { seconds: 1 / 20, label: '1/20' },
  { seconds: 1 / 25, label: '1/25' },
  { seconds: 1 / 30, label: '1/30' },
  { seconds: 1 / 40, label: '1/40' },
  { seconds: 1 / 50, label: '1/50' },
  { seconds: 1 / 60, label: '1/60' },
  { seconds: 1 / 80, label: '1/80' },
  { seconds: 1 / 100, label: '1/100' },
  { seconds: 1 / 125, label: '1/125' },
  { seconds: 1 / 160, label: '1/160' },
  { seconds: 1 / 200, label: '1/200' },
  { seconds: 1 / 250, label: '1/250' },
  { seconds: 1 / 320, label: '1/320' },
  { seconds: 1 / 400, label: '1/400' },
  { seconds: 1 / 500, label: '1/500' },
  { seconds: 1 / 640, label: '1/640' },
  { seconds: 1 / 800, label: '1/800' },
  { seconds: 1 / 1000, label: '1/1000' },
  { seconds: 1 / 1250, label: '1/1250' },
  { seconds: 1 / 1600, label: '1/1600' },
  { seconds: 1 / 2000, label: '1/2000' },
  { seconds: 1 / 2500, label: '1/2500' },
  { seconds: 1 / 3200, label: '1/3200' },
  { seconds: 1 / 4000, label: '1/4000' },
  { seconds: 1 / 5000, label: '1/5000' },
  { seconds: 1 / 6400, label: '1/6400' },
  { seconds: 1 / 8000, label: '1/8000' },
  { seconds: 1 / 10000, label: '1/10000' },
  { seconds: 1 / 12500, label: '1/12500' },
  { seconds: 1 / 16000, label: '1/16000' },
  { seconds: 1 / 20000, label: '1/20000' },
  { seconds: 1 / 25000, label: '1/25000' },
  { seconds: 1 / 32000, label: '1/32000' },
  { seconds: 1 / 40000, label: '1/40000' },
  { seconds: 1 / 50000, label: '1/50000' },
  { seconds: 1 / 64000, label: '1/64000' },
  { seconds: 1 / 80000, label: '1/80000' },
  { seconds: 1 / 100000, label: '1/100000' },
  { seconds: 1 / 128000, label: '1/128000' },
  { seconds: 1 / 160000, label: '1/160000' },
  { seconds: 1 / 200000, label: '1/200000' },
  { seconds: 1 / 256000, label: '1/256000' },
];

const normalizeLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/s/g, '')
    .replace(/"/g, '');

const getOptionSet = (includeThirdStops: boolean) =>
  includeThirdStops ? THIRD_STOP_OPTIONS : FULL_STOP_OPTIONS;

const getClosestOption = (
  seconds: number,
  options: ShutterSpeedOption[]
) => {
  if (!options.length) {
    return null;
  }

  let closest = options[0];
  let bestDistance = Math.abs(options[0].seconds - seconds);

  for (const option of options) {
    const distance = Math.abs(option.seconds - seconds);
    if (distance < bestDistance) {
      bestDistance = distance;
      closest = option;
    }
  }

  return closest;
};

export const buildShutterSpeedTable = (
  minSeconds: number,
  maxSeconds: number,
  includeThirdStops: boolean
) => {
  const safeMin = Math.max(minSeconds, EPSILON);
  const safeMax = Math.max(maxSeconds, safeMin);

  return getOptionSet(includeThirdStops)
    .filter((option) => option.seconds <= safeMax + EPSILON)
    .filter((option) => option.seconds >= safeMin - EPSILON)
    .map((option) => option.seconds);
};

export const formatShutterSpeed = (
  seconds: number,
  includeThirdStops = false
) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '-';
  }

  const options = getOptionSet(includeThirdStops);
  const closest = getClosestOption(seconds, options);
  return closest ? closest.label : '-';
};

export const parseShutterSpeed = (raw: string) => {
  const value = raw.trim().toLowerCase();

  if (!value) {
    return null;
  }

  const normalized = normalizeLabel(value);
  const match = THIRD_STOP_OPTIONS.find(
    (option) => normalizeLabel(option.label) === normalized
  );

  if (match) {
    return match.seconds;
  }

  if (normalized.includes('/')) {
    const [numeratorText, denominatorText] = normalized.split('/');
    const numerator = Number(numeratorText);
    const denominator = Number(denominatorText);

    if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0) {
      return numerator / denominator;
    }

    return null;
  }

  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return numeric;
};

export const snapToShutterSpeed = (seconds: number, options: number[]) => {
  if (!options.length) {
    return seconds;
  }

  let closest = options[0];
  let bestDistance = Math.abs(options[0] - seconds);

  for (const value of options) {
    const distance = Math.abs(value - seconds);
    if (distance < bestDistance) {
      bestDistance = distance;
      closest = value;
    }
  }

  return closest;
};

export const findClosestOptionIndex = (
  options: ShutterSpeedOption[],
  seconds: number
) => {
  if (!options.length) {
    return 0;
  }

  let index = 0;
  let bestDistance = Math.abs(options[0].seconds - seconds);

  options.forEach((option, currentIndex) => {
    const distance = Math.abs(option.seconds - seconds);
    if (distance < bestDistance) {
      bestDistance = distance;
      index = currentIndex;
    }
  });

  return index;
};

export const buildShutterSpeedOptions = (
  minSeconds: number,
  maxSeconds: number,
  includeThirdStops: boolean
): ShutterSpeedOption[] => {
  const safeMin = Math.max(minSeconds, EPSILON);
  const safeMax = Math.max(maxSeconds, safeMin);

  return getOptionSet(includeThirdStops).filter(
    (option) => option.seconds <= safeMax + EPSILON && option.seconds >= safeMin - EPSILON
  );
};

export const isFullStopSeconds = (seconds: number) =>
  FULL_STOP_OPTIONS.some((option) => Math.abs(option.seconds - seconds) < EPSILON);

export const getAllShutterSpeedOptions = (includeThirdStops: boolean): ShutterSpeedOption[] => {
  return getOptionSet(includeThirdStops);
};
