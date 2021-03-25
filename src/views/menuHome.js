import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../components/card'

import { AuthContext } from '../main/authProvider'

import { Button } from 'primereact/button'

class MenuHome extends React.Component{

    render() {
        return(
            <div className="bs-docs-section" >
                <Card title="Bluetooth">
                    Aplicação para comunicação com Device via bluetooth
                    <br />
                    <Button 
                            label="Enviar dados"
                            icon="pi pi-upload"
                            style={ {maxHeight: '35px', marginTop: '5px'} }
                            // onClick={}
                        />
                </Card>
                <div className="d-flex" />

            </div>

        )
    }

}

MenuHome.contextType = AuthContext

export default withRouter(MenuHome)