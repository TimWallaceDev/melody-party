import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Home } from "./Home";

test("Home page", () => {
    render(<Home/>)

    //check for create room button
    const createRoomButton = screen.getByText("Create Room")
    expect(createRoomButton).toBeTruthy
    
    //check for join room button
    const joinRoomButton = screen.getByText("Join Room")
    expect(joinRoomButton).toBeTruthy
})