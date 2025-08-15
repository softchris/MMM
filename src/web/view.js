// src/web/view.js
// Handles DOM manipulation and UI rendering

const IDS = {
    CHAT_INPUT: 'modal-chat-input',
    CHAT_BOX: 'chat-box',
    PLAY_BTN: 'play-btn',
    ROOM_DESC: 'room-desc',
    RIGHT_COLUMN: 'right-column',
    START: 'start',
    GAME_AREA: 'game-area',
    CHARACTER_IMG: 'character-img',
    MODAL_CHAT: 'modal-chat',
    INTERROGATE_BTN: 'interrogate-btn',
    CHAT_AREA: 'chat-area',
    ROOM: 'room'
};

function getElementId(id) {
    return document.getElementById(id);
}

function getElementClass(className) {
    return document.getElementsByClassName(className)[0];
}

function createChatMessage(message, className) {
    return `<div class="chat-message ${className}">${message}</div>`;
}

function showItemModal(title, description, url) {
    const itemModal = document.getElementById('item-modal');
    if (itemModal) {
        itemModal.style.display = 'block';
        itemModal.querySelector('#item-title').innerText = title;
        itemModal.querySelector('.item-content').innerText = description;
        itemModal.querySelector('#item-url').src = url;

        const closeBtn = itemModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = function() {
                itemModal.style.display = 'none';
            };
        }
    }
}

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

export { IDS, showItemModal, getElementId, getElementClass, createChatMessage, showModal };
