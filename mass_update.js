// (function () {
//     'use script'
//
//     function createPutRecords(records) {
//         const putRecords = records.map(record => {
//             if(!record.コピー先.value) {
//                 return  {
//                     id: record.$id.value,
//                     record: {
//                         コピー先: {
//                             value: record.コピー元.value
//                         }
//                     }
//                 }
//             }
//         })
//         return putRecords.filter(putRecord => putRecord !== undefined)
//     }
//
//     kintone.events.on('app.record.index.show', function (event) {
//         const massUpdateButton = document.createElement('button')
//         massUpdateButton.id = 'mass_update_button'
//         massUpdateButton.innerText = '一括更新する'
//         const updatedAppId = kintone.app.getId()
//
//         if (document.getElementById('mass_update_button') !== null) {
//             return
//         }
//
//         massUpdateButton.onclick = async function () {
//             const paramGet = {
//                 'app': updatedAppId,
//                 'query': kintone.app.getQuery()
//             }
//
//             const reps = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramGet)
//             const records = reps.records
//             const paramPut = {
//                 'app': updatedAppId,
//                 'records': createPutRecords(records)
//             }
//
//             await kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', paramPut)
//             location.reload()
//         }
//         kintone.app.getHeaderMenuSpaceElement().appendChild(massUpdateButton)
//     })
// })()


(function () {
    'use script'

    function createPutRecords(records) {
        const putRecords = records.map(record => {
            if(!record.コピー先.value) {
                return  {
                    id: record.$id.value,
                    record: {
                        コピー先: {
                            value: record.コピー元.value
                        }
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

    kintone.events.on('app.record.index.show', function (event) {
        const massUpdateButton = document.createElement('button')
        massUpdateButton.id = 'mass_update_button'
        massUpdateButton.innerText = '一括更新する'
        const updatedAppId = kintone.app.getId()

        if (document.getElementById('mass_update_button') !== null) {
            return
        }

        massUpdateButton.onclick = async function () {
            let offset = 0
            let recordsUnacquired = true
            let recordsacquired = []

            while (recordsUnacquired) {
                const paramGet = {
                    'app': updatedAppId,
                    'query': `order by $id asc limit 500 offset ${offset}`
                }
                const reps = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramGet)

                if (reps.records.length < 500) {
                    recordsUnacquired = false
                }
                offset += 500
                recordsacquired = recordsacquired.concat(reps.records)
            }
            const recordsByOneHundred = await sliceByNumber(recordsacquired, 100)

            recordsByOneHundred.forEach(records => {
                const paramPut = {
                    'app': updatedAppId,
                    'records': createPutRecords(records)
                }
                kintone.api(kintone.api.url('/k/v1/records', true), 'PUT', paramPut)
            })
            // location.reload()
        }
        kintone.app.getHeaderMenuSpaceElement().appendChild(massUpdateButton)
    })
})()