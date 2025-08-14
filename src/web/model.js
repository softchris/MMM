// src/web/model.js
// Handles data fetching and state management

const BASE_URL = "https://orange-funicular-w5j94w7x7wh6v4-5000.app.github.dev";

let ROOMS = [];
let currentRoom = 0;

async function fetchRooms() {
    try {
        const response = await fetch(`${BASE_URL}/rooms`);
        const data = await response.json();
        return data.rooms;
    } catch (error) {
        console.error("Error fetching rooms data:", error);
    }
}

// TODO, fetchItems

async function talkToCharacter(topic) {
    try {
        const response = await fetch(`${BASE_URL}/talk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: ROOMS[currentRoom]["characterName"], topic })
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error talking to character:", error);
    }
}

async function interrogateCharacter() {
    try {
        const response = await fetch(`${BASE_URL}/interrogate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: ROOMS[currentRoom]["characterName"] })
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error interrogating character:", error);
    }
}

function getRoom() {
    return currentRoom;
}

function setRoom(index) {
    currentRoom = index;
}

export { ROOMS, setRoom, getRoom, fetchRooms, talkToCharacter, interrogateCharacter };
