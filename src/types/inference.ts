export interface InferenceResult {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done_reason: string;
  done: boolean;
  total_duration: number;
  total_duration_in_seconds: number;
  load_duration: number;
  load_duration_in_seconds: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  prompt_eval_duration_in_seconds: number;
  eval_count: number;
  eval_duration: number;
  eval_duration_in_seconds: number;
}

export interface InferenceRequest {
  _id: string;
  userId: string;
  apiKeyId: string;
  prompt: string;
  status: string;
  result: InferenceResult;
  error: string | null;
  modelName: string;
  inputTime: string;
  isChatMessage: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  response: string;
  tokensPerSecond: number;
  imageBase64?: string;
}
