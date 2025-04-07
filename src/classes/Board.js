import Config from './Config.js';
import Deck from './Deck.js';
import TokenManager from './TokenManager.js';
import Turn from './Turn.js';

class Board {
	cards = {
		lvl1: [],
		lvl2: [],
		lvl3: [],
	};

	constructor() {
		this.turn = new Turn(); //Singleton
		this.turn.setCardsOnBoard(this.cards);
		this.init();
	}

	async init() {
		this.tokenManager = new TokenManager();
		this.deck = new Deck();
		await this.deck.init();
		this.placeCards();
	}

	placeCards() {
		this.fillCards();
		this.displayCards();
	}

	fillCards() {
		for (let lvl = 1; lvl <= Config.CARD_MAX_LEVEL; lvl++) {
			let cardsByLevel = this.deck.cardsByLevel[`lvl${lvl}`];

			while (this.cards[`lvl${lvl}`].length < Config.CARDS_MAX_ON_BOARD_PER_LEVEL) {
				if (cardsByLevel.length > 0) {
					const cardPoped = cardsByLevel.pop();
					this.cards[`lvl${lvl}`].push(cardPoped);
				} else {
					break;
				}
			}
			this.deck.displayDeckCountByLevel(lvl);
		}
	}

	displayCards() {
		this.clearCardsAreaLvl();
		Object.values(this.cards).forEach(cardsByLvl => {
			cardsByLvl.forEach(card => {
				card.display();
				card.addListener(this);
			});
		});
		this.turn.refreshCardCanPurchase();
		this.turn.refreshTokenCanPurchase();
	}

	addCard(card) {
		const levelKey = `lvl${card.lvl}`;
		if (card.index !== undefined) {
			this.cards[levelKey].splice(card.index, 0, card);
		} else {
			this.cards[levelKey].push(card);
		}
		this.displayCards();
	}

	removeCard(card) {
		const levelKey = `lvl${card.lvl}`;
		card.index = this.cards[levelKey].indexOf(card);
		this.cards[levelKey] = this.cards[levelKey].filter(c => c !== card);
		this.displayCards();
	}

	clearCardsAreaLvl() {
		for (let lvl = 1; lvl <= Config.CARD_MAX_LEVEL; lvl++) {
			document.querySelector(`.cards-area-lvl${lvl}`).innerHTML = '';
		}
	}
}

export default Board;
