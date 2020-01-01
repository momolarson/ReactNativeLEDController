import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Text } from 'native-base';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { withNavigation } from 'react-navigation';


class BLEList extends Component {
  handleClick = (device) => {
    console.log('clicked',this.props);
  }
  render() {           
    console.log("BLEList",this.props.BLEList);
    return (
      <Container>
        <Header />
        <Content>
        <List>
        {this.props.BLEList.map(BLE =>{
          console.log("BLE",BLE);
          return <ListItem key={BLE.id}  button={true} onPress={() => this.handleClick({BLE})} ><Text>{BLE.name}</Text></ListItem> 
        })}
          </List>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    BLEList : state.BLEs
  };
}

export default connect(mapStateToProps)(withNavigation(BLEList));