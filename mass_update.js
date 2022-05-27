(function () {
    'use script'

    function createPutRecords(records) {
        let putRecords = []
        records.forEach((record, index) => {
            putRecords[index] = {
                id: record.$id.value,
                record: {
                    コピー先: {
                        value: record.コピー元.value
                    }
                }
            }
        })
        return putRecords
    }

    kintone.events.on('app.record.index.show', function (event) {
        const massUpdateButton = document.createElement('button')
        massUpdateButton.innerText = '一括更新する'
        const updatedAppId = kintone.app.getId()

        massUpdateButton.onclick = function () {
            const paramGet = {
                'app': updatedAppId,
                'query': kintone.app.getQuery()
            }

            return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramGet).then(function (reps) {
                const records = reps.records
                const paramPut = {
                    'app': updatedAppId,
                    'records': createPutRecords(records)
                }

                return kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', paramPut)
            }).then(function () {
                location.reload()
            })
        }
        kintone.app.getHeaderMenuSpaceElement().appendChild(massUpdateButton)
    })
})()