document.documentElement.classList.add('js');
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

function board(id, fen, highlights = []) {
  const container = document.getElementById(id);
  container.replaceChildren();
  fen.split(' ')[0].split('/').forEach((rank, row) => {
    let col = 0;
    for (const token of rank) {
      const count = /\d/.test(token) ? Number(token) : 1;
      for (let n = 0; n < count; n++, col++) {
        const square = document.createElement('span');
        const name = 'abcdefgh'[col] + (8 - row);
        square.className = 'square' + ((row + col) % 2 ? ' dark-square' : '') + (highlights.includes(name) ? ' highlight' : '');
        if (!/\d/.test(token)) {
          const img = document.createElement('img');
          img.src = `/assets/piece_chessnut_${token === token.toUpperCase() ? 'w' : 'b'}${token.toLowerCase()}.png`;
          img.alt = ''; img.width = 160; img.height = 160;
          square.append(img);
        }
        container.append(square);
      }
    }
  });
}

const modes = {
  play: { label: 'YOUR NEXT CHALLENGE', title: 'You vs. Outpost', badge: 'Your pace', caption: 'A familiar board. A fresh challenge. Make yourself at home.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R', highlights: ['g1', 'f3'] },
  puzzle: { label: 'FIND THE FINISH', title: 'Can you spot mate in one?', badge: 'White to move', caption: 'Look for a back-rank opportunity. In the app, play your move and discover the idea.', fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1', highlights: [] },
  review: { label: 'THE MOMENT THAT MATTERED', title: 'Turn hindsight into insight.', badge: 'Explore the line', caption: 'See what changed, find a better continuation and practise the moments you missed.', fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1', highlights: ['e1', 'g1'] }
};

function selectMode(mode) {
  const m = modes[mode];
  document.querySelectorAll('[data-mode]').forEach(el => { const active = el.dataset.mode === mode; el.classList.toggle('active', active); el.setAttribute('aria-selected', active); el.tabIndex = active ? 0 : -1; });
  document.getElementById('feature-preview').setAttribute('aria-labelledby', `tab-${mode}`);
  for (const key of ['label', 'title', 'badge', 'caption']) document.getElementById(`preview-${key}`).textContent = m[key];
  document.getElementById('feature-board').setAttribute('aria-label', m.title + ' — illustrative chess position');
  board('feature-board', m.fen, m.highlights);
}

const openings = {
  italian: { name: 'The Italian Game', eco: 'C50', description: 'Develop naturally. Take aim at the centre. A classic place to find your feet.', moves: '1. e4 e5   2. Nf3 Nc6   3. Bc4', variations: ['Giuoco Piano', 'Two Knights Defense', 'Evans Gambit'], fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R', highlights: ['f1', 'c4'] },
  sicilian: { name: 'The Sicilian Defense', eco: 'B20–B99', description: 'Meet the centre from the flank. An ambitious reply with a whole world of possibilities.', moves: '1. e4 c5   2. Nf3 d6   3. d4 cxd4', variations: ['Najdorf', 'Dragon', 'Alapin'], fen: 'rnbqkbnr/pp2pppp/3p4/8/3pP3/5N2/PPP2PPP/RNBQKB1R', highlights: ['c5', 'd4'] },
  queens: { name: 'The Queen’s Gambit', eco: 'D06–D69', description: 'Offer a pawn. Ask a question. Build your understanding of space, structure and the centre.', moves: '1. d4 d5   2. c4', variations: ['Accepted', 'Declined', 'Slav Defense'], fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR', highlights: ['c2', 'c4'] },
  french: { name: 'The French Defense', eco: 'C00–C19', description: 'Build a solid foundation, then challenge the centre. Discover the plans behind the pawn chains.', moves: '1. e4 e6   2. d4 d5   3. e5', variations: ['Advance', 'Winawer', 'Tarrasch'], fen: 'rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR', highlights: ['e4', 'e5'] }
};

function selectOpening(key) {
  const o = openings[key];
  document.querySelectorAll('[data-opening]').forEach(el => { const active = el.dataset.opening === key; el.classList.toggle('active', active); el.setAttribute('aria-selected', active); el.tabIndex = active ? 0 : -1; });
  document.getElementById('opening-content').setAttribute('aria-labelledby', `opening-${key}`);
  for (const prop of ['name', 'eco', 'description', 'moves']) document.getElementById(`opening-${prop}`).textContent = o[prop];
  document.getElementById('opening-variations').replaceChildren(...o.variations.map(v => { const el = document.createElement('span'); el.textContent = v; return el; }));
  document.getElementById('opening-board').setAttribute('aria-label', o.name + ' example position');
  board('opening-board', o.fen, o.highlights);
}

function setupTabs(selector, key, select) {
  const tabs = [...document.querySelectorAll(selector)];
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab.dataset[key]));
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (i + 1) % tabs.length;
      if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next].dataset[key]); tabs[next].focus(); }
    });
  });
}
setupTabs('[data-mode]', 'mode', selectMode);
setupTabs('[data-opening]', 'opening', selectOpening);
selectMode('play');
selectOpening('italian');
fetch('/release.json').then(r => r.ok ? r.json() : null).then(release => {
  if (release?.sizeBytes) document.getElementById('apk-size').textContent = `${Math.round(release.sizeBytes / 1048576)} MB`;
}).catch(() => {});
