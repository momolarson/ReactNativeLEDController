const INITIAL_STATE = {
  BLEList: [],
  color: '#800080',
  connectedDevice: {}
};

const BLEReducer = (state =INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_BLE':
      if(state.BLEList.some(device => device.id === action.device.id) || !action.device.isConnectable || action.device.name === null){
        return state;
      } else {
        const newBLE = [
              ...state.BLEList,
              action.device
            ]
         return {
           BLEList: newBLE,
           color: state.color,
           connectedDevice: state.connectedDevice
          };
      }
    case 'CHANGE_COLOR':
      return {
        BLEList: state.BLEList,
        color: action.newColor,
        connectedDevice: state.connectedDevice
      };
    case 'CONNECT_DEVICE':
      console.log("connect device", action);
      return {
        BLEList: state.BLEList,
        color: state.color,
        connectedDevice: action.connectedDevice
       };
    default:
      return state;
  }
};

export default BLEReducer;