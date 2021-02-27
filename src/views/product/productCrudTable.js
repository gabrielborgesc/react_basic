import React from 'react'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'

import currecyFormater from 'currency-formatter'
import * as popUp from '../../components/toastr'
import ProductService from '../../app/service/productService'
import HandleErrorService from '../../app/service/handleErrorService'
import ProductDialog from '../../components/product/productDialog'
import UpdateStockDialog from '../../components/product/updateStockDialog'
import TableFilters from '../../components/tableFilters'
import GeneralServices from '../../app/service/generalServices'

class ProductCrudTable extends React.Component {

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
        editId: null,
        updateStockId: null,
        codigoField: 'codigo',
        selectedCodes: null,
        descricaoField: 'descricao',
        selectedDescriptions: null,
        NCMField: 'ncm',
        selectedNCM: null,
        cfopField: 'cfop',
        selectedCfops: null,
        unitField: 'unidadeComercializada',
        selectedUnits: null,
    }
    constructor(){
        super()
        this.toast = React.createRef()
        this.dt = React.createRef()
        this.productService = new ProductService();
        this.tableFilters = new TableFilters();

    }

    valueBodyTemplate = (rowData) => {
        return currecyFormater.format(rowData.value, {locale: 'pt-BR'})
    }
    
    editProduct = (product) => {
        this.setState({codigo: product.codigo})
        this.setState({descricao: product.descricao})
        this.setState({ncm: product.ncm})
        this.setState({tipo: product.tipo})
        this.setState({unidadeComercializada: product.unidadeComercializada})
        this.setState({productDialog: true})
        this.setState({editId: product.id})
        
    }

    updateStock = (product) => {
        this.setState({quantidade: product.quantidade})
        this.setState({updateStockId: product.id})
        this.setState({updateStockDialog: true})

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
    
    updateProduct = (product) => {
            this.productService.update(this.state.editId, product)
            .then(response => {
                popUp.successPopUp("Produto editado com sucesso")
                this.props.search()
            }).catch(error => {
                HandleErrorService.handleError(this.props.push, error)
        })
        this.setState({productDialog: false})
    }
    
    updateProductStock = (product) => {
        this.productService.updateStock(this.state.updateStockId, product)
        .then(response => {
            popUp.successPopUp("Produto editado com sucesso")
            this.props.search()
        }).catch(error => {
            HandleErrorService.handleError(this.props.push, error)
    })
    this.setState({updateStockDialog: false})
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

    onFilterChange = (event, filterField) => {
        const name = event.target.name
        this.dt.current.filter(event.value, filterField, 'in');
        this.setState({[name]: event.value})
    }

    render (){

        const rightToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="Deletar" icon="pi pi-trash" className="p-button-danger"
                            onClick={this.delete}
                            disabled = {this.props.disableDeleteButton}
                            />
                </React.Fragment>
            )
        }

        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    {/* <FileUpload mode="basic" accept="*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" /> */}
                    <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={this.exportCSV} />
                </React.Fragment>
            )
        }

        const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button title = "Atualizar estoque"
                            icon="pi pi-book"
                            className="p-button-rounded p-button-success p-mr-2"
                            style={ {marginLeft: '3px'} }
                            onClick={() => this.updateStock(rowData)} />
                    <Button title = "Editar"
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-primary p-mr-2"
                            style={ {marginLeft: '3px'} }
                            onClick={() => this.editProduct(rowData)} />
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

        //Código filter
        const codeFilterElement = this.tableFilters.renderCodigoFilter(this.state.selectedCodes, this.productService.getCodeList, this.props.list,
            "selectedCodes", this.onFilterChange, this.state.codigoField)
        
        //Descrição Filter
        const descriptionFilterElement = this.tableFilters.renderDescriptionFilter(this.state.selectedDescriptions,
            this.productService.getDescriptionList, this.props.list,
            "selectedDescriptions", this.onFilterChange, this.state.descricaoField, '300px')

        //NCM Filter
        const NCMFilterElement = this.tableFilters.renderNCMFilter(this.state.selectedNCM, this.productService.getNCMList,
            this.props.list, "selectedNCM", this.onFilterChange, this.state.NCMField)

        //NCM Filter
        const cfopFilterElement = this.tableFilters.renderCfopFilter(this.state.selectedCfops, this.productService.getCfopList,
            this.props.list, "selectedCfops", this.onFilterChange, this.state.cfopField)

        //Unidade Filter      
        const unitFilterElement = this.tableFilters.renderUnitFilter(this.state.selectedUnits, this.productService.getUnitList, this.props.list,
            "selectedUnits", this.onFilterChange, this.state.unitField)        

        return (
            <div className="datatable-crud-demo">
            <Toast ref={this.toast} />

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={this.dt} value={this.props.list}
                            className="p-datatable-sm"
                            rowHover
                            selection={this.state.selectedProducts}
                            onSelectionChange={(e) => this.setState({selectedProducts: e.value})}
                            scrollable
                            scrollHeight="500px"
                            // rowHover
                            loading={this.props.loading}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    >

                    <Column selectionMode="multiple" headerStyle={{ width: '10px'}}></Column>
                    <Column field={this.state.codigoField} header="Código" sortable
                            style ={ {width: '18px'} }
                            filter filterElement={codeFilterElement}
                            />
                    <Column field={this.state.descricaoField} header="Descrição" sortable style ={ {width: '55px'} }
                            filter filterElement={descriptionFilterElement}
                            />
                    <Column field={this.state.NCMField} header="NCM" body={rowData => GeneralServices.adjustNCM(rowData.ncm)} sortable style ={ {width: '20px'} }
                            filter filterElement={NCMFilterElement} 
                    />

                    <Column field={this.state.cfopField} header="CFOP" sortable style ={ {width: '20px'} }
                            filter filterElement={cfopFilterElement} 
                    />
                    
                    <Column field="tipo" header="Tipo" sortable style ={ {width: '30px'} } />

                    <Column field={this.state.unitField} header="Unidade" sortable style ={ {width: '25px'} }
                    filter filterElement={unitFilterElement} 
                    />
                    <Column field="quantidade" header="Estoque" sortable style ={ {width: '20px'} }></Column>
                    <Column body={actionBodyTemplate} style ={ {width: '20px'} }></Column>
                    <Column field="timestamp" header="Última atualização manual de estoque"
                            body={rowData => rowData.dataAtualizacaoEstoque} 
                            sortable style ={ {width: '33px'} }></Column>
                </DataTable>
            </div>

            <ProductDialog  save={this.updateProduct}
                            hideDialog={this.hideDialog}
                            visible={this.state.productDialog}
                            header="Editar Produto"
                            state={this.state}
                             />
            
            <UpdateStockDialog  save={this.updateProductStock}
                            hideDialog={this.hideDialog}
                            visible={this.state.updateStockDialog}
                            header="Atualizar Estoque"
                             />

            <Dialog header="Deletar Produto"
                        visible={this.state.displayConfirmation}
                        modal = {true} //congela restante da tela
                        style={{ maxWidth: '350px' }}
                        footer={renderDeleteConfirmationFooter()}
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

export default ProductCrudTable