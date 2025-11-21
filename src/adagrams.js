const DISTRIBUTION_OF_LETTERS = {
  A: 9, B: 2, C: 2, D: 4, E: 12, F: 2, G: 3, H: 2, I: 9, J: 1, K: 1, L: 4, M: 2,
  N: 6, O: 8, P: 2, Q: 1, R: 6, S: 4, T: 6, U: 4, V: 2, W: 2, X: 1, Y: 2, Z: 1,
};
const SCORE_POINTS = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5,
  L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10 };
const HAND_SIZE = 10;
const LONG_WORD_MIN_LENGTH = 7;
const LONG_WORD_BONUS_POINTS = 8;
const TIEBREAKER_SPECIAL_LENGTH = 10;

export const drawLetters = () => {
  const pool = makeLetterBag(DISTRIBUTION_OF_LETTERS);
  const hand = [];
  for (let i = 0; i < HAND_SIZE; i++) {
    hand.push(drawOneRandomLetter(pool));
  };
  return hand;
};

const makeLetterBag = (distribution) => {
  const bag = [];
  for (const [letter, count] of Object.entries(distribution)) {
    for (let i = 0; i < count; i++) {
      bag.push(letter);
    };
  };
  return bag;
};

const drawOneRandomLetter = (pool) => {
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool.splice(randomIndex, 1)[0];
};

export const usesAvailableLetters = (input, lettersInHand) => {
  const letterCount = countLetters(lettersInHand);
  for (const letter of toUpper(input)) {
    if (!letterCount[letter]) {
      return false;
    };
    letterCount[letter] -= 1;
  };
  return true;
};

const countLetters = (letters) => {
  const counts = {};
  for (const letter of letters) {
    const l = letter.toUpperCase();
    if (!counts[l]) {
      counts[l] = 1;
    } else {
      counts[l] += 1;
    };
  };
  return counts;
};

export const scoreWord = (word) => {
  let score = 0;
  for (const letter of toUpper(word)) {
    score += SCORE_POINTS[letter];
  }
  if (word.length >= LONG_WORD_MIN_LENGTH && word.length <= TIEBREAKER_SPECIAL_LENGTH) {
    score += LONG_WORD_BONUS_POINTS;
  }
  return score;
};

const toUpper = (s) => s.toUpperCase();

export const highestScoreFrom = (words) => {
  let bestCandidate = { word: '', score: 0 };
  for (const candidate of words) {
    const candidateScore = scoreWord(candidate);
    if (candidateBeatsBest(candidate, candidateScore, bestCandidate)) {
      bestCandidate = { word: candidate, score: candidateScore };
    }
  }
  return bestCandidate;
};

const candidateBeatsBest = (candidate, candidateScore, bestCandidate) => {
  // Rule 1: Higher score wins
  if (candidateScore > bestCandidate.score) return true;
  if (candidateScore < bestCandidate.score) return false;

  // Rule 2: If scores tie, a 10-letter word wins
  if (candidate.length === TIEBREAKER_SPECIAL_LENGTH &&
      bestCandidate.word.length !== TIEBREAKER_SPECIAL_LENGTH) {
    return true;
  }

  // Rule 3: Otherwise, shorter word wins (only if best isn't 10 letters)
  if (bestCandidate.word.length !== TIEBREAKER_SPECIAL_LENGTH &&
      candidate.length < bestCandidate.word.length) {
    return true;
  }

  return false;
};