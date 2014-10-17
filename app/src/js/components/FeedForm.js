/** @jsx React.DOM */
var React = require('React');
var TrackItem = require('./TrackItem');
var contstants = require('../services/Contstants');

var FeedForm = React.createClass({

  componentDidMount: function() {
    this.timer = 0;
  },

  matchesAnyEggs: function(text) {
    var EGGS = {

      'Eye of the Tiger':
        [
          {
            id: "1",
            artists: [{name: 'Andrew'}],
            name: "It's already on the playlist.",
            album: {
              images:[{ url: ''},{ url: ''},{ url: ''}]
            }
          }
        ]

    };

    var eggValue = null;

    Object.keys(EGGS).forEach(function(egg) {
      if(egg.toLowerCase() === text.toLowerCase()) {
        eggValue = EGGS[egg];
        return;
      }
    });

    return eggValue;
  },

  searchTracks: function(e) {
    var search = this.refs.title.getDOMNode().value;
    var possibleEgg = this.matchesAnyEggs(search);

    if(possibleEgg) {
      this.props.onEgg(possibleEgg);
      return;
    }

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
                        onPlay={this.props.onPlay}
                        onPause={this.props.onPause} />

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
