<template>
  <div id="app">
    <div class="bg-blur" :style="{backgroundImage: `url(${puzzleData.bgImgUrl})`}"></div>
    <template v-if="!isClear">
      <div id="title" :style="{'z-index': zIndex+1}" key="0">
        <h1>請完成這幅《{{ puzzleData.name }}》</h1>
      </div>
      <button id="reset" @click="reset" :style="{'z-index': zIndex+1}" key="1">重新排列</button>
    </template>
    <div id="puzzle-content" v-if="!isComplete" key="2">
      <div class="puzzle" data-combine="" v-for="(pos, idx) in puzzleData.puzzlePos" :key="idx + 10" v-drag
        @mousedown="changeZIdx" @mouseup="getSiblsPos">
        <img :src="puzzleImg(idx)" :style="{position:'absolute', top: `${pos.y}px`, left: `${pos.x}px`}">
      </div>
    </div>
    <div id="complete-puzzle" key="3">
      <img src="./image/img-Qingming.png" alt="清本院清明上河圖" class="picture" v-if="isComplete">
    </div>
    <div id="intro" v-if="isClear" key="4">
      <h1>{{ puzzleData.fullName }}</h1>
      <h2>{{ puzzleData.author }}</h2>
      <h2>{{ puzzleData.age }}</h2>
      <div class="inform">
        <p v-for="(artical, index) in puzzleData.inform" :key="index">{{ artical }}</p>
      </div>
      <button class="again" @click="playAgain">在玩一次</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      zIndex: 10,
      isClear: false,
      isComplete: false,
      siblsIdxArr: [],
      puzzleData: {
        name: '清明上河圖',
        xNum: 3,
        yNum: 3,
        bgImgUrl: require('./image/img-bg-Qingming.png'),
        puzzleUrl: './image/Puzzle-',
        puzzlePos: [
          {
            y: 0,
            x: 0
          },
          {
            y: 0,
            x: -27
          },
          {
            y: 0,
            x: 0
          },
          {
            y: 0,
            x: 0
          },
          {
            y: -27,
            x: 0
          },
          {
            y: 0,
            x: -27
          },
          {
            y: -27,
            x: 0
          },
          {
            y: 0,
            x: -27
          },
          {
            y: -27,
            x: 0
          },
        ],
        fullName: '清本院清明上河圖',
        author: '陳枚、孫祜、金昆、戴洪、程志道',
        age: '清高宗乾隆元年（1736）',
        inform: ['宋張澤端（活動於西元十二世紀前期）「清明上河圖」是畫史中寫實風俗畫的一件傑作，歷代臨仿者甚多，在故宮即藏有七種不同的本子，其中就屬清院本「清明上河圖」最為有名。', '此卷為乾隆元年（一七三六）由宮廷畫院畫師陳枚、孫祜、金昆、戴洪、程志道等五人合繪。 此卷設色鮮麗，用筆圓熟，界畫橋樑、屋宇及人物皆十分細膩嚴謹，是院畫中之極精者。所畫事物甚多，雖失去了宋代古制，但也足以代表明清之際北京風物。'],
      }
    }
  },
  methods: {
    puzzleImg (idx) {
      let img = require(`${this.puzzleData.puzzleUrl}${idx+1}.png`)
      return img
    },
    getSiblsIdxArr() {
      let siblsIdx = []
      let xNum = this.puzzleData.xNum
      let num = this.puzzleData.xNum * this.puzzleData.yNum
      for (let i = 0; i < num; i++) {
        switch (i % xNum) {
          case 0:
            siblsIdx = [i - xNum, i + 1, i + xNum]
            break
          case xNum - 1:
            siblsIdx = [i - xNum, i - 1, i + xNum]
            break
          default:
            siblsIdx = [i - xNum, i - 1, i + 1, i + xNum]
        }
        siblsIdx = siblsIdx.filter(el => {
          return el >= 0 && el < num
        })
        this.siblsIdxArr.push(siblsIdx)
      }
    },
    setData() {
      document.querySelectorAll('.puzzle').forEach((el, index) => {
        el.setAttribute('data-combine', index)
      })
    },
    changeZIdx(e) {
      let puzzles = document.querySelectorAll('.puzzle')
      let combinePuzzles = JSON.parse(`[${puzzles[[...puzzles].indexOf(e.currentTarget)].getAttribute('data-combine')}]`)
      combinePuzzles.forEach(el => {
        puzzles[el].style.zIndex = this.zIndex
      })
      this.zIndex++
    },
    combine(idx1, idx2, els, topIncr, leftIncr) {
      let el1 = els[idx1]
      let el2 = els[idx2]
      let siblsIdxArr = this.siblsIdxArr
      let combineArr1 = JSON.parse(`[${el1.getAttribute('data-combine')}]`)
      let combineArr2 = JSON.parse(`[${el2.getAttribute('data-combine')}]`)
      combineArr1.forEach(el1 => {
        combineArr2.forEach(el2 => {
          if (siblsIdxArr[el1].indexOf(el2) >= 0) {
            siblsIdxArr[el1].splice(siblsIdxArr[el1].indexOf(el2), 1)
          }
          if (siblsIdxArr[el2].indexOf(el1) >= 0) {
            siblsIdxArr[el2].splice(siblsIdxArr[el2].indexOf(el1), 1)
          }
        })
      })
      this.combinePuzzle(el1, el2, els, topIncr, leftIncr, combineArr1, combineArr2)
      this.combineData(el1, el2, els)
    },
    combinePuzzle(el1, el2, els, topIncr, leftIncr, idxArr1, idxArr2) {
      let top1 = parseInt(el1.style.top)
      let left1 = parseInt(el1.style.left)
      let top2 = parseInt(el2.style.top)
      let left2 = parseInt(el2.style.left)
      let posDiff = []
      let length = idxArr2.length
      idxArr2.forEach(el => {
        posDiff.push({
          top: parseInt(els[el].style.top) - top2,
          left: parseInt(els[el].style.left) - left2
        })
      })
      for (let i = 0; i < length; i++) {
        let index = idxArr2[i]
        els[index].style.top = top1 + topIncr + posDiff[i].top + 'px'
        els[index].style.left = left1 + leftIncr + posDiff[i].left + 'px'
      }
      idxArr1.forEach(el => {
        els[el].classList.add('box-shadow')
        setTimeout(() => {
          els[el].classList.remove('box-shadow')
        }, 500)
      })
      idxArr2.forEach(el => {
        els[el].classList.add('box-shadow')
        setTimeout(() => {
          els[el].classList.remove('box-shadow')
        }, 500)
      })
    },
    combineData(el1, el2, els) {
      let str = `${el1.getAttribute('data-combine')}, ${el2.getAttribute('data-combine')}`
      let idxArr1 = JSON.parse(`[${el1.getAttribute('data-combine')}]`)
      let idxArr2 = JSON.parse(`[${el2.getAttribute('data-combine')}]`)
      let length1 = idxArr1.length
      let length2 = idxArr2.length
      for (let i = 0; i < length1; i++) {
        let index = idxArr1[i]
        els[index].setAttribute('data-combine', str)
      }
      for (let i = 0; i < length2; i++) {
        let index = idxArr2[i]
        els[index].setAttribute('data-combine', str)
      }
    },
    complete() {
      setTimeout(() => {
        let firstPuzzle = document.querySelector('.puzzle')
        let fullImg = document.querySelector('#complete-puzzle')
        let title = document.querySelector('#title')
        let reset = document.querySelector('#reset')
        let appW = document.getElementById('app').scrollWidth
        let appH = document.getElementById('app').scrollHeight
        this.isComplete = true
        fullImg.style.top = `${parseInt(firstPuzzle.style.top) + 18.5}px`
        fullImg.style.left = `${parseInt(firstPuzzle.style.left) + 18.5}px`
        fullImg.style.transform = `translate(${(appW - 580) / 2 - parseInt(fullImg.style.left)}px, ${(appH - 580) / 2 - parseInt(fullImg.style.top) + 18.5}px)`
        title.style.opacity = 0
        reset.style.opacity = 0
        setTimeout(() => {
          this.isClear = true
          document.querySelector('.picture').classList.add('box-shadow')
          setTimeout(() => {
            let intro = document.querySelector('#intro')
            let introW = intro.offsetWidth
            let gap = 30
            intro.style.opacity = 1
            intro.style.transform = `translateX( ${(540 + gap) / 2}px )`
            document.querySelector('#complete-puzzle').style.transform = `translate(${(appW - 580) / 2 - parseInt(fullImg.style.left) - (introW + gap) / 2}px, ${(appH - 580) / 2 - parseInt(fullImg.style.top) + 18.5}px)`
          }, 1300)
        }, 2000)
      }, 1000)
    },
    getSiblsPos(e) {
      let puzzles = document.querySelectorAll('.puzzle')
      let combinePuzzles = JSON.parse(`[${e.currentTarget.getAttribute('data-combine')}]`)
      let xNum = this.puzzleData.xNum
      combinePuzzles.forEach(el => {
        let top = puzzles[el].offsetTop
        let left = puzzles[el].offsetLeft
        this.siblsIdxArr[el].forEach(element => {
          switch (element - el) {
            case xNum:
              if (Math.abs(puzzles[element].offsetTop - top - 144) < 8 &&
                Math.abs(puzzles[element].offsetLeft - left) < 8) {
                this.combine(element, el, puzzles, -144, 0)
              }
              break
            case 1:
              if (Math.abs(puzzles[element].offsetTop - top) < 8 &&
                Math.abs(puzzles[element].offsetLeft - left - 144) < 8) {
                this.combine(element, el, puzzles, 0, -144)
              }
              break
            case -1:
              if (Math.abs(puzzles[element].offsetTop - top) < 8 &&
                Math.abs(puzzles[element].offsetLeft - left + 144) < 8) {
                this.combine(element, el, puzzles, -0, 144)
              }
              break
            case -xNum:
              if (Math.abs(puzzles[element].offsetTop - top + 144) < 8 &&
                Math.abs(puzzles[element].offsetLeft - left) < 8) {
                this.combine(element, el, puzzles, 144, 0)
              }
              break
          }
        })
      })
      let combinePuzzlesUpdate = JSON.parse(`[${e.currentTarget.getAttribute('data-combine')}]`)
      if (combinePuzzlesUpdate.length == 9) {
        this.complete()
      }
    },
    reset() {
      let num = this.puzzleData.xNum * this.puzzleData.yNum
      let appW = document.getElementById('app').scrollWidth
      let appH = document.getElementById('app').scrollHeight
      this.zIndex = 10
      this.siblsIdxArr = []
      this.isClear = false
      this.isComplete = false
      for (let i = 0; i < num; i++) {
        let puzzle = document.querySelectorAll('.puzzle')[i]
        let puzzleW = puzzle.offsetWidth
        let puzzleH = puzzle.offsetHeight
        let top = 100 + (((appH - puzzleH) - 200) * Math.random())
        let left = (appW - puzzleW) * Math.random()
        let zIdx = Math.floor(Math.random() * 10)
        puzzle.style.top = top + 'px'
        puzzle.style.left = left + 'px'
        puzzle.style.zIndex = zIdx
        puzzle.style.opacity = 1
      }
      this.setData()
      this.getSiblsIdxArr()
    },
    checkPuzzle() {
      if (document.querySelector('.puzzle') == null) {
        setTimeout(() => {
          this.checkPuzzle()
        }, 100)
      } else {
        this.reset()
        this.getSiblsIdxArr()
        this.setData()
      }
    },
    playAgain() {
      this.isClear = false
      this.isComplete = false
      document.querySelector('#complete-puzzle').style.transform = 'scale(.8)'
      document.querySelector('#intro').style.transform = ''
      this.checkPuzzle()
    },
  },
  mounted() {
    this.reset()
    this.getSiblsIdxArr()
    this.setData()
  },
  directives: {
    drag(el) {
      el.onmousedown = function (e) {
        e.stopPropagation()
        let puzzles = document.querySelectorAll('.puzzle')
        let combinePuzzles = []
        combinePuzzles = JSON.parse(`[${el.getAttribute('data-combine')}]`)
        let combineLen = combinePuzzles.length
        let filtedArr = []
        for (let i = 0; i < combineLen; i++) {                            //刪除combinePuzzles內重複的項目
          for (let j = i + 1; j < combineLen; j++) {
            if (combinePuzzles[i] == combinePuzzles[j]) {
              j = ++i
            }
          }
          filtedArr.push(combinePuzzles[i])
        }
        let dist = []
        let appW = document.getElementById('app').scrollWidth
        let appH = document.getElementById('app').scrollHeight
        let puzzleH = el.offsetHeight
        let puzzleW = el.offsetWidth
        let filtedLeng = filtedArr.length
        for (let i = 0; i < filtedLeng; i++) {
          let index = filtedArr[i]
          dist.push({
            x: e.clientX - puzzles[index].offsetLeft,
            y: e.clientY - puzzles[index].offsetTop
          })
        }
        document.onmousemove = function (e) {
          e.preventDefault()
          let inRange = true
          for (let i = 0; i < filtedLeng; i++) {
            if (e.clientX - dist[i].x < 0 || appW - e.clientX + dist[i].x - puzzleW < 0 ||
              e.clientY - dist[i].y < 0 || appH - e.clientY + dist[i].y - puzzleH < 0) {
              inRange = false
              break
            }
          }
          if (inRange) {
            for (let i = 0; i < filtedLeng; i++) {
              let index = filtedArr[i]
              puzzles[index].style.left = e.clientX - dist[i].x + 'px'
              puzzles[index].style.top = e.clientY - dist[i].y + 'px'
            }
          }
        }
        document.onmouseup = function () {
          document.onmousemove = null
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import 'sass/main';

#app {
  width: 100vw;
  height: 100vh;
}
</style>
