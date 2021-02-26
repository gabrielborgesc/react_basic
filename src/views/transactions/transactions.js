import React from 'react'
import Card from '../../components/card'
import { withRouter } from 'react-router-dom'

import { Button } from 'primereact/button'

import { AuthContext } from '../../main/authProvider'
import TransactionService from '../../app/service/transactionService'
import { InputMask } from 'primereact/inputmask'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import * as popUp from '../../components/toastr'
import GeneralServices from '../../app/service/generalServices'
import HandleErrorService from '../../app/service/handleErrorService'
import TransactionByProductTable from './transactionByProductTable'
import TransactionByNFTable from './transactionByNFTable'
import ProgressService from '../../app/service/progressService'

class Transactions extends React.Component {

    constructor(){
        super();
        this.transactionService = new TransactionService();
        this.generalServices = new GeneralServices();
        this.progressService = new ProgressService();
    }

    state = {
        productLabel: 'Por produto',
        NFLabel: 'Por nota',
        currentLabel: '',
        transactionList: [],
        beginDate:'',
        endDate:'',
        tipo: '',
        situacao: '',
        errorTypeMessage: null,
        inputTypeErrorClass: null,
        errorSituationMessage: null,
        inputSituationErrorClass: null,
        errorBeginDateMessage: null,
        inputBeginDateErrorClass: null,
        errorEndDateMessage: null,
        inputEndDateErrorClass: null,
        loading: false,
        totalValue: GeneralServices.valueBodyTemplate(0),
        getTransactionDeleteProgressError: 0,
        getNFDeleteProgressError: 0
    }

    componentDidMount(){
        this.setState({currentLabel: this.state.productLabel})
    }

    changeLabel = (label) => {
        this.setState({currentLabel: label})
    }

    handleChange = async (event) => {
        const value = event.target.value
        const name = event.target.name
        await this.setState({ [name]: value })
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

    groupByNF = () => {
        var NFList = []
        this.state.transactionList.forEach(transaction => {
            var NF = NFList.find(element => element.numero === transaction.numero)
            if(NF){ //Nota fiscal já inserida
                const index = NFList.indexOf(NF)
                NF.valorTotal += transaction.valor
                NF.transactions.push(transaction)
                NFList[index] = NF
            } else { //nova nota fiscal
                NFList.push({
                    dhEmi: transaction.dhEmi,
                    numero: transaction.numero,
                    valorTotal: transaction.valor,
                    tipo: transaction.tipo,
                    modelo: transaction.modelo,
                    transactions: [transaction]
                })
            }
        })
        return NFList
    }

    calculateTotalValue = transactions => {
        var totalValue = 0;
        transactions.forEach(transaction => {
            totalValue += transaction.valor
        })
        this.setState({totalValue: GeneralServices.valueBodyTemplate(totalValue)})
    }

    get = (showInfoPopUp) =>{
        this.resetView()
        if(!this.checkFilter()) return
        this.setState({disableDeleteButton: true})
        this.setState({loading: true})
        this.transactionService.getTransactions(
            {
                nome: this.state.name,
                // modelo:  this.state.modelo,
                // descricaoProduto:  this.state.descricao,
                tipo:  this.state.tipo,
                situacao:  this.state.situacao,
                // numero: this.state.numero,
                // serie: this.state.serie
            }, this.state.beginDate, this.state.endDate
        )
        .then(response => {
            this.setState({transactionList: response.data})
            this.setState({loading: false})
            this.setState({disableDeleteButton: false})
            this.calculateTotalValue(response.data)
            if(!response.data.length && showInfoPopUp){
                popUp.infoPopUp("Nenhuma movimentação encontrada com os dados informados")
            }          
        }).catch(error => {
            HandleErrorService.handleError(this.props.history.push, error)
            this.setState({loading: false})
            this.setState({disableDeleteButton: false})
        })     
    }

    deleteMultipleTransactions = (listOfId) => {
        if(listOfId){
            this.setState({loading: true})
            this.setState({disableDeleteButton: true})
            const timestamp = Date.now()
            var object = {
                listOfTransactionsId: listOfId,
                key: timestamp,
                description: 'Delete transactions by product'
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
            
            this.getTransactionDeleteProgress(timestamp)
        }
    }

    getTransactionDeleteProgress = async progressKey => {
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
                this.getTransactionDeleteProgress(progressKey)
            }
        }).catch(async error => {
            HandleErrorService.handleError(this.props.history.push, error)
            await this.generalServices.sleep(1*1000)
            this.setState({getTransactionDeleteProgressError: this.state.getTransactionDeleteProgressError+1})
            if(this.state.getTransactionDeleteProgressError<5){
                this.getTransactionDeleteProgress(progressKey)
            } else{
                this.setState({getTransactionDeleteProgressError: 0})
                this.get()
                this.progressService.deleteProgress(progressKey)

            }
        })
    }

    deleteMultipleNFs = (listOfNFNumbers) => {
        if(listOfNFNumbers){
            this.setState({loading: true})
            this.setState({disableDeleteButton: true})
            const timestamp = Date.now()
            var object = {
                listOfNFNumbers: listOfNFNumbers,
                key: timestamp,
                description: 'Delete transactions by NF'
            }
            this.transactionService.deleteMultipleNFs(object)
            // .then( response => {
            //     popUp.successPopUp("Nota(s) deletada(s) com sucesso")
            //     this.get()
            // }).catch(error => {
            //     HandleErrorService.handleError(this.props.history.push, error)
            //     this.setState({loading: false})
            //     this.setState({disableDeleteButton: false})
            // })
            
            this.getNFDeleteProgress(timestamp)
        }
    }

    getNFDeleteProgress = async progressKey => {
        await this.generalServices.sleep(1*1000)
        this.progressService.getProgress(progressKey)
        .then(async response => {
            var progress = response.data.progress
            if(parseInt(progress,10) === 100){
                popUp.successPopUp("Nota(s) deletada(s) com sucesso")
                this.get()
                this.progressService.deleteProgress(progressKey)
            } else{ // progress !==100
                await this.generalServices.sleep(1*1000)
                this.getNFDeleteProgress(progressKey)
            }
        }).catch(async error => {
            HandleErrorService.handleError(this.props.history.push, error)
            await this.generalServices.sleep(1*1000)
            this.setState({getNFDeleteProgressError: this.state.getNFDeleteProgressError+1})
            if(this.state.getNFDeleteProgressError<5){
                this.getNFDeleteProgress(progressKey)
            } else{
                this.setState({getNFDeleteProgressError: 0})
                this.get()
                this.progressService.deleteProgress(progressKey)

            }
        })
    }

    render() {

        const typeList = this.transactionService.getTypeList()
        const situationList = this.transactionService.getSituationList()

        return (
                   
            <div className="bs-docs-section" >
                
                <Card title = "Movimentações"> 
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
                        <small id="beginDateErrorNotice" className="p-error">{this.state.errorBeginDateMessage}</small>
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
                        <small id="endDateErrorNotice" className="p-error">{this.state.errorEndDateMessage}</small>
                        </div>
                        </div>
                    < br/>
                    <div className = "col-md-12">
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
                <div className="p-col-12 p-md-3 "
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'}}>
                <Button label={this.state.productLabel}
                        className={this.state.currentLabel === this.state.productLabel ? " " : "p-button-text"}
                        onClick={ () => this.changeLabel(this.state.productLabel)} />                    
                <Button label={this.state.NFLabel}
                        className={this.state.currentLabel === this.state.NFLabel ? " " : "p-button-text"}
                        onClick={ () => this.changeLabel(this.state.NFLabel)} />
                </div>
                <div className = "card mb-3">
                <div className = "card-header">
                    <Button label={'Valor Total: ' + this.state.totalValue } className="p-button-success" />
                </div>
                </div>
                   {
                       this.state.currentLabel === this.state.productLabel ? 
                       (
                            <TransactionByProductTable 
                                list = {this.state.transactionList}
                                deleteMultiple = {this.deleteMultipleTransactions}
                                loading = {this.state.loading}
                                disableDeleteButton = {this.state.disableDeleteButton}
                            />
                       ) :
                       (
                            <TransactionByNFTable 
                                list = {this.groupByNF()}
                                deleteMultiple = {this.deleteMultipleNFs}
                                loading = {this.state.loading}
                                disableDeleteButton = {this.state.disableDeleteButton}
                            />
                       )
                   }
                </Card>
                <div className="d-flex "/>
            </div>
              
        )
    }


}

Transactions.contextType = AuthContext

export default withRouter(Transactions)