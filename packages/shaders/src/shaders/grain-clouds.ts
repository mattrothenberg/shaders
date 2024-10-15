/**
 * Renders a grainy texture over top of blobby animated clouds
 * This is an example shader that we're using to bootstrap the project
 * Generated by Claude 3.5 Sonnet
 *
 * Parameters include:
 * color1: The first color of the clouds
 * color2: The second color of the clouds
 * noiseScale: The scale of the noise
 * noiseSpeed: The speed of the noise
 * grainAmount: The amount of grain on the texture
 */

export const grainCloudsFragmentShader = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_noiseScale;
  uniform float u_noiseSpeed;
  uniform float u_grainAmount;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // Calculate the aspect ratio of the shader
    float shaderAspect = u_resolution.x / u_resolution.y;

    // Define the aspect ratio of your content (e.g., 1.0 for square)
    float contentAspect = 1.0;

    // Adjust st to maintain content aspect ratio
    if (shaderAspect > contentAspect) {
      float scale = shaderAspect / contentAspect;
      st.x = (st.x - 0.5) * scale + 0.5;
    } else {
      float scale = contentAspect / shaderAspect;
      st.y = (st.y - 0.5) * scale + 0.5;
    }

    // Create blobby texture
    float n = snoise(st * u_noiseScale + u_time * u_noiseSpeed);
    n += 0.5 * snoise(st * u_noiseScale * 2.0 - u_time * u_noiseSpeed * 0.5);
    n += 0.25 * snoise(st * u_noiseScale * 4.0 + u_time * u_noiseSpeed * 0.25);
    n = n * 0.5 + 0.5;

    // Color interpolation
    vec3 color = mix(u_color1, u_color2, n);

    // Add grain
    float grain = fract(sin(dot(st * 1000.0, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * u_grainAmount;

    gl_FragColor = vec4(color, 1.0);
  }
`;
