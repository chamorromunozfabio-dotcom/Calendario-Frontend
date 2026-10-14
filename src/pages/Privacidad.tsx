export default function Privacidad() {
  return (
    <article className="card">
      <h1>Privacidad, consentimiento y datos sensibles</h1>
      <p>CCycle trata datos de salud (ciclo menstrual) como datos sensibles bajo la Ley 1581 de 2012 de Colombia. Solo recogemos lo que tú registras voluntariamente.</p>
      <h2>Qué guardamos y por qué</h2>
      <ul>
        <li>Periodos y diario: para mostrar tu calendario y estadísticas. Todo opcional.</li>
        <li>Preferencias: tema, notificaciones y ajustes del ciclo.</li>
        <li>Mensajes e IA: solo el contexto mínimo autorizado; nunca enviamos tu correo, notas privadas completas ni identificadores directos salvo lo necesario.</li>
      </ul>
      <h2>IA (Groq)</h2>
      <p>La IA genera bienestar general y educación, nunca diagnósticos ni prescripciones. Si Groq no está disponible, usamos mensajes locales. Puedes no usarla.</p>
      <h2>Tus derechos</h2>
      <ul>
        <li>Acceso y portabilidad: Ajustes → Exportar mis datos.</li>
        <li>Supresión: Ajustes → Eliminar cuenta y datos (borra todo y revoca accesos de pareja).</li>
        <li>Revocación de pareja: inmediata desde la sección Pareja.</li>
      </ul>
      <h2>Seguridad</h2>
      <p>RLS en Supabase, validación en frontend y backend, CORS restringido, rate limiting en IA y logs sin datos de salud. Ningún sistema es perfecto: revisa la documentación de seguridad antes de producción.</p>
      <h2>Urgencias</h2>
      <p>Si tienes dolor intenso, sangrado muy abundante, mareos o fiebre, busca atención médica pronto. En emergencia, llama a tu línea local de emergencias.</p>
    </article>
  );
}
