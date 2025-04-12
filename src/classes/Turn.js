import Card from './Card.js';
import Token from './Token.js';
import TokenType from './TokenType.js';
import PlayerManager from './PlayerManager.js';
import Board from './Board.js';

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
		this.player.collectReward(this.items);
		this.resetItems();
		this.refresh();
		this.setPlayer(this.playerManager.getNextPlayer());
	}

	setMethodTopPlaceCardOnBoard(placeCards) {
		this.placeCards = placeCards;
	}

	setPlayer(player) {
		this.player?.element.classList.remove('active')
		this.player = player;
		this.player.element.classList.add('active')
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

		if (this.finishable()) {
			turnBtn.classList.add('finishable');
		}

		element.appendChild(turnText);
		element.appendChild(turnItems);
		element.appendChild(turnBtn);
	}

	finishable() {
		if (this.items.some(item => item instanceof Card)) {
			return true;
		}

		const tokenCount = this.items.filter(item => item instanceof Token).length;

		const duplicates = this.items.filter((ii, index, self) => self.filter(i => i.type === ii.type).length === 2);

		const goldTokenCount = this.items.some(item => item.type === TokenType.GOLD);

		if (tokenCount === 2 && duplicates.length === 2) {
			return true;
		}

		if (tokenCount === 3 && duplicates.length === 0) {
			return true;
		}

		if (tokenCount === 1 && goldTokenCount) {
			return true;
		}

		return false;
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

			if(item.addToHand){
				if(this.player.cardsInHand.length < 3){
					return true;
				}
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
		let ret = true;
		for (let [type, value] of Object.entries(card.cost)) {
			let playerTokensAndBonuses = this.player.tokens[type] + this.player.bonuses[type];
			if (playerTokensAndBonuses < value) {
				ret = false;
			}
		}

		return ret;
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
				//Date.now because we need unique id, its miliseconds, its no matter for this object
				token.classList.add('can-purchase');
			} else {
				token.classList.remove('can-purchase');
			}
		});
	}

	refresh(){
		this.refreshCardCanPurchase();
		this.refreshCardCanPurchaseInHand();
		this.refreshTokenCanPurchase();
	}
}

export default Turn;
