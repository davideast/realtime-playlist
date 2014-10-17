/** @jsx React.DOM */
var React = require('react');
var Popover = require('./Popover');

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

  playCurrent: function() {
    this.props.onPlay(this.props.item);
  },

  pauseCurrent: function() {
    this.props.onPause();
  },

  render: function() {

    var track = this.props.item;
    var isActive = this.props.item.id === this.props.activeTrack.id;
    var willPlay = this.props.play && isActive;

    var positiveNegativeClass =
      track.voteCount >= 0 ? 'badge badge-success pull-left' : 'badge badge-danger pull-left';

    var playPauseClass = willPlay ? 'glyphicon glyphicon-pause' : 'glyphicon glyphicon-play';
    var playPauseCallback = willPlay ? this.pauseCurrent : this.playCurrent;

    return (

      <li className="list-group-item">

         <span className="pull-right">
           <button className="btn btn-default" onClick={this.voteUp}>&uarr;</button>
           <button className="btn btn-default" onClick={this.voteDown}>&darr;</button>
           <button className="btn btn-default" onClick={playPauseCallback}>
             <span className={playPauseClass}></span>
           </button>
         </span>
         <span className="track-name">{ track.artist } - { track.name }</span>

         <span className="pull-right">
            <img height="34" width="34" src={track.profileImg} />
         </span>

         <span className={positiveNegativeClass}>{ track.voteCount }</span>

      </li>

    );
  }
});

module.exports = FeedItem;