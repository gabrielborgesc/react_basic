import React from 'react'

import { Checkbox } from 'primereact/checkbox'
import ProductService from '../../app/service/productService'

class ProductTypesCheckBox extends React.Component{

    constructor(){
        super();
        this.productService = new ProductService();
    }

    render() {
        const typeList = this.productService.getTypeList()
        const options = typeList.map((option, index) => {
            return (
                <>
                {/* <Checkbox key = {index} value={option.value}> {option.label} </Checkbox> */}
                <Checkbox inputId={option.label} name="productType" value={option.value}
                        // onChange={this.props.onChange}
                        // checked={cities.indexOf('Chicago') !== -1} 
                        />
                <label htmlFor={option.label}>{option.label}</label>
            </>
            )
        })
        return(
            <div className="p-field-checkbox">
                {options}
            </div>
        )
    }

}

export default ProductTypesCheckBox