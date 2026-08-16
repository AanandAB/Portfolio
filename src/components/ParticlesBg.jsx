import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'

/* ─── Single twinkling particle group ─── */
function createParticleGroup({ count, minSize, maxSize, twinkleSpeed, phaseOffset }) {
  const geometry = new THREE.BufferGeometry()
  const vertices = []
  const sizes = []
  for (let i = 0; i < count; i++) {
    vertices.push(2000 * Math.random() - 1000, 2000 * Math.random() - 1000, 2000 * Math.random() - 1000)
    sizes.push(minSize + Math.random() * (maxSize - minSize))
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

  const sprite = new THREE.TextureLoader().load(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sHDgwCEMBJZu0AAAAdaVRYdENvbW1lbnQAAAAAAENyZWF0ZWQgd2l0aCBHSU1QZC5lBwAABM5JREFUWMO1V0tPG2cUPZ4Hxh6DazIOrjFNqJs0FIMqWFgWQkatsmvVbtggKlSVRVf5AWz4AWz4AUSKEChll19QJYSXkECuhFxsHjEhxCYm+DWGMZ5HF72DJq4bAzFXurI0M/I5997v3u9cC65vTJVn2lX/xHINQOYSBLTLEuIuCWw4Z3IGAEvf6ASmVHjNzHCXBG4A0AjACsAOwEbO0nsFQBnAGYASAIl+ZRMR7SolMEdsByD09fV5R0ZGgg8ePPjW5/N1iqLYpuu6RZblciKR2I9Go69evnwZnZ+fjwI4IS8AKBIRzeQfJWCANwKwh0KhtrGxsYehUOin1tbW+zzP23ietzY2NnIAoGmaLsuyUiqVyvl8XtrY2NiamZn589mzZxsAUgCOAeQAnFI2tI+VxIjaAeDzoaGh7xYWFuZOTk6OZVk+12uYqqq6JEnn0Wg0OT4+/geAXwGEAdwDIFJQXC1wO4DWR48e/RCPxxclSSroVzRFUbSDg4P848ePFwH8DuAhkWih83TRQWxFOXgAwvDwcOfo6OhvXV1d39tsNtuVBwTDWBwOh1UUxVsMw1hXVlbSdCgNV43uYSvrHg6H24aHh38eHBz85TrgF9FYLHA4HLzH43FvbW2d7u/vG+dANp8FpqIlbd3d3V8Fg8EfBUFw4BONZVmL3+9vHhkZCQL4AoAHgJPK8G+yzC0XDofdoVAo5PP5vkadTBAEtr+/39ff3x8gAp/RPOEqx2qjx+NpvXv3bk9DQ0NDvQgwDIOWlhZrMBj8kgi0UJdxRgYMArzL5XJ7vd57qLPZ7Xamp6fnNgBXtQxcjFuHw+Hyer3t9SYgCAITCAScAJoBNNEY/08GOFVVrfVMv7kMNDntFD1vjIAPrlRN0xjckOm6biFQ3jwNPwDMZrOnqVTqfb3Bi8Wivru7W/VCYkwPlKOjo0IikXh7EwQikYgE4Nw0CfXKDCipVCoTj8df3QABbW1tLUc6oUgkFPMkVACUNjc337148eKvw8PDbJ2jP1taWkoCyNDVXDSECmNSK4qiKNLq6urW8+fPI/UicHx8rD59+jSVy+WOAKSJhKENwFItLtoxk8mwsixzHR0dHe3t7c5PAU+n09rs7OzJkydPYqVSaQfANoDXALIk31S2smU1TWMPDg7K5XKZ7+3t9TudTut1U7+wsFCcmJiIpdPpbQBxADsAknQWymYCOukBHYCuKApisdhpMpnURFEU79y503TVyKenpzOTk5M7e3t7MQKPV0Zv1gNm+awB0MvlshqLxfLb29uyJElWURSbXC4XXyvqxcXFs6mpqeTc3Nzu3t7e3wQcA7BPZ8Cov1pNlJplmQtAG8MwHV6v95tAINA5MDBwPxAIuLu6upr8fr/VAN3c3JQjkcjZ+vp6fnl5+d2bN29SuVzuNYAEpf01CdRChUL+X1VskHACuA3Ay3Fcu9vt7nA6nZ7m5uYWQRCaNE3jVVW15PP580KhIGUymWw2m00DOAJwSP4WwPtq4LX2Ao6USxNlQyS/RcQcdLGwlNIz6vEMAaZpNzCk2Pll94LK/cDYimxERiBwG10sxjgvEZBE0UpE6vxj+0Ct5bTaXthgEhRmja8QWNkkPGsuIpfdjpkK+cZUWTC0KredVmtD/gdlSl6EG4AMvQAAAABJRU5ErkJggg=='
  )

  const mat = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    map: sprite,
    alphaTest: 0.3,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const points = new THREE.Points(geometry, mat)
  const meta = { twinkleSpeed, phaseOffset, baseSizes: sizes }

  return { points, material: mat, meta }
}

export default function ParticlesBg({ color = '#38bdf8', style = {} }) {
  const mountRef = useRef(null)

  // Create groups once
  const groups = useMemo(() => [
    createParticleGroup({ count: 3000, minSize: 2, maxSize: 6, twinkleSpeed: 0.4, phaseOffset: 0 }),
    createParticleGroup({ count: 2000, minSize: 4, maxSize: 10, twinkleSpeed: 0.9, phaseOffset: 1.2 }),
    createParticleGroup({ count: 1000, minSize: 6, maxSize: 16, twinkleSpeed: 1.7, phaseOffset: 2.8 }),
  ], [])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let camera, scene, renderer, animationFrameId
    let mouseX = 0, mouseY = 0

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000)
    camera.position.z = 1000

    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.0008)

    // Add all groups to scene
    groups.forEach(g => {
      g.material.color.setStyle(color)
      scene.add(g.points)
    })

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    const handlePointerMove = (event) => {
      if (event.isPrimary) {
        mouseX = event.clientX - window.innerWidth / 2
        mouseY = event.clientY - window.innerHeight / 2
      }
    }

    const animateScene = () => {
      const t = Date.now() * 0.001

      // Twinkle each group independently
      groups.forEach(g => {
        const { twinkleSpeed, phaseOffset } = g.meta
        const wave = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * twinkleSpeed + phaseOffset))
        g.material.opacity = wave
      })

      // Subtle hue shift
      const h = ((360 * (1.0 + t * 0.02)) % 360) / 360
      groups.forEach(g => g.material.color.setHSL(h, 0.4, 0.5))

      camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animateScene)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('pointermove', handlePointerMove)
    animateScene()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointermove', handlePointerMove)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      groups.forEach(g => { g.material.dispose(); g.points.geometry.dispose() })
      container.removeChild(renderer.domElement)
    }
  }, [color, groups])

  return (
    <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, ...style }} />
  )
}
