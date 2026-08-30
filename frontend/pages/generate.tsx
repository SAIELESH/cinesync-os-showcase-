import { useMemo, useState } from "react";
import { AppShell } from "@/components/global/layout/AppShell";
import { GenerateComposer } from "@/components/generate/GenerateComposer";
import { GenerateStatePanel } from "@/components/generate/GenerateStatePanel";
import { useGenerateVideo } from "@/hooks/useGenerateVideo";

export default function QuickGeneratePage() {
  const [concept, setConcept] = useState(
    "A man walking in rain under neon lights, cinematic reflections, slow emotional reveal."
  );
  const [styles, setStyles] = useState<string[]>(["Cinematic", "Dark"]);
  const { state, progress, activeStep, videoUrl, generate, reset } = useGenerateVideo();

  const resultTitle = useMemo(() => {
    if (!concept.trim()) {
      return "Untitled cinematic preview";
    }

    return concept.length > 58 ? `${concept.slice(0, 58)}...` : concept;
  }, [concept]);

  return (
    <AppShell navActionLabel="Open Director Mode" navActionHref="/app">
      <section className="px-6 py-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <GenerateComposer
            concept={concept}
            styles={styles}
            loading={state === "loading"}
            onConceptChange={setConcept}
            onStylesChange={setStyles}
            onGenerate={() => generate(concept, styles)}
            onReset={reset}
          />

          <div className="space-y-6">
            <GenerateStatePanel
              state={state}
              progress={progress}
              activeStep={activeStep}
              resultTitle={resultTitle}
              styles={styles}
              videoUrl={videoUrl}
              onImprove={() => {
                setConcept((prev) => `${prev} Highly detailed cinematic lighting, atmospheric 8k film quality.`);
                generate(`${concept} Highly detailed cinematic lighting, atmospheric 8k film quality.`, styles);
              }}
            />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
