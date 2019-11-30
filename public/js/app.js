$.getJSON("/articles", function (data) {
  $("#articles").empty();
  data.forEach(function (article) {
    $("#articles").append("<div class='card'><a href='https://au.ign.com/" + article.link + "'><div class='card-body'><h5 class='card-title'>" + article.title + "</h5></a><button type='button' class='notesBtn' data-id='" + article._id + "'>Add note</button></div>")
  })
});
$(document).on("click", "#scraper", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(){
    location.reload(true);
  })
})

$(document).on("click", "#cleaner", function () {
  $.ajax({
    method: "GET",
    url: "/clear"
  }).then(function(){
    location.reload(true);
  })
})
// Whenever someone clicks a p tag
$(document).on("click", ".notesBtn", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data.link);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});