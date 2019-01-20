chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    console.log(response);
    console.log('received from content');
    console.log($('#isToggled').prop("checked"))
    sendResponse($('#isToggled').prop("checked"));
});

document.addEventListener('DOMContentLoaded', function() {

    $("#load-4").hide();
    $("#buffer").hide();

     var elem = $("#isToggled");
//   var result = $(elem).prop("checked");
    // result is false

    chrome.storage.sync.get('status' ,function(button){
        var a = button.status;
        var b = 0;

        if(a){
              elem.prop('checked',true);
              b += 1;

              if(b==1){
              // $("#buffer").show();
               $("#typed-strings").hide();
                window.human = false;

                /* ======== Fireworks script ==========
                var canvasEl = document.querySelector('.fireworks');
                var ctx = canvasEl.getContext('2d');
                var numberOfParticules = 30;
                var pointerX = 0;
                var pointerY = 0;
                var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
                var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

                function setCanvasSize() {
                  canvasEl.width = window.innerWidth * 15;
                  canvasEl.height = window.innerHeight * 15 ;
                  canvasEl.style.width = window.innerWidth / 2 + 'px';
                  canvasEl.style.height = window.innerHeight / 2 + 'px';
                  canvasEl.getContext('2d').scale(3, 3);
                }

                function updateCoords(e) {
                  pointerX = e.clientX || e.touches[0].clientX;
                  pointerY = e.clientY || e.touches[0].clientY;
                }

                function setParticuleDirection(p) {
                  var angle = anime.random(0, 360) * Math.PI / 180;
                  var value = anime.random(50, 180);
                  var radius = [-1, 1][anime.random(0, 1)] * value;
                  return {
                    x: p.x + radius * Math.cos(angle),
                    y: p.y + radius * Math.sin(angle)
                  }
                }

                function createParticule(x,y) {
                  var p = {};
                  p.x = x;
                  p.y = y;
                  p.color = colors[anime.random(0, colors.length - 1)];
                  p.radius = anime.random(16, 32);
                  p.endPos = setParticuleDirection(p);
                  p.draw = function() {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                  }
                  return p;
                }

                function createCircle(x,y) {
                  var p = {};
                  p.x = x;
                  p.y = y;
                  p.color = '#FFF';
                  p.radius = 0.1;
                  p.alpha = .5;
                  p.lineWidth = 6;
                  p.draw = function() {
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
                    ctx.lineWidth = p.lineWidth;
                    ctx.strokeStyle = p.color;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                  }
                  return p;
                }

                function renderParticule(anim) {
                  for (var i = 0; i < anim.animatables.length; i++) {
                    anim.animatables[i].target.draw();
                  }
                }

                function animateParticules(x, y) {
                  var circle = createCircle(x, y);
                  var particules = [];
                  for (var i = 0; i < numberOfParticules; i++) {
                    particules.push(createParticule(x, y));
                  }
                  anime.timeline().add({
                    targets: particules,
                    x: function(p) { return p.endPos.x; },
                    y: function(p) { return p.endPos.y; },
                    radius: 0.1,
                    duration: anime.random(1200, 1800),
                    easing: 'easeOutExpo',
                    update: renderParticule
                  })
                    .add({
                    targets: circle,
                    radius: anime.random(80, 160),
                    lineWidth: 0,
                    alpha: {
                      value: 0,
                      easing: 'linear',
                      duration: anime.random(600, 800),
                    },
                    duration: anime.random(1200, 1800),
                    easing: 'easeOutExpo',
                    update: renderParticule,
                    offset: 0
                  });
                }

                var render = anime({
                  duration: Infinity,
                  update: function() {
                    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
                  }
                });

                document.addEventListener(tap, function(e) {
                  window.human = true;
                  render.play();
                  updateCoords(e);
                  animateParticules(pointerX, pointerY);
                }, false);

                //var centerX = window.innerWidth / 8;
                //var centerY = window.innerHeight / 8;

                function autoClick() {
                  if (window.human) return;
                  animateParticules(
                    anime.random(centerX-5, centerX+5),
                    anime.random(centerY-50, centerY+50)
                  );
                  anime({duration: 200}).finished.then(autoClick);
                }
                /* ============ end here ========== */


               $("#load-4").show();
               var animation = anime({
                    targets: '#circle',
                    translateX: 180,
                    delay: function(el, i) { return i * 100; },
                    direction: 'alternate',
                    loop: true,
                    easing: 'easeInOutSine'
               });

               var typed = new Typed("#typed", {

				strings: ["Buildng a frenly world"],
				typeSpeed:80,
				backSpeed:50,
				loop:true,
				});

              //var animation = anime({
              //  targets: '#circle',
              //  translateX: 150,
              //  direction: 'alternate',
              //  loop: true,
              //  easing: 'easeInOutQuad',
              //  autoplay: false
              // });

              //function loop(t) {
              //  animation.tick(t);
              //  customRAF = requestAnimationFrame(loop);
              // }

              //requestAnimationFrame(loop);

              }
        };

            if(a==false){

              $("#typed-strings").hide();
              $("#load-4").hide();

              var typed = new Typed("#ohno", {

				strings: ["disabled..."],
				typeSpeed:80,
				backSpeed:50,
				loop:true,
				});


            }

        });

    $("#wrap-button").click(function(button){
        console.log('haha');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log(tabs.length);
            console.log(tabs[0].url);
            chrome.tabs.sendMessage(tabs[0].id, "wrap", function(response) {
                console.log(response);
            });
        });
    });

    $("#isToggled").change(function(button){

       var result = $(elem).prop("checked");

        if(result == false){
            chrome.storage.sync.set({'status': false});
            console.log("disabled");
            $("#typed").hide();
            $("#buffer").hide();
            $("#typed-strings").hide();
            $("#message").hide();
            $("#load-4").hide();


            var typed = new Typed("#ohno", {

				strings: ["disabled..."],
				typeSpeed:80,
				backSpeed:50,
				loop:true,
				});

        };

        if(result == true){

                $("#ohno").hide();
                //$("#buffer").show();
                //$("#circle").show();
                $("#typed-strings").hide();
                $("#load-4").show();






                var animation = anime({
                    targets: '#circle',
                    translateX: 180,
                    delay: function(el, i) { return i * 100; },
                    direction: 'alternate',
                    loop: true,
                    easing: 'easeInOutSine',
               });


                var typed = new Typed('#typed', {
                            stringsElement: '#typed-strings',
                            typeSpeed: 50,
                            loop: false,
                            });

            chrome.storage.sync.set({'status':true});
            console.log("enabled");
            console.log("into main");
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                console.log(tabs.length);
                console.log(tabs[0].url);
                chrome.tabs.sendMessage(tabs[0].id, {type:"getText"}, function(response) {
                    console.log(response);
                });
            });
        };
    });

});




//var typed = new Typed("#typed", {

//				strings: ["Running..."],
//				typeSpeed:80,
//				backSpeed:50,
//				loop:true,

//				});
