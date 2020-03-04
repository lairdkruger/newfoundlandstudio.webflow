window.addEventListener('load', function() {
    if (window.innerWidth < 480) {
        var curtainsShell = new CurtainsShell(
            morphShader.uniforms,
            morphShader.vertexShader,
            morphShader.fragmentShader
        )
    } else {
        var curtainsShell = new CurtainsShell(
            morphDitherShader.uniforms,
            morphDitherShader.vertexShader,
            morphDitherShader.fragmentShader
        )
    }
})
