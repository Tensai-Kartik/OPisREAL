import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';

export function getEnvVar(key: string): string {
  if (process.env[key]) return process.env[key]!.trim();
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const parts = line.split('=');
        if (parts.length >= 2 && parts[0].trim() === key) {
          const val = parts.slice(1).join('=').trim();
          return val.replace(/^["']|["']$/g, '');
        }
      }
    }
  } catch {}
  return '';
}

export function createAdminClient() {
  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 'https://pmlrydjsmhfvohzlhkbu.supabase.co';
  const serviceRoleKey =
    getEnvVar('SUPABASE_SERVICE_ROLE_KEY') ||
    getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbHJ5ZGpzbWhmdm9oemxoa2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTUwOTcsImV4cCI6MjEwMjE5MTA5N30.4ggWOO1geG7S47IrL6Xd44MM42HcnHm0gSON57U4BXw';

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: globalThis.fetch,
    },
    realtime: {
      transport: WebSocket as unknown as typeof globalThis.WebSocket,
    },
  });
}
