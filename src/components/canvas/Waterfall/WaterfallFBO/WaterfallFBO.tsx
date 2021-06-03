import {
  forwardRef,
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { createPortal, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import useVector2Uniform from '@/hooks/uniforms/useVector2Uniform'
import fragmentShader from './WaterfallFBO.fs'
import vertexShader from './WaterfallFBO.vs'
import { folder, useControls } from 'leva'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import { WatchableRefObject } from '@/hooks/useWatchableRef'
import useWatchableUniform from '@/hooks/uniforms/useWatchableUniform'
import useVector3Uniform from '@/hooks/uniforms/useVector3Uniform'

const WaterfallFBO = forwardRef(
  (
    {
      scene,
      quadTexture,
      initTexture,
      mousePosRef,
      doesIntersectRef,
      sdfScene,
      slats,
    }: {
      scene: RefObject<THREE.Scene>
      quadTexture: WatchableRefObject<THREE.Texture>
      initTexture: WatchableRefObject<THREE.Texture>
      mousePosRef: WatchableRefObject<THREE.Vector3>
      doesIntersectRef: WatchableRefObject<boolean>
      sdfScene: THREE.Object3D
      slats: RefObject<{ getGroup: () => RefObject<THREE.Group> }>
    },
    ref: RefObject<THREE.Mesh>
  ) => {
    const clockRef = useRef<THREE.Clock>(new THREE.Clock())
    const {
      angleAmplitude,
      movementSpeed,
      lifeTime,
      sdfOffset,
      rounding,
      cursorSize,
      slatOffset,
      duration: foamDuration,
      durationVar: foamDurationVar,
      sensitivity: foamSensitivity,
      sensitivityVar: foamSensitivityVar,
    } = useControls('particles', {
      'Simulator Params': folder(
        {
          angleAmplitude: { value: 0.2, min: 0, max: Math.PI, label: 'Angle' },
          movementSpeed: {
            value: 11.7,
            min: 0,
            max: 30,
            label: 'Speed',
          },
          lifeTime: { value: 6.5, label: 'Life Time' },
          sdfOffset: { x: 0, y: 0, z: 0 },
          rounding: { value: 6.6, min: 0, max: 20 },
          cursorSize: { value: 0.8, min: 0, max: 10 },
          slatOffset: 3.8,
        },
        { collapsed: true }
      ),
      foam: folder({
        duration: 0.58,
        durationVar: 0.1,
        sensitivity: { value: 0.9, max: 1, min: 0 },
        sensitivityVar: { value: 0.1, max: 1, min: 0 },
      }),
    })

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uOrigPosTexture: { value: null },
      uPosTexture: { value: null },
      uMousePos: { value: new THREE.Vector3() },
      uDoesIntersect: { value: false },
      uTime: { value: 0 },
      uDelta: { value: 0 },
      uAngleAmplitude: { value: 0 },
      uMovementSpeed: { value: 0 },
      uLifeTime: { value: 0 },
      uSdfOffset: { value: new THREE.Vector3() },
      uRounding: { value: 0 },
      uCursorSize: { value: 0 },
      uSlatsPos: {
        value: new Array(5).fill(null).map(() => new THREE.Vector3()),
      },
      uSlatOffset: { value: 0 },
      uFoamDuration: { value: 0 },
      uFoamDurationVar: { value: 0 },
      uFoamSensitivity: { value: 0 },
      uFoamSensitivityVar: { value: 0 },
    })
    useNumberUniform(uniforms.current.uAngleAmplitude, angleAmplitude)
    useNumberUniform(uniforms.current.uMovementSpeed, movementSpeed)
    useNumberUniform(uniforms.current.uLifeTime, lifeTime)
    useNumberUniform(uniforms.current.uRounding, rounding)
    useNumberUniform(uniforms.current.uCursorSize, cursorSize)
    useVector3Uniform(uniforms.current.uSdfOffset, sdfOffset)
    useNumberUniform(uniforms.current.uSlatOffset, slatOffset)
    useWatchableUniform(uniforms.current.uPosTexture, quadTexture)
    useWatchableUniform(uniforms.current.uOrigPosTexture, initTexture)
    useWatchableUniform(uniforms.current.uMousePos, mousePosRef)
    useWatchableUniform(uniforms.current.uDoesIntersect, doesIntersectRef)
    useNumberUniform(uniforms.current.uFoamDuration, foamDuration)
    useNumberUniform(uniforms.current.uFoamDurationVar, foamDurationVar)
    useNumberUniform(uniforms.current.uFoamSensitivity, foamSensitivity)
    useNumberUniform(uniforms.current.uFoamSensitivityVar, foamSensitivityVar)

    useFrame(() => {
      uniforms.current.uTime.value = clockRef.current.elapsedTime
      uniforms.current.uDelta.value = clockRef.current.getDelta()
      if (slats.current === null) return
      ;(uniforms.current.uSlatsPos.value as THREE.Vector3[]).map((v, i) =>
        slats.current.getGroup().current.children[i].getWorldPosition(v)
      )
    })

    const frag = useMemo(() => {
      const format = (o: THREE.Vector3 | THREE.Quaternion) =>
        o
          .toArray()
          .map((n) => n.toFixed(3))
          .toString()
      const lines: Array<string> = []

      const genLine = (o: THREE.Object3D) => {
        const q = `vec4(${format(o.quaternion)})`
        const p = `vec3(${format(o.position)})`
        const s = `vec3(${format(o.scale)})`
        switch (o.name.match(/^(.*)_/)[1]) {
          case 'ellipsoid':
            return lines.push(`d = min(sdEllipsoid(${p} - pos, ${s}), d);`)
          case 'slat':
            const ns = o.name.substr(o.name.length - 1)
            const ni = Number.parseInt(ns) - 1
            // const c = (o.scale.z / 2).toFixed(3)
            return lines.push(
              `d = min(sdBox(rotateVector(${q}, uSlatsPos[${ni}] + vec3(0.,0., uSlatOffset) - pos ), ${s}), d);`
            )
          case 'sphere':
            return lines.push(`d = min(sdSphere(${p} - pos, ${o.scale.x}), d);`)
          case 'rounded_box':
            const n = o.name.substr(o.name.length - 1)
            const rounding = n === '3' ? 1 : 3
            const sr = format(o.scale.clone().subScalar(rounding))
            const r = rounding.toFixed(3)
            return lines.push(
              `d = min(sdRoundBox(rotateVector(${q}, ${p} - pos), vec3(${sr}), ${r}), d);`
            )
          default:
            return lines.push(
              `d = min(sdBox(rotateVector(${q}, ${p} - pos), ${s}), d);`
            )
          // sdRoundBox
        }
      }

      const b1 = sdfScene.children.find((o) => o.name === 'box_1')
      const q1 = `vec4(${format(b1.quaternion)})`
      const p1 = `vec3(${format(b1.position)})`
      const s1 = `vec3(${format(b1.scale)})`
      lines.push(`float d1 = sdBox(rotateVector(${q1}, ${p1} - pos), ${s1});`)
      const rb1 = sdfScene.children.find((o) => o.name === 'rounded_box_1')
      const rounding = 4
      const r = rounding.toFixed(3)
      const rq1 = `vec4(${format(rb1.quaternion)})`
      const rp1 = `vec3(${format(rb1.position)})`
      const rs1 = `vec3(${format(rb1.scale.clone().subScalar(rounding))})`
      lines.push(
        `float rd1 = sdRoundBox(rotateVector(${rq1}, ${rp1} - pos), vec3(${rs1}), ${r});`,
        'd = opSmoothUnion(rd1, d1, uRounding);'
      )

      for (const o of sdfScene.children) {
        if (o.name === 'box_1') continue
        if (o.name === 'rounded_box_1') continue
        genLine(o)
      }
      // const sdfString = ''
      return fragmentShader.replace('// Insert here', lines.join('\n'))
    }, [])

    return createPortal(
      <mesh scale={[1, 1, 1]} ref={ref}>
        <planeGeometry />
        <shaderMaterial
          uniforms={uniforms.current}
          fragmentShader={frag}
          vertexShader={vertexShader}
        />
      </mesh>,
      scene.current
    ) as JSX.Element
  }
)

export default WaterfallFBO
