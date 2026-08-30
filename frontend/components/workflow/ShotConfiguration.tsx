import { useState, useEffect } from "react";
import { Film, Upload, Loader2, Play } from "lucide-react";
import { Button } from "@/components/global/ui/Button";
import { Card } from "@/components/global/ui/Card";
import { generateVideo, uploadImage, type Scene, type Shot, type Camera } from "@/lib/api";
import { cn } from "@/lib/utils";

type ShotConfigurationProps = {
  scene: Scene | null;
  shots: Shot[];
  onVideoGenerated: (taskId: string) => void;
};

const lensOptions = ["24mm", "35mm", "50mm", "85mm", "100mm"];
const movementOptions = ["static", "dolly", "pan", "tilt", "tracking", "handheld", "zoom"];
const framingOptions = ["rule of thirds", "centered", "over shoulder", "dutch angle", "symmetrical"];

export function ShotConfiguration({
  scene,
  shots,
  onVideoGenerated,
}: ShotConfigurationProps) {
  const [selectedShotId, setSelectedShotId] = useState<string | null>(
    shots.length > 0 ? shots[0].id : null
  );
  const [camera, setCamera] = useState<Camera>({
    movement: "static",
    lens: "35mm",
    framing: "rule of thirds",
  });
  const [useReference, setUseReference] = useState(false);
  const [imagePath, setImagePath] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shots.length > 0) {
      if (!selectedShotId || !shots.some((s) => s.id === selectedShotId)) {
        const first = shots[0];
        setSelectedShotId(first.id);
        if (first.lens || first.camera_movement || first.framing) {
          setCamera({
            lens: first.lens || "35mm",
            movement: first.camera_movement || "static",
            framing: first.framing || "rule of thirds",
          });
        }
      }
    } else {
      setSelectedShotId(null);
    }
  }, [shots, selectedShotId]);

  const selectedShot = shots.find((s) => s.id === selectedShotId) || shots[0];

  const handleSelectShot = (shot: Shot) => {
    setSelectedShotId(shot.id);
    setCamera({
      lens: shot.lens || "35mm",
      movement: shot.camera_movement || "static",
      framing: shot.framing || "rule of thirds",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError(null);
    try {
      const result = await uploadImage(file);
      setImagePath(result.file_path);
      setUseReference(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload reference image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!scene || !selectedShot) {
      setError("Scene and shot are required");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateVideo({
        scene,
        shot: selectedShot,
        camera,
        image_path: useReference ? imagePath : undefined,
        use_reference: useReference,
      });
      onVideoGenerated(result.task_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate video");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!scene || shots.length === 0) {
    return (
      <Card className="p-6 lg:p-8">
        <div className="text-center text-slate-400">
          <Film className="mx-auto mb-4 size-12 opacity-50" />
          <p>No shots available. Generate shots for a scene first.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="spotlight p-6 lg:p-8">
      <div className="mb-6 space-y-3">
        <div className="text-sm uppercase tracking-[0.34em] text-slate-400">
          Step 3
        </div>
        <h1 className="font-[var(--font-sora)] text-3xl font-semibold text-white">
          Configure & Generate
        </h1>
        <p className="max-w-2xl text-slate-300">
          Select a shot, configure camera settings, and generate your video.
        </p>
      </div>

      {/* Shot Selection */}
      <div className="mb-6">
        <div className="mb-3 text-sm font-medium text-white">Select Shot</div>
        <div className="grid gap-3 md:grid-cols-3">
          {shots.map((shot) => (
            <button
              key={shot.id}
              onClick={() => handleSelectShot(shot)}
              className={cn(
                "rounded-2xl border p-4 text-left transition",
                selectedShotId === shot.id
                  ? "border-accent/35 bg-accent/10 shadow-glow"
                  : "border-white/8 bg-white/5 hover:border-white/15 hover:bg-white/8"
              )}
            >
              <div className="font-medium text-white">{shot.type}</div>
              <div className="mt-1 text-xs text-slate-400">
                {shot.camera_movement} · {shot.lens}
              </div>
              <div className="mt-2 text-sm text-slate-300">{shot.emotion}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Camera Configuration */}
      {selectedShot && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
            <div className="mb-4 text-sm font-medium text-white">Camera Settings</div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Movement</label>
                <div className="flex flex-wrap gap-2">
                  {movementOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCamera({ ...camera, movement: opt })}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs capitalize transition",
                        camera.movement === opt
                          ? "bg-accent/20 text-white border border-accent/40"
                          : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Lens</label>
                <div className="flex flex-wrap gap-2">
                  {lensOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCamera({ ...camera, lens: opt })}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs transition",
                        camera.lens === opt
                          ? "bg-accent/20 text-white border border-accent/40"
                          : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Framing</label>
                <div className="flex flex-wrap gap-2">
                  {framingOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setCamera({ ...camera, framing: opt })}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs transition",
                        camera.framing === opt
                          ? "bg-accent/20 text-white border border-accent/40"
                          : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reference Image */}
          <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-white">Reference Image</label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={useReference}
                  onChange={(e) => setUseReference(e.target.checked)}
                  className="rounded border-white/20 bg-white/10"
                />
                Use reference
              </label>
            </div>

            {useReference && (
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-white/20 py-8 transition hover:border-accent/40 hover:bg-white/5">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 size-6 text-slate-400" />
                    <span className="text-sm text-slate-300">
                      Click to upload reference image
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {imagePath && (
                  <div className="rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-300">
                    Selected: {imagePath}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Shot Preview Info */}
          <div className="rounded-2xl border border-white/8 bg-white/5 p-5">
            <div className="mb-3 text-sm font-medium text-white">Shot Details</div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-black/20 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Lighting
                </div>
                <div className="mt-1 text-sm text-white">{selectedShot.lighting}</div>
              </div>
              <div className="rounded-xl bg-black/20 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Emotion
                </div>
                <div className="mt-1 text-sm text-white">{selectedShot.emotion}</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose/20 bg-rose/10 px-4 py-3 text-rose-200">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <Button
            size="lg"
            className={cn("w-full gap-2", isGenerating && "opacity-80")}
            onClick={handleGenerateVideo}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <Play className="size-4" />
                Generate Video
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}