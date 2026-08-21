import type { BlogPostTranslation } from "../blog-posts";

export const esTranslations: Record<string, BlogPostTranslation> = {
  "why-email-is-not-safe-for-passwords": {
    title: "Por qué el correo electrónico no es seguro para compartir contraseñas",
    description: "El correo electrónico nunca fue diseñado para la transferencia segura de datos. Descubre por qué enviar contraseñas por email es peligroso y qué alternativas usar.",
    content: `
<p>Cada día, millones de contraseñas se comparten por correo electrónico. Los departamentos de TI envían credenciales de acceso a los nuevos empleados. Los freelancers reciben contraseñas de bases de datos en su bandeja de entrada. Los equipos intercambian claves API en largos hilos de correo. Parece conveniente, pero es una de las formas más peligrosas de compartir información sensible.</p>

<h2>Cómo funciona realmente el correo electrónico</h2>
<p>Para entender por qué el correo es inseguro para contraseñas, necesitas comprender cómo funciona internamente. Cuando envías un email, no viaja directamente de tu computadora al destinatario. Pasa por múltiples servidores:</p>
<ol>
<li>Tu cliente de correo envía el mensaje a tu servidor de correo saliente (SMTP)</li>
<li>Tu servidor de correo lo dirige al servidor del destinatario, a menudo a través de servidores intermediarios</li>
<li>El servidor del destinatario lo almacena hasta que lo descargue o lo vea</li>
</ol>
<p>En cada salto, el contenido del correo puede potencialmente ser leído, registrado o interceptado. Aunque el cifrado TLS protege los datos en tránsito entre servidores que lo soportan, no hay garantía de que cada servidor en la cadena use TLS. E incluso con TLS, cada servidor descifra el mensaje para procesarlo.</p>

<h2>El problema de la persistencia</h2>
<p>Quizás el mayor riesgo no es la interceptación, sino la persistencia. Los correos viven para siempre por defecto:</p>
<ul>
<li><strong>Carpeta "Enviados"</strong> — La contraseña permanece en tu correo enviado indefinidamente</li>
<li><strong>Bandeja del destinatario</strong> — La contraseña permanece hasta que se elimine manualmente</li>
<li><strong>Copias de seguridad del servidor</strong> — Los proveedores de correo hacen copias de seguridad, lo que significa que los correos eliminados pueden seguir existiendo</li>
<li><strong>Reenvío</strong> — El destinatario puede reenviar el correo (y tu contraseña) a cualquier persona</li>
<li><strong>Indexación de búsqueda</strong> — Los índices de búsqueda del correo facilitan encontrar "contraseña" en la cuenta de alguien</li>
</ul>
<p>Si alguna de las cuentas es comprometida meses o años después, el atacante obtiene cada contraseña compartida por correo. Esto no es un riesgo teórico — las violaciones de cuentas de correo están consistentemente entre los vectores de ataque más comunes.</p>

<h2>Capturas de pantalla y espionaje visual</h2>
<p>Cuando una contraseña se muestra en un correo, puede ser capturada, fotografiada o leída por encima del hombro. No hay forma de controlar qué sucede con la información una vez que se muestra en pantalla en un correo persistente.</p>

<h2>Riesgos de cumplimiento</h2>
<p>Para organizaciones sujetas a marcos de cumplimiento como GDPR, HIPAA, SOC 2 o PCI DSS, compartir credenciales por correo puede constituir una violación. Estos marcos requieren que los datos sensibles se transmitan usando cifrado apropiado y controles de acceso — el correo típicamente no cumple con ninguno de estos requisitos.</p>

<h2>La alternativa: enlaces cifrados autodestructivos</h2>
<p>La solución es compartir contraseñas a través de un canal cifrado de extremo a extremo que destruya automáticamente los datos después de ser accedidos. Las herramientas de compartición de secretos autodestructivos como <a href="/">Only Once Share</a> funcionan así:</p>
<ol>
<li>Cifran la contraseña en tu navegador usando AES-256-GCM</li>
<li>Almacenan solo los datos cifrados en el servidor (conocimiento cero)</li>
<li>Generan un enlace de un solo uso que se autodestruye después de ser visto</li>
<li>Mantienen la clave de descifrado solo en el fragmento de URL (nunca se envía al servidor)</li>
</ol>
<p>Este enfoque elimina cada riesgo del correo: no hay copia persistente, no hay riesgo de reenvío, no hay texto plano en el servidor, y los datos se destruyen automáticamente después de una vista.</p>

<h2>Mejores prácticas para compartir contraseñas</h2>
<ul>
<li><strong>Nunca envíes contraseñas en texto plano</strong> por correo, Slack, SMS o cualquier plataforma de mensajería</li>
<li><strong>Usa un enlace autodestructivo</strong> de una herramienta de conocimiento cero como <a href="/">Only Once Share</a></li>
<li><strong>Establece la expiración más corta práctica</strong> — si el destinatario lo leerá en una hora, establece un TTL de 1 hora</li>
<li><strong>Rota las credenciales</strong> después de compartir — cambia las contraseñas después de que el destinatario las haya usado para la configuración inicial</li>
<li><strong>Usa un gestor de contraseñas</strong> para el acceso compartido continuo en lugar de compartir contraseñas en texto plano</li>
</ul>

<h2>Conclusión</h2>
<p>El correo electrónico es una herramienta fantástica de comunicación, pero fue diseñado para mensajes, no para secretos. Las contraseñas compartidas por correo persisten indefinidamente, pasan por múltiples servidores y se convierten en una responsabilidad en cada futura violación de datos. Al usar enlaces cifrados autodestructivos, puedes compartir credenciales de forma segura sin dejar rastro.</p>
`
  },
  "what-is-zero-knowledge-encryption": {
    title: "¿Qué es el cifrado de conocimiento cero? Una guía simple",
    description: "El cifrado de conocimiento cero significa que el proveedor del servicio no puede acceder a tus datos. Aprende cómo funciona y por qué es importante para compartir secretos.",
    content: `
<p>Probablemente hayas visto el término "conocimiento cero" usado por herramientas y servicios centrados en la privacidad. Pero ¿qué significa realmente? ¿Y cómo puedes saber si un servicio realmente implementa cifrado de conocimiento cero versus simplemente usarlo como palabra de moda?</p>

<h2>El concepto central</h2>
<p>El cifrado de conocimiento cero es una arquitectura donde <strong>el proveedor del servicio no puede acceder a tus datos</strong> — no por una política, sino por las matemáticas. El proveedor literalmente no posee las claves necesarias para descifrar tu información.</p>
<p>Piénsalo como una caja de seguridad en un banco. El banco almacena la caja, pero solo tú tienes la llave. Ni siquiera el gerente del banco puede abrirla. El cifrado de conocimiento cero aplica este mismo principio a los datos digitales.</p>

<h2>Cómo funciona en la práctica</h2>
<p>En un sistema de conocimiento cero, el cifrado y descifrado ocurren en el <strong>lado del cliente</strong> — tu navegador o dispositivo. El flujo se ve así:</p>
<ol>
<li><strong>Generación de clave</strong> — Tu dispositivo genera una clave criptográfica (por ejemplo, AES-256)</li>
<li><strong>Cifrado del lado del cliente</strong> — Tus datos se cifran en tu dispositivo antes de ser enviados a ningún lugar</li>
<li><strong>Almacenamiento en servidor</strong> — El servidor recibe y almacena solo texto cifrado</li>
<li><strong>Gestión de claves</strong> — La clave de cifrado se mantiene en tu dispositivo (o en un fragmento de URL) y nunca se envía al servidor</li>
<li><strong>Descifrado del lado del cliente</strong> — Cuando tú (o un destinatario) accedes a los datos, se descifran en el dispositivo cliente</li>
</ol>
<p>El punto crítico es el paso 4: la clave nunca toca el servidor. Sin la clave, el servidor almacena lo que es esencialmente ruido aleatorio.</p>

<h2>Conocimiento cero vs. cifrado estándar</h2>
<p>Muchos servicios afirman usar cifrado pero lo implementan de una forma que da al proveedor acceso a tus datos:</p>
<table>
<thead><tr><th>Característica</th><th>Cifrado en servidor</th><th>Cifrado de conocimiento cero</th></tr></thead>
<tbody>
<tr><td>Dónde ocurre el cifrado</td><td>En el servidor</td><td>En tu navegador/dispositivo</td></tr>
<tr><td>Quién tiene la clave</td><td>El servidor</td><td>Solo el cliente</td></tr>
<tr><td>¿Puede el proveedor leer tus datos?</td><td>Sí</td><td>No</td></tr>
<tr><td>Vulnerabilidad ante violación del servidor</td><td>Datos expuestos</td><td>Solo blobs cifrados expuestos</td></tr>
<tr><td>Vulnerabilidad ante órdenes legales</td><td>El proveedor puede cumplir</td><td>El proveedor no tiene nada que entregar</td></tr>
</tbody>
</table>

<h2>Ejemplos del mundo real</h2>
<p><strong>Servicios de conocimiento cero:</strong> Signal (mensajería), Proton Mail (correo), <a href="/">Only Once Share</a> (compartir secretos), Tresorit (almacenamiento en la nube). Estos servicios cifran datos en tu dispositivo y nunca tienen acceso a las claves de descifrado.</p>
<p><strong>Servicios sin conocimiento cero:</strong> Gmail estándar, Slack, la mayoría del almacenamiento en la nube. Estos servicios cifran datos en tránsito y en reposo, pero poseen las claves de cifrado. Pueden leer tus datos si es necesario.</p>

<h2>Cómo Only Once Share implementa conocimiento cero</h2>
<p>En Only Once Share, el conocimiento cero se logra a través de un uso inteligente de los fragmentos de URL:</p>
<ol>
<li>Tu navegador genera una clave AES-256-GCM y cifra tu secreto</li>
<li>Solo el texto cifrado se envía al servidor</li>
<li>La clave de cifrado se coloca después del símbolo <code>#</code> en la URL (el "fragmento")</li>
<li>Los fragmentos de URL <strong>nunca se envían a los servidores</strong> en las solicitudes HTTP — esto está definido en RFC 3986</li>
<li>Cuando el destinatario abre el enlace, su navegador lee la clave del fragmento y descifra localmente</li>
</ol>
<p>Esto es conocimiento cero por diseño: el servidor físicamente no puede acceder a la clave porque los navegadores web están diseñados para no transmitir fragmentos de URL.</p>

<h2>Por qué importa</h2>
<p>El cifrado de conocimiento cero te protege contra:</p>
<ul>
<li><strong>Violaciones del servidor</strong> — Los atacantes que comprometen el servidor solo obtienen datos cifrados que no pueden leer</li>
<li><strong>Amenazas internas</strong> — Los empleados del proveedor de servicios no pueden acceder a tus datos</li>
<li><strong>Vigilancia gubernamental</strong> — El proveedor no puede entregar datos que no puede descifrar</li>
<li><strong>Minería de datos</strong> — El proveedor no puede analizar tus datos para publicidad o perfilamiento</li>
</ul>

<h2>Cómo verificar las afirmaciones de conocimiento cero</h2>
<p>No todos los servicios que afirman "conocimiento cero" realmente lo implementan. Así puedes verificar:</p>
<ul>
<li><strong>Verifica si es código abierto</strong> — ¿Puedes auditar el código de cifrado? Herramientas como <a href="https://github.com/dhdtech/only-once-share">Only Once Share</a> te permiten verificar la implementación tú mismo</li>
<li><strong>Verifica dónde ocurre el cifrado</strong> — Usa las herramientas de desarrollo del navegador (pestaña Red) para ver si los datos en texto plano se envían al servidor</li>
<li><strong>Verifica la gestión de claves</strong> — ¿La clave permanece en el cliente o se sube al servidor?</li>
<li><strong>Verifica el modelo de amenazas</strong> — ¿La documentación explica claramente qué puede y qué no puede acceder el servidor?</li>
</ul>

<h2>Conclusión</h2>
<p>El cifrado de conocimiento cero es el estándar de oro para la privacidad. Significa que no tienes que confiar en el proveedor del servicio — las matemáticas aseguran que no pueden acceder a tus datos. Al elegir herramientas para compartir información sensible, siempre prefiere implementaciones de conocimiento cero que cifren datos en el cliente y mantengan las claves fuera del alcance del servidor.</p>
`
  },
  "how-to-share-password-securely": {
    title: "Cómo compartir una contraseña de forma segura",
    description: "Una guía paso a paso para compartir contraseñas de forma segura usando enlaces cifrados autodestructivos. Deja de enviar contraseñas por correo y Slack.",
    content: `
<p>Ya sea que estés compartiendo credenciales de Wi-Fi con un invitado, enviando contraseñas de base de datos a un colega o dando a un cliente acceso a su nueva cuenta, hay una forma correcta y una incorrecta de compartir contraseñas. Aquí tienes una guía completa para hacerlo de forma segura.</p>

<h2>La forma incorrecta: canales en texto plano</h2>
<p>El error más común es compartir contraseñas a través de canales que almacenan datos indefinidamente:</p>
<ul>
<li><strong>Correo electrónico</strong> — Permanece en carpetas de enviados/bandeja para siempre, respaldado en servidores, buscable</li>
<li><strong>Slack/Teams</strong> — El historial de mensajes se retiene y es buscable por administradores</li>
<li><strong>SMS/iMessage</strong> — Almacenado en dispositivos y sistemas de operadores</li>
<li><strong>Notas adhesivas</strong> — Riesgo de seguridad física, fácilmente fotografiables</li>
<li><strong>Documentos compartidos</strong> — Google Docs y herramientas similares registran acceso pero no cifran entradas individuales</li>
</ul>
<p>Cualquier canal que retenga la contraseña crea una superficie de ataque futura. Si ese canal es comprometido alguna vez, cada contraseña compartida a través de él queda expuesta.</p>

<h2>La forma correcta: enlaces cifrados autodestructivos</h2>
<p>El enfoque seguro usa tres principios: <strong>cifrar</strong> la contraseña, <strong>limitar el acceso</strong> a una vista, y <strong>auto-eliminar</strong> después de leer.</p>

<h3>Paso a paso con Only Once Share</h3>
<ol>
<li><strong>Ve a <a href="/">ooshare.io</a></strong></li>
<li><strong>Ingresa la contraseña</strong> (o cualquier texto secreto) en el área de texto</li>
<li><strong>Elige un tiempo de expiración</strong> — selecciona la ventana más corta práctica (1 hora si el destinatario está en línea ahora)</li>
<li><strong>Haz clic en "Crear enlace secreto"</strong> — tu navegador cifra la contraseña con AES-256-GCM antes de enviar nada al servidor</li>
<li><strong>Copia el enlace generado</strong> y envíalo al destinatario por cualquier canal (correo, Slack, SMS — el enlace en sí no contiene datos sensibles)</li>
<li><strong>El destinatario abre el enlace</strong>, ve la contraseña, y los datos se destruyen permanentemente</li>
</ol>
<p>Aunque envíes el enlace por correo, la contraseña en sí nunca está en el correo. El enlace es solo un puntero a datos cifrados que se autodestruyen después de una vista.</p>

<h2>Por qué funciona este enfoque</h2>
<ul>
<li><strong>Sin copias persistentes</strong> — La contraseña se destruye después de verla</li>
<li><strong>Cifrado de extremo a extremo</strong> — El servidor solo maneja datos cifrados</li>
<li><strong>Conocimiento cero</strong> — La clave de cifrado está en el fragmento de URL, nunca se envía al servidor</li>
<li><strong>Limitado en tiempo</strong> — Incluso si nunca se ve, los datos expiran automáticamente</li>
<li><strong>Sin cuenta necesaria</strong> — Sin registro, sin fricción</li>
</ul>

<h2>Mejores prácticas adicionales</h2>
<h3>Rota después de compartir</h3>
<p>Si estás compartiendo una contraseña para configuración inicial (como incorporar a un nuevo empleado), haz que cambien la contraseña inmediatamente después del primer inicio de sesión. Esto limita la ventana de exposición de la credencial compartida.</p>

<h3>Usa diferentes canales para contexto</h3>
<p>Envía el enlace secreto por un canal y dile al destinatario para qué es por otro. Por ejemplo: envía el enlace por Slack, pero dile "revisa tu correo para el enlace de la contraseña de la base de datos" — así, interceptar un canal no revela para qué es la contraseña.</p>

<h3>Establece la expiración más corta práctica</h3>
<p>No uses 72 horas por defecto cuando el destinatario está en línea ahora mismo. Establece una expiración de 1 hora para minimizar la ventana durante la cual los datos cifrados existen en cualquier servidor.</p>

<h3>Para acceso compartido continuo, usa un gestor de contraseñas</h3>
<p>Los enlaces autodestructivos son ideales para compartir una vez. Para acceso compartido continuo (como una cuenta de servicio del equipo), usa un gestor de contraseñas con funcionalidad de bóveda compartida. El enlace autodestructivo es para la entrega inicial; el gestor de contraseñas es para el uso diario.</p>

<h2>Conclusión</h2>
<p>Compartir contraseñas de forma segura no tiene que ser complicado. Usa un enlace cifrado autodestructivo para compartir una vez, establece la expiración más corta práctica y rota las credenciales después de la entrega inicial. Toma 10 segundos y elimina el riesgo de que las contraseñas permanezcan en hilos de correo y registros de chat indefinidamente.</p>
`
  },
  "self-destructing-links-explained": {
    title: "Enlaces autodestructivos: cómo funcionan y por qué los necesitas",
    description: "Los enlaces autodestructivos eliminan automáticamente el contenido después de ser vistos. Aprende la tecnología detrás de los enlaces de un solo uso y cuándo usarlos.",
    content: `
<p>Los enlaces autodestructivos son URLs que funcionan exactamente una vez. La primera persona en abrir el enlace ve el contenido; todos los demás no ven nada. Los datos se eliminan permanentemente en el momento en que se accede. Así funcionan internamente y por qué son esenciales para compartir información sensible.</p>

<h2>La tecnología detrás de los enlaces de un solo uso</h2>
<p>A nivel técnico, un sistema de enlaces autodestructivos funciona así:</p>
<ol>
<li><strong>Los datos se almacenan con un ID único</strong> — Cuando creas un secreto, se le asigna un identificador único y se almacena en un almacén de datos (típicamente Redis)</li>
<li><strong>Lectura y eliminación atómica</strong> — Cuando alguien accede al enlace, el servidor realiza una lectura y eliminación en una sola operación atómica. En Redis, este es el comando <code>GETDEL</code> — devuelve los datos y los elimina simultáneamente, sin ventana para una segunda lectura</li>
<li><strong>Expiración por TTL</strong> — Se establece un tiempo de vida (TTL) en la entrada de datos. Incluso si nadie accede al enlace, los datos se purgan automáticamente después de la ventana de expiración</li>
</ol>
<p>La palabra clave es <strong>atómica</strong>. Las operaciones de recuperación y eliminación ocurren como una acción indivisible. No hay condición de carrera donde dos personas puedan acceder al mismo secreto.</p>

<h2>Por qué importan los enlaces autodestructivos</h2>

<h3>1. Elimina datos persistentes</h3>
<p>El problema fundamental de compartir secretos por correo o chat es que los datos persisten indefinidamente. Los enlaces autodestructivos resuelven esto asegurando que los datos existan el mínimo tiempo posible — solo hasta que sean leídos una vez.</p>

<h3>2. Reduce el impacto de violaciones</h3>
<p>Si compartes contraseñas por correo y esa cuenta es violada un año después, el atacante obtiene cada contraseña que compartiste. Con enlaces autodestructivos, no hay nada que encontrar — los datos fueron eliminados hace mucho.</p>

<h3>3. Crea responsabilidad</h3>
<p>Un enlace autodestructivo solo puede verse una vez. Si el destinatario reporta que no puede acceder, sabes que alguien más lo abrió primero. Esto crea un sistema implícito de notificación — un intento de acceso fallido es una señal de que algo puede estar mal.</p>

<h3>4. Cumple con la minimización de datos</h3>
<p>Regulaciones como GDPR enfatizan la minimización de datos — no almacenes datos más tiempo del necesario. Los enlaces autodestructivos son la implementación definitiva de este principio: los datos existen solo el tiempo que toma consumirlos.</p>

<h2>Autodestructivo vs. enlaces con expiración</h2>
<p>Algunas herramientas ofrecen "enlaces con expiración" que permanecen accesibles para cualquiera hasta que se agote un temporizador. Estos son fundamentalmente diferentes de los enlaces autodestructivos:</p>
<table>
<thead><tr><th>Característica</th><th>Autodestructivo</th><th>Solo expiración</th></tr></thead>
<tbody>
<tr><td>¿Múltiples vistas posibles?</td><td>No — solo una vista</td><td>Sí — ilimitadas hasta expirar</td></tr>
<tr><td>¿Datos eliminados después de ver?</td><td>Sí — inmediatamente</td><td>No — permanecen hasta que expire el temporizador</td></tr>
<tr><td>Riesgo de interceptación</td><td>Bajo — el atacante debe interceptar antes que el destinatario</td><td>Alto — el atacante puede ver junto con el destinatario</td></tr>
</tbody>
</table>
<p>Para datos sensibles como contraseñas y claves API, los enlaces autodestructivos proporcionan seguridad significativamente más fuerte que los enlaces de solo expiración.</p>

<h2>Cuándo usar enlaces autodestructivos</h2>
<ul>
<li><strong>Contraseñas y credenciales</strong> — Contraseñas de cuentas, cadenas de conexión a bases de datos, acceso de administrador</li>
<li><strong>Claves API y tokens</strong> — Tokens de servicio, secretos OAuth, claves de despliegue</li>
<li><strong>Información personal sensible</strong> — Números de seguridad social, detalles financieros, mensajes privados</li>
<li><strong>Códigos de acceso temporales</strong> — Códigos únicos, contraseñas WiFi, códigos de acceso a puertas</li>
<li><strong>Respuestas de entrevistas o contenido de exámenes</strong> — Información que debe ser accedida una vez por el destinatario previsto</li>
</ul>

<h2>Cómo Only Once Share implementa enlaces autodestructivos</h2>
<p><a href="/">Only Once Share</a> combina enlaces autodestructivos con cifrado de extremo a extremo para máxima seguridad:</p>
<ul>
<li>Los secretos se cifran del lado del cliente con AES-256-GCM antes del almacenamiento</li>
<li>El servidor usa Redis <code>GETDEL</code> para recuperación atómica de un solo uso</li>
<li>La expiración por TTL (1–72 horas) asegura la auto-eliminación incluso si no se ven</li>
<li>La clave de cifrado permanece en el fragmento de URL y nunca se envía al servidor</li>
</ul>
<p>Esto significa que incluso durante la breve ventana de almacenamiento, el servidor solo contiene datos cifrados que no puede leer.</p>

<h2>Conclusión</h2>
<p>Los enlaces autodestructivos son la forma más segura de compartir datos sensibles de un solo uso. Combinan la conveniencia de una URL simple con la seguridad de la eliminación automática. Para contraseñas, claves API y cualquier información que deba ser accedida una vez y luego olvidada, un enlace cifrado autodestructivo es la herramienta correcta para el trabajo.</p>
`
  },
  "aes-256-gcm-encryption-explained": {
    title: "Cifrado AES-256-GCM explicado para desarrolladores",
    description: "Una explicación amigable para desarrolladores sobre AES-256-GCM: cómo funciona, por qué es el estándar de oro, y cómo implementarlo en el navegador con la Web Crypto API.",
    content: `
<p>AES-256-GCM es ampliamente considerado el estándar de oro para el cifrado simétrico. Lo usan gobiernos, bancos, VPNs, aplicaciones de mensajería y herramientas de seguridad en todo el mundo. Si estás construyendo algo que maneja datos sensibles, entender AES-256-GCM es esencial. Aquí tienes un desglose amigable para desarrolladores.</p>

<h2>Qué significa el nombre</h2>
<ul>
<li><strong>AES</strong> — Advanced Encryption Standard, el algoritmo de cifrado en sí</li>
<li><strong>256</strong> — El tamaño de la clave en bits (256 bits = 32 bytes), la variante estándar más fuerte</li>
<li><strong>GCM</strong> — Galois/Counter Mode, el modo de operación que proporciona tanto cifrado como autenticación</li>
</ul>

<h2>Cómo funciona AES (simplificado)</h2>
<p>AES es un cifrado de bloque simétrico — usa la misma clave para cifrar y descifrar. Opera en bloques fijos de 128 bits (16 bytes) a través de múltiples rondas de operaciones de sustitución, permutación y mezcla:</p>
<ol>
<li><strong>SubBytes</strong> — Cada byte se sustituye usando una tabla de búsqueda (S-box)</li>
<li><strong>ShiftRows</strong> — Las filas de la matriz de estado se desplazan cíclicamente</li>
<li><strong>MixColumns</strong> — Las columnas se mezclan usando multiplicación de matrices en un campo finito</li>
<li><strong>AddRoundKey</strong> — La clave de ronda (derivada de la clave principal) se aplica con XOR al estado</li>
</ol>
<p>Para AES-256, estas operaciones se repiten durante 14 rondas. El gran número de rondas y la clave de 256 bits hacen que los ataques de fuerza bruta sean computacionalmente imposibles — hay 2^256 claves posibles, un número mayor que los átomos en el universo observable.</p>

<h2>Por qué importa el modo GCM</h2>
<p>AES solo es un cifrado de bloque. Necesitas un "modo de operación" para cifrar datos más grandes que un bloque de 16 bytes. GCM (Galois/Counter Mode) es la opción preferida porque proporciona dos cosas simultáneamente:</p>
<ol>
<li><strong>Confidencialidad</strong> — Los datos están cifrados y son ilegibles sin la clave</li>
<li><strong>Autenticidad</strong> — Una etiqueta criptográfica verifica que los datos no han sido alterados</li>
</ol>
<p>Esta combinación se llama <strong>AEAD</strong> (Authenticated Encryption with Associated Data). La parte de "Datos Asociados" es crucial: puedes vincular datos adicionales no cifrados (como un ID de mensaje) al texto cifrado. Si los datos asociados se modifican, el descifrado falla.</p>

<h2>El vector de inicialización (IV)</h2>
<p>GCM requiere un vector de inicialización (IV, también llamado nonce) único para cada operación de cifrado con la misma clave. El estándar recomienda un IV aleatorio de 96 bits (12 bytes). <strong>Reutilizar un IV con la misma clave es catastrófico</strong> — puede romper completamente el cifrado y la autenticación.</p>

<h2>Implementación con la Web Crypto API</h2>
<p>Los navegadores modernos proporcionan la Web Crypto API, que ofrece AES-256-GCM acelerado por hardware sin bibliotecas externas. Aquí está el patrón principal:</p>
<pre><code>// Generar una clave aleatoria
const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);

// Cifrar
const iv = crypto.getRandomValues(new Uint8Array(12));
const ciphertext = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv, additionalData },
  key,
  plaintextBytes
);

// Descifrar
const plaintext = await crypto.subtle.decrypt(
  { name: "AES-GCM", iv, additionalData },
  key,
  ciphertext
);
</code></pre>

<h2>Derivación de claves con HKDF</h2>
<p>En muchas aplicaciones, no usas la clave directamente. En su lugar, derivas claves por mensaje usando HKDF (Función de Derivación de Clave basada en HMAC):</p>
<pre><code>const derivedKey = await crypto.subtle.deriveKey(
  { name: "HKDF", hash: "SHA-256", salt, info: contextData },
  masterKey,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);
</code></pre>
<p>Este es el enfoque usado por <a href="/">Only Once Share</a>: se genera una clave maestra por secreto, y HKDF-SHA-256 deriva la clave de cifrado real usando el ID del secreto como contexto.</p>

<h2>Errores comunes</h2>
<ul>
<li><strong>Reutilización de IV</strong> — Nunca reutilices un IV con la misma clave. Genera un IV aleatorio fresco para cada cifrado</li>
<li><strong>Clave en la ruta de URL</strong> — Nunca pongas claves en la ruta de URL (visible en logs del servidor). Usa el fragmento de URL (<code>#</code>) que es solo del cliente</li>
<li><strong>Falta de autenticación</strong> — No uses AES-CTR o AES-CBC sin autenticación separada. Siempre usa GCM u otro modo AEAD</li>
<li><strong>Cripto personalizado</strong> — No implementes AES tú mismo. Usa la Web Crypto API o bibliotecas establecidas como libsodium</li>
<li><strong>Generación de claves débil</strong> — Siempre usa <code>crypto.getRandomValues()</code> o <code>crypto.subtle.generateKey()</code>, nunca <code>Math.random()</code></li>
</ul>

<h2>¿Por qué AES-256 sobre AES-128?</h2>
<p>AES-128 se considera seguro para las amenazas actuales y es más rápido. Sin embargo, AES-256 proporciona un margen de seguridad mucho mayor contra avances futuros, incluidos posibles ataques de computación cuántica. El algoritmo de Grover podría teóricamente reducir la seguridad efectiva de AES-128 a 64 bits; AES-256 seguiría ofreciendo 128 bits de seguridad cuántica, que sigue siendo fuerte.</p>

<h2>Conclusión</h2>
<p>AES-256-GCM es el estándar de la industria por una razón: proporciona cifrado autenticado fuerte con excelente rendimiento, especialmente con la aceleración por hardware disponible en CPUs modernas y la Web Crypto API. Al construir herramientas de seguridad, úsalo correctamente — IVs aleatorios, gestión adecuada de claves, modo AEAD — y aprovecha las APIs de la plataforma en lugar de implementar cripto desde cero.</p>
`
  },
  "send-api-keys-securely": {
    title: "Cómo enviar claves API de forma segura a tu equipo",
    description: "Deja de pegar claves API en Slack. Aprende métodos seguros para compartir claves API, tokens y credenciales con tu equipo de desarrollo.",
    content: `
<p>Compartir claves API es una parte rutinaria del desarrollo de software. Ya sea una clave secreta de Stripe para un nuevo desarrollador, una clave de acceso de AWS para un despliegue, o una cadena de conexión a base de datos para un entorno de staging, los equipos comparten credenciales constantemente. Desafortunadamente, la mayoría lo hace a través de Slack, correo electrónico o — peor aún — en un repositorio Git.</p>

<h2>Los riesgos de compartir claves API de forma insegura</h2>
<p>Las claves API son de las credenciales más sensibles que maneja tu equipo. Una clave de Stripe filtrada puede procesar cargos no autorizados. Una clave de AWS filtrada puede generar miles de dólares en recursos de cómputo. Una cadena de conexión a base de datos filtrada puede exponer todos los datos de tus clientes.</p>

<h2>El enfoque seguro: enlaces cifrados de un solo uso</h2>
<p>La forma más segura de compartir una clave API con un compañero de equipo es a través de un enlace cifrado autodestructivo:</p>
<ol>
<li>Ve a <a href="/">ooshare.io</a></li>
<li>Pega la clave API (o múltiples claves — la herramienta soporta hasta 50,000 caracteres)</li>
<li>Establece una expiración corta (1 hora si tu compañero está en línea, máximo 24 horas)</li>
<li>Envía el enlace generado por Slack o correo</li>
<li>Tu compañero abre el enlace, copia la clave, y los datos se destruyen</li>
</ol>

<h2>Compartir múltiples credenciales a la vez</h2>
<p>A menudo necesitas compartir varias credenciales relacionadas juntas. Puedes pegarlas todas en un solo secreto:</p>
<pre><code>STRIPE_SECRET_KEY=sk_live_xxx
DATABASE_URL=postgres://user:pass@host:5432/db
REDIS_URL=redis://default:pass@host:6379
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxx</code></pre>

<h2>Para acceso continuo: usa variables de entorno y bóvedas</h2>
<p>Los enlaces autodestructivos son ideales para entregas únicas. Para la gestión continua de claves API, combínalos con infraestructura adecuada:</p>
<ul>
<li><strong>Variables de entorno</strong> — Almacena claves en archivos <code>.env</code> que estén en <code>.gitignore</code></li>
<li><strong>Gestores de secretos</strong> — AWS Secrets Manager, HashiCorp Vault, Doppler, o 1Password CLI para acceso a nivel de equipo</li>
<li><strong>Secretos de CI/CD</strong> — Usa los secretos integrados de tu pipeline (GitHub Actions secrets, variables de GitLab CI)</li>
</ul>

<h2>Lista de mejores prácticas</h2>
<ul>
<li>Nunca confirmes claves API en control de versiones — usa archivos <code>.env</code> y <code>.gitignore</code></li>
<li>Nunca compartas claves por Slack, correo o SMS en texto plano</li>
<li>Usa un enlace cifrado autodestructivo para transferencias únicas</li>
<li>Establece el tiempo de expiración más corto práctico</li>
<li>Rota las claves después de compartirlas cuando sea posible</li>
<li>Usa un gestor de secretos para acceso continuo del equipo</li>
<li>Habilita políticas de rotación de claves API donde los proveedores lo soporten</li>
<li>Monitorea claves filtradas usando herramientas como GitGuardian o GitHub secret scanning</li>
</ul>

<h2>Conclusión</h2>
<p>Compartir claves API es inevitable en el desarrollo de software. Lo que es evitable es el riesgo. Al usar enlaces cifrados autodestructivos para transferencias únicas y gestores de secretos para acceso continuo, puedes mantener las credenciales de tu equipo seguras sin añadir fricción a tu flujo de trabajo.</p>
`
  },
  "best-free-secret-sharing-tools": {
    title: "Las 5 mejores herramientas gratuitas para compartir secretos en 2025",
    description: "Una comparación de las mejores herramientas gratuitas para compartir contraseñas y secretos mediante enlaces cifrados autodestructivos. Funciones, seguridad y precios comparados.",
    content: `
<p>¿Necesitas compartir una contraseña, clave API o mensaje sensible sin que permanezca en la bandeja de entrada de alguien para siempre? Las herramientas de compartir secretos de un solo uso crean enlaces cifrados autodestructivos que funcionan exactamente una vez. Aquí están las 5 mejores opciones gratuitas disponibles hoy.</p>

<h2>1. Only Once Share (ooshare.io)</h2>
<p><strong>Ideal para:</strong> Cifrado de conocimiento cero verdadero sin límites</p>
<ul>
<li><strong>Cifrado:</strong> AES-256-GCM (lado del cliente, Web Crypto API)</li>
<li><strong>Arquitectura:</strong> Conocimiento cero — la clave de cifrado permanece en el fragmento de URL, nunca toca el servidor</li>
<li><strong>Límites:</strong> Ninguno — completamente gratis sin límites</li>
<li><strong>Cuenta requerida:</strong> No</li>
<li><strong>Código abierto:</strong> Sí (licencia MIT)</li>
<li><strong>Auto-alojamiento:</strong> Sí (Docker)</li>
<li><strong>Idiomas:</strong> 6 (inglés, chino, español, hindi, árabe, portugués)</li>
</ul>
<p><a href="/">Only Once Share</a> destaca por su verdadera arquitectura de conocimiento cero: el cifrado ocurre completamente en el navegador, y la clave se almacena en el fragmento de URL que los navegadores nunca envían a los servidores.</p>

<h2>2. OneTimeSecret (onetimesecret.com)</h2>
<p><strong>Ideal para:</strong> Reconocimiento de marca y trayectoria establecida</p>
<ul>
<li><strong>Cifrado:</strong> Lado del servidor (no es conocimiento cero)</li>
<li><strong>Límites:</strong> 100KB tamaño máximo, 7 días de expiración (gratis)</li>
<li><strong>Código abierto:</strong> Sí</li>
</ul>
<p>La herramienta más antigua y reconocida en este espacio, fundada en 2011. Sin embargo, su cifrado ocurre en el servidor — el servidor maneja brevemente tus datos en texto plano antes de cifrarlos.</p>

<h2>3. Password Pusher (pwpush.com)</h2>
<p><strong>Ideal para:</strong> Equipos DevOps que necesitan compartir en múltiples formatos</p>
<ul>
<li><strong>Cifrado:</strong> Lado del servidor</li>
<li><strong>Código abierto:</strong> Sí</li>
<li><strong>Funciones extra:</strong> Archivos, URLs, códigos QR, generador de contraseñas</li>
</ul>

<h2>4. scrt.link</h2>
<p><strong>Ideal para:</strong> Jurisdicción de privacidad suiza y múltiples tipos de secretos</p>
<ul>
<li><strong>Cifrado:</strong> De extremo a extremo (lado del cliente)</li>
<li><strong>Código abierto:</strong> Sí</li>
<li><strong>Funciones extra:</strong> Archivos (10MB), enlaces de redirección, imágenes autodestructivas</li>
</ul>

<h2>5. Yopass (yopass.se)</h2>
<p><strong>Ideal para:</strong> Minimalistas que quieren código abierto puro sin agenda comercial</p>
<ul>
<li><strong>Cifrado:</strong> OpenPGP (lado del cliente)</li>
<li><strong>Código abierto:</strong> Sí</li>
<li><strong>Funciones extra:</strong> Soporte CLI, métricas Prometheus</li>
</ul>

<h2>Tabla comparativa</h2>
<table>
<thead><tr><th>Característica</th><th>Only Once Share</th><th>OneTimeSecret</th><th>Password Pusher</th><th>scrt.link</th><th>Yopass</th></tr></thead>
<tbody>
<tr><td>Conocimiento cero</td><td>Sí</td><td>No</td><td>No</td><td>Sí</td><td>Sí</td></tr>
<tr><td>Límites gratis</td><td>Ninguno</td><td>100KB, 7 días</td><td>Varía</td><td>Ninguno</td><td>Ninguno</td></tr>
<tr><td>Idiomas</td><td>6</td><td>Varios</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Cifrado</td><td>AES-256-GCM</td><td>AES (servidor)</td><td>Servidor</td><td>E2E</td><td>OpenPGP</td></tr>
</tbody>
</table>

<h2>Nuestra recomendación</h2>
<p>Para la mayoría de usuarios, <a href="/">Only Once Share</a> ofrece la mejor combinación de seguridad (conocimiento cero verdadero, AES-256-GCM), usabilidad (sin cuenta, sin límites, 6 idiomas) y transparencia (código abierto MIT).</p>
`
  },
  "server-side-vs-client-side-encryption": {
    title: "Cifrado en servidor vs. en cliente: por qué importa para compartir secretos",
    description: "No todo el cifrado es igual. Aprende la diferencia crítica entre cifrado en servidor y en cliente y por qué determina quién puede acceder a tus datos.",
    content: `
<p>Cuando una herramienta de compartir secretos dice que está "cifrada", la mayoría de las personas asumen que sus datos están seguros. Pero la ubicación donde ocurre el cifrado — servidor o cliente — cambia fundamentalmente quién puede acceder a tus datos.</p>

<h2>Cifrado en el servidor</h2>
<p>Con el cifrado en el servidor, el proceso funciona así:</p>
<ol>
<li>Escribes tu secreto en el formulario web</li>
<li>Tu navegador envía el <strong>secreto en texto plano</strong> al servidor por HTTPS</li>
<li>El servidor cifra el secreto y lo almacena</li>
<li>Cuando el destinatario abre el enlace, el servidor lo descifra y envía el texto plano</li>
</ol>
<p>El problema crítico: <strong>el servidor maneja tus datos en texto plano</strong>.</p>

<h2>Cifrado en el cliente (conocimiento cero)</h2>
<p>Con el cifrado en el cliente, el proceso es fundamentalmente diferente:</p>
<ol>
<li>Escribes tu secreto en el formulario web</li>
<li>Tu navegador genera una clave y cifra el secreto <strong>antes de enviar nada</strong></li>
<li>Solo el <strong>texto cifrado</strong> se envía al servidor</li>
<li>La clave de cifrado permanece en tu navegador (por ejemplo, en el fragmento de URL)</li>
<li>El navegador del destinatario descifra el secreto usando la clave de la URL</li>
</ol>
<p>El servidor <strong>nunca ve el texto plano</strong> y <strong>nunca tiene la clave</strong>.</p>

<h2>Comparación lado a lado</h2>
<table>
<thead><tr><th>Escenario</th><th>Servidor</th><th>Cliente (conocimiento cero)</th></tr></thead>
<tbody>
<tr><td>Violación del servidor</td><td>El atacante obtiene datos + claves = puede descifrar todo</td><td>El atacante obtiene solo blobs cifrados que no puede descifrar</td></tr>
<tr><td>Empleado malicioso</td><td>Puede leer cualquier secreto en el servidor</td><td>No puede leer ningún secreto (sin claves)</td></tr>
<tr><td>Orden judicial</td><td>El operador debe entregar datos descifrables</td><td>El operador solo puede proporcionar blobs cifrados</td></tr>
</tbody>
</table>

<h2>Cómo verificar el modelo de cifrado</h2>
<p>No confíes en la palabra de una herramienta. Verifica dónde ocurre el cifrado:</p>
<ol>
<li><strong>Abre DevTools del navegador</strong> (F12 → pestaña Red)</li>
<li><strong>Crea un secreto de prueba</strong> con un valor conocido como "TEST_SECRET_123"</li>
<li><strong>Inspecciona la solicitud de red</strong> que envía el secreto al servidor</li>
<li><strong>Busca tu texto plano</strong> en el cuerpo de la solicitud</li>
</ol>
<p>Con cifrado en el cliente, verás solo datos cifrados ilegibles. Con cifrado en el servidor, verás tu texto plano siendo enviado al servidor.</p>

<h2>Conclusión</h2>
<p>"Cifrado" no es binario — importa dónde y cómo ocurre el cifrado. Para compartir secretos, el cifrado en el cliente con arquitectura de conocimiento cero (como <a href="/">Only Once Share</a>) asegura que nadie excepto el destinatario previsto pueda acceder a tus datos.</p>
`
  },
  "self-host-secret-sharing-docker": {
    title: "Cómo auto-alojar una herramienta de compartir secretos con Docker",
    description: "Guía paso a paso para auto-alojar Only Once Share con Docker. Control total sobre tus datos con cifrado de conocimiento cero en tu propia infraestructura.",
    content: `
<p>Auto-alojar tu herramienta de compartir secretos te da control total sobre tus datos. Sin servidores de terceros, sin suposiciones de confianza, sin datos saliendo de tu infraestructura. Así puedes configurar Only Once Share en tu propio servidor usando Docker en menos de 10 minutos.</p>

<h2>¿Por qué auto-alojar?</h2>
<ul>
<li><strong>Soberanía de datos</strong> — Los datos cifrados nunca salen de tu infraestructura</li>
<li><strong>Cumplimiento</strong> — Cumple requisitos de residencia de datos (GDPR, HIPAA, SOC 2)</li>
<li><strong>Aislamiento de red</strong> — Ejecuta en una red interna sin exposición a internet público</li>
<li><strong>Personalización</strong> — Modifica el código, marca o configuración según tus necesidades</li>
</ul>

<h2>Paso 1: Clona el repositorio</h2>
<pre><code>git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share</code></pre>

<h2>Paso 2: Configura variables de entorno</h2>
<pre><code># Requerido
REDIS_URL=redis://redis:6379</code></pre>

<h2>Paso 3: Inicia la pila</h2>
<pre><code>docker compose up -d</code></pre>
<p>Esto inicia tres contenedores: <strong>ui</strong> (React frontend), <strong>api</strong> (Flask API), y <strong>redis</strong> (almacenamiento de datos).</p>

<h2>Configuración de producción</h2>
<h3>Añadir HTTPS con proxy inverso</h3>
<p>Para uso en producción, coloca un proxy inverso (Nginx, Caddy o Traefik) delante de la aplicación para manejar TLS/HTTPS.</p>

<h2>Conclusión</h2>
<p>Auto-alojar Only Once Share te da la seguridad del cifrado de conocimiento cero combinada con el control de ejecutar en tu propia infraestructura. La configuración con Docker toma minutos y toda la pila funciona con recursos mínimos.</p>
`
  },
  "credential-sharing-employee-onboarding": {
    title: "Compartir credenciales durante la incorporación de empleados: un enfoque seguro",
    description: "Cómo los equipos de TI pueden compartir de forma segura contraseñas, claves de acceso y credenciales con nuevos empleados durante la incorporación.",
    content: `
<p>La incorporación de empleados inevitablemente implica compartir credenciales: contraseñas de correo, acceso VPN, inicios de sesión en servicios cloud, credenciales de bases de datos y más. Cómo tu organización maneja este proceso tiene implicaciones significativas de seguridad.</p>

<h2>El enfoque común (inseguro)</h2>
<p>La mayoría de las organizaciones recurren a uno de estos métodos:</p>
<ul>
<li>TI envía credenciales por correo al email personal del nuevo empleado</li>
<li>Las credenciales se escriben en una nota adhesiva en el escritorio</li>
<li>Una hoja de cálculo compartida contiene todas las contraseñas estándar</li>
<li>El gerente envía la contraseña por mensaje de texto o Slack</li>
</ul>

<h2>Un flujo de trabajo mejor</h2>
<h3>Paso 1: Prepara las credenciales</h3>
<p>Antes de la fecha de inicio del nuevo empleado, reúne todas las credenciales que necesitará.</p>

<h3>Paso 2: Crea enlaces cifrados autodestructivos</h3>
<p>Usa <a href="/">Only Once Share</a> para crear enlaces cifrados separados para cada conjunto de credenciales.</p>

<h3>Paso 3: Comparte los enlaces</h3>
<p>Envía cada enlace al nuevo empleado a través de tu canal de comunicación estándar.</p>

<h3>Paso 4: Requiere cambios inmediatos de contraseña</h3>
<p>Establece todas las contraseñas iniciales como temporales y requiere que el nuevo empleado las cambie en el primer inicio de sesión.</p>

<h3>Paso 5: Transición a un gestor de contraseñas</h3>
<p>Una vez configurado, inscríbelo en el gestor de contraseñas de tu organización para credenciales compartidas continuas.</p>

<h2>Conclusión</h2>
<p>Compartir credenciales de forma segura durante la incorporación no tiene que ser complicado. Usa enlaces cifrados autodestructivos para la entrega inicial, requiere cambios inmediatos de contraseña, y transiciona a un gestor de contraseñas para acceso continuo.</p>
`
  },
  "gdpr-compliant-secret-sharing": {
    title: "Compartir secretos cumpliendo con GDPR: lo que necesitas saber",
    description: "Cómo compartir contraseñas y datos sensibles cumpliendo con GDPR. Minimización de datos, cifrado de conocimiento cero y residencia de datos explicados.",
    content: `
<p>El Reglamento General de Protección de Datos (GDPR) impone requisitos estrictos sobre cómo las organizaciones manejan datos personales. Cuando compartes contraseñas, credenciales u otra información sensible, estás procesando datos — y el GDPR se aplica.</p>

<h2>Principios de GDPR que aplican a compartir secretos</h2>
<h3>1. Minimización de datos (Artículo 5(1)(c))</h3>
<p>Los datos personales deben ser "adecuados, relevantes y limitados a lo necesario." Los enlaces autodestructivos que se auto-eliminan después de una vista son la implementación definitiva de la minimización de datos.</p>

<h3>2. Limitación de almacenamiento (Artículo 5(1)(e))</h3>
<p>Los datos deben conservarse "por no más tiempo del necesario." Compartir contraseñas por correo viola este principio porque los correos persisten indefinidamente.</p>

<h3>3. Integridad y confidencialidad (Artículo 5(1)(f))</h3>
<p>Los datos deben procesarse con "seguridad apropiada." El cifrado de extremo a extremo con arquitectura de conocimiento cero cumple este requisito.</p>

<h2>Cómo el cifrado de conocimiento cero apoya el GDPR</h2>
<p>Herramientas de conocimiento cero como <a href="/">Only Once Share</a> se alinean con el GDPR de varias maneras: el proveedor del servicio no es un procesador de datos, no hay riesgo de violación de datos del proveedor, y la eliminación automática asegura la limitación de almacenamiento.</p>

<h2>Conclusión</h2>
<p>El cumplimiento de GDPR para compartir secretos se reduce a minimizar la exposición de datos y asegurar la seguridad apropiada. Los enlaces cifrados autodestructivos de conocimiento cero satisfacen los requisitos de minimización de datos, limitación de almacenamiento y confidencialidad por diseño.</p>
`
  },
  "devops-secret-sharing-best-practices": {
    title: "Cómo los equipos DevOps comparten secretos de forma segura",
    description: "Mejores prácticas para compartir claves API, tokens y credenciales en flujos de trabajo DevOps. Desde entregas únicas hasta gestión de secretos en pipelines CI/CD.",
    content: `
<p>Los equipos DevOps manejan más credenciales que casi cualquier otro rol: claves API, contraseñas de bases de datos, claves SSH, tokens de proveedores cloud, credenciales de registros de contenedores, certificados TLS y secretos de webhooks. El desafío no es solo mantenerlos seguros — es compartirlos de forma segura.</p>

<h2>El ciclo de vida de los secretos</h2>
<h3>1. Entrega inicial (transferencia única)</h3>
<p><strong>Solución:</strong> Usa un enlace cifrado autodestructivo para cada transferencia de credenciales. <a href="/">Only Once Share</a> maneja esto con cifrado de conocimiento cero.</p>

<h3>2. Uso activo (runtime)</h3>
<p><strong>Solución:</strong> Usa variables de entorno, gestores de secretos (HashiCorp Vault, AWS Secrets Manager, Doppler) o configuración cifrada.</p>

<h3>3. Rotación</h3>
<p><strong>Solución:</strong> Automatiza la rotación donde sea posible. Para rotación manual, usa enlaces cifrados para la entrega de nuevas credenciales.</p>

<h2>Errores comunes</h2>
<h3>Secretos en control de versiones</h3>
<p>El error más peligroso es confirmar secretos en Git. Incluso si eliminas el commit, el secreto permanece en el historial de Git.</p>

<h3>Secretos en logs de CI/CD</h3>
<p>Los pipelines de CI/CD a menudo muestran variables de entorno durante los pasos de compilación y despliegue.</p>

<h2>Conclusión</h2>
<p>La gestión de secretos en DevOps es un problema por capas. Los enlaces cifrados autodestructivos manejan la entrega única; los gestores de secretos manejan el acceso en runtime; las plataformas CI/CD manejan los secretos del pipeline; y las herramientas de escaneo previenen la exposición accidental.</p>
`
  },
  "complete-guide-one-time-secret-sharing": {
    title: "La guía completa para compartir secretos de un solo uso",
    description: "Todo lo que necesitas saber sobre compartir secretos de un solo uso: cómo funciona, cuándo usarlo, consideraciones de seguridad y elegir la herramienta correcta.",
    content: `
<p>Compartir secretos de un solo uso es la práctica de transmitir información sensible a través de enlaces que se autodestruyen después de una sola vista. Esta guía completa cubre todo, desde los conceptos básicos hasta consideraciones avanzadas de seguridad.</p>

<h2>¿Qué es compartir secretos de un solo uso?</h2>
<p>Crea un contenedor temporal y cifrado para datos sensibles que puede ser accedido exactamente una vez. Después del primer (y único) acceso, los datos se destruyen permanentemente.</p>

<h2>Cuándo usar compartir secretos de un solo uso</h2>
<h3>Casos de uso ideales</h3>
<ul>
<li><strong>Contraseñas</strong> — Compartir credenciales de inicio de sesión para configuración inicial</li>
<li><strong>Claves API y tokens</strong> — Distribuir credenciales de servicio a desarrolladores</li>
<li><strong>Cadenas de conexión</strong> — URLs de bases de datos, URIs de Redis, endpoints con credenciales</li>
<li><strong>Claves SSH</strong> — Claves privadas para acceso a servidores</li>
<li><strong>Información personal</strong> — Números de seguro social, detalles financieros</li>
</ul>

<h2>Niveles de seguridad</h2>
<h3>Nivel 1: Cifrado en servidor</h3>
<p>El servidor recibe texto plano, lo cifra y lo almacena. El servidor ve tus datos.</p>

<h3>Nivel 2: Cifrado en cliente (conocimiento cero)</h3>
<p>El navegador cifra datos antes de enviar nada al servidor. El servidor solo almacena blobs cifrados.</p>
<p><em>Ejemplos: <a href="/">Only Once Share</a>, scrt.link, Yopass</em></p>

<h3>Nivel 3: Cliente + auto-alojado</h3>
<p>Igual que el Nivel 2, pero ejecutándose en tu propia infraestructura.</p>

<h2>Mejores prácticas de seguridad</h2>
<ul>
<li><strong>Establece el TTL más corto práctico</strong></li>
<li><strong>Usa un canal diferente para contexto</strong></li>
<li><strong>Rota después de compartir</strong></li>
<li><strong>Verifica la recepción</strong></li>
<li><strong>Prefiere herramientas de conocimiento cero</strong></li>
<li><strong>Usa herramientas de código abierto</strong></li>
</ul>

<h2>Conclusión</h2>
<p>Compartir secretos de un solo uso es el método más seguro para transmitir información sensible que necesita ser accedida una vez. Elige una herramienta de conocimiento cero como <a href="/">Only Once Share</a> para la garantía de seguridad más fuerte.</p>
`
  },
  "open-source-security-transparency": {
    title: "Seguridad de código abierto: por qué importa la transparencia",
    description: "Por qué las herramientas de seguridad de código abierto son más confiables que las alternativas de código cerrado. Auditoría comunitaria, seguridad de la cadena de suministro y el problema de confianza.",
    content: `
<p>Cuando se trata de software de seguridad, hay una paradoja: las herramientas que más te piden confiar son a menudo las que menos deberías confiar. He aquí por qué el código abierto es el único enfoque creíble para el software de seguridad.</p>

<h2>El problema de confianza</h2>
<p>Cada herramienta de seguridad hace afirmaciones: "cifrado de grado militar", "seguridad de nivel bancario", "arquitectura de conocimiento cero." Pero ¿cómo verificas estas afirmaciones? Con software de código cerrado, no puedes.</p>
<p>El código abierto resuelve esto haciendo el código disponible públicamente. Cualquiera puede leer el código y verificar que hace lo que afirma.</p>

<h2>Código abierto y conocimiento cero verificable</h2>
<p>Para <a href="/">Only Once Share</a>, el código abierto no es opcional — es esencial. Nuestras afirmaciones de conocimiento cero son verificables porque puedes leer el <a href="https://github.com/dhdtech/only-once-share">código de cifrado</a> y verificar que el cifrado AES-256-GCM ocurre del lado del cliente.</p>

<h2>Auto-alojamiento: el modelo de confianza definitivo</h2>
<p>El código abierto permite el auto-alojamiento — ejecutar el software en tu propia infraestructura. Esto elimina incluso la necesidad de confiar en la versión alojada.</p>

<h2>Conclusión</h2>
<p>Para herramientas de seguridad, el código abierto no es un lujo — es un requisito para la credibilidad. No deberías tener que confiar en la palabra de un proveedor de que tus datos están cifrados. Con código abierto, puedes verificarlo tú mismo.</p>
`
  },
  "incident-response-credential-sharing": {
    title: "Respuesta a incidentes: compartir credenciales de forma segura durante emergencias",
    description: "Cuando ocurre un incidente de seguridad, los equipos necesitan compartir credenciales rápido. Cómo equilibrar velocidad con seguridad durante la respuesta a incidentes.",
    content: `
<p>A las 2 AM, tu sistema de monitoreo lanza una alerta crítica. Una base de datos de producción está expuesta. Necesitas compartir credenciales de acceso de emergencia con el equipo de respuesta a incidentes — rápido. La velocidad importa, pero compartir credenciales de forma insegura durante un incidente puede convertir un problema de seguridad en dos.</p>

<h2>Un enfoque rápido Y seguro</h2>
<p>Los enlaces cifrados autodestructivos son ideales para la respuesta a incidentes porque son tan rápidos como enviar un mensaje de Slack pero se limpian automáticamente.</p>
<ol>
<li><strong>Abre <a href="/">ooshare.io</a></strong> (márcalo como favorito en tu playbook de respuesta a incidentes)</li>
<li><strong>Pega la credencial</strong> (contraseña root, token de emergencia, clave de admin)</li>
<li><strong>Establece TTL de 1 hora</strong></li>
<li><strong>Comparte el enlace</strong> en tu canal de respuesta a incidentes</li>
<li><strong>El respondedor abre el enlace</strong> y obtiene la credencial — los datos se destruyen</li>
</ol>
<p>Tiempo total: menos de 30 segundos. Y a diferencia de un mensaje de Slack, la credencial no persiste en el historial de chat.</p>

<h2>Higiene de credenciales post-incidente</h2>
<ol>
<li><strong>Rota cada credencial</strong> que fue compartida durante el incidente</li>
<li><strong>Rota cada credencial</strong> que pudo haber sido comprometida en el incidente mismo</li>
<li><strong>Revisa los logs de acceso</strong></li>
<li><strong>Actualiza tu playbook</strong></li>
</ol>

<h2>Conclusión</h2>
<p>La respuesta a incidentes demanda velocidad, pero velocidad sin seguridad crea riesgo compuesto. Los enlaces cifrados autodestructivos ofrecen la velocidad de un mensaje de Slack con la seguridad de datos cifrados y efímeros.</p>
`
  },
  "web-crypto-api-browser-encryption": {
    title: "Web Crypto API: construyendo cifrado en el navegador",
    description: "Una guía práctica de la Web Crypto API para desarrolladores. Genera claves, cifra datos e implementa arquitecturas de conocimiento cero completamente en el navegador.",
    content: `
<p>La Web Crypto API es una API de JavaScript nativa del navegador que proporciona operaciones criptográficas sin bibliotecas externas. Permite cifrado acelerado por hardware, generación de claves y hashing directamente en el navegador.</p>

<h2>¿Por qué Web Crypto API?</h2>
<ul>
<li><strong>Sin dependencias externas</strong> — Integrada en todos los navegadores modernos</li>
<li><strong>Aceleración por hardware</strong> — Usa el conjunto de instrucciones AES-NI de la CPU</li>
<li><strong>Generación segura de números aleatorios</strong> — <code>crypto.getRandomValues()</code> usa el CSPRNG del SO</li>
<li><strong>Diseño asíncrono</strong> — Operaciones no bloqueantes vía Promises</li>
</ul>

<h2>Operaciones principales</h2>
<h3>1. Generación de valores aleatorios</h3>
<pre><code>const iv = crypto.getRandomValues(new Uint8Array(12));</code></pre>

<h3>2. Generación de clave AES-256-GCM</h3>
<pre><code>const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);</code></pre>

<h3>3. Cifrado de datos</h3>
<pre><code>const ciphertext = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv, additionalData, tagLength: 128 },
  key,
  data
);</code></pre>

<h3>4. Derivación de claves con HKDF</h3>
<pre><code>const derivedKey = await crypto.subtle.deriveKey(
  { name: "HKDF", hash: "SHA-256", salt, info: new TextEncoder().encode(messageId) },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);</code></pre>

<h2>Construyendo una arquitectura de conocimiento cero</h2>
<p>La Web Crypto API facilita la construcción de sistemas de conocimiento cero. El patrón de diseño clave usado por <a href="/">Only Once Share</a>: generar una clave en el navegador, cifrar datos del lado del cliente, enviar solo texto cifrado al servidor, poner la clave en el fragmento de URL (<code>#</code>).</p>

<h2>Conclusión</h2>
<p>La Web Crypto API proporciona todo lo que necesitas para construir aplicaciones seguras y centradas en la privacidad sin bibliotecas criptográficas externas.</p>
`
  },
  "zero-knowledge-architecture-deep-dive": {
    title: "Arquitectura de conocimiento cero: una inmersión técnica profunda",
    description: "Una exploración técnica de los patrones de arquitectura de conocimiento cero para aplicaciones web. Gestión de claves, fragmentos de URL y modelado de amenazas.",
    content: `
<p>La arquitectura de conocimiento cero es un patrón de diseño de sistemas donde el proveedor del servicio no puede acceder a los datos del usuario. No por política — por imposibilidad matemática.</p>

<h2>Definiendo conocimiento cero</h2>
<p>Un sistema es de conocimiento cero cuando:</p>
<ol>
<li>Los datos se cifran antes de salir del cliente</li>
<li>El servidor nunca posee la clave de descifrado</li>
<li>El servidor almacena solo texto cifrado que no puede descifrar</li>
<li>El descifrado ocurre exclusivamente en el cliente</li>
</ol>

<h2>El problema de distribución de claves</h2>
<h3>Solución 1: Fragmentos de URL</h3>
<p>El enfoque usado por <a href="/">Only Once Share</a>. La clave se coloca después del <code>#</code> en la URL:</p>
<pre><code>https://ooshare.io/s/abc123#clave-de-descifrado-aqui</code></pre>
<p>Los fragmentos de URL están definidos en RFC 3986 como solo para el cliente — los navegadores nunca los incluyen en solicitudes HTTP.</p>

<h3>Solución 2: Derivación de claves basada en contraseña</h3>
<p>El usuario proporciona una contraseña, y PBKDF2 o Argon2 deriva la clave de cifrado.</p>

<h3>Solución 3: Criptografía de clave pública</h3>
<p>El remitente cifra con la clave pública del destinatario; solo la clave privada del destinatario puede descifrar.</p>

<h2>Modelo de amenazas</h2>
<h3>Amenaza: Servidor comprometido</h3>
<p><strong>Mitigación:</strong> El servidor solo almacena datos cifrados. Sin claves, los datos no tienen valor para un atacante.</p>

<h3>Amenaza: JavaScript malicioso</h3>
<p><strong>Mitigación:</strong> Código abierto + revisión de código, etiquetas SRI, auto-alojamiento.</p>

<h2>Patrones de implementación</h2>
<h3>Patrón: Claves por mensaje basadas en HKDF</h3>
<pre><code>derivedKey = HKDF(masterKey, salt, info=messageId)</code></pre>

<h3>Patrón: Vinculación AAD</h3>
<pre><code>ciphertext = AES-GCM-Encrypt(key, iv, plaintext, aad=messageId)</code></pre>

<h2>Conclusión</h2>
<p>La arquitectura de conocimiento cero proporciona la garantía de privacidad más fuerte para aplicaciones web: certeza matemática de que el servidor no puede acceder a los datos del usuario.</p>
`
  },
  "password-sharing-remote-teams": {
    title: "Mejores prácticas para compartir contraseñas en equipos remotos",
    description: "Cómo los equipos distribuidos y remotos pueden compartir contraseñas y credenciales de forma segura a través de zonas horarias, dispositivos y canales de comunicación.",
    content: `
<p>Los equipos remotos enfrentan desafíos únicos al compartir credenciales. Los miembros del equipo están distribuidos en diferentes zonas horarias, usando dispositivos personales en varias redes, comunicándose a través de múltiples herramientas.</p>

<h2>El desafío de seguridad del trabajo remoto</h2>
<ul>
<li><strong>Redes domésticas</strong> — A menudo menos seguras que las redes corporativas</li>
<li><strong>Dispositivos personales</strong> — Pueden carecer de configuraciones de seguridad empresarial</li>
<li><strong>Múltiples herramientas de comunicación</strong> — Las credenciales terminan en todas partes</li>
<li><strong>Diferencias de zona horaria</strong> — Las credenciales permanecen en mensajes durante horas</li>
</ul>

<h2>Mejores prácticas</h2>
<h3>1. Usa enlaces autodestructivos para cada transferencia de credenciales</h3>
<p>Hazlo una política del equipo: sin contraseñas en texto plano en ningún canal de comunicación. Cada transferencia usa un enlace cifrado autodestructivo de <a href="/">Only Once Share</a>.</p>

<h3>2. Establece tiempos de expiración cortos</h3>
<p>Con equipos remotos en diferentes zonas horarias, es tentador establecer tiempos de expiración largos. Resiste esta tentación.</p>

<h3>3. Establece un gestor de contraseñas compartido</h3>
<p>Para credenciales que múltiples miembros necesitan acceso continuo, usa un gestor de contraseñas del equipo.</p>

<h3>4. Usa canales separados para enlace y contexto</h3>
<p>Envía el enlace cifrado por un canal y explica para qué es por otro.</p>

<h2>Referencia rápida</h2>
<table>
<thead><tr><th>Escenario</th><th>Herramienta</th></tr></thead>
<tbody>
<tr><td>Transferencia única de credenciales</td><td>Enlace cifrado autodestructivo</td></tr>
<tr><td>Credenciales compartidas continuas</td><td>Gestor de contraseñas del equipo</td></tr>
<tr><td>Secretos de aplicación/CI</td><td>Gestor de secretos (Vault, AWS Secrets Manager)</td></tr>
<tr><td>Configuración inicial de incorporación</td><td>Enlace autodestructivo → inscripción en gestor de contraseñas</td></tr>
</tbody>
</table>

<h2>Conclusión</h2>
<p>Los equipos remotos comparten credenciales con más frecuencia y a través de más canales. Al estandarizar enlaces cifrados autodestructivos para transferencias únicas y gestores de contraseñas para acceso continuo, puedes mantener la seguridad sin ralentizar al equipo.</p>
`
  },
  "why-self-host-secret-sharing": {
    title: "Por qué tu empresa debería auto-alojar su herramienta de compartir secretos",
    description: "El caso para auto-alojar tu infraestructura de compartir secretos. Soberanía de datos, cumplimiento, control y eliminación de confianza en terceros.",
    content: `
<p>Usar un servicio alojado de compartir secretos significa que tus datos cifrados pasan por los servidores de otra persona. Incluso con cifrado de conocimiento cero, algunas organizaciones necesitan — o prefieren — eliminar completamente la participación de terceros.</p>

<h2>El caso para auto-alojar</h2>
<h3>1. Soberanía total de datos</h3>
<p>Cuando auto-alojas, los datos cifrados nunca salen de tu infraestructura.</p>

<h3>2. Cumplimiento regulatorio</h3>
<p>Muchas regulaciones requieren que los datos permanezcan dentro de jurisdicciones específicas: GDPR, HIPAA, SOC 2, PCI DSS.</p>

<h3>3. Eliminar confianza en terceros</h3>
<p>Auto-alojar elimina este requisito de confianza porque controlas el despliegue del código.</p>

<h3>4. Aislamiento de red</h3>
<p>Permite ejecutar la herramienta en una red interna sin exposición a internet público.</p>

<h3>5. Personalización</h3>
<p>Con el código fuente abierto, puedes personalizar marca, opciones de TTL, límites de tamaño, integración con autenticación y registro de auditoría.</p>

<h2>Costos de auto-alojamiento</h2>
<table>
<thead><tr><th>Recurso</th><th>Mínimo</th><th>Recomendado</th></tr></thead>
<tbody>
<tr><td>RAM</td><td>512 MB</td><td>1 GB</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td></tr>
<tr><td>Costo mensual (VM cloud)</td><td>~$5</td><td>~$10</td></tr>
</tbody>
</table>

<h2>Empezar</h2>
<pre><code>git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share
docker compose up -d</code></pre>

<h2>Conclusión</h2>
<p>Auto-alojar tu herramienta de compartir secretos proporciona la combinación definitiva de seguridad, control y cumplimiento. Elimina la confianza en terceros, asegura la soberanía de datos y cuesta una fracción de las alternativas comerciales.</p>
`
  },
  "state-of-secret-sharing-2026": {
    title: "El estado de las herramientas de compartir secretos en 2026",
    description: "Una visión general del panorama de compartir secretos en 2026: tendencias del mercado, evolución del cifrado, visibilidad en búsquedas IA y hacia dónde se dirige la industria.",
    content: `
<p>El mercado de compartir secretos de un solo uso ha evolucionado significativamente. Lo que comenzó como una categoría de herramientas de nicho se ha convertido en infraestructura esencial para equipos conscientes de la seguridad.</p>

<h2>Visión general del mercado</h2>
<p>El panorama incluye aproximadamente 10-15 productos activos, desde SaaS empresarial hasta proyectos de código abierto.</p>

<h3>Jugadores establecidos (5+ años)</h3>
<ul>
<li><strong>OneTimeSecret</strong> (est. 2011) — La herramienta que definió la categoría.</li>
<li><strong>Password Pusher</strong> (est. ~2012) — La opción de código abierto más rica en funciones.</li>
</ul>

<h3>Retadores modernos (2-5 años)</h3>
<ul>
<li><strong>password.link</strong> — Enfocado en empresas con SSO y dominios personalizados.</li>
<li><strong>scrt.link</strong> — Con base en Suiza, cifrado del lado del cliente.</li>
</ul>

<h3>Nuevos participantes</h3>
<ul>
<li><strong><a href="/">Only Once Share</a></strong> — Gratis, código abierto, conocimiento cero con AES-256-GCM y soporte de 6 idiomas.</li>
</ul>

<h2>Tendencias clave en 2026</h2>
<h3>1. El cifrado del lado del cliente se está convirtiendo en el estándar</h3>
<p>La mayoría de los nuevos participantes usan cifrado del lado del cliente con arquitectura de conocimiento cero por defecto.</p>

<h3>2. El código abierto es una ventaja competitiva</h3>
<p>Las herramientas más confiables son de código abierto. Las herramientas de código cerrado enfrentan un déficit de confianza creciente.</p>

<h3>3. El auto-alojamiento es mainstream</h3>
<p>Docker ha hecho el auto-alojamiento trivialmente fácil.</p>

<h3>4. La búsqueda IA está remodelando el descubrimiento</h3>
<p>Google AI Overviews, ChatGPT y Perplexity están cambiando cómo las personas descubren herramientas.</p>

<h3>5. El soporte multi-idioma importa</h3>
<p>Las herramientas solo en inglés se pierden mercados enormes en Asia, América Latina y Oriente Medio.</p>

<h2>La brecha de cifrado</h2>
<table>
<thead><tr><th>Herramienta</th><th>Tipo de cifrado</th><th>¿El servidor ve texto plano?</th></tr></thead>
<tbody>
<tr><td>Only Once Share</td><td>Cliente (AES-256-GCM)</td><td>No</td></tr>
<tr><td>scrt.link</td><td>Cliente</td><td>No</td></tr>
<tr><td>Yopass</td><td>Cliente (OpenPGP)</td><td>No</td></tr>
<tr><td>OneTimeSecret</td><td>Servidor</td><td>Sí</td></tr>
<tr><td>Password Pusher</td><td>Servidor</td><td>Sí</td></tr>
</tbody>
</table>

<h2>Conclusión</h2>
<p>El mercado de compartir secretos en 2026 es más saludable y competitivo que nunca. La tendencia hacia el cifrado del lado del cliente, código abierto y auto-alojamiento refleja una comprensión cada vez más madura de la privacidad y la seguridad. Los datos que proteges hoy son la violación que previenes mañana.</p>
`
  },
  "why-share-images-securely": {
    title: "Por qué deberías compartir imágenes de forma segura (y cómo hacerlo)",
    description: "Las imágenes contienen más datos sensibles de lo que crees. Descubre por qué compartir imágenes de forma segura es importante para la salud, el sector legal, recursos humanos y la privacidad personal — y cómo los enlaces cifrados y autodestructivos resuelven el problema.",
    content: `
<p>Cuando la gente piensa en compartir secretos, piensa en contraseñas y claves API. Pero algunos de los datos más sensibles que compartimos cada día son imágenes: escaneos de documentos de identidad, registros médicos, contratos firmados, fotos privadas. A diferencia del texto, las imágenes son más difíciles de redactar, más fáciles de reenviar y casi imposibles de recuperar una vez que se filtran.</p>

<h2>Las imágenes son objetivos de alto valor</h2>
<p>Una contraseña filtrada se puede rotar en minutos. Una imagen filtrada de tu pasaporte, escaneo médico o foto privada no se puede deshacer. Las imágenes contienen información rica y contextual que el texto simplemente no tiene:</p>
<ul>
<li><strong>Documentos de identidad</strong> — pasaportes, licencias de conducir y documentos nacionales contienen tu nombre completo, fecha de nacimiento, foto y números de documento. Un solo escaneo filtrado es suficiente para el robo de identidad.</li>
<li><strong>Registros médicos</strong> — radiografías, resultados de laboratorio, recetas e imágenes diagnósticas están protegidos por regulaciones como HIPAA y GDPR. Compartirlos por correo electrónico o chat crea riesgo de cumplimiento.</li>
<li><strong>Documentos legales</strong> — contratos firmados, documentos judiciales y cartas notariales a menudo necesitan compartirse entre partes pero nunca deberían quedarse en una bandeja de entrada.</li>
<li><strong>Registros financieros</strong> — extractos bancarios, formularios fiscales y documentos de seguros contienen números de cuenta y datos financieros personales.</li>
</ul>

<h2>Escenarios del mundo real</h2>
<p>Compartir imágenes de forma segura no es una necesidad de nicho. Surge constantemente en contextos profesionales y personales cotidianos.</p>

<h3>Salud</h3>
<p>Un médico necesita compartir una imagen diagnóstica con un especialista. Enviarla por correo significa que queda en dos bandejas de entrada indefinidamente. Con un enlace cifrado y autodestructivo, el especialista ve la imagen una vez y se elimina permanentemente.</p>

<h3>Legal y cumplimiento</h3>
<p>Un abogado envía a un cliente la foto de un acuerdo firmado. El documento no debería persistir en hilos de correo. Un enlace de un solo uso asegura que se vea y luego desaparezca.</p>

<h3>Recursos humanos</h3>
<p>Los nuevos empleados envían escaneos de documentos de identidad y permisos de trabajo. Los departamentos de RRHH que los reciben por correo acumulan documentos de identidad — un objetivo principal para violaciones de datos. Los enlaces autodestructivos resuelven esto.</p>

<h3>Inmobiliario y finanzas</h3>
<p>Solicitudes de hipotecas, escrituras y extractos bancarios se comparten frecuentemente entre agentes y clientes. Contienen números de cuenta y firmas que no deberían permanecer en hilos de correo.</p>

<h3>Privacidad personal</h3>
<p>A veces necesitas enviar una foto de tu tarjeta de seguro a un familiar o compartir una captura de pantalla de una conversación privada. Las apps de mensajería almacenan imágenes en sus servidores y las sincronizan con copias de seguridad en la nube. Un enlace cifrado autodestructivo te devuelve el control.</p>

<h2>Por qué los métodos tradicionales fallan</h2>

<h3>Correo electrónico</h3>
<p>El correo almacena mensajes y archivos adjuntos indefinidamente en múltiples servidores. La mayoría del correo no tiene cifrado de extremo a extremo. Las imágenes enviadas por correo son trivialmente fáciles de reenviar.</p>

<h3>Apps de mensajería</h3>
<p>WhatsApp, Slack y Teams a menudo comprimen y almacenan imágenes en sus servidores. Incluso las funciones de "mensajes que desaparecen" no son confiables — los destinatarios pueden hacer capturas de pantalla y las políticas de retención corporativa pueden anular la eliminación.</p>

<h3>Enlaces de almacenamiento en la nube</h3>
<p>Los enlaces de Google Drive, Dropbox y OneDrive son persistentes por defecto. Revocar el acceso requiere acción manual y el archivo permanece en los servidores del proveedor.</p>

<h2>Cómo los enlaces cifrados autodestructivos resuelven esto</h2>
<p>La idea central es simple: cifrar la imagen en tu navegador antes de que salga de tu dispositivo, subir solo los datos cifrados y generar un enlace de un solo uso. El destinatario abre el enlace, la imagen se descifra en su navegador y los datos cifrados se eliminan permanentemente del servidor.</p>
<ul>
<li><strong>Cifrado de conocimiento cero</strong> — El servidor nunca ve la imagen original.</li>
<li><strong>Recuperación única</strong> — La imagen solo se puede ver una vez. Después, los datos se eliminan atómicamente.</li>
<li><strong>Sin persistencia</strong> — A diferencia de los archivos adjuntos de correo o los enlaces en la nube, no hay ninguna copia esperando a ser vulnerada.</li>
<li><strong>Cifrado del lado del cliente</strong> — La clave de cifrado nunca toca el servidor.</li>
</ul>

<h2>Cómo Only Once Share maneja el intercambio de imágenes</h2>
<p><a href="/">Only Once Share</a> soporta compartir imágenes cifradas junto con texto:</p>
<ol>
<li><strong>Selecciona o arrastra tu imagen</strong> — Arrastra y suelta o haz clic para seleccionar un archivo.</li>
<li><strong>Cifrado del lado del cliente</strong> — La imagen se cifra en tu navegador usando AES-256-GCM con una clave derivada via HKDF-SHA-256.</li>
<li><strong>Comparte el enlace</strong> — Obtienes un enlace de un solo uso con la clave incrustada en el fragmento de la URL.</li>
<li><strong>El destinatario ve una vez</strong> — El destinatario abre el enlace, la imagen se descifra en su navegador y los datos se eliminan permanentemente.</li>
</ol>

<h2>Mejores prácticas para compartir imágenes sensibles</h2>
<ul>
<li><strong>Usa el menor tiempo de expiración práctico</strong> — Si el destinatario abrirá el enlace en una hora, configura un TTL de 1 hora.</li>
<li><strong>Nunca uses correo para escaneos de documentos</strong> — Pasaportes y documentos de identidad nunca deberían estar en el correo.</li>
<li><strong>Verifica al destinatario antes de compartir</strong> — Un enlace autodestructivo es tan seguro como el canal que usas para enviarlo.</li>
<li><strong>Evita el almacenamiento en la nube para compartir temporalmente</strong> — Si el destinatario solo necesita ver la imagen una vez, un enlace persistente en la nube es excesivo.</li>
<li><strong>Verifica los requisitos de cumplimiento</strong> — Si manejas imágenes médicas (HIPAA), datos personales (GDPR) o registros financieros, los enlaces cifrados autodestructivos ayudan a cumplir con los requisitos de minimización de datos.</li>
</ul>

<h2>Conclusión</h2>
<p>Las imágenes contienen más información sensible de lo que la mayoría de la gente cree. Desde escaneos médicos hasta documentos de identidad y fotos privadas, las consecuencias de una filtración de imágenes suelen ser mucho peores que una contraseña filtrada. Los métodos tradicionales — correo, apps de mensajería, enlaces en la nube — no fueron diseñados para compartir de forma segura y única. Los enlaces cifrados y autodestructivos cierran esta brecha. La próxima vez que necesites compartir una imagen sensible, omite el archivo adjunto del correo y <a href="/">crea un enlace autodestructivo</a>.</p>
`
  },
  "password-protected-photo-sharing": {
    title: "Compartir fotos con protección de contraseña: cómo enviar imágenes privadas de forma segura",
    description: "Aprende a compartir fotos de forma segura con protección de contraseña y cifrado de extremo a extremo. Descubre por qué los métodos tradicionales fallan y cómo los enlaces cifrados autodestructivos mantienen tus imágenes privadas protegidas.",
    content: `
<p>Compartir fotos de forma privada no debería significar confiar en un tercero con tus imágenes sin cifrar. Ya sea que estés enviando escaneos de tu documento de identidad a un banco, imágenes médicas a un médico, fotos familiares privadas a un familiar o capturas de pantalla confidenciales a un colega, necesitas un método que mantenga tus fotos protegidas desde el momento en que salen de tu dispositivo hasta que el destinatario las ve — y que luego las destruya de forma permanente.</p>

<h2>¿Qué es compartir fotos con protección de contraseña?</h2>
<p>Compartir fotos con protección de contraseña significa cifrar una foto antes de enviarla para que solo alguien con la clave o contraseña correcta pueda verla. El objetivo es garantizar que nadie — ni el servidor, ni la red, ni un hacker — pueda ver la foto sin autorización. La forma más sólida de esto es el <strong>cifrado de extremo a extremo</strong>, donde la foto se cifra en el dispositivo del remitente y solo se descifra en el dispositivo del destinatario.</p>
<p>El intercambio "protegido con contraseña" tradicional — como proteger con contraseña un archivo ZIP o un enlace de Google Drive — sigue subiendo el archivo sin cifrar a un servidor. El servidor puede ver tu foto. La contraseña solo controla el acceso, no cifra el contenido. El verdadero intercambio de fotos con protección de contraseña significa que el servidor nunca ve la imagen original.</p>

<h2>Por qué los métodos tradicionales de compartir fotos son inseguros</h2>
<h3>Archivos adjuntos de correo electrónico</h3>
<p>El correo electrónico almacena fotos indefinidamente en múltiples servidores (remitente, destinatario, copias de seguridad). La mayoría del correo no tiene cifrado de extremo a extremo. Una cuenta de correo comprometida expone cada foto enviada a través de ella. Los archivos adjuntos son trivialmente fáciles de reenviar, y "eliminar" un correo no lo borra de las copias de seguridad del servidor.</p>
<h3>Apps de mensajería</h3>
<p>WhatsApp, Telegram, Slack y Teams almacenan imágenes en sus servidores. Incluso las apps con funciones de "mensajes que desaparecen" no son confiables — los destinatarios pueden hacer capturas de pantalla, la app puede almacenar imágenes en caché localmente y las políticas de retención corporativa pueden anular la configuración de eliminación. La sincronización en la nube (iCloud, Google Fotos) significa que las imágenes eliminadas pueden persistir en las copias de seguridad.</p>
<h3>Enlaces de almacenamiento en la nube</h3>
<p>Los enlaces de Google Drive, Dropbox y OneDrive son persistentes por defecto. El archivo permanece en los servidores del proveedor indefinidamente. Revocar el acceso requiere acción manual, y los enlaces compartidos pueden reenviarse sin que el remitente lo sepa. El propio proveedor puede acceder a tus archivos sin cifrar.</p>
<h3>Archivos ZIP protegidos con contraseña</h3>
<p>Aunque mejor que el texto sin formato, la protección de contraseña de ZIP tiene debilidades graves. El archivo aún debe transmitirse a través de un canal inseguro. La propia contraseña necesita un canal seguro separado. El ZIP cifrado persiste dondequiera que se haya enviado. Y el cifrado ZIP común (ZipCrypto) es conocido por ser criptográficamente débil.</p>

<h2>Cómo funcionan los enlaces cifrados autodestructivos</h2>
<p>El enfoque más seguro para compartir fotos con protección de contraseña combina tres principios: <strong>cifrado del lado del cliente</strong>, <strong>arquitectura de conocimiento cero</strong> y <strong>recuperación única</strong>.</p>
<ol>
<li><strong>Cifrado del lado del cliente</strong> — Tu foto se cifra en tu navegador usando AES-256-GCM antes de salir de tu dispositivo. El servidor recibe solo bytes cifrados que no puede leer.</li>
<li><strong>Arquitectura de conocimiento cero</strong> — La clave de cifrado se coloca en el fragmento de la URL (la parte después del #). Los navegadores nunca envían fragmentos de URL a los servidores. El servidor literalmente no puede descifrar tu foto aunque quisiera.</li>
<li><strong>Recuperación única</strong> — Cuando el destinatario abre el enlace, la foto cifrada se obtiene y se elimina atómicamente del servidor en la misma operación. La foto solo se puede ver una vez y luego desaparece de forma permanente.</li>
</ol>
<p>Esto es fundamentalmente diferente a "proteger con contraseña" un archivo en un servicio en la nube. No hay ninguna copia sin cifrar en ningún servidor, ningún enlace persistente que pueda compartirse más y ninguna ventana en la que los datos puedan interceptarse.</p>

<h2>Casos de uso en el mundo real</h2>
<h3>Verificación de identidad</h3>
<p>Los bancos, propietarios y empleadores solicitan habitualmente fotos de tu documento de identidad, pasaporte o carnet de conducir. Enviarlos por correo crea un registro permanente de tus documentos de identidad en múltiples cuentas de correo y copias de seguridad del servidor. Con enlaces cifrados autodestructivos, el verificador ve tu identificación una vez, confirma la información y la imagen se destruye permanentemente.</p>
<h3>Imágenes médicas</h3>
<p>Los médicos que comparten radiografías, resonancias magnéticas o resultados de laboratorio con especialistas necesitan un método que cumpla con HIPAA y GDPR. El correo electrónico no cumple estos requisitos. Un enlace cifrado y autodestructivo garantiza que la imagen sea vista una vez por el destinatario previsto y luego se elimine de forma permanente, satisfaciendo los principios de minimización de datos.</p>
<h3>Documentos legales</h3>
<p>Las fotos de contratos firmados, presentaciones judiciales o documentos notariados a menudo deben compartirse entre las partes. Estos no deberían persistir en hilos de correo que podrían reenviarse, solicitarse judicialmente o ser vulnerados. Un enlace cifrado de un solo uso garantiza que el documento se vea y luego desaparezca.</p>
<h3>Fotos personales privadas</h3>
<p>Las fotos familiares, momentos privados o imágenes personales sensibles merecen el mismo nivel de protección. Las apps de mensajería habituales almacenan estas imágenes en sus servidores, las sincronizan con copias de seguridad en la nube y las hacen buscables. Un enlace cifrado autodestructivo te devuelve el control de tus fotos privadas.</p>
<h3>Capturas de pantalla empresariales y confidenciales</h3>
<p>Las capturas de pantalla de paneles internos, informes financieros o diseños de productos no publicados se comparten frecuentemente entre miembros del equipo. Estos nunca deberían permanecer en canales de Slack o hilos de correo donde personas no autorizadas podrían acceder a ellos meses después.</p>

<h2>Cómo Only Once Share gestiona el intercambio de fotos con protección de contraseña</h2>
<p><a href="/">Only Once Share</a> proporciona intercambio de fotos con protección de contraseña con cifrado de grado militar:</p>
<ol>
<li><strong>Sube tu foto</strong> — Arrastra y suelta o haz clic para seleccionar una imagen (JPEG, PNG, GIF, WebP de hasta 25 MB). También puedes incluir un mensaje de texto, un PDF o un archivo ZIP junto con la foto.</li>
<li><strong>Cifrado automático</strong> — Tu foto se cifra en tu navegador usando AES-256-GCM con una clave derivada via HKDF-SHA-256. El servidor recibe solo bytes cifrados.</li>
<li><strong>Obtén un enlace de un solo uso</strong> — La clave de cifrado está integrada en el fragmento de la URL (después del #) y nunca se envía a ningún servidor.</li>
<li><strong>Comparte el enlace</strong> — Envía el enlace a través de cualquier canal (WhatsApp, correo, SMS). Incluso si el canal está comprometido, la foto cifrada no puede leerse sin la URL completa.</li>
<li><strong>El destinatario la ve una vez</strong> — El destinatario abre el enlace, la foto se descifra en su navegador y los datos cifrados se eliminan permanentemente del servidor mediante eliminación atómica.</li>
</ol>
<p>Todo el proceso es gratuito, de código abierto y no requiere cuenta ni registro. Puedes <a href="/security">revisar la arquitectura de seguridad</a> o <a href="https://github.com/dhdtech/only-once-share">auditar el código fuente</a> tú mismo.</p>

<h2>Qué buscar en una herramienta segura para compartir fotos</h2>
<p>Al elegir una herramienta para compartir fotos con protección de contraseña, verifica estos criterios:</p>
<ul>
<li><strong>Cifrado del lado del cliente</strong> — La foto debe cifrarse en tu navegador, no en el servidor.</li>
<li><strong>Arquitectura de conocimiento cero</strong> — El servidor nunca debería tener acceso a la clave de cifrado.</li>
<li><strong>Recuperación única</strong> — La foto debe eliminarse de forma permanente después de la primera visualización.</li>
<li><strong>Código abierto</strong> — Deberías poder auditar el código de cifrado.</li>
<li><strong>Sin cuenta requerida</strong> — Crear cuentas introduce otra superficie de ataque.</li>
<li><strong>Expiración automática</strong> — Incluso si el destinatario nunca abre el enlace, los datos cifrados deben eliminarse automáticamente después de un tiempo determinado.</li>
</ul>

<h2>Mejores prácticas para compartir fotos de forma segura</h2>
<ul>
<li><strong>Nunca envíes documentos de identidad o imágenes médicas por correo</strong> — Usa en su lugar enlaces cifrados de un solo uso.</li>
<li><strong>Configura la expiración más corta posible</strong> — Si el destinatario lo verá en una hora, configura un TTL de 1 hora.</li>
<li><strong>Verifica al destinatario</strong> — Un enlace autodestructivo es tan seguro como el canal que usas para enviarlo.</li>
<li><strong>No uses almacenamiento en la nube para compartir una sola vez</strong> — Los enlaces de Google Drive y Dropbox persisten.</li>
<li><strong>Verifica los requisitos de cumplimiento</strong> — Si manejas imágenes médicas (HIPAA), datos personales (GDPR) o registros financieros, los enlaces cifrados autodestructivos ayudan a cumplir con los requisitos de minimización de datos.</li>
</ul>

<h2>Conclusión</h2>
<p>Compartir fotos con protección de contraseña no consiste solo en añadir una contraseña a un archivo — se trata de garantizar que tus fotos estén cifradas antes de salir de tu dispositivo, transmitidas a través de un servidor de conocimiento cero y destruidas permanentemente después de su visualización. Los métodos tradicionales como el correo, las apps de mensajería y los enlaces en la nube no cumplen ninguno de estos tres criterios. Los enlaces cifrados y autodestructivos proporcionan la forma más sólida de protección de fotos disponible hoy en día. La próxima vez que necesites compartir una foto sensible, omite el archivo adjunto del correo y <a href="/">crea un enlace cifrado autodestructivo</a>.</p>
`
  },
  "when-to-share-pdfs-securely": {
    title: "¿Cuándo necesitas realmente compartir PDFs de forma segura?",
    description: "Los PDFs contienen contratos, historiales médicos, declaraciones de impuestos y mucho más. Conoce los escenarios reales donde compartir PDFs de forma segura es imprescindible — y por qué los archivos adjuntos de correo se quedan cortos.",
    content: `
<p>Los PDFs son el formato universal para los documentos que importan. Contratos, declaraciones de impuestos, historiales médicos, extractos bancarios, escritos judiciales — cuando la información es lo bastante importante como para formalizarse, casi siempre acaba en un PDF. Y sin embargo, la mayoría de las personas comparten estos documentos igual que comparten fotos de gatos: como archivos adjuntos de correo o enlaces de almacenamiento en la nube que persisten indefinidamente y pueden reenviarse a cualquiera.</p>

<p>No todos los PDFs necesitan cifrado de grado militar. Pero muchos sí — y los momentos en que compartir de forma segura importa son más frecuentes de lo que crees.</p>

<h2>Contratos y acuerdos legales</h2>
<p>Cuando dos partes intercambian un contrato firmado, el PDF suele contener nombres, direcciones, condiciones financieras, firmas y, en ocasiones, números de identificación oficial. Enviar esto como archivo adjunto de correo significa que ambas partes tienen ahora una copia permanente en su correo — indexable, reenviable y vulnerable ante cualquier futura brecha de seguridad.</p>
<p>Bufetes de abogados, agentes inmobiliarios y trabajadores independientes comparten contratos constantemente. Una sola cuenta de correo comprometida puede exponer decenas de acuerdos, cada uno con suficiente información personal para el robo de identidad. Compartir PDFs de forma segura con enlaces de un solo uso garantiza que el documento se visualice y luego se elimine permanentemente del servidor, sin dejar copias pendientes que los atacantes puedan encontrar.</p>

<h2>Documentos fiscales y registros financieros</h2>
<p>La temporada de impuestos es una mina de oro para los ladrones de identidad. Formularios W-2, 1099, declaraciones de la renta y extractos bancarios contienen números de la Seguridad Social, detalles de ingresos, información del empleador y números de cuenta bancaria — todo lo necesario para presentar una declaración fiscal fraudulenta o abrir líneas de crédito a nombre de otra persona.</p>
<p>Los contadores y asesores fiscales reciben estos documentos de sus clientes habitualmente por correo electrónico. Algunos usan portales de cliente, pero muchos aún recurren a archivos adjuntos o enlaces compartidos de Google Drive. Cada una de estas copias persistentes es un riesgo. Un enlace cifrado autodestructivo elimina la ventana de exposición: el contador descarga el documento y la copia en el servidor desaparece.</p>

<h2>Historiales médicos e información sanitaria</h2>
<p>Los PDFs médicos — resultados de laboratorio, informes de imagen, recetas, reclamaciones al seguro — se encuentran entre los documentos más sensibles que una persona puede compartir. En Estados Unidos, HIPAA exige que la información de salud protegida (PHI) se transmita con las salvaguardas adecuadas. En la UE, el RGPD impone requisitos similares para los datos de salud.</p>
<p>Los pacientes necesitan con frecuencia compartir historiales médicos con nuevos médicos, compañías de seguros o familiares. Enviar por correo un PDF con tus resultados de laboratorio significa que ese documento existe ahora en al menos cuatro lugares: tu carpeta de enviados, la bandeja del destinatario y los sistemas de respaldo de ambos proveedores de correo. Un enlace cifrado de conocimiento cero con expiración automática satisface el principio de minimización de datos que tanto HIPAA como el RGPD enfatizan.</p>

<h2>Documentos de RR. HH. e incorporación de empleados</h2>
<p>Los nuevos empleados envían una avalancha de PDFs sensibles durante la incorporación: documentos de identidad oficiales, tarjetas de la Seguridad Social, datos bancarios para la domiciliación de nómina, cartas de oferta firmadas con información salarial y autorizaciones de verificación de antecedentes. Los equipos de RR. HH. que recopilan todo esto por correo están creando un tesoro de datos personales dispersos por bandejas de entrada.</p>
<p>Incluso las empresas con portales de RR. HH. adecuados a veces recurren al correo cuando el portal no funciona, el nuevo empleado trabaja en remoto o el proceso va con prisa. Compartir PDFs de forma segura ofrece una alternativa fiable que no compromete los datos del empleado. El equipo de RR. HH. recibe el documento y la copia cifrada se autodestruye.</p>

<h2>Reclamaciones de seguros y documentación de respaldo</h2>
<p>Presentar una reclamación de seguro suele requerir compartir PDFs de partes policiales, facturas médicas, peritajes de daños materiales y presupuestos de reparación. Estos documentos contienen datos personales, cifras económicas y, en ocasiones, fotografías de daños en propiedades o lesiones.</p>
<p>Los agentes y peritos de seguros manejan miles de estos documentos. Una brecha en el correo de un agente de seguros podría exponer la información personal de cada cliente que haya presentado una reclamación por correo. Los enlaces cifrados de un solo uso limitan la exposición al instante de la visualización, tras el cual los datos dejan de existir en cualquier servidor.</p>

<h2>Propiedad intelectual y documentos empresariales confidenciales</h2>
<p>Acuerdos de confidencialidad, solicitudes de patentes, hojas de ruta de productos, proyecciones financieras y documentos de fusiones y adquisiciones se comparten habitualmente como PDFs entre empresas, bufetes y inversores. Estos documentos representan un valor comercial significativo y una ventaja competitiva.</p>
<p>Una solicitud de patente filtrada puede destruir la posición competitiva de una empresa. Un documento de fusión reenviado puede desencadenar investigaciones por uso de información privilegiada. Los métodos tradicionales de compartir archivos — correo, Slack, Google Drive — crean copias persistentes a las que puede acceder cualquiera que obtenga acceso a la cuenta. Los enlaces cifrados autodestructivos garantizan que el documento sea visto únicamente por el destinatario previsto y solo una vez.</p>

<h2>Documentos de identificación personal</h2>
<p>Escaneos de pasaportes, copias de carnet de conducir, facturas de servicios como comprobante de domicilio y certificados de nacimiento se comparten con frecuencia como PDFs para verificación de identidad. Bancos, propietarios, empleadores y organismos gubernamentales solicitan estos documentos.</p>
<p>Un escaneo de pasaporte robado es una de las mercancías más valiosas en la dark web. Sin embargo, las personas envían rutinariamente PDFs de pasaportes a propietarios para solicitudes de alquiler o a bancos para la apertura de cuentas. Cada correo crea una copia permanente que podría quedar expuesta en una futura brecha. Un enlace autodestructivo asegura que el verificador vea el documento y este desaparezca — sin copias persistentes, sin exposición a largo plazo.</p>

<h2>Descubrimiento legal y documentos judiciales</h2>
<p>Los abogados comparten PDFs relacionados con casos con clientes, co-abogados, peritos y tribunales. Estos documentos suelen contener transcripciones de testimonios, resúmenes de pruebas, ofertas de acuerdo y comunicaciones privilegiadas. El secreto profesional entre abogado y cliente puede perderse si documentos privilegiados se divulgan inadvertidamente a terceros.</p>
<p>El uso de enlaces cifrados de un solo uso para compartir PDFs legales sensibles añade una capa de protección contra la divulgación accidental. Si el enlace ya ha sido abierto, un tercero no autorizado que obtenga la URL no encontrará nada — el documento ya no existe.</p>

<h2>Por qué los archivos adjuntos de correo no son suficientes</h2>
<p>El correo electrónico fue diseñado para la comunicación, no para la transferencia segura de documentos. Cuando adjuntas un PDF a un correo:</p>
<ul>
<li><strong>Persiste en múltiples ubicaciones</strong> — la bandeja de salida del remitente, la bandeja de entrada del destinatario, las copias de seguridad de ambos servidores de correo y cualquier copia reenviada</li>
<li><strong>Puede reenviarse sin tu conocimiento</strong> — no tienes control sobre quién ve el documento después de enviarlo</li>
<li><strong>Queda indexado y es fácilmente localizable</strong> — la búsqueda de correo hace que encontrar "declaración de la renta" o "pasaporte" en una cuenta comprometida sea trivial</li>
<li><strong>Carece de cifrado en reposo</strong> — la mayoría de los proveedores de correo almacenan los mensajes de forma que sus propios empleados (o una orden judicial) pueden acceder</li>
<li><strong>No tiene expiración</strong> — el archivo adjunto existe hasta que alguien lo elimine manualmente, cosa que la mayoría nunca hace</li>
</ul>

<h2>Por qué los enlaces de almacenamiento en la nube se quedan cortos</h2>
<p>Compartir PDFs a través de enlaces de Google Drive, Dropbox u OneDrive es mejor que los archivos adjuntos de correo, pero sigue siendo problemático:</p>
<ul>
<li><strong>Los enlaces pueden compartirse más allá del destinatario previsto</strong> — cualquiera con el enlace (o que adivine el patrón de la URL) puede acceder al archivo</li>
<li><strong>Los archivos persisten hasta que se eliminan manualmente</strong> — la mayoría de las personas olvida revocar el acceso o eliminar los archivos compartidos</li>
<li><strong>El proveedor de la nube puede acceder a tus archivos</strong> — el PDF se almacena en texto plano en los servidores del proveedor</li>
<li><strong>Los registros de acceso pueden ser requeridos judicialmente</strong> — quién accedió a qué documento y cuándo queda registrado por el proveedor</li>
</ul>

<h2>Cómo Only Once Share gestiona el intercambio seguro de PDFs</h2>
<p><a href="/">Only Once Share</a> fue creado exactamente para estos escenarios. Así es como funciona:</p>
<ol>
<li><strong>Sube tu PDF</strong> — Selecciona un archivo PDF de hasta 25 MB. También puedes incluir un mensaje de texto o una imagen junto con él.</li>
<li><strong>Cifrado en el navegador</strong> — El PDF se cifra en tu navegador usando AES-256-GCM con una clave derivada vía HKDF-SHA-256. El servidor solo ve bytes cifrados — no puede leer tu documento.</li>
<li><strong>Obtén un enlace de un solo uso</strong> — La clave de cifrado se incrusta en el fragmento de la URL (después del #), que nunca se envía a ningún servidor.</li>
<li><strong>Comparte el enlace</strong> — Envíalo a través de cualquier canal. Incluso si el canal está comprometido, el PDF cifrado no puede descifrarse sin la URL completa.</li>
<li><strong>El destinatario lo ve una vez</strong> — El destinatario abre el enlace, el PDF se descifra en su navegador y los datos cifrados se eliminan permanentemente del servidor mediante eliminación atómica.</li>
</ol>
<p>Sin cuentas. Sin registro. Sin copias persistentes. <a href="/security">Revisa la arquitectura de seguridad completa</a> o <a href="https://github.com/dhdtech/only-once-share">audita el código fuente</a>.</p>

<h2>Cuándo deberías usar el intercambio seguro de PDFs</h2>
<p>Como regla general, usa enlaces cifrados autodestructivos siempre que un PDF contenga:</p>
<ul>
<li><strong>Identificadores personales</strong> — números de la Seguridad Social, números de pasaporte, números de carnet de conducir</li>
<li><strong>Información financiera</strong> — números de cuenta bancaria, declaraciones de impuestos, datos salariales, registros de inversiones</li>
<li><strong>Información sanitaria</strong> — historiales médicos, resultados de laboratorio, reclamaciones de seguros</li>
<li><strong>Contenido legal</strong> — contratos, escritos judiciales, comunicaciones entre abogado y cliente</li>
<li><strong>Secretos empresariales</strong> — secretos comerciales, solicitudes de patentes, proyecciones financieras, documentos de fusiones y adquisiciones</li>
<li><strong>Credenciales de acceso</strong> — cualquier documento que contenga contraseñas, claves API o tokens de acceso</li>
</ul>
<p>Si el PDF causaría daño — financiero, legal, reputacional o personal — en caso de caer en manos equivocadas, merece un intercambio cifrado de un solo uso.</p>

<h2>Conclusión</h2>
<p>Los PDFs transportan la información más importante de nuestra vida profesional y personal. La comodidad de los archivos adjuntos de correo y los enlaces en la nube ha normalizado una práctica peligrosa: dejar documentos sensibles permanentemente accesibles en sistemas que nunca fueron diseñados para protegerlos. Los enlaces cifrados autodestructivos resuelven este problema garantizando que el documento exista solo durante el instante en que se necesita y se destruya permanentemente después. La próxima vez que necesites compartir un contrato, una declaración de impuestos, un historial médico o cualquier PDF sensible, omite el archivo adjunto del correo y <a href="/">crea un enlace seguro de un solo uso</a>.</p>
`
  },
  "share-zip-files-securely": {
    title: "Cómo compartir archivos ZIP de forma segura: archivos cifrados con enlaces autodestructivos",
    description: "Los archivos ZIP suelen contener lotes de documentos sensibles. Aprende a compartir archivos comprimidos de forma segura usando enlaces cifrados de un solo uso en lugar de adjuntos de correo o almacenamiento en la nube.",
    content: `
<p>Los archivos ZIP son la forma en que agrupamos documentos sensibles. Un paquete de contratación con cartas de oferta, formularios fiscales y escaneos de identificación. Una entrega de proyecto con código fuente y credenciales. Un paquete de descubrimiento legal con cientos de documentos del caso. Cuando comprimes archivos, normalmente estás creando un paquete de cosas que importan — y sin embargo, la mayoría de las personas comparten estos archivos comprimidos por correo electrónico o enlaces en la nube que persisten para siempre.</p>

<p>Esto es un problema. Un archivo ZIP que contiene diez documentos sensibles multiplica por diez la exposición de compartir uno solo. Y el enfoque estándar — proteger el ZIP con contraseña — tiene debilidades serias que la mayoría de la gente no entiende.</p>

<h2>Por qué los ZIP protegidos con contraseña no son suficientes</h2>
<p>Cuando creas un archivo ZIP protegido con contraseña usando el método estándar ZipCrypto (el predeterminado en Windows y la mayoría de herramientas de compresión), el cifrado es notablemente débil. ZipCrypto tiene vulnerabilidades conocidas desde los años 90 y puede ser descifrado con herramientas disponibles gratuitamente. Incluso la opción más robusta AES-256 disponible en 7-Zip y WinRAR tiene un problema fundamental: necesitas compartir la contraseña por separado.</p>
<p>La mayoría de las personas terminan enviando el ZIP en un correo y la contraseña en otro — o peor aún, en el mismo correo. Ambos correos persisten en bandejas de entrada, carpetas de enviados y copias de seguridad del servidor. Un atacante que comprometa cualquiera de las dos cuentas de correo obtiene tanto el archivo como la contraseña. La "protección" es pura fachada.</p>

<h2>Cuándo necesitas compartir archivos comprimidos de forma segura</h2>

<h3>Entregas de proyectos a clientes</h3>
<p>Los freelancers y las agencias envían habitualmente entregables de proyectos como archivos ZIP: código fuente, recursos de diseño, exportaciones de bases de datos, archivos de configuración con claves API. Estos archivos comprimidos a menudo contienen credenciales o código propietario que no debería persistir en hilos de correo una vez completada la entrega.</p>

<h3>Paquetes de documentos de RR. HH.</h3>
<p>La incorporación de un nuevo empleado suele implicar la recopilación de un lote de documentos sensibles: carta de oferta firmada, escaneo de documento de identidad oficial, tarjeta de la Seguridad Social, formulario de domiciliación bancaria, autorización de verificación de antecedentes. Los equipos de RR. HH. que reciben todo esto como adjuntos ZIP crean un paquete concentrado de datos personales que permanece en su bandeja de entrada indefinidamente.</p>

<h3>Paquetes de descubrimiento legal</h3>
<p>Los bufetes de abogados intercambian grandes conjuntos de documentos durante el descubrimiento — transcripciones de declaraciones, contratos, registros financieros, correspondencia. Estos archivos ZIP a menudo contienen material privilegiado o confidencial que podría causar daños graves si se divulga a terceros no autorizados. La persistencia del correo convierte cada paquete transmitido en un riesgo a largo plazo.</p>

<h3>Paquetes de documentos financieros</h3>
<p>Contadores, auditores y asesores financieros reciben archivos ZIP que contienen declaraciones de impuestos, extractos bancarios, registros de inversiones e informes financieros corporativos. Cada archivo comprimido es un perfil financiero completo que podría facilitar el fraude o el robo de identidad si cayera en manos equivocadas.</p>

<h3>Código fuente y credenciales</h3>
<p>Los desarrolladores comparten archivos ZIP que contienen bases de código, configuraciones de entorno, claves SSH, credenciales de API y cadenas de conexión a bases de datos. Un solo archivo comprimido comprometido puede proporcionar acceso completo a sistemas en producción. Estos nunca deberían persistir en canales de comunicación.</p>

<h3>Transferencias de historiales médicos</h3>
<p>Los pacientes que cambian de proveedor de salud a menudo necesitan transferir conjuntos de historiales médicos — resultados de laboratorio, informes de imagen, historiales de recetas, documentos de seguro. HIPAA exige salvaguardas adecuadas para la información de salud protegida, y un archivo ZIP en una bandeja de entrada de correo no cumple con ese requisito.</p>

<h2>El problema del correo electrónico y el almacenamiento en la nube</h2>
<p>Compartir archivos ZIP por correo o enlaces en la nube presenta los mismos problemas fundamentales que compartir cualquier archivo sensible por estos canales, amplificados por el hecho de que los archivos comprimidos contienen múltiples documentos:</p>
<ul>
<li><strong>Persistencia</strong> — El ZIP permanece en carpetas de enviados, bandejas de entrada y copias de seguridad del servidor indefinidamente. Una sola cuenta comprometida expone todo el paquete.</li>
<li><strong>Reenvío</strong> — El destinatario puede reenviar el paquete completo a cualquier persona sin tu conocimiento.</li>
<li><strong>Acceso en la nube</strong> — Google Drive, Dropbox y OneDrive almacenan tus archivos en texto plano en sus servidores. El proveedor (y cualquiera que comprometa al proveedor) puede acceder a ellos.</li>
<li><strong>Sin expiración</strong> — Los enlaces y adjuntos permanecen accesibles hasta que alguien los elimine manualmente, lo cual casi nunca sucede.</li>
<li><strong>Exposición multiplicada</strong> — Un ZIP con 20 documentos representa 20 veces la exposición de la filtración de un solo archivo.</li>
</ul>

<h2>Cómo Only Once Share gestiona el intercambio seguro de archivos comprimidos</h2>
<p><a href="/">Only Once Share</a> resuelve estos problemas con enlaces cifrados y autodestructivos:</p>
<ol>
<li><strong>Sube tu archivo ZIP</strong> — Selecciona un archivo ZIP, RAR, 7Z o TAR.GZ de hasta 25 MB. También puedes incluir un mensaje de texto junto con él.</li>
<li><strong>Cifrado en el navegador</strong> — El archivo se cifra en tu navegador usando AES-256-GCM con una clave derivada vía HKDF-SHA-256. El servidor solo ve bytes cifrados — no puede leer ni extraer tus archivos.</li>
<li><strong>Obtén un enlace de un solo uso</strong> — La clave de cifrado está integrada en el fragmento de la URL (después del #) y nunca se envía a ningún servidor.</li>
<li><strong>Comparte el enlace</strong> — Envíalo a través de cualquier canal. Incluso si el canal está comprometido, el archivo cifrado no puede descifrarse sin la URL completa.</li>
<li><strong>El destinatario lo descarga una vez</strong> — El destinatario abre el enlace, el archivo se descifra en su navegador y queda disponible para descargar. Los datos cifrados se eliminan permanentemente del servidor mediante eliminación atómica.</li>
</ol>
<p>Sin contraseñas que compartir por separado. Sin copias persistentes en ningún servidor. Sin cuentas requeridas. <a href="/security">Revisa la arquitectura de seguridad</a> o <a href="https://github.com/dhdtech/only-once-share">audita el código fuente</a>.</p>

<h2>Mejores prácticas para compartir archivos comprimidos de forma segura</h2>
<ul>
<li><strong>No confíes solo en las contraseñas de ZIP</strong> — El cifrado estándar ZipCrypto es débil. Incluso los ZIP cifrados con AES requieren compartir una contraseña por un canal separado (a menudo inseguro).</li>
<li><strong>Configura la expiración más corta posible</strong> — Si el destinatario lo descargará en una hora, usa un TTL de 1 hora. Ventanas más cortas significan menos exposición.</li>
<li><strong>Elimina archivos innecesarios antes de comprimir</strong> — Incluye solo lo que el destinatario realmente necesita. Cada archivo adicional es exposición extra si algo sale mal.</li>
<li><strong>No uses almacenamiento en la nube para transferencias de una sola vez</strong> — Si alguien solo necesita los archivos una vez, un enlace autodestructivo es más seguro que un enlace persistente de Drive o Dropbox.</li>
<li><strong>Verifica a tu destinatario</strong> — Un enlace autodestructivo es tan seguro como el canal que usas para enviarlo. Envíalo a un contacto verificado.</li>
<li><strong>Revisa los requisitos de cumplimiento</strong> — Si tus archivos contienen datos de salud (HIPAA), datos personales (RGPD) o registros financieros, los enlaces cifrados autodestructivos ayudan a cumplir con los requisitos de minimización de datos.</li>
</ul>

<h2>Conclusión</h2>
<p>Los archivos ZIP concentran información sensible en un solo paquete, lo que hace que su manejo seguro sea más importante — no menos. Los ZIP protegidos con contraseña proporcionan una falsa sensación de seguridad, y los adjuntos de correo o enlaces en la nube dejan los archivos expuestos indefinidamente. Los enlaces cifrados y autodestructivos garantizan que tu archivo exista solo durante el momento en que se necesita y se destruya permanentemente después. La próxima vez que necesites enviar una entrega de proyecto, un paquete de documentos de RR. HH. o cualquier archivo ZIP sensible, omite el adjunto de correo y <a href="/">crea un enlace seguro de un solo uso</a>.</p>
`
  },
  "ooshare-cli-one-time-secrets-from-terminal": {
    title: "Automatiza secretos de un solo uso desde la terminal: presentamos la CLI de ooshare",
    description: "Crea y revela secretos de un solo uso desde la línea de comandos con la CLI de ooshare: el mismo cifrado AES-256-GCM de extremo a extremo que la web, gratis e instalable desde Homebrew, apt, dnf, winget, Scoop o Go. Incluye un ejemplo para GitHub Actions.",
    content: `
<p>Todos lo hemos hecho: un compañero te envía por DM una contraseña de base de datos, pegas un token de producción en un correo o alguien deja una API key en un canal compartido de Slack "solo por ahora". Cada uno de esos secretos ahora está en un log, una bandeja de entrada o un historial de chat: indexable, persistente y a una filtración de distancia de filtrarse. Automatizar la cesión de secretos es estrictamente mejor que copiar y pegar, y ahora puedes hacerlo sin salir de tu terminal.</p>

<h2>Conoce la CLI de ooshare</h2>
<p>La <a href="https://ooshare.io/cli">CLI de ooshare</a> es un binario estático único para macOS, Linux y Windows. No hay runtime que instalar ni servicio que configurar: descárgala, ejecútala y listo. Usa el cifrado AES-256-GCM idéntico y la derivación de clave HKDF-SHA-256 que la aplicación web, de modo que un secreto creado en la terminal se abre en el navegador y viceversa. La clave maestra viaja solo en el fragmento de la URL y nunca se envía al servidor, manteniendo todo el flujo de conocimiento cero. Es gratis, con licencia MIT y de código abierto.</p>

<h2>Instálala en segundos</h2>
<pre><code># macOS (Homebrew)
brew tap dhdtech/ooshare && brew trust dhdtech/ooshare && brew install ooshare

# Linux (apt)
echo "deb [signed-by=/usr/share/keyrings/ooshare.gpg] https://dhdtech.github.io/packages-ooshare/apt stable main" | sudo tee /etc/apt/sources.list.d/ooshare.list
sudo apt update && sudo apt install ooshare

# Linux (dnf)
sudo dnf install ooshare   # tras añadir el .repo (baseurl=https://dhdtech.github.io/packages-ooshare/rpm)

# Windows (winget)
winget install dhdtech.ooshare

# Windows (Scoop)
scoop bucket add ooshare https://github.com/dhdtech/scoop-ooshare && scoop install ooshare

# O en cualquier sitio con Go
go install github.com/dhdtech/ooshare.io/cli/cmd/ooshare@latest

# Verificar
ooshare version</code></pre>
<p>Instala vía Homebrew, apt, dnf, winget, Scoop o Go, sea cual sea tu estándar. Un rápido <code>ooshare version</code> confirma que el binario está en tu <code>PATH</code> y listo para usar.</p>

<h2>Tres comandos simples</h2>
<p>Una vez instalada, el uso diario es maravillosamente corto:</p>
<pre><code># Crea un secreto de un solo uso
ooshare create --text "hola"

# Revélalo (el enlace se consume tras una sola lectura)
ooshare view "https://ooshare.io/s/AbC123#..."

# Salida apta para máquinas
ooshare create --text "hola" --json | jq '.url'</code></pre>
<p><code>ooshare create</code> cifra tu secreto localmente, sube solo el texto cifrado e imprime un enlace. El enlace se autodestruye tras la primera vista exitosa. Con <code>--json</code>, la CLI emite una salida estructurada que puedes pasar a <code>jq</code> o a cualquier otra herramienta, lo que la hace trivial de integrar en un script.</p>

<h2>Scriptéalo en CI</h2>
<p>Uno de los mejores usos de una CLI de secretos de un solo uso es ceder secretos entre pasos de compilación — o a otra persona por completo. Aquí tienes un ejemplo real de GitHub Actions:</p>
<pre><code>jobs:
  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-go@v5
      - run: go install github.com/dhdtech/ooshare.io/cli/cmd/ooshare@latest

      # Paso uno: crea el secreto y captura la URL
      - id: share
        run: echo "url=$(ooshare create --json --text "$SECRET" | jq -r .url)" >> "$GITHUB_OUTPUT"
        env:
          SECRET: \${{ secrets.DEPLOY_TOKEN }}

      # ... más tarde, o en otro job por completo ...
      # Paso dos: revélalo, todavía en el servidor
      - run: ooshare view "\${{ steps.share.outputs.url }}"</code></pre>
<p>El secreto nunca toca los logs de tu workflow ni ningún artefacto intermedio. Ningún texto plano llega jamás al servidor, y el enlace es inútil en cuanto se lee. Esto convierte una frágil dependencia de copiar y pegar entre humanos en un apretón de manos limpio, auditable y de un solo uso.</p>

<h2>Las mismas garantías que la web</h2>
<p>Pasar a la terminal no debilita el modelo de seguridad. Cada secreto se cifra del lado del cliente con AES-256-GCM, la clave se deriva con HKDF-SHA-256 y la clave maestra vive solo en el fragmento de la URL. El servidor no almacena más que el texto cifrado y lo elimina atómicamente en la primera recuperación. Es exactamente la misma garantía de conocimiento cero que obtienes del sitio web, empaquetada como una herramienta que tus scripts pueden invocar.</p>

<h2>Empieza ahora</h2>
<p>La <a href="https://ooshare.io/cli">CLI de secretos de un solo uso</a> es gratis y de código abierto. Consulta la guía de instalación completa y los ejemplos en la página de la CLI, descarga las últimas compilaciones y notas de versión en <a href="https://github.com/dhdtech/ooshare.io/releases">GitHub Releases</a>, y empieza a automatizar tu cesión de secretos hoy mismo. Ya sea que necesites <a href="https://ooshare.io/blog/devops-secret-sharing-best-practices">compartir un secreto desde la terminal</a> o integrar una CLI de secretos de un solo uso en tu pipeline, tus secretos merecen algo mejor que un mensaje pegado.</p>
`
  }
};
