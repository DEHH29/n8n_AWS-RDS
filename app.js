// ---------------------------------------------------------------
// URL de PRODUCCIÓN de tu Webhook de n8n
// ---------------------------------------------------------------
const N8N_WEBHOOK_URL = 'https://donaldoh630.app.n8n.cloud/webhook/procesa_calculo';

// Referencias a los elementos del DOM
const form = document.getElementById('calculo-form');
const input = document.getElementById('expresion');
const submitBtn = document.getElementById('submit-btn');
const resultadoDiv = document.getElementById('resultado-div');

// Listener para el envío del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Estado de carga
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';
    resultadoDiv.style.display = 'none';

    try {
        // A. Obtener IP pública del cliente
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();

        // B. Obtener Fecha y Hora del cliente (formato ISO)
        const clientTimestamp = new Date().toISOString();

        // C. Construir el payload para n8n
        const payload = {
            operacion_texto: input.value,
            ip_publica: ipData.ip,
            fecha_hora: clientTimestamp
        };

        // D. Llamar a nuestra API (el Webhook de n8n)
        const apiResponse = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            throw new Error(data.error || 'Error desconocido del servidor');
        }
        
        // E. Mostrar éxito (leyendo el JSON de n8n)
        resultadoDiv.className = 'alert alert-success';
        resultadoDiv.textContent = `Resultado: ${data.Resultado} (ID de registro: ${data.Id_registro})`;

    } catch (error) {
        // F. Mostrar error
        resultadoDiv.className = 'alert alert-danger';
        resultadoDiv.textContent = `Error: ${error.message}`;
    } finally {
        // G. Restaurar estado del botón
        resultadoDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Calcular y Guardar';
    }
});