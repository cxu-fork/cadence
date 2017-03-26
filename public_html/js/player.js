// I'll put all the default onload stuff in here
function defaultPlayer() {
  var vol = 0.77;
  document.getElementById("volume").value = 0.77;
  var volume = document.getElementById("stream");
  volume.volume = vol;
}

// When you hit the play button
function playerToggle() {
  var stream = document.getElementById("stream");

  if (stream.paused) {
    stream.play();
    document.getElementById("playerToggle").innerHTML = "❚❚";
  } else {
    // Reloads the entire page (the old way) if on a mobile device so it doesnt keep loading in the background. 
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      location.reload(); // wew wew
    } else {
      stream.load(); // wew 
    }
       
    document.getElementById("playerToggle").innerHTML = "►";
  }
}

// When you change the volume
function volumeToggle(vol) {
  var volume = document.getElementById("stream");
  volume.volume = vol;
}

// GETS and displays currently playing info
function radioTitle() {
  // Located on testament's stream web folder
  var url = 'http://198.37.25.127:8000/json.xsl';

  $.ajax({
    type: 'GET',
    url: url,
    async: true,
    jsonpCallback: 'parseMusic',
    contentType: "application/json",
    dataType: 'jsonp',
    success: function (json) {
      // do not mix up id with the "title" for the page heading
      $('#song_title').text(json['/cadence1']['song_title']);
      $('#artist_name').text(json['/cadence1']['artist_name']);
    },
    error: function (e) {
      console.log(e.message);
    }
  });
}

$(document).ready(function () {
  setTimeout(function () {
    radioTitle();
  }, 0);
  setInterval(function () {
    radioTitle();
  }, 10000);
});