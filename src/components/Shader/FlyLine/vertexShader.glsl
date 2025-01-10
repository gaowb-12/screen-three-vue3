uniform float uTime;
uniform float uLength;
uniform float uDuration;

varying float vOpacity;

void main() {
    // 获取当前进度
    float progress = mod(uTime, uDuration) / uDuration;
    float a = position.z / uLength;
    vOpacity = smoothstep(progress - 0.1, progress, a) - smoothstep(progress, progress, a);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}