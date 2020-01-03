import React, { Component } from 'react';
import { Container, Header, Footer, Content, List, ListItem, Text } from 'native-base';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {updateColor} from './actions';
import { withNavigation } from 'react-navigation';
import { ColorPicker, TriangleColorPicker,toHsv,fromHsv } from 'react-native-color-picker'



class LEDColorPicker extends Component {
  ble;
  constructor() {
    super()
    this.onColorChange = this.onColorChange.bind(this)
    this.ble = React.createRef();
    //State
    this.state = {slider:0,color:toHsv('purple'),BLEcolor:toHsv('purple')}
  }

  componentDidMount(){
    this.setState({color:toHsv(this.props.color)});
  }

  onColorChange(color) {
    this.setState({"color": color })
    this.props.updateColor(fromHsv(color));
  }

  render() {           
    return (
      <Container>
        <Header />
        <ColorPicker
            color={toHsv(this.state.color)}
            onColorChange={(colorval) => this.setState({color: colorval})}
            onColorSelected={this.onColorChange}
            hideSliders={false}
            style={{flex: 1}}
          />
          <Footer>
        </Footer>
      </Container>
    );
  }
}

function mapStateToProps(state){
  return{
    color : state.BLEs.color
  };
}

const mapDispatchToProps = dispatch => ({
  updateColor: color => dispatch(updateColor(color))
})

export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(LEDColorPicker));