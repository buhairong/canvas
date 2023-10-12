let width = 1024
let height = 768
let radius = 8
let marginTop = 60
let marginLeft = 30

let endTime = new Date()
endTime.setTime(endTime.getTime() + 36000*1000)

let curShowTimeSeconds = 0
const balls = []
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function () {
  width = document.body.clientWidth
  height = document.body.clientHeight
  marginLeft = Math.round(width / 10)
  marginTop = Math.round(height / 5)
  radius = Math.round(width * 4 / 5 / 108) - 1

  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  curShowTimeSeconds = getCurrentShowTimeSeconds()

  setInterval(function () {
    render(context)
    update()
  }, 50)
  
}

function getCurrentShowTimeSeconds() {
  const curTime = new Date().getTime()
  let ret = endTime - curTime
  ret = Math.round(ret / 1000)
  return ret >= 0 ? ret : 0
}

function update() {
  const nextShowTimeSeconds = getCurrentShowTimeSeconds()
  const nextHours = parseInt(nextShowTimeSeconds / 3600)
  const nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60)
  const nextSeconds = nextShowTimeSeconds % 60

  const curHours = parseInt(curShowTimeSeconds / 3600)
  const curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60)
  const curSeconds = curShowTimeSeconds % 60

  if (nextSeconds !== curSeconds) {
    curShowTimeSeconds = nextShowTimeSeconds

    if (parseInt(curHours / 10) !== parseInt(nextHours / 10)) {
      addBalls(marginLeft+0, marginTop, parseInt(curHours / 10))
    }
    if (parseInt(curHours % 10) !== parseInt(nextHours % 10)) {
      addBalls(marginLeft+15*(radius+1), marginTop, parseInt(curHours % 10))
    }

    if (parseInt(curMinutes / 10) !== parseInt(nextMinutes / 10)) {
      addBalls(marginLeft+39*(radius+1), marginTop, parseInt(curMinutes / 10))
    }
    if (parseInt(curMinutes % 10) !== parseInt(nextMinutes % 10)) {
      addBalls(marginLeft+54*(radius+1), marginTop, parseInt(curMinutes % 10))
    }

    if (parseInt(curSeconds / 10) !== parseInt(nextSeconds / 10)) {
      addBalls(marginLeft+78*(radius+1), marginTop, parseInt(curSeconds / 10))
    }
    if (parseInt(curSeconds % 10) !== parseInt(nextSeconds % 10)) {
      addBalls(marginLeft+93*(radius+1), marginTop, parseInt(curSeconds % 10))
    }
  }

  updateBalls()
}

function updateBalls() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i]
    ball.x += ball.vx
    ball.y += ball.vy
    ball.vy += ball.g

    if (ball.y >= height - radius) {
      ball.y = height - radius
      ball.vy = -ball.vy * 0.75
    }
  }

  let cnt = 0
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i]
    if (ball.x + radius > 0 && ball.x - radius < width) {
      balls[cnt++] = ball
    }
  }

  while (balls.length > Math.min(200, cnt)) {
    balls.pop()
  }
}

function addBalls(x, y, num) {
  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] === 1) {
        const ball = {
          x: x+j*2*(radius+1)+(radius+1),
          y: y+i*2*(radius+1)+(radius+1),
          g: 1.5 + Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random()*1000)) * 4,
          vy: -5,
          color: colors[Math.floor(Math.random()*colors.length)]
        }
        balls.push(ball)
      }
    }
  }
}

function render(cxt) {
  cxt.clearRect(0, 0, width, height)

  const hours = parseInt(curShowTimeSeconds / 3600)
  const minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60)
  const seconds = curShowTimeSeconds % 60

  renderDigit(marginLeft, marginTop, parseInt(hours / 10), cxt)
  renderDigit(marginLeft + 15 * (radius + 1), marginTop, parseInt(hours % 10), cxt)
  renderDigit(marginLeft + 30 * (radius + 1), marginTop, 10, cxt)

  renderDigit(marginLeft + 39 * (radius + 1), marginTop, parseInt(minutes / 10), cxt)
  renderDigit(marginLeft + 54 * (radius + 1), marginTop, parseInt(minutes % 10), cxt)
  renderDigit(marginLeft + 69 * (radius + 1), marginTop, 10, cxt)

  renderDigit(marginLeft + 78 * (radius + 1), marginTop, parseInt(seconds / 10), cxt)
  renderDigit(marginLeft + 93 * (radius + 1), marginTop, parseInt(seconds % 10), cxt)

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i]
    cxt.fillStyle = ball.color
    cxt.beginPath()
    cxt.arc(ball.x, ball.y, radius, 0, 2*Math.PI)
    cxt.closePath()
    cxt.fill()
  }
}

function renderDigit(x, y, num, cxt) {
  cxt.fillStyle = 'rgb(0, 102, 153)'

  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][i].length; j++) {
      if (digit[num][i][j] === 1) {
        cxt.beginPath()
        cxt.arc(x+j*2*(radius+1)+(radius+1), y+i*2*(radius+1)+(radius+1), radius, 0, 2*Math.PI)
        cxt.closePath()
        cxt.fill()
      }
    }
  }
}