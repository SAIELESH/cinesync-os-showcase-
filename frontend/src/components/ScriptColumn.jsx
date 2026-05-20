import ColumnHeader from "../layout/ColumnHeader";
import ScriptInput   from "./ScriptInput";
import SceneCard     from "./SceneCard";
import styles        from "./ScriptColumn.module.css";

export default function ScriptColumn({
  scriptText, onScriptChange,
  scenes, isParsing, onParse,
  activeSceneId, onSceneSelect,
  addScene, updateScene, deleteScene, error
}) {
  return (
    <section className={styles.column}>
      <ColumnHeader
        step="01"
        title="Context"
        subtitle="Script &amp; Scene Breakdown"
      />

      <ScriptInput
        value={scriptText}
        onChange={onScriptChange}
        onParse={onParse}
        isParsing={isParsing}
      />

      <button
        onClick={addScene}
        className={styles.addBtn}> + Add Scene
      </button>

      <div className={styles.sceneSection}>
        
	{error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

	{scenes.length === 0 && !isParsing && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>⬡</span>
            <p>Parse your script to generate scene cards</p>
          </div>
        )}

        {isParsing && (
          <div className={styles.empty}>
            <span className={styles.spinner} />
            <p>Breaking script into scenes…</p>
          </div>
        )}

        {scenes.length > 0 && (
          <div className={styles.list}>
            {scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                isActive={activeSceneId === scene.id}
                onSelect={onSceneSelect}
                onUpdate={updateScene}
                onDelete={deleteScene}
              />

            ))}
          </div>
        )}
      </div>
    </section>
  );
}
