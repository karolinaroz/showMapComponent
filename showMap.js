import { LightningElement, api, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getAccountShippingAddress from'@salesforce/apex/showMapController.getAccountShippingAddress';
import performCallout from'@salesforce/apex/showMapController.performCallout';
//import getForecast from'@salesforce/apex/showMapController.getForecast';

export default class showMap extends LightningElement {

    @api recordId;
    @track recId; 
    @track mapMarkers; 
    @track zoomLevel;
    @track center;
    @track showFooter;
    @track temperature;
    @track windSpeed;
    @track clouds;
    @track imageUrl;
    @track description;
    @track city;
    @track isMapVisible = false;


    connectedCallback(){
        try{
            this.invokeApexCallbacks();
        } catch (error) {
            console.log('## error: ' + error);
        }
    }
 

    async invokeApexCallbacks() {

        var shippingCity;    
        var shippingPostalCode;
        var result = await getAccountShippingAddress({
            recordId : this.recordId
        })
        .then(result => {
                
                shippingCity = result.ShippingCity;

                if (shippingCity == null || shippingCity == undefined) {
                    this.isMapVisible = false;
                } else { 
                    this.isMapVisible = true;
                }

                shippingPostalCode = result.shippingPostalCode;

                this.mapMarkers = [{
                location: {
                    Street: result.ShippingStreet,
                    City: result.ShippingCity,
                    State: result.ShippingState                         
                }, 
                    value: result.Id,
                    title: result.ShippingStreet,
                    description: result.ShippingCity,
                }];
                

            })  .catch(error => {
                
                //this.showErrorMessage
                    
            });

        var result2 = await performCallout({
            city : shippingCity
            //postalCode: shippingPostalCode
        });

        this.imageUrl = result2.cityIcon;
        this.description = result2.cityWeather;
        this.temperature = result2.cityTemp + '°C';
        this.windSpeed = 'Wind speed: ' + result2.cityWindSpeed + 'm/s';
        this.clouds = 'Cloudiness: ' + result2.cityClouds + '%';
        this.city = shippingCity;

    }

}
