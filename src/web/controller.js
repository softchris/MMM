// src/web/controller.js
// Handles event logic and connects model and view

import { ROOMS, setRoom, getRoom, fetchRooms, talkToCharacter, interrogateCharacter } from './model.js';
import { IDS, getElementId, createChatMessage, showModal } from './view.js';

let roomIndex = getRoom();
let detectiveSrc = "/assets/detective.png";

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

function setupChat(inputId, boxId) {
    const chatInput = getElementId(inputId);
    const interrogateBtn = getElementId(IDS.INTERROGATE_BTN);
    const chatArea = getElementId(IDS.MODAL_CHAT);
    const chatBox = getElementId(boxId);
    const talkToBtn = getElementId('talk-btn');
    let room = ROOMS[roomIndex];
    let characterName = room["characterName"];
    // character-img
    let characterImg = document.getElementById('character-img');

    if (chatInput && chatBox) {
        chatInput.addEventListener('keydown', createChatHandler(chatInput, chatBox));
    }

    if(interrogateBtn) {
        interrogateBtn.addEventListener('click', async function() {
            const spinner = getElementId('spinner');
            if (spinner) spinner.style.display = 'block';
            chatArea.innerHTML = chatArea.innerHTML + createChatMessage(`<img src="${detectiveSrc}" class="message-img" /> <br/> Interrogation`);
            const response = await interrogateCharacter();
            if (spinner) spinner.style.display = 'none';
            chatArea.innerHTML = chatArea.innerHTML + createChatMessage(`<img class="message-img" src="${characterImg.src}" /> <br/> ${response}`, "character");
        });
    }

    if(talkToBtn) {
        talkToBtn.addEventListener('click', async function() {
            const spinner = getElementId('spinner');
            if (spinner) spinner.style.display = 'block';
            let chatInput = getElementId('modal-chat-input'); 
            let topic = chatInput.value;
            chatArea.innerHTML = chatArea.innerHTML + createChatMessage(`<img src="${detectiveSrc}" class="message-img" /> <br/> ${topic}`);
            const response = await talkToCharacter(topic);
            if (spinner) spinner.style.display = 'none';
            chatInput.value = '';
    
            chatArea.innerHTML = chatArea.innerHTML + createChatMessage(`<img class="message-img" src="${characterImg.src}" /> <br/> ${response} `, "character");
        });
    }
}

function setupPlayButton(playBtnId) {
    const playBtn = getElementId(playBtnId);
    const playArea = getElementId(IDS.START);
    const gameArea = getElementId(IDS.GAME_AREA);
    
    const room = getElementId(IDS.ROOM);
    const leftArrow = getElementId('left-arrow');
    const rightArrow = getElementId('right-arrow');

    if (playBtn) {
        playBtn.addEventListener('click', function() {
            playArea.style.display = 'none';
            gameArea.style.display = 'flex';
           
            leftArrow.style.display = 'block';
            rightArrow.style.display = 'block';
            room.style.display = 'block';
            setupCharacterClicks(IDS.CHARACTER_IMG);
        });
    }
}

function setupCharacterClicks(chatBoxId) {
    const chatBox = getElementId(chatBoxId);
    if (chatBox) {
        chatBox.onclick = function() {
            showModal(chatBox.textContent);
        };
    }
}

function updateRoom() {
    const roomImg = document.getElementById('room-img');
    const roomDesc = document.getElementById('room-desc');
    const roomTitle = document.getElementById('room-title');
    const modalChat = document.getElementById(IDS.MODAL_CHAT);
    if (roomImg && roomDesc) {
        roomImg.style.transition = 'opacity 0.2s';
        roomImg.style.opacity = '0';
        setTimeout(() => {
            let room = ROOMS[roomIndex];
            roomImg.src = room["img"];
            roomDesc.textContent = room["desc"];
            roomTitle.textContent = room["title"];
            modalChat.textContent = "";
            
            // character-img
            let characterImg = document.getElementById('character-img');
            

            modalChat.innerHTML = createChatMessage(`<img class="message-img" src="${characterImg.src}" /> <br/> Hi, I'm ${room["characterName"]} `, "character");
            roomImg.onload = function() {
                roomImg.style.opacity = '1';
            };
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
            roomIndex = (roomIndex - 1 + ROOMS.length) % ROOMS.length;
            setRoom(roomIndex);
            updateRoom();
        };
    }
    if (rightArrow) {
        rightArrow.onclick = function() {
            roomIndex = (roomIndex + 1) % ROOMS.length;
            setRoom(roomIndex);
            updateRoom();
        };
    }
}

async function setupUI() {
    let rooms = await fetchRooms();
    ROOMS.push(...rooms);
    setupChat(IDS.CHAT_INPUT, IDS.CHAT_BOX);
    setupPlayButton(IDS.PLAY_BTN);
    setupRoomNavigation();
    updateRoom();
}

window.addEventListener('DOMContentLoaded', setupUI);
