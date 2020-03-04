window.addEventListener('load', function() {
    var threeTemplate = new Macintosh()
})

var frontPage = document.getElementById('front-page')
var loadingPage = document.getElementById('loading-page')
var enterButton = document.getElementById('enter-button')
var threeCanvas = document.getElementsByTagName('canvas')

var fade = {
    opacity: 0,
}

enterButton.addEventListener(
    'click',
    function(event) {
        setTimeout(function() {
            loadingPage.remove()
            frontPage.style.display = 'block'

            for (var i = 0; i < threeCanvas.length; i++) {
                threeCanvas[i].remove()
            }

            if (window.innerWidth < 480) {
                var curtainsShell = new CurtainsShell(
                    morphShader.uniforms,
                    morphShader.vertexShader,
                    morphShader.fragmentShader
                )
            } else {
                var curtainsShell = new CurtainsShell(
                    morphShader.uniforms,
                    morphShader.vertexShader,
                    morphShader.fragmentShader
                )
            }

            TweenLite.to(fade, 4, {
                opacity: 1,
                ease: Power4.Out,
                onUpdate: function() {
                    document.getElementById('front-page').style.opacity = fade.opacity
                },
            })
        }, 1200)

        // for safari
        setTimeout(function() {
            document.getElementById('front-page').style.opacity = 1.0
        }, 1300)
    },
    false
)
