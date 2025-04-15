import TokenType from './TokenType.js';
import Card from './Card.js';
import Token from './Token.js';

class Player {
	bonuses = {
		[TokenType.WHITE]: 0,
		[TokenType.BLUE]: 0,
		[TokenType.GREEN]: 0,
		[TokenType.RED]: 1,
		[TokenType.BLACK]: 0,
	};

	tokens = {
		[TokenType.WHITE]: 4,
		[TokenType.BLUE]: 4,
		[TokenType.GREEN]: 4,
		[TokenType.RED]: 4,
		[TokenType.BLACK]: 4,
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

	collectReward(items) {
		items.forEach(item => {
			if (item instanceof Card) {
				if(item.addToHand){
					this.cardsInHand.push(item);
					item.changeListenerToInHand();
					return;
				}
				this.bonuses[item.gemType] += 1;
				this.victoryPoint += item.victoryPoint;
			} else if (item instanceof Token) {
				this.tokens[item.type] += 1;
			}
		});

		this.updateElement();
	}

	updateElement() {
		console.log(this.cardsInHand);
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
			div.classList.add('player-bonus', bonus);
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
			div.classList.add('player-token', token);
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

	removeCardInHand(card){
		this.cardsInHand = this.cardsInHand.filter(c => c.id !== card.id);
		this.updateCardsInHand();
	}

	addCardInHand(item){
		this.cardsInHand.push(item);
		this.updateCardsInHand();
	}
}

export default Player;
