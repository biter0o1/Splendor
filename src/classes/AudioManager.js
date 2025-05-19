class AudioManager {
	musicEnabled = false;

	constructor() {
		this.music = new Audio('assets/audio/mario.mp3');
		this.music.loop = true;
		this.music.volume = 0.02;
	}

	toggleMusic() {
		if (this.musicEnabled) {
			this.music.pause();
		} else {
			this.music.play();
		}
		this.musicEnabled = !this.musicEnabled;
	}

}

export default AudioManager;
