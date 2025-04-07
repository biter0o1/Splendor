import Cost from './Cost.js';
import Card from './Card.js';
import Config from './Config.js';

class Deck {
	cards = [];
	cardsByLevel = {
		lvl1: [],
		lvl2: [],
		lvl3: [],
	};

	async init() {
        await this.loadData();
		this.separateCardsByLevel();
        this.displayAllDeckCount();
	}

	async loadData() {
		const response = await fetch('cards.json');

		const jsonData = await response.json();

		jsonData.cards.forEach(cardData => {
			this.addCard(cardData);
		});
	}

	addCard(cardData) {
		const cost = new Cost(
			cardData.cost.Black,
			cardData.cost.Blue,
			cardData.cost.Green,
			cardData.cost.Red,
			cardData.cost.White
		);
		const card = new Card(cardData.id, cardData.victoryPoints, cost, cardData.gem.toLowerCase(), cardData.level);
		this.cards.push(card);
	}

	separateCardsByLevel() {
        for(let lvl = 1; lvl <= Config.CARD_MAX_LEVEL; lvl++){
            this.cardsByLevel[`lvl${lvl}`] = this.cards.filter(card => card.lvl === lvl);
        }
	}

	displayDeckCountByLevel(lvl) {
		const deckLvl3 = document.querySelector(`#deck-lvl${lvl}`);
		deckLvl3.querySelector('.count').textContent = this.cardsByLevel[`lvl${lvl}`].length;
	}

    displayAllDeckCount(){
        for(let lvl = 1; lvl <= Config.CARD_MAX_LEVEL; lvl++){
            this.displayDeckCountByLevel(lvl);
        }
    }
}

export default Deck;
