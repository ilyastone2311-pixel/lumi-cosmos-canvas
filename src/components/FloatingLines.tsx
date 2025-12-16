import { useEffect, useRef, useCallback, memo } from 'react';
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  Vector3,
  Vector2,
  Clock
} from 'three';

import './FloatingLines.css';

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;
uniform float lineOpacity;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 getLineColor(float t) {
  if (lineGradientCount <= 1) {
    return lineGradient[0];
  }

  float clampedT = clamp(t, 0.0, 0.9999);
  float scaled = clampedT * float(lineGradientCount - 1);
  int idx = int(floor(scaled));
  float f = fract(scaled);
  int idx2 = min(idx + 1, lineGradientCount - 1);

  return mix(lineGradient[idx], lineGradient[idx2], f);
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.12;
  float amp        = sin(offset + time * 0.25) * 0.35;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.022 / max(abs(m) + 0.008, 1e-3);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  float totalIntensity = 0.0;
  vec3 col = vec3(0.0);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  // Bottom layer (furthest, subtle)
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t * 0.5);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      float intensity = wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.4;
      
      col += lineCol * intensity;
      totalIntensity += intensity;
    }
  }

  // Middle layer (main, brightest)
  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(0.3 + t * 0.5);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      float intensity = wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 1.5;
      
      col += lineCol * intensity;
      totalIntensity += intensity;
    }
  }

  // Top layer (closest, medium)
  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(0.6 + t * 0.4);
      
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      float intensity = wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.25;
      
      col += lineCol * intensity;
      totalIntensity += intensity;
    }
  }

  // Output with proper alpha for transparent background
  float alpha = clamp(totalIntensity * lineOpacity, 0.0, 1.0);
  fragColor = vec4(col * lineOpacity, alpha);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

type WavePosition = {
  x?: number;
  y?: number;
  rotate?: number;
};

interface FloatingLinesProps {
  enabledWaves?: ('top' | 'middle' | 'bottom')[];
  lineCount?: [number, number, number];
  lineDistance?: [number, number, number];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  linesGradient?: string[];
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  animationSpeed?: number;
  className?: string;
  opacity?: number;
  mixBlendMode?: string;
}

const hexToVec3 = (hex: string): Vector3 => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return new Vector3(r, g, b);
};

const FloatingLines = memo(({
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [8, 12, 16],
  lineDistance = [8, 6, 4],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition,
  linesGradient = ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'],
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  parallax = true,
  parallaxStrength = 12.0,
  animationSpeed = 1.0,
  className = '',
  opacity = 1,
  mixBlendMode = 'screen',
}: FloatingLinesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const uniformsRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const isDestroyedRef = useRef(false);

  const targetMouseRef = useRef(new Vector2(-1000, -1000));
  const currentMouseRef = useRef(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);
  const targetParallaxRef = useRef(new Vector2(0, 0));
  const currentParallaxRef = useRef(new Vector2(0, 0));

  const mouseDamping = 0.08;

  const [topLineCount, middleLineCount, bottomLineCount] = lineCount;
  const [topLineDistance, middleLineDistance, bottomLineDistance] = lineDistance;

  const cleanup = useCallback(() => {
    isDestroyedRef.current = true;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();
      const canvas = rendererRef.current.domElement;
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      rendererRef.current = null;
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    isDestroyedRef.current = false;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false,
      premultipliedAlpha: false,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },
      lineOpacity: { value: opacity },

      enableTop: { value: enabledWaves.includes('top') },
      enableMiddle: { value: enabledWaves.includes('middle') },
      enableBottom: { value: enabledWaves.includes('bottom') },

      topLineCount: { value: topLineCount },
      middleLineCount: { value: middleLineCount },
      bottomLineCount: { value: bottomLineCount },

      topLineDistance: { value: topLineDistance },
      middleLineDistance: { value: middleLineDistance },
      bottomLineDistance: { value: bottomLineDistance },

      topWavePosition: {
        value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4),
      },
      middleWavePosition: {
        value: new Vector3(
          middleWavePosition?.x ?? 5.0,
          middleWavePosition?.y ?? 0.0,
          middleWavePosition?.rotate ?? 0.2
        ),
      },
      bottomWavePosition: {
        value: new Vector3(
          bottomWavePosition?.x ?? 2.0,
          bottomWavePosition?.y ?? -0.7,
          bottomWavePosition?.rotate ?? 0.4
        ),
      },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)),
      },
      lineGradientCount: { value: 0 },
    };

    uniformsRef.current = uniforms;

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;

      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    const setSize = () => {
      if (isDestroyedRef.current) return;
      const el = containerRef.current;
      if (!el || !rendererRef.current) return;

      const width = el.clientWidth;
      const height = el.clientHeight;

      if (width === 0 || height === 0) return;

      rendererRef.current.setSize(width, height, false);

      const canvasWidth = rendererRef.current.domElement.width;
      const canvasHeight = rendererRef.current.domElement.height;
      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);
    };

    requestAnimationFrame(() => {
      setSize();
    });

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setSize, 150);
    }) : null;

    if (ro) {
      ro.observe(container);
    }

    let lastPointerMoveAt = 0;

    const handlePointerMove = (event: PointerEvent) => {
      if (isDestroyedRef.current) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.getPixelRatio();

      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
      targetInfluenceRef.current = 1.0;
      lastPointerMoveAt = performance.now();

      if (parallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
      }
    };

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
    };

    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('blur', handlePointerLeave);
      document.addEventListener('mouseleave', handlePointerLeave);
    }

    const renderLoop = () => {
      if (isDestroyedRef.current || !rendererRef.current) return;
      rafRef.current = requestAnimationFrame(renderLoop);

      uniforms.iTime.value = clock.getElapsedTime();

      if (interactive) {
        if (lastPointerMoveAt && performance.now() - lastPointerMoveAt > 200) {
          targetInfluenceRef.current = 0.0;
        }

        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouseRef.current);

        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }

      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
      }

      rendererRef.current.render(scene, camera);
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (ro) {
        ro.disconnect();
      }
      clearTimeout(resizeTimeout);

      if (interactive) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('blur', handlePointerLeave);
        document.removeEventListener('mouseleave', handlePointerLeave);
      }

      cleanup();
      geometry.dispose();
      material.dispose();
    };
  }, [
    enabledWaves.join(','),
    topLineCount, middleLineCount, bottomLineCount,
    topLineDistance, middleLineDistance, bottomLineDistance,
    interactive, bendRadius, bendStrength,
    parallax, parallaxStrength,
    animationSpeed, opacity,
    linesGradient.join(','),
    cleanup,
  ]);

  return (
    <div
      ref={containerRef}
      className={`floating-lines-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        mixBlendMode: mixBlendMode as any,
      }}
    />
  );
});

FloatingLines.displayName = 'FloatingLines';

export default FloatingLines;
