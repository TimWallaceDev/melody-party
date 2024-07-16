import { getPlaylistTracks } from '../src/functions/getPlaylistTracks';
import { PlaylistData } from '../src/interface definitions/interfaceDefinitions';

describe('getPlaylistTracks', () => {
    let result: PlaylistData
    beforeAll(async () => {
        //gets a list of tracks from spotify
        const testPlaylistId: string = "2zMYFKx7jL6T2Jk0gpHkt5"
        result = await getPlaylistTracks(testPlaylistId) as PlaylistData;
    })

    it('returns an array with track objects', () => {
        expect(Array.isArray(result.playlistTracks)).toBe(true);
        expect(typeof result.playlistImg === "string").toBe(true)
        expect(typeof result.playlistName === "string").toBe(true)
    });

    it("Returns an array with Tracks with values", () => {

        expect(result.playlistTracks.length > 0).toBe(true); // Includes correctIndex
    })

    it("Check each value of playlistTracks is type track", () => {
        for (let i = 0; i < result.playlistTracks.length; i++) {

            const shifted = result.playlistTracks[i]
            expect(typeof shifted.track === "object").toBe(true)
            expect(typeof shifted.track.preview_url === "string").toBe(true)
            expect(typeof shifted.track.name === "string").toBe(true)

        }
    })


});
