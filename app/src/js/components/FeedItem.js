/** @jsx React.DOM */
var React = require('react');

var FeedItem = React.createClass({

  voteUp: function() {
    this.vote(true);
  },

  voteDown: function() {
    this.vote(false);
  },

  vote: function(direction) {
    var track = this.props.item;
    this.props.onVote({
      id: track.id,
      direction: direction,
    });
  },

  render: function() {

    var track = this.props.item;

    var positiveNegativeClass =
      track.voteCount >= 0 ? 'btn btn-success' : 'btn btn-danger';

    return (

      <li className="track-list-item">
         <span className={positiveNegativeClass}>{ track.voteCount }</span>
         <span>
           <button className="btn btn-primary" onClick={this.voteUp}>&uarr;</button>
           <button className="btn btn-primary" onClick={this.voteDown}>&darr;</button>
         </span>
         <span className="track-name">{ track.artist } - { track.name }</span>

         <span className="pull-right">
            <img height="34" width="34" src={track.profileImg} />
         </span>

      </li>

    );
  }
});

module.exports = FeedItem;