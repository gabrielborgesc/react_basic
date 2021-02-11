import axios from 'axios'

class ApiBaseURL {
    
    constructor(){
        this.httpClient = axios.create({
            baseURL: 'http://localhost:8080',
            // baseURL: 'https://715d05af52d4.ngrok.io',
            // baseURL: 'https://fazenda-backend.herokuapp.com',
        
        })
    }
}

export default ApiBaseURL