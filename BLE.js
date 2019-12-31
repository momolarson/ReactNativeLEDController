import React, { Component } from 'react';
import { 
  BleManager,
  BleError 
} from 'react-native-ble-plx';
import {
  View,
  Text
} from 'react-native';
import Base64 from './Base64'

export class BLE extends Component {
    constructor(props) {
        super(props);
        //BLE 
        this.manager = new BleManager()
        this.prefixUUID = "000100"
        this.suffixUUID = "-0000-1000-8000-00805f9b34fb"
        this.device = {};
        //bind functions
        this.UpdateDevice = this.UpdateDevice.bind(this)
        this.scanAndConnect = this.scanAndConnect.bind(this)
        this.serviceUUID = this.serviceUUID.bind(this)
        this.notifyUUID = this.notifyUUID.bind(this)
        this.writeUUID = this.writeUUID.bind(this)
        this._log = this._log.bind(this)
        this._logError = this._logError.bind(this)
        this.state = {
            "name": false,
            "status": false,
            "info" : ""
          };
    };

    componentDidMount (){
        this.scanAndConnect();
    };

    publishNewColor(newcolor){
      console.log(newcolor)
      this.setState({"status":"Changing Color to: " + newcolor,"color":newcolor})
      this.UpdateDevice("00010000-89BD-43C8-9231-40F6E305F96D", "00010001-89BD-43C8-9231-40F6E305F96D",newcolor)
    }

    /*
    componentWillReceiveProps(nextProps) {
        if (nextProps.color !== this.state.color) {
          console.log("BLE: changing color state")
          let newcolor = nextProps.color
          this.setState({"status":"Changing Color to: " + newcolor,"color":newcolor})
          this.UpdateDevice("00010000-89BD-43C8-9231-40F6E305F96D", "00010001-89BD-43C8-9231-40F6E305F96D",newcolor)
        }
    };
    */
   async UpdateDevice(service,characteristic,msg) { 
      try {
        // this.info("Updating Device")
        let base64 = Base64.btoa(unescape(encodeURIComponent(msg)));
        let LEDResponse = await this.device.writeCharacteristicWithResponseForService(service, characteristic, base64 )
        //await this.device.writeCharacteristicWithoutResponseForService(service, characteristic, msg )
        this.setState({"status":"Color Changed to: " + base64});
        return true;
      } catch(error){
        this._logError("UPDATE", error)
        return false;
      }
    };

    async scanAndConnect() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            this.setState({"status":"Scanning..."});
            console.log("Scanning...")
          if (error) {
            //App._logError("SCAN", error);
            //this.setState({"info":device.name});
            //_logError("SCAN", error)
            
            //return null;
          }
          console.log("device",device);
          if(device !== null){
            console.log("device is not null")
            this.device = device
            this.setState({"name":device.name});
            //console.log("Device:" + device.name)
          
          
          if (device.name === 'tuxpi') {
            this.setState({"status":"Connecting..."});
           // console.log("Connecting")
            this.manager.stopDeviceScan()
            device.connect()
              .then((device) => {
                this.setState({"status":"Discovering..."});
               // console.log("Discovering")
                return device.discoverAllServicesAndCharacteristics()
              })
              .then((device) => {
                this.setState({"status":"Setting notifications..."});
                console.log("Setting notifications")
                return device;
              })
              .then((device) => {
                this.setState({"status":"listening..."});
                console.log("listening")
                //this.device = device;
                return device;
              }, (error) => {
                console.log(this._logError("SCAN", error));
                //return null;
              })
          }
        }
        });
      };

      //end scan and connect

      serviceUUID(num) {
        return this.prefixUUID + num + "0" + this.suffixUUID 
      };
      
      notifyUUID(num) {
        return this.prefixUUID + num + "1" + this.suffixUUID
      };
      
      writeUUID(num) {
        return  this.prefixUUID + num + "2" + this.suffixUUID
      };

      _log = (text: string, ...args) => {
        const message = "[" + Date.now() % 10000 + "] " + text;
        this.setState({
          info: [message, ...this.state.info]
        });
      };

      _logError = (tag: string, error: BleError) => {
        this._log( tag +
            "ERROR(" +
            error.errorCode +
            "): " +
            error.message +
            "\nREASON: " +
            error.reason +
            " (att: " +
            error.attErrorCode +
            ", ios: " +
            error.iosErrorCode +
            ", and: " +
            error.androidErrorCode +
            ")"
        );
      };

    render() {
        return ( 
            <View >
                <Text>
                    Device Name: { this.state.name} 
                </Text>
                <Text>
                    Status: {this.state.status} 
                </Text>
                <Text>
                    info: {this.state.info} 
                </Text>
            </View>
        );
    }
}

export default BLE;