import ApiFileService from "../apiFileServices";


class FileService extends ApiFileService {

    constructor() {
        super('/api/files')
    }

    upload(file){
        return this.post(`/uploadFile`, file)
    }

    mutipleUpload(data){
        return this.post(`/uploadMultipleFiles`, data)
    }

    // getProgress(key){
    //     return this.get(`/getUploadProgress/${key}`)
    // }

    // deleteProgress(key){
    //     return this.delete(`/deleteProgress/${key}`)
    // }
}

export default FileService