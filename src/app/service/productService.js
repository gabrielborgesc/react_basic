import ApiService from "../apiServices";
import GeneralServices from "./generalServices";


class ProductService extends ApiService {

    constructor() {
        super('/api/products')
    }

    search(productFilter){
        // /api/entry?description='fefe'&year=2020&...
        let params = `?`
        if(productFilter.codigo){
            params = `${params}&codigo=${productFilter.codigo}`
        }
        if(productFilter.descricao){
            params = `${params}&descricao=${productFilter.descricao}`
        }
        if(productFilter.ncm){
            params = `${params}&ncm=${productFilter.ncm}`
        }
        if(productFilter.tipo){
            params = `${params}&tipo=${productFilter.tipo}`
        }
        if(productFilter.unidadeComercializada){
            params = `${params}&unidadeComercializada=${productFilter.unidadeComercializada}`
        }   
        return this.get(`/search${params}`)
        
    }

    deleteProductById (id) {
        return this.delete(`/delete/${id}`)
    }

    deleteMultipleProducts(object){
        return this.post(`/deleteMultipleProducts`, object)
    }

    save(product){
        return this.post(`/save`, product)
    }

    update(id, product){
        return this.put(`/update/${id}`, product)
    }

    updateStock(id, product){
        return this.put(`/updateStock/${id}`, product)
    }

    getTypeList(){
        return [
            {label: 'Selecione...', value: ''},
            {label:'Venda', value: 'VENDA'},
	        {label:'Insumo para venda', value: 'INSUMO_PARA_VENDA'},
	        {label:'Uso e Consumo', value: 'USO_E_COMSUMO'},
	        {label:'Imobilizado', value: 'IMOBILIZADO'}
        ]
    }    
    getCodeList(list){
        var codigoList = []
        list.forEach(product => {
            var codigo = product.codigo
            var codigoLabel = codigo ? codigo.toString() : null
            if(codigo && !codigoList.some(element => element.value === codigo)){
                var object = {label: codigoLabel, value: codigo}
                codigoList.push(object)
            }
        })
        codigoList.sort( GeneralServices.compareStringValues );
        return codigoList
    }

    getDescriptionList(list){
        var descriptionList = []
        list.forEach(product => {
            if(!descriptionList.some(element => element.value === product.descricao)){
                var object = {label: product.descricao, value: product.descricao}
                descriptionList.push(object)
            }
        })
        descriptionList.sort( GeneralServices.compareStringValues );
        return descriptionList
    }

    getNCMList(list){
        var NCMList = []
        list.forEach(product => {
            var ncm = product.ncm
            if(!NCMList.some( element => element.value === ncm )){
                var ncmLabel = ncm !== null ? ncm.toString() : null
                if(ncmLabel === '0') {
                    ncmLabel = '00000000'
                }
                var object = {label: ncmLabel, value: ncm}
                NCMList.push(object)
            }
        })
        NCMList.sort( GeneralServices.compareStringValues );
        return NCMList
    }

    getCfopList(list){
        var cfopList = []
        list.forEach(product => {
            var cfop = product.cfop
            if(!cfopList.some( element => element.value === cfop )){
                var cfopLabel = cfop.toString()
                var object = {label: cfopLabel, value: cfop}
                cfopList.push(object)
            }
        })
        cfopList.sort( GeneralServices.compareIntValues );
        return cfopList
    }


    getUnitList(list){
        var unitList = []
        list.forEach(product => {
            if(!unitList.some( element => element.value === product.unidadeComercializada )){
                var object = {label: product.unidadeComercializada, value: product.unidadeComercializada}
                unitList.push(object)
            }
        })
        if(unitList) unitList.sort( GeneralServices.compareStringValues );
        return unitList
    }


}


export default ProductService