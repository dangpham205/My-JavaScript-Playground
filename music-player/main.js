// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "DAWNNY_MUSIC_PLAYER";

const player = $(".player");
const cd = $(".cd");
const cdWidth = cd.offsetWidth;
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  settingConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify( this.config ))
  },
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/song1.jpg"
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./assets/music/song2.mp3",
      image: "./assets/img/song2.jpg"
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "./assets/music/song3.mp3",
      image: "./assets/img/song3.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./assets/music/song4.mp3",
      image: "./assets/img/song4.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",
      path: "./assets/music/song5.mp3",
      image: "./assets/img/song5.jpg"
    }
  ],
  render: function() {
    const _this = this
    const htmls = this.songs.map(function(song, index) {
      // <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
      return `
          <div class="song ${index === _this.currentIndex ? "active" : ""}" data-index= "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>  `
    })
    playlist.innerHTML = htmls.join('')
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function() {
    const _this = this

    // Quay đĩa CD
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ],{
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate.pause()    // mặc định mới vô là pause

    // khi scroll thì hình cd sẽ mờ dần và thu nhỏ lại
    document.onscroll = function() {                    
      const scrollTop = window.scrollY || document.documentElement.scrollTop 
      const newCdWidth = cdWidth - scrollTop

      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
      cd.style.opacity = newCdWidth / cdWidth
    }

    // khi bấm play
    playBtn.onclick = function() {
      if ( _this.isPlaying ) {
        audio.pause()
      }
      else{
        audio.play()
      }
    }
    
    // khi bài hát được play
    audio.onplay = function() {
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }
    
    // khi bài hát bị pause
    audio.onpause = function() {
      player.classList.remove('playing')
      _this.isPlaying = false
      cdThumbAnimate.pause()
    }

    // khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function() {
      if (audio.duration) {
        const currentProgress = Math.floor( audio.currentTime / audio.duration * 100 )
        progress.value = currentProgress
      }
    }

    // khi tua tiến độ bài hát
    progress.onchange = function(e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }

    // khi bấm next
    nextBtn.onclick = function() {
      if (_this.isRandom){
        _this.randomSong()
      }
      else{
        _this.nextSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }
    
    // khi bấm back
    prevBtn.onclick = function() {
      if (_this.isRandom){
        _this.randomSong()
      }
      else{
        _this.previousSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    // khi bấm random
    randomBtn.onclick = function(e){
      _this.isRandom = ! _this.isRandom
      _this.settingConfig('isRandom', _this.isRandom)
      randomBtn.classList.toggle('active', _this.isRandom)
    }

    // khi bấm repeat
    repeatBtn.onclick = function(){
      _this.isRepeat = ! _this.isRepeat
      _this.settingConfig('isRepeat', _this.isRepeat)
      repeatBtn.classList.toggle('active', _this.isRepeat)
    }

    // khi hết bài hát
    audio.onended = function() {
      if (_this.isRepeat){
        audio.play()
      }
      else{
        nextBtn.click()
      }
    }

    // khi chọn bài hát
    player.onclick = function(e) {
      const unactiveSong = e.target.closest('.song:not(.active)')
      if ( unactiveSong || e.target.closest('.option') ){
        // chọn song
        if ( unactiveSong ) {
          var index = Number(unactiveSong.getAttribute('data-index'))
          _this.currentIndex = index
          _this.loadCurrentSong()
          audio.play()
          _this.render()
        }
      }
    }

  },
  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
    audio.src = this.currentSong.path
  },
  loadConfig: function() {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
    randomBtn.classList.toggle('active', this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)

  },
  scrollToActiveSong: function() {
    setTimeout(function(){
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }, 500)
  },
  nextSong: function() {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  previousSong: function() {
    this.currentIndex--
    if (this.currentIndex <= 0 ){
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  randomSong: function() {
    let newIndex 
    do {
      newIndex = Math.floor( Math.random() * this.songs.length )
    } while(newIndex === this.currentIndex)

    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  start: function() {
    this.loadConfig()
    // định nghĩa các thuộc tính cho obj
    this.defineProperties()
    // xử lí các sự kiện
    this.handleEvents()
    // tải thông tin bài hát đầu vào ui 
    this.loadCurrentSong()
    // load playlist bài hát
    this.render()
  }
}

app.start()