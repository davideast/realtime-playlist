var Firebase = require('firebase');
var SpotifyPlaylist = require('./SpotifyPlaylist');
var FBURL = 'https://realtime-playlist.firebaseio.com';

var ref = new Firebase(FBURL);
ref.authWithCustomToken('JH2zIAKk4PaYIb7on1FPbob7PLBkl87iYpIYpIdS', function(error, authData) {
  console.log(error);
  console.log(authData);
});

var playlist = new SpotifyPlaylist({
  userId: 'david%2Bfirebase',
  playlistId: '30UsMPCVkvehbPY2H2nKpB',
  accessToken: 'BQDyVTOkg4quyQE_-OXDCvfjrhZcT9Fhk2KWh1UVr6zBmNjVAg_2UW_RI0gefYVIBtGyfVTIVRWfvBbkQvkyejd7V3IIkM-9iiS6ACyZJ5FiKLqQ9SI9G3btgahBfoMxIv9cJTTY2_Vw0Swd02NHG7spSYm5gNSdIVbL9JecsGVPuSoaLUP3i8bueDbEYyfcGxlgjXCzvYI4XlJ2GI_BHTv2oqJ8_SI_6LQbD-q5'
});

ref.child('playlist').on('child_changed', function(snap) {

  var track = processSnap(snap);

  if (track.voteCount >= 3 && !track.addedToPlaylist) {
    console.log('adding to spotify');
    // add to spotify
    playlist.addTrack(track);

    // mark as added
    track.addedToPlaylist = true;
    snap.ref().update(track);
  }

});

function processSnap (snap) {
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
};