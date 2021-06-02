import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'
import { RefObject, useCallback, useEffect, useMemo, useRef } from 'react'

import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import useConfigActions from '@/hooks/animation/useConfigActions'
import useAnimManager from '@/hooks/animation/useAnimManager'

const LakeLilies = ({ object }: { object: THREE.Object3D }) => {
  const { scene, animations } = useGLTF('/models/journey/waterlily.glb')
  const reverseChildren = useMemo(() => [...object.children].reverse(), [])
  const [lilypads, ...flowerPoints] = reverseChildren

  const animGroupRef = useRef<THREE.AnimationObjectGroup>(
    new THREE.AnimationObjectGroup()
  )

  const flowerRefCb = useCallback((m: THREE.Mesh) => {
    if (m === null || animGroupRef.current === null) return
    animGroupRef.current.add(m)
  }, [])

  const { actions, mixer } = useAnimations(
    animations,
    animGroupRef as RefObject<any>
  )

  const animName =
    'Leaf_6.003|Leaf_6.003|ArmatureAction.021|Leaf_6.003|Armatur.001'

  useConfigActions(actions, animName, {
    loop: [THREE.LoopRepeat, Infinity],
  })
  const { play, stop } = useAnimManager(actions, mixer, animName)
  useEffect(() => {
    play()
    return () => stop()
  }, [])

  const flowers = useMemo(
    () => flowerPoints.map(() => SkeletonUtils.clone(scene)),
    []
  )

  return (
    <GroupShorthand object={object}>
      <MeshShorthand object={lilypads as THREE.Mesh} />
      {flowerPoints.map((o, i) => (
        <GroupShorthand object={o}>
          <primitive object={flowers[i]} ref={flowerRefCb} />
        </GroupShorthand>
      ))}
    </GroupShorthand>
  )
}

export default LakeLilies
