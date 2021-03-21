// const File = require('../../../models/file')
const File = require('../../../models/file')

function fileController () {
    return{
        async file (req, res){
            try{
                const file = await File.findOne({ uuid: req.params.uuid })
                if(!file){
                    return res.render('download', { err: 'Link has been Expired' })
                }

                return res.render('download', {
                    uuid: file.uuid,
                    fileName: file.filename,
                    fileSize: file.size,
                    downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
                })
            }catch(err){
                return res.render('download', { err: 'Something went Wrong' })
            }
         },
        async fileControl (req, res){
            const file = await File.findOne({ uuid: req.params.uuid })
            if(!file){
                return res.render('download', { err: 'Link has been Expired' })
            }

            const filePath = `${__dirname}/../../../../../DrugChain/${file.path}`;
            res.download(filePath);
        }
    }
}


module.exports = fileController