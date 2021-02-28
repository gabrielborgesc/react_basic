import React from 'react'
import Card from '../../components/card'
import { withRouter } from 'react-router-dom'

import * as popUp from '../../components/toastr'

import { Button } from 'primereact/button'
import { InputMask } from 'primereact/inputmask'
import { AuthContext } from '../../main/authProvider'
import HandleErrorService from '../../app/service/handleErrorService'
import ProductService from '../../app/service/productService'
import InventoryTable from './inventoryTable'
import GeneralServices from '../../app/service/generalServices'

class InvetoryLaunch extends React.Component {

    constructor(){
        super();
        this.productService = new ProductService();
        this.generalServices = new GeneralServices();
    }

    state = {
        codigo: null,
        descricao: '',
        ncm: null,
        tipo: '',
        unidadeComercializada: '',
        productsList: [],
        filteredProductsList: [],
        displayConfirmation: false,
        loading: false,
        date: '',
        inputDateErrorClass: '',
        errorDateMessage: '',
        hour: '',
        inputHourErrorClass: '',
        errorHourMessage: '',
        selectionEnabled: false,
        updatedProductsList: []
    }

    componentDidMount(){
        this.search()
    }

    handleChange = async (event) => {
        const value = event.target.value
        const name = event.target.name
        await this.setState({ [name]: value })
        this.filter()
    }

    filter = () => {
        this.setState({loading: true})
        var array = []
        this.state.productsList.forEach(product => {
            var codigo = (!this.state.codigo || product.codigo === this.state.codigo)
            var ncm = (!this.state.ncm || product.ncm === parseInt(this.state.ncm, 10))
            var tipo = (!this.state.tipo || !product.tipo || product.tipo.toLowerCase().includes(this.state.tipo.toLowerCase()))
            var unidade = (!this.state.unidadeComercializada || product.unidadeComercializada.toLowerCase().includes(this.state.unidadeComercializada.toLowerCase()))
            var descricao = (!this.state.descricao || product.descricao.toLowerCase().includes(this.state.descricao.toLocaleLowerCase()))

            if(codigo && ncm && tipo && unidade && descricao) {
                array.push(product)
            }
        })
        this.setState({loading: false})
        this.setState({filteredProductsList: array})
    }

    search = (showInfoPopUp) => {
        const productFilter = {
            codigo: this.state.codigo,
            descricao: this.state.descricao,
            ncm: this.state.ncm,
            tipo: this.state.tipo,
            unidadeComercializada: this.state.unidadeComercializada
        }
        this.setState({loading: true})
        this.productService.search(productFilter)
        .then(response => {
            var productsList = response.data
            this.setState({productsList})
            this.setState({filteredProductsList: productsList})
            this.filter()
            this.setState({disableDeleteButton: false})
            if(!response.data.length && showInfoPopUp){
                popUp.infoPopUp("Nenhum produto encontrado com os dados informados")
            }
            this.setState({loading: false})
        }).catch(error => {
            HandleErrorService.handleError(this.props.history.push, error)
            this.setState({loading: false})
            this.setState({disableDeleteButton: false})
        })
        
    }

    checkFilter = () => {
        var check = true
        if(isNaN(new Date(GeneralServices.convertToUsDate(this.state.date)).getTime())){
            this.setState({inputDateErrorClass: "p-invalid"})
            this.setState({errorDateMessage: "Informe uma data válida"})
            check=false
        }
        if(!GeneralServices.checkValidHour(this.state.hour)){
            this.setState({inputHourErrorClass: "p-invalid"})
            this.setState({errorHourMessage: "Informe um horário válido"})
            check=false
        }
        return check
    }
    
    resetView = () => {
        this.setState({inputDateErrorClass: ''})
        this.setState({errorDateMessage: ''})
        this.setState({inputHourErrorClass: ''})
        this.setState({errorHourMessage: ''})
    }

    allowSelectProducts = () => {
        this.resetView()
        if(!this.checkFilter()) {
            this.setState({selectionEnabled: false})
            return
        }
        this.setState({selectionEnabled: true})
        console.log('selection enabled', this.state.selectionEnabled)
        console.log('list', this.state.filteredProductsList)
    }

    updateStockOnFilteredProducts = (product) => {
        var filteredProductsList = this.state.filteredProductsList
        var filteredProductCOPY = JSON.parse(JSON.stringify(filteredProductsList.find(element => element.id === product.id))) //copiar obj sem referência
        filteredProductCOPY.quantidade = product.quantidade
        filteredProductCOPY.dataAtualizacaoEstoque = product.dataAtualizacaoEstoque
        const index = filteredProductsList.findIndex(element => element.id === filteredProductCOPY.id)
        filteredProductsList[index] = filteredProductCOPY
        this.setState({filteredProductsList})
        this.pushUpdatedProduct(filteredProductCOPY)
    }

    pushUpdatedProduct = (updatedProductToBePushed) => {
        var updatedProductsList = this.state.updatedProductsList
        updatedProductsList.push(updatedProductToBePushed)
        this.setState({updatedProductsList})
    }

    undoUpdateStockOnFilteredProducts = (productId) => {
        var originalProduct = JSON.parse(JSON.stringify(this.state.productsList.find(element => element.id === productId)))
        const index = this.state.filteredProductsList.findIndex(element => element.id === productId)
        var filteredProductsList = this.state.filteredProductsList
        filteredProductsList[index] = originalProduct
        this.setState({filteredProductsList})
        this.removeUpdatedProduct(originalProduct)
        this.generalServices.sleep(100)
    }

    removeUpdatedProduct = (updatedProductToBeRemoved) => {
        var updatedProductsList = this.state.updatedProductsList
        const index = updatedProductsList.findIndex(element => element.id === updatedProductToBeRemoved.id)
        updatedProductsList.splice(index, 1)
        this.setState({updatedProductsList})
        this.generalServices.sleep(100)
    }

    resetUpdatedProductsList = () => {
        this.setState({updatedProductsList: []})
    }

    render() {
        return (
            <div className="bs-docs-section" >
                <Card title = "Lançamento de Inventário">
                    <div className = "col-md-12">
                        <div className = "row">
                        <div className = "col-md-5">
                            <label htmlFor="date">Data da contagem de estoque</label>
                            <InputMask id="beginDate"
                                name="date"
                                className={"form-control " + this.state.inputDateErrorClass}
                                mask="99-99-9999"
                                value={this.state.date}
                                placeholder="dd-mm-aaaa"
                                onChange={this.handleChange} 
                            />
                            <small id="dateErrorNotice" className="p-error">{this.state.errorDateMessage}</small>
                        </div>
                        <div className = "col-md-5">
                        <label htmlFor="hour">Horário da contagem de estoque</label>
                            <InputMask id="hour"
                                name="hour"
                                className={"form-control " + this.state.inputHourErrorClass }
                                mask="99:99"
                                value={this.state.hour}
                                placeholder="hh:mm"
                                onChange={this.handleChange}
                                onKeyPress={this.handleKeypress}
                            />
                            <small id="hourErrorNotice" className="p-error">{this.state.errorHourMessage}</small>
                        </div>
                        </div>
                        <br />
                        <Button 
                            label="Escolher produtos"
                            icon="pi pi-pencil"
                            onClick = {this.allowSelectProducts}
                            style={ {maxHeight: '35px'} }
                        />
                    </div>
                    <div className="bs-docs-section" >
                        {
                            this.state.selectionEnabled ? (
                                <InventoryTable list = {this.state.filteredProductsList}
                                   updatedProductsList={this.state.updatedProductsList}
                                   updateStockFunction={this.updateStockOnFilteredProducts}
                                   undoUpdateStockFunction={this.undoUpdateStockOnFilteredProducts}
                                   resetUpdatedProductsList={this.resetUpdatedProductsList}
                                   search = {this.search}
                                   loading = {this.state.loading}
                                   push = {this.props.history.push}
                                   date={this.state.date}
                                   hour={this.state.hour}
                                   />
                            ) : (
                                <div />
                            )
                        }
                        
                    </div>
                </Card>
                <div className="d-flex "/>
            </div>              
        )
    }


}

InvetoryLaunch.contextType = AuthContext

export default withRouter(InvetoryLaunch)