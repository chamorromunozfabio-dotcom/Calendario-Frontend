import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ needsConfirm: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    // Mensaje genérico para no enumerar cuentas (el texto no revela existencia)
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error('No se pudo crear la cuenta. Revisa el correo y la contraseña.');
    return { needsConfirm: !data.session };
  };
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Credenciales inválidas o cuenta sin confirmar.');
  };
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer`
    });
    if (error) throw new Error('No se pudo enviar el correo. Inténtalo de nuevo.');
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth fuera de proveedor');
  return v;
}
