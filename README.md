Vue Puzzle
===
資料定義
---
```JS
拼圖資料；
puzzleData: {
  'name': '作品標題',
  'xNum': 拼圖x軸個數,
  'yNum': 拼圖y軸個數,
  'bgImgUrl': '背景圖片路徑',
  'puzzleUrl': '拼圖路徑前綴',
  'puzzlePos': [拼圖的絕對定位],
  'fullName': '作品全名',
  'author': '作者',
  'age': '作品年代',
  'inform': '作品資料',
}
```
結合的拼圖紀錄：
```JS
data-combine
```
相鄰的拼圖索引紀錄：
```JS
siblsIdxArr: []
```
directives
---
定義拼圖拖動：
```JS
drag(el,binding) {
    el.onmousedown=function(e){
        e.stopPropagation();
        let puzzles = document.querySelectorAll('.puzzle');
        let combinePuzzles = [];
        combinePuzzles = JSON.parse(`[${el.getAttribute('data-combine')}]`);        //獲取已拼接的拼圖索引
        let combineLen = combinePuzzles.length;
        let filtedArr = [];
        for(i=0; i<combineLen; i++){        //刪除combinePuzzles內重複的項目
            for(j=i+1; j<combineLen; j++){
                if(combinePuzzles[i] == combinePuzzles[j]){
                    j = ++i
                };
            };
            filtedArr.push(combinePuzzles[i]);
        };
        let dist = [];
        let windowW = document.body.clientWidth;
        let windowH = document.body.clientHeight;
        let puzzleH = el.offsetHeight;
        let puzzleW = el.offsetWidth;
        let filtedLeng = filtedArr.length;
        for(i=0; i<filtedLeng; i++){
            let index = filtedArr[i];
            dist.push({
                x: e.clientX - puzzles[index].offsetLeft,
                y: e.clientY - puzzles[index].offsetTop
            })
        };
        document.onmousemove = function (e){
            e.preventDefault();
            let inRange = true;
            for(i=0; i<filtedLeng; i++){
                if(e.clientX - dist[i].x<0 || windowW - e.clientX + dist[i].x - puzzleW<0 || 
                e.clientY - dist[i].y<0 || windowH - e.clientY + dist[i].y - puzzleH<0){
                    inRange = false;
                    break
                }
            };
            if(inRange){        //確認不會超出視窗後讓所有已拼接的拼圖隨著滑鼠移動
                for(i=0; i<filtedLeng; i++){
                    let index = filtedArr[i];
                    puzzles[index].style.left = e.clientX - dist[i].x + 'px';
                    puzzles[index].style.top = e.clientY - dist[i].y + 'px';
                }
            };
        }
        document.onmouseup = function(){
            document.onmousemove = null;
        }
    }
}
```
確認拼圖位置
---
```JS
getSiblsPos(e){
    let puzzles = document.querySelectorAll('.puzzle');
    let combinePuzzles = JSON.parse(`[${e.currentTarget.getAttribute('data-combine')}]`);
    let xNum = this.puzzleData.xNum;
    let yNum = this.puzzleData.yNum;
    combinePuzzles.forEach( el => {       //需確認每個已拼接的拼圖位置
        let top = puzzles[el].offsetTop;
        let left = puzzles[el].offsetLeft;
        this.siblsIdxArr[el].forEach( element => {
            switch(element - el){       //確認使否與新的拼圖拼接
                case xNum:
                    if(Math.abs(puzzles[element].offsetTop - top - 144) < 8 && 
                    Math.abs(puzzles[element].offsetLeft - left) <8){
                        this.combine(element, el, puzzles, -144, 0);
                    }
                case 1:
                    if(Math.abs(puzzles[element].offsetTop - top) < 8 && 
                    Math.abs(puzzles[element].offsetLeft - left - 144) <8){
                        this.combine(element, el, puzzles, 0, -144);
                    }
                    break
                case -1:
                    if(Math.abs(puzzles[element].offsetTop - top) < 8 && 
                    Math.abs(puzzles[element].offsetLeft - left + 144) <8){
                        this.combine(element, el, puzzles, -0, 144);
                    }
                    break
                case -xNum:
                    if(Math.abs(puzzles[element].offsetTop - top + 144) < 8 && 
                    Math.abs(puzzles[element].offsetLeft - left) <8){
                        this.combine(element, el, puzzles, 144, 0);
                    }
                    break
            }
        })
    });
    let combinePuzzlesUpdate = JSON.parse(`[${e.currentTarget.getAttribute('data-combine')}]`);       //確認是否全數拼圖已拼接
    if(combinePuzzlesUpdate.length == 9){
        this.complete();
    };
}
```
拼圖結合
---
拼接
```JS
combinePuzzle(el1, el2, els, topIncr, leftIncr, idxArr1, idxArr2) {
    let top1 = parseInt(el1.style.top);
    let left1 = parseInt(el1.style.left);
    let top2 = parseInt(el2.style.top);
    let left2 = parseInt(el2.style.left);
    let posDiff = [];
    let length = idxArr2.length;
    idxArr2.forEach(el => {
        posDiff.push({
            top: parseInt(els[el].style.top) - top2,
            left: parseInt(els[el].style.left) - left2
        })
    });
    for(i=0; i<length; i++){        //將全數已拼接拼圖移動，拚上新的拼圖
        let index = idxArr2[i];
        els[index].style.top = top1 + topIncr + posDiff[i].top + 'px';
        els[index].style.left = left1 + leftIncr + posDiff[i].left + 'px';
    };
    idxArr1.forEach(el => {       //將拼接上的拼圖索引從相鄰索引上去除，避免重複觸發拼接發光動畫
        els[el].classList.add('box-shadow');
        setTimeout(() => {
            els[el].classList.remove('box-shadow')
        }, 500);
    });
    idxArr2.forEach(el => {
        els[el].classList.add('box-shadow');
        setTimeout(() => {
            els[el].classList.remove('box-shadow')
        }, 500);
    });
}

data合併:
```JS
combineData(el1, el2, els){
    let str = `${el1.getAttribute('data-combine')}, ${el2.getAttribute('data-combine')}`;       //合併拼接雙方的已拼接索引
    let idxArr1 = JSON.parse(`[${el1.getAttribute('data-combine')}]`);
    let idxArr2 = JSON.parse(`[${el2.getAttribute('data-combine')}]`);
    let length1 = idxArr1.length;
    let length2 = idxArr2.length;
    for(i=0; i<length1; i++){       //將合併後的索引寫入
        let index = idxArr1[i];
        els[index].setAttribute('data-combine', str);
    };
    for(i=0; i<length2; i++){
        let index = idxArr2[i];
        els[index].setAttribute('data-combine', str);
    };
}
``
拼圖z-index
---
```JS
changeZIdx(e) {
    let puzzles = document.querySelectorAll('.puzzle');
    let combinePuzzles = JSON.parse(`[${puzzles[[...puzzles].indexOf(e.currentTarget)].getAttribute('data-combine')}]`);
    combinePuzzles.forEach(el => {        \\讓所有拼接拼圖的z-index改變，至於最上層
        puzzles[el].style.zIndex = this.zIndex;
    });
    this.zIndex++;
}
```
