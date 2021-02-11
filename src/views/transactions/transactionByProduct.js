import React from 'react'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'

import * as popUp from '../../components/toastr'

import { Button } from 'primereact/button'
import { addLocale } from 'primereact/api'

import HandleErrorService from '../../app/service/handleErrorService'
import TransactionByProductTable from './transactionByProductTable'
import TransactionService from '../../app/service/transactionService'
import ProgressService from '../../app/service/progressService'
import GeneralServices from '../../app/service/generalServices'
import { InputMask } from 'primereact/inputmask'

class TransactionByProduct extends React.Component {

    constructor(){
        super();
        this.transactionService = new TransactionService();
        this.progressService = new ProgressService();
        this.generalServices = new GeneralServices();
    }

    state = {
        beginDate:'',
        endDate:'',
        name:'',
        modelo: null,
        descricao: '',
        tipo: '',
        situacao: '',
        numero: null,
        serie: null,
        transactionList: [],
        filteredList: [],
        editId: null,
        loading: false,
        disableDeleteButton: false,
        getProgressError: 0,
        totalValue: GeneralServices.valueBodyTemplate(0),
        // totalSaleValue: GeneralServices.valueBodyTemplate(0),
        // totalBuyValue: GeneralServices.valueBodyTemplate(0),
        // gain: GeneralServices.valueBodyTemplate(0),
        gainLabel: 'Lucro',
        gainClass: 'success',
        errorTypeMessage: null,
        inputTypeErrorClass: null,
        errorSituationMessage: null,
        inputSituationErrorClass: null,
        errorBeginDateMessage: null,
        inputBeginDateErrorClass: null,
        errorEndDateMessage: null,
        inputEndDateErrorClass: null,
        
    }

    componentDidMount(){
        this.setState({currentLabel: this.state.productLabel})
    }

    resetView = () => {
        if(this.state.tipo) {
            this.setState({inputTypeErrorClass: ""})
            this.setState({errorTypeMessage:""})
        }
        if(this.state.situacao){
            this.setState({inputSituationErrorClass: ""})
            this.setState({errorSituationMessage:""})
        }
        if(this.state.beginDate){
            this.setState({inputBeginDateErrorClass: ""})
            this.setState({errorBeginDateMessage:""})
        }
        if(this.state.endDate){
            this.setState({inputEndDateErrorClass: ""})
            this.setState({errorEndDateMessage:""})
        }
        
    }

    checkFilter = () => {
        var check = true
        if(!this.state.tipo){
            this.setState({inputTypeErrorClass: "is-invalid"})
            this.setState({errorTypeMessage:"Selecione o tipo"})
            check = false
        }
        if(!this.state.situacao){
            this.setState({inputSituationErrorClass: "is-invalid"})
            this.setState({errorSituationMessage:"Selecione a situação"})
            check = false
        }
        // if(!this.state.beginDate){
        //     this.setState({inputBeginDateErrorClass: "p-invalid"})
        //     this.setState({errorBeginDateMessage: "Informe a data mínima"})
        //     check=false
        // }
        // if(!this.state.endDate){
        //     this.setState({inputEndDateErrorClass: "p-invalid"})
        //     this.setState({errorEndDateMessage: "Informe a data mínima"})
        //     check=false
        // }

        return check
    }

    get = (showInfoPopUp) =>{
        this.resetView()
        if(!this.checkFilter()) return
        this.setState({loading: true})
        this.transactionService.getTransactions(
            {
                beginDate: this.state.beginDate,
                endDate: this.state.endDate,
                nome: this.state.name,
                modelo:  this.state.modelo,
                descricaoProduto:  this.state.descricao,
                tipo:  this.state.tipo,
                situacao:  this.state.situacao,
                numero: this.state.numero,
                serie: this.state.serie
            }, this.state.beginDate, this.state.endDate
        )
        .then(response => {
            this.setState({transactionList: response.data})
            // this.filter(showInfoPopUp)
            this.setState({filteredList: response.data})
            this.setState({loading: false})
            this.setState({disableDeleteButton: false})
            this.calculateTotalValue(response.data)
            if(!response.data.length && showInfoPopUp){
                popUp.infoPopUp("Nenhuma movimentação encontrada com os dados informados")
            }          
        }).catch(error => {
            HandleErrorService.handleError(this.props.push, error)
            this.setState({loading: false})
        })     
    }

    // calculateTotalValue = transactions => {
    //     var totalSaleValue = 0;
    //     var totalBuyValue = 0;
    //     transactions.forEach(transaction => {
    //         transaction.tipo === 'VENDA' ?
    //         totalSaleValue += transaction.valor
    //         : totalBuyValue += transaction.valor
    //     })
    //     var gain = parseFloat(totalSaleValue) - parseFloat(totalBuyValue)
    //     if(gain >= 0) {
    //         this.setState({gainClass: 'success'})
    //         this.setState({gainLabel: 'Lucro'})
    //     } else{
    //         this.setState({gainClass: 'danger'})
    //         this.setState({gainLabel: 'Déficit'})
    //         gain = gain*(-1)
    //     }
    //     gain = GeneralServices.valueBodyTemplate(gain)
    //     totalSaleValue = GeneralServices.valueBodyTemplate(totalSaleValue)
    //     this.setState({totalSaleValue})
    //     totalBuyValue = GeneralServices.valueBodyTemplate(totalBuyValue)
    //     this.setState({totalBuyValue})
    //     this.setState({gain})
    // }

    calculateTotalValue = transactions => {
        var totalValue = 0;
        transactions.forEach(transaction => {
            totalValue += transaction.valor
        })
        this.setState({totalValue: GeneralServices.valueBodyTemplate(totalValue)})
    }

    handleChange = async (event) => {
        const value = event.target.value
        const name = event.target.name
        await this.setState({ [name]: value })
    }

    // filter = async (showInfoPopUp) => {
    //     this.setState({loading: true})
    //     var array = []
    //     this.state.transactionList.forEach(transaction => {
    //         var date = (this.dateRange(transaction.dhEmi, transaction.numero===77775))
    //         var name = (!this.state.name || transaction.nomeFornecedorOuCliente.toLowerCase().includes(this.state.name.toLowerCase()))
    //         var modelo = (!this.state.modelo || transaction.modelo === parseInt(this.state.modelo, 10))
    //         var tipo = (!this.state.tipo || !transaction.tipo || transaction.tipo.toLowerCase().includes(this.state.tipo.toLowerCase()))
    //         var situacao = (!this.state.situacao || transaction.situacao.toLowerCase().includes(this.state.situacao.toLowerCase()))
    //         var descricao = (!this.state.descricao || transaction.productDescription.toLowerCase().includes(this.state.descricao.toLowerCase()))
            
    //         if(date && name && modelo && tipo && situacao && descricao) {
    //             array.push(transaction)
    //         }
    //     })
    //     this.setState({loading: false})
    //     await this.setState({filteredList: array})
    //     if(!this.state.filteredList.length && showInfoPopUp){
    //         popUp.infoPopUp("Nenhuma movimentação encontrada com os dados informados")
    //     } 
    // }

    // dateRange = (transactionDate, show) => {
    //     var date = new Date(GeneralServices.convertToUsDate(transactionDate.substring(0, 10)))
    //     var beginDate = new Date(this.state.beginDate)
    //     var endDate = new Date(this.state.endDate)
    //     if(show) console.log('transaction', transactionDate.substring(0, 10), 'begin', this.state.beginDate, 'end', endDate, 'current', date)
    //     if(this.state.beginDate){
    //        if(this.state.endDate){ //tem begin e end
    //            return beginDate <= date && date <= endDate  
    //        } else{ //tem begin mas n tem end
    //            return beginDate <= date
    //        } 
    //     } else if(this.state.endDate){ //n tem begin mas tem end
    //             return date <= endDate
    //     } else { //nem begin nem end
    //         return true
    //     }
    // }    

    deleteMultipleTransactions = (listOfId) => {
        if(listOfId){
            this.setState({loading: true})
            this.setState({disableDeleteButton: true})
            const timestamp = Date.now()
            var object = {
                listOfTransactionsId: listOfId,
                key: timestamp
            }
            this.transactionService.deleteMultipleTransactions(object)
            // .then( response => {
            //     popUp.successPopUp("Movimentação(ões) deletada(s) com sucesso")
            //     this.get()
            // }).catch(error => {
            //     HandleErrorService.handleError(this.props.push, error)
            //     this.setState({loading: false})
            //     this.setState({disableDeleteButton: false})
            // })
            
            this.getProgress(timestamp)
        }
    }

    getProgress = async progressKey => {
        await this.generalServices.sleep(1*1000)
        this.progressService.getProgress(progressKey)
        .then(async response => {
            var progress = response.data.progress
            if(parseInt(progress,10) === 100){
                popUp.successPopUp("Movimentação(ões) deletada(s) com sucesso")
                this.get()
                this.progressService.deleteProgress(progressKey)
            } else{ // progress !==100
                await this.generalServices.sleep(1*1000)
                this.getProgress(progressKey)
            }
        }).catch(async error => {
            HandleErrorService.handleError(this.props.push, error)
            await this.generalServices.sleep(1*1000)
            this.setState({getProgressError: this.state.getProgressError+1})
            if(this.state.getProgressError<5){
                this.getProgress(progressKey)
            } else{
                this.setState({getProgressError: 0})
                this.get();
                this.progressService.deleteProgress(progressKey)

            }
        })
    }

    changeLabel = (label) => {
        this.setState({currentLabel: label})
    }

    render() {
        addLocale('pt-br', {
            firstDayOfWeek: 0,
            dayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
            dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
            today: 'Hoje',
            clear: 'Claro'
        })
        const typeList = this.transactionService.getTypeList()
        const situationList = this.transactionService.getSituationList()
        return (
                    <>
                    <div className="row">
                    <div className="col-md-5" style={{marginLeft:'15px', maxWidth:'615px'}}>
                    <label htmlFor="date">A partir de</label>
                        <InputMask id="beginDate"
                                name="beginDate"
                                className={"form-control " + this.state.inputBeginDateErrorClass}
                                mask="99-99-9999"
                                value={this.state.beginDate}
                                placeholder="dd-mm-aaaa"
                                onChange={this.handleChange} />
                        <small id="username-help" className="p-error">{this.state.errorBeginDateMessage}</small>
                    </div>
                        <div className="col-md-5" style={{maxWidth:'615px'}}>
                        <label htmlFor="date">Até</label>
                        <InputMask id="endDate"
                                name="endDate"
                                className={"form-control " +  this.state.inputEndDateErrorClass}
                                mask="99-99-9999"
                                value={this.state.endDate}
                                placeholder="dd-mm-aaaa"
                                onChange={this.handleChange} />
                        <small id="username-help" className="p-error">{this.state.errorEndDateMessage}</small>
                        </div>
                        </div>
                    < br/>
                    <div className = "col-md-12">
                    {/* <div className="row">
                    <div className = "col-md-5">
                        <FormGroup label = "Nome Forn/Cliente " htmlFor = "InputName">
                        <input type="text"
                                className={"form-control " }
                                value = {this.state.name}
                                name="name"
                                onChange={this.handleChange}
                                id="InputName"
                                placeholder="Digite o nome do Fornecedor/Cliente" 
                                />
                        </FormGroup> 
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "Modelo " htmlFor = "InputModelo">
                        <SelectMenu className={"form-control " + this.state.inputTypeErrorClass}
                                        name="modelo"
                                        list= {modelList} 
                                        value={this.state.modelo}
                                        onChange={this.handleChange}/>
                        </FormGroup>
                        </div>
                        </div> */}
                        <div className = "row">
                        <div className = "col-md-5">
                        <FormGroup label = "Tipo " htmlFor = "InputType">
                            <SelectMenu className={"form-control " + this.state.inputTypeErrorClass}
                                        name="tipo"
                                        list= {typeList} 
                                        value={this.state.tipo}
                                        onChange={this.handleChange}/>
                            <div className="invalid-feedback">{this.state.errorTypeMessage}</div>
                        </FormGroup>
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "Situação " htmlFor = "InputSituacao">
                            <SelectMenu className={"form-control " + this.state.inputSituationErrorClass}
                                        name="situacao"
                                        list= {situationList} 
                                        value={this.state.situacao}
                                        onChange={this.handleChange}/>
                            <div className="invalid-feedback">{this.state.errorSituationMessage}</div>
                        </FormGroup>
                        </div>
                        </div>
                        {/* <div className = "row">
                        <div className = "col-md-5">
                        <FormGroup label = "Número da nota " htmlFor = "InputNFeNumber">
                        <input type="number"
                                className={"form-control " }
                                value = {this.state.codigo}
                                name="numero"
                                onChange={this.handleChange}
                                id="InputNFeNumber"
                                placeholder="Digite o número da nota fiscal" 
                                />
                        </FormGroup> 
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "Série " htmlFor = "InputSerie">
                        <input type="number"
                                className={"form-control " }
                                value = {this.state.codigo}
                                name="serie"
                                onChange={this.handleChange}
                                id="InputSerie"
                                placeholder="Digite a série" 
                                />
                        </FormGroup> 
                        </div>
                        </div> */}
                        {/* <div className = "row">
                        <div className = "col-md-10">
                        <FormGroup label = "Descrição do Produto" htmlFor = "InputDescription">
                            <textarea   className={"form-control " + this.state.inputDescriptionErrorClass}
                                        id="InputDescription"
                                        name="descricao"
                                        value={this.state.descricao}
                                        style={{marginTop: '0px', marginBottom: '0px', height: '80px'}}
                                        placeholder="Digite a descrição do produto"
                                        onChange = {this.handleChange} />
                        <div className="invalid-feedback">{this.state.errorDescriptionMessage}</div>
                        </FormGroup>
                        </div>
                        </div> */}
                        <Button 
                            label="Buscar"
                            icon="pi pi-search"
                            onClick = {e => {this.get(true)} }
                            style={ {maxHeight: '35px'} }
                        />
                        <a href="#/register">
                        <Button 
                            label="Cadastrar" 
                            icon="pi pi-save"
                            style={ {maxHeight: '35px', marginLeft: '8px'} }
                            />
                        </a>
                    </div>
                    
                    <div className="bs-docs-section" >
                    <div className = "card mb-3">
                    <div className = "card-header">
                    {/* <div
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around'}}> */}
                        <Button label={'Valor Total: ' + this.state.totalValue } className="p-button-info" />
                        {/* <Button label={'Total de Compra: ' + this.state.totalBuyValue } className="p-button-warning"
                                style = { {marginLeft: '8px'} }/>
                        <Button label={this.state.gainLabel + ': ' + this.state.gain } className={"p-button-" + this.state.gainClass}
                                style = { {marginLeft: '8px'} } /> */}
                    {/* </div> */}
                    </div>
                    </div>
                        <TransactionByProductTable list = {this.state.filteredList}
                                   deleteButton = {this.askForDeleteEntry}
                                   deleteMultiple = {this.deleteMultipleTransactions}
                                   search = {this.search}
                                   loading = {this.state.loading}
                                   disableDeleteButton = {this.state.disableDeleteButton}
                                   push = {this.props.push} />
                    </div>
                    </>
              
        )
    }


}

export default TransactionByProduct