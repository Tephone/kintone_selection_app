(function () {
    'use script'

    function getExpirationDate(startDateString) {
        const startDate = new Date(startDateString)
        const expirationDate = new Date(startDate.setFullYear(startDate.getFullYear() + 10))
        return `${expirationDate.getFullYear()}-${expirationDate.getMonth() + 1}-${expirationDate.getDate()}`
    }

    kintone.events.on(['app.record.create.show', 'app.record.edit.show'], function (event) {
        const tableRecs = event.record.契約情報.value
        tableRecs.forEach(rec => {
            rec.value.契約終了日.disabled = true
        })
        return event
    })

    kintone.events.on(['app.record.create.change.契約情報', 'app.record.edit.change.契約情報'], function (event) {
        if (event.changes.row) {
            event.changes.row.value.契約終了日.disabled = true
        }
        return event
    })

    kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function (event) {
        const tableRecs = event.record.契約情報.value
        tableRecs.forEach(rec => {
            if (rec.value.更新日.value) {
                let expirationDate = getExpirationDate(rec.value.更新日.value)
                rec.value.契約終了日.value = expirationDate
            }
        })
        return event
    })
})()