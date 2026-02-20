// Grainient — Animated grain gradient background (pure WebGL2, no dependencies)
// Ported from react-bits Grainient component

const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uColor1, uColor2, uColor3;
out vec4 fragColor;

mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i),f),dot(-1.0+2.0*hash(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0,1)),f-vec2(0,1)),dot(-1.0+2.0*hash(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);return 0.5+0.5*n;}

void main(){
  float t = iTime * 0.15;
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float ratio = iResolution.x / iResolution.y;
  vec2 tuv = uv - 0.5;
  tuv /= 0.9;

  float degree = noise(vec2(t*0.1, tuv.x*tuv.y) * 2.0);
  tuv.y /= ratio;
  tuv *= Rot(radians((degree-0.5)*400.0+180.0));
  tuv.y *= ratio;

  float warpTime = t * 1.5;
  tuv.x += sin(tuv.y*4.0 + warpTime) / 60.0;
  tuv.y += sin(tuv.x*6.0 + warpTime) / 30.0;

  float s = 0.05;
  mat2 blendRot = Rot(0.0);
  float blendX = (tuv * blendRot).x;
  vec3 layer1 = mix(uColor3, uColor2, smoothstep(-0.3-s, 0.2+s, blendX));
  vec3 layer2 = mix(uColor2, uColor1, smoothstep(-0.3-s, 0.2+s, blendX));
  vec3 col = mix(layer1, layer2, smoothstep(0.5+s, -0.3-s, tuv.y));

  // Animated grain
  vec2 grainUv = uv * 2.0 + vec2(iTime*0.05);
  float grain = fract(sin(dot(grainUv, vec2(12.9898,78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.12;

  // Contrast & saturation
  col = (col - 0.5) * 1.4 + 0.5;
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(luma), col, 0.8);
  col = clamp(col, 0.0, 1.0);

  fragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!r) return [1, 1, 1];
    return [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255];
}

function initGrainient(container, initialColors) {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
    if (!gl) { console.warn('WebGL2 not supported'); return null; }

    // Compile shaders
    function compile(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(s));
            return null;
        }
        return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(prog));
        return null;
    }
    gl.useProgram(prog);

    // Full-screen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uRes = gl.getUniformLocation(prog, 'iResolution');
    const uTime = gl.getUniformLocation(prog, 'iTime');
    const uC1 = gl.getUniformLocation(prog, 'uColor1');
    const uC2 = gl.getUniformLocation(prog, 'uColor2');
    const uC3 = gl.getUniformLocation(prog, 'uColor3');

    let c1 = hexToRgb(initialColors[0]);
    let c2 = hexToRgb(initialColors[1]);
    let c3 = hexToRgb(initialColors[2]);
    let targetC1 = c1.slice(), targetC2 = c2.slice(), targetC3 = c3.slice();

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = container.getBoundingClientRect();
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let raf = 0;
    const t0 = performance.now();

    function loop(t) {
        const speed = 0.03;
        for (let i = 0; i < 3; i++) {
            c1[i] += (targetC1[i] - c1[i]) * speed;
            c2[i] += (targetC2[i] - c2[i]) * speed;
            c3[i] += (targetC3[i] - c3[i]) * speed;
        }

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (t - t0) * 0.001);
        gl.uniform3fv(uC1, c1);
        gl.uniform3fv(uC2, c2);
        gl.uniform3fv(uC3, c3);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return {
        setColors(hex1, hex2, hex3) {
            targetC1 = hexToRgb(hex1);
            targetC2 = hexToRgb(hex2);
            targetC3 = hexToRgb(hex3);
        },
        destroy() {
            cancelAnimationFrame(raf);
            ro.disconnect();
            try { container.removeChild(canvas); } catch {}
        }
    };
}
