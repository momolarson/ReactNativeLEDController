import React from 'react';
import { connect } from 'react-redux';
import { Container, Text} from 'native-base';
import { withNavigation } from 'react-navigation';

class BLE extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        return ( 
            <Container>
                <Text style={{backgroundColor: this.props.color}}>
                    Status: {this.props.status} 
                </Text>
                <Text>Color: {this.props.color}</Text>
            </Container>
        );
    }
}

function mapStateToProps(state){
  return{
    BLEList : state.BLEs.BLEList,
    color:state.BLEs.color,
    connectedDevice: state.BLEs.connectedDevice,
    status: state.BLEs.status
  };
}

const mapDispatchToProps = dispatch => ({
  addBLE: device => dispatch(addBLE(device))
})

export default connect(mapStateToProps,mapDispatchToProps,null,{ forwardRef: true })(withNavigation(BLE));