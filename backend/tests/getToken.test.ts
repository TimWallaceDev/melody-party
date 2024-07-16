import { getToken } from "../src/functions/getToken";

describe("token function", () => {
    it("returns a token", async () => {

        const token = await getToken()

        expect(token.length > 1).toBe(true)
    })
})