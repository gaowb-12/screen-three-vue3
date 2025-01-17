uniform sampler2D map;
uniform vec3 emissive;
uniform float emissiveIntensity;
varying vec2 vUv;
void main() {
    vec4 color = texture2D(map, sin(vUv) * 0.5 + 0.5);
    gl_FragColor = vec4(emissive.rgb*emissiveIntensity + color.rgb*color.a, color.a);
}