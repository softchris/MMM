// Utility to get element by id
function getElementId(id) {
    return document.getElementById(id);
}

BASE_URL = "https://orange-funicular-w5j94w7x7wh6v4-5000.app.github.dev"

let ROOMS = [];

async function talkToCharacter(topic){
    try {
        const response = await fetch(`${BASE_URL}/talk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: ROOMS[currentRoom]["characterName"], topic: topic })
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error talking to character:", error);
    }
}

async function interrogateCharacter() {
    try {
        const response = await fetch(`${BASE_URL}/interrogate`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: ROOMS[currentRoom]["characterName"] })
        });
        const data = await response.json();
        
        return data.response;
    } catch (error) {
        console.error("Error interrogating character:", error);
    }
}

async function fetch_rooms() {
    try {
        const response = await fetch(`${BASE_URL}/rooms`);
        const data = await response.json();
        return data.rooms;
        // You can use the data here to update the UI or perform other actions
    } catch (error) {
        console.error("Error fetching rooms data:", error);
    }
}

// Utility to get element by class name
function getElementClass(className) {
    return document.getElementsByClassName(className)[0];
}

// Constants for element IDs
const IDS = {
    CHAT_INPUT: 'chat-input',
    CHAT_BOX: 'chat-box',
    PLAY_BTN: 'play-btn',
    ROOM_DESC: 'room-desc',
    RIGHT_COLUMN: 'right-column',
    START: 'start',
    GAME_AREA: 'game-area',
    CHARACTER_IMG: 'character-img',
    MODAL_CHAT: 'modal-chat',
    INTERROGATE_BTN: 'interrogate-btn'
};

/**
 * Creates a chat event handler for a given input and box.
 * @param {HTMLElement} chatInput 
 * @param {HTMLElement} chatBox 
 */
function createChatHandler(chatInput, chatBox) {
    return function(e) {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            const msg = document.createElement('div');
            msg.innerHTML = `<strong>You:</strong> ${chatInput.value}`;
            chatBox.appendChild(msg);
            chatBox.scrollTop = chatBox.scrollHeight;
            chatInput.value = '';
        }
    };
}

/**
 * Sets up a chat input and box with event handler.
 */
function setupChat(inputId, boxId) {
    const chatInput = getElementId(inputId);
    const interrogateBtn = getElementId(IDS.INTERROGATE_BTN);
    const chatArea = getElementId(IDS.MODAL_CHAT);
    const chatBox = getElementId(boxId);
    const talkToBtn = getElementId('talk-btn');

    if (chatInput && chatBox) {
        chatInput.addEventListener('keydown', createChatHandler(chatInput, chatBox));
    }

    if(interrogateBtn) {
        interrogateBtn.addEventListener('click', async function() {
            const spinner = getElementId('spinner');
            if (spinner) spinner.style.display = 'block';
            const response = await interrogateCharacter();
            if (spinner) spinner.style.display = 'none';
            chatArea.innerHTML = chatArea.innerHTML + createChatMessage(`Interrogation: `+ response);
            // send interrogate to API, render response in chat area
        });
    }

    if(talkToBtn) {
        talkToBtn.addEventListener('click', async function() {
            const spinner = getElementId('spinner');
            if (spinner) spinner.style.display = 'block';
            // todo, get input
            let topic = "1920s France"
            const response = await talkToCharacter(topic);
            if (spinner) spinner.style.display = 'none';
            chatArea.innerHTML = chatArea.innerHTML + createChatMessage(`Detective> ${topic}`);
            chatArea.innerHTML = chatArea.innerHTML + createChatMessage(`Response> ${response}`);
            // send talkTo to API, render response in chat area
        });
    }
}

/**
 * Sets up the play button to show/hide areas.
 */
function setupPlayButton(playBtnId, rightColumnId) {
    const playBtn = getElementId(playBtnId);
    const playArea = getElementId(IDS.START);
    const gameArea = getElementId(IDS.GAME_AREA);


    if (playBtn) {
        playBtn.addEventListener('click', function() {
            playArea.style.display = 'none';
            gameArea.style.display = 'block';
            // it doesn't show until after we clicked play
            setupCharacterClicks(IDS.CHARACTER_IMG);
        });
    }
}

/**
 * Shows a modal with character info.
 */
function showModal(characterName) {
    const modal = document.getElementById('character-modal');
    if (modal) {
        modal.querySelector('.modal-content').innerHTML = `<div style="font-size:2em;margin-bottom:16px;">${characterName}</div>`;
        modal.style.display = 'block';
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
        }
    }
}

/**
 * Adds click listeners to character names in chat.
 */
function setupCharacterClicks(chatBoxId) {
    
    const chatBox = getElementId(chatBoxId);
    if (chatBox) {
        chatBox.onclick = function() {
            console.log(' clicking to open chat');
            showModal(chatBox.textContent);
        };
    
    }
}

let currentRoom = 0;

function createChatMessage(message) {
    return `<div class="chat-message">${message}</div>`;
}

function updateRoom() {
    const roomImg = document.getElementById('room-img');
    const roomDesc = document.getElementById('room-desc');
    const roomTitle = document.getElementById('room-title');
    const modalChat = document.getElementById(IDS.MODAL_CHAT);
    if (roomImg && roomDesc) {
        // Fade out
        roomImg.style.transition = 'opacity 0.2s';
        roomImg.style.opacity = '0';
        setTimeout(() => {

            let room = ROOMS[currentRoom];
            roomImg.src = ROOMS[currentRoom]["img"];
            roomDesc.textContent = ROOMS[currentRoom]["desc"];
            roomTitle.textContent = ROOMS[currentRoom]["title"];
            modalChat.textContent = "";
            modalChat.innerHTML = createChatMessage(`Hi, I'm ${ROOMS[currentRoom]["characterName"]}`);

            // Fade in after image loads
            roomImg.onload = function() {
                roomImg.style.opacity = '1';
            };
            // If image is cached, trigger fade-in immediately
            if (roomImg.complete) {
                roomImg.style.opacity = '1';
            }
        }, 50);
    }
}

function setupRoomNavigation() {
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');
    if (leftArrow) {
        leftArrow.onclick = function() {
            currentRoom = (currentRoom - 1 + ROOMS.length) % ROOMS.length;
            updateRoom();
        };
    }
    if (rightArrow) {
        rightArrow.onclick = function() {
            currentRoom = (currentRoom + 1) % ROOMS.length;
            updateRoom();
        };
    }
}

/**
 * Main setup function for all UI logic.
 */
async function setupUI() {
    ROOMS = await fetch_rooms();
    setupChat(IDS.CHAT_INPUT, IDS.CHAT_BOX);
    setupPlayButton(IDS.PLAY_BTN, IDS.RIGHT_COLUMN);
    setupRoomNavigation();
    updateRoom();
}

window.addEventListener('DOMContentLoaded', setupUI);
