(function () {
    'use script'

    function createPutRecords(records) {
        const putRecords = records.map(record => {
            if (record.コピー元.value === record.コピー先.value) {
                return undefined
            }
            return  {
                id: record.$id.value,
                record: {
                    コピー先: {
                        value: record.コピー元.value
                    }
                }
            }
        })
        return putRecords.filter(putRecord => putRecord !== undefined)
    }

    function sliceByNumber(array, number) {
        const length = Math.ceil(array.length / number)
        return new Array(length).fill().map((_, i) =>
            array.slice(i * number, (i + 1) * number)
        )
    }

    async function massUpdate() {
        const MAX_GET_LIMIT = 500
        const MAX_UPDATE_LIMIT = 100
        const updatedAppId = kintone.app.getId()
        let offset = 0
        let notWillBeDone = true
        let recordsAcquired = []

        while (notWillBeDone) {
            const paramGet = {
                'app': updatedAppId,
                'query': `order by $id asc limit ${MAX_GET_LIMIT} offset ${offset}`
            }
            const reps = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramGet)

            if (reps.records.length < MAX_GET_LIMIT) {
                notWillBeDone = false
            }
            offset += MAX_GET_LIMIT
            recordsAcquired = recordsAcquired.concat(reps.records)
        }
        const recordsByOneHundred = await sliceByNumber(recordsAcquired, MAX_UPDATE_LIMIT)
        const promises = recordsByOneHundred.map(records => {
            const paramPut = {
                'app': updatedAppId,
                'records': createPutRecords(records)
            }
            return kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', paramPut)
        })
        await Promise.all(promises)
    }

    kintone.events.on('app.record.index.show', function (event) {
        const massUpdateButton = document.createElement('button')
        massUpdateButton.id = 'mass_update_button'
        massUpdateButton.innerText = '一括更新する'

        if (document.getElementById('mass_update_button') !== null) {
            return
        }

        massUpdateButton.onclick = async function () {
            await massUpdate()
            location.reload()
        }
        kintone.app.getHeaderMenuSpaceElement().appendChild(massUpdateButton)
    })
})()