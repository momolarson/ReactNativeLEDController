import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Text, Footer } from 'native-base';
import BLE from './BLE';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { withNavigation } from 'react-navigation';
import {connectDevice} from './actions';


class BLEList extends Component {
  constructor(props){
    super(props);
  }

  handleClick = (device) => {
    //this.ble.current.handleClick(device);
    this.props.connectDevice(device);
    //this.props.navigation.navigate('ColorPicker');
  }
  render() {           
    return (
      <Container>
        <Header />
        <Content>
        <List>
        {this.props.BLEList.map(BLE =>{
          ///console.log("BLE",BLE);
          return <ListItem key={BLE.id}  button={true} onPress={() => this.handleClick({BLE})} ><Text>{BLE.name}</Text></ListItem> 
        })}
          </List>
        </Content>
        <Footer>
          <BLE ref={this.ble}></BLE>
        </Footer>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    BLEList : state.BLEs['BLEList']
  };
}

const mapDispatchToProps = dispatch => ({
  connectDevice: device => dispatch(connectDevice(device))
})

export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(BLEList));