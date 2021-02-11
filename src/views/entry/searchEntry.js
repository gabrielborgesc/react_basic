import React from 'react'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import { withRouter } from 'react-router-dom'
// import LocalStorageService from '../../app/service/localStorageService'
import SelectMenu from '../../components/selectMenu'
// import EntryTable from './entryTable'
import EntryService from '../../app/service/entryService'
import UserService from '../../app/service/userService'
import GeneralServices from '../../app/service/generalServices'

import {BiSearch} from 'react-icons/bi'
import {FaSave} from 'react-icons/fa'
import * as popUp from '../../components/toastr'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
// import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber'
import CrudTable from './primereactCrudTable'
import { AuthContext } from '../../main/authProvider'
import HandleErrorService from '../../app/service/handleErrorService'

class SearchEntry extends React.Component{

    constructor(){
        super();
        this.entryService = new EntryService();
        this.userService = new UserService();
        this.generalServices = new GeneralServices();
    }

    state = {
        year: '',
        month: '',
        type: '',
        status: '',
        description: '',
        value: null,
        user: null,
        entryList: [],
        errorUserMessage: null,
        inputUserErrorClass: null,
        listOfUsers: [],
        displayConfirmation: false,
        idOfEntryToBeDeleted: null,
        errorYearMessage: null,
        inputYearErrorClass: null,
        errorMonthMessage: null,
        inputMonthErrorClass: null,
        errorTypeMessage: null,
        inputTypeErrorClass: null,
        errorValueMessage: null,
        inputValueErrorClass: null,
        errorDescriptionMessage: null,
        inputDescriptionErrorClass: null,
        editId: null,
        loading: false
    }
    
    componentDidMount(){
        this.userList()
    }
    userList = async () => {
        var list = [{label: 'Selecione...', value:''}]
        var apiList = []
        await this.userService.getAllUsers()
        .then(response => {
            apiList = response.data
            apiList.forEach(user => {
                list.push({label: user.email, value: user.id})
            });
        }).catch(error => {
            popUp.errorPopUp(error.response.data)
        })
        this.setState({listOfUsers: list})
    }

    handleChange = async (event) => {
        const value = event.target.value
        const name = event.target.name
        await this.setState({ [name]: value })
        this.search()
    }

    resetView = () => {
        this.setState({errorUserMessage: null})
        this.setState({inputUserErrorClass: null})
        this.setState({errorUserMessage: null})
        this.setState({inputUserErrorClass: null})
        this.setState({listOfUsers: []})
        this.setState({displayConfirmation: false})
        this.setState({idOfEntryToBeDeleted: null})
        this.setState({errorYearMessage: null})
        this.setState({inputYearErrorClass: null})
        this.setState({errorMonthMessage: null})
        this.setState({inputMonthErrorClass: null})
        this.setState({errorTypeMessage: null})
        this.setState({inputTypeErrorClass: null})
        this.setState({errorValueMessage: null})
        this.setState({inputValueErrorClass: null})
        this.setState({errorDescriptionMessage: null})
        this.setState({inputDescriptionErrorClass: null})
    }
    resetData = () => {
        this.setState({year: ''})
        this.setState({month: ''})
        this.setState({type: ''})
        this.setState({status: ''})
        this.setState({description: ''})
        this.setState({value: null})
        this.setState({user: null})
    }
    search = (showInfoPopUp) => {
        const entryFilter = {
            year: parseInt(this.state.year),
            month: this.state.month,
            type: this.state.type,
            status: this.state.status,
            user: this.state.user,
            value: this.state.value,
            description: this.state.description
        }
        this.setState({loading: true})
        this.entryService.search(entryFilter)
        .then(response => {
            this.setState({entryList:response.data})
            if(!this.state.entryList.length && showInfoPopUp){
                popUp.infoPopUp("Nenhum lançamento encontrado com os dados informados")
            }
            this.setState({loading: false})
        }).catch(error => {
            HandleErrorService.handleError(this.props.history.push, error)
        })
        
    }

    editEntry = (id) => {
        this.setState({editId: id})
    }
    askForDeleteEntry = (entryId) => {
        this.setState({idOfEntryToBeDeleted: entryId})
        this.setState({displayConfirmation: true})
    }
    renderDeleteConfirmationFooter = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => this.cancelDeleteEntry()}
                        className="p-button-text" />
                <Button label="Confirmar" icon="pi pi-check"
                        onClick={() => this.deleteEntry(this.state.idOfEntryToBeDeleted)} autoFocus />
            </div>
        );
    }
    deleteMultipleEntrires = (list) => {
        if(list){
            list.forEach(entry => this.deleteEntry(entry.id))
        }
    }
    deleteEntry = async (id) => {
        await this.entryService.deleteEntryById(id)
        .then(response => {
            popUp.successPopUp("Lançamento deletado com sucesso")
        })
        .catch(error => {
            popUp.errorPopUp(error.response.data)
        })
        this.search()
        this.setState({idOfEntryToBeDeleted: null})
        this.setState({displayConfirmation: false})

    }
    cancelDeleteEntry = () => {
        this.setState({displayConfirmation: false})
        this.setState({idOfEntryToBeDeleted: null})
    }
    checkData = () => {
        var check = true
        if(!this.state.year){
            this.setState({errorYearMessage: "Campo Ano é obrigatório"})
            this.setState({inputYearErrorClass: "is-invalid"})
            check=false
        }
        if(!this.state.month){
            this.setState({errorMonthMessage: "Campo Mês é obrigatório"})
            this.setState({inputMonthErrorClass: "is-invalid"})
            check=false
        }
        if(!this.state.type){
            this.setState({errorTypeMessage: "Campo Tipo de Lançamento é obrigatório"})
            this.setState({inputTypeErrorClass: "is-invalid"})
            check=false
        }
        if(!this.state.value){
            this.setState({errorValueMessage: "Campo Valor é obrigatório"})
            this.setState({inputValueErrorClass: "p-invalid p-d-block"})
            check=false
        }
        if(!this.state.description){
            this.setState({errorDescriptionMessage: "Campo Descrição é obrigatório"})
            this.setState({inputDescriptionErrorClass: "is-invalid"})
            check=false
        }
        if(this.state.description.length>255){
            popUp.warningPopUp("Limite de caracteres (255) para descrição excedido")
            this.setState({inputDescriptionErrorClass: "is-invalid"})
            check=false
        }
        return check
    }
    save = async () => {
        this.resetView()
        if(this.checkData()){
            const {year, month, type, value, description} = this.state
            const loggedUser = this.context.userLoggedIn
            console.log(loggedUser)
            const newEntry = {year, month, type, value, description, user: loggedUser.id}
            await this.entryService.save(newEntry)
            .then(response => {
                popUp.successPopUp(response.data)
                popUp.infoPopUp("Status salvo como Pendente automaticamente")
            })
            .catch(error => {
                popUp.errorPopUp(error.response.data)
            })
            this.resetData()
            this.search()
    } 
    }

    render() {
        const yearList = this.entryService.getYearList()
        const typeList = this.entryService.getTypeList()
        const statusList = this.entryService.getStatusList()
        const monthList =  this.entryService.getMonthList()
        return (
                   
            <div className="bs-docs-section">
                <Card title = "Busca e Cadastro de Lançamentos">
                    <div className = "col-md-12">
                    <div className="row">
                    <div className = "col-md-5">
                        <FormGroup label = "Ano " htmlFor = "InputYear">
                            <SelectMenu className={"form-control " + this.state.inputYearErrorClass}
                            name="year"
                            list={yearList} 
                            value={this.state.year}
                            onChange={this.handleChange}/> 
                            <div className="invalid-feedback">{this.state.errorYearMessage}</div>  
                        </FormGroup> 
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "Mês " htmlFor = "Inputmonth">
                            <SelectMenu className={"form-control " + this.state.inputMonthErrorClass}
                                        name="month"
                                        list= {monthList}
                                        value={this.state.month}
                                        onChange={this.handleChange}/>
                            <div className="invalid-feedback">{this.state.errorMonthMessage}</div>
                        </FormGroup>
                        </div>
                        </div>
                        <div className = "row">
                        <div className = "col-md-5">
                        <FormGroup label = "Tipo de Lançamento " htmlFor = "InputType">
                            <SelectMenu className={"form-control " + this.state.inputTypeErrorClass}
                                        name="type"
                                        list= {typeList} 
                                        value={this.state.type}
                                        onChange={this.handleChange}/>
                            <div className="invalid-feedback">{this.state.errorTypeMessage}</div>
                        </FormGroup>
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "Status do Lançamento " htmlFor = "InputStatus">
                            <SelectMenu className="form-control"
                                        name="status"
                                        list= {statusList} 
                                        value={this.state.status}
                                        onChange={this.handleChange}/>
                        <div className="info-feedback">Campo utilizado apenas para busca</div>
                        </FormGroup>
                        </div>
                        </div>
                        <div className = "row">
                        <div className = "col-md-5">
                        <FormGroup label = "Valor " htmlFor = "InputValue">
                        <div className="p-field p-col-1">
                            {/* <input type="text"
                                       className={"form-control " + this.state.inputValueErrorClass}
                                        name = "value"
                                        value = {this.state.value}
                                        onChange = {this.handleChange}
                                        id="InputValue"
                                        placeholder="Digite o valor" /> */}
                            <InputNumber id="InputValue"
                                        className={this.state.inputValueErrorClass}
                                        style={ {width: '415px'} }
                                        value={this.state.value}
                                        name = "value"
                                        onValueChange={this.handleChange}
                                        mode="currency"
                                        currency="BRL"
                                        locale="pt-BR" />
                             <small id="username2-help" className="p-invalid p-d-block">{this.state.errorValueMessage}</small>
                        </div>
                        </FormGroup>
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "Usuário " htmlFor = "InputUser">
                            <SelectMenu className="form-control"
                                        name="user"
                                        list= {this.state.listOfUsers} 
                                        value={this.state.user}
                                        onChange={this.handleChange}/>
                        <div className="info-feedback">Campo utilizado apenas para busca</div>
                        </FormGroup>
                        </div>
                        </div>
                        <div className = "row">
                        <div className = "col-md-10">
                        <FormGroup label = "Descrição " htmlFor = "InputDecription">
                            <textarea   className={"form-control " + this.state.inputDescriptionErrorClass}
                                        id="InputDecription"
                                        name="description"
                                        value={this.state.description}
                                        style={{marginTop: '0px', marginBottom: '0px', height: '80px'}}
                                        placeholder="Digite a descrição"
                                        onChange = {this.handleChange} />
                        <div className="invalid-feedback">{this.state.errorDescriptionMessage}</div>
                        </FormGroup>
                        </div>
                        </div>
                        <button className="btn btn-success" onClick = {e => {this.search(true)} }><BiSearch />  Buscar</button>
                        <button className="btn btn-danger right-button" 
                                onClick = {this.save}><FaSave />  Cadastrar</button>
                    </div>
                    <div className="bs-docs-section">
                        {/* <EntryTable list = {this.state.entryList}
                                    editId = {this.state.editId}
                                    editButton = {this.editEntry}
                                    deleteButton = {this.askForDeleteEntry} /> */}
                        <CrudTable list = {this.state.entryList}
                                   deleteButton = {this.askForDeleteEntry}
                                   deleteMulipleEntries = {this.deleteMultipleEntrires}
                                   search = {this.search}
                                   loading = {this.state.loading}
                                   push = {this.props.history.push} />
                    </div>
                </Card>
                <Dialog header="Deletar lançamento"
                        visible={this.state.displayConfirmation}
                        modal = {true} //congela restante da tela
                        style={{ width: '350px' }}
                        footer={this.renderDeleteConfirmationFooter()}
                        onHide={() => this.setState({displayConfirmation: false})}>
                    <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                        <div style={{marginBottom: '10px'}}> Deseja confirmar exclusão? </div>
                    </div>
                </Dialog>
            </div>
              
        )
    }

}
SearchEntry.contextType = AuthContext
export default withRouter(SearchEntry)