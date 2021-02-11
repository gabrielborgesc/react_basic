import React from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'


class FileUploadCard extends React.Component{

    constructor() {
        super();
        this.hiddenFileInput = React.createRef();
    }

    state = {
        files: [],
        selectedFiles: null,
    }

    handleClick = () => {
        this.hiddenFileInput.current.click()
    }

    onFileChange = async event => {
        var array = this.state.files
        array.push(...event.target.files)
        await this.setState({files: array})
        event.target.value = null
      }
    
    delete = async () => {
        var array = this.state.files
        Array.from(this.state.selectedFiles).forEach(element => {
            const index = this.state.files.indexOf(element)
            array.splice(index, 1) 
        });
        await this.setState({files: array})
        this.setState({selectedFiles: null})
    }


    upload = () => {
        //your code to send the files in (this.state.files) to an api
    }

    render() {

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
                        onClick={this.upload}
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
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FileUploadCard