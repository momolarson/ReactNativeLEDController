const INITIAL_STATE = {
  BLEList: ['Simon Mignolet','Nathaniel Clyne','Dejan Lovren']
};

const BLEReducer = (state =[], action) => {
  switch (action.type) {
    case 'ADD_BLE':
      if(state.some(device => device.id === action.device.id) || !action.device.isConnectable || action.device.name === null){
        return state;
      } else {
          return [
            ...state,
            action.device
          ]
      }
      
        
    default:
      return state
  }
};

export default BLEReducer;