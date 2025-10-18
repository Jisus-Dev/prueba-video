// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {

    // --- PARTE 1: INICIALIZAR H5P ---

    const el = document.getElementById('h5p-container');
    
    // Opciones para el reproductor
    const options = {
        // OBLIGATORIO: Ruta a la carpeta que descomprimiste
        // Asegúrate que 'actividad-h5p' coincide con el nombre de tu carpeta
        h5pJsonPath: 'video2', 
        
        // Rutas a los archivos del reproductor (del CDN)
        frameJs: 'https://cdn.jsdelivr.net/npm/h5p-standalone@3.5.0/dist/frame.bundle.js',
        frameCss: 'https://cdn.jsdelivr.net/npm/h5p-standalone@3.5.0/dist/styles/h5p.css'
    };

    // Inicializa el reproductor H5P
    new H5PStandalone.H5P(el, options);


    // --- PARTE 2: ESCUCHAR LOS RESULTADOS (LA "API") ---

    // H5P.externalDispatcher es el objeto API global
    if (window.H5P && window.H5P.externalDispatcher) {
    
    console.log("H5P API lista. Escuchando eventos...");

    H5P.externalDispatcher.on('xAPI', function (event) {
        
        // Muestra todos los eventos (déjalo así por ahora)
        console.log('Evento xAPI:', event.data.statement); 

        // 1. Verificamos si el evento tiene un objeto 'result'
        const result = event.data.statement.result;

        // 2. Si tiene 'result', verificamos si es un evento de finalización
        //    Esta es la forma MÁS ROBUSTA de hacerlo.
        if (result && result.completion === true) {
            
            // ¡El alumno terminó la actividad!
            const score = result.score.scaled; // Puntaje de 0 a 1 (ej: 0.8)
            const rawScore = result.score.raw;    // Puntaje bruto (ej: 8)
            const maxScore = result.score.max;    // Puntaje máx (ej: 10)

            // Muestra los resultados en la consola
            console.log('¡ACTIVIDAD COMPLETADA!');
            console.log(`Puntaje: ${rawScore} / ${maxScore}`);
            console.log(`Porcentaje: ${score * 100}%`);

            // AQUÍ llamas a tu propia función para guardar en tu backend
            guardarResultadosEnMiBackend(rawScore, maxScore);
        }
    });
}

});

// Función de ejemplo que tu app usaría
function guardarResultadosEnMiBackend(puntaje, maximo) {
    console.log(`Enviando a mi servidor: ${puntaje} de ${maximo}`);
    // fetch('/api/guardar', { ... })
}