import {
  Dimensions,
  Image,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import styles from '../styles/main';
import Data from '../Data';
import React from 'react';
import ListView from 'deprecated-react-native-listview'


class ModulesView extends React.Component {
  constructor(props) {
    super(props);

    var dataProvider = new Data();
    var modulesData = dataProvider.getModules(this.props.route.params.bucketId);
    var modules = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var lastModuleId;
    if (this.props.navigation) {
      let route_states = this.props.navigation.getState();
      if (route_states.routes.length > 0 && 
        route_states.routes[ route_states.routes.length - 1].params != undefined) {

        lastModuleId = route_states.routes[ route_states.routes.length - 1].params.lastModuleId;

      }
    }

    
    this.state = {
      dataSource: modules.cloneWithRows(modulesData),
      modules: modulesData,
      lastModuleId: lastModuleId
    };
  }

  _onPressButton(id) {
    this.props.navigation.push('decksView', 
      { id: 'decksView',
        moduleId: id,
        lastModuleId: id
      });

    // this.props.navigator.push({
    //   id: 'decksView',
    //   moduleId: id,
    //   lastModuleId: id
    // });
  }

  goBack() {
    this.props.navigation.push('bucketsView');
    // this.props.navigator.push({
    //   id: 'bucketsView'
    // });
  }

  render() {
    var screenParams = {width: Dimensions.get('window').width, height: Dimensions.get('window').height};
    return (
      <View style={styles.container}>
        <Image source={require("../../assets/images/ScreenBackground.png")}
               style={[styles.backgroundImage, {width: screenParams.width, height: screenParams.height}]}/>
        <View style={styles.toolbar}>
          <TouchableHighlight underlayColor={'transparent'}
                              style={[{height: 56}, styles.centerChildren, styles.content]}
                              onPress={() => this.goBack()}>
            <Image style={{width: 21, height: 35}} source={require('../../assets/images/ic_menu_back.png')}/>
          </TouchableHighlight>
          <View style={styles.toolbarTitle}>
            <Text style={[styles.fontEighteen, styles.textWhite]}>Priming Tools</Text>
          </View>
          <View style={styles.content}/>
        </View>

        <View style={[{padding: 5}, styles.content]}>
          <ListView dataSource={this.state.dataSource} renderRow={this.renderModuleRow.bind(this)}/>
        </View>
      </View>
    );
  }

  renderModuleRow(rowData, sectionID, rowID) {
    var moduleSnippet = "";
    if (rowData.length)
      moduleSnippet = "Video  |  " + rowData.length;
    else
      moduleSnippet = "";
    var screenParams = {width: Dimensions.get('window').width, height: Dimensions.get('window').height};

    var visitedColor = rowData.moduleId == this.state.lastModuleId ? "#f9ff73" : '#F45852';//rowData.titleColor;


    let titleText = rowData.title;
    let moduleTitle = (
      <Text style={[styles.moduleTitleTextWrapper, {width: screenParams.width * 0.8}]}>
        <Text numberOfLines={2} style={[{
          backgroundColor: rowData.titleColor,
        }, styles.moduleTitleText, styles.fontEighteen]}> {rowData.title.trim()} </Text>
      </Text>
    );

    const aspectRatio = screenParams.height / screenParams.width;
    let wk = 1;
    if (aspectRatio > 1.6) {
      // Phone/iPhone
      wk = screenParams.width / 320;
    } else {
      // Tablet/iPad
      wk = 1.5;
    }
    const maxLength = (screenParams.width * 0.8) / (8 * wk);
    if (rowData.title.length > maxLength) {
      let partsOfText = rowData.title.split(' ');
      titleText = '';
      moduleTitle = [];
      for (let i = 0; i < partsOfText.length; i++) {
        if ((titleText + partsOfText[i]).length > maxLength) {

          moduleTitle.push(
            <Text key={i} style={[styles.moduleTitleTextWrapper, {width: screenParams.width * 0.8}]}>
              <Text style={[{
                backgroundColor: rowData.titleColor
              }, styles.moduleTitleText, styles.fontEighteen]}> {titleText.trim()} </Text>
            </Text>
          );
          titleText = '';
        }
        titleText += partsOfText[i] + ' ';
      }

      moduleTitle.push(
        <Text key='lastTitle' style={[styles.moduleTitleTextWrapper, {width: screenParams.width * 0.8}]}>
          <Text style={[{
            backgroundColor: rowData.titleColor
          }, styles.moduleTitleText, styles.fontEighteen]}> {titleText.trim()} </Text>
        </Text>
      );
    }

    // if 3 lines
    let countLines = moduleTitle.length;
    let marginTop = 118;
    if (countLines > 2) {
      marginTop = 118 - ((countLines - 2) * 18);
    }

    return (
      <View style={this.getModuleRowStyle(rowData.titleColor)}>
        <View style={styles.moduleContainer}>
          <View style={styles.content}>
            <Image style={styles.moduleBackground} source={this.getModuleBackground(rowData.background)}/>
            <View style={[{paddingLeft: 10, paddingRight: 8, backgroundColor: 'transparent'}, styles.content]}>

              <View style={{marginTop: marginTop}}/>
              {moduleTitle}

              <Text style={[{marginTop: 22}, styles.textWhite, styles.fontTwelve]}>{moduleSnippet}</Text>
              <Text numberOfLines={3}
                    style={[{marginTop: 10}, styles.fontTwelve, styles.textWhite]}>{rowData.description1}</Text>
            </View>
          </View>
          <TouchableHighlight style={[{
            right: 10,
            top: 130,
            height: 48,
            width: 48,
            borderWidth: 3,
            borderRadius: 50,
            borderColor: visitedColor,

            backgroundColor: '#222'

          },
            styles.absoulutePosition,
            styles.centerChildren]} onPress={() => this._onPressButton(rowData.moduleId)}>
            <Image source={require('../../assets/images/ic_menu_fwd.png')} style={{width: 14, height: 23}}/>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  getModuleBackground(iconId) {
    switch (iconId) {
      case "Coaching Pic 1.jpg":
        return require("../../assets/images/modules/CoachingMistakes_1200x800.jpg");
      case "Coaching Supervisor.jpg":
        return require("../../assets/images/modules/CoachingSupervisor.jpg");
      case "BLG App meeting 2.jpg":
        return require("../../assets/images/modules/CreateTraction_1200x800.jpg");
      case "BLG App Meeting.jpg":
        return require("../../assets/images/modules/PumpUpCollective_1200x800.jpg");
      case "Overcome blocks.jpg":
        return require("../../assets/images/modules/OverComeBlocks_1200x800.jpg");
      case "performance reviews.jpg":
        return require("../../assets/images/modules/PerformanceReviews_1200x800.jpg");
      case "coaching mistakes.jpg":
        return require("../../assets/images/modules/CoachingMistakes_1200x800.jpg");
      case "Good ideas are not enough.jpg":
        return require("../../assets/images/modules/GoodIdeas_1200x800.jpg");
      case "the value of coalitions.jpg":
        return require("../../assets/images/modules/Coalitions.jpg");
      case "understand resistance.jpg":
        return require("../../assets/images/modules/UnderstandResistance_1200x800.jpg");
      case "yes-but.jpg":
        return require("../../assets/images/modules/YesButArguments_1200x800.jpg");
      case "map the stakeholders.jpg":
        return require("../../assets/images/modules/MapStakeholders_1200x800.jpg");
      case "stakeholder style.jpg":
        return require("../../assets/images/modules/KnowStakeholderStyle_1200x800.jpg");
      case "pitch ideas.jpg":
        return require("../../assets/images/modules/PitchIdeas_1200x800.jpg");
      case "justify agendas.jpg":
        return require("../../assets/images/modules/JustifyAgenda_1200x800.jpg");
      case "establish credibility .jpg":
        return require("../../assets/images/modules/EstablishCredibility_1200x800.jpg");
      case "gauge your support.jpg":
        return require("../../assets/images/modules/GaugeSupport_1200x800.jpg");
      case "reduce their anxiety .jpg":
        return require("../../assets/images/modules/ReduceAnxiety_1200x800.jpg");
      case "power arguments.jpg":
        return require("../../assets/images/modules/PowerArguments_1200x800.jpg");
      case "Prep for Negotiation.jpg":
        return require("../../assets/images/modules/AnalyzeNeg_1200x800.jpg");
      case "analyze neg.jpg":
        return require("../../assets/images/modules/AnalyzeNeg_1200x800.jpg");
      case "cat the issues.jpg":
        return require("../../assets/images/modules/CategorizeIssues_1200x800.jpg");
      case "priortize.jpg":
        return require("../../assets/images/modules/PrioritizeIssues_1200x800.jpg");
      case "assess issues.jpg":
        return require("../../assets/images/modules/AssessAlternatives_1200x800.jpg");
      case "the opening move.jpg":
        return require("../../assets/images/modules/OpeningMove_1200x800.jpg");
      case "table.jpg":
        return require("../../assets/images/modules/IdeaToTable_1200x800.jpg");
      case "bluffing.jpg":
        return require("../../assets/images/modules/Bluffing_1200x800.jpg");
      case "emotion.jpg":
        return require("../../assets/images/modules/UsingEmotion_1200x800.jpg");
      case "dealing with.jpg":
        return require("../../assets/images/modules/DealingWith_1200x800.jpg");
      case "external.jpg":
        return require("../../assets/images/modules/ExternalAwareness_1200x800.jpg");
      case "internal.jpg":
        return require("../../assets/images/modules/internalAwareness_1200x800.jpg");
      case "lead the hub.jpg":
        return require("../../assets/images/modules/DontLetCoalitionMindsetSlip_1200x800.jpg");
      case "create safety.jpg":
        return require("../../assets/images/modules/CreateSafety_1200x800.jpg");
      case "frame.jpg":
        return require("../../assets/images/modules/FrameCanvas_1200x800.jpg");
      case "diverge.jpg":
        return require("../../assets/images/modules/Divergence_1200x800.jpg");
      case "converge.jpg":
        return require("../../assets/images/modules/Convergence_1200x800.jpg");
      case "prototype.jpg":
        return require("../../assets/images/modules/PrototypeDevelopment_1200x800.jpg");
      case "team.jpg":
        return require("../../assets/images/modules/PumpUpCollective_1200x800.jpg");
      case "resources.jpg":
        return require("../../assets/images/modules/PrototypeDevelopment_1200x800.jpg");
      case "process.jpg":
        return require("../../assets/images/modules/ExternalAwareness_1200x800.jpg");
      case "pump up.jpg":
        return require("../../assets/images/modules/PumpUpCollective_1200x800.jpg");
      case "celebrate.jpg":
        return require("../../assets/images/modules/CelebrateButDontWorship_1200x800.jpg");
      case "horse.jpg":
        return require("../../assets/images/modules/DontFeedTrojanHorse_1200x800.jpg");
      case "counter coal.jpg":
        return require("../../assets/images/modules/BewareCounterCoalitions_1200x800.jpg");
      default:
        return require("../../assets/images/blank.png")
    }
  }

  getModuleRowStyle(color) {
    return {
      //backgroundColor: '#222',
      height: 264,
      borderTopWidth: 3,
      borderColor: color,
      paddingBottom: 8
    }
  }
}

export default ModulesView;
