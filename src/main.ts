import "./style.css"
import Phaser from "phaser"

const sizes = {
  width: 500,
  height: 500,
}

const speedDown = 300

class GameScene extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined
  cursor: Phaser.Types.Input.Keyboard.CursorKeys | undefined
  playerSpeed
  target!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  points: number
  textScore: Phaser.GameObjects.Text | undefined
  textTime: Phaser.GameObjects.Text | undefined
  timedEvent: Phaser.Time.TimerEvent | undefined
  remainingTime: number | undefined
  coinMusic:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
    | undefined
  bgMusic:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound
    | undefined

  constructor() {
    super("scene-game")
    this.playerSpeed = speedDown + 50
    this.points = 0
  }

  preload() {
    this.load.image("bg", "assets/bg.png")
    this.load.image("basket", "assets/basket.png")
    this.load.image("apple", "assets/apple.png")
    this.load.audio("coin", "assets/audio/coin.mp3")
    this.load.audio("bgMusic", "assets/audio/bgMusic.mp3")
  }

  create() {
    this.coinMusic = this.sound.add("coinMusic")
    this.bgMusic = this.sound.add("bgMusic")
    this.bgMusic.play()

    this.add.image(0, 0, "bg").setOrigin(0, 0)
    this.player = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0)
    this.player.setImmovable(true)
    this.player.body.allowGravity = false
    this.player.setSize(80, 15).setOffset(10, 70)

    this.cursor = this.input.keyboard?.createCursorKeys()

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0)
    this.target.setMaxVelocity(0, speedDown)

    this.physics.add.overlap(
      this.target,
      this.player,
      this.targetHit,
      () => {},
      this,
    )

    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      color: "#000000",
    })
    this.textTime = this.add.text(10, 10, "Time Remaining: 0", {
      font: "25px Arial",
      color: "#000000",
    })

    this.timedEvent = this.time.delayedCall(3000, this.gameOver, [], this)
  }

  update() {
    const left = this.cursor?.left
    const right = this.cursor?.right

    this.remainingTime = this.timedEvent?.getRemainingSeconds()
    this.textTime?.setText(
      `Time Remaining: ${Math.round(this.remainingTime!).toString()}`,
    )

    if (left?.isDown) {
      this.player?.setVelocityX(-this.playerSpeed)
    } else if (right?.isDown) {
      this.player?.setVelocityX(this.playerSpeed)
    } else {
      this.player?.setVelocityX(0)
    }

    if (this.target.y >= sizes.height) {
      this.target.setY(0)
      this.target.setX(this.getRandomX())
    }
  }

  private getRandomX() {
    return Math.floor(Math.random() * sizes.width)
  }

  targetHit() {
    this.coinMusic?.play()
    this.target.setY(0)
    this.target.setX(this.getRandomX())
    this.points++
    this.textScore?.setText(`Score: ${this.points}`)
  }

  gameOver() {
    console.log("Game Over")
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
}

const game = new Phaser.Game(config)
