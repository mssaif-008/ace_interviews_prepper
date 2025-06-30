import Vapi from '@vapi-ai/web';

let vapiInstance: Vapi | null = null;

export const getVapi = (): Vapi => {
  if (!vapiInstance) {
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    if (!token) {
      throw new Error('VAPI token is missing. Check your environment variables.');
    }
    vapiInstance = new Vapi(token);
  }
  return vapiInstance;
};
