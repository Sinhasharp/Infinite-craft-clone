const elementList = document.getElementById('element-list');
const craftingArea = document.getElementById('crafting-area');
let discoveredElements = new Set();
let draggedElement = null;

// Event Listeners (No Changes)
elementList.addEventListener('dragstart', function(event) { if (event.target.classList.contains('element-item')) { draggedElement = event.target; event.target.classList.add('dragging'); } });
elementList.addEventListener('dragend', function(event) { if (event.target.classList.contains('element-item')) { draggedElement = null; event.target.classList.remove('dragging'); } });
craftingArea.addEventListener('dragover', function(event) { event.preventDefault(); });
craftingArea.addEventListener('dragstart', function(event) { if (event.target.classList.contains('element-item')) { draggedElement = event.target; event.target.classList.add('dragging'); } });
craftingArea.addEventListener('dragend', function(event) { if (event.target.classList.contains('element-item')) { draggedElement = null; event.target.classList.remove('dragging'); } });
craftingArea.addEventListener('drop', async function(event) { event.preventDefault(); if (!draggedElement) return; const elementBeingDragged = draggedElement; const targetElement = getCollisionTarget(event, elementBeingDragged); if (targetElement) { const element1 = elementBeingDragged.querySelector('.element-name').innerText; const element2 = targetElement.querySelector('.element-name').innerText; const result = await combineElements(element1, element2); if (result) { targetElement.remove(); if (elementBeingDragged.parentElement.id !== 'element-list') { elementBeingDragged.remove(); } const newElement = createCraftedElement(result.result, result.emoji, event.clientX, event.clientY); craftingArea.appendChild(newElement); if (!discoveredElements.has(result.result)) { displayElement(result.result, result.emoji); discoveredElements.add(result.result); } } } else { const isFromSidebar = elementBeingDragged.parentElement.id === 'element-list'; if (isFromSidebar) { const newElement = elementBeingDragged.cloneNode(true); newElement.style.position = 'absolute'; craftingArea.appendChild(newElement); newElement.style.left = `${event.clientX - craftingArea.offsetLeft - (newElement.offsetWidth / 2)}px`; newElement.style.top = `${event.clientY - craftingArea.offsetTop - (newElement.offsetHeight / 2)}px`; } else { elementBeingDragged.style.left = `${event.clientX - craftingArea.offsetLeft - (elementBeingDragged.offsetWidth / 2)}px`; elementBeingDragged.style.top = `${event.clientY - craftingArea.offsetTop - (elementBeingDragged.offsetHeight / 2)}px`; } } saveWorkspace(); });
craftingArea.addEventListener('dblclick', function(event) { if (event.target.classList.contains('element-item')) { event.target.remove(); saveWorkspace(); } });

// Helper Functions
function getCollisionTarget(event, currentElement) { currentElement.style.display = 'none'; const elementUnderMouse = document.elementFromPoint(event.clientX, event.clientY); currentElement.style.display = ''; if (elementUnderMouse && elementUnderMouse.closest('.element-item')) { return elementUnderMouse.closest('.element-item'); } return null; }

// THIS FUNCTION IS NOW CORRECTED
// Get a reference to the new overlay element at the top of the file
const loadingOverlay = document.getElementById('loading-overlay');

// ... (rest of the file until the combineElements function)

async function combineElements(el1, el2) {
    // Show the animation before we start
    loadingOverlay.style.display = 'flex'; 
    try {
        const response = await fetch('http://127.0.0.1:5000/combine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ element1: el1, element2: el2 }),
        });
        if (!response.ok) {
            console.error("API Error:", response.statusText);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    } finally {
        // This will run after the 'try' or 'catch' block,
        // guaranteeing the animation is hidden.
        loadingOverlay.style.display = 'none';
    }

}

function createCraftedElement(name, emoji, x, y) { const elementDiv = document.createElement('div'); elementDiv.className = 'element-item'; elementDiv.innerHTML = `<span class="element-emoji">${emoji}</span> <span class="element-name">${name}</span>`; elementDiv.draggable = true; elementDiv.style.position = 'absolute'; craftingArea.appendChild(elementDiv); const width = elementDiv.offsetWidth; const height = elementDiv.offsetHeight; elementDiv.remove(); elementDiv.style.left = `${x - craftingArea.offsetLeft - width / 2}px`; elementDiv.style.top = `${y - craftingArea.offsetTop - height / 2}px`; return elementDiv; }
function displayElement(name, emoji) { const elementDiv = document.createElement('div'); elementDiv.className = 'element-item'; elementDiv.innerHTML = `<span class="element-emoji">${emoji}</span> <span class="element-name">${name}</span>`; elementDiv.draggable = true; elementList.appendChild(elementDiv); }
function saveWorkspace() { const elementsInWorkspace = []; craftingArea.querySelectorAll('.element-item').forEach(element => { elementsInWorkspace.push({ name: element.querySelector('.element-name').innerText, emoji: element.querySelector('.element-emoji').innerText, x: element.style.left, y: element.style.top }); }); localStorage.setItem('infiniteCraftWorkspace', JSON.stringify(elementsInWorkspace)); }
function loadWorkspace() { const savedElements = JSON.parse(localStorage.getItem('infiniteCraftWorkspace')); if (savedElements) { savedElements.forEach(elementData => { const elementDiv = document.createElement('div'); elementDiv.className = 'element-item'; elementDiv.innerHTML = `<span class="element-emoji">${elementData.emoji}</span> <span class="element-name">${elementData.name}</span>`; elementDiv.draggable = true; elementDiv.style.position = 'absolute'; elementDiv.style.left = elementData.x; elementDiv.style.top = elementData.y; craftingArea.appendChild(elementDiv); }); } }

// Page Load
window.onload = function() {
    const baseElements = [ { name: 'Fire', emoji: '🔥' }, { name: 'Water', emoji: '💧' }, { name: 'Earth', emoji: '🌍' }, { name: 'Air', emoji: '💨' }];
    elementList.innerHTML = '';
    craftingArea.innerHTML = '';
    localStorage.removeItem('infiniteCraftWorkspace');
    discoveredElements = new Set(baseElements.map(e => e.name));
    baseElements.forEach(element => { displayElement(element.name, element.emoji); });
};