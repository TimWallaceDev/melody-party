import { getPlaylistTracks } from './getPlaylistTracks';

describe('getPlaylistTracks', () => {
    //gets a list of tracks from spotify
    it('returns an array with track objects', async () => {

        const testPlaylistId: string = "2zMYFKx7jL6T2Jk0gpHkt5"
        
        const result = await getPlaylistTracks(testPlaylistId);
        expect(Array.isArray(result)).toBe(true);
        expect(Object.keys(result).length > 0).toBe(true); // Includes correctIndex
    });

    // Add more tests for randomness, performance, and other edge cases
});

//thanks chat GPT
