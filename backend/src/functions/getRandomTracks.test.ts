import { getRandomTracks } from './getRandomTracks'; // Adjust import path

describe('getRandomTracks', () => {
  it('returns an array with correct length', () => {
    const tracks = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const correctIndex = 0;
    const result = getRandomTracks(tracks, correctIndex);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(tracks.length); // Includes correctIndex
  });

  it('returns shuffled array excluding correctIndex', () => {
    const tracks = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    const correctIndex = 0;
    const result = getRandomTracks(tracks, correctIndex);
    const expectedIndices = [0, 1, 2, 3]; // Assuming tracks length is 4
    expectedIndices.splice(correctIndex, 1); // Remove correctIndex
    expect(result).toEqual(expect.arrayContaining(expectedIndices));
  });

  // Add more tests for randomness, performance, and other edge cases
});

//thanks chat GPT
