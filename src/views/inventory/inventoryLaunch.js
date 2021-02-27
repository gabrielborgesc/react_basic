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
        productList: [],
        filteredProductList: [],
        displayConfirmation: false,
        loading: false,
        date: '',
        inputDateErrorClass: '',
        errorDateMessage: '',
        hour: '',
        inputHourErrorClass: '',
        errorHourMessage: '',
        selectionEnabled: false,
        updatedProducts: []
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
        this.state.productList.forEach(product => {
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
        this.setState({filteredProductList: array})
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
            var productList = response.data
            this.setState({productList})
            this.setState({filteredProductList: productList})
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
    }

    updateStockOnFilteredProducts = (product) =>{
        var filteredProductList = this.state.filteredProductList
        var filteredProduct = filteredProductList.find(element => element.id === product.id)
        var aux = JSON.parse(JSON.stringify(filteredProduct));
        aux.quantidade = product.quantidade
        aux.dataAtualizacaoEstoque = product.dataAtualizacaoEstoque
        const index = filteredProductList.indexOf(filteredProduct)
        filteredProductList[index] = aux
        this.setState({filteredProductList})
        this.handleUpdatedProducts(filteredProduct)
    }

    handleUpdatedProducts = (updatedProduct) => {
        var updatedProducts = this.state.updatedProducts
        // console.log('initial', updatedProducts)
        var originalProduct = this.state.productList.find(element => element.id === updatedProduct.id)
        console.log('original', originalProduct)
        // console.log('updatedProduct', updatedProduct)
        // if(originalProduct.quantidade === updatedProduct.quantidade
        //     && originalProduct.dataAtualizacaoEstoque === updatedProduct.dataAtualizacaoEstoque){ //voltou ao original, retirar da lista
        //         // console.log('entoru no if')
        //         var element = this.state.updatedProducts.find(element => element.id === updatedProduct.id)
        //         const index = this.state.updatedProducts.indexOf(element)
        //         updatedProducts.splice(index, 1)
        //         this.setState({updatedProducts: updatedProducts})
        //     }
        // else{ //foi modificado em relação ao original, adicionar à lista
        //     // console.log('entoru no else')
        //     updatedProducts.push(updatedProduct)
        //     this.setState({updatedProducts: updatedProducts})
        // }
        // this.generalServices.sleep(100)
        // console.log('final', this.state.updatedProducts)
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
                                <InventoryTable list = {this.state.filteredProductList}
                                   updateStockFunction={this.updateStockOnFilteredProducts}
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