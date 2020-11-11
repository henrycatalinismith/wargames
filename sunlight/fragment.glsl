uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform vec3 sunDirection;
varying vec2 vUv;
varying vec3 vNormal;

void main(void) {
  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
  vec3 nightColor = texture2D(nightTexture, vUv).rgb;
  float cosineAngleSunToNormal = dot(normalize(vNormal), sunDirection);
  cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 5.0, -1.0, 1.0);
  float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;
  vec3 color = mix(nightColor, dayColor, mixAmount);
  gl_FragColor = vec4(color, 1.0);
}

