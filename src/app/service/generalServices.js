import React from 'react'
import currecyFormater from 'currency-formatter'

class GeneralServices extends React.Component {
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }

    static valueBodyTemplate = (value) => {
        return currecyFormater.format(value, {locale: 'pt-BR'})
    }

    static getCurrentYear = () => {
        return new Date().getFullYear()
    }

    static convertToUsDate = (date) => {
        if(!date) return ''
        var dateArray = date.split('-')
        return dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2]
    }
    static convertToBrDate = (date) => { //yyyy-dd-MM
        var dateArray = date.split('-')
        return dateArray[1] + '-' + dateArray[2] + '-' + dateArray[0]
    }

    static checkValidHour = (hour) => {
      var checkHour = false
      var checkMinutes = false
      var length = hour ? hour.length === 5 : null
      if(length){
          var hourArray = hour.split(':')
          var intHour  = parseInt(hourArray[0], 10)
          var minutes = parseInt(hourArray[1], 10)
          if(intHour>=0 && intHour<24){
              checkHour=true
          }
          if(minutes>=0 && minutes<=60){
              checkMinutes=true
          }
      }
      return length && checkHour && checkMinutes
    }

    static compareIntValues( product1, product2 ) {
        var value1 = parseInt(product1.value, 10)
        var value2 = parseInt(product2.value, 10)
        if ( value1 < value2 ){
          return -1;
        }
        if ( value1 > value2){
          return 1;
        }
        return 0;
    }

    static compareStringValues(product1, product2){
        var value1 = product1.label
        var value2 = product2.label
        if ( value1 < value2 ){
          return -1;
        }
        if ( value1 > value2){
          return 1;
        }
        return 0;
    }

    static compareTimestampByDecreasing(moviment1, moviment2){
        const value1 = moviment1.timestamp
        const value2 = moviment2.timestamp
        if ( value1 > value2 ){
            return -1;
          }
        else if ( value1 < value2){
            return 1;
          } else {
                if(moviment1.id > moviment2.id){
                return -1;
                } 
                else if(moviment1.id < moviment2.id){
                return 1;
                } else {
                    return 0;
            }
        }
    }

    static compareTimestampByIncreasing(moviment1, moviment2){
        const value1 = moviment1.timestamp
        const value2 = moviment2.timestamp
        if ( value1 < value2 ){
            return -1;
        }
        else if ( value1 > value2){
            return 1;
        } else {
              if(moviment1.id < moviment2.id){
                return -1;
              } 
              else if(moviment1.id > moviment2.id){
                return 1;
              } else {
                    return 0;
              }
          }
    }

    static sortStockSheet(productStockSheet, increasing){
        if(increasing === true){
            productStockSheet.sort(this.compareTimestampByIncreasing)
        } else{
            productStockSheet.sort(this.compareTimestampByDecreasing)
        }
        return productStockSheet
    }

    static calculateBalance(productStockSheet){
        productStockSheet = this.sortStockSheet(productStockSheet, true)
        for(var i=0; i<productStockSheet.length; i++){
            var moviment = productStockSheet[i]
            if(moviment.tipoAtualizacao !== 'MANUAL'){
                var previousMoviment = productStockSheet[i-1]
                moviment.saldo = previousMoviment.saldo + moviment.entrada - moviment.saida
            }
        }
        return this.sortStockSheet(productStockSheet, false)
    }

    static adjustNCM = (ncm) => {
      if(ncm === 0){ 
          return '00000000'
      }
      else{
          return ncm
      }
  }
}

export default GeneralServices