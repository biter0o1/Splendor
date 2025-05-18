import TokenType from './TokenType.js';
import Card from './Card.js';
import Token from './Token.js';

class Player {
	bonuses = {
		[TokenType.WHITE]: 0,
		[TokenType.BLUE]: 0,
		[TokenType.GREEN]: 0,
		[TokenType.RED]: 0,
		[TokenType.BLACK]: 0,
	};

	tokens = {
		[TokenType.WHITE]: 0,
		[TokenType.BLUE]: 0,
		[TokenType.GREEN]: 0,
		[TokenType.RED]: 0,
		[TokenType.BLACK]: 0,
		[TokenType.GOLD]: 0,
	};

	cardsInHand = [];

	victoryPoint = 0;

	static idCounter;

	constructor(name) {
		this.id = Player.idCounter++;
		this.name = name;

		this.generateElement();
	}

	collectReward(items, tokenManager) {
		items.forEach(item => {
			if (item instanceof Card) {
				if (item.addToHand) {
					this.cardsInHand.push(item);
					item.changeListenerToInHand();
					return;
				}
				this.bonuses[item.gemType] += 1;
				this.victoryPoint += item.victoryPoint;
				this.moveTokensFromPlayerToBoard(item, tokenManager);
			} else if (item instanceof Token) {
				this.tokens[item.type] += 1;
			}
		});

		this.updateElement();
	}

	moveTokensFromPlayerToBoard(card, tokenManager) {
		const cost = card.cost;

		const requiredTokens = {};
		const usedTokens = {};

		Object.keys(cost).forEach(type => {
			const remainingCost = cost[type] - (this.bonuses[type] || 0);
			requiredTokens[type] = Math.max(0, remainingCost);
		});

		for (const [type, amountNeeded] of Object.entries(requiredTokens)) {
			let toPay = amountNeeded;

			if (this.tokens[type] >= toPay) {
				this.tokens[type] -= toPay;
				usedTokens[type] = (usedTokens[type] || 0) + toPay;
			} else {
				const available = this.tokens[type];
				this.tokens[type] = 0;
				usedTokens[type] = (usedTokens[type] || 0) + available;
				toPay -= available;

				if (this.tokens[TokenType.GOLD] >= toPay) {
					this.tokens[TokenType.GOLD] -= toPay;
					usedTokens[TokenType.GOLD] = (usedTokens[TokenType.GOLD] || 0) + toPay;
				}
			}
		}

		for (const [type, count] of Object.entries(usedTokens)) {
			for (let i = 0; i < count; i++) {
				tokenManager.addToken(type);
			}
		}

		this.updateTokens();
	}

	updateElement() {
		this.updateBonuses();
		this.updateTokens();
		this.updateVictoryPoints();
		this.updateCardsInHand();
	}

	generateElement() {
		const template = document.querySelector('#player-template');
		this.element = template.content.cloneNode(true).querySelector('.player-stats');

		this.element.querySelector('.player-name').textContent = this.name;
		this.element.querySelector('.player-victory-points').textContent = this.victoryPoint;

		const bonuses = this.element.querySelector('.player-bonuses');
		this.generateBonuses(bonuses);

		const tokens = this.element.querySelector('.player-tokens');
		this.generateTokens(tokens);

		const cardsInHand = this.element.querySelector('.player-cards-in-hand');
		this.generateCardsInHand(cardsInHand);

		const parentList = document.querySelector('#player-list');
		parentList.appendChild(this.element);
	}

	generateBonuses(bonusesElement) {
		Object.entries(this.bonuses).forEach(([bonus, value]) => {
			const div = document.createElement('div');
			div.classList.add('player-bonus', `${bonus}-color`);
			div.textContent = `${value}`;
			bonusesElement.appendChild(div);
		});
	}

	updateBonuses() {
		const bonuses = this.element.querySelector('.player-bonuses');
		bonuses.innerHTML = '';
		this.generateBonuses(bonuses);
	}

	generateTokens(tokensElement) {
		Object.entries(this.tokens).forEach(([token, value]) => {
			const div = document.createElement('div');
			div.classList.add('player-token', token, `${token}-token-bg`);
			div.textContent = `${value}`;
			tokensElement.appendChild(div);
		});
	}

	updateTokens() {
		const tokens = this.element.querySelector('.player-tokens');
		tokens.innerHTML = '';
		this.generateTokens(tokens);
	}

	updateVictoryPoints() {
		const victoryPoints = this.element.querySelector('.player-victory-points');
		if (this.victoryPoint >= 5 && this.victoryPoint < 10) {
			victoryPoints.classList.remove('blue');
			victoryPoints.classList.add('gold');
		} else if (this.victoryPoint >= 10) {
			victoryPoints.classList.remove('gold');
			victoryPoints.classList.add('green');
		}
		victoryPoints.textContent = this.victoryPoint;
	}

	generateCardsInHand(cardInHandElement) {
		this.cardsInHand.forEach(card => {
			cardInHandElement.appendChild(card.element);
		});
	}

	updateCardsInHand() {
		const cardInHandElement = this.element.querySelector('.player-cards-in-hand');
		cardInHandElement.innerHTML = '';
		this.generateCardsInHand(cardInHandElement);
	}

	removeCardInHand(card) {
		this.cardsInHand = this.cardsInHand.filter(c => c.id !== card.id);
		this.updateCardsInHand();
	}

	addCardInHand(item) {
		this.cardsInHand.push(item);
		this.updateCardsInHand();
	}
}

export default Player;
