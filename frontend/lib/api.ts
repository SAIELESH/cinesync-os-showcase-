const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Scene {
  id: string;
  number: string;
  title: string;
  environment: string;
  character: string;
  mood: string;
  action: string;
  description: string;
  duration?: string;
}

export interface Shot {
  id: string;
  type: string;
  camera_movement: string;
  lens: string;
  framing: string;
  lighting: string;
  emotion: string;
}

export interface Camera {
  movement: string;
  lens: string;
  framing: string;
}

export interface ParseScriptResponse {
  scenes: Scene[];
  total: number;
}

export interface GenerateShotsResponse {
  shots: Shot[];
  total: number;
}

export interface VideoRequest {
  scene: Scene;
  shot: Shot;
  camera: Camera;
  image_path?: string;
  use_reference?: boolean;
}

export interface VideoResponse {
  task_id: string;
  message: string;
}

export interface VideoStatusResponse {
  status: "ready" | "failed" | "processing" | "error" | "unknown";
  video_url?: string;
  error?: string;
  raw?: any;
}

export interface UploadImageResponse {
  file_path: string;
  message: string;
}

// ==========================
// API CALLS
// ==========================

export async function parseScript(script: string): Promise<ParseScriptResponse> {
  const response = await fetch(`${API_BASE_URL}/parse-script`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ script }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to parse script");
  }

  return response.json();
}

export async function generateShots(scene: Scene): Promise<GenerateShotsResponse> {
  const response = await fetch(`${API_BASE_URL}/generate-shots`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scene }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to generate shots");
  }

  return response.json();
}

export async function generateVideo(request: VideoRequest): Promise<VideoResponse> {
  const response = await fetch(`${API_BASE_URL}/generate-video`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to generate video");
  }

  return response.json();
}

export async function checkVideoStatus(taskId: string): Promise<VideoStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/video-status/${taskId}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to check video status");
  }

  return response.json();
}

export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload-image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to upload image");
  }

  return response.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/`);
  return response.json();
}