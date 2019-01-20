/*
    Content script for READ function to be executed while the extension is being loaded.
*/

function onWindowLoad() {
    // prepare data for Facebook, Youtube and Twitter comments & post section
    var fbComments = [].slice.call($('[data-testid="UFI2Comment/body"]'));
    var fbPosts = [].slice.call($("[data-ad-preview='message']"));
    var ytPosts = [].slice.call($("span#video-title"));
    var ytComments = [].slice.call($("yt-formatted-string#content-text"));
    var ytMainTitle = [].slice.call($("h1.title"));
    var tweetPost = [].slice.call($("p.tweet-text"));

    var arr = fbComments.concat(fbPosts).concat(ytPosts).concat(ytComments).concat(ytMainTitle).concat(tweetPost);

    for(i=0; i<arr.length; i++){
        if (typeof arr[i] != "undefined"){
            arr[i] = arr[i].innerText;
        }
    };

    // package data as JSON to be transferred to server
    const Url = "http://127.0.0.1:5000/output"
    var data = {
                "text": JSON.stringify(arr)
               };
    console.log(data);

    // use AJAX to transfer data to backend server
    $.ajax({
        url: Url,
        type: "POST",
        data: data,
        success: function(result){
            replaceWithSomething(result);
        },
        error: function(error){
            console.log(error);
        }
    })
}

// Function to replace detected mean comments with something
function replaceWithSomething(result){

    result = result.split(';');
    console.log(result.length);
    if (result.length > 6) {
        var homepage = window.location.href.split('/');
        homepage.pop()
        homepage = homepage.join('/')
        var modal = `
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Very Negative Content Ahead...</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <img class="img-modal center" src=` + chrome.extension.getURL("bright.jpg") + `>
                <br/>
                <p>There are some very negative contents ahead. You can choose to leave this page now.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" onclick="window.location.href='` + homepage + `'">Leave</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Continue to view</button>
              </div>
            </div>
          </div>
        </div>
        `
        if ($('#exampleModal').length === 0){
            $("html").prepend(modal);
        }
        if (! $('#exampleModal').hasClass('hide')){
            $('#exampleModal').modal('show');
            $('#exampleModal').addClass('hide');
        }
        console.log($('#exampleModal'));
    }

    for(i=0; i<result.length; i++){
        if(result[i] != ""){
            console.log(result[i]);

            // find nodes in HTML that contain the words in the mean comments
            var ele = getNodesThatContain(result[i]);
            console.log(ele);

            // replace with some interesting effects
            // TODO: insert interesting effects here

            // var replaceable = '<span class="highlight">' + result[i] + '</span>';
            for(j=0; j<ele.length; j++){
                var replaceable = '<div class="image" id="image-' + (j+1) + '">' + result[i] + '</div>';
                // baffle animation
//                console.log('ele[j] ' + ele[j]);
//                var b = baffle(ele[j]);
//                b.set({
//                    characters: '█▓█ ▒░/▒░ █░▒▓/ █▒▒ ▓▒▓/█ ░█▒/ ▒▓░ █<░▒ ▓/░>',
//                    speed: 120
//                });
//                b.start().reveal(20000);
//                console.log(ele[j].outerHTML);
                if (! ele[j].outerHTML.includes('image')){
                    ele[j].innerHTML = ele[j].innerHTML.replace(result[i], replaceable);
                }

                // mean animation
//                $('.mean').css({"background-color":"yellow","border-radius":"15px","display":"block"});
//                anime({
//                    targets: '.mean',
//                    translateX: 800,
//                    width: '70%', // -> from '28px' to '100%',
//                    easing: 'easeInOutQuad',
//                    direction: 'alternate',
//                    loop: false
//                });
//                $('.mean').fadeOut(1500);
            }
            $(".image").unbind().click(function(e){
                var id = $(e.target).attr('id');
                console.log(id);
                if ($(".reveal").length == 0) {
                    if (confirm("❗❗ WARNING - This may be something mean, negative and hateful ❗❗ \nViewer discretion is advised.\nAre you sure you want to reveal it?")) {
                        $("#"+id).toggleClass('image');
                        $("#"+id).toggleClass('reveal');
                    }
                } else {
                    $("#"+id).toggleClass('reveal');
                    $("#"+id).toggleClass('image');
                }
            });
            // highlight animation
            // $('.highlight').fadeOut(3000);
        }
    }
}





// Helper function to get nodes that contains text
function getNodesThatContain(text) {
    var textNodes = $(document).find(":not(iframe, script)")
      .contents().filter(
          function() {
           return this.nodeType == 3
             && this.textContent.indexOf(text) > -1;
    });
    return textNodes.parent(); (previous)
    //return textNodes;
};

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
function main2() {
    $('head').append('<link type="text/css" href="style.css">');
    console.log('waiting...');
    $(window).load(function(){
        $("h3").val("Injecting script...");
        setTimeout(onWindowLoad, 2500);
        $("h3").val("Script loaded.");
        console.log($("h3"))
    });
    $(window).scrollEnd(function() {
        $("h3").val("Injecting script...");
        setTimeout(onWindowLoad, 2500);
        $("h3").val("Script loaded.");
    }, 1200);
}
//main2();

