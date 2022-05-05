(function () {
    "use script"
    function getAge(birthdayRec) {
        let birthday = new Date(birthdayRec)
        let today = new Date()
        let age = today.getFullYear() - birthday.getFullYear()

        if (birthday.getMonth() > today.getMonth()) {
            age -= 1
        }
        if (birthday.getMonth() === today.getMonth() && birthday.getDate() > today.getDate()) {
            age -= 1
        }
        return age
    }


    kintone.events.on('app.record.index.show', function (event) {
        let birthdays = kintone.app.getFieldElements('生年月日')
        let age = ""

        birthdays.forEach(birthday => {
            if (birthday.innerText) {
                age = getAge(birthday.innerText)
                birthday.innerText = `${birthday.innerText} / ${age}歳`
                birthday.id = 'birthday_age'
            }
        })
    })


    kintone.events.on("app.record.detail.show", function (event) {
        let birthdayRec = event.record.生年月日.value
        let age = ""
        let ageField = kintone.app.record.getSpaceElement("age_field")
        ageField.id = "age_field"

        if (birthdayRec) {
           age = getAge(birthdayRec)
        }
        ageField.innerText = `${age}歳`
    })
})()