import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/supabaseClient';

export default function Pareja() {
  const [invites, setInvites] = useState<{ id: string; code?: string; revoked: boolean; expires_at: string }[]>([]);
  const [links, setLinks] = useState<{ id: string; owner_id: string; partner_id: string }[]>([]);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  const [perms, setPerms] = useState({ share_mood: false, share_phase_only: true, share_symptoms: false });

  const load = async () => {
    try {
      const [i, l] = await Promise.all([apiFetch('/api/v1/partner/invitations'), apiFetch('/api/v1/partner/links')]);
      setInvites(i.items); setLinks(l.items);
    } catch { /* sin vínculo */ }
  };
  useEffect(() => { load(); }, []);

  const crear = async () => {
    setMsg('');
    const r = await apiFetch('/api/v1/partner/invitations', { method: 'POST', body: JSON.stringify({ ...perms, expires_hours: 48, max_uses: 1 }) });
    setMsg(`Comparte este código una sola vez (expira en 48 h): ${r.code}`);
    load();
  };
  const aceptar = async () => {
    setMsg('');
    try {
      await apiFetch('/api/v1/partner/accept', { method: 'POST', body: JSON.stringify({ code: code.trim() }) });
      setMsg('Vínculo creado.');
      setCode('');
      load();
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Código inválido o expirado'); }
  };

  return (
    <div className="grid grid-2">
      <section className="card" aria-labelledby="t">
        <h1 id="t">Acompañamiento en pareja (opcional)</h1>
        <p className="muted">Por defecto <strong>no</strong> se comparten fechas exactas, notas, síntomas ni emociones detalladas. Tú eliges con permisos explícitos y puedes revocar en cualquier momento.</p>
        <h2>Crear invitación</h2>
        <label><input type="checkbox" checked={perms.share_phase_only} onChange={(e) => setPerms({ ...perms, share_phase_only: e.target.checked })} /> Solo fase orientativa</label>
        <label><input type="checkbox" checked={perms.share_mood} onChange={(e) => setPerms({ ...perms, share_mood: e.target.checked })} /> Compartir ánimo general</label>
        <label><input type="checkbox" checked={perms.share_symptoms} onChange={(e) => setPerms({ ...perms, share_symptoms: e.target.checked })} /> Compartir síntomas (no recomendado)</label>
        <div style={{ marginTop: '.6rem' }}><button className="btn" onClick={crear}>Generar enlace/código</button></div>
        {msg && <p className="form-ok" role="status" style={{ overflowWrap: 'anywhere' }}>{msg}</p>}
        <h2>Mis invitaciones</h2>
        <ul>{invites.map((i) => <li key={i.id}>{i.id.slice(0, 8)}… · expira {i.expires_at} · {i.revoked ? 'revocada' : 'activa'}</li>)}</ul>
        <h2>Mis vínculos</h2>
        <ul>{links.map((l) => <li key={l.id}>{l.id.slice(0, 8)}… <Revoke id={l.id} onDone={load} /></li>)}</ul>
      </section>
      <section className="card" aria-labelledby="a">
        <h2 id="a">Aceptar invitación (pareja)</h2>
        <p className="muted">Debes tener cuenta e iniciar sesión. El código expira y es de un solo uso.</p>
        <label htmlFor="c">Código</label>
        <input id="c" className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ccy_…" />
        <button className="btn" style={{ marginTop: '.6rem' }} onClick={aceptar}>Aceptar</button>
      </section>
    </div>
  );
}

function Revoke({ id, onDone }: { id: string; onDone: () => void }) {
  return (
    <button
      className="btn btn-secundario" style={{ minHeight: 36 }}
      onClick={async () => { await apiFetch(`/api/v1/partner/links/${id}`, { method: 'DELETE' }); onDone(); }}
    >
      Revocar
    </button>
  );
}
