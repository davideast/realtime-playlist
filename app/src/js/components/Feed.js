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
    return new Firebase('https://realtime-playlist.firebaseio.com/playlist/');
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

  logout: function() {
    var ref = this.getRef();
    ref.unauth();
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
      activeTrack: {
        name: 'Select a track',
        artist: '',
        previewUrl: ''
      },
      play: false,
      user: null,
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
    }.bind(this));
  },

  componentDidMount: function() {
    this.loadFeed();
    this.onAuth();
    this.spotifySearch = new SpotifySearch();
    this.currentSong = null;
  },

  onVote: function (updateItem) {
    if(!this.state.user) { return; }
    this.updateVote(updateItem);
  },

  onSearch: function(searchString) {

    if(searchString === contstants.CLEAR) {
      this.setState({
        searchResults: []
      });
      return;
    }

    this.spotifySearch.search(searchString, function success(tracks) {

      this.setState({
        searchResults: tracks.items
      });

    }.bind(this));
  },

  onPlay: function(activeTrack) {

    if(this.currentSong) {
      this.currentSong.pause();
    }

    this.currentSong = new Audio(activeTrack.previewUrl);

    // change state when track ends
    this.currentSong.addEventListener('ended', this.props.onPause);

    this.currentSong.play();

    this.setState({
      activeTrack: activeTrack,
      play: true
    });

  },

  onPause: function() {
    this.currentSong.pause();
    this.setState({
      play: false
    });
  },

  playCurrent: function() {
    this.onPlay(this.state.activeTrack);
  },

  pauseCurrent: function() {
    this.onPause();
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

  onEgg: function(items) {
    this.setState({
      searchResults: items
    });
  },

  render: function() {

    var loginOrOut = this.state.user ? 'Logout for what' : 'Login for what';
    var loginOrOutCallback = this.state.user ? this.logout : this.login;

    var playPauseClass = this.state.play ? 'glyphicon glyphicon-pause' : 'glyphicon glyphicon-play';
    var playPauseCallback = this.state.play ? this.pauseCurrent : this.playCurrent;

    return (
      <div>

        <header>
          <h4 className="logo">Realtime Playlist</h4>
          <h5 className="playlist-title">Turn down for what</h5>
          <button className="btn btn-info pull-right" onClick={loginOrOutCallback}>{loginOrOut}</button>
        </header>

        <section id="player">

          <div className="player-wrap">

            <div onClick={playPauseCallback} className="control">
              <span className={playPauseClass}></span>
            </div>

            <div className="currentTrack">
              <h4 className="track-song">{this.state.activeTrack.name}</h4>
              <h5 className="track-artist">{this.state.activeTrack.artist}</h5>
            </div>
          </div>

        </section>

        <br />
        <br />

        <FeedForm onSearch={this.onSearch}
                  searchResults={this.state.searchResults}
                  activeTrack={this.state.activeTrack}
                  play={this.state.play}
                  onPlay={this.onPlay}
                  onPause={this.onPause}
                  onNewItem={this.onNewItem}
                  searchText={this.state.searchText}
                  onEgg={this.onEgg} />

        <br />
        <br />

        <FeedList items={this.state.items}
                  onVote={this.onVote}
                  onPlay={this.onPlay}
                  onPause={this.onPause}
                  play={this.state.play}
                  activeTrack={this.state.activeTrack} />
      </div>
    );
  }

});

module.exports = Feed;
