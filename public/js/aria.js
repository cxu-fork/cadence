/**
 * ARIA's Async Engine
 */
$(document).ready(function () {
  $('#searchButton').click(function (e) {

    // Create a key 'search' to send in JSON
    var data = {};
    data.search = $('#searchInput').val();

    $.ajax({
      type: 'POST',
      url: 'http://cadenceradio.com/search',
      dataType: 'application/json',
      data: data,
      dataType: "json",
      success: function (data) {
        console.log("Success");
        console.log("=================")
        let i = 1;

        // Create the container table
        var table = "<table>";

        if (data.length !== 0) {
          data.forEach(function (song) {
            console.log("RESULT " + i)
            console.log("Title: " + song.title);
            console.log("Artist(s): " + song.artist);
            console.log("Album: " + song.album);
            i++;
            console.log("=================")

            table += "<tr><td>" + song.title + "</td><td>" + song.artist + "</td><td><button>REQUEST</button></td></tr>";
          })
        } else {
          console.log("No results found. :(");
        }

        table += "</table>";
        // Put table into results html
        document.getElementById("results").innerHTML = table;

      },
      error: function () {
        console.log("Failure");
      }
    });
  });
})