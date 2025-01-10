uniform vec3 uColor;
uniform vec3 uBgColor;
varying float vOpacity;
void main() {
    // gl_FragColor = vec4(uBgColor + uColor * vOpacity, vOpacity);
    gl_FragColor = vec4(uBgColor + uColor * vOpacity, 1.0);
}