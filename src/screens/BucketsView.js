import {
  Dimensions,
  Image,
  Text,
  TouchableHighlight,
  View,
  Platform
} from 'react-native';

import ListView from 'deprecated-react-native-listview'
import AsyncStorage from '@react-native-async-storage/async-storage'

import React from 'react';

import styles from '../styles/main';
import Data from '../Data';
import SignInButtonBlock from '../components/SignInButtonBlock';

class BucketsView extends React.Component {
  constructor(props) {
    super(props);

    var dataProvider = new Data();
    var bucketData = dataProvider.getBuckets();
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(['row 1', 'row 2']);
    var buckets = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this._bucketData = bucketData;
    this._buckets = buckets;

    this.state = {
      dataSource: buckets.cloneWithRows(bucketData),
      buckets: bucketData,
      unlockedBuckets: []
    };
  }
  
  componentDidMount() {
    let self = this;
    AsyncStorage.getItem("unlockedBuckets").then((value) => {
      if (!value || value.length === 0)
        value = [];
      else
        value = JSON.parse(value);

      self.setState({
        unlockedBuckets: value,
        dataSource: self._buckets.cloneWithRows(self._bucketData)
      });
    });
  }

  _onPressButton(bucketId, title, locked) {
    if (locked && !this.checkIfBucketIsUnlocked(bucketId))
      return

      if (parseInt(bucketId) === 0) {
      this.props.navigation.push('favoriteView');

      // this.props.navigator.push({
      //   id: 'favoriteView',
      // });
    } else {
      this.props.navigation.push('modulesView', {bucketId: bucketId});

      // this.props.navigator.push({
      //   id: 'modulesView',
      //   bucketId: bucketId
      // });
    }
  }

  enterCode() {
    this.props.navigation.push('codeEnterView');

    // this.props.navigator.push({
    //   id: 'codeEnterView'
    // });
  }
  render() {
    const screenParams = {width: Dimensions.get('window').width, height: Dimensions.get('window').height};
    let signInButtonBlock = (
      <SignInButtonBlock enterCode={this.enterCode.bind(this)} />
    );
    // only for Apple
    if (this.state.unlockedBuckets != null &&
        this.state.unlockedBuckets.length > 0 && Platform.OS === 'ios') {
      signInButtonBlock = null;
    }

    return (
      <View style={styles.container}>
        <Image source={require("../../assets/images/ScreenBackground.png")}
               style={[styles.backgroundImage, {width: screenParams.width, height: screenParams.height}]}/>
        <View style={[styles.backgroundBlack, styles.bucketsHeader]}>

          <Image source={require("../../assets/images/BLG_Splash_Logo.png")}
                 style={[styles.content, styles.resizeContain, styles.topLogo]}
          />

        </View>
        <View style={styles.content}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderBucketRow.bind(this)}
            renderFooter={this.renderBucketsFooter.bind(this)}/>
        </View>

        {signInButtonBlock}

      </View>
    );
  }

  renderBucketsFooter(){
    return (
      <View style={{height: 120}}/>
    )
  }
  renderBucketRow(rowData, sectionID, rowID) {
    var icons = {
      firstIcon: this.getIcon(rowData.firstIcon),
      secondIcon: this.getIcon(rowData.secondIcon)
    };
    var rowHeight = Dimensions.get('window').width / 2 - 24;

    return (
      <View style={[styles.bucketRow, {height: rowHeight}]}>
        {this.getBucketItem(rowData.firstIcon, rowData.firstTitle, rowData.firstId, rowData.firstLocked)}
        {this.getBucketItem(rowData.secondIcon, rowData.secondTitle, rowData.secondId, rowData.secondLocked)}
      </View>
    )
  }
  getIcon(iconId) {
    switch (iconId) {
      case "star":
        return require("../../assets/images/icons/outline_star_big.png");
      case "Momentum_White_128.png":
        return require("../../assets/images/icons/Momentum_White_128.png");
      case "Negotiator_White.png":
        return require("../../assets/images/icons/Negotiator_White.png");
      case "ChangeLeadership_White.png":
        return require("../../assets/images/icons/ChangeLeadership_White.png");
      case "CoachingLeader_white.png":
        return require("../../assets/images/icons/CoachingLeader_white.png");
      case "Innovation_White_128.png":
        return require("../../assets/images/icons/Innovation_White_128.png");
      default:
        return require("../../assets/images/blank.png")
    }
  }

  checkIfBucketIsUnlocked(itemId) {
    var unlockedBuckets = this.state.unlockedBuckets;

    for (var i = 0; i < unlockedBuckets.length; i++) {
      if (itemId === unlockedBuckets[i])
        return true;
    }
    return false;
  }

  getBucketItem(icon, title, id, locked) {
    if (icon === false || title === false || id === false) {
      return (<View style={styles.singleBucketContainer}></View>)
    }
    var iconRender = this.getIcon(icon);
    var iconWidth = (Dimensions.get('window').width / 2 - 24) / 4;
    var isUnlocked = this.checkIfBucketIsUnlocked(id) || (id == 0);
        
    return (
      <View style={styles.singleBucketContainer}>
        <TouchableHighlight underlayColor={'transparent'} style={[{padding: 8, paddingRight: 16}, styles.content]}
                            onPress={() => this._onPressButton(id, title, locked)}>
          <View style={[{backgroundColor: '#3F3F3F', borderRadius: 5}, styles.content]}>
            <View style={{
              height: 4,
              top: 0,
              backgroundColor: isUnlocked ? '#F75252' : '#7D7D7D',
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3
            }}/>
            {this.getLockCorner(isUnlocked, iconWidth)}
            <View style={[styles.centerChildren, styles.content]}>
              <Image
                style={styles.bucketImage}
                source={iconRender}
                resizeMode={'contain'}/>
              <View style={{height: 14}}/>
              <Text style={[styles.bucketLabel, {
                color: this.checkIfBucketIsUnlocked(id) || !locked ? '#FFF' : '#222',
              }]}>{title.toUpperCase()}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  getLockCorner(unlocked, iconWidth) {
    if (!unlocked) {
      return (
        <Image style={[{
          top: 4,
          right: 0,
          height: iconWidth,
          width: iconWidth
        }, styles.resizeContain, styles.absoulutePosition]} source={require('../../assets/images/lockCorner.png')}/>
      )
    }
  }
}

export default BucketsView;
