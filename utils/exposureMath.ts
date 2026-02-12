import { ShutterSpeedOption, findClosestOptionIndex } from './shutterSpeed';

export type BracketAnchor = 'brightest' | 'middle' | 'darkest';

export type BracketResult = {
  sequence: number[];
  minClamped: boolean;
  maxClamped: boolean;
};

const clampIndex = (index: number, maxIndex: number) =>
  Math.min(maxIndex, Math.max(0, index));

const getStepSize = (spacingEv: number, includeThirdStops: boolean) =>
  Math.max(1, spacingEv * (includeThirdStops ? 3 : 1));

export const getBracketSequenceFromAnchor = (
  anchorSeconds: number,
  anchor: BracketAnchor,
  bracketCount: number,
  spacingEv: number,
  options: ShutterSpeedOption[],
  includeThirdStops: boolean
): BracketResult => {
  if (!options.length) {
    return { sequence: [], minClamped: false, maxClamped: false };
  }

  const half = Math.floor(bracketCount / 2);
  const step = getStepSize(spacingEv, includeThirdStops);
  const maxIndex = Math.max(0, options.length - 1);
  const anchorIndex = findClosestOptionIndex(options, anchorSeconds);
  const anchorOffset = anchor === 'brightest' ? 0 : anchor === 'darkest' ? bracketCount - 1 : half;

  let minClamped = false;
  let maxClamped = false;
  const sequence: number[] = [];

  for (let index = 0; index < bracketCount; index += 1) {
    const rawIndex = anchorIndex + (index - anchorOffset) * step;
    const clampedIndex = clampIndex(rawIndex, maxIndex);

    if (rawIndex < 0) {
      maxClamped = true;
    }

    if (rawIndex > maxIndex) {
      minClamped = true;
    }

    const option = options[clampedIndex];
    if (option) {
      sequence.push(option.seconds);
    }
  }

  return { sequence, minClamped, maxClamped };
};
