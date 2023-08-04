import {
  Alert,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Keyboard
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react';
import styles from '../styles/main';
import Data from '../Data';

class CodeEnterView extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        user: '', pass: ''   
      };
    }

  componentDidMount() {
    this.dataProvider = new Data();
  }

  _onPressButton() {
    Keyboard.dismiss();
    this.props.navigation.push('bucketsView');

    // this.props.navigator.push({
    //   id: 'bucketsView'
    // });
  }

  auth() {
    if (this.dataProvider.auth(this.state.user, this.state.pass)) {

      Alert.alert('Success', 'Login successful');

      const bucketsWCode = this.dataProvider.getBucketsWCodeList();

      let unlockedBuckets = [];
      bucketsWCode.forEach(function (bucket) {
        unlockedBuckets.push(bucket.id);
      });

      AsyncStorage.setItem("unlockedBuckets", JSON.stringify(unlockedBuckets), () => {
        this._onPressButton();
      });

    } else {
      Alert.alert("Error", "You entered wrong Username or Password. Please, try again");
    }
  }

  userChanged(text) {
    let value = text.trim() || '';
    this.setState({user: value});
  }

  passChanged(text) {
    let value = text.trim() || '';
    this.setState({pass: value});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 7}}>
          <View style={{height: 48, backgroundColor: '#3A3A3A'}}/>
          <View style={[{flex: 4, paddingLeft: 12, paddingRight: 12, paddingTop: 42}, styles.backgroundBlack]}>
            <Text style={[styles.fontTwelve, styles.textWhite, {textAlign: 'center'}]}>
              Enter your username and password
            </Text>
            <View style={{flex: .2}}/>
            <TextInput
              placeholder="Username"
              autoCorrect={false}
              autoCapitalize="none"
              ref="userInput"
              style={[styles.fontEighteen, styles.textBlack, {
                textAlign: 'center',
                height: 40,
                borderRadius: 10,
                backgroundColor: '#FFF'
              }]}
              onChangeText={(text) => this.userChanged(text)}
              value={this.state.user}
              autoFocus={true}
              returnKeyType="next"
              onSubmitEditing={(event) => {
                this.refs.passInput.focus();
              }}
            />
            <View style={{flex: .2}}/>
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              ref="passInput"
              style={[styles.fontEighteen, styles.textBlack, {
                textAlign: 'center',
                height: 40,
                borderRadius: 10,
                backgroundColor: '#FFF'
              }]}
              onChangeText={(text) => this.passChanged(text)}
              value={this.state.pass}
            />
            <View style={{flex: .2}}/>
            <TouchableHighlight style={[{borderRadius: 5, height: 48}, styles.centerChildren, styles.backgroundScarlet]}
                                onPress={this.auth.bind(this)}>
              <Text style={[styles.fontTwentyTwo, styles.textWhite]}>Enter</Text>
            </TouchableHighlight>
            <View style={{flex: .2}}/>
            <TouchableHighlight style={[{borderRadius: 5, height: 48}, styles.centerChildren, styles.backgroundBlack]}
                                onPress={this._onPressButton.bind(this)}>
              <Text style={[styles.fontTwentyTwo, styles.textWhite]}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={[{flex: 5}, styles.backgroundBlack]}/>
        <TouchableHighlight style={[{
          width: 50,
          height: 50,
          top: 23,
          borderRadius: 25,
          left: Dimensions.get('window').width / 2 - 25
        }, styles.backgroundScarlet, styles.centerChildren, styles.absoulutePosition]}>
          <Image source={require('../../assets/images/lock.png')}/>
        </TouchableHighlight>
      </View>
    );
  }
}

export default CodeEnterView;
