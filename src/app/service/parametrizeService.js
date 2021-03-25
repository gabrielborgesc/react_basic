import ApiService from "../apiServices";


class ParametrizeService extends ApiService {

    constructor() {
        super('/api/buyProducts')
    }

    search(buyPoductFilter){
        // /api/entry?description='fefe'&year=2020&...
        let params = `?`
        if(buyPoductFilter.codigo){
            params = `${params}&codigo=${buyPoductFilter.codigo}`
        }
        if(buyPoductFilter.descricao){
            params = `${params}&descricao=${buyPoductFilter.descricao}`
        }
        if(buyPoductFilter.ncm){
            params = `${params}&ncm=${buyPoductFilter.ncm}`
        }
        if(buyPoductFilter.unidadeComercializada){
            params = `${params}&unidadeComercializada=${buyPoductFilter.unidadeComercializada}`
        }   
        return this.get(`/search${params}`)
        
    }
    save(product){
        return this.post(`/save`, product)
    }

    parametrize(object){
        return this.post(`/parametrize`, object)
    }

    deleteMultipleProducts(object){
        return this.post(`/deleteMultipleProducts`, object)
    }

    deparameterize(object){
        return this.put(`/deparameterize`, object)
    }

}


export default ParametrizeService