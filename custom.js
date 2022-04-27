(function () {
    "use script"
    kintone.events.on("app.record.detail.show", function (event) {
        let birthday = new Date(event.record.生年月日.value)
        let age = ""
        let today = new Date()
        let ageField = kintone.app.record.getSpaceElement("age_field")
        ageField.id = "age_field"


        if (birthday) {
            age = today.getFullYear() - birthday.getFullYear()
            if (birthday.getMonth() > today.getMonth()) {
                age -= 1
            }
            if (birthday.getMonth() === today.getMonth() && birthday.getDate() > today.getDate()) {
                age -= 1
            }
        }
        ageField.innerText = `${age}歳`
    })
})()