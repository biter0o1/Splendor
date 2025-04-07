import Player from './Player.js';
import Deck from './Deck.js';
import Turn from './Turn.js';
import Board from './Board.js';
import PlayerManager from './PlayerManager.js';

class Splendor {
	constructor() {
		this.init();
	}

	init() {
		this.board = new Board();
	}
}

export default Splendor;
