import {
  Dimensions,
  Image,
  PanResponder,
  Platform,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';

import React from 'react';
import styles from '../styles/main';
import AsyncStorage from '@react-native-async-storage/async-storage'

class StartScreen extends React.Component {

  constructor(props) {
    super(props);
  }
  
  buttonClicked () {
    this.props.navigation.push('bucketsView');
  }

  render() {
    var TouchableElement = TouchableHighlight;
    var screenParams = {width: Dimensions.get('window').width, height: Dimensions.get('window').height};
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.container}>
        <Image source={require("../../assets/images/SplashScreenBackground.png")}
               style={[styles.backgroundImage, {width: screenParams.width, height: screenParams.height}]}/>
        <View style={styles.content}>
          <View style={[styles.contentEight, styles.centerChildren]}>
            <Image
              width={Dimensions.get('window').width / ((Platform.OS === 'ios') ? 3 : 1)}
              style={styles.resizeContain}
              source={require("../../assets/images/BLG_Splash_Logo.png")}/>
            <Text style={[styles.textWhite, styles.startScreenLabel]}>
              Leadership Priming Tools
            </Text>
          </View>
          <View style={[{flexDirection: 'row'}, styles.content]}>
            <View style={styles.content}></View>
            <TouchableHighlight style={[{
              borderRadius: 3,
              height: 54
            }, styles.backgroundScarlet, styles.centerChildren, styles.contentEight]} onPress={this.buttonClicked.bind(this)}>
              <Text style={[styles.fontTwentyTwo, styles.textWhite]}>GET STARTED</Text>
            </TouchableHighlight>
            <View style={styles.content}></View>
          </View>
          <View style={{flex: 2}}/>
        </View>
      </View>
    );
  }
}
export default StartScreen;
