uniform sampler2D map;
uniform sampler2D alphaMap;
varying vec2 vUv;
void main() {
    vec4 color = texture2D(map, vUv);
    vec4 alphaColor = texture2D(alphaMap, vUv);
    float alpha = alphaColor.a; // 线性渐变的透明度
    gl_FragColor = vec4(color.rgb, 1.0);
}