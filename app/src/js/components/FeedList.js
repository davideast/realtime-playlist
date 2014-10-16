/** @jsx React.DOM */
var React = require('react'),
    FeedItem = require('./FeedItem');

var FeedList = React.createClass({

  render: function() {

    var feedItems = this.props.items.map(function(track) {
      return <FeedItem item={track}
                       onVote={this.props.onVote}
             />
    }.bind(this));

    return (
      <div className="container">

         <ul className="track-list">
            { feedItems }
         </ul>

      </div>
    );
  }
});

module.exports = FeedList;