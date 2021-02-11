import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../components/card'

import { AuthContext } from '../main/authProvider'

import { Button } from 'primereact/button'

class MenuHome extends React.Component{

    render() {
        return(
            <div className="bs-docs-section" >
                <Card title="Importação de arquivos">
                    Importe as notas fiscais para que o sistema faça todo o controle de estoque e movimentação de produtos
                    <br />
                    <a href="#/register"> 
                    <Button 
                            label="Ir para a importação"
                            icon="pi pi-upload"
                            style={ {maxHeight: '35px', marginTop: '5px'} }
                        />
                    </a>

                </Card>
                <Card title="Busca de Produtos cadastrados">
                    Busque, edite e delete os seus produtos cadastrados
                    <br/>
                    <a href="#/searchProducts"> 
                    <Button 
                            label="Ir para os produtos"
                            icon="pi pi-arrow-right"
                            style={ {maxHeight: '35px', marginTop: '5px'} }
                        />
                    </a>

                </Card>
                <Card title="Movimentações">
                    Veja todas as movimentações realizadas
                    <br/>
                    <a href="#/transactions">
                    <Button 
                            label="Ir para as movimentações"
                            icon="pi pi-sort-alt"
                            style={ {maxHeight: '35px', marginTop: '5px'} }
                        />
                    </a>
                </Card>
                <Card title="Parametrização de Produtos">
                    Faça a parametrização dos produtos comprados para que o sistema possa usá-los para o controle
                    <br/>
                    <a href="#/parameterize">
                    <Button 
                            label="Ir para as parametrizações"
                            icon="pi pi-link"
                            style={ {maxHeight: '35px', marginTop: '5px'} }
                        />
                    </a>
                </Card>
                <div className="d-flex" />

            </div>

        )
    }

}

MenuHome.contextType = AuthContext

export default withRouter(MenuHome)