export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}

export function unavailable(): never {
  throw new ApiError(503, 'service_unavailable', 'This step is temporarily unavailable. Please try again shortly.');
}
