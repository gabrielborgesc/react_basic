import React from 'react'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import { withRouter } from 'react-router-dom'
import SelectMenu from '../../components/selectMenu'

import * as popUp from '../../components/toastr'

import { Button } from 'primereact/button'
import { AuthContext } from '../../main/authProvider'
import HandleErrorService from '../../app/service/handleErrorService'
import ProductService from '../../app/service/productService'
import ProductCrudTable from './productCrudTable'

class SearchProduct extends React.Component {

    constructor(){
        super();
        this.productService = new ProductService();
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
        editId: null,
        loading: false,
        disableDeleteButton: false
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
    deleteMultipleProducts = async (listOfId) => {
        if(listOfId){
            this.setState({loading: true})
            this.setState({disableDeleteButton: true})
            var object = {
                listOfProductsId: listOfId
            }
            await this.productService.deleteMultipleProducts(object)
            .then( response => {
                popUp.successPopUp("Produto(s) deletado(s) com sucesso")
                this.search()
            }).catch(error => {
                HandleErrorService.handleError(this.props.history.push, error)
                this.setState({loading: false})
                this.setState({disableDeleteButton: false})
            })
        }
    }

    resetView = () => {
        this.setState({displayConfirmation: false})
    }

    render() {
        const typeList = this.productService.getTypeList()
        return (
            <div className="bs-docs-section" >
                <Card title = "Busca de Produtos Cadastrados">
                    <div className = "col-md-12">
                    {/* <div className="row">
                    <div className = "col-md-5">
                        <FormGroup label = "Código " htmlFor = "InputCode">
                        <input type="number"
                                className={"form-control " + this.state.inputEmailErrorClass}
                                value = {this.state.codigo}
                                name="codigo"
                                onChange={this.handleChange}
                                id="inputCodigo"
                                placeholder="Digite o código" 
                                />
                        </FormGroup> 
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "NCM " htmlFor = "InputNCM">
                        <input type="number"
                                className={"form-control " + this.state.inputEmailErrorClass}
                                value = {this.state.ncm}
                                name="ncm"
                                onChange={this.handleChange}
                                id="inputNCM"
                                placeholder="Digite o NCM" 
                                />
                        </FormGroup>
                        </div>
                        </div> */}
                        <div className = "row">
                        <div className = "col-md-5">
                        <FormGroup label = "Tipo de Produto" htmlFor = "InputType">
                            <SelectMenu className={"form-control " + this.state.inputTypeErrorClass}
                                        name="tipo"
                                        list= {typeList} 
                                        value={this.state.tipo}
                                        onChange={this.handleChange}/>
                            <div className="invalid-feedback">{this.state.errorTypeMessage}</div>
                        </FormGroup>
                        {/* <ProductTypesCheckBox /> */}
                        {/* <div className="p-field-checkbox">
                        <Checkbox inputId="test" name="productType" value="test"
                        // onChange={this.props.onChange}
                        // checked={cities.indexOf('Chicago') !== -1} 
                        />
                        <label htmlFor="test">test</label>
                        </div> */}
                        </div>
                        {/* <div className = "col-md-5">
                        <FormGroup label = "Unidade " htmlFor = "InputUnidade">
                        <input type="text"
                                    className={"form-control " + this.state.inputEmailErrorClass}
                                    value = {this.state.unidadeComercializada}
                                    name="unidadeComercializada"
                                    onChange={this.handleChange}
                                    id="inputUnidade"
                                    placeholder="Digite a unidade" />
                        </FormGroup>
                        </div> */}
                        </div>
                        {/* <div className = "row">
                        <div className = "col-md-10">
                        <FormGroup label = "Descrição " htmlFor = "InputDescription">
                            <textarea   className={"form-control " + this.state.inputDescriptionErrorClass}
                                        id="InputDescription"
                                        name="descricao"
                                        value={this.state.descricao}
                                        style={{marginTop: '0px', marginBottom: '0px', height: '80px'}}
                                        placeholder="Digite a descrição"
                                        onChange = {this.handleChange} />
                        <div className="invalid-feedback">{this.state.errorDescriptionMessage}</div>
                        </FormGroup>
                        </div>
                        </div> */}
                        <Button 
                            label="Buscar"
                            icon="pi pi-search"
                            onClick = {e => {this.search(true)} }
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
                        <ProductCrudTable list = {this.state.filteredProductList}
                                   deleteButton = {this.askForDeleteEntry}
                                   deleteMultiple = {this.deleteMultipleProducts}
                                   search = {this.search}
                                   loading = {this.state.loading}
                                   disableDeleteButton = {this.state.disableDeleteButton}
                                   push = {this.props.history.push} />
                    </div>
                </Card>
                <div className="d-flex "/>
            </div>              
        )
    }


}

SearchProduct.contextType = AuthContext

export default withRouter(SearchProduct)