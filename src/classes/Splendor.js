import Board from './Board.js';

class Splendor {
	constructor() {
		this.init();
	}

	init() {
		this.board = new Board();
		this.addListenerToPanelBtn();
	}

	addListenerToPanelBtn(){

		const showTurnPanelBtn = document.querySelector('#show-turn-panel');
		const showPlayersPanelBtn = document.querySelector('#show-players-panel');
		const turnPanel = document.querySelector('.left-panel');
		const playerPanel = document.querySelector('.right-panel');

		showTurnPanelBtn.addEventListener('click', () => {
			turnPanel.classList.toggle('open');
			const isOpen = turnPanel.classList.contains('open');
			showTurnPanelBtn.textContent = !isOpen ? 'SHOW TURN' : 'HIDE TURN';
		});

		showPlayersPanelBtn.addEventListener('click', () => {
			playerPanel.classList.toggle('open');
			const isOpen = playerPanel.classList.contains('open');
			showPlayersPanelBtn.textContent = !isOpen ? 'SHOW PLAYERS' : 'HIDE PLAYERS';
		});
	}
}

export default Splendor;
