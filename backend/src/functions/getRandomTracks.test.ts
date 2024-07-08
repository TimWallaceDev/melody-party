import { getRandomTracks } from './getRandomTracks'; // Adjust import path

describe('getRandomTracks', () => {
  it('returns an array with 4 index arrays. ', () => {
    const numberOfTracks = 25
    const correctIndex = 0;
    const result = getRandomTracks(numberOfTracks, correctIndex);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(4); // Includes correctIndex
  });

  it('Ensure array is shuffled differently each time', () => {
    //this test will fail on average 1/16 times. 
    const numberOfTracks: number = 4
    const correctIndex = 0;
    const resultOne = getRandomTracks(numberOfTracks, correctIndex);
    const resultTwo = getRandomTracks(numberOfTracks, correctIndex);

    expect(resultOne).not.toEqual(resultTwo)
});

it('handles edge case with empty tracks', () => {
  const numberOfTracks: number = 0
  const correctIndex = 0;
  const result = getRandomTracks(numberOfTracks, correctIndex);
  expect(result).toEqual("not enough tracks");
});

  // Add more tests for randomness, performance, and other edge cases
});

//thanks chat GPT
