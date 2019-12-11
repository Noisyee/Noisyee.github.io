var stage = document.querySelector('.stage')
var buttonStart = document.querySelector('.stage .game-start button.start')
var scenceGame = document.querySelector('.stage .game')
var contentGame = document.querySelector('.stage .game .content')
var ranking = document.querySelector('.game .ranking')
var stop = document.querySelector('.game .stop')
var resurrection = document.querySelector('.game .resurrection')
var contin = document.querySelector('.game .contin')
var exit = document.querySelector('.game .exit')
var restart = document.querySelector('.game .restart')
var dead = document.querySelector('.game .dead')

var typeOurPlane = {
    path: 'our-plane.gif',
    boom: 'our-plane-boom.gif',
    w: 66,
    h: 80,
    hp: 3,
    delay: 30
}

var typeOurBullet = {
    path: 'wandou.png',
    w: 6,
    h: 14,
    speed: -5,
    hp: 1
}

var typeBuff = {
    path: 'buff.png',
    w: 25,
    h: 25,
    speed: 10,
    hp: 1
}

var typeEnemyPlaneSmall = {
    path: "enemy-plane-s.png",
    boom: 'enemy-plane-s-boom.gif',
    w: 34,
    h: 24,
    speed: 4,
    hp: 1,
    delay: 15
};

var typeEnemyPlaneMid = {
    path: "enemy-plane-m.png",
    hit: 'enemy-plane-m-hit.png',
    boom: 'enemy-plane-m-boom.gif',
    w: 46,
    h: 60,
    speed: 3,
    hp: 3,
    delay: 30
};

var typeEnemyPlaneLarge = {
    path: 'enemy-plane-l.png',
    hit: 'enemy-plane-l-hit.png',
    boom: 'enemy-plane-l-boom.gif',
    w: 110,
    h: 164,
    speed: 2,
    hp: 5,
    delay: 50
}

function Element(type, x, y) {
    this.path = type.path
    this.x = x
    this.y = y
    this.w = type.w
    this.h = type.h
    this.s = type.speed
    this.bullets = []
    this.b = type.hp
    this.hp = type.hp
    this.hit = type.hit
    this.boom = type.boom
    this.d = type.delay
    this.delay = type.delay
    this.die = false
}

Element.prototype.updateView = function () {
    this.node.style.left = this.x - this.w / 2 + 'px'
    this.node.style.top = this.y - this.h / 2 + 'px'
}

Element.prototype.draw = function () {
    this.node = document.createElement('img')
    this.node.src = game.srcPath + this.path
    contentGame.appendChild(this.node)
    this.updateView()
}

Element.prototype.move = function () {
    this.y += this.s
    this.updateView()
}

Element.prototype.createBuff = function () {
    game.buffs.forEach(function (buff, index, buffs) {
        var newBuff = new Element(typeBuff)
        newBuff.draw()
        buffs.push(newBuff)
    })
}

Element.prototype.createBullet = function () {
    game.players.forEach(function (player, index, players) {
        var newBullet = new Element(typeOurBullet, player.x - 4, player.y - 47)
        newBullet.draw()
        player.bullets.push(newBullet)
        if (player.buff == true) {
            var left = new Element(typeOurBullet, player.x - 26, player.y - 18);
            var right = new Element(typeOurBullet, player.x + 17, player.y - 18);
            left.draw();
            right.draw();
            player.bullets.push(left, right);
        }
    })
}

Element.prototype.moveAllBullets = function () {
    this.bullets.forEach(function (bullet, index, bullets) {
        bullet.move()
        if (bullet.checkTopOver()) {
            contentGame.removeChild(bullet.node)
            bullets.splice(index, 1)
        }
    });
}

Element.prototype.checkTopOver = function () {
    if (this.y < -this.h / 2) {
        return true
    }
}

Element.prototype.checkBottomOver = function () {
    if (this.y > game.scenceH + this / 2) {
        return true
    }
}

Element.prototype.checkCrash = function (other) {
    if (this.hp > 0) {
        var hCrash = Math.abs(this.x - other.x) < (this.w + other.w) / 2
        var vCrash = Math.abs(this.y - other.y) < (this.h + other.h) / 2
        return hCrash && vCrash ? true : false
    }
}

function Game() {
    this.framesFade = 0
    this.gameBgPosY = 0
    this.srcPath = './assets/images/'
    this.scenceW = window.innerWidth
    this.scenceH = window.innerHeight
    this.enemys = []
    this.players = []
    this.bulletThick = 10
    this.enemyThick = 35
    this.buffThick = 10
}

Game.prototype.moveAllEnemys = function () {
    this.enemys.forEach(function (enemy, index, enemys) {
        enemy.move()
        if (enemy.checkBottomOver()) {
            contentGame.removeChild(enemy.node)
            enemys.splice(index, 1)
        }
    })
}

Game.prototype.bgUpdate = function () {
    this.gameBgPosY++;
    scenceGame.style.backgroundPositionY = this.gameBgPosY + 'px'
}

Game.prototype.createPlayer = function () {
    var newPlayer = new Element(typeOurPlane, game.scenceW / 2, game.scenceH - typeOurPlane.h / 2)
    this.players.push(newPlayer)
    newPlayer.score = 0
    newPlayer.draw()
    document.querySelector('.game .score .player1').style.display = 'block'
}

Game.prototype.createBuff = function () {
    var randomBuff = Math.floor(Math.random() * this.scenceW)
    var newBuff = new Element(type, randomBuff, -type.h / 2)
    this.buffs.push(newBuff)
    newBuff.draw()
}

Game.prototype.createEnemy = function (type) {
    var randomNum = Math.floor(Math.random() * this.scenceW)
    var newEnemy = new Element(type, randomNum, -type.h / 2)
    this.enemys.push(newEnemy)
    newEnemy.draw()
}

Game.prototype.moveAllBullets = function () {
    this.players.forEach(function (player) {
        player.bullets.forEach(function (bullet, index, bullets) {
            bullet.move()
            if (bullet.checkTopOver()) {
                contentGame.removeChild(bullet.node)
                bullets.splice(index, 1)
            }
        })
    })
}

Game.prototype.checkAllCrash = function () {
    game.enemys.forEach(function (enemy, ie, enemys) {
        game.players.forEach(function (player, ip, players) {
            player.bullets.forEach(function (bullet, ib, bullets) {
                if (enemy.checkCrash(bullet)) {
                    enemy.hp--
                    bullet.hp--
                }
            })
            if (enemy.checkCrash(player) && !player.die) {
                enemy.hp = 0
                player.hp--
                player.die = true
                player.node.src = game.srcPath + player.boom
            }
            // game.buffs.forEach(function (buff, iu, buffs) {
            //     if (buff.checkCrash(player)) {
            //         buff.hp = 0
            //     }
            // })
        })
    })
}

Game.prototype.checkAllHp = function () {
    game.enemys.forEach(function (enemy, ie, enemys) {
        if (enemy.b > enemy.hp && enemy.hp > 0) {
            enemy.node.src = game.srcPath + enemy.hit
        } else if (enemy.hp <= 0 && !enemy.die) {
            enemy.die = true
            enemy.node.src = game.srcPath + enemy.boom
        }
    })
    game.players.forEach(function (player, ip) {
        player.bullets.forEach(function (bullet, index, bullets) {
            if (bullet.hp <= 0) {
                contentGame.removeChild(bullet.node)
                bullets.splice(index, 1)
                player.score++
                document.querySelectorAll('.game .score span')[ip].innerText = player.score
            }
        })
    })
    // game.buffs.forEach(function (buff, index, buffs) {
    //     if (buff.hp <= 0) {
    //         buff.die = true
    //         player.buff = true
    //         contentGame.removeChild(buff.node)
    //         buffs.splice(index, 1)
    //     }
    // })
}
// debugger
Game.prototype.clearAllDead = function () {
    game.enemys.forEach(function (enemy, index, enemys) {
        if (enemy.die) {
            if (enemy.delay > 0) {
                enemy.delay--
            } else {
                contentGame.removeChild(enemy.node)
                enemys.splice(index, 1)
            }
        }
    })
    game.players.forEach(function (player, ip, players) {
        if (player.die) {
            if (player.hp > 0) {
                if (player.delay > 0) {
                    player.delay--
                } else {
                    player.node.src = game.srcPath + player.path
                    player.die = false
                    player.delay = player.d
                }
            } else {
                game.gameOver()
            }
        }
    })
    // game.buffs.forEach(function (buff, iu, buffs) {
    //     if (buff.die) {
    //         player.buff = true
    //     }
    // })
}

Game.prototype.start = function () {
    this.setIntervalId = window.setInterval(function () {
        game.framesFade++
        game.bgUpdate()
        game.moveAllBullets()
        game.moveAllEnemys()
        game.checkAllCrash()
        game.checkAllHp()
        game.clearAllDead()
        if (game.framesFade % game.bulletThick === 0) {
            game.players.forEach(function (player) {
                if (!player.die) {
                    player.createBullet()
                }
            })
        }
        if (game.framesFade % game.enemyThick === 0) {
            var randomNum = Math.floor(Math.random() * 100)
            if (randomNum < 5) {
                game.createEnemy(typeEnemyPlaneLarge)
            } else if (randomNum < 20) {
                game.createEnemy(typeEnemyPlaneMid)
            } else {
                game.createEnemy(typeEnemyPlaneSmall)
            }
        }
        // if (game.framesFade % game.buffThick === 0) {
        //     game.buffs.forEach(function (buff) {
        //         buff.createBuff(typeBuff)
        //     })
        // }
    }, 30)
    this.state = 1
    ranking.style.marginTop = -ranking.offsetHeight + 'px'
    dead.style.bottom = -dead.offsetHeight + 'px'
}

Game.prototype.gameOver = function () {
    this.gameDone()
    dead.style.bottom = "100px"
}

Game.prototype.gameDone = function () {
    clearInterval(this.setIntervalId)
    this.state = 0
    document.querySelector('.ranking').style.marginTop = '100px'
}

Game.prototype.pause = function () {
    clearInterval(this.setIntervalId)
    this.state = 0
    stop.style.bottom = '300px'
    document.querySelector('.stop').style.marginTop = '200px'
}

var game

buttonStart.onclick = function () {
    stage.style.marginLeft = '-100%'
    game = new Game()
    game.createPlayer()
    game.start()
}

scenceGame.ontouchmove = function (event) {
    // console.log(event.touches[0].pageX, event.touches[0].pageY)
    game.players[0].x = event.touches[0].pageX
    game.players[0].y = event.touches[0].pageY
    game.players.forEach(function (player) {
        player.updateView()
    })
}

scenceGame.ontouchstart = function (start) {
    var startX = start.touches[0].clientX
    var startY = start.touches[0].clientY
    document.body.ontouchend = function (end) {
        var endX = end.changedTouches[0].clientX
        var endY = end.changedTouches[0].clientY
        if (startX === endX && startY === endY) {
            // if (game.state === 0) {
                // game.start()
            // } else {
                game.pause()
            // }
        }
    }
}

restart.onclick = function () {
    window.location.reload()
}

resurrection.onclick = function () {
    game.players.forEach(function (player, index, players) {
        players[index].hp = 3
    })
    dead.style.bottom = -dead.offsetHeight + 'px'
}

contin.onclick = function () {
    game.start()
    stop.style.bottom = -stop.offsetHeight + 'px'
}

exit.onclick = function () {
    window.location.reload()
}

// document.querySelectorAll()