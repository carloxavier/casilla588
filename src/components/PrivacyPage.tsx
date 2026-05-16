// Privacy / data-handling explainer. Linked from the footer and from the
// privacy banner.

const CONTACT_EMAIL = "privacidad@casilla588.es"; // TODO: replace with the real address

export function PrivacyPage() {
  return (
    <section className="sources privacy-page">
      <div className="section-head">
        <h2>Privacidad</h2>
        <p className="section-sub">
          Cómo trata esta herramienta los datos que pasan por ella. En español
          claro, sin letra pequeña.
        </p>
      </div>

      <article className="privacy-body">
        <h3>Qué registramos</h3>
        <p>
          Eventos anónimos de uso para entender cómo se interactúa con la
          calculadora y decidir qué mejorar. Por ejemplo: cuándo se añade una
          posición, qué ticker se introdujo, qué países aparecen en la cartera,
          si se completa el flujo hasta ver el resultado, y si se envía el
          formulario de email.
        </p>

        <h3>Qué NO registramos</h3>
        <ul>
          <li>Tu identidad personal, nombre, ni dirección IP.</li>
          <li>
            Tu cartera de inversión: las posiciones que introduces se calculan
            en tu navegador y no se guardan en nuestros servidores, salvo que
            envíes la lista de espera marcando expresamente “guarda mi
            cartera”.
          </li>
          <li>Cookies de tracking entre sitios.</li>
          <li>
            Datos compartidos con terceros con fines publicitarios o de perfilado.
          </li>
        </ul>

        <h3>Identificador de sesión</h3>
        <p>
          Tu navegador genera un identificador anónimo (UUID v4) la primera vez
          que abres la calculadora y lo guarda en{" "}
          <code>localStorage</code>. Sirve para enlazar tus eventos dentro de un
          mismo navegador y nada más. No se asocia a ningún dato personal. Si
          borras los datos del sitio en tu navegador, el identificador
          desaparece y empezamos de cero.
        </p>

        <h3>Dónde se guardan los datos</h3>
        <p>
          En un proyecto Supabase dedicado a Casilla 588. Las filas son
          insertables solo desde el navegador (rol <code>anon</code>) y no son
          legibles públicamente: nadie puede consultarlas salvo nosotros desde
          el panel de Supabase.
        </p>

        <h3>Cumplimiento RGPD</h3>
        <p>
          Tracking first-party, sin cookies de tracking, sin transferencias
          internacionales (Supabase opera en regiones UE cuando está
          configurado así). El tratamiento se ampara en el interés legítimo de
          mejorar un producto público y gratuito; los datos son anónimos por
          diseño.
        </p>

        <h3>Borrado de tus datos</h3>
        <p>
          Como los eventos son anónimos no podemos identificarlos por persona
          de forma fiable, pero sí podemos borrar todas las filas asociadas a
          un identificador de sesión concreto si nos lo facilitas. Para
          conocerlo:
        </p>
        <ol>
          <li>
            En la página de la calculadora, abre la consola del navegador
            (DevTools).
          </li>
          <li>
            Pega:{" "}
            <code>{`localStorage.getItem("c588_session_id")`}</code>.
          </li>
          <li>
            Envía ese identificador (un UUID) a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </li>
        </ol>
        <p>
          También puedes borrar el identificador desde tu navegador y los
          eventos futuros ya no podrán enlazarse contigo.
        </p>
      </article>
    </section>
  );
}
