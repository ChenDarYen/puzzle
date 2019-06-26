<template>
  <div id="app">
    <div class="bg-blur" :style="{backgroundImage: `url(${puzzleData.bgImgUrl})`}" />
    <template v-if="!isClear">
      <div id="title" :style="{'z-index': zIndex+1}" key="0">
        <h1>請完成這幅《{{ puzzleData.name }}》</h1>
      </div>
      <button id="reset" @click="reset" :style="{'z-index': zIndex+1}" key="1">
        重新排列
      </button>
    </template>
    <div id="puzzle-content" v-if="!isComplete" key="2">
      <div class="puzzle" data-combine=""
        v-for="(pos, idx) in puzzleData.puzzlePos" :key="idx + 10" v-drag
        @mousedown="changeZIdx" @mouseup="getSiblsPos">
        <img :src="puzzleImg(idx)"
          :style="{position:'absolute', top: `${pos.y}px`, left: `${pos.x}px`}">
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
        <p v-for="(artical, index) in puzzleData.inform" :key="index">
          {{ artical }}
        </p>
      </div>
      <button class="again" @click="playAgain">
        在玩一次
      </button>
    </div>
  </div>
</template>

<script>
export default {
  directives: {
    drag (el) {
      el.onmousedown = (e) => {
        e.stopPropagation()
        const puzzles = document.querySelectorAll('.puzzle')
        let combinePuzzles = []
        combinePuzzles = JSON.parse(`[${el.getAttribute('data-combine')}]`)
        const combineLen = combinePuzzles.length
        const filtedArr = []
        // 刪除combinePuzzles內重複的項目
        for (let i = 0; i < combineLen; i++) {
          for (let j = i + 1; j < combineLen; j++) {
            if (combinePuzzles[i] === combinePuzzles[j]) {
              i += 1
              j = i
            }
          }
          filtedArr.push(combinePuzzles[i])
        }
        const dist = []
        const appW = document.getElementById('app').scrollWidth
        const appH = document.getElementById('app').scrollHeight
        const puzzleH = el.offsetHeight
        const puzzleW = el.offsetWidth
        const filtedLeng = filtedArr.length
        for (const puzzleIdx of filtedArr) {
          dist.push({
            x: e.clientX - puzzles[puzzleIdx].offsetLeft,
            y: e.clientY - puzzles[puzzleIdx].offsetTop,
          })
        }
        document.onmousemove = (e) => {
          e.preventDefault()
          let inRange = true
          for (let i = 0; i < filtedLeng; i++) {
            if (e.clientX - dist[i].x < 0 || appW - e.clientX + dist[i].x - puzzleW < 0
              || e.clientY - dist[i].y < 0 || appH - e.clientY + dist[i].y - puzzleH < 0) {
              inRange = false
              break
            }
          }
          if (inRange) {
            for (const [i, puzzleIdx] of filtedArr.entries()) {
              puzzles[puzzleIdx].style.left = `${e.clientX - dist[i].x}px`
              puzzles[puzzleIdx].style.top = `${e.clientY - dist[i].y}px`
            }
          }
        }
        document.onmouseup = () => {
          document.onmousemove = null
        }
      }
    },
  },
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
            x: 0,
          },
          {
            y: 0,
            x: -27,
          },
          {
            y: 0,
            x: 0,
          },
          {
            y: 0,
            x: 0,
          },
          {
            y: -27,
            x: 0,
          },
          {
            y: 0,
            x: -27,
          },
          {
            y: -27,
            x: 0,
          },
          {
            y: 0,
            x: -27,
          },
          {
            y: -27,
            x: 0,
          },
        ],
        fullName: '清本院清明上河圖',
        author: '陳枚、孫祜、金昆、戴洪、程志道',
        age: '清高宗乾隆元年（1736）',
        inform: ['宋張澤端（活動於西元十二世紀前期）「清明上河圖」是畫史中寫實風俗畫的一件傑作，歷代臨仿者甚多，在故宮即藏有七種不同的本子，其中就屬清院本「清明上河圖」最為有名。', '此卷為乾隆元年（一七三六）由宮廷畫院畫師陳枚、孫祜、金昆、戴洪、程志道等五人合繪。 此卷設色鮮麗，用筆圓熟，界畫橋樑、屋宇及人物皆十分細膩嚴謹，是院畫中之極精者。所畫事物甚多，雖失去了宋代古制，但也足以代表明清之際北京風物。'],
      },
    }
  },
  mounted () {
    this.reset()
    this.getSiblsIdxArr()
    this.setData()
  },
  methods: {
    puzzleImg (idx) {
      const img = require(`${this.puzzleData.puzzleUrl}${idx + 1}.png`)
      return img
    },
    getSiblsIdxArr () {
      let siblsIdx = []
      const { xNum } = this.puzzleData
      const num = this.puzzleData.xNum * this.puzzleData.yNum
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
        siblsIdx = siblsIdx.filter(el => (el >= 0 && el < num))
        this.siblsIdxArr.push(siblsIdx)
      }
    },
    setData () {
      const puzzles = document.querySelectorAll('.puzzle')
      for (const [index, puzzle] of Object.entries(puzzles)) {
        puzzle.setAttribute('data-combine', index)
      }
    },
    changeZIdx (e) {
      const puzzles = document.querySelectorAll('.puzzle')
      const combinePuzzles = JSON.parse(`[${puzzles[[...puzzles].indexOf(e.currentTarget)].getAttribute('data-combine')}]`)
      for (const puzzleIdx of combinePuzzles) {
        puzzles[puzzleIdx].style.zIndex = this.zIndex
      }
      this.zIndex += 1
    },
    combine (idx1, idx2, els, topIncr, leftIncr) {
      const el1 = els[idx1]
      const el2 = els[idx2]
      const { siblsIdxArr } = this
      const combineArr1 = JSON.parse(`[${el1.getAttribute('data-combine')}]`)
      const combineArr2 = JSON.parse(`[${el2.getAttribute('data-combine')}]`)
      for (const puzzleI of combineArr1) {
        for (const puzzleJ of combineArr2) {
          if (siblsIdxArr[puzzleI].indexOf(puzzleJ) >= 0) {
            siblsIdxArr[puzzleI].splice(siblsIdxArr[puzzleI].indexOf(puzzleJ), 1)
          }
          if (siblsIdxArr[puzzleJ].indexOf(puzzleI) >= 0) {
            siblsIdxArr[puzzleJ].splice(siblsIdxArr[puzzleJ].indexOf(puzzleI), 1)
          }
        }
      }
      this.combinePuzzle(el1, el2, els, topIncr, leftIncr, combineArr1, combineArr2)
      this.combineData(el1, el2, els)
    },
    combinePuzzle (el1, el2, els, topIncr, leftIncr, idxArr1, idxArr2) {
      const top1 = parseInt(el1.style.top, 10)
      const left1 = parseInt(el1.style.left, 10)
      const top2 = parseInt(el2.style.top, 10)
      const left2 = parseInt(el2.style.left, 10)
      const posDiff = []
      for (const elIdx of idxArr2) {
        posDiff.push({
          top: parseInt(els[elIdx].style.top, 10) - top2,
          left: parseInt(els[elIdx].style.left, 10) - left2,
        })
      }
      for (const [i, elIdx] of idxArr2.entries()) {
        els[elIdx].style.top = `${top1 + topIncr + posDiff[i].top}px`
        els[elIdx].style.left = `${left1 + leftIncr + posDiff[i].left}px`
      }
      for (const elIdx of idxArr1) {
        els[elIdx].classList.add('box-shadow')
        setTimeout(() => {
          els[elIdx].classList.remove('box-shadow')
        }, 500)
      }
      for (const elIdx of idxArr2) {
        els[elIdx].classList.add('box-shadow')
        setTimeout(() => {
          els[elIdx].classList.remove('box-shadow')
        }, 500)
      }
    },
    combineData (el1, el2, els) {
      const str = `${el1.getAttribute('data-combine')}, ${el2.getAttribute('data-combine')}`
      const idxArr1 = JSON.parse(`[${el1.getAttribute('data-combine')}]`)
      const idxArr2 = JSON.parse(`[${el2.getAttribute('data-combine')}]`)
      for (const elIdx of idxArr1) {
        els[elIdx].setAttribute('data-combine', str)
      }
      for (const elIdx of idxArr2) {
        els[elIdx].setAttribute('data-combine', str)
      }
    },
    complete () {
      setTimeout(() => {
        const firstPuzzle = document.querySelector('.puzzle')
        const fullImg = document.querySelector('#complete-puzzle')
        const title = document.querySelector('#title')
        const reset = document.querySelector('#reset')
        const appW = document.getElementById('app').scrollWidth
        const appH = document.getElementById('app').scrollHeight
        this.isComplete = true
        fullImg.style.top = `${parseInt(firstPuzzle.style.top, 10) + 18.5}px`
        fullImg.style.left = `${parseInt(firstPuzzle.style.left, 10) + 18.5}px`
        fullImg.style.transform = `translate(${(appW - 580) / 2 - parseInt(fullImg.style.left, 10)}px, ${(appH - 580) / 2 - parseInt(fullImg.style.top, 10) + 18.5}px)`
        title.style.opacity = 0
        reset.style.opacity = 0
        setTimeout(() => {
          this.isClear = true
          document.querySelector('.picture').classList.add('box-shadow')
          setTimeout(() => {
            const intro = document.querySelector('#intro')
            const introW = intro.offsetWidth
            const gap = 30
            intro.style.opacity = 1
            intro.style.transform = `translateX( ${(540 + gap) / 2}px )`
            document.querySelector('#complete-puzzle').style.transform = `translate(${(appW - 580) / 2 - parseInt(fullImg.style.left, 10) - (introW + gap) / 2}px, ${(appH - 580) / 2 - parseInt(fullImg.style.top, 10) + 18.5}px)`
          }, 1300)
        }, 2000)
      }, 1000)
    },
    getSiblsPos (e) {
      const puzzles = document.querySelectorAll('.puzzle')
      const combinePuzzles = JSON.parse(`[${e.currentTarget.getAttribute('data-combine')}]`)
      const { xNum } = this.puzzleData
      for (const puzzleI of combinePuzzles) {
        const top = puzzles[puzzleI].offsetTop
        const left = puzzles[puzzleI].offsetLeft
        for (const puzzleJ of this.siblsIdxArr[puzzleI]) {
          switch (puzzleJ - puzzleI) {
            case xNum:
              if (Math.abs(puzzles[puzzleJ].offsetTop - top - 144) < 8
                && Math.abs(puzzles[puzzleJ].offsetLeft - left) < 8) {
                this.combine(puzzleJ, puzzleI, puzzles, -144, 0)
              }
              break
            case 1:
              if (Math.abs(puzzles[puzzleJ].offsetTop - top) < 8
                && Math.abs(puzzles[puzzleJ].offsetLeft - left - 144) < 8) {
                this.combine(puzzleJ, puzzleI, puzzles, 0, -144)
              }
              break
            case -1:
              if (Math.abs(puzzles[puzzleJ].offsetTop - top) < 8
                && Math.abs(puzzles[puzzleJ].offsetLeft - left + 144) < 8) {
                this.combine(puzzleJ, puzzleI, puzzles, -0, 144)
              }
              break
            case -xNum:
              if (Math.abs(puzzles[puzzleJ].offsetTop - top + 144) < 8
                && Math.abs(puzzles[puzzleJ].offsetLeft - left) < 8) {
                this.combine(puzzleJ, puzzleI, puzzles, 144, 0)
              }
              break
            default:
          }
        }
      }
      const combinePuzzlesUpdate = JSON.parse(`[${e.currentTarget.getAttribute('data-combine')}]`)
      if (combinePuzzlesUpdate.length === 9) {
        this.complete()
      }
    },
    reset () {
      const num = this.puzzleData.xNum * this.puzzleData.yNum
      const appW = document.getElementById('app').scrollWidth
      const appH = document.getElementById('app').scrollHeight
      this.zIndex = 10
      this.siblsIdxArr = []
      this.isClear = false
      this.isComplete = false
      for (let i = 0; i < num; i++) {
        const puzzle = document.querySelectorAll('.puzzle')[i]
        const puzzleW = puzzle.offsetWidth
        const puzzleH = puzzle.offsetHeight
        const top = 100 + (((appH - puzzleH) - 200) * Math.random())
        const left = (appW - puzzleW) * Math.random()
        const zIdx = Math.floor(Math.random() * 10)
        puzzle.style.top = `${top}px`
        puzzle.style.left = `${left}px`
        puzzle.style.zIndex = zIdx
        puzzle.style.opacity = 1
      }
      this.setData()
      this.getSiblsIdxArr()
    },
    checkPuzzle () {
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
    playAgain () {
      this.isClear = false
      this.isComplete = false
      document.querySelector('#complete-puzzle').style.transform = 'scale(.8)'
      document.querySelector('#intro').style.transform = ''
      this.checkPuzzle()
    },
  },
}
</script>

<style lang="scss">
@import 'sass/main';

#app {
  width: 100vw;
  height: 100vh;
}
</style>
