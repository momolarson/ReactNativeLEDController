import Base64 from '../Base64'

export const addBLE = (device) => ({
    type: "ADD_BLE",
    device
})

export const changedColor = (color) => ({
    type: "CHANGED_COLOR",
    newColor: color
})

export const connectedDevice = (device) => ({
    type: "CONNECTED_DEVICE",
    connectedDevice: device
});

export const changeStatus = (status) => ({
    type: "CHANGE_STATUS",
    status: status
});

//some thunks to control the BLE Device

export const startScan = () => {
    return (dispatch, getState, DeviceManager) => {
        // you can use Device Manager here
        console.log("thunk startScan: ", DeviceManager);
        const subscription = DeviceManager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                dispatch(scan());
                subscription.remove();
            }
        }, true);
      };
}

export const scan = () => {
    return (dispatch, getState, DeviceManager) => {
        //console.log("thunk Scan: ", DeviceManager);
        DeviceManager.startDeviceScan(null, null, (error, device) => {
            //this.setState({"status":"Scanning..."});
           // console.log("scanning...");
           dispatch(changeStatus("Scanning"));
          if (error) {
            console.log(error);
          }
          if(device !== null){
            dispatch(addBLE(device));
        }
        });
    }
}

export const connectDevice = (device) => {
    return (dispatch, getState, DeviceManager) => {
        //console.log('thunk connectDevice',device['BLE']);
        //this.setState({"status":"Connecting..."});
           // console.log("Connecting")
           dispatch(changeStatus("Connecting"));
           DeviceManager.stopDeviceScan()
           // this.device = device['BLE'];
            device.connect()
              .then((device) => {
                //this.setState({"status":"Discovering..."});
                //console.log("Discovering")
                dispatch(changeStatus("Discovering"));
                let characteristics = device.discoverAllServicesAndCharacteristics()
                console.log("characteristics:", characteristics);
                return characteristics;
              })
              .then((device) => {
               // this.setState({"status":"Setting notifications..."});
                //console.log("Setting notifications")
                dispatch(changeStatus("Setting Notifications"));
                return device;
              })
              .then((device) => {
                //this.setState({"status":"listening..."});
                //console.log("listening")
                dispatch(changeStatus("Listening"));
                dispatch(connectedDevice(device))
                //dispatch(NavigationActions.navigate({routeName:'ColorPicker'}));
                //this.props.navigation.navigate('ColorPicker');
                //this.device = device;
                return device;
              }, (error) => {
                console.log(this._logError("SCAN", error));
                //return null;
              })
    }
}

export const updateColor = (newcolor) => {
    return (dispatch, getState, DeviceManager) => {
        const state = getState();
        console.log("thunk update color: ", state.BLEs.connectedDevice);
        try {
            // this.info("Updating Device")
            let base64 = Base64.btoa(unescape(encodeURIComponent(newcolor)));
            let LEDResponse = state.BLEs.connectedDevice.writeCharacteristicWithResponseForService("00010000-89BD-43C8-9231-40F6E305F96D", "00010001-89BD-43C8-9231-40F6E305F96D", base64 )
            dispatch(changeStatus("Changing Color"));
            dispatch(changedColor(newcolor));
            return true;
          } catch(error){
            console.log("update Error:", error)
            return false;
          }
    }
}