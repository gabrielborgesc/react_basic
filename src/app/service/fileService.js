import ApiFileService from "../apiFileServices";


class FileService extends ApiFileService {

    constructor() {
        super('/api/files')
    }

    upload(file){
        return this.post(`/uploadFile`, file)
    }

    mutipleUpload(files){
        return this.post(`/uploadMultipleFiles`, files)
    }

    // getProgress(key){
    //     return this.get(`/getUploadProgress/${key}`)
    // }

    // deleteProgress(key){
    //     return this.delete(`/deleteProgress/${key}`)
    // }
}

export default FileService