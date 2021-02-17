import React from 'react'

import { Dialog } from 'primereact/dialog'
import SelectMenu from '../selectMenu'
import ProductService from '../../app/service/productService'
import DialogFooter from '../dialogFooter'
import ConfirmationDialog from '../confirmationDialog'

class ProductDialog extends React.Component {

    state = {
        codigo: null,
        descricao: '',
        quantidade: null,
        ncm: null,
        tipo: '',
        unidadeComercializada: '',
        proporcao: null,
        inputCodigoErrorClass: '',
        errorCodigoMessage: '',
        inputDescricaoErrorClass: '',
        errorDescricaoMessage: '',
        inputNCMErrorClass: '',
        errorNCMMessage: '',
        inputTipoErrorClass: '',
        errorTipoMessage: '',
        inputUnidadeErrorClass: '',
        errorUnidadeMessage: '',
        didUpdated: false,
        visibleConfirmDialog: false
    }

    constructor(){
        super();
        this.productService = new ProductService();
        
    }

    componentDidUpdate(){
        if(this.props.visible && !this.state.didUpdated){
            this.setState({codigo: this.props.state.codigo})
            this.setState({descricao: this.props.state.descricao})
            this.setState({ncm: this.props.state.ncm})
            this.setState({tipo: this.props.state.tipo})
            this.setState({unidadeComercializada: this.props.state.unidadeComercializada})
            this.setState({proporcao: this.props.state.proporcao})
            this.setState({didUpdated: true})
            this.resetView()
        }
    }

    resetView = () => {
        this.setState({inputCodigoErrorClass: ''})
        this.setState({errorCodigoMessage: ''})
        this.setState({inputDescricaoErrorClass: ''})
        this.setState({errorDescricaoMessage: ''})
        this.setState({inputNCMErrorClass: ''})
        this.setState({errorNCMMessage: ''})
        this.setState({inputTipoErrorClass: ''})
        this.setState({errorTipoMessage: ''})
        this.setState({inputUnidadeErrorClass: ''})
        this.setState({errorUnidadeMessage: ''})
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    hideDialog = () => {
        this.setState({didUpdated: false})
        this.props.hideDialog('productDialog')
    } 
    
    checkData = () => {
        var check = true
        if(!this.state.codigo){
            this.setState({inputCodigoErrorClass: "is-invalid"})
            this.setState({errorCodigoMessage:"Código é obrigatório"})
            check = false
        }
        if(!this.state.descricao){
            this.setState({inputDescricaoErrorClass: "is-invalid"})
            this.setState({errorDescricaoMessage:"Descrição é obrigatória"})
            check = false
        }
        if(!this.state.ncm && this.state.ncm!==0){
            this.setState({inputNCMErrorClass: "is-invalid"})
            this.setState({errorNCMMessage:"NCM é obrigatório"})
            check = false
        }
        if(!this.state.tipo){
            this.setState({inputTipoErrorClass: "is-invalid"})
            this.setState({errorTipoMessage:"Tipo é obrigatório"})
            check = false
        }
        if(!this.state.unidadeComercializada){
            this.setState({inputUnidadeErrorClass: "is-invalid"})
            this.setState({errorUnidadeMessage:"Unidade é obrigatória"})
            check = false
        }

        return check
    }

    callSave = () => {
        this.resetView()
        if(this.checkData()){
            this.setState({visibleConfirmDialog: true})
        }
    }

    hideConfirmDialog = () => {
        this.setState({visibleConfirmDialog: false})
    }

    save = () => {
        var {codigo, descricao, ncm, tipo, unidadeComercializada} = this.state
        this.props.save({codigo, descricao, ncm, tipo, unidadeComercializada})
        this.setState({didUpdated: false})
        this.setState({visibleConfirmDialog: false})
    
    }

    render () {

        const productDialogFooter = (
            <DialogFooter save = {this.callSave} hideDialog = {this.hideDialog} disabled={this.props.disabled} />
        )

        const typeList = this.productService.getTypeList()

        return (
            <>
            <Dialog visible={this.props.visible} style={{ width: '450px' }}
                    header={this.props.header}
                    modal
                    className="p-fluid"
                    footer={productDialogFooter}
                    onHide={this.hideDialog}>
                <div className="p-field">
                    <label htmlFor="codigo">Código</label>
                    <input type="number"
                            className={"form-control " + this.state.inputCodigoErrorClass}
                            value = {this.state.codigo}
                            name="codigo"
                            onChange={this.handleChange}
                            id="inputCodigo"
                            placeholder="Digite o código"
                            disabled={this.props.disabled} 
                            />
                    <div className="invalid-feedback">{this.state.errorCodigoMessage}</div>
                </div>
                <br/>
                <div className="p-field">
                    <label htmlFor="ncm">NCM</label>
                    <input type="number"
                            className={"form-control " + this.state.inputNCMErrorClass}
                            value = {this.state.ncm}
                            name="ncm"
                            onChange={this.handleChange}
                            id="inputNCM"
                            placeholder="Digite o NCM"
                            disabled={this.props.disabled}  
                            />
                    <div className="invalid-feedback">{this.state.errorNCMMessage}</div>
                </div>
                <br/>
                <div className="p-field">
                    <label htmlFor="type">Tipo de produto</label>
                    <SelectMenu className={"form-control " + this.state.inputTipoErrorClass}
                                        name="tipo"
                                        list= {typeList} 
                                        value={this.state.tipo}
                                        onChange={this.handleChange}
                                        disabled={this.props.disabled} 
                                        />
                    <div className="invalid-feedback">{this.state.errorTipoMessage}</div>
                      
                </div>
                
                <br/>

                <div className="p-field">
                    <label htmlFor="description">Descrição</label>
                    <textarea   className={"form-control " + this.state.inputDescricaoErrorClass}
                                id="description"
                                name="descricao"
                                value={this.state.descricao}
                                style={{marginTop: '0px', marginBottom: '0px', height: '80px'}}
                                placeholder="Digite a descrição"
                                onChange = {this.handleChange}
                                disabled={this.props.disabled} 
                                />
                    <div className="invalid-feedback">{this.state.errorDescricaoMessage}</div>
                </div>
                {
                    this.props.buyProduct ? 
                    (   
                        <div className="p-field">
                            <br />
                    <label htmlFor="porporcao">Proporção</label>
                    <input type="text"
                                className={"form-control "}
                                id="proporcao"
                                name="proporcao"
                                value={this.state.proporcao}
                                onChange = {this.handleChange}
                                disabled={this.props.disabled} 
                                />
                    <div className="invalid-feedback">{this.state.errorDescricaoMessage}</div>
                    </div>   
                    ) : (
                        <>
                        </>
                    )
                }
                <br />
                
                <div className="p-field">
                    <label htmlFor="status">Unidade</label>
                    <input type="text"
                                    className={"form-control " + this.state.inputUnidadeErrorClass}
                                    value = {this.state.unidadeComercializada}
                                    name="unidadeComercializada"
                                    onChange={this.handleChange}
                                    id="inputUnidade"
                                    placeholder="Digite a unidade"
                                    disabled={this.props.disabled} 
                                    />
                    <div className="invalid-feedback">{this.state.errorUnidadeMessage}</div>
                </div>

            </Dialog>
            
            <ConfirmationDialog
                header="Editar produto"
                confimationMessage="Confirmar modificação no produto?"
                visible={this.state.visibleConfirmDialog && this.props.visible}
                confirm={this.save}
                hide={this.hideConfirmDialog}
                 />

            </>

        )
    }
}

export default ProductDialog