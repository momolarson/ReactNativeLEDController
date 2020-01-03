const INITIAL_STATE = {
  BLEList: [],
  color: '#800080',
  connectedDevice: {},
  status: 'disconnected'
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
           connectedDevice: state.connectedDevice,
           status: action.status
          };
      }
    case 'CHANGED_COLOR':
      return {
        BLEList: state.BLEList,
        color: action.newColor,
        connectedDevice: state.connectedDevice,
        status: action.status
      };
    case 'CONNECTED_DEVICE':
      console.log("Reducer connected device", action);
      return {
        BLEList: state.BLEList,
        color: state.color,
        connectedDevice: action.connectedDevice,
        status: action.status
       };
    case 'CHANGE_STATUS':
      console.log("change status:", action.status)
      return {
        BLEList: state.BLEList,
        color: state.color,
        connectedDevice: action.connectedDevice,
        status: action.status}
    default:
      return state;
  }
};

export default BLEReducer;