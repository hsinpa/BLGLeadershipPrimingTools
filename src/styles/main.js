import {
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';

const {height, width} = Dimensions.get('window');
const aspectRatio = height / width;
let wk = 1;
if (aspectRatio > 1.6) {
  // Phone/iPhone
  wk = Dimensions.get('window').width / 320;
} else {
  // Tablet/iPad
  wk = 1.5;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#242424',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 7,
    borderColor: '#FFCCCC',
    borderRadius: 2
  },
  toolbar: {
    paddingTop: (Platform.OS === 'ios') ? 15 : 0,
    backgroundColor: '#191818',
    flexDirection: 'row',
    height: (Platform.OS === 'ios') ? 71 : 56,
    alignItems: 'center'
  },
  content: {
    flex: 1,
  },
  bucketRow: {
    flexDirection: 'row',
    height: 128
  },
  bucketContainer: {
    flex: 1,
    alignItems: 'center'
  },
  startScreenLabel: {
    marginTop: (Dimensions.get('window').width < 1024) ? 0 : 40,
    fontSize: (Platform.OS === 'ios') ? wk * 14 : 16
  },
  bucketsHeader: {
    alignItems: 'center',
    height: 118
  },
  topLogo: {
    width: 135,
    height: (373 / 204) * 135
  },
  bucketImage: {
    height: (Platform.OS === 'ios') ? wk * 58 : 64,
    width: (Platform.OS === 'ios') ? wk * 58 : 64,
    marginBottom: (Platform.OS === 'ios') ? 2 : 0
  },
  bucketLabel: {
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: (Platform.OS === 'ios') ? wk * 10 : 12
  },
  contentThree: {
    flex: 3
  },
  bucketIcon: {
    width: 48,
    height: 48
  },
  moduleRow: {
    height: 262,
    borderBottomWidth: 1,
    borderColor: "#333",
    paddingBottom: 4
  },
  deckRow: {
    height: 82,
    borderBottomWidth: 1,
    borderColor: "#333"
  },
  moduleContainer: {
    flex: 1,
    backgroundColor: '#0C0C0C'
  },
  deckContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  singleBucketContainer: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    position: 'absolute'
  },
  moduleBackground: {
    height: 156,
    resizeMode: 'cover',
    position: 'absolute'
  },
  centerChildren: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  toolbarTitle: {
    flex: 7,
    alignItems: 'center'
  },
  contentEight: {
    flex: 8
  },
  resizeContain: {
    resizeMode: 'contain'
  },
  textWhite: {
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  textWhiteNormal: {
    color: '#FFF'
  },
  textGray: {
    color: '#999',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  textBlack: {
    color: '#000',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  fontEighteen: {
    fontSize: (Platform.OS === 'ios') ? wk * 14.5 : 18
  },
  fontTwelve: {
    fontSize: (Platform.OS === 'ios') ? wk * 10 : 12
  },
  fontTwentyTwo: {
    fontSize: (Platform.OS === 'ios') ? wk * 18 : 22
  },
  backgroundScarlet: {
    backgroundColor: '#F45852'
  },
  backgroundVisited: {
    backgroundColor: '#00ff00'
  },
  backgroundBlack: {
    backgroundColor: '#000'
  },
  absoulutePosition: {
    position: 'absolute'
  },
  moduleTitleTextWrapper:{
    lineHeight: 28,
    justifyContent: 'center'
  },
  moduleTitleText:{
    fontWeight: 'bold',
    color: '#FFF'
  }
});

export default styles;
