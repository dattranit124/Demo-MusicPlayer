const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playlist = $('.playlist');
const togglePlay = $('.btn-toggle-play');
const player = $('.player')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const app = {
    currentIndex: 0,
    isPlay : false,
    songs: [
        {
            name: 'What A Word',
            singer: 'Chris Medina',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Someone you loved',
            singer: 'Lewis Capaldi',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Death bed',
            singer: 'Powfu',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Memories',
            singer: 'Maroon 5',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Let her go',
            singer: 'Passenger',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Photograph',
            singer: 'Ed Sheeran',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Perfect',
            singer: 'Ed Sheeran',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jfif'
        },
        {
            name: 'Let her go',
            singer: 'Passenger',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
    ],
    defindProperties: function() {
        Object.defineProperty(this,'currentSong',{
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    render: function(){
        const htmls = this.songs.map(function(song,index){
            return `
            <div class="song ${index===app.currentIndex? 'active':''}" data-index=${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playlist.innerHTML = htmls.join('');
    },

    handleEvent: function() {
        
        const cdWidth = cd.offsetWidth;
        
        //X??? l?? rotate CD
        const cdAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations:Infinity
        })
        cdAnimate.pause();

        //X??? l?? k??o danh s??ch b??i 
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth>0 ?  newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }

        //x??? l?? play
         togglePlay.onclick = function() {
                 if(app.isPlay) {
                     audio.pause();
                 }
                 else {
                     audio.play();
                 }
         }
         //khi song ???????c play 
         //l???ng nghe l
         audio.onplay = function() {
            app.isPlay=true;
            player.classList.add('playing');
            cdAnimate.play();

         }
         //khi song pause 
         //l???ng nghe 
         audio.onpause = function() {
            app.isPlay=false;
            player.classList.remove('playing');
            cdAnimate.pause();
         }
         //Khi ti???n ????? b??i h??t thay ?????i 
         audio.ontimeupdate = function() {
             if(audio.duration)
             {

                const progressPercent = Math.floor( audio.currentTime/audio.duration * 100);
                progress.value = progressPercent;
             }
         }
         //X??? l?? tua
            progress.onchange = function(e) {
              const seekTime =  audio.duration/100 * e.target.value;
              audio.currentTime = seekTime;
            },
            //Khi next song
            nextBtn.onclick = function() {
                if(randomBtn.classList.contains('active'))
                {

                    app.randomSong();
                }
                else
                {

                    app.nextSong();
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();

            },
            //khi prev song
            prevBtn.onclick = function() {
                if(randomBtn.classList.contains('active'))
                {

                    app.randomSong();
                }
                else
                {

                    app.prevSong();
                }
                audio.play();
                app.render();
                app.scrollToActiveSong();
            }
            //Click random
            randomBtn.onclick = function(e) {
                if(randomBtn.classList.contains('active'))
                {

                    randomBtn.classList.remove('active');
                }
                else {
                    randomBtn.classList.add('active');
                }
                
            }
            //Khi b??i h??t h???t
             audio.onended = function() {

                if(repeatBtn.classList.contains('active'))
                {
                    audio.play();
                }
                else {
                    nextBtn.click();
                }
             }
             //Click b??i h??t 
             playlist.onclick = function(e) {
                const songTarget = e.target.closest('.song:not(.active)');
                if(songTarget || e.target.closest('.option') )
                {
                    //x??? l?? khi click song
                    if(songTarget)
                    {
                        app.currentIndex = Number(songTarget.dataset.index);
                        app.render();
                        app.loadCurrentSong();
                        audio.play();
                    }
                   
                   
                }
                 
             }
             //Repeat
              
             repeatBtn.onclick = function()
             {
                if(repeatBtn.classList.contains('active'))
                {

                    repeatBtn.classList.remove('active');
                }
                else {
                    repeatBtn.classList.add('active');
                }
             }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex ++ ;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex  = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        if(this.currentIndex==0){
            this.currentIndex  = this.songs.length;
        }
        this.currentIndex -- ;
        this.loadCurrentSong();
    },
    //random b??i
    randomSong: function() {
        var newIndex ;
        do{        
        newIndex = Math.floor(Math.random() * app.songs.length);
        }while(newIndex === app.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        
    },
    //next b??i
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'nearest'
                }
            );
        },200)
    },
    start: function() {
            //?????nh ngh??a c??c thu???c t??nh cho objects
            this.defindProperties();
            //L???ng nghe v?? s??? l?? c??c s??? ki???n
            this.handleEvent();
            //T???i b??i ?????u ti??n v??o UI
            this.loadCurrentSong();
            //play list
            this.render()
    }
}
app.start();