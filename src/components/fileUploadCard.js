import React from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import FileService from '../app/service/fileService'
import HandleErrorService from '../app/service/handleErrorService'
import { ProgressBar } from 'primereact/progressbar'
import GeneralServices from '../app/service/generalServices'
import FileUploadNotice from './fileUploadNotice'
import ProgressService from '../app/service/progressService'
import * as popUp from './toastr'
import { Dialog } from 'primereact/dialog'


class FileUploadCard extends React.Component{

    constructor() {
        super();
        this.fileService = new FileService();
        this.progressService = new ProgressService();
        this.hiddenFileInput = React.createRef();
        this.generalServices = new GeneralServices();
    }

    state = {
        files: [],
        selectedFiles: null,
        progress: 0,
        completedUpload: false,
        uploadInProgress: false,
        enableProgressBar: false,
        getProgressError: 0,
        noticeSeverity:'',
        noticeMessage:'',
        notice: false,
        displayConfirmation: false
    }

    handleClick = () => {
        this.setState({progress: 0})
        this.hiddenFileInput.current.click()
        this.setState({notice: false})
    }

    onFileChange = async event => {
        var array = this.state.files
        array.push(...event.target.files)
        await this.setState({files: array})
        event.target.value = null
      }
    
    delete = async () => {
        if(this.state.selectedFiles){
            var array = this.state.files
            Array.from(this.state.selectedFiles).forEach(element => {
                const index = this.state.files.indexOf(element)
                array.splice(index, 1) 
            });
            await this.setState({files: array})
            this.setState({selectedFiles: null})
        } else{
            popUp.warningPopUp("Nenhum produto foi selecionado para exclusão")
        }
    }

    uploadInProgress = IsInProgress => {
        this.setState({notice: true})
        this.setState({uploadInProgress: IsInProgress})
        this.props.uploadInProgress(IsInProgress)
    }

    doCompleteUpload = () => {
        this.setState({completedUpload: true})
        this.setState({progress: 100})
        this.setState({files: []})
        this.uploadInProgress(false)
        this.setState({noticeSeverity: "success"})
        this.setState({noticeMessage: "Upload concluído"})
    }

    doFailUpload = () => {
        this.setState({completedUpload: true})
        this.setState({files: []})
        this.uploadInProgress(false)
        this.setState({noticeSeverity: "error"})
        this.setState({noticeMessage: "Falha no upload"})
    }

    requestUpload = () => {
        this.setState({displayConfirmation: true})
    }

    upload = () => {
        this.setState({displayConfirmation: false})
        this.setState({enableProgressBar: true})
        this.setState({completedUpload: false})
        var bodyFormData = new FormData();
        for (const file of this.state.files) {
            bodyFormData.append('files', file);
          }
        const timestamp = Date.now();
        bodyFormData.append('key', timestamp)
        bodyFormData.append('description', 'File upload')
        this.uploadInProgress(true)
        this.fileService.mutipleUpload(bodyFormData)
        // .then(response => {
        //   popUp.successPopUp(response.data.numberOfRegistredProducts + " novos produtos cadastrados")
        // //   this.doCompleteUpload()
        // //   this.deleteProgress(timestamp)
        // }).catch(error => {
        //     HandleErrorService.handleError(this.props.push, error)
        //     // this.uploadInProgress(true)
        // })
        this.getProgress(timestamp)
    }

    getProgress = async progressKey => {
        await this.generalServices.sleep(1*1000)
        if(!this.state.completedUpload)
        {
            this.progressService.getProgress(progressKey)
        .then(async response => {
            var progress = response.data.progress
            if(parseInt(this.state.progress,10) !== 100){
                if(progress > 1) {
                    progress = parseInt(progress, 10)
                } else if(progress > 0){
                    progress = progress.toFixed(1)
                }
                this.setState({progress})
                await this.generalServices.sleep(1*1000)
                this.getProgress(progressKey)
            } else{ // progress ===100
                this.doCompleteUpload()
                this.deleteProgress(progressKey)
            }
            
        }).catch(async error => {
            HandleErrorService.handleError(this.props.push, error)
            await this.generalServices.sleep(1*1000)
            this.setState({getProgressError: this.state.getProgressError+1})
            if(this.state.getProgressError<5){
                this.getProgress(progressKey)
            } else{
                this.doFailUpload()
                this.setState({getProgressError: 0})
            }
        })
        }
        else{
            this.setState({progress: 100})
        }
    }

    deleteProgress = key => {
        this.progressService.deleteProgress(key)
    }

    render() {
        
        const renderConfirmationFooter = () => {
            return (
                <div>
                    <Button label="Confirmar" icon="pi pi-check"
                            onClick={this.upload} autoFocus />
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => this.setState({displayConfirmation: false})}
                            className="p-button-text" />
                </div>
            );
        }

        return (
            <div className = "card mb-3">
                <div className = "card-header">
                <Button 
                        label="Escolher arquivos"
                        icon="pi pi-plus"
                        onClick={this.handleClick}
                        style={ {maxHeight: '35px'} }
                        disabled={this.state.uploadInProgress}
                        />
                <Button 
                        label="Upload"
                        icon="pi pi-upload"
                        style = { {maxHeight: '35px', marginLeft: '8px'} }
                        onClick={this.requestUpload}
                        disabled={!this.state.files.length || this.state.uploadInProgress} 
                        />
                <Button 
                        label="Deletar"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        style = { {maxHeight: '35px', marginLeft: '8px'} }
                        onClick={this.delete}
                        disabled={!this.state.files.length || this.state.uploadInProgress} 
                        />
                        
                <input  type="file"
                        name="file"
                        accept=".zip"
                        ref={this.hiddenFileInput}
                        onChange={this.onFileChange}
                        multiple
                        style={{display:'none'}}/>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bs-component">
                            <DataTable value={this.state.files}
                                        selection={this.state.selectedFiles}
                                        onSelectionChange={(e) => this.setState({selectedFiles: e.value})}
                                        scrollable
                                        scrollHeight="400px"
                                        dataKey="name" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                        ginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                        >
                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                <Column field="name" header="Nome do arquivo" sortable></Column>
                            </DataTable>
                            <br />
                            {this.state.enableProgressBar ? (
                                <>
                                <ProgressBar value={this.state.progress} />
                                {this.state.uploadInProgress || !this.state.notice ? (
                                    <div />
                                ) : (
                                    <FileUploadNotice severity={this.state.noticeSeverity} message={this.state.noticeMessage}/>
                                )
                                }
                                </>
                            ) : (
                            
                                <div/>
                            )
                            }
                            
                            </div>
                        </div>
                    </div>
                </div>
                <Dialog header="Upload"
                        visible={this.state.displayConfirmation}
                        modal = {true} //congela restante da tela
                        style={{ width: '350px' }}
                        footer={renderConfirmationFooter()}
                        onHide={() => this.setState({displayConfirmation: false})}>
                    <div className="confirmation-content row" style={{marginLeft: '10px'}}>
                        <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem', marginRight: '10px'}} />
                        <div style={{marginBottom: '10px'}}> Deseja confirmar upload? </div>
                    </div>
            </Dialog>
            </div>
        )
    }
}

export default FileUploadCard