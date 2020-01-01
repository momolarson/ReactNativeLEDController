import React, { Component } from 'react';
import { 
  BleManager,
  BleError 
} from 'react-native-ble-plx';
import {
  View
} from 'react-native';

import { connect } from 'react-redux';
import {addBLE} from './actions';

import BLEList from './BLElist';
import { Container, Header, Content, List, ListItem, Text} from 'native-base';
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
      console.log('BLE props', this.props);
      const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            this.scanAndConnect();
            subscription.remove();
        }
    }, true);
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

    scanAndConnect() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            this.setState({"status":"Scanning..."});
          if (error) {
            console.log(error);
            //App._logError("SCAN", error);
            //this.setState({"info":device.name});
            //_logError("SCAN", error)
            
            //return null;
          }
          if(device !== null){
           // console.log("device is not null")
            this.device = device
            this.setState({"name":device.name});
            //console.log("Device:" + device.name)
            this.props.addBLE(device);
          
          // if (device.name === 'tuxpi') {
          //   this.setState({"status":"Connecting..."});
          //  // console.log("Connecting")
          //   this.manager.stopDeviceScan()
          //   device.connect()
          //     .then((device) => {
          //       this.setState({"status":"Discovering..."});
          //      // console.log("Discovering")
          //       return device.discoverAllServicesAndCharacteristics()
          //     })
          //     .then((device) => {
          //       this.setState({"status":"Setting notifications..."});
          //       console.log("Setting notifications")
          //       return device;
          //     })
          //     .then((device) => {
          //       this.setState({"status":"listening..."});
          //       console.log("listening")
          //       //this.device = device;
          //       return device;
          //     }, (error) => {
          //       console.log(this._logError("SCAN", error));
          //       //return null;
          //     })
          // }
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

      handleClick = (device) => {
        console.log('clicked',device['BLE']);
        this.setState({"status":"Connecting..."});
           // console.log("Connecting")
            this.manager.stopDeviceScan()
            device['BLE'].connect()
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

    render() {
        return ( 
            <Container>
              <Header />
                <Text>
                    Device Name: { this.state.name} 
                </Text>
                <Text>
                    Status: {this.state.status} 
                </Text>
                <Text>
                    info: {this.state.info} 
                </Text>
                <Content>
        <List>
        {this.props.BLEList.map(BLE =>{
          return <ListItem key={BLE.id}  button={true} onPress={() => this.handleClick({BLE})} ><Text>{BLE.name}</Text></ListItem> 
        })}
          </List>
        </Content>
            </Container>
        );
    }
}

function mapStateToProps(state){
  console.log(state);
  return{
    BLEList : state.BLEs
  };
}

const mapDispatchToProps = dispatch => ({
  addBLE: device => dispatch(addBLE(device))
})

export default connect(mapStateToProps,mapDispatchToProps)(BLE);