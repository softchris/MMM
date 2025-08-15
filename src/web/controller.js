// src/web/controller.js
// Handles event logic and connects model and view


import { ROOMS, fetchItem, setRoom, getRoom, fetchRooms, talkToCharacter, interrogateCharacter, fetchCharacter } from './model.js';
import {
    IDS,
    getElementId,
    createChatMessage,
    showModal,
    showItemModal,
    elements,
    cacheElements,
    setElementText,
    setElementHTML,
    setElementSrc,
    setElementAlt,
    setElementDisplay,
    setElementTransition,
    setElementOpacity,
    addEventListener,
    setOnClick,
    appendChild,
    scrollToBottom,
    clearInput,
    createDivWithHTML
} from './view.js';

let roomIndex = getRoom();
const detectiveSrc = "/assets/detective.png";

// --- DOM Elements ---

function createChatHandler() {
    return function(e) {
        if (e.key === 'Enter' && elements.chatInput.value.trim()) {
            const msg = createDivWithHTML(`<strong>You:</strong> ${elements.chatInput.value}`);
            appendChild(elements.chatBox, msg);
            scrollToBottom(elements.chatBox);
            clearInput(elements.chatInput);
        }
    };
}

function setupChat() {
    if (elements.chatInput && elements.chatBox) {
        addEventListener(elements.chatInput, 'keydown', createChatHandler());
    }

    if (elements.interrogateBtn) {
        addEventListener(elements.interrogateBtn, 'click', async function() {
            setElementDisplay(elements.spinner, 'block');
            setElementHTML(elements.chatArea, elements.chatArea.innerHTML + createChatMessage(`<img src="${detectiveSrc}" class="message-img" /> <br/> Interrogation`));
            const response = await interrogateCharacter();
            setElementDisplay(elements.spinner, 'none');
            setElementHTML(elements.chatArea, elements.chatArea.innerHTML + createChatMessage(`<img class="message-img" src="${elements.characterImg.src}" /> <br/> ${response}`, "character"));
        });
    }

    if (elements.talkToBtn) {
        addEventListener(elements.talkToBtn, 'click', async function() {
            setElementDisplay(elements.spinner, 'block');
            let topic = elements.chatInput.value;
            setElementHTML(elements.chatArea, elements.chatArea.innerHTML + createChatMessage(`<img src="${detectiveSrc}" class="message-img" /> <br/> ${topic}`));
            const response = await talkToCharacter(topic);
            setElementDisplay(elements.spinner, 'none');
            clearInput(elements.chatInput);
            setElementHTML(elements.chatArea, elements.chatArea.innerHTML + createChatMessage(`<img class="message-img" src="${elements.characterImg.src}" /> <br/> ${response} `, "character"));
        });
    }
}

function setupPlayButton() {
    if (elements.playBtn) {
        addEventListener(elements.playBtn, 'click', function() {
            setElementDisplay(elements.playArea, 'none');
            setElementDisplay(elements.gameArea, 'flex');
            setElementDisplay(elements.leftArrow, 'block');
            setElementDisplay(elements.rightArrow, 'block');
            setElementDisplay(elements.room, 'block');
            setupCharacterClicks();
        });
    }
}

function setupCharacterClicks() {
    if (elements.characterImg) {
        setOnClick(elements.characterImg, function() {
            showModal(elements.characterImg.textContent);
        });
    }
}

function setupItemClick() {
    if (elements.itemImg) {
        setOnClick(elements.itemImg, async function() {
            let room = ROOMS[roomIndex];
            showItemModal(room.itemName, room.itemDescription, room.itemUrl);
        });
    }
}

function updateRoom() {
    if (elements.roomImg && elements.roomDesc) {
        setElementTransition(elements.roomImg, 'opacity 0.7s');
        setElementOpacity(elements.roomImg, '0');
        setTimeout(() => {
            let room = ROOMS[roomIndex];
            setElementSrc(elements.roomImg, room.url);
            setElementText(elements.roomDesc, room.description);
            setElementText(elements.roomTitle, room.name);
            setElementText(elements.modalChat, "");
            setElementSrc(elements.characterImg, room.characterImg);
           
            // elements.characterImg = document.getElementById('character-img');
            setElementHTML(elements.modalChat, createChatMessage(
                `<img class="message-img" src="${elements.characterImg.src}" /> <br/> Hi, I'm ${room.characterName} `,
                "character"
            ));
            setElementSrc(elements.itemImg, room.itemUrl);
            setElementAlt(elements.itemImg, room.itemName);

            elements.roomImg.onload = function() {
                setElementOpacity(elements.roomImg, '1');
            };
            if (elements.roomImg.complete) {
                setElementOpacity(elements.roomImg, '1');
            }
        }, 50);
    }
}

function setupRoomNavigation() {
    if (elements.leftArrow) {
        setOnClick(elements.leftArrow, function() {
            roomIndex = (roomIndex - 1 + ROOMS.length) % ROOMS.length;
            setRoom(roomIndex);
            updateRoom();
        });
    }
    if (elements.rightArrow) {
        setOnClick(elements.rightArrow, function() {
            roomIndex = (roomIndex + 1) % ROOMS.length;
            setRoom(roomIndex);
            updateRoom();
        });
    }
}

async function setupRooms(){
    let rooms = await fetchRooms();
    ROOMS.push(...rooms);
    for (let room of ROOMS) {
        let item = await fetchItem(room.itemName);
        let character = await fetchCharacter(room.characterName);
        room.itemUrl = item.url;
        room.itemDescription = item.description;
        room.characterImg = character.url;
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
