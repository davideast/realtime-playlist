var xhr = require('xhr');
var _   = require('lodash');

var SpotifySearch = (function() {
  function SpotifySearch(baseurl) {
    this._baseurl = baseurl || 'https://api.spotify.com/v1/search';

    this.search = function search(searchString, success, error) {
      // https://api.spotify.com/v1/search?q=eye+of+the+tiger&type=track
      var encodedSearch = searchString.split(' ').join('+');
      var searchUrl = this._baseurl + '?q=' + searchString + '&type=track&limit=10';

      xhr({
        uri: searchUrl,
        headers: {
          "Content-Type": "application/json"
        }
      }, function callback(err, resp, body) {

        if(!err && success) {
          var results = JSON.parse(resp.body);
          success(results.tracks);
        }
        else if(err && error) {
          error(JSON.parse(err));
        }

      });

    };
  }
  return SpotifySearch;
}());

module.exports = SpotifySearch;