import React from 'react'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'

import currecyFormater from 'currency-formatter'
import * as popUp from '../../components/toastr'
import GeneralServices from '../../app/service/generalServices'
import ProductDialog from '../../components/product/productDialog'
import TableFilters from '../../components/tableFilters'
import TransactionService from '../../app/service/transactionService'

class TransactionByProductTable extends React.Component {

    state = {
        codigo: null,
        descricao: '',
        ncm: null,
        tipo: '',
        unidadeComercializada: '',
        selectedTransactions: null,
        productDialog: false,
        displayConfirmation: false,
        dateView: "timestamp",
        productDialogHeader: '',
        codigoField: 'productInfo.codigo',
        selectedCodes: null,
        descricaoField: 'productInfo.descricao',
        selectedDescriptions: null,
        NCMField: 'productInfo.ncm',
        selectedNCM: null,
        cfopField: 'productInfo.cfop',
        selectedCfops: null,
        numberField: 'numero',
        selectedNumbers: null,
        serieField: 'serie',
        selectedSeries: null,
        modelField: 'modelo',
        selectedModels: null,
        unitField: 'productInfo.unidadeComercializada',
        selectedUnits: null,
    }
    constructor(){
        super()
        this.toast = React.createRef()
        this.dt = React.createRef()
        this.transactionService = new TransactionService();
        this.tableFilters = new TableFilters();

    }

    valueBodyTemplate = (rowData) => {
        return currecyFormater.format(rowData.value, {locale: 'pt-BR'})
    }

    viewProduct = (transaction) => {
        var product = transaction.product //CONFERIR SE É BUYPRODUCT
        if(product){
            this.setState({codigo: product.codigo})
            this.setState({descricao: product.descricao})
            this.setState({ncm: product.ncm})
            this.setState({tipo: product.tipo})
            this.setState({unidadeComercializada: product.unidadeComercializada})
            this.setState({productDialogHeader: 'Produto'})
            this.setState({productDialog: true})
        } else{
            var buyProduct = transaction.buyProduct
            if(buyProduct){
                var parametrizedProduct = buyProduct.product
                if(parametrizedProduct){
                    this.setState({codigo: parametrizedProduct.codigo})
                    this.setState({descricao: parametrizedProduct.descricao})
                    this.setState({ncm: parametrizedProduct.ncm})
                    this.setState({tipo: parametrizedProduct.tipo})
                    this.setState({unidadeComercializada: parametrizedProduct.unidadeComercializada})
                    this.setState({productDialogHeader: 'Parametrizado com: '})
                    this.setState({productDialog: true})
                }
            } else{
                popUp.warningPopUp("O produto envolvido não consta no banco de dados")
            }
        }
        
    }

    hideDialog = () => {
        this.setState({productDialog: false})
    }

    exportCSV = async () => {
        await this.setState({dateView: "dhEmi"})
        this.dt.current.exportCSV();
        this.setState({dateView: "timestamp"})
    }

    delete = () => {
        if(this.state.selectedTransactions){
            this.setState({displayConfirmation: true})
        } else {
            popUp.warningPopUp("Nenhum produto foi selecionado para exclusão")
        }
    }

    confirmDelete = () => {
        this.setState({displayConfirmation: false})
        this.setState({selectedTransactions: null})
        if(this.state.selectedTransactions){
            var listOfId = []
            Array.from(this.state.selectedTransactions).forEach(selectedTransaction => {
                listOfId.push(selectedTransaction.id)
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

        const buyProductNotParametrized = (buyProduct) => {
            if(buyProduct && !buyProduct.product)
                return true
            return false
        }

        const actionBodyTemplate = (transaction) => {
            return (
                <React.Fragment>
                    <Button title = "Ver produto"
                            icon="pi pi-eye"
                            className={ "p-button-rounded p-mr-2 " + (buyProductNotParametrized(transaction.buyProduct) ? "p-button-secondary" : "") }
                            style={ {marginLeft: '3px'} }
                            disabled={buyProductNotParametrized(transaction.buyProduct)}
                            onClick={() => this.viewProduct(transaction)} />
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
        const codeFilterElement = this.tableFilters.renderCodigoFilter(this.state.selectedCodes, this.transactionService.getCodeList,
            this.props.list, "selectedCodes", this.onFilterChange, this.state.codigoField)
        
        //Descrição Filter
        const descriptionFilterElement = this.tableFilters.renderDescriptionFilter(this.state.selectedDescriptions,
            this.transactionService.getDescriptionList, this.props.list, "selectedDescriptions",
            this.onFilterChange, this.state.descricaoField, '120px')

        //NCM Filter
        const NCMFilterElement = this.tableFilters.renderNCMFilter(this.state.selectedNCM, this.transactionService.getNCMList,
            this.props.list, "selectedNCM", this.onFilterChange, this.state.NCMField)
        
        //CFOP Filter
        const cfopFilterElement = this.tableFilters.renderCfopFilter(this.state.selectedCfops, this.transactionService.getCfopList,
            this.props.list, "selectedCfops", this.onFilterChange, this.state.cfopField)
        
        //Numero Filter
        const numberFilterElement = this.tableFilters.renderNumeroFilter(this.state.selectedNumbers, this.transactionService.getNumberList,
            this.props.list, "selectedNumbers", this.onFilterChange, this.state.numberField)

        //Serie Filter
        const serieFilterElement = this.tableFilters.renderSerieFilter(this.state.selectedSeries, this.transactionService.getSerieList,
            this.props.list, "selectedSeries", this.onFilterChange, this.state.serieField)
        
        //Modelo Filter
        const modelFilterElement = this.tableFilters.renderModelFilter(this.state.selectedModels, this.transactionService.getModelList,
            this.props.list, "selectedModels", this.onFilterChange, this.state.modelField)

        //Unidade Filter      
        const unitFilterElement = this.tableFilters.renderUnitFilter(this.state.selectedUnits, this.transactionService.getUnitList,
            this.props.list, "selectedUnits", this.onFilterChange, this.state.unitField)

        return (
            <div className="datatable-crud-demo">
            <Toast ref={this.toast} />

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={this.dt} value={this.props.list}
                            className="p-datatable-sm"
                            selection={this.state.selectedTransactions}
                            onSelectionChange={(e) => this.setState({selectedTransactions: e.value})}
                            scrollable
                            scrollHeight="500px"
                            loading={this.props.loading}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando de {first} ao {last} de {totalRecords} movimentações"
                    >

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>

                    <Column field={this.state.codigoField} header="Código" sortable style ={ {width: '140px'} }
                    filter filterElement={codeFilterElement} />

                    <Column field={this.state.descricaoField} header="Descrição do Produto" sortable style ={ {width: '140px'} } 
                    filter filterElement={descriptionFilterElement}/>

                    <Column field={this.state.NCMField} header="NCM" sortable style ={ {width: '140px'} } body={rowData => GeneralServices.adjustNCM(rowData.productInfo.ncm)}
                    filter filterElement={NCMFilterElement}/>

                    <Column field={this.state.cfopField} header="CFOP" sortable style ={ {width: '140px'} } 
                    filter filterElement={cfopFilterElement} />

                    <Column field = "valor" header="Valor Total" body={transaction => GeneralServices.valueBodyTemplate(transaction.valor)} sortable style ={ {width: '140px'} }></Column>
                    <Column field={this.state.dateView} header="Data de Emissão" body={rowData => rowData.dhEmi.substring(0, 21)} sortable style ={ {width: '140px'} }></Column>
                    
                    <Column field={this.state.numberField} header="Número" sortable style ={ {width: '140px'} } 
                    filter filterElement={numberFilterElement}/>

                    <Column field="nomeFornecedorOuCliente" header="Nome Forn/Cliente" sortable style ={ {width: '200px'} }></Column>
                    
                    <Column field={this.state.serieField} header="Série" sortable style ={ {width: '100px'} } 
                    filter filterElement={serieFilterElement} />
                    
                    <Column field={this.state.modelField} header="Modelo" sortable style ={ {width: '120px'} } 
                    filter filterElement={modelFilterElement} />

                    <Column field="tipo" header="Tipo" sortable style ={ {width: '120px'} }></Column>
                    {/* <Column field="situacao" header="Situação" sortable style ={ {width: '180px'} }></Column> */}
                    <Column field = "valorUnitario" header="Valor Unitário" body={transaction => GeneralServices.valueBodyTemplate(transaction.valorUnitario)} sortable style ={ {width: '140px'} }></Column>
                    <Column field="quantidade" header="Quantidade" sortable style ={ {width: '140px'} }></Column>
                    
                    <Column field={this.state.unitField} header="Unidade" sortable style ={ {width: '140px'} } 
                    filter filterElement={unitFilterElement}/>

                    <Column body={actionBodyTemplate} style ={ {width: '160px'} }></Column>
                </DataTable>
            </div>

            <ProductDialog  
                            hideDialog={this.hideDialog}
                            visible={this.state.productDialog}
                            header={this.state.productDialogHeader}
                            state={this.state}
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
        </div>
        )
    }


}  

export default TransactionByProductTable