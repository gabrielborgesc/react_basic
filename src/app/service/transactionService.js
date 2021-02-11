import ApiService from "../apiServices";
import GeneralServices from "./generalServices";


class TransactionService extends ApiService {

    constructor() {
        super('/api/transactions')
    }

    getTransactions(transactionFilter, beginDate, endDate){
        let params = `?`
        if(beginDate){
            params = `${params}&beginDate=${beginDate}`
        }
        if(endDate){
            params = `${params}&endDate=${endDate}`
        }
        if(transactionFilter.nome){
            params = `${params}&nome=${transactionFilter.nome}`
        }
        if(transactionFilter.modelo){
            params = `${params}&modelo=${transactionFilter.modelo}`
        }
        if(transactionFilter.descricaoProduto){
            params = `${params}&descricaoProduto=${transactionFilter.descricaoProduto}`
        }
        if(transactionFilter.tipo){
            params = `${params}&tipo=${transactionFilter.tipo}`
        }
        if(transactionFilter.situacao){
            params = `${params}&situacao=${transactionFilter.situacao}`
        }   
        if(transactionFilter.numero){
            params = `${params}&numero=${transactionFilter.numero}`
        }   
        if(transactionFilter.serie){
            params = `${params}&serie=${transactionFilter.serie}`
        }   
        return this.get(`/search${params}`)
    }

    getTypeList(){
        return [
            {label: 'Selecione...', value: ''},
            {label: 'Entrada', value: 'ENTRADA'},
            {label: 'Saída', value: 'SAIDA'}
        ]
    }

    getModelList(){
        return [
            {label: 'Selecione', value:''},
            {label: 55, value: 55},
            {label: 65, value: 65}
        ]
    }

    getSituationList(){
        return [
            {label: 'Selecione...', value: ''},
            {label: '00 - Documento_Regular', value: 'Documento_Regular'},
            {label: '01 - Escrituração_extemporânea_de_documento_regular', value: 'Escrituração_extemporânea_de_documento_regular'},
            {label: '02 - Documento_cancelado', value: 'Documento_cancelado'},
            {label: '03 - Escrituração_extemporânea_de_documento_cancelado', value: 'Escrituração_extemporânea_de_documento_cancelado'},
            {label: '04 - NFe_NFCe_ou_CTe_denegado', value: 'NFe_NFCe_ou_CTe_denegado'},
            {label: '05 - NFe_NFCe_ou_CTe_Numeração_inutilizada', value: 'NFe_NFCe_ou_CTe_Numeração_inutilizada'},
            {label: '06 - Documento_Fiscal_Complementar', value: 'Documento_Fiscal_Complementar'},
            {label: '07 - Escrituração_extemporânea_de_documento_complementar', value: 'Escrituração_extemporânea_de_documento_complementar'},
            {label: '08 - Documento_Fiscal_emitido_com_base_em_Regime_Especial_ou_Norma_Específica', value: 'Documento_Fiscal_emitido_com_base_em_Regime_Especial_ou_Norma_Específica'},
        ]
    }

    getCodeList(list){
        var codigoList = []
        list.forEach(transaction => {
            var codigo = transaction.productInfo.codigo
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
        list.forEach(transaction => {
            var info = transaction.productInfo
            if(!descriptionList.some(element => element.value === info.descricao)){
                var object = {label: info.descricao, value: info.descricao}
                descriptionList.push(object)
            }
        })
        descriptionList.sort( GeneralServices.compareStringValues );
        return descriptionList
    }

    getNCMList(list){
        var NCMList = []
        list.forEach(transaction => {
            var ncm = transaction.productInfo.ncm
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
        var CfopList = []
        list.forEach(transaction => {
            var cfop = transaction.productInfo.cfop
            var cfopLabel = cfop.toString()
            if(!CfopList.some( element => element.value === cfop )){
                var object = {label: cfopLabel, value: cfop}
                CfopList.push(object)
            }
        })
        CfopList.sort( GeneralServices.compareStringValues );
        return CfopList
    }

    getNumberList(list){
        var NumberList = []
        list.forEach(transaction => {
            var number = transaction.numero
            var numberLabel = number.toString()
            if(!NumberList.some( element => element.value === number )){
                var object = {label: numberLabel, value: number}
                NumberList.push(object)
            }
        })
        NumberList.sort( GeneralServices.compareStringValues );
        return NumberList
    }

    getSerieList(list){
        var serieList = []
        list.forEach(transaction => {
            var serie = transaction.serie
            var serieLabel = serie.toString()
            if(!serieList.some( element => element.value === serie )){
                var object = {label: serieLabel, value: serie}
                serieList.push(object)
            }
        })
        serieList.sort( GeneralServices.compareIntValues );
        return serieList
    }

    getModelList(list){
        var modeloList = []
        list.forEach(transaction => {
            var modelo = transaction.modelo
            var modeloLabel = modelo.toString()
            if(!modeloList.some( element => element.value === modelo )){
                var object = {label: modeloLabel, value: modelo}
                modeloList.push(object)
            }
        })
        modeloList.sort( GeneralServices.compareIntValues );
        return modeloList
    }

    getUnitList(list){
        var unitList = []
        list.forEach(transaction => {
            var info = transaction.productInfo
            if(!unitList.some( element => element.value === info.unidadeComercializada )){
                var object = {label: info.unidadeComercializada, value: info.unidadeComercializada}
                unitList.push(object)
            }
        })
        unitList.sort( GeneralServices.compareStringValues );
        return unitList
    }

    deleteMultipleTransactions(object){
        return this.post(`/deleteMultipleTransactions`, object)
    }

    
}

export default TransactionService