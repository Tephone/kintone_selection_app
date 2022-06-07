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

    kintone.events.on('app.record.index.show', function (event) {
        if (document.getElementById('mass_update_button') !== null) {
            return
        }

        const massUpdateButton = document.createElement('button')
        massUpdateButton.id = 'mass_update_button'
        massUpdateButton.innerText = '一括更新する'

        massUpdateButton.onclick = async function () {
            const client = new KintoneRestAPIClient
            const appId = kintone.app.getId()
            const records = await client.record.getAllRecords({ app: appId })

            await client.record.updateAllRecords({
                app: appId,
                records: createPutRecords(records)
            })
            location.reload()
        }
        kintone.app.getHeaderMenuSpaceElement().appendChild(massUpdateButton)
    })
})()