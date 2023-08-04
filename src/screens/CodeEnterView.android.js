import {
  Alert,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Keyboard,
} from 'react-native';

import styles from '../styles/main';
import Data from '../Data';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'

class CodeEnterView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: '', codeText: ''
    };
  }

  componentDidMount() {
    var dataProvider = new Data();
    var bucketsWCode = dataProvider.getBucketsWCodeList();
    AsyncStorage.getItem("unlockedBuckets").then((value) => {
      if (!value || value.length===0)
        value = [];
      else
        value = JSON.parse(value);
      this.setState({bucketsToUnlock: bucketsWCode, unlockedBuckets: value});
    }).done();
  }

  _onPressButton(){
    Keyboard.dismiss();
    this.props.navigation.navigate('bucketsView');
    
    // this.props.navigator.push({
    //   id: 'bucketsView'
    // });
  }
  unlockBucket() {
    let code = this.state.code;
    let buckets = this.state.bucketsToUnlock;
    var unlockedBuckets = this.state.unlockedBuckets;
    var success = false;
    for (var i = 0; i < buckets.length; i++) {
      if (buckets[i].code===code && unlockedBuckets.indexOf(buckets[i].id)===-1) {
        unlockedBuckets.push(buckets[i].id);
        AsyncStorage.setItem("unlockedBuckets", JSON.stringify(unlockedBuckets));
        Alert.alert('Success', 'Bucket "' + buckets[i].title + '" successfully unlocked');
        this.setState({code: '', codeText: ''});
        success = true;
      }
    }
    if (!success)
      Alert.alert("Error", "You entered wrong code. Please, try again");
    else
      this._onPressButton();
  }
  codeChanged(text) {
    var txt = text.text;
    if (txt.length > 4)
      txt = txt.slice(txt.length-4, txt.length);
    this.setState({code: txt, codeText: txt.split('').join('-')});
  }

  focusOnCodeInput() {
    this.refs.codeInput.blur();
    this.refs.codeInput.focus();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 7}}>
          <View style={{height: 48, backgroundColor: '#3A3A3A'}} />
          <View style={[{flex: 4, paddingLeft: 12, paddingRight: 12, paddingTop: 42}, styles.backgroundBlack]}>
            <Text style={[styles.fontTwelve, styles.textWhite, {textAlign: 'center'}]}>
              Enter your four digit code to unlock new Priming Tools
            </Text>
            <View style={{flex: .2}} />
            <TextInput
              placeholder="0-0-0-0"
              ref="codeInput"
              style={{height: 10, borderRadius: 4, backgroundColor: '#FFF', textAlign: 'center', opacity: 0}}
              keyboardType={'numeric'}
              onChangeText={(text) => this.codeChanged({text})}
              value={this.state.code}
              autoFocus={true} />
            <TouchableHighlight style={[{height: 40, borderRadius: 10, backgroundColor: '#FFF'}, styles.centerChildren]} onPress={this.focusOnCodeInput}>
              <Text style={[{textAlign: 'center'}, styles.fontEighteen, styles.textBlack]}>{this.state.codeText}</Text>
            </TouchableHighlight>
            <View style={{flex: .2}} />
            <TouchableHighlight style={[{borderRadius: 5, height: 48}, styles.centerChildren, styles.backgroundScarlet]} onPress={this.unlockBucket}>
              <Text style={[styles.fontTwentyTwo, styles.textWhite]}>Enter</Text>
            </TouchableHighlight>
            <View style={{flex: .2}} />
            <TouchableHighlight style={[{borderRadius: 5, height: 48}, styles.centerChildren, styles.backgroundBlack]} onPress={this._onPressButton}>
              <Text style={[styles.fontTwentyTwo, styles.textWhite]}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={[{flex: 5}, styles.backgroundBlack]} />
        <TouchableHighlight style={[{width: 50, height: 50, top:23, borderRadius: 25, left: Dimensions.get('window').width/2 -25}, styles.backgroundScarlet, styles.centerChildren, styles.absoulutePosition]}>
          <Image source={require('../../assets/images/lock.png')}/>
        </TouchableHighlight>
      </View>
    );
  };
}

export default CodeEnterView;
