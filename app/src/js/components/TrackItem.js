/** @jsx React.DOM */

var React = require('react');

var TrackItem = React.createClass({

  handleNewItem: function(e) {
    var track = this.trackItem;
    e.preventDefault();

    this.props.onNewItem({
      id: track.id,
      name: track.name,
      previewUrl: track.previewUrl,
      artUrl: track.artUrl,
      artist: track.artist
    });

  },

  makeTrackItem: function(track) {
    console.log('track', track);
    var trackItem = {};
    trackItem.artist = track.artists[0].name;
    trackItem.isActive = this.props.activeTrack === track.preview_url;
    trackItem.isPlaying = this.props.play && trackItem.isActive;
    trackItem.classString = trackItem.isPlaying ? 'pull-right btn btn-danger' : 'pull-right btn btn-primary';
    trackItem.audioText = trackItem.isPlaying ? 'Pause' : 'Play';
    trackItem.audioCallback = trackItem.isPlaying ? this.pause : this.play;
    trackItem.index = this.props.index;
    trackItem.name = track.name;
    trackItem.id = track.id;
    trackItem.artUrl = track.album.images[2].url;
    trackItem.previewUrl = track.preview_url;
    return trackItem;
  },

  play: function(e) {
    e.preventDefault();
    this.props.onPlay(this.props.track.preview_url);
  },

  pause: function(e) {
    e.preventDefault();
    this.props.onPause(this.props.track.preview_url);
  },

  render: function() {

    var track = this.makeTrackItem(this.props.track);
    this.trackItem = track;

    return (

      <li key={track.id} className="media" data-index={track.index}>
        <a className="pull-left" href="#">
          <img className="media-object" src={track.artUrl} alt={track.name} />
        </a>
        <a className="pull-right btn btn-success" href="#" onClick={this.handleNewItem}>
          Add
        </a>

        <a href="#"
           className={track.classString}
           onClick={track.audioCallback}>
          {track.audioText}
        </a>

        <div className="media-body">
          <h5 className="media-heading">{track.artist} - {track.name}</h5>
        </div>
      </li>

    );
  }

});

module.exports = TrackItem;
