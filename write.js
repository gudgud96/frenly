/*
    Content script for WRITE function to be executed while the extension is being loaded.
*/

function onLoad() {
    loadProgressBar();

    // Init a timeout variable to be used below
    var timeout = null;
    var inputSection = null;
    var commentSection = null;

    var currentSite = window.location.href;
    if (currentSite.indexOf("twitter") !== -1) {
        //twitter
        inputSection = $("div#tweet-box-home-timeline");
        commentSection = $("div#tweet-box-home-timeline.tweet-box div");
    } else if (currentSite.indexOf("youtube") !== -1) {
        // youtube
        inputSection = $('#contenteditable-textarea');
        commentSection = $('#contenteditable-textarea');
    } else {
        // facebook
        inputSection = $('[role="textbox"]');
        commentSection = $('[role="textbox"]');
    }
    console.log(commentSection);

    inputSection.keyup(function(){
        clearTimeout(timeout);
        timeout = setTimeout(function () {
                var comment = commentSection.text();
                console.log('comment ' + comment);
                var data = {
                            "text": comment
                           };
                // use AJAX to transfer data to backend server
                const Url = "http://127.0.0.1:5000/comment"
                $.ajax({
                    url: Url,
                    type: "POST",
                    data: data,
                    success: function(result){
                        console.log(result);
                        updateProgressBar(result);
                    },
                    error: function(error){
                        console.log(error);
                    }
                })
        }, 500);
    });
}

function updateProgressBar(result){
    var randomInt = Math.floor((Math.random() * 7) + 1);
    console.log(randomInt);
    var modal = `
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-body">
                <img class="img-modal center" src=` + chrome.extension.getURL("stop-being-rude-" + randomInt + ".jpg") + `>
                <br/>
                <p>Be nice to others. Choose your words nicely. Together, let's build a friendly web community!</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Okay, I will be nice</button>
              </div>
            </div>
          </div>
        </div>
        `
    var progressWidth = parseInt(result, 10) + 15;
    $(".progress-bar").css("width", progressWidth.toString() + "%");
    $(".progress-bar").removeClass('bg-success').removeClass('bg-warning').removeClass('bg-danger');
    if (progressWidth > 70){
        $(".progress-bar").addClass('bg-danger');
        $(".progress-bar").text("This comment is very mean! Be considerate!");
        $('#exampleModal').remove();
        if ($('#exampleModal').length === 0){
            $("html").prepend(modal);
            console.log('modal appended');
        }
        $('#exampleModal').modal('show');

    } else if (progressWidth > 40) {
        $(".progress-bar").addClass('bg-warning');
        $(".progress-bar").text("Slight mean! Wanna change it?");
    } else {
        $(".progress-bar").addClass('bg-success');
        $(".progress-bar").text("Nice!");
    }
}

function loadProgressBar() {
    var currentSite = window.location.href;
    console.log('Loading: ' + currentSite);

    var progressBar = `
    <div class="progress progress-pad">
      <div class="progress-bar  bg-success" role="progressbar" style="width: 15%" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100">Be kind!</div>
    </div>
    `
    if (currentSite.indexOf("twitter") !== -1) {
        // twitter
        if ($('.progress').length === 0){
            $(progressBar).insertAfter(".RichEditor");
        }
    } else if (currentSite.indexOf("youtube") !== -1) {
        // youtube
        if ($('.progress').length === 0){
            $(progressBar).insertAfter("#creation-box");
        }
    } else {
        // facebook
        if ($('.progress').length === 0){
            $(progressBar).insertAfter("#u_0_1m");
        }
        if ($('.progress').length === 0){
            $(progressBar).insertAfter("div._i-o._2j7c");
        }
        $('.progress').removeClass('progress-pad');
        $('.progress').addClass('progress-pad-fb');
    }
}

// Helper function to detect scroll end event
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};


// -------------------- MAIN FUNCTION --------------------------
function main() {
    console.log('Running main...');
    $('head').append('<link type="text/css" href="style.css">');
    $('head').append('<link type="text/css" href="bootstrap.min.css">');
    $('head').append('<link type="text/css" href="font-awesome.min.css">');
    onLoad();
    onWindowLoad();
    $(window).scrollEnd(function() {
        setTimeout(onWindowLoad, 500);
        setTimeout(onLoad, 500);
    }, 500);
}

// listen to message sent from toggle button - if received, load scripts
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    console.log(response);
    if (response === "wrap"){
        window.open("http://127.0.0.1:5000/wrap");
    } else {
        console.log('received');
        main();
    }
});

// check toggle button status - if on, load scripts
chrome.storage.sync.get('status' ,function(button){
    var response = button.status;
    if (response === true) {
        main();
    }
});