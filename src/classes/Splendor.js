import Board from './Board.js';
import AudioManager from './AudioManager.js';

class Splendor {
	constructor() {
		this.init();
	}

	init() {
		this.audioManager = new AudioManager();
		this.board = new Board();
		this.addListenerToPanelBtn();
		this.initAudio();
	}

	initAudio() {
		const musicBtn = document.querySelector('#music-toggle');
		const musicIcon = musicBtn.querySelector('i');
		musicBtn.addEventListener('click', () => {
			this.audioManager.toggleMusic();
			if (this.audioManager.musicEnabled) {
				musicIcon.classList.remove('fa-volume-xmark');
				musicIcon.classList.add('fa-volume-high');
			} else {
				musicIcon.classList.remove('fa-volume-high');
				musicIcon.classList.add('fa-volume-xmark');
			}
		});
	}

	addListenerToPanelBtn() {
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
