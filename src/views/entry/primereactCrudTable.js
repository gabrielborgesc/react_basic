import React from 'react'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
// import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { Toolbar } from 'primereact/toolbar'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Dialog } from 'primereact/dialog'

import EntryService from '../../app/service/entryService'
import SelectMenu from '../../components/selectMenu'
import currecyFormater from 'currency-formatter'
import * as popUp from '../../components/toastr'
import HandleErrorService from '../../app/service/handleErrorService'
import GeneralServices from '../../app/service/generalServices'

class CrudTable extends React.Component {

    state = {
        year: '',
        month: '',
        type: '',
        status: '',
        value: null,
        user: {
            email: ''
        },
        description: '',
        selectedEntries: null,
        globalFilter: null,
        entryDialog: false,
        submitted: false,
        displayConfirmation: false,
        editId: null,
    }
    constructor(){
        super()
        this.toast = React.createRef()
        this.dt = React.createRef()
        this.entryService = new EntryService();

    }

    username = (rowData) => {
        return rowData.user.name
    }

    editProduct = (entry) => {
        this.setState({year: entry.year})
        this.setState({month: entry.month})
        this.setState({type: entry.entryType})
        this.setState({status: entry.entryStatus})
        this.setState({value: entry.value})
        this.setState({user: entry.user})
        this.setState({description: entry.description})
        this.setState({entryDialog: true})
        this.setState({editId: entry.id})
    }

    hideDialog = () => {
        this.setState({submitted: false})
        this.setState({entryDialog: false})
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    exportCSV = () => {
        this.dt.current.exportCSV();
    }

    delete = () => {
        if(this.state.selectedEntries){
            this.setState({displayConfirmation: true})
        } else {
            popUp.warningPopUp("Nenhum lançamento foi selecionado para exclusão")
        }
    }

    updateEntry = () => {
        this.entryService.update(this.state.editId,
            {
                year: this.state.year,
                month: this.state.month,
                type: this.state.type,
                status: this.state.status,
                value: this.state.value,
                user: this.state.user.id,
                description: this.state.description
            })
            .then(response => {
                popUp.successPopUp("Lançamento editado com sucesso")
                this.props.search()
            }).catch(error => {
                HandleErrorService.handleError(this.props.push, error)
        })
        this.setState({entryDialog: false})
    }

    updateStatus = (id, status) => {
        this.entryService.updateStatus(id, { status } )
        .then(response => {
            popUp.successPopUp("Lançamento " + status + " com sucesso")
            this.props.search()
        }).catch(error => {
            popUp.errorPopUp(error.response.data)
        })
    }

    confirmDelete = () => {
        this.setState({displayConfirmation: false})
        this.props.deleteMulipleEntries(this.state.selectedEntries)
        this.setState({selectedEntries: null})
    }

    render (){

        const rightToolbarTemplate = () => {
            return (
                <React.Fragment>
                    <Button label="Deletar" icon="pi pi-trash" className="p-button-danger"
                            onClick={this.delete}
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
                    <Button title = "Efetivar"
                            icon="pi pi-check-circle" 
                            className="p-button-rounded p-button-success"
                            disabled={rowData.entryStatus !== "PENDENTE"}
                            onClick={() => this.updateStatus(rowData.id, 'confirmado')} />

                    <Button title = "Cancelar" 
                            icon="pi pi-times-circle" 
                            className="p-button-rounded p-button-danger right-button"
                            style={ {marginLeft: '3px'} }
                            disabled={rowData.entryStatus !== "PENDENTE"}
                            onClick={() => this.updateStatus(rowData.id, 'cancelado')} />

                    <Button title = "Editar"
                            icon="pi pi-pencil"
                            className="p-button-rounded p-button-primary p-mr-2"
                            style={ {marginLeft: '3px'} }
                            onClick={() => this.editProduct(rowData)} />
                </React.Fragment>
            );
        }

        const entryDialogFooter = (
            <React.Fragment>
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={this.updateEntry} />
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={this.hideDialog} />
            </React.Fragment>
        )

        const renderDeleteConfirmationFooter = () => {
            return (
                <div>
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({displayConfirmation: false})}
                            className="p-button-text" />
                    <Button label="Confirmar" icon="pi pi-check"
                            onClick={this.confirmDelete} autoFocus />
                </div>
            );
        }

        const yearList = this.entryService.getYearList()
        const typeList = this.entryService.getTypeList()
        const statusList = this.entryService.getStatusList()
        const monthList =  this.entryService.getMonthList()

        return (
            <div className="datatable-crud-demo">
            <Toast ref={this.toast} />

            <div className="card">
                <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={this.dt} value={this.props.list}
                            selection={this.state.selectedEntries}
                            onSelectionChange={(e) => this.setState({selectedEntries: e.value})}
                            scrollable
                            loading={this.props.loading}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    // globalFilter={this.state.globalFilter} 
                    >

                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="description" header="Descrição" sortable style ={ {width: '140px'} }></Column>
                    <Column field="value" header="Valor" body={GeneralServices.valueBodyTemplate} sortable style ={ {width: '140px'} }></Column>
                    <Column field="year" header="Ano" sortable style ={ {width: '140px'} }></Column>
                    <Column field="month" header="Mês" sortable style ={ {width: '140px'} }></Column>
                    <Column field="entryType" header="Tipo" sortable style ={ {width: '140px'} }></Column>
                    <Column field="entryStatus" header="Status" sortable style ={ {width: '140px'} }></Column>
                    <Column field="user" header="Usuário" body={this.username} sortable style ={ {width: '140px'} }></Column>
                    <Column body={actionBodyTemplate} style ={ {width: '160px'} }></Column>
                </DataTable>
            </div>

            <Dialog visible={this.state.entryDialog} style={{ width: '450px' }}
                    header="Editar lançamento"
                    modal
                    className="p-fluid"
                    footer={entryDialogFooter}
                    onHide={this.hideDialog}>
                <div className="p-field">
                    <label htmlFor="year">Ano</label>
                    <SelectMenu className={"form-control "}
                            name="year"
                            list={yearList} 
                            value={this.state.year}
                            onChange={this.handleChange}/> 
                </div>
                <br/>
                <div className="p-field">
                    <label htmlFor="month">Mês</label>
                    <SelectMenu className={"form-control " }
                                        name="month"
                                        list= {monthList}
                                        value={this.state.month}
                                        onChange={this.handleChange}/>
                </div>
                <br/>
                <div className="p-field">
                    <label htmlFor="type">Tipo de Lançamento</label>
                    <SelectMenu className={"form-control " }
                                        name="type"
                                        list= {typeList} 
                                        value={this.state.type}
                                        onChange={this.handleChange}/>  
                </div>
                <br/>
                <div className="p-field">
                    <label htmlFor="status">Status do Lançamento</label>
                    <SelectMenu className="form-control"
                                        name="status"
                                        list= {statusList} 
                                        value={this.state.status}
                                        onChange={this.handleChange}/>
                </div>
                <br/>
                <div className="p-field p-col">
                        <label htmlFor="value">Valor</label>
                        <InputNumber id="value"
                                     value={this.state.value}
                                     name="value"
                                     onValueChange={this.handleChange}
                                     mode="currency"
                                     currency="BRL"
                                     locale="pt-BR"
                                     placeholder="Digite o valor" />
                </div>
                    <br/>
                <div className="p-field">
                    <label htmlFor="user">Usuário</label>
                    <InputText id="user" value={this.state.user.email}  disabled/>
                </div>
                <div className="p-field">
                    <label htmlFor="description">Descrição</label>
                    <textarea   className={"form-control " }
                                id="description"
                                name="description"
                                value={this.state.description}
                                style={{marginTop: '0px', marginBottom: '0px', height: '80px'}}
                                placeholder="Digite a descrição"
                                onChange = {this.handleChange} />
                </div>

            </Dialog>
            <Dialog header="Deletar lançamento"
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

export default CrudTable