/** @jsx React.DOM */
var React = require('react'),
    FeedItem = require('./FeedItem');

var FeedList = React.createClass({

  render: function() {

    var feedItems = this.props.items.map(function(track) {
      return <FeedItem item={track}
                       onVote={this.props.onVote}
                       onPlay={this.props.onPlay}
                       onPause={this.props.onPause}
                       play={this.props.play}
                       activeTrack={this.props.activeTrack}
             />
    }.bind(this));

    return (
      <div className="container">

         <ul className="list-group">
            { feedItems }
         </ul>

      </div>
    );
  }
});

module.exports = FeedList;