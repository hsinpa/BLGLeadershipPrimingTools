import {
  Text,
  TouchableHighlight,
  View,
  Dimensions
} from 'react-native';
import styles from '../styles/main';
import LinearGradient from 'expo-linear-gradient';
import React, {} from 'react';

class SignInButtonBlock extends React.Component {
  render() {
    const screenParams = {width: Dimensions.get('window').width, height: Dimensions.get('window').height};
    return (
      <LinearGradient
        style={[{
          width: screenParams.width,
          paddingLeft: 18,
          paddingRight: 18,
          paddingBottom: 10,
          bottom: 0
        }, styles.absoulutePosition]}
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)']}>


        <View style={{height: 30}}/>
        <Text
          style={[{
            fontSize: 14,
            alignSelf: 'center',
            paddingBottom: 8,
            fontWeight: 'bold',
            backgroundColor: 'transparent'
          }, styles.textWhiteNormal]}
        >Want to unlock more Priming Tools?</Text>
        <TouchableHighlight style={[{borderRadius: 5, height: 46}, styles.backgroundScarlet, styles.centerChildren]}
                            onPress={this.props.enterCode}>
          <Text style={[styles.fontTwentyTwo, styles.textWhiteNormal]}>Enter code</Text>
        </TouchableHighlight>
      </LinearGradient>
    );
  }
};

export default SignInButtonBlock;
