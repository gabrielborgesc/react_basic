import React from 'react'
import currecyFormater from 'currency-formatter'
import {MdModeEdit} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {GiConfirmed} from 'react-icons/gi'
import {GiCancel} from 'react-icons/gi'

class EntryTable extends React.Component{

    state = {
        year: '',
        month: '',
        type: '',
        status: '',
        description: '',
        value: null,
        updated: false
    }
    componentDidUpdate(){
        if(this.props.list && this.props.editId && !this.state.updated){
            const entry = this.props.list.find(entry => entry.id === this.props.editId)
            this.updateState(entry)
        }
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name
        this.setState({ [name]: value })
    }

    updateState(entry) {
        this.setState({year: entry.year})
        this.setState({month: entry.month})
        this.setState({type: entry.entryType})
        this.setState({status: entry.entryStatus})
        this.setState({description: entry.description})
        this.setState({value: entry.value})
        this.setState({updated: true})
    }

    render () {
        var rows = this.props.list.map(entry =>
            {   
                if(this.props.editId === entry.id){
                    return(
                        <tr key={entry.id} >
                            <td className="table-border"  >
                                <input  type="text"
                                        className="form-control "
                                        name="description"
                                        value = {this.state.description}
                                        onChange = {this.handleChange}
                                        // onKeyPress={this.handleKeypress}
                                        id="editDescription"/>
                            </td>

                            <td className="table-border" >{currecyFormater.format(entry.value, {locale: 'pt-BR'})}</td>

                            <td className="table-border" >
                                <input  type="text"
                                        className="form-control "
                                        name="year"
                                        value = {this.state.year}
                                        onChange = {this.handleChange}
                                        // onKeyPress={this.handleKeypress}
                                        id="editYear"/>
                                        </td>
                            <td className="table-border" >
                                <input  type="text"
                                        className="form-control "
                                        name="month"
                                        value = {this.state.month}
                                        onChange = {this.handleChange}
                                        // onKeyPress={this.handleKeypress}
                                        id="editMonth"/>
                            </td>
                            <td className="table-border" >
                                <input  type="text"
                                        className="form-control "
                                        name="type"
                                        value = {this.state.type}
                                        onChange = {this.handleChange}
                                        // onKeyPress={this.handleKeypress}
                                        id="editType"/>
                            </td>
                            <td className="table-border" >
                                <input  type="text"
                                        className="form-control "
                                        name="status"
                                        value = {this.state.status}
                                        onChange = {this.handleChange}
                                        // onKeyPress={this.handleKeypress}
                                        id="editStatus"/>
                            </td>
                            <td className="table-border" >{entry.user.name}</td>
                            <td className="table-border" >
                                <div className="btn-group">
                                    <button className="btn btn-primary" onClick = {e => {this.props.editButton(entry.id)} }><GiConfirmed /></button>
                                <div>    
                                    <button className="btn btn-danger right-button"
                                                    onClick = {e => {this.props.deleteButton(entry.id)} }><GiCancel /></button>
                                </div>
                                </div>
                                
                            </td>
                        </tr>
                    )
                }   
                else{
                    return(
                        <tr key={entry.id} >
                            <td className="table-border"  >{entry.description}</td>
                            <td className="table-border" >{currecyFormater.format(entry.value, {locale: 'pt-BR'})}</td>
                            <td className="table-border" >{entry.year}</td>
                            <td className="table-border" >{entry.month}</td>
                            <td className="table-border" >{entry.entryType}</td>
                            <td className="table-border" >{entry.entryStatus}</td>
                            <td className="table-border" >{entry.user.name}</td>
                            <td className="table-border" >
                                <div className="btn-group">
                                    <button className="btn btn-primary"
                                            style={ {float: 'left'} }
                                            onClick = {e => {this.props.editButton(entry.id)} }><MdModeEdit /></button>
                                <div >
                                    <button className="btn btn-danger right-button"
                                            style={ {float: 'left'} }
                                            onClick = {e => {this.props.deleteButton(entry.id)} }><AiTwotoneDelete /></button>
                                </div>
                                </div>
                                
                            </td>
                        </tr>
                    )
                }
            }
            )

        return(
            <div style={ {overflowX: 'auto'} }>
            <table className="table table-hover" >
                <thead>
                    <tr className="table-active">
                    <th className = "table-border" scope="col">Descrição</th>
                    <th className = "table-border" scope="col">Valor</th>
                    <th className = "table-border" scope="col">Ano</th>
                    <th className = "table-border" scope="col">Mês</th>
                    <th className = "table-border" scope="col">Tipo</th>
                    <th className = "table-border" scope="col">Situação</th>
                    <th className = "table-border" scope="col">Usuário</th>
                    <th className = "table-border" scope="col">Ações</th>
                    
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            </div>
        )
    }   
}

export default EntryTable