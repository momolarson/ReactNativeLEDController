import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Container, Header, Content, Footer } from 'native-base';
import BLE from './BLE';
import {connect} from 'react-redux';
import { withNavigation } from 'react-navigation';
import {connectDevice,startScan} from './actions';



class BLEList extends Component {

  constructor(props){
    super(props);
    this.props.startScan();
    this.rowSwipeAnimatedValues = {};

    Array(this.props.BLEList.length)
        .fill('')
        .forEach((_, i) => {
            this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
        });
        console.log(this.rowSwipeAnimatedValues)
  }

  onSelected = (id) => {
  }

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
}

deleteRow(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    const newData = [...this.state.listViewData];
    const prevIndex = this.state.listViewData.findIndex(
        item => item.key === rowKey
    );
    newData.splice(prevIndex, 1);
    this.setState({ listViewData: newData });
}

deleteSectionRow(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    const [section] = rowKey.split('.');
    const newData = [...this.state.sectionListData];
    const prevIndex = this.state.sectionListData[section].data.findIndex(
        item => item.key === rowKey
    );
    newData[section].data.splice(prevIndex, 1);
    this.setState({ sectionListData: newData });
}

onRowDidOpen = rowKey => {
};

onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;
    this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
};
  
  
  handleClick = (device) => {
    this.props.connectDevice(device);
  }
  
  openEdit = () => {
    this.props.navigation.navigate('ColorPicker');
  }

  _renderItem = ({item}) => (
    <Text>{item.name}</Text>
  );

  render() {           
    return (
      <Container>
        <Header />
        <Content>
        <SwipeListView
            data={this.props.BLEList}
            renderItem={data => (
                <TouchableHighlight
                    onPress={() => this.handleClick(data.item)}
                    style={styles.rowFront}
                    underlayColor={'#AAA'}
                >
                    <View>
                        <Text>
                            Tap to connect to: {data.item.name}
                        </Text>
                    </View>
                </TouchableHighlight>
            )}
            renderHiddenItem={(data, rowMap) => (
                <View style={styles.rowBack}>
                    <Text>Left</Text>
                    <TouchableOpacity
                        style={[
                            styles.backRightBtn,
                            styles.backRightBtnLeft,
                        ]}
                        onPress={() =>
                            this.openEdit()
                        }
                    >
                        <Text style={styles.backTextWhite}>
                            Edit
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.backRightBtn,
                            styles.backRightBtnRight,
                        ]}
                        onPress={() =>
                            this.deleteRow(rowMap, data.item.key)
                        }
                    >
                            <Animated.View
                            style={[
                                styles.trash
                            ]}
                        >
                            <Image
                                source={require('./images/trash.png')}
                                style={styles.trash}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            )}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={this.onRowDidOpen}
        />
        </Content>
        <Footer>
          <BLE></BLE>
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
  connectDevice: device => dispatch(connectDevice(device)),
  startScan: () => dispatch(startScan())
})

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'white',
      flex: 1,
  },
  standalone: {
      marginTop: 30,
      marginBottom: 30,
  },
  standaloneRowFront: {
      alignItems: 'center',
      backgroundColor: '#CCC',
      justifyContent: 'center',
      height: 50,
  },
  standaloneRowBack: {
      alignItems: 'center',
      backgroundColor: '#8BC645',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
  },
  backTextWhite: {
      color: '#FFF',
  },
  rowFront: {
      alignItems: 'center',
      backgroundColor: '#CCC',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      justifyContent: 'center',
      height: 50,
  },
  rowBack: {
      alignItems: 'center',
      backgroundColor: '#DDD',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 15,
  },
  backRightBtn: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
  },
  backRightBtnLeft: {
      backgroundColor: 'blue',
      right: 75,
  },
  backRightBtnRight: {
      backgroundColor: 'red',
      right: 0,
  },
  controls: {
      alignItems: 'center',
      marginBottom: 30,
  },
  switchContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 5,
  },
  switch: {
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      paddingVertical: 10,
      width: Dimensions.get('window').width / 4,
  },
  trash: {
      height: 25,
      width: 25,
  },
});

export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(BLEList));