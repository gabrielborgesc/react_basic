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
import TableFilters from '../../components/tableFilters'
import GeneralServices from '../../app/service/generalServices'
import UpdateStockDialog from '../../components/product/updateStockDialog'
import HandleErrorService from '../../app/service/handleErrorService'

class InventoryTable extends React.Component {

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
        displayUndoUpdateStockConfirmation: false,
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
        updateStockDialog: false,
        productToUpdateId: null,
        checkLaunch: false
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

    hideDialog = (name) => {
        this.setState({[name]: false})
    }


    onFilterChange = (event, filterField) => {
        const name = event.target.name
        this.dt.current.filter(event.value, filterField, 'in');
        this.setState({[name]: event.value})
    }

    updateStock = (rowData) => {
        this.setState({productToUpdateId: rowData.id})
        this.setState({updateStockDialog: true})
    }

    cancelStock = (rowData) => {
        this.setState({productToUpdateId: rowData.id})
        this.setState({displayUndoUpdateStockConfirmation: true})
    }

    save = (product) => {
        product.id = this.state.productToUpdateId
        this.props.updateStockFunction(product)
        this.setState({productToUpdateId: null})
        this.setState({updateStockDialog: false})
    }

    confirmUndoUpdateStock = () => {
        this.props.undoUpdateStockFunction(this.state.productToUpdateId)
        this.setState({productToUpdateId: null})
        this.setState({displayUndoUpdateStockConfirmation: false})
    }

    confirmInvetoryLaunch = () => {
        this.productService.updateMutipleProductsStock({
            productsList: this.props.updatedProductsList
        })
        .then(response => {
            popUp.successPopUp("Lancçamento de Invetário concluído com sucesso")
            this.props.search()
            this.setState({checkLaunch: false})
            this.props.resetUpdatedProductsList()
        }).catch(error => {
            HandleErrorService.handleError(this.props.push, error)
        })
    }

    checkLaunch = async () => {
        await this.onFilterChange({
            target: {name: 'selectedCodes'},
            value: null
        }, this.state.codigoField)

        await this.onFilterChange({
            target: {name: 'selectedDescriptions'},
            value: null
        }, this.state.descricaoField)

        await this.onFilterChange({
            target: {name: 'selectedNCM'},
            value: null
        }, this.state.NCMField)

        await this.onFilterChange({
            target: {name: 'selectedCfops'},
            value: null
        }, this.state.cfopField)

        await this.onFilterChange({
            target: {name: 'selectedUnits'},
            value: null
        }, this.state.unitField)

        this.setState({checkLaunch: true})
    }

    render (){

        const rightToolbarTemplate = () => {
            return (
                <React.Fragment>
                </React.Fragment>
            )
        }

        const leftToolbarTemplate = () => {
            return (
                <React.Fragment>
                    {
                        this.state.checkLaunch ? (
                            <>
                            <Button label="Confirmar" icon="pi pi-check" className="p-button-success"
                                onClick={this.confirmInvetoryLaunch}
                            />
                            <Button label="Voltar" icon="pi pi-undo" className="p-button-primary"
                                style={{marginLeft: '8px'}}
                                onClick={() => this.setState({checkLaunch: false})}
                            />
                            </>
                        ) : (
                            <Button label="Conferir Lançamento" icon="pi pi-eye" className="p-button-primary"
                            onClick={this.checkLaunch}
                            />
                        )
                    }
                    
                </React.Fragment>
            )
        }

        const stockBody = (rowData) => {
            return (
                <React.Fragment>
                    <Button label={rowData.quantidade}
                    className="p-button-rounded p-button-text p-button-secondary p-mr-2"
                    style={ {marginLeft: '3px'} }
                    />
                    {
                        this.props.updatedProductsList.some(element => element.id === rowData.id) ? (
                            <>
                            <Button title = "Desfazer alteração"
                                icon="pi pi-times"
                                className="p-button-rounded p-button-danger p-mr-2"
                                style={ {marginLeft: '3px'} }
                                onClick={() => this.cancelStock(rowData)}
                                />
                            </>
                        ) : (
                                <Button title = "Lançar estoque"
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-success p-mr-2"
                                style={ {marginLeft: '3px'} }
                                onClick={() => this.updateStock(rowData)}
                                />
                        )
                    }
                    
                    
                </React.Fragment>
            );
        }

        const renderUndoUpdateStockConfirmationFooter = () => {
            return (
                <div>
                    <Button label="Confirmar" icon="pi pi-check"
                            onClick={this.confirmUndoUpdateStock} autoFocus />
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

                <DataTable ref={this.dt}
                            value={this.state.checkLaunch ? this.props.updatedProductsList : this.props.list}
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
                            filter={!this.state.checkLaunch} filterElement={codeFilterElement}
                            />
                    <Column field={this.state.descricaoField} header="Descrição" sortable style ={ {width: '55px'} }
                            filter={!this.state.checkLaunch} filterElement={descriptionFilterElement}
                            />
                    <Column field={this.state.NCMField} header="NCM" body={rowData => GeneralServices.adjustNCM(rowData.ncm)} sortable style ={ {width: '20px'} }
                            filter={!this.state.checkLaunch} filterElement={NCMFilterElement} 
                    />

                    <Column field={this.state.cfopField} header="CFOP" sortable style ={ {width: '20px'} }
                            filter={!this.state.checkLaunch} filterElement={cfopFilterElement} 
                    />
                    
                    <Column field="tipo" header="Tipo" sortable style ={ {width: '30px'} } />

                    <Column field={this.state.unitField} header="Unidade" sortable style ={ {width: '25px'} }
                            filter={!this.state.checkLaunch} filterElement={unitFilterElement} 
                    />
                    <Column field="quantidade" header="Estoque" body={stockBody} sortable style ={ {width: '20px'} } />

                    {/* <Column body={actionBodyTemplate} style ={ {width: '20px'} }></Column> */}
                    <Column field="timestamp" header="Última atualização manual de estoque"
                            body={rowData => rowData.dataAtualizacaoEstoque} 
                            sortable style ={ {width: '33px'} }></Column>
                </DataTable>
            </div>
                <UpdateStockDialog  save={this.save}
                            hideDialog={this.hideDialog}
                            visible={this.state.updateStockDialog}
                            header="Atualizar Estoque"
                            date={this.props.date}
                            hour={this.props.hour}
                />
                <Dialog header="Desfazer Alteração"
                        visible={this.state.displayUndoUpdateStockConfirmation}
                        modal = {true} //congela restante da tela
                        style={{ maxWidth: '400px' }}
                        footer={renderUndoUpdateStockConfirmationFooter()}
                        onHide={() => this.setState({displayUndoUpdateStockConfirmation: false})}>
                    <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                        <div style={{marginBottom: '10px'}}> Deseja desfazer a alteração de estoque? </div>
                    </div>
                </Dialog>
        </div>
        )
    }


}  

export default InventoryTable