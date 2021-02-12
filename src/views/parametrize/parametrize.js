import React from 'react'
import { withRouter } from 'react-router-dom'

import { AuthContext } from '../../main/authProvider'
import ParametrizeProduct from './parameterizeProduct'

class Parametrize extends React.Component {

    render(){
        return(
            <>
            <ParametrizeProduct push = {this.props.history.push} />
            </>
        )
    }
    
}

Parametrize.contextType = AuthContext

export default withRouter(Parametrize)