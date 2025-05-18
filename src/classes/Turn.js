import Card from './Card.js';
import Token from './Token.js';
import TokenType from './TokenType.js';
import PlayerManager from './PlayerManager.js';
import Config from './Config.js';

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

		this.placeCards();
		this.player.collectReward(this.items, this.tokenManager);
		this.resetItems();
		this.setPlayer(this.playerManager.getNextPlayer());
		this.refresh();
	}

	setMethodTopPlaceCardOnBoard(placeCards) {
		this.placeCards = placeCards;
	}

	setPlayer(player) {
		this.player?.element.classList.remove('active');
		this.player = player;
		this.player.element.classList.add('active');
		this.reloadItems();
	}

	setTokenManager(tokenManager) {
		this.tokenManager = tokenManager;
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
		this.reloadItems();
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

		if (this.finishable()) {
			turnBtn.classList.add('finishable');
		}

		element.appendChild(turnText);
		element.appendChild(turnItems);
		element.appendChild(turnBtn);
	}

	finishable() {
		const tokenCount = this.items.filter(item => item instanceof Token).length;

		const duplicates = this.items.filter((ii, index, self) => self.filter(i => i.type === ii.type).length === 2);

		const goldTokenCount = this.items.some(item => item.type === TokenType.GOLD);

		const cards = this.items.filter(item => item instanceof Card);

		if (cards.length === 1) {
			if (cards.some(card => card.addToHand) && goldTokenCount) {
				return true;
			}

			if (cards.some(card => !card.addToHand)) {
				return true;
			}

			if (tokenCount === 1 && goldTokenCount) {
				return true;
			}
		}

		if (tokenCount === 2 && duplicates.length === 2) {
			return true;
		}

		if (tokenCount === 3 && duplicates.length === 0) {
			return true;
		}

		return false;
	}

	canAddItem(item) {
		const cardCount = this.items.filter(i => i instanceof Card).length;

		const tokenCount = this.items.filter(i => i instanceof Token).length;
		const goldTokenCount = this.items.filter(i => i.type === TokenType.GOLD).length;

		if (item instanceof Card) {
			if (cardCount >= 1) {
				return false;
			}

			if (tokenCount > 0 && !(tokenCount === 1 && goldTokenCount === 1)) {
				return false;
			}

			if (item.addToHand) {
				if (this.player.cardsInHand.length < Config.MAX_CARDS_IN_HAND) {
					return true;
				}
			}

			if (!this.canPlayerPurchaseCard(item)) {
				return false;
			}
		} else if (item instanceof Token) {
			const sameKeyTokenCount = this.items.filter(i => i.type === item.type).length;

			const duplicates = this.items.filter((ii, index, self) => self.filter(i => i.type === ii.type).length === 2);

			if (cardCount > 0) {
				return false;
			}

			if (item.type === TokenType.GOLD) {
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
		let gold = this.player.tokens[TokenType.GOLD];
		for (let [type, value] of Object.entries(card.cost)) {
			const tokens = this.player.tokens[type] || 0;
			const bonuses = this.player.bonuses[type] || 0;
			const combined = tokens + bonuses;

			if (combined < value) {
				const missing = value - combined;
				if (gold >= missing) {
					gold -= missing;
				} else {
					return false;
				}
			}
		}
		return true;
	}

	refreshCardCanPurchase() {
		Object.values(this.cardsOnBoard).forEach(cardsByLvl => {
			cardsByLvl.forEach(card => {
				if (this.canAddItem(card) && !card.addToHand) {
					card.element.classList.add('can-purchase');
				} else {
					card.element.classList.remove('can-purchase');
				}
			});
		});
	}

	refreshCardCanPurchaseInHand() {
		Object.values(this.player.cardsInHand).forEach(card => {
			if (this.canPlayerPurchaseCard(card)) {
				card.element.classList.add('can-purchase');
			} else {
				card.element.classList.remove('can-purchase');
			}
		});
	}

	refreshTokenCanPurchase() {
		const tokens = document.querySelectorAll('.token');
		tokens.forEach(token => {
			if (this.canAddItem(new Token(Date.now(), token.classList[1]))) {
				token.classList.add('can-purchase');
			} else {
				token.classList.remove('can-purchase');
			}
		});
	}

	refresh() {
		this.refreshCardCanPurchase();
		this.refreshCardCanPurchaseInHand();
		this.refreshTokenCanPurchase();
	}
}

export default Turn;
