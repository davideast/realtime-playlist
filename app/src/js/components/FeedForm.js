/** @jsx React.DOM */
var React = require('React');
var TrackItem = require('./TrackItem');
var contstants = require('../services/Contstants');

var FeedForm = React.createClass({

  componentDidMount: function() {
    this.timer = 0;
    this.currentSong = null;
  },

  searchTracks: function(e) {
    var search = this.refs.title.getDOMNode().value;

    if(search === '') {
      this.props.onSearch(contstants.CLEAR);
      return;
    }

    var typewatch = function(callback, ms){
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, ms);
    }.bind(this);

    typewatch(function () {

      this.props.onSearch(search);

    }.bind(this), 200)
  },

  onPause: function(previewUrl) {
    this.props.onPickSong(previewUrl, false);
    this.currentSong.pause();
  },

  pickSong: function(previewUrl) {
    this.props.onPickSong(previewUrl, true);

    if(this.currentSong) {
      this.currentSong.pause();
    }

    this.currentSong = new Audio(previewUrl);

    // change state when track ends
    this.currentSong.addEventListener('ended', function() {
      this.props.onPickSong(previewUrl, false);
    }.bind(this));

    this.currentSong.play();
  },

  getTrackFromEvent: function(e) {
    var index = parseInt(e.target.parentNode.attributes[1].value, 10);
    return this.props.searchResults[index];
  },

  render: function() {

    var listResults = this.props.searchResults.map(function(track) {
      var index = this.props.searchResults.indexOf(track);
      return <TrackItem track={track}
                        onNewItem={this.props.onNewItem}
                        activeTrack={this.props.activeTrack}
                        play={this.props.play}
                        index={index}
                        onPlay={this.pickSong}
                        onPause={this.onPause} />

    }.bind(this));

    return (
      <form id="searchForm" ref="searchForm" className="container" onSubmit={this.handleNewItem}>

        <div className="form-group">

          <input ref="title" type="text" className="form-control" placeholder="Track title" onKeyUp={this.searchTracks} />

          <ul id="searchResults" className="media-list">
            {listResults}
          </ul>

        </div>

      </form>
    );
  }

});

module.exports = FeedForm;
