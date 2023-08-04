import  {
  Alert,
  Animated,
  AppRegistry,
  BackHandler,
  Dimensions,
  Easing,
  Image,
  Navigator,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  StatusBar,
  LogBox
} from 'react-native';

import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage'
import ListView from 'deprecated-react-native-listview'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React,  { useEffect } from 'react';

import styles from './styles/main';
import Data from './Data';
import StartScreen from './screens/StartScreen';
import BucketsView from './screens/BucketsView';
import ModulesView from './screens/ModulesView';
import CodeEnterView from './screens/CodeEnterView';
import {LinearGradient} from 'expo-linear-gradient';

// Don't allow scaling font
// @see http://facebook.github.io/react-native/docs/text.html#allowfontscaling
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
const Stack = createNativeStackNavigator();

// for use by the decks round circle element
var colorFn = function(lastDeckId, rowID){
  if(lastDeckId +'' == rowID+''){
    return {backgroundColor: "#e9ef43"};// rowData.styles.backgroundVisited;
  }else{
    return {backgroundColor: '#F45852'};
  }
}

BackHandler.addEventListener('hardwareBackPress', () => {
});

export default class Application extends React.Component {

  render() {
    return (
      <View style={styles.content}>
      <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}      
      >
         <Stack.Screen
           name="startScreen"
           component={StartScreen}
           options={{title: 'Start Screen'}}
         />
        <Stack.Screen name="bucketsView" component={BucketsView} options={{title: 'Modules'}} />
        <Stack.Screen name="codeEnterView" component={CodeEnterView} options={{title: 'Unlock Bucket'}}/>
        <Stack.Screen name="favoriteView" component={FavoriteView} initialParams={{ title: 'Favorites' }} options={{title: 'Favorites'}}/>
        <Stack.Screen name="modulesView" component={ModulesView} />
        <Stack.Screen name="decksView" component={DecksView} />
        <Stack.Screen name="flashCardView" component={FlashcardView} />

      </Stack.Navigator>
      </NavigationContainer>
      </View>
    );
  }
}

class FavoriteView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      decks: [],
      localDecks: []
    };
  }

  componentDidMount() {
    var dataProvider = new Data();
    var decks = [];
    var localDecks = [];
    AsyncStorage.getItem("favoriteDecks").then((data) => {
      if (!data || data.length===0)
        return
      else
        localDecks = JSON.parse(data);
      data = JSON.parse(data);
      for (var i = 0; i < data.length; i++) {
        decks.push(dataProvider.getDeck(data[i]));
      }
      var decksList = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({decks: decks, dataSource: decksList.cloneWithRows(decks), localDecks: localDecks});
    });
  }

  goBack() {
    this.props.navigation.push('bucketsView');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight underlayColor={'transparent'} style={[{height: 56}, styles.centerChildren, styles.content]} onPress={() => this.goBack()}>
            <Image style={{width: 21, height: 35}} source={require('../assets/images/ic_menu_back.png')} />
          </TouchableHighlight>
          <View style={styles.toolbarTitle}>
            <Text style={[styles.fontEighteen, styles.textWhite]}>{this.props.route.params.title}</Text>
          </View>
          <View style={styles.content}/>
        </View>
        <View style={styles.content}>
          <ListView dataSource={this.state.dataSource} renderRow={this.renderFavRow.bind(this)} renderHeader={this.renderListHeader.bind(this)}/>
        </View>
      </View>
    )
  }

  renderFavRow(rowData, sectionID, rowID) {
    return (
      <View style={[{height: 62, borderBottomWidth: 1, borderColor: "#333"}, styles.content]}>
        <View style={[{flexDirection: 'row', alignItems: 'center', flex:1}, styles.content]} >

          {/* Star */}
          <TouchableHighlight style={{flex:1}} onPress={() => this.favoriteDeck(rowData.id)}>
            <Image style={{width: 32, height: 32}} source={this.getStar(rowData.id)} />
          </TouchableHighlight>

          <TouchableHighlight style={{flex:8}}  onPress={() => this.goFlashcards(rowData.id)}>
            <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', right:0}]}>

              {/* Text */}
              <View style={{alignSelf:'stretch', flexDirection:"column", alignItems: 'flex-start'}}>
                <Text style={[styles.fontEighteen, styles.textWhite]}>{rowData.name}</Text>
                <Text style={[{fontSize: 11}, styles.textWhite]}>{rowData.cards.length} Flashcards</Text>
              </View>

              {/* Chevron */}
              <View>
                <Image source={require('../assets/images/chevron-right.png')} style={{width: 13, height: 21}}/>
              </View>
            </View>
          </TouchableHighlight>

        </View>
      </View>
    )
  }

  goFlashcards (id) {
    this.props.navigation.push('flashCardView', 
    { deckId: id,
      cycle: false,
      fromFav: true});
  }

  renderListHeader () {
    if (this.state.decks.length == 0) {
      return (
        <View style={styles.content}>
          <Text style={styles.textWhite}>You have no favorites</Text>
        </View>
      )
    }
  }

  getStar(id) {
    if (this.state.localDecks.indexOf(id.toString())>=0)
      return (require('../assets/images/btn_star_big_on.png'));
    else
      return (require('../assets/images/btn_star_big_off.png'));
  }

  favoriteDeck(id) {
    var localDecks = this.state.localDecks;
    AsyncStorage.getItem("favoriteDecks").then((data) => {
      if (!data || data.length===0)
        data = []
      else
        data = JSON.parse(data);
      if (localDecks.indexOf(id.toString()) == -1) {
        localDecks.push(id);
        data.push(id);
        AsyncStorage.setItem("favoriteDecks", JSON.stringify(data));
        this.setState({localDecks: localDecks});
      } else {
        localDecks.splice(localDecks.indexOf(id.toString()), 1);
        data.splice(data.indexOf(id), 1);
        AsyncStorage.setItem("favoriteDecks", JSON.stringify(data));
        this.setState({localDecks: localDecks});
      }
    });

  }
}

class DecksView extends React.Component {
  webview = null;

  constructor(props) {
    super(props)
    var dataProvider = new Data();
    var decksData = dataProvider.getDecksByModule(this.props.route.params.moduleId);
    var decks = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var lastDeckId;

    let route_states = this.props.navigation.getState();    

    var playVideo = true;
    if( route_states
      && route_states.routes
      && route_states.routes.length>0
      && route_states.routes[route_states.routes.length - 1].params != undefined){
      lastDeckId = route_states.routes[route_states.routes.length - 1].params.lastDeckId;
    }

    this.state =  {
      dataSource: decks.cloneWithRows(decksData),
      decks: decksData,
      module: dataProvider.getModule(this.props.route.params.moduleId),
      lastDeckId: lastDeckId,
      playVideo: playVideo
    };
  }

  goFlashcards(deck, cycle){
    this.state.playVideo = false;
    if (!deck) {
      deck = this.state.decks[0]
    }

    if (this.webview != null) {
      this.webview.reload();
    } 

    this.props.navigation.push('flashCardView', 
    {title: deck.name,
      deckId: (deck.id).toString(),
      cycle: cycle,
      fromFav: false});

    // this.props.navigator.push({
    //   id: 'flashCardView',
    //   title: deck.name,
    //   deckId: (deck.id).toString(),
    //   cycle: cycle,
    //   fromFav: false
    // });
  }

  goBack() {
    // this.state.module['video-url']=''; // stop the video
    this.state.playVideo = false;

    if (this.webview != null) {
      this.webview.reload();
    }

    this.props.navigation.push('modulesView', 
      {bucketId: this.state.module.parentId,
      lastModuleId: this.state.module.moduleId});
  }

  render() {
    var modTitle = this.state.module.title||'';
    if (modTitle.length > 27) {
      var shrtng = modTitle.slice(0, 27);
      var brk = shrtng.lastIndexOf(' ');
      modTitle = modTitle.slice(0, brk) + '...';
    }
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <TouchableHighlight underlayColor={'transparent'}
                              style={[{height: 56}, styles.content, styles.centerChildren]}
                              onPress={() => this.goBack()}>
            <Image style={{width: 21, height: 35}} source={require('../assets/images/ic_menu_back.png')} />
          </TouchableHighlight>
          <View style={styles.toolbarTitle}>
            <Text style={[styles.fontEighteen, styles.textWhite]}>{modTitle}</Text>
          </View>
          <View style={styles.content}/>
        </View>
        <View style={styles.content}>
          <ListView dataSource={this.state.dataSource} renderRow={this.renderDeckRow.bind(this)} renderHeader={this.renderListHeader.bind(this)}/>
        </View>
      </View>
    );
  }

  getStartFlashcardsButton(style) {
    let deck = null;
    if (this.state.decks.length > 0) {
      deck = this.state.decks[0];
    }

    return (
      <TouchableHighlight underlayColor={'rgba(244, 88, 82, 1)'} activeOpacity={1}
                          style={[style, styles.centerChildren, styles.contentEight, styles.backgroundScarlet, styles.absoulutePosition, {padding: 3, borderRadius: 5, height: 40, width: 196, left: Dimensions.get('window').width/2 - 98}]}
                          onPress={() => this.goFlashcards(deck, true)}>
        <Text style={[{fontSize: 16}, styles.textWhite]}>START FLASHCARDS</Text>
      </TouchableHighlight>
    )
  }

  renderListHeader() {
    var videoHeight = (Dimensions.get('window').width+72)/16*9;
    return(
      <View>
        {this.state.playVideo &&
        <LinearGradient style={{height: videoHeight}} colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', '#000']}>
          <WebView style={[{height: videoHeight}, styles.content]}
                  ref={(ref) => (this.webview = ref)}
                   scrollEnabled={false}
                   javaScriptEnabled={true}
                   domStorageEnabled={true}
                   source={{uri: this.state.playVideo ? this.state.module['video-url'].trim():''}}
                   allowsInlineMediaPlayback={true}
                   startInLoadingState={true}
          />
        </LinearGradient>}
        <View style={[{backgroundColor: "#1B1A1A", height: 112, padding: 16, borderBottomWidth: 2, borderColor: '#000'}]}>
          <Text numberOfLines={3} style={[{textAlign: 'left'}, styles.textWhite, styles.fontEighteen]}>{this.state.module.description1}</Text>
          <Text numberOfLines={3} style={[{textAlign: 'left'}, styles.textWhite, styles.fontTwelve]}>{this.state.module.description2}</Text>
        </View>
        {/* {this.getStartFlashcardsButton({marginTop: -20})} */}

      </View>
    )

  }
  renderDeckRow(rowData, sectionID, rowID) {
    var _flashButton;
    if (rowID === '0') {
      _flashButton = this.getStartFlashcardsButton({top: -20})
    }

    return (
      <View style={this.getDeckRowStyle(rowID)}>
        {_flashButton}
        <TouchableHighlight  style={[styles.deckContainer]} onPress={() => this.goFlashcards(rowData, false)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: .2}} />
            <View style={[{width: 48, height: 48, borderRadius: 48/2, padding: 2},
              colorFn(this.state.lastDeckId, rowData.id), styles.centerChildren]}
            >
              <View style={[{width: 46, height: 46, borderRadius: 46/2, backgroundColor: "#242222"}, styles.content, styles.centerChildren]}>
                <Text style={[{fontSize: 20}, styles.textGray]}>{parseInt(rowID)+1}</Text>
              </View>
            </View>
            <View style={{flex: .5}} />
            <View style={{flex: 5}}>
              <Text numberOfLines={2} style={[{paddingBottom: 5}, styles.fontEighteen, styles.textWhite]}>{rowData.name}</Text>
              <Text numberOfLines={1} style={[{fontSize: 11}, styles.textGray]}>{rowData.cards.length} Flashcards</Text>
            </View>
            <View style={{flex: .6}}>
              <Image source={require('../assets/images/chevron-right.png')} style={{width: 13, height: 21}}/>
            </View>
            <View style={{flex: .2}}/>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
  getDeckRowStyle(id) {
    return {
      backgroundColor: '#242222',
      flex: 1,
      height: (id==='0') ? 96:82,
      borderBottomWidth: 1,
      borderColor: "#333",
      paddingTop: (id==='0') ? 16:0
    }
  }
}

class FlashcardView extends React.Component {
  panResponder = {}

  constructor(props) {
    super(props);

    var dataProvider = new Data();

    var deckId = this.props.route.params.deckId;
    if (this.props.route.params.fromFav)
      var isFav = true;
    else
      var isFav = false;
    var cycle = this.props.route.params.cycle;
    var deckData = dataProvider.getDeck(deckId);

    var tipCount = 0; // for numbering the tips
    for (var i = 0; i < deckData.cards.length; i++) {
      if(deckData.cards[i].tip != false){
        tipCount += 1;
        deckData.cards[i].tipNum = tipCount;
      }
    }

    this.state = {deck: deckData, currentCard: 0, pan: new Animated.ValueXY(), cardOpacity: new Animated.Value(1), isFavorite: isFav, cycle: cycle};

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
  

      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x,
        dy: this.state.pan.y,
      }], {useNativeDriver: false}
      ),
      onPanResponderRelease: (e, gesture) => {
        if (gesture.moveX<Dimensions.get('window').width*2/3)
          this.incrementCurrentCard(false, gesture);
        else if (gesture.moveX>Dimensions.get('window').width/3)
          this.incrementCurrentCard(false, gesture);
        else this.returnCard();
      },
    });
  }

  componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

    AsyncStorage.getItem("favoriteDecks").then((data) => {
      var isFav = false;
      if (!data || data.length===0)
        return
      else
        data = JSON.parse(data);
      for (var i = 0; i < data.length; i++) {
        if (parseInt(data[i]) === parseInt(this.state.deck.id)) {
          this.setState({isFavorite: true});
          return
        }
      }
    });

    this.returnCard();
  }

  goBack() {
    if (this.props.route.params.fromFav) {
        this.props.navigation.push('favoriteView');
    } else {
      this.props.navigation.push('decksView', {
        moduleId: this.state.deck.moduleId,
        lastDeckId: this.state.deck.id
      });
    }
  }

  // returnCard = spring back to position
  returnCard (direction, gesture) {
    if (!direction) {
      Animated.spring(this.state.pan, { toValue: {x:0,y:0}, friction: 10, useNativeDriver: false}).start();
    } else {
      var cardPos = {x: 0, y: 0};
      try {
        var cardPos = {x: gesture.moveX, y: gesture.moveY};
      } catch(e) {
        //nothing
      };
      var screenParams = {width: Dimensions.get('window').width, height: Dimensions.get('window').height};
      //calculating directedPoint, which is an extension of card movement
      var directedPoint = {
        x: direction==="left"?-300:300,
        y: cardPos.y - screenParams.height/2
      };
      Animated.sequence([
        Animated.timing(this.state.pan, {toValue: {x: directedPoint.x, y: directedPoint.y}, easing: Easing.quad, duration: 50, useNativeDriver: false}),
        Animated.timing(this.state.pan, {toValue: {x: 0, y: 0}, duration: 0, useNativeDriver: false}),
        Animated.timing(this.state.cardOpacity, { toValue: 0, duration: 0, useNativeDriver: false}),
        Animated.timing(this.state.cardOpacity, { toValue: 1, duration: 400, useNativeDriver: false}),
      ]).start();
    }
  }

  incrementCurrentCard(backwards, gesture){

    // can't go back from first
    if (this.state.currentCard==0 && backwards) {
      this.returnCard();
    }
    // go back to list?
    else if ((this.state.currentCard+1 === this.state.deck.cards.length) && !backwards) {
      if (this.state.isFavorite) {
        this.returnCard();
        this.props.navigation.navigate('favoriteView');

        // this.props.navigator.resetTo({ id: 'favoriteView' });
      } else if (this.state.cycle) {
        this.returnCard();

        this.props.navigation.push('flashCardView', {
          deckId: (parseInt(this.state.deck.id) + 1).toString(),
          cycle: this.state.cycle
        });

        // this.props.navigator.push({
        //   id: 'flashCardView'
        //   //deckId: (parseInt(this.state.deck.id) + 1).toString(),
        //   //cycle: this.state.cycle
        // });
      } else {
        this.returnCard();

        this.props.navigation.push('decksView', {
          moduleId: this.state.deck.moduleId,
          lastDeckId: this.state.deck.id
        });

        // this.props.navigator.push({
        //   id: 'decksView',
        //   moduleId: this.state.deck.moduleId,
        //   lastDeckId: this.state.deck.id
        // });
      }
    } else {
      var curr = backwards ? this.state.currentCard-1 : this.state.currentCard+1;
      this.setState({currentCard: curr});
      this.returnCard(backwards?"right":"left", gesture);
    }
    
  }

  favoriteDeck() {
    var deckId = this.state.deck.id.toString();
    AsyncStorage.getItem("favoriteDecks").then((data) => {
      if (!data || data.length===0)
        data = []
      else
        data = JSON.parse(data);
      if (!this.state.isFavorite) {
        data.push(deckId);
        AsyncStorage.setItem("favoriteDecks", JSON.stringify(data));
      } else {
        if (data.indexOf(deckId) >= 0) {
          data.splice(data.indexOf(deckId), 1);
          AsyncStorage.setItem("favoriteDecks", JSON.stringify(data));
        }
      }
      this.setState({isFavorite: !this.state.isFavorite});
    });
  }

  renderOtherCards() {
    if (this.state.currentCard+1 === this.state.deck.cards.length)
      return
    return (
      <View style={[{top: 40, bottom: 0, borderRadius: 5, backgroundColor: '#F89D87', paddingLeft: 14, width: Dimensions.get('window').width-14},  styles.absoulutePosition, styles.centerChildren, styles.content]}>
        <Text style={[{top: 18, left: 14, fontSize: 24}, styles.textGray, styles.absoulutePosition]}>{this.getFlashCardTitle(this.state.deck.cards[this.state.currentCard+1].tip, true)}</Text>
        <Text style={[this.getTextSize(this.state.deck.cards[this.state.currentCard+1].title), styles.textWhite]}>{this.state.deck.cards[this.state.currentCard+1].title}</Text>
      </View>
    )
  }
  getStar() {
    if (this.state.isFavorite)
      return (require('../assets/images/btn_star_big_on.png'));
    else
      return (require('../assets/images/btn_star_big_off.png'));
  }

  getFlashCardTitle(isTip, next = false) {

    if (isTip) {

      let step = (!next) ? 0 : 1;
      
      return "TIP #" + (this.state.deck.cards[this.state.currentCard + step].tipNum || 1);
    }
    else if (!next)
      return "ARGUMENT #" + (this.state.currentCard+1)
    else if (next === true)
      return "ARGUMENT #" + (this.state.currentCard+2)
  }

  getTextSize(text) {
    if (text.length < 100)
      return {fontSize: 28}
    else
      return {fontSize: 22}
  }

  render() {
    var flashcardTitle = this.state.deck.name||'';
    if (flashcardTitle.length > 27) {
      var shrtng = flashcardTitle.slice(0, 27);
      var brk = shrtng.lastIndexOf(' ');
      flashcardTitle = flashcardTitle.slice(0, brk) + '...';
    }
    var screenParams = {width: Dimensions.get('window').width, height: Dimensions.get('window').height};    

    return (
      <View style={styles.container}>
        <Image source={require("../assets/images/ScreenBackground.png")} style={[styles.backgroundImage, {width: screenParams.width, height: screenParams.height}]} />

        {/* Menu Bar */}
        <View style={styles.toolbar}>
          <TouchableHighlight underlayColor={'transparent'} style={[{height: 56}, styles.centerChildren, styles.content]} onPress={() => this.goBack()}>
            <Image style={{width: 21, height: 35}} source={require('../assets/images/ic_menu_back.png')} />
          </TouchableHighlight>
          <View style={styles.toolbarTitle}>
            <Text style={[styles.fontEighteen, styles.textWhite]}>{flashcardTitle}</Text>
          </View>
          <TouchableHighlight style={[{height: 56}, styles.centerChildren, styles.content]} onPress={() => this.favoriteDeck()}>
            <Image style={{width: 32, height: 32}} source={this.getStar()} />
          </TouchableHighlight>
        </View>

        {/* Cards */}
        <View style={{flex: 6, paddingTop: 16, paddingLeft: 8, paddingRight: 8, paddingBottom: 24}}>
        {this.renderOtherCards()}

          <Animated.View
            {...this.panResponder.panHandlers}
            style={[this.state.pan.getLayout(), {borderRadius: 5, paddingLeft: 14}, styles.centerChildren, styles.content, styles.backgroundScarlet, {opacity: this.state.cardOpacity}]}>

            <Text style={[{top: 18, left: 14, fontSize: 24}, styles.textGray, styles.absoulutePosition]}>{this.getFlashCardTitle(this.state.deck.cards[this.state.currentCard].tip)}</Text>
            <Text style={[this.getTextSize(this.state.deck.cards[this.state.currentCard].title), styles.textWhite]}>{this.state.deck.cards[this.state.currentCard].title}</Text>
          </Animated.View>

        </View>

        <View style={[{height: 20}]}></View>

        {/* Buttons */}
        <View style={{flexDirection: 'row', flex: 1, alignItems: 'stretch', justifyContent: 'space-between'}}>
          {this.state.currentCard != 0 &&
          <TouchableHighlight style={[{height: 62, padding: 10}]} onPress={() => this.incrementCurrentCard(true)} >
            <Text style={[styles.fontTwentyTwo, styles.textGray]}>Previous</Text>
          </TouchableHighlight>}
          {this.state.currentCard === 0 && <View></View>}
          <TouchableHighlight style={[{height: 62, padding: 10}]} onPress={() => this.incrementCurrentCard(false)}>
            <Text style={[styles.fontTwentyTwo, styles.textGray]}>{(this.state.currentCard + 1 < this.state.deck.cards.length)||this.state.cycle ? 'Next Argument':'Back to list'}</Text>
          </TouchableHighlight>

        </View>
      </View>
    );
  }
}
