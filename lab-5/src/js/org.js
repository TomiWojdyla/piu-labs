// elementy UI
const addSquareBtn = document.getElementById('addSquare');
const addCircleBtn = document.getElementById('addCircle');
const recolorSquaresBtn = document.getElementById('recolorSquares');
const recolorCirclesBtn = document.getElementById('recolorCircles');
const cntSquaresEl = document.getElementById('cntSquares');
const cntCirclesEl = document.getElementById('cntCircles');
const board = document.querySelector('#board');

// liczniki (oddzielne)
let squaresCount = 0;
let circlesCount = 0;
// mała funkcja aktualizująca liczniki na UI
function updateCounters() {
    cntSquaresEl.textContent = squaresCount;
    cntCirclesEl.textContent = circlesCount;
}
// helper: losowy kolor HSL
function randomHsl() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)`;
}

// ŻYWA kolekcja kółek (HTMLCollection) — pobieramy raz i używamy
const circlesLive = board.getElementsByClassName('circle');

// KWADRAT: dodawany z indywidualnym listenerem
addSquareBtn.addEventListener('click', () => {
    const s = document.createElement('div');
    s.className = 'shape square';
    s.style.backgroundColor = randomHsl();
    s.addEventListener('click', () => {
        s.remove();
        squaresCount--;
        updateCounters();
    });
    board.appendChild(s);
    squaresCount++;
    updateCounters();
});

// KÓŁKO: dodawane BEZ indywidualnych listenerów, delegacja na board
addCircleBtn.addEventListener('click', () => {
    const c = document.createElement('div');
    c.className = 'shape circle';
    c.style.backgroundColor = randomHsl();
    board.appendChild(c); // circlesLive samo się zaktualizuje!
    circlesCount++;
    updateCounters();
});

// Delegacja: jeden listener na 'board' obsługuje kliki w kółka
board.addEventListener('click', (e) => {
    if (e.target?.classList?.contains('circle')) {
        e.target.remove();
        circlesCount--;
        updateCounters();
    }
});

// Przekolorowywanie kwadratów (NodeList ze querySelectorAll)
recolorSquaresBtn.addEventListener('click', () => {
    // wyszukujemy istniejące w tym momencie kwadraty
    const squaresSnapshot = board.querySelectorAll('.square');
    squaresSnapshot.forEach((el) => (el.style.backgroundColor = randomHsl()));
});

// Przekolorowywanie kółek (HTMLCollection - żywa kolekcja)
recolorCirclesBtn.addEventListener('click', () => {
    // circlesLive to żywa kolekcja — nie trzeba niczego wyszukiwać
    for (const el of circlesLive) {
        el.style.backgroundColor = randomHsl();
    }
});

// Dodatkowo przykład pobieranie przy pomocy getElementsByTagName
const allButtons = document.getElementsByTagName('button');
for (const b of allButtons) {
    b.addEventListener('mouseenter', () => (b.style.opacity = '0.7'));
    b.addEventListener('mouseleave', () => (b.style.opacity = '1'));
}

// inicjacja liczników
updateCounters();
