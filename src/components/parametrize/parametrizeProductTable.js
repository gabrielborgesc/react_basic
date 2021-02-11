import React from 'react'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import ProductService from '../../app/service/productService'
import * as popUp from '../toastr'
import { Dialog } from 'primereact/dialog'
import GeneralServices from '../../app/service/generalServices'

class ParametrizeProductTable extends React.Component {

    state = {
        codigo: null,
        descricao: '',
        ncm: null,
        tipo: '',
        unidadeComercializada: '',
        proportion: null,
        selectedProducts: null,
        productDialog: false,
        updateStockDialog: false,
        displayConfirmation: false,
        editId: null,
        updateStockId: null,
        inputProportionErrorClass: '',
        errorProportionMessage: '', 

    }
    constructor(){
        super();
        this.productService = new ProductService();

    }

    handleSelectionChange = async (e) => {
        await this.setState({selectedProducts: e.value})
       if(!this.state.selectedProducts || this.state.selectedProducts.length === 0){
           this.props.search()
       } else{
           this.props.setParametrizeFilteredProducts(this.state.selectedProducts)
       }
    }

    requestParametrize = () => {
        if(this.state.selectedProducts.length === 1){
            this.resetView()
            this.setState({displayConfirmation: true})
        } else{
            popUp.warningPopUp('Mais de um produto selecionado')
        }
    }
    
    resetView = () =>{
        this.setState({inputProportionErrorClass: ''})
        this.setState({errorProportionMessage: ''})
    }

    parametrize = () => {
        console.log('proportion', this.state.proportion)
        if(!this.state.proportion){
            this.setState({inputProportionErrorClass: 'is-invalid'})
            this.setState({errorProportionMessage: 'Informe a proporção'})
        }
        else{
            this.props.parametrize(this.state.selectedProducts[0], this.state.proportion)
            this.setState({displayConfirmation: false})
        }
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    render (){

        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="Confirmar" icon="pi pi-check" className="p-button-success" 
                    disabled = { !this.state.selectedProducts || this.state.selectedProducts.length === 0 }
                    // onClick = {this.parametrize}
                    onClick = {this.requestParametrize}
                    />
                </React.Fragment>
            )
        }

        const renderConfirmationFooter = () => {
            return (
                <div>
                    <Button label="Confirmar" icon="pi pi-check"
                            onClick={this.parametrize} autoFocus />
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({displayConfirmation: false})}
                            className="p-button-text" />
                </div>
            );
        }

        return (
            <>
            <div className="datatable-crud-demo">

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} ></Toolbar>

                <DataTable value={this.props.list}
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
                    <Column field="ncm" header="NCM" body={rowData => GeneralServices.adjustNCM(rowData.ncm)} sortable style ={ {width: '140px'} }></Column>
                    <Column field="tipo" header="Tipo" sortable style ={ {width: '140px'} }></Column>
                    <Column field="unidadeComercializada" header="Unidade" sortable style ={ {width: '140px'} }></Column>
                </DataTable>
            </div>
        </div>

        <Dialog header="Parametrizar produto"
                visible={this.state.displayConfirmation}
                modal = {true} //congela restante da tela
                style={{ width: '350px' }}
                footer={renderConfirmationFooter()}
                onHide={() => this.setState({displayConfirmation: false})}>
            {/* <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                <div style={{marginBottom: '10px'}}> Deseja confirmar parametrização? </div>
            </div> */}

            <div className="p-field">
                    <label htmlFor="proporcao">Conversão</label>
                    <input type="number"
                            className={"form-control " + this.state.inputProportionErrorClass}
                            value = {this.state.proportion}
                            name="proportion"
                            onChange={this.handleChange}
                            id="inputProportion"
                            placeholder="Digite a conversão"
                            disabled={this.props.disabled} 
                            />
                    <div className="invalid-feedback">{this.state.errorProportionMessage}</div>
                </div>
        </Dialog>
        </>
        )
    }


}  

export default ParametrizeProductTable