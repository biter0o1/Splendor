import TokenType from './TokenType.js';
import Turn from './Turn.js';
import Token from './Token.js';

class Card {
	constructor(id, victoryPoint, cost, gemType, lvl) {
		this.id = id;
		this.victoryPoint = victoryPoint;
		this.cost = cost;
		this.gemType = gemType;
		this.lvl = lvl;
	}

	display() {
		const template = document.querySelector('#card-template');
		this.element = template.content.cloneNode(true).querySelector('.card');

		this.element.classList.add('card-bg', `${this.gemType}-bg`);

		this.element.querySelector('.points').textContent = this.victoryPoint;

		this.element.querySelector('.gem').classList.add(`${this.gemType}-color`);

		const costArea = this.element.querySelector('.cost-area');

		Object.entries(this.cost).forEach(([key, cost]) => {
			if (cost == 0) {
				return;
			}

			const costDiv = document.createElement('div');
			costDiv.classList.add('cost', `${key}-color`);
			costDiv.textContent = `${cost}`;
			costArea.appendChild(costDiv);
		});

		if (this.isNew) {
			this.element.classList.add('new-added-card');
			const randomDelay = Math.random() * 0.3;

			this.element.style.animationDelay = `${randomDelay}s`;
		}

		this.element.addEventListener('animationend', () => {
			this.element.classList.remove('new-added-card');
		});

		this.isNew = false;

		this.firstParent = document.querySelector(`.cards-area-lvl${this.lvl}`);
		this.firstParent.appendChild(this.element);
	}

	addListener(board, tokenManager) {
		const turn = new Turn();
		this._handleCardClick = () => {
			if (this.element.parentElement === this.firstParent) {
				if (!turn.canPlayerPurchaseCard(this) && turn.items.length === 0) {
					this.addToHand = true;
					tokenManager.addTokenToTurn(TokenType.GOLD, true);
				}
				if (turn.canAddItem(this)) {
					this.element.classList.remove('new-added-card');
					turn.addItem(this);
					board.removeCard(this);
				}
			} else {
				this.element.classList.add('new-added-card');
				this.isNew = true;
				if (turn.items.some(item => item instanceof Token && item.type == TokenType.GOLD)) {
					tokenManager.addToken(TokenType.GOLD);
				}
				turn.resetItems();
				board.addCard(this);
			}
		};

		this.element.addEventListener('click', this._handleCardClick);
	}

	changeListenerToInHand() {
		const turn = new Turn();
		this.element.removeEventListener('click', this._handleCardClick);

		this.playerHandParent = turn.player.element.querySelector('.player-cards-in-hand');

		this.element.addEventListener('click', () => {
			if (this.element.parentElement === this.playerHandParent) {
				if (!turn.player.cardsInHand.some(card => card === this)) return;
				if (!turn.canPlayerPurchaseCard(this)) return;
				this.addToHand = false;
				turn.addItem(this);
				turn.player.removeCardInHand(this);
			} else {
				turn.removeItem(this);
				turn.player.addCardInHand(this);
			}
		});
	}
}

export default Card;
