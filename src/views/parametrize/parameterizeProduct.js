import React from 'react'

import { Button } from 'primereact/button'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import * as popUp  from '../../components/toastr'
import BuyProductCrudTable from '../../components/buyProductCrudTable'
import HandleErrorService from '../../app/service/handleErrorService'
import ParametrizeService from '../../app/service/parametrizeService'
import ParametrizeProductTable from '../../components/parametrize/parametrizeProductTable'
import ProductService from '../../app/service/productService'
import GeneralServices from '../../app/service/generalServices'
import SelectMenu from '../../components/selectMenu'

class ParametrizeProduct extends React.Component {

    constructor(){
        super();
        this.parametrizeService = new ParametrizeService();
        this.productService = new ProductService();
        this.generalServices = new GeneralServices();
    }

    state = {
        codigo: null,
        nomeFornecedor: '',
        cnpjFornecedor: '',
        descricao: '',
        ncm: null,
        tipo: '',
        unidadeComercializada: '',
        parametrized: '',
        productList: [],
        filteredProductList: [],
        displayConfirmation: false,
        editId: null,
        loading: false,
        disableDeleteButton: false,
        requestParametrize: false,
        parametrizeCodigo: null,
        parametrizeDescricao: '',
        parametrizeProductList: [],
        parametrizeFilteredProductsList: [],
    }

    componentDidMount(){
        this.search()
        this.searchParametrizeProducts()
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
            var nome = (!this.state.nomeFornecedor || product.nomeFornecedor.toLowerCase().includes(this.state.nomeFornecedor.toLocaleLowerCase()))
            var cnpj = (!this.state.cnpjFornecedor || product.cnpjFornecedor === this.state.cnpjFornecedor)
            var ncm = (!this.state.ncm || product.ncm === parseInt(this.state.ncm, 10))
            var tipo = (!this.state.tipo || !product.tipo || product.tipo.toLowerCase().includes(this.state.tipo.toLowerCase()))
            var unidade = (!this.state.unidadeComercializada || product.unidadeComercializada.toLowerCase().includes(this.state.unidadeComercializada.toLowerCase()))
            var descricao = (!this.state.descricao || product.descricao.toLowerCase().includes(this.state.descricao.toLocaleLowerCase()))
            var parametrized = !this.state.parametrized || (this.state.parametrized==='true' && product.productDTO!==null) || (this.state.parametrized==='false' && !product.productDTO)

            if(nome && cnpj && ncm && tipo && unidade && descricao && parametrized) {
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
        this.parametrizeService.search(productFilter)
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
            HandleErrorService.handleError(this.props.push, error)
            this.setState({loading: false})
            this.setState({disableDeleteButton: false})
        })
        
    }

    handleParametrizeChange = async (event) => {
        const value = event.target.value
        const name = event.target.name
        await this.setState({ [name]: value })
        this.filterParametrizeProducts()
    }

    filterParametrizeProducts = () => {
        var array = []
        this.state.parametrizeProductList.forEach(product => {
            var codigo = (!this.state.parametrizeCodigo || product.codigo === this.state.parametrizeCodigo)
            var descricao = (!this.state.parametrizeDescricao || product.descricao.toLowerCase().includes(this.state.parametrizeDescricao.toLocaleLowerCase()))

            if(codigo && descricao) {
                array.push(product)
            }
        })
        this.setState({parametrizeFilteredProductsList: array})
    }

    searchParametrizeProducts = (showInfoPopUp) => {
        const productFilter = {
            codigo: this.state.parametrizeCodigo,
            descricao: this.state.parametrizeDescricao
        }
        this.productService.search(productFilter)
        .then(response => {
            var parametrizeProductList = response.data
            this.setState({parametrizeProductList})
            this.setState({parametrizeFilteredProductsList: parametrizeProductList})
            this.filterParametrizeProducts()
            if(!response.data.length && showInfoPopUp){
                popUp.infoPopUp("Nenhum produto encontrado com os dados informados")
            }
        }).catch(error => {
            HandleErrorService.handleError(this.props.push, error)
        })
        
    }
    deleteMultipleProducts = async (listOfId) => {
        if(listOfId){
            this.setState({loading: true})
            this.setState({disableDeleteButton: true})
            var object = {
                listOfProductsId: listOfId
            }
            await this.parametrizeService.deleteMultipleProducts(object)
            .then( response => {
                popUp.successPopUp("Produto(s) deletado(s) com sucesso")
                this.search()
            }).catch(error => {
                HandleErrorService.handleError(this.props.push, error)
                this.setState({loading: false})
                this.setState({disableDeleteButton: false})
            })
        }
    }

    deparameterize = async (listOfId) => {
        if(listOfId){
            this.setState({loading: true})
            this.setState({disableDeleteButton: true})
            var object = {
                listOfProductsId: listOfId
            }
            await this.parametrizeService.deparameterize(object)
            .then( response => {
                popUp.successPopUp("Produto(s) desparametrizados(s) com sucesso")
                this.search()
            }).catch(error => {
                HandleErrorService.handleError(this.props.push, error)
                this.setState({loading: false})
                this.setState({disableDeleteButton: false})
            })
        }
    }

    setFilteredProducts = (buyProducts) => {
        this.setState({filteredProductList: buyProducts})
    }

    setParametrizeFilteredProducts = (parametrizeProducts) => {
        this.setState({parametrizeFilteredProductsList: parametrizeProducts})
    }

    resetView = () => {
        this.setState({displayConfirmation: false})
    }

    requestParametrize = (request) => {
        this.setState({requestParametrize: request})
    }

    parametrize = (parametrizeProduct, proportion) => {
        this.parametrizeService.parametrize({
            buyProducts: this.state.filteredProductList,
            parametrizeProduct,
            proportion
        })
        .then(async response => {
            popUp.successPopUp("Parametrização realizada com sucesso")
            await this.generalServices.sleep(2000)
            window.location.reload()
            this.search()
        })
        .catch(error => {
            HandleErrorService.handleError(this.props.push, error)
        })
    }

    render() {

        const parametrizedList = [
            {label: 'Selecione...', value: ''},
            {label:'Sim', value: true},
	        {label:'Não', value: false}
        ]

        return (
                   
            <div className="bs-docs-section" >
                <Card title = "Parametrização de Produtos">
                    <div className = "col-md-12">
                    <div className="row">
                    <div className = "col-md-5">
                        <FormGroup label = "Nome do Fornecedor " htmlFor = "InputName">
                        <input type="text"
                                className={"form-control " }
                                value = {this.state.nomeFornecedor}
                                name="nomeFornecedor"
                                onChange={this.handleChange}
                                id="InputName"
                                placeholder="Digite o nome do fornecedor" 
                                />
                        </FormGroup> 
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "CNPJ do fornecedor" htmlFor = "InputCNPJ">
                        <input type="number"
                                className={"form-control " }
                                value = {this.state.cnpjFornecedor}
                                name="cnpjFornecedor"
                                onChange={this.handleChange}
                                id="InputCNPJ"
                                placeholder="Digite o CNPJ do fornecedor" 
                                />
                        </FormGroup>
                        </div>
                        </div>
                        <div className = "row">
                        <div className = "col-md-5">
                        <FormGroup label = "NCM " htmlFor = "InputNCM">
                        <input type="number"
                                className={"form-control " }
                                value = {this.state.ncm}
                                name="ncm"
                                onChange={this.handleChange}
                                id="inputNCM"
                                placeholder="Digite o NCM" 
                                />
                        </FormGroup>
                        </div>
                        <div className = "col-md-5">
                        <FormGroup label = "Unidade " htmlFor = "InputUnidade">
                        <input type="text"
                                    className={"form-control " + this.state.inputEmailErrorClass}
                                    value = {this.state.unidadeComercializada}
                                    name="unidadeComercializada"
                                    onChange={this.handleChange}
                                    id="inputUnidade"
                                    placeholder="Digite a unidade" />
                        </FormGroup>
                        </div>
                        </div>
                        <div className = "row">
                        <div className = "col-md-5">
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
                        <div className = "col-md-5">
                        <FormGroup label = "Parametrizado? " htmlFor = "InputParametrized">
                        <SelectMenu className={"form-control " }
                                        name="parametrized"
                                        list= {parametrizedList} 
                                        value={this.state.parametrized}
                                        onChange={this.handleChange}/>
                        </FormGroup>
                        </div>
                        </div>
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
                        <BuyProductCrudTable list = {this.state.filteredProductList}
                                   deleteButton = {this.askForDeleteEntry}
                                   deleteMultiple = {this.deleteMultipleProducts}
                                   deparameterize = {this.deparameterize}
                                   setFilteredProducts = {this.setFilteredProducts}
                                   search = {this.search}
                                   loading = {this.state.loading}
                                   disableDeleteButton = {this.state.disableDeleteButton}
                                   push = {this.props.push}
                                   requestParametrize={this.requestParametrize}
                                   />

                        <br />
                        {
                            this.state.requestParametrize ? 
                            (
                                <>
                                <h3 className = "card-header">Parametrizar com: </h3>
                                <br />
                                <div className = "col-md-12">
                                <div className="row">
                                <div className = "col-md-5">
                                <FormGroup label = "Código " htmlFor = "InputCode">
                                <input type="number"
                                    className={"form-control " + this.state.inputEmailErrorClass}
                                    value = {this.state.parametrizeCodigo}
                                    name="parametrizeCodigo"
                                    onChange={this.handleParametrizeChange}
                                    id="inputCodigo"
                                    placeholder="Digite o código" 
                                />
                                </FormGroup> 
                                </div>
                                <div className = "col-md-5">
                                <FormGroup label = "Descrição " htmlFor = "InputDesc">
                                <input type="text"
                                    className={"form-control " + this.state.inputEmailErrorClass}
                                    value = {this.state.parametrizeDescricao}
                                    name="parametrizeDescricao"
                                    onChange={this.handleParametrizeChange}
                                    id="InputDesc"
                                    placeholder="Digite a descrição" 
                                />
                                </FormGroup> 
                                </div>
                                </div>
                                <Button 
                                    label="Buscar"
                                    icon="pi pi-search"
                                    onClick = {e => {this.searchParametrizeProducts(true)} }
                                    style={ {maxHeight: '35px'} }
                                    />
                                </div>

                                <br />

                                <ParametrizeProductTable list = {this.state.parametrizeFilteredProductsList}
                                           search = {this.searchParametrizeProducts}
                                           loading = {this.state.loading}
                                           setParametrizeFilteredProducts = {this.setParametrizeFilteredProducts}
                                           parametrize = {this.parametrize}
                                           push = {this.props.push} />
                                </>
                            ) : (
                                <>
                                </>
                            )
                        }
                    </div>
                </Card>
                <div className="d-flex "/>
            </div>
              
        )
    }


}

export default ParametrizeProduct