import React from 'react'

import { Dialog } from 'primereact/dialog'
import DialogFooter from '../dialogFooter'
import ConfirmationDialog from '../confirmationDialog'
// import { Calendar } from 'primereact/calendar'
import { InputMask } from 'primereact/inputmask'
import GeneralServices from '../../app/service/generalServices'

class UpdateStockDialog extends React.Component {

    state = {
        quantidade: '',
        updateStockDate: '',
        updateStockHour: '',
        didUpdated: false,
        inputQuantidadeErrorClass: '',
        errorQuantidadeMessage: '',
        inputUpadateDateErrorClass: '',
        errorUpadateDateMessage: '',
        inputUpadateHourErrorClass: '',
        errorUpadateHourMessage: '',
        visibleConfirmDialog: false,
        calendarFocus: false

    }

    componentDidUpdate(){
        if(this.props.visible && !this.state.didUpdated){
            this.setState({quantidade: this.props.state.quantidade})
            this.setState({updateStockDate: this.props.state.updateStockDate})
            this.setState({updateStockHour: this.props.state.updateStockHour})
            this.setState({didUpdated: true})
            this.resetView()
        }
    }

    hideDialog = () => {
        this.setState({didUpdated: false})
        this.setState({updateStockDate: ''})
        this.props.hideDialog('updateStockDialog')
    }

    callSave = () => {
        this.resetView()
        if(this.checkData()){
            this.setState({visibleConfirmDialog: true})
        }
    }

    save = () => {
        var product = {
            quantidade: this.state.quantidade,
            dataAtualizacaoEstoque: this.state.updateStockDate + " - " + this.state.updateStockHour
        }
        this.props.save(product)
        this.setState({didUpdated: false})
        this.setState({visibleConfirmDialog: false})
    }

    hideConfirmDialog = () => {
        this.setState({visibleConfirmDialog: false})
    }

    checkData = () => {
        var check = true
        if(!this.state.quantidade){
            this.setState({inputQuantidadeErrorClass: "is-invalid"})
            this.setState({errorQuantidadeMessage:"Informe a quantidade"})
            check = false
        }
        if(isNaN(new Date(GeneralServices.convertToUsDate(this.state.updateStockDate)).getTime())){
            this.setState({inputUpadateDateErrorClass: "is-invalid"})
            this.setState({errorUpadateDateMessage:"Informe uma data válida"})
            check = false
        }
        if(!GeneralServices.checkValidHour(this.state.updateStockHour)){
            this.setState({inputUpadateHourErrorClass: "is-invalid"})
            this.setState({errorUpadateHourMessage:"Informe um horário válido"})
            check = false
        }
        return check;
    }

    resetView = () => {
        this.setState({inputQuantidadeErrorClass: ''})
        this.setState({errorQuantidadeMessage: ''})
        this.setState({inputUpadateDateErrorClass: ''})
        this.setState({errorUpadateDateMessage: ''})
        this.setState({inputUpadateHourErrorClass: ''})
        this.setState({errorUpadateHourMessage: ''})
    }

    handleChange = (e) => {
        const value = e.target.value
        const name = e.target.name
        this.setState({[name]: value})
    }

    handleKeypress = e => {
        //it triggers by pressing the enter key
      if (e.key === "Enter") {
        this.callSave();
      }
    }

    // calendarFocus = () => {
    //     this.setState({calendarFocus: true})
    // }

    render() {

        const updateDialogFooter = (
            <DialogFooter save = {this.callSave} hideDialog={this.hideDialog} />
        )

        // const currentYear = GeneralServices.getCurrentYear()

        return(
            <>
            <Dialog visible={this.props.visible && !this.state.calendarFocus} style={{ width: '450px'}}
                header={this.props.header}
                modal
                className="p-fluid"
                footer={updateDialogFooter}
                onHide={this.hideDialog}>
                <div className="p-field">
                    <label htmlFor="quantidade">Quantidade Em Estoque</label>
                    <input type="number"
                            className={"form-control " + this.state.inputQuantidadeErrorClass }
                            value = {this.state.quantidade}
                            name="quantidade"
                            onChange={this.handleChange}
                            onKeyPress={this.handleKeypress}
                            id="inputQuantidade"
                            placeholder="Digite a quantidade"
                            />
                    <div className="invalid-feedback"> {this.state.errorQuantidadeMessage} </div>
                </div>
                <br/>
                <div className="p-field">
                {/* <div className="p-field p-col-12 p-md-10">
                    <label htmlFor="basic">Data da contagem de estoque</label>
                    <Calendar id="touchUI" name="beginDate" dateFormat="dd-mm-yy"
                            value={this.state.beginDate} onChange={this.handleChange}
                            monthNavigator yearNavigator touchUI yearRange={"2010:" + currentYear}
                            placeholder="Informe a data"
                            onFocus	= {this.calendarFocus}
                            />
                            
                </div> */}
                        <label htmlFor="date">Data da contagem de estoque</label>
                        <InputMask id="date"
                                name="updateStockDate"
                                className={"form-control " + this.state.inputUpadateDateErrorClass }
                                mask="99-99-9999"
                                value={this.state.updateStockDate}
                                placeholder="dd-mm-aaaa"
                                onChange={this.handleChange}
                                onKeyPress={this.handleKeypress}
                                 />
                        <div className="invalid-feedback"> {this.state.errorUpadateDateMessage} </div>
                    <br />
                        <label htmlFor="hour">Horário da contagem de estoque</label>
                        <InputMask id="hour"
                                name="updateStockHour"
                                className={"form-control " + this.state.inputUpadateHourErrorClass }
                                mask="99:99"
                                value={this.state.updateStockHour}
                                placeholder="hh:mm"
                                onChange={this.handleChange}
                                onKeyPress={this.handleKeypress}
                                 />
                        <div className="invalid-feedback"> {this.state.errorUpadateHourMessage} </div>

                </div>
            </ Dialog>

            <ConfirmationDialog
                header="Atualizar estoque"
                confimationMessage="Confirmar atualização de estoque?"
                visible={this.state.visibleConfirmDialog && this.props.visible}
                confirm={this.save}
                hide={this.hideConfirmDialog}
                 />
            </>
            
        )
    }

}

export default UpdateStockDialog