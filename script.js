document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
      'tomato',
      'red',
      'purple',
      '#9df511',
      'blue'
    ]
  
    //los bloques
    const lTetromino = [
      [1, width+1, width*2+1, 2],
      [width, width+1, width+2, width*2+2],
      [1, width+1, width*2+1, width*2],
      [width, width*2, width*2+1, width*2+2]
    ]
  
    const zTetromino = [
      [0,width,width+1,width*2+1],
      [width+1, width+2,width*2,width*2+1],
      [0,width,width+1,width*2+1],
      [width+1, width+2,width*2,width*2+1]
    ]
  
    const tTetromino = [
      [1,width,width+1,width+2],
      [1,width+1,width+2,width*2+1],
      [width,width+1,width+2,width*2+1],
      [1,width,width+1,width*2+1]
    ]
  
    const oTetromino = [
      [0,1,width,width+1],
      [0,1,width,width+1],
      [0,1,width,width+1],
      [0,1,width,width+1]
    ]
  
    const iTetromino = [
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3],
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3]
    ]
  
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
  
    let currentPosition = 4
    let currentRotation = 0
  
    console.log(theTetrominoes[0][0])
  
    //seleccionar aleatoriamente un bloque y su primera rotación
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
  
    //dibujar bloque
    function draw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
      })
    }
  
    //Eliminar bloques
    function undraw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
  
      })
    }
  
    //asignar funciones a los keyCodes
    function control(e) {
      if(e.keyCode === 37) {
        moveLeft()
      } else if (e.keyCode === 38) {
        rotate()
      } else if (e.keyCode === 39) {
        moveRight()
      } else if (e.keyCode === 40) {
        moveDown()
      }
    }
    document.addEventListener('keyup', control)
  
    //función de desplazamiento hacia abajo
    function moveDown() {
      undraw()
      currentPosition += width
      draw()
      freeze()
    }
  
    //function para pause
    function freeze() {
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //iniciar nueva caida de bloque
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
      }
    }
  
    //mover el bloque a la izquierda, a menos que esté en el borde o haya un bloqueo
    function moveLeft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
      if(!isAtLeftEdge) currentPosition -=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }
      draw()
    }
  
    //mueve el bloqueo a la derecha, a menos que esté en el borde o haya un bloqueo
    function moveRight() {
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
      if(!isAtRightEdge) currentPosition +=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
      draw()
    }
  
    
    ///FIJAR LA ROTACIÓN DE LOS TETROMINÓS 
    function isAtRight() {
      return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
    
    function isAtLeft() {
      return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(P){
      P = P || currentPosition       //obtener la posición actual.  Luego, comprueba si la pieza está cerca del lado izquierdo.
      if ((P+1) % width < 4) {         //añade 1 porque el índice de posición puede ser 1 menos que donde está la pieza (con la forma en que están indexados).     
        if (isAtRight()){            //usar la posición actual para comprobar si se ha volcado a la derecha
          currentPosition += 1    //si es así, añade uno para envolverlo de nuevo
          checkRotatedPosition(P) //comprobar de nuevo.  Pasar la posición desde el principio, ya que el bloque largo podría necesitar moverse más.
          }
      }
      else if (P % width > 5) {
        if (isAtLeft()){
          currentPosition -= 1
        checkRotatedPosition(P)
        }
      }
    }
    
    /* DAr rotacion al bloque */
    function rotate() {
      undraw()
      currentRotation ++
      if(currentRotation === current.length) { 
        currentRotation = 0
      }
      current = theTetrominoes[random][currentRotation]
      checkRotatedPosition()
      draw()
    }
    
    /* Esta seccion es para el recuadro pequeño del tetris */
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 4
  
  
    /* funcionalidad a los bloque sin rotaciones */
    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, 2], 
      [0, displayWidth, displayWidth+1, displayWidth*2+1], 
      [1, displayWidth, displayWidth+1, displayWidth+2], 
      [0, 1, displayWidth, displayWidth+1], 
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] 
    ]
  
    
    function displayShape() {
      /* Eliminar los bloques */
      displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
      })
      upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
      })
    }

    //Funcionalidad a la velacidad de movimiento
    startBtn.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      } else {
        draw()
        timerId = setInterval(moveDown, 600)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
      }
    })
  
    /* Dar funcionalidad al score */
    function addScore() {
      for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  
        if(row.every(index => squares[index].classList.contains('taken'))) {
          score +=10
          scoreDisplay.innerHTML = score
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }
  
    
    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Perdiste'
        clearInterval(timerId)
      }
    }
  
  })