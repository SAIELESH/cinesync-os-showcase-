import "./index.css";
import { useState } from "react";

import AppShell from "./components/layout/AppShell";
import ScriptColumn from "./components/column1/ScriptColumn";
import EngineeringColumn from "./components/column2/EngineeringColumn";
import GenerationColumn from "./components/column3/GenerationColumn";

import { useScript } from "./hooks/useScript";
import { useShot } from "./hooks/useShot";
import { useGeneration } from "./hooks/useGeneration";

export default function App() {
  const {
    scriptText, setScriptText, scenes, isParsing,
    parseScript, activeSceneId, setActiveSceneId,
    activeScene, error, addScene, updateScene, deleteScene
  } = useScript();

  const {
    shots, generateShots, isGenerating,
    activeShotId, selectShot, updateShot,
    camera, setLens, setMovement, setFraming, isReady
  } = useShot();

  const { status, progress, videoUrl, generate } = useGeneration();

  const [imagePath, setImagePath] = useState(null);
  const [useReference, setUseReference] = useState(false);

  const activeShotData = shots.find((s) => s.id === activeShotId);

  function handleSceneSelect(sceneId) {
    const scene = scenes.find(s => s.id === sceneId);
    setActiveSceneId(sceneId);
    selectShot(null);

    if (scene) generateShots(scene);
  }

  return (
    <AppShell>
      <ScriptColumn {...{
        scriptText, onScriptChange: setScriptText, scenes,
        isParsing, onParse: parseScript,
        activeSceneId, onSceneSelect: handleSceneSelect,
        addScene, updateScene, deleteScene, error
      }} />

      <EngineeringColumn
        activeScene={activeScene}
        shots={shots}
        isGenerating={isGenerating}
        activeShotId={activeShotId}
        onShotSelect={selectShot}
        onShotUpdate={updateShot}
        camera={camera}
        onLensChange={setLens}
        onMovementChange={setMovement}
        onFramingChange={setFraming}
        imagePath={imagePath}
        setImagePath={setImagePath}
        useReference={useReference}
        setUseReference={setUseReference}
      />

      <GenerationColumn
        isReady={isReady}
        status={status}
        progress={progress}
        videoUrl={videoUrl}
        onGenerate={() => generate(activeScene, activeShotData, camera, imagePath, useReference)}
      />
    </AppShell>
  );
}