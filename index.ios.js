/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var SearchBar = require('react-native-search-bar');

var {
  AppRegistry,
  NavigatorIOS,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} = React;

var API_URL = 'http://library.jonathanmuth.com/api';
var PAGE_SIZE = 25;
var QUERY = '';
var PARAMS = '?q=' + QUERY;
var REQUEST_URL = API_URL + PARAMS;

var PublicationScreen = React.createClass({

  render: function() {
    return (
      <View style={styles.listView}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{this.props.publication.title} {this.props.publication.subtitle}</Text>
            <Text style={styles.headerMeta}>{this.props.publication.author}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.attribute}>
            Editor: <Text style={{fontWeight: '700'}}>{this.props.publication.editor}</Text> {"\n"}
            CiteKey: <Text style={{fontWeight: '700'}}>{this.props.publication.key}</Text> {"\n"}
            Type: <Text style={{fontWeight: '700'}}>{this.props.publication.type}</Text> {"\n"}
            Series: <Text style={{fontWeight: '700'}}>{this.props.publication.series}</Text> {"\n"}
            Booktitle: <Text style={{fontWeight: '700'}}>{this.props.publication.booktitle}</Text> {"\n"}
            Edition: <Text style={{fontWeight: '700'}}>{this.props.publication.edition}</Text> {"\n"}
            Chpater: <Text style={{fontWeight: '700'}}>{this.props.publication.chapter}</Text> {"\n"}
            Pages: <Text style={{fontWeight: '700'}}>{this.props.publication.pages}</Text> {"\n"}
            Publisher: <Text style={{fontWeight: '700'}}>{this.props.publication.publisher}</Text> {"\n"}
            Journal: <Text style={{fontWeight: '700'}}>{this.props.publication.journal}</Text> {"\n"}
            Volume: <Text style={{fontWeight: '700'}}>{this.props.publication.volume}</Text> {"\n"}
            Number: <Text style={{fontWeight: '700'}}>{this.props.publication.number}</Text> {"\n"}
            Organization: <Text style={{fontWeight: '700'}}>{this.props.publication.organization}</Text> {"\n"}
            Institution: <Text style={{fontWeight: '700'}}>{this.props.publication.institution}</Text> {"\n"}
            School: <Text style={{fontWeight: '700'}}>{this.props.publication.school}</Text> {"\n"}
            Address: <Text style={{fontWeight: '700'}}>{this.props.publication.address}</Text> {"\n"}
            Year: <Text style={{fontWeight: '700'}}>{this.props.publication.year}</Text> {"\n"}
            Month: <Text style={{fontWeight: '700'}}>{this.props.publication.month}</Text> {"\n"}
            URL: <Text style={{fontWeight: '700'}}>{this.props.publication.sourceurl}</Text> {"\n"}
            Note: <Text style={{fontWeight: '700'}}>{this.props.publication.note}</Text> {"\n"}
            Annote: <Text style={{fontWeight: '700'}}>{this.props.publication.annote}</Text> {"\n"}
            Cross Reference: <Text style={{fontWeight: '700'}}>{this.props.publication.crossref}</Text> {"\n"}
            How Published: <Text style={{fontWeight: '700'}}>{this.props.publication.howpublished}</Text></Text>
          </View>
      </View>
    );
  },

});

var PublicationCell = React.createClass({
  render: function() {
    return (
      <View>
        <TouchableHighlight 
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight} >
          <View style={styles.listItem}>
            <Text style={styles.title}>{this.props.publication.title} {this.props.publication.subtitle}</Text>
            <Text style={styles.author}>{this.props.publication.author}</Text>
          </View>
        </TouchableHighlight>
        <View style={styles.listItemSeperator} />
      </View>
    );
  },
});

var Catalog = React.createClass({

  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      filter: '',
      queryNumber: 0,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.references),
          loaded: true,
        });
      })
      .done();
  },

  selectPublication: function(publication: Object) {
    this.props.navigator.push({
      title: 'Publication',
      component: PublicationScreen,
      passProps: {publication},
    });
  },

  searchPublication: function(text: string) {
    var filter = text.toLowerCase();
    if (filter) {
      return (
        API_URL + 'movies.json?apikey=' + apiKey + '&q=' +
        encodeURIComponent(filter)
      );
    } else {
      // With no query, load latest movies
      return (
        API_URL
      );
    }
  },

  _handleTextChange: function(event) {
  
    console.log(event.nativeEvent.text);

    this.setState({
      filter: event.nativeEvent.text
    });
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.list}>
        <SearchBar
          placeholder='Search'
          onChangeText=''
          onSearchButtonPress={this._handleTextChange}
          onCancelButtonPress=''
          />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderPublication}
          style={styles.listView}
        />
      </View>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading catalog...
        </Text>
      </View>
    );
  },

  renderPublication: function(
    publication: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <PublicationCell
        key={publication.citekey}
        onSelect={() => this.selectPublication(publication)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        publication={publication}
      />
    );
  },
});

var MobileLibrary = React.createClass({
  
  render: function() {
    return (
      <NavigatorIOS ref='nav' style={styles.container}
        titleTextColor = '#0011ff'
        tintColor = '#0011ff'
        initialRoute={{
          component: Catalog,
          title: 'Library',
          onRightButtonPress: this.onRightButtonPress,
        }}
      />
    );
  },

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: '#F0EFF5',
    marginTop: 64,
  },
  scene: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    marginBottom: 1,
  },
  listItem: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  listItemSeperator: {
    height: 1,
    backgroundColor: '#C7C7C7',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'left',
  },
  header: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0011ff',
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'left',
    color: '#ffffff',
  },
  headerMeta: {
    fontSize: 12,
    textAlign: 'left',
    color: '#ffffff',
  },
  attribute: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'left',
  },
  author: {
    fontSize: 12,
    textAlign: 'left',
  },
  year: {
    textAlign: 'left',
  },
  listView: {
    marginTop: 0,
  },
});

AppRegistry.registerComponent('MobileLibrary', () => MobileLibrary);