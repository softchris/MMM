// src/web/controller.js
// Handles event logic and connects model and view


import { ROOMS, fetchItem, setRoom, getRoom, fetchRooms, talkToCharacter, interrogateCharacter } from './model.js';
import { IDS, getElementId, createChatMessage, showModal, showItemModal } from './view.js';

let roomIndex = getRoom();
const detectiveSrc = "/assets/detective.png";

// --- DOM Elements ---
const elements = {
    chatInput: null,
    interrogateBtn: null,
    chatArea: null,
    chatBox: null,
    talkToBtn: null,
    characterImg: null,
    spinner: null,
    playBtn: null,
    playArea: null,
    gameArea: null,
    room: null,
    leftArrow: null,
    rightArrow: null,
    roomImg: null,
    roomDesc: null,
    roomTitle: null,
    modalChat: null,
    itemModal: null,
    itemUrl: null,
    itemImg: null
};

function cacheElements() {
    elements.chatInput = getElementId(IDS.CHAT_INPUT);
    elements.interrogateBtn = getElementId(IDS.INTERROGATE_BTN);
    elements.chatArea = getElementId(IDS.MODAL_CHAT);
    elements.chatBox = getElementId(IDS.CHAT_BOX);
    elements.talkToBtn = getElementId('talk-btn');
    elements.characterImg = document.getElementById('character-img');
    elements.spinner = getElementId('spinner');
    elements.playBtn = getElementId(IDS.PLAY_BTN);
    elements.playArea = getElementId(IDS.START);
    elements.gameArea = getElementId(IDS.GAME_AREA);
    elements.room = getElementId(IDS.ROOM);
    elements.leftArrow = getElementId('left-arrow');
    elements.rightArrow = getElementId('right-arrow');
    elements.roomImg = document.getElementById('room-img');
    elements.roomDesc = document.getElementById('room-desc');
    elements.roomTitle = document.getElementById('room-title');
    elements.modalChat = getElementId(IDS.MODAL_CHAT);
    elements.itemModal = getElementId('item-modal');
    elements.itemUrl = document.getElementById('item-url');
    elements.itemImg = document.getElementById('item-img');
}

function createChatHandler() {
    return function(e) {
        if (e.key === 'Enter' && elements.chatInput.value.trim()) {
            const msg = document.createElement('div');
            msg.innerHTML = `<strong>You:</strong> ${elements.chatInput.value}`;
            elements.chatBox.appendChild(msg);
            elements.chatBox.scrollTop = elements.chatBox.scrollHeight;
            elements.chatInput.value = '';
        }
    };
}

function setupChat() {
    if (elements.chatInput && elements.chatBox) {
        elements.chatInput.addEventListener('keydown', createChatHandler());
    }

    if (elements.interrogateBtn) {
        elements.interrogateBtn.addEventListener('click', async function() {
            if (elements.spinner) elements.spinner.style.display = 'block';
            elements.chatArea.innerHTML += createChatMessage(`<img src="${detectiveSrc}" class="message-img" /> <br/> Interrogation`);
            const response = await interrogateCharacter();
            if (elements.spinner) elements.spinner.style.display = 'none';
            elements.chatArea.innerHTML += createChatMessage(`<img class="message-img" src="${elements.characterImg.src}" /> <br/> ${response}`, "character");
        });
    }

    if (elements.talkToBtn) {
        elements.talkToBtn.addEventListener('click', async function() {
            if (elements.spinner) elements.spinner.style.display = 'block';
            let topic = elements.chatInput.value;
            elements.chatArea.innerHTML += createChatMessage(`<img src="${detectiveSrc}" class="message-img" /> <br/> ${topic}`);
            const response = await talkToCharacter(topic);
            if (elements.spinner) elements.spinner.style.display = 'none';
            elements.chatInput.value = '';
            elements.chatArea.innerHTML += createChatMessage(`<img class="message-img" src="${elements.characterImg.src}" /> <br/> ${response} `, "character");
        });
    }
}

function setupPlayButton() {
    if (elements.playBtn) {
        elements.playBtn.addEventListener('click', function() {
            elements.playArea.style.display = 'none';
            elements.gameArea.style.display = 'flex';
            elements.leftArrow.style.display = 'block';
            elements.rightArrow.style.display = 'block';
            elements.room.style.display = 'block';
            setupCharacterClicks();
        });
    }
}

function setupCharacterClicks() {
    if (elements.characterImg) {
        elements.characterImg.onclick = function() {
            showModal(elements.characterImg.textContent);
        };
    }
}

function setupItemClick() {
    if (elements.itemImg) {
        elements.itemImg.onclick = async function() {
            let room = ROOMS[roomIndex];
            showItemModal(room.itemName, room.itemDescription, room.itemUrl);
        };
    }
}

function updateRoom() {
    if (elements.roomImg && elements.roomDesc) {
        elements.roomImg.style.transition = 'opacity 0.7s';
        elements.roomImg.style.opacity = '0';
        setTimeout(() => {
            let room = ROOMS[roomIndex];
            elements.roomImg.src = room.url;
            elements.roomDesc.textContent = room.description;
            elements.roomTitle.textContent = room.name;
            elements.modalChat.textContent = "";
            elements.characterImg = document.getElementById('character-img');
            elements.modalChat.innerHTML = createChatMessage(
                `<img class="message-img" src="${elements.characterImg.src}" /> <br/> Hi, I'm ${room.characterName} `,
                "character"
            );
            elements.itemImg.src = room.itemUrl;
            elements.itemImg.alt = room.itemName;

            elements.roomImg.onload = function() {
                elements.roomImg.style.opacity = '1';
            };
            if (elements.roomImg.complete) {
                elements.roomImg.style.opacity = '1';
            }
        }, 50);
    }
}

function setupRoomNavigation() {
    if (elements.leftArrow) {
        elements.leftArrow.onclick = function() {
            roomIndex = (roomIndex - 1 + ROOMS.length) % ROOMS.length;
            setRoom(roomIndex);
            updateRoom();
        };
    }
    if (elements.rightArrow) {
        elements.rightArrow.onclick = function() {
            roomIndex = (roomIndex + 1) % ROOMS.length;
            setRoom(roomIndex);
            updateRoom();
        };
    }
}

async function setupRooms(){
    let rooms = await fetchRooms();
    ROOMS.push(...rooms);
    for (let room of ROOMS) {
        let item = await fetchItem(room.itemName);
        room.itemUrl = item.url;
        room.itemDescription = item.description;
    }
}

async function setupUI() {
    cacheElements();
    await setupRooms();
    setupItemClick();
    setupChat();
    setupPlayButton();
    setupRoomNavigation();
    updateRoom();
}

window.addEventListener('DOMContentLoaded', setupUI);
