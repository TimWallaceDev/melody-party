import { getPlaylistTracks } from './getPlaylistTracks'; // Adjust import path

describe('getRandomTracks', () => {
    //gets a list of tracks from spotify
    it('returns an array with track objects', () => {
        
        const result = getPlaylistTracks(tracks);
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

    it('handles edge case with empty tracks', () => {
        const tracks: any[] | [] = [];
        const correctIndex = 0;
        const result = getRandomTracks(tracks, correctIndex);
        expect(result).toEqual("not enough tracks");
    });

    // Add more tests for randomness, performance, and other edge cases
});

//thanks chat GPT
