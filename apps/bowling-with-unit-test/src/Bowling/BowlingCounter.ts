export type Roll = number;

export const calculateScore = (rolls: Roll[]) => {
  const frames: Roll[][] = [];
  let frameIndex = 0;

  const isStrike = (roll: Roll) => roll === 10;
  const isSpare = (frame: Roll[]) => frame[0] + frame[1] === 10;

  for (let i = 0; i < rolls.length; i += 2) {
    const frame: Roll[] = [rolls[i], rolls[i + 1]];
    frames.push(frame);
  }

  let totalScore = 0;
  for (let i = 0; i < 10; i++) {
    const [firstRoll, secondRoll] = frames[frameIndex];

    if (isStrike(firstRoll)) {
      totalScore +=
        10 +
        (frames[frameIndex + 1]?.[0] || 0) +
        (frames[frameIndex + 1]?.[1] || frames[frameIndex + 2]?.[0] || 0);
      frameIndex++;
    } else if (isSpare(frames[frameIndex])) {
      totalScore += 10 + (frames[frameIndex + 1]?.[0] || 0);
      frameIndex++;
    } else {
      totalScore += firstRoll + secondRoll;
      frameIndex++;
    }
  }

  return totalScore;
};
