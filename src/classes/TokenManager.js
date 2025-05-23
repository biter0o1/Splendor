import Config from './Config.js';
import TokenType from './TokenType.js';
import Turn from './Turn.js';
import Token from './Token.js';
import Card from './Card.js';

class TokenManager {
	tokens = {
		[TokenType.WHITE]: Config.MAX_TOKENS,
		[TokenType.BLUE]: Config.MAX_TOKENS,
		[TokenType.GREEN]: Config.MAX_TOKENS,
		[TokenType.RED]: Config.MAX_TOKENS,
		[TokenType.BLACK]: Config.MAX_TOKENS,
		[TokenType.GOLD]: Config.MAX_GOLD_TOKEN,
	};

    uniqueIdCounter = 0;

	constructor() {
		this.init();
		this.displayTokens();
		this.displayTokensCount();
	}

	init() {
		this.turn = new Turn();
		this.turnElement = document.querySelector('#turn');
		this.tokenArea = document.querySelector('#token-area');
	}

	displayTokens() {
		this.tokenArea.innerHTML = '';
		Object.entries(this.tokens).forEach(([type, value]) => {
			const tokenDiv = document.createElement('div');
			tokenDiv.classList.add('token', type, `${type}-token-bg`);
			if(value <= 0){
				tokenDiv.classList.add('token-invisible');
			}

			tokenDiv.addEventListener('click', () => {
				this.handleTokenListener(type);
			});

			const icon = document.createElement('i');
			icon.classList.add('fa-regular', 'fa-gem');

			tokenDiv.appendChild(icon);

			this.animateFlash(tokenDiv);

			const tokenCountDiv = document.createElement('div');
			tokenCountDiv.classList.add('token-count');

			tokenDiv.appendChild(tokenCountDiv);

			this.tokenArea.appendChild(tokenDiv);
		});

		this.turn.refresh();
	}

	animateFlash(tokenElement) {
		const randomDelay = Math.random() * 3;
		const randomDuration = Math.random() * 2 + 2;
	
		tokenElement.style.setProperty('--flash-delay', `${randomDelay}s`);
		tokenElement.style.setProperty('--flash-duration', `${randomDuration}s`);
	}

	displayTokensCount() {
		const tokenArea = document.querySelector('#token-area');

		Object.entries(this.tokens).forEach(([type, value]) => {
			const token = tokenArea.querySelector(`.${type}`);
			token.querySelector('.token-count').textContent = value;
		});
	}

    createToken(type){
		const tokenElement = document.createElement('div');
		tokenElement.classList.add('token', type, `${type}-token-bg`);
		const icon = document.createElement('i');
		icon.classList.add('fa-regular', 'fa-gem');
		tokenElement.appendChild(icon);

        const id = this.uniqueIdCounter++;
        
        const tokenObject = new Token(id, type, tokenElement);

		tokenElement.addEventListener('click', () => {
			this.turn.removeItem(tokenObject);
			this.turn.items.find(item => item instanceof Card && item.addToHand)?.element.click();
			this.addToken(type);
		});

        return tokenObject;
    }

	addTokenToTurn(type, force = 0) {
        const tokenObject = this.createToken(type)
        if(this.turn.canAddItem(tokenObject) || force){
            this.turn.addItem(tokenObject);
            this.removeToken(type);
        }
	}

	handleTokenListener(type){
		this.addTokenToTurn(type);
	}

	addToken(type) {
		this.tokens[type]++;
		this.displayTokens();
		this.displayTokensCount();
	}

	removeToken(type) {
		this.tokens[type]--;
		this.displayTokens();
		this.displayTokensCount();
	}
}

export default TokenManager;
