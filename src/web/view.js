// Utility to cache and expose UI elements
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

function setElementText(element, text) {
    if (element) element.textContent = text;
}

function setElementHTML(element, html) {
    if (element) element.innerHTML = html;
}

function setElementSrc(element, src) {
    if (element) element.src = src;
}

function setElementAlt(element, alt) {
    if (element) element.alt = alt;
}

function setElementDisplay(element, display) {
    if (element) element.style.display = display;
}

function setElementTransition(element, transition) {
    if (element) element.style.transition = transition;
}

function setElementOpacity(element, opacity) {
    if (element) element.style.opacity = opacity;
}

function addEventListener(element, event, handler) {
    if (element) element.addEventListener(event, handler);
}

function setOnClick(element, handler) {
    if (element) element.onclick = handler;
}

function appendChild(parent, child) {
    if (parent && child) parent.appendChild(child);
}

function scrollToBottom(element) {
    if (element) element.scrollTop = element.scrollHeight;
}

function clearInput(element) {
    if (element) element.value = '';
}

function createDivWithHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
}


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


export {
    IDS,
    showItemModal,
    getElementId,
    getElementClass,
    createChatMessage,
    showModal,
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
};

