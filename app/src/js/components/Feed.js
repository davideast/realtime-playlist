/** @jsx React.DOM */
var React = require('react');
var FeedList = require('./FeedList');
var FeedForm = require('./FeedForm');
var ShowFormButton = require('./ShowFormButton');
var Firebase = require('firebase');
var _ = require('lodash');
var SpotifySearch = require('../services/SpotifySearch');
var contstants = require('../services/Contstants');

var Feed = React.createClass({

  // helper method to create Firebase refs to the feed
  getRef: function() {
    return new Firebase('https://webapi.firebaseio.com/playlist/');
  },

  // helper method to create Feed Item refs
  getItemRef: function(id) {
    return this.getRef().child(id);
  },

  login: function(e) {
    var ref = this.getRef();
    ref.authWithOAuthRedirect('twitter', function(error) {
      console.error(error);
    });
  },

  updateVote: function(updateItem) {
    var itemRef = this.getItemRef(updateItem.id);
    var countRef = itemRef.child('votes');
    countRef.child(this.state.user.twitter.username).set(updateItem.direction);
  },

  // initial state items needed
  getInitialState: function() {
    return {
      items: [],
      searchResults: [],
      activeTrack: null,
      play: false,
      user: null,
      searchText: ''
    };
  },

  processSnap: function(snap) {
    var item = snap.val();
    var upVotes = 0;
    var downVotes = 0;
    var voteCount = 0;
    item.key = snap.name();

    if(item.votes) {
      Object.keys(item.votes).forEach(function(vote) {
        var direction  = item.votes[vote];

        if(direction) {
          upVotes = upVotes + 1;
        } else {
          downVotes = downVotes + 1;
        }

      });

      voteCount = upVotes - downVotes;
    }

    item.voteCount = voteCount;

    return item;
  },

  // set up the connection to Firebase to load the data
  // sorty by voteCount
  loadFeed: function() {

    var ref = this.getRef();
    ref.on('value', function(snap) {

      var items = [];

      snap.forEach(function(snapItem) {
        var item = this.processSnap(snapItem);
        items.push(item);
      }.bind(this));

      var sortedItems = _.sortBy(items, function(item) {
        return -item.voteCount;
      });

      this.setState({
        items: sortedItems
      });

    }.bind(this));
  },

  onAuth: function() {
    var ref = this.getRef();
    ref.onAuth(function(authData) {
      this.setState({
        user: authData
      });
      console.log(authData);
    }.bind(this));
  },

  componentDidMount: function() {
    this.loadFeed();
    this.onAuth();
    this.spotifySearch = new SpotifySearch();
  },

  onVote: function (updateItem) {
    this.updateVote(updateItem);
  },

  onSearch: function(searchString) {

    if(searchString === contstants.CLEAR) {
      this.setState({
        searchResults: [],
        searchText: ''
      });
      return;
    }

    this.spotifySearch.search(searchString, function success(tracks) {

      this.setState({
        searchResults: tracks.items
      });

    }.bind(this));
  },

  onPickSong: function(previewUrl, willPlay) {

    this.setState({
      activeTrack: previewUrl,
      play: willPlay
    });

  },

  onNewItem: function(newItem) {
    // mark the user who added it
    newItem.addedBy = this.state.user.uid;
    newItem.profileImg = this.state.user.twitter.cachedUserProfile.profile_image_url_https;

    this.getRef()
        .child(newItem.id)
        .set(newItem);

    this.onSearch(contstants.CLEAR);
  },

  render: function() {

    var loginDisplay = {
      display: this.state.user ? 'none': 'block'
    };

    return (
      <div>

        <div className="container" style={loginDisplay}>
          <button className="btn btn-info btn-block" onClick={this.login}>Login for what</button>

          <br />
          <br />
        </div>

        <FeedForm onSearch={this.onSearch}
                  searchResults={this.state.searchResults}
                  activeTrack={this.state.activeTrack}
                  play={this.state.play}
                  onPickSong={this.onPickSong}
                  onNewItem={this.onNewItem}
                  searchText={this.state.searchText} />

        <br />
        <br />

        <FeedList items={this.state.items}
                  onVote={this.onVote} />
      </div>
    );
  }

});

module.exports = Feed;
