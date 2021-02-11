import React from 'react'

import { Message } from 'primereact/message'

class FileUploadNotice extends React.Component{

    render(){
        return(
            <div className="p-col-12 p-md-3 "
                style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'}}>
                <Message severity={this.props.severity} text={this.props.message}/>
            </div>
        )
    }
    

}

export default FileUploadNotice