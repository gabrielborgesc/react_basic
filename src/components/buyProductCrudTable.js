import React from 'react'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { SplitButton } from 'primereact/splitbutton'

import currecyFormater from 'currency-formatter'
import ProductService from '../app/service/productService'
import ProductDialog from './product/productDialog'
import * as popUp from './toastr'
import GeneralServices from '../app/service/generalServices'


class BuyProductCrudTable extends React.Component {

    state = {
        codigo: null,
        descricao: '',
        ncm: null,
        tipo: '',
        unidadeComercializada: '',
        quantidade: null,
        selectedProducts: null,
        productDialog: false,
        updateStockDialog: false,
        displayConfirmation: false,
        displayDeparameterizeConfirmation: false,
        editId: null,
        updateStockId: null,
        updateLastFilteredProducts: false,
        parametrizeButton: true,
        parametrizeProductState: {}
    }
    constructor(){
        super()
        this.dt = React.createRef()
        this.productService = new ProductService();

    }

    componentDidUpdate(){
        if(this.props.list && this.props.list.length !== 0 && !this.state.updateLastFilteredProducts){
            this.setState({lastFilteredProducts: this.props.list})
            this.setState({updateLastFilteredProducts: true})
        }
    }

    valueBodyTemplate = (rowData) => {
        return currecyFormater.format(rowData.value, {locale: 'pt-BR'})
    }

    parametrize = () => {
        this.props.setFilteredProducts(this.state.selectedProducts)
        this.setState({parametrizeButton: false})
        this.props.requestParametrize(true)
    }

    cancelParametrize = () => {
        this.props.search()
        this.setState({selectedProducts: []})
        this.setState({parametrizeButton: true})
        this.props.requestParametrize(false)
    }

    handleSelectionChange = async (e) => {

       await this.setState({selectedProducts: e.value})

       if(!this.state.selectedProducts || this.state.selectedProducts.length === 0 ){
           this.props.search()
           this.setState({parametrizeButton: true})
           this.props.requestParametrize(false)
       }
    }

    hideDialog = (name) => {
        this.setState({[name]: false})
    }

    exportCSV = () => {
        this.dt.current.exportCSV();
    }

    delete = () => {
        if(this.state.selectedProducts){
            this.setState({displayConfirmation: true})
        } else {
            popUp.warningPopUp("Nenhum produto foi selecionado para exclusão")
        }
    }

    deparameterize = () => {
        if(this.state.selectedProducts){
            for(var i = 0; i < this.state.selectedProducts.length; i++){
                var selectedProduct = this.state.selectedProducts[i]
                if(!selectedProduct.parametrized){
                    popUp.warningPopUp("Produto " + selectedProduct.descricao + " foi selecionado mas não está parametrizado")
                    return
            }
            this.setState({displayDeparameterizeConfirmation: true})
        }
        } else {
            popUp.warningPopUp("Nenhum produto foi selecionado para desparametrização")
        }
    }
    
    confirmDelete = () => {
        this.setState({displayConfirmation: false})
        this.setState({selectedProducts: null})
        if(this.state.selectedProducts){
            var listOfId = []
            Array.from(this.state.selectedProducts).forEach(selectedProduct => {
                listOfId.push(selectedProduct.id)
            })
        }
        this.props.deleteMultiple(listOfId)
    }

    confirmDeparameterize = () => {
        this.setState({displayDeparameterizeConfirmation: false})
        if(this.state.selectedProducts){
            var listOfId = []
            Array.from(this.state.selectedProducts).forEach(selectedProduct => {
                listOfId.push(selectedProduct.id)
            })
        }
        this.props.deparameterize(listOfId)
        console.log('list of id', listOfId)
        this.setState({selectedProducts: null})
    }

    viewProduct = async (buyProduct) => {
        var product = buyProduct.productDTO
        if(product){
            var object = {
                codigo: product.codigo,
                descricao: product.descricao,
                ncm: product.ncm,
                tipo: product.tipo,
                unidadeComercializada: product.unidadeComercializada,
                proporcao: buyProduct.proportion
            }
            await this.setState({parametrizeProductState: object})
            this.setState({productDialog: true})
        } else{
            popUp.warningPopUp("O produto envolvido não consta no banco de dados")
        }
        
    }

    parametrized = (parametrized) => {
        return this.state.selectedProducts.some(buyProduct => buyProduct.parametrized === parametrized)
    }

    render (){

        const rightToolbarTemplate = () => {
            return (
                <React.Fragment>
                    {/* <Button label="Desparametrizar" icon="pi pi-undo" className="p-button-warning"
                            onClick={this.deparameterize}
                            disabled = { !this.state.selectedProducts || this.state.selectedProducts.length === 0 || this.props.disableDeleteButton || !this.state.parametrizeButton}
                            // style={{marginRight: '10px'}}
                            /> */}
                    
                    <Button label="Deletar" icon="pi pi-trash" className="p-button-danger"
                            onClick={this.delete}
                            disabled = { !this.state.selectedProducts || this.state.selectedProducts.length === 0 || this.props.disableDeleteButton || !this.state.parametrizeButton}
                            />
                </React.Fragment>
            )
        }

        const items = [
            {
                label: 'Parametrizar',
                icon: 'pi pi-link',
                disabled: !this.state.selectedProducts || this.state.selectedProducts.length === 0 || this.parametrized(true) ,
                command: () => {
                    this.parametrize()
                }
            },
            {
                label: 'Desparametrizar',
                icon: 'pi pi-undo',
                disabled: !this.state.selectedProducts || this.state.selectedProducts.length === 0 || this.props.disableDeleteButton
                || !this.state.parametrizeButton || this.parametrized(false),
                command: () => {
                    this.deparameterize()
                }
            }
        ]

        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    {/* <FileUpload mode="basic" accept="*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" /> */}
                    {/* <Button label="Exportar" icon="pi pi-upload" className="p-button-help"
                            disabled={!this.state.parametrizeButton}
                            onClick={this.exportCSV} /> */}
                    {   this.state.parametrizeButton ?
                    (
                        // <Button label="Parametrizar" icon="pi pi-link" className="p-button-success"
                        //         // style ={{marginLeft: '10px'}}
                        //         disabled={ !this.state.selectedProducts || this.state.selectedProducts.length === 0 } 
                        //         onClick={() => this.parametrize()}
                        //         />
                        <SplitButton label="Opções" 
                                    model={items} 
                                    className="p-button-success p-mr-2"
                                    />
                    ) : (
                        <Button label="Cancelar" icon="pi pi-times" className="p-button-danger"
                                style ={{marginLeft: '10px'}}
                                onClick={() => this.cancelParametrize()}
                                />
                    )
                    }

                </React.Fragment>
            )
        }

        const actionBodyTemplate = (buyProduct) => {
            return (
                <React.Fragment>
                    <Button title = "Ver produto parametrizado"
                            icon="pi pi-eye"
                            className="p-button-rounded p-button-primary p-mr-2"
                            style={ {marginLeft: '3px'} }
                            disabled={!buyProduct.parametrized}
                            onClick={() => this.viewProduct(buyProduct)} />
                </React.Fragment>
            );
        }

        const renderDeleteConfirmationFooter = () => {
            return (
                <div>
                    <Button label="Confirmar" icon="pi pi-check"
                            onClick={this.confirmDelete} autoFocus />
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({displayConfirmation: false})}
                            className="p-button-text" />
                </div>
            );
        
        }
        const renderDeparameterizeConfirmationFooter = () => {
            return (
                <div>
                    <Button label="Confirmar" icon="pi pi-check"
                            onClick={this.confirmDeparameterize} autoFocus />
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({displayDeparameterizeConfirmation: false})}
                            className="p-button-text" />
                </div>
            );
        }

        return (
            <div className="datatable-crud-demo">

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={this.dt} value={this.props.list}
                            selection={this.state.selectedProducts}
                            onSelectionChange={this.handleSelectionChange}
                            scrollable
                            scrollHeight="500px"
                            loading={this.props.loading}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    >

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="codigo" header="Código" sortable style ={ {width: '140px'} }></Column>
                    <Column field="descricao" header="Descrição" sortable style ={ {width: '140px'} }></Column>
                    <Column field="nomeFornecedor" header="Nome do Fornecedor" sortable style ={ {width: '140px'} }></Column>
                    <Column field="cnpjFornecedor" header="CNPJ do Fornecedor" sortable style ={ {width: '140px'} }></Column>
                    <Column field="ncm" header="NCM" body={rowData => GeneralServices.adjustNCM(rowData.ncm)} sortable style ={ {width: '140px'} }></Column>
                    <Column field="parametrized" header="Parametrizada" body={rowData => rowData.parametrized ? 'Sim' : 'Não'} sortable style ={ {width: '100px'} }></Column>
                    <Column field="unidadeComercializada" header="Unidade" sortable style ={ {width: '140px'} }></Column>
                    <Column body={actionBodyTemplate} style ={ {width: '160px'} }></Column>
                </DataTable>
            </div>

            <ProductDialog  save={this.updateProduct}
                            hideDialog={this.hideDialog}
                            visible={this.state.productDialog}
                            header="Produto parametrizado"
                            state={this.state.parametrizeProductState}
                            buyProduct={true}
                            disabled={true}
                             />

            <Dialog header="Deletar Produto"
                        visible={this.state.displayConfirmation}
                        modal = {true} //congela restante da tela
                        style={{ width: '350px' }}
                        footer={renderDeleteConfirmationFooter()}
                        onHide={() => this.setState({displayConfirmation: false})}>
                    <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                        <div style={{marginBottom: '10px'}}> Deseja confirmar exclusão? </div>
                    </div>
            </Dialog>

            <Dialog header="Desparametrizar Produto"
                        visible={this.state.displayDeparameterizeConfirmation}
                        modal = {true} //congela restante da tela
                        style={{ width: '350px' }}
                        footer={renderDeparameterizeConfirmationFooter()}
                        onHide={() => this.setState({displayDeparameterizeConfirmation: false})}>
                    <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                        <div style={{marginBottom: '10px'}}> Deseja confirmar desparametrização? </div>
                    </div>
            </Dialog>
        </div>
        )
    }


}  

export default BuyProductCrudTable