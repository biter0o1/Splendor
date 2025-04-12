import Player from './Player.js';

class PlayerManager {
    players = [];

    static playerIndex = 0;

    constructor(){
        this.initializePlayers();
    }

    initializePlayers() {
		this.players.push(new Player('Paweł'));
		this.players.push(new Player('Test'));
		this.players.push(new Player('Test'));
		this.players.push(new Player('Test'));
		this.players.push(new Player('Test'));
	}

    getNextPlayer(){
        if(PlayerManager.playerIndex > this.players.length - 1)
        {
            PlayerManager.playerIndex = 0;
        }

        return this.players[PlayerManager.playerIndex++];
    }

}

export default PlayerManager;
