import { MultiSelect } from 'primereact/multiselect';
import React from 'react'
import ProductService from '../app/service/productService';

class TableFilters extends React.Component{
    constructor(){
        super();
        this.productService = new ProductService();
    }

    renderCodigoFilter = (selectedCodes, getCodeList, list, name, onFilterChange, state) => {
        return (
            <MultiSelect className="p-column-filter" value={selectedCodes} options={getCodeList(list)}
                        appendTo={document.body}
                        style={{maxWidth: '100px'}}
                        name={name}   
                        onChange={(event) => onFilterChange(event, state)} placeholder="Código"
                // optionLabel="name" optionValue="name"
                />
        );
    }

    renderDescriptionFilter = (selectedDescriptions, getDescriptionList, list, name, onFilterChange, state, maxWidth) => {
        return (
            <MultiSelect className="p-column-filter" value={selectedDescriptions} options={getDescriptionList(list)}
                        appendTo={document.body}
                        style={{maxWidth: maxWidth}}  
                        name={name}  
                        onChange={(event) => onFilterChange(event, state)} placeholder="Descrição"
                // optionLabel="name" optionValue="name"
                    />
        );
    }

    renderNCMFilter = (selectedNCM, getNCMList, list, name, onFilterChange, state) => {
        return (
            <MultiSelect className="p-column-filter" value={selectedNCM} options={getNCMList(list)}
                        appendTo={document.body}
                        style={{maxWidth: '100px'}}  
                        name={name}  
                        onChange={(event) => onFilterChange(event, state)} placeholder="NCM"
                // optionLabel="name" optionValue="name"
                    />
        );
    }

    renderCfopFilter = (selectedCfops, getCfopList, list, name, onFilterChange, state) => {
        return (
            <MultiSelect className="p-column-filter" value={selectedCfops} options={getCfopList(list)}
                        appendTo={document.body}
                        style={{maxWidth: '100px'}}  
                        name={name} 
                        onChange={(event) => onFilterChange(event, state)} placeholder="CFOP"
                // optionLabel="name" optionValue="name"
                    />
        );
    }

    renderNumeroFilter = (selectedNumbers, getNumberList, list, name, onFilterChange, state) => {
        return (
            <MultiSelect className="p-column-filter" value={selectedNumbers} options={getNumberList(list)}
                        appendTo={document.body}
                        style={{maxWidth: '100px'}}  
                        name={name} 
                        onChange={(event) => onFilterChange(event, state)} placeholder="Número"
                // optionLabel="name" optionValue="name"
                    />
        );
    }

    renderSerieFilter = (selectedSeries, getSerieList, list, name, onFilterChange, state) => {
        return (
            <MultiSelect className="p-column-filter" value={selectedSeries} options={getSerieList(list)}
                        appendTo={document.body}
                        style={{maxWidth: '100px'}}  
                        name={name} 
                        onChange={(event) => onFilterChange(event, state)} placeholder="Série"
                // optionLabel="name" optionValue="name"
                    />
        );
    }

    renderModelFilter = (selectedModels, getModelList, list, name, onFilterChange, state) => {
        return (
            <MultiSelect className="p-column-filter" value={selectedModels} options={getModelList(list)}
                        appendTo={document.body}
                        style={{maxWidth: '100px'}}  
                        name={name} 
                        onChange={(event) => onFilterChange(event, state)} placeholder="Modelo"
                // optionLabel="name" optionValue="name"
                    />
        );
    }

    renderUnitFilter = (selectedUnits, getUnitList, list, name, onFilterChange, state) => {
        return (
            <MultiSelect className="p-column-filter" value={selectedUnits} options={getUnitList(list)}
                        appendTo={document.body}
                        style={{maxWidth: '100px'}}  
                        name={name} 
                        onChange={(event) => onFilterChange(event, state)} placeholder="Unidade"
                // optionLabel="name" optionValue="name"
                    />
        );
    }

}

export default TableFilters