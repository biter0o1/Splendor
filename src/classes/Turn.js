import Card from './Card.js';
import Token from './Token.js';
import TokenType from './TokenType.js';
import PlayerManager from './PlayerManager.js';

class Turn {
	static _instance = null;

	items = [];

	constructor() {
		if (Turn._instance) {
			return Turn._instance;
		}

		this.playerManager = new PlayerManager();
		this.setPlayer(this.playerManager.getNextPlayer());

		Turn._instance = this;
	}

	finishTurn() {
		if (!this.finishable()) return;

		this.player.collectReward(this.items);
		this.resetItems();
		this.setPlayer(this.playerManager.getNextPlayer());
		this.refreshCardCanPurchase();
		this.refreshTokenCanPurchase();
	}

	setPlayer(player) {
		this.player = player;
		this.reloadItems();
	}

	addItem(item) {
		this.items.push(item);
		this.reloadItems();
	}

	removeItem(itemToRemove) {
		this.items = this.items.filter(item => item.id !== itemToRemove.id);
		this.reloadItems();
	}

	setCardsOnBoard(cards) {
		this.cardsOnBoard = cards;
	}

	resetItems() {
		this.items = [];
	}

	reloadItems() {
		const element = document.querySelector('#turn');
		element.innerHTML = '';

		const turnText = document.createElement('h1');
		turnText.textContent = `${this.player.name} Turn`;

		const turnItems = document.createElement('div');
		turnItems.classList.add('turn-items');
		turnItems.innerHTML = '';

		this.items.forEach(item => {
			turnItems.appendChild(item.element);
		});

		const turnBtn = document.createElement('button');
		turnBtn.classList.add('finish-turn-btn');
		turnBtn.textContent = 'FINISH';

		turnBtn.addEventListener('click', () => this.finishTurn());

		element.appendChild(turnText);
		element.appendChild(turnItems);
		element.appendChild(turnBtn);
	}

	finishable() {
		console.log('check if turn can be ended');

		return true;
	}

	canAddItem(item) {
		const cardCount = this.items.filter(i => i instanceof Card).length;

		const tokenCount = this.items.filter(i => i instanceof Token).length;

		if (item instanceof Card) {
			if (cardCount >= 1) {
				return false;
			}
			if (tokenCount > 0) {
				return false;
			}

			if (!this.canPlayerPurchaseCard(item)) {
				return false;
			}
		} else if (item instanceof Token) {
			const sameKeyTokenCount = this.items.filter(i => i.type === item.type).length;
			const goldTokenCount = this.items.filter(i => i.type === TokenType.GOLD).length;

			const duplicates = this.items.filter((ii, index, self) => self.filter(i => i.type === ii.type).length === 2);

			if (cardCount > 0) {
				return false;
			}

			if (sameKeyTokenCount >= 2) {
				return false;
			}

			if (tokenCount >= 3) {
				return false;
			}

			if (tokenCount >= 2 && sameKeyTokenCount >= 1) {
				return false;
			}

			if (tokenCount > 0 && item.type === TokenType.GOLD) {
				return false;
			}

			if (goldTokenCount > 0) {
				return false;
			}

			if (duplicates.length > 0) {
				return false;
			}
		}

		return true;
	}

	canPlayerPurchaseCard(card) {
		for (let [type, value] of Object.entries(card.cost)) {
			if (this.player.tokens[type] < value) {
				return false;
			}
		}

		return true;
	}

	refreshCardCanPurchase() {
		Object.values(this.cardsOnBoard).forEach(cardsByLvl => {
			cardsByLvl.forEach(card => {
				if (this.canAddItem(card)) {
					card.element.classList.add('can-purchase');
				} else {
					card.element.classList.remove('can-purchase');
				}
			});
		});
	}

	refreshTokenCanPurchase() {
		const tokens = document.querySelectorAll('.token');
		tokens.forEach(token => {
			if (this.canAddItem(new Token(Date.now(), token.classList[1]))) {
				//Date.now because we need unique id, its miliseconds, its no matter for this object
				token.classList.add('can-purchase');
			} else {
				token.classList.remove('can-purchase');
			}
		});
	}
}

export default Turn;
