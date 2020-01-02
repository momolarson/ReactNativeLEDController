export const addBLE = (device) => ({
    type: "ADD_BLE",
    device
})

export const changeColor = (color) => ({
    type: "CHANGE_COLOR",
    newColor: color
})

export const connectDevice = (device) => ({
    type: "CONNECT_DEVICE",
    connectedDevice: device
});