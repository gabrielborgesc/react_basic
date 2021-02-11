import React from 'react'
import Card from '../../components/card'
import { withRouter } from 'react-router-dom'

import { Button } from 'primereact/button'

import { AuthContext } from '../../main/authProvider'
import TransactionByProduct from './transactionByProduct'
import TransactionService from '../../app/service/transactionService'

class Transactions extends React.Component {

    constructor(){
        super();
        this.transactionService = new TransactionService();
    }

    state = {
        productLabel: 'Por produto',
        NFLabel: 'Por nota',
        currentLabel: '',
        transactionList: []
    }

    componentDidMount(){
        this.setState({currentLabel: this.state.productLabel})
    }

    changeLabel = (label) => {
        this.setState({currentLabel: label})
    }

    render() {

        return (
                   
            <div className="bs-docs-section" >
                
                <Card title = "Movimentações">
                <div className="p-col-12 p-md-3 "
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'}}> 
                <Button label={this.state.productLabel}
                        className={this.state.currentLabel === this.state.productLabel ? " " : "p-button-text"}
                        onClick={ () => this.changeLabel(this.state.productLabel)} />                    
                <Button label={this.state.NFLabel}
                        className={this.state.currentLabel === this.state.NFLabel ? " " : "p-button-text"}
                        onClick={ () => this.changeLabel(this.state.NFLabel)} />
                </div>
                   {
                       this.state.currentLabel === this.state.productLabel ? 
                       (
                            <TransactionByProduct push={this.props.history.push} list={this.state.transactionList} />
                       ) :
                       (
                           <div />
                       )
                   }
                </Card>
                <div className="d-flex "/>
            </div>
              
        )
    }


}

Transactions.contextType = AuthContext

export default withRouter(Transactions)