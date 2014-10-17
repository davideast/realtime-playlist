var request = require('request');

function SpotifyPlaylist(params) {
  this.accessToken = params.accessToken;
  this.playlistId = params.playlistId;
  this.userId = params.userId;
  this.requestUrl =
    'https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks'
        .replace('{user_id}', this.userId)
        .replace('{playlist_id}', this.playlistId);
}

SpotifyPlaylist.prototype.addTrack = function(track) {

  var uri = 'spotify:track:' + track.id;
  this._makeRequest(uri, function(body) {
    console.log(body)
  });

};

SpotifyPlaylist.prototype._makeRequest = function(uri, cb) {

  var trackUrl = this.requestUrl + '?uris=' + uri;

  options = {
    url: trackUrl,
    headers: { 'Authorization': 'Bearer ' + this.accessToken },
    json: true
  };

  // use the access token to access the Spotify Web API
  request.post(options, function(error, response, body) {
    console.log(body);
    cb(body);
  });

};


module.exports = SpotifyPlaylist;
