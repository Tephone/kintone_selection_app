(function () {
    'use script'
    kintone.events.on('app.record.detail.show', function (event) {
        let pressableButton = 0
        let startTime = ''
        const randomNums = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(()=> Math.random() - 0.5)
        let timerField = kintone.app.record.getSpaceElement('timer_field')
        let gameField = kintone.app.record.getSpaceElement('game_field')
        gameField.id = 'game_field'

        randomNums.forEach(num => {
            let numButton = document.createElement('button')
            numButton.innerText = num

            numButton.onclick = function () {
                if (num === pressableButton) {
                    if (num === 0 ) {
                        startTime = Date.now()/1000
                        timerField.innerText = 'ゲームスタート！!'
                    }
                    if (num === randomNums.length - 1) {
                        const endTime = Date.now()/1000
                        let time = endTime - startTime
                        timerField.innerText = `${Math.floor(time / 60)}分${Math.floor(time % 60)}秒でゲームクリア！！`
                    }
                    this.disabled = true
                    pressableButton += 1
                }
            }
            gameField.appendChild(numButton)
        })
    })
})()