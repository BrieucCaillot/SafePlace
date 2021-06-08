import SceneName from '@/constants/enums/SceneName'
import useSceneStore, { SceneData } from '@/stores/useSceneStore'
import { Suspense, useCallback } from 'react'

const Scene = ({
  name,
  sceneData: { Component, scene, cameraRef },
}: {
  name: string
  sceneData: SceneData
}) => {
  const refCb = useCallback((ref: THREE.Camera) => {
    cameraRef.current = ref
    useSceneStore
      .getState()
      .setSceneLoaded(name as SceneName, cameraRef.current !== null)
  }, [])

  return (
    <Suspense fallback={'loading'}>
      <Component scene={scene} ref={refCb} />
    </Suspense>
  )
}

export default Scene
