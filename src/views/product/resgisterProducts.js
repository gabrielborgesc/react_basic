import React from 'react'
import Card from '../../components/card'
import { withRouter } from 'react-router-dom'
import * as popUp from '../../components/toastr'

import { AuthContext } from '../../main/authProvider'
import ProductService from '../../app/service/productService'
import FileUploadCard from '../../components/fileUploadCard'
import { Button } from 'primereact/button'
import HandleErrorService from '../../app/service/handleErrorService'
import ProductDialog from '../../components/product/productDialog'

class ResgisterProduct extends React.Component {

    constructor(){
        super();
        this.productService = new ProductService();
    }

    state = {
        productDialog: false,
        uploadInProgress: false
    }

    hideDialog = () => {
        this.setState({productDialog: false})
    }

    manualRegister = () => {
        this.setState({productDialog: true})
    }

    saveProduct = product => {
        this.productService.save(product)
        .then(response => {
            console.log('response', response)
            popUp.successPopUp("Produto cadastrado com sucesso")
            this.setState({productDialog: false})
        }).catch(error => {
            HandleErrorService.handleError(this.props.history.push, error)
        })
    }

    setIfIsInProgress = (inProgress) => {
        this.setState({uploadInProgress: inProgress})
    }

    render() {
            return (
                <div className="bs-docs-section d-flex" style={{minHeight:'500px'}} >
                <Card title = "Importação de Arquivos">
                    <div className = "col-md-12">
                    <div className="row">
                    <div className = "col-md-5">
                        
                        </div>
                    </div>
                    </div>
                    <div className="bs-docs-section">
                        <Button 
                            label="Cadastrar manualmente"
                            icon="pi pi-plus"
                            onClick={this.manualRegister}
                            style = { {maxHeight: '35px', marginBottom: '8px'} }
                            disabled={this.state.uploadInProgress}
                        />
                        <FileUploadCard push = {this.props.history.push}
                                        uploadInProgress = {this.setIfIsInProgress} />                        
                    </div>
                </Card>

                <ProductDialog  save={this.saveProduct}
                                hideDialog={this.hideDialog}
                                visible={this.state.productDialog}
                                header="Cadastrar Produto"
                                state={{}}
                             />
            </div>
            )
        }

}

ResgisterProduct.contextType = AuthContext

export default withRouter(ResgisterProduct)