'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function MascoteTeco(): React.JSX.Element {
  const rafRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const eyeLeft = svg.querySelector('#eye-left') as SVGGElement | null;
    const eyeRight = svg.querySelector('#eye-right') as SVGGElement | null;

    if (!eyeLeft || !eyeRight) return;

    const maxOffset = 70;
    let mouseX = 0;
    let mouseY = 0;
    let dirty = false;

    function getEyeCenter(eye: SVGGElement) {
      try {
        const bbox = eye.getBBox();
        if (!svg) return { x: 0, y: 0 };
        const svgRect: DOMRect = svg.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;

        if (!viewBox || viewBox.width === 0 || viewBox.height === 0) {
          return { x: 0, y: 0 };
        }

        const eyeCenterX = bbox.x + bbox.width / 2;
        const eyeCenterY = bbox.y + bbox.height / 2;

        const scaleX = svgRect.width / viewBox.width;
        const scaleY = svgRect.height / viewBox.height;

        const adjustedY = viewBox.height - eyeCenterY;

        const screenX = svgRect.left + eyeCenterX * scaleX;
        const screenY = svgRect.top + adjustedY * scaleY;

        return { x: screenX, y: screenY };
      } catch (error) {
        console.warn('Erro ao calcular o centro do olho:', error);
        return { x: 0, y: 0 };
      }
    }

    function update() {
      if (!svg) return;
      
      try {
        if (eyeLeft === null) return;
        const leftCenter = getEyeCenter(eyeLeft);
        if (eyeRight === null) return;
        const rightCenter = getEyeCenter(eyeRight);

        const dxL = mouseX - leftCenter.x;
        const dyL = mouseY - leftCenter.y;
        const distL = Math.sqrt(dxL * dxL + dyL * dyL);
        
        let offsetXL = 0, offsetYL = 0;
        if (distL > 0) {
          const normalizedXL = dxL / distL;
          const normalizedYL = dyL / distL;
          const clampedDistL = Math.min(maxOffset, distL * 0.5);
          offsetXL = normalizedXL * clampedDistL;
          offsetYL = normalizedYL * clampedDistL;
        }

        const dxR = mouseX - rightCenter.x;
        const dyR = mouseY - rightCenter.y;
        const distR = Math.sqrt(dxR * dxR + dyR * dyR);
        
        let offsetXR = 0, offsetYR = 0;
        if (distR > 0) {
          const normalizedXR = dxR / distR;
          const normalizedYR = dyR / distR;
          const clampedDistR = Math.min(maxOffset, distR * 0.2);
          offsetXR = normalizedXR * clampedDistR;
          offsetYR = normalizedYR * clampedDistR;
        }

        if (!isBlinking) {
          eyeLeft.style.transform = `translate(${offsetXL.toFixed(2)}px, ${-offsetYL.toFixed(2)}px)`;
          eyeRight.style.transform = `translate(${offsetXR.toFixed(2)}px, ${-offsetYR.toFixed(2)}px)`;
        }

      } catch (error) {
        console.warn('Erro na atualização dos olhos:', error);
      }

      dirty = false;
      rafRef.current = null;
    }

    function schedule() {
      if (!dirty) {
        dirty = true;
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(update);
        }
      }
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      schedule();
    }

    function onResize() {
      schedule();
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    schedule();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isBlinking]);

  const handleClick = () => {
    if (isBlinking) return;
    
    setIsBlinking(true);
    
    setTimeout(() => {
      setIsBlinking(false);
    }, 400);
  };

  return (
    <div 
      className="w-[300px] h-[300px] mx-auto cursor-pointer" 
      onClick={handleClick}
    >
      <svg
        ref={svgRef}
        id="mascote-svg"
        viewBox="0 0 5000 5000"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0,5000) scale(1,-1)" fill="#ffffff" stroke="none">
          {/* Corpo */}
          <path d="M2360 3933 c-236 -37 -400 -100 -565 -218 -260 -185 -434 -452 -499
-767 -21 -101 -21 -326 -1 -444 80 -454 426 -837 869 -961 l99 -28 19 -45
c167 -391 177 -408 233 -394 30 7 56 57 166 317 29 70 59 127 66 127 7 0 57
14 110 31 115 37 229 92 333 162 105 70 272 244 338 350 289 466 245 1039
-113 1460 -176 208 -453 360 -735 402 -87 14 -259 18 -320 8z m347 -88 c151
-29 292 -86 418 -170 474 -315 651 -935 410 -1442 -114 -242 -309 -438 -549
-552 -74 -36 -194 -76 -202 -68 -3 3 53 143 125 310 72 168 131 311 131 318 0
32 -41 77 -96 106 -247 132 -771 114 -942 -33 -33 -28 -42 -42 -42 -67 0 -19
55 -159 130 -331 71 -165 127 -302 125 -305 -9 -8 -145 39 -219 76 -161 80
-313 205 -417 342 -239 317 -294 763 -140 1132 144 345 469 610 841 684 92 19
330 18 427 0z" />

          {/* Olho esquerdo */}
          <g id="eye-left" style={{ 
            transformOrigin: 'center', 
            transition: isBlinking ? 'none' : 'transform 0.1s ease-out'
          }}>
            <path 
              d="M1828 3050 c-57 -31 -82 -74 -86 -150 -3 -55 0 -70 20 -100 97 -143
328 -78 328 91 0 134 -143 221 -262 159z" 
              style={{
                transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)',
                transition: 'transform 0.2s ease-in-out',
                transformOrigin: 'center'
              }}
            />
          </g>

          {/* Olho direito */}
          <g id="eye-right" style={{ 
            transformOrigin: 'center', 
            transition: isBlinking ? 'none' : 'transform 0.1s ease-out'
          }}>
            <path 
              d="M2958 3050 c-56 -30 -82 -73 -86 -146 -3 -43 1 -70 12 -92 62 -120
250 -122 313 -2 38 71 28 147 -25 204 -54 57 -144 72 -214 36z" 
              style={{
                transform: isBlinking ? 'scaleY(0.1)' : 'scaleY(1)',
                transition: 'transform 0.2s ease-in-out',
                transformOrigin: 'center'
              }}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}