let songData = [
    {
        id: 1,
        directory: "assets/audio/footstep.mp3",
        about: { manuallyPaused: false }
    }
];

let backgroundMusicPlaying = [];

const soundControl = {
    getSoundObj: function (id) {
        return songData.find(data => data.id === id).about.object;
    },

    //only designed for background music
    backgroundMusic: {
        volume: 1,
        //control volume of background music
        volumeControl: function (volume) {
            backgroundMusicPlaying.forEach(song => {
                song.type == "backgroundMusic"
                    ? songData
                          .find(data => data.id === song.id)
                          .about.object.setVolume(volume)
                    : null;
            });
            this.volume = volume;
        },
        //called when game starts (user have to interact by clicking anywhere)
        startAndLoop: function (musicId) {
            let music = songData.find(data => data.id === musicId).about;
            music.object.setVolume(this.volume);
            music.object.isPlaying() || music.manuallyPaused
                ? null
                : (music.object.loop(),
                  backgroundMusicPlaying.push({
                      id: musicId,
                      type: "backgroundMusic"
                  }));
        },
        //pause background music
        pause: function (musicId) {
            let music = songData.find(data => data.id === musicId).about;
            if (music.object.isPlaying()) {
                music.manuallyPaused = true;
                music.object.stop();
                backgroundMusicPlaying.pop({
                    id: musicId,
                    type: "backgroundMusic"
                });
            } else {
                console.log("Background music is not playing. ");
            }
        },
        //resume background music
        play: function (musicId) {
            let music = songData.find(data => data.id === musicId).about;
            if (music.manuallyPaused) {
                music.object.setVolume(this.volume);
                music.manuallyPaused = false;
                music.object.play();
                backgroundMusicPlaying.push({
                    id: musicId,
                    type: "backgroundMusic"
                });
            } else {
                console.log(
                    "Background music is already playing. If not, please use startAndLoop function to play it for the first time. "
                );
            }
        }
    },
    sfxSound: {
        volume: 0.2,
        //control volume of background music
        volumeControl: function (volume) {
            this.volume = volume;
        },
        play: function (sfxId) {
            let music = songData.find(data => data.id === sfxId).about.object;
            music.setVolume(this.volume);
            music.play();
        }
    }
};
