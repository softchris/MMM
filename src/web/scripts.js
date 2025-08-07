// Utility to get element by id
function getElementId(id) {
    return document.getElementById(id);
}

// Constants for element IDs
const IDS = {
    CHAT_INPUT: 'chat-input',
    CHAT_BOX: 'chat-box',
    PLAY_BTN: 'play-btn',
    ROOM_DESC: 'room-desc',
    RIGHT_COLUMN: 'right-column',
    START: 'start',
    GAME_AREA: 'game-area'
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
    const chatBox = getElementId(boxId);
    if (chatInput && chatBox) {
        chatInput.addEventListener('keydown', createChatHandler(chatInput, chatBox));
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
            setupCharacterClicks(IDS.CHAT_BOX);
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

// Room data for navigation
const ROOMS = [
    {
        img: '/assets/study.png',
        desc: 'The study is shrouded in shadows. Flickering candlelight reveals a blood-stained letter opener on the desk. The air is thick with secrets and the scent of old books. You feel a chill as if someone—or something—is watching you.'
    },
    {
        img: '/assets/library.png',
        desc: 'The library is lined with ancient tomes. A broken window lets in a cold draft. Something rustles behind the shelves.'
    },
    {
        img: '/assets/hall.png',
        desc: 'The grand hall echoes with distant footsteps. Portraits stare down from the walls, their eyes following your every move.'
    }
];
let currentRoom = 0;

function updateRoom() {
    const roomImg = document.getElementById('room-img');
    const roomDesc = document.getElementById('room-desc');
    if (roomImg && roomDesc) {
        // Fade out
        roomImg.style.transition = 'opacity 0.2s';
        roomImg.style.opacity = '0';
        setTimeout(() => {
            roomImg.src = ROOMS[currentRoom].img;
            roomDesc.textContent = ROOMS[currentRoom].desc;
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
function setupUI() {
    setupChat(IDS.CHAT_INPUT, IDS.CHAT_BOX);
    setupPlayButton(IDS.PLAY_BTN, IDS.RIGHT_COLUMN);
    setupRoomNavigation();
    updateRoom();
}

window.addEventListener('DOMContentLoaded', setupUI);
