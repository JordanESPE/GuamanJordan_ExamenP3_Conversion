# GUÍA PASO A PASO DETALLADA: PROYECTO "CONVERSIONES & PROMEDIOS MÓVILES"

**Autor:** Jordan Guaman
**Objetivo:** Replicar el examen de CI/CD con GitHub Actions y Firebase Hosting - Versión Conversión de Temperaturas.

---

## 🛠️ PARTE 1: PREPARACIÓN DEL ENTORNO

### Paso 1.1: Crear la carpeta del proyecto

Abre tu terminal (PowerShell o CMD) y ejecuta estos comandos uno por uno:

```bash
cd "c:\Users\Jordan Guaman\OneDrive\Desktop\GuamanJordan_ExamenP3"
mkdir GuamanJordan_Conversion
cd GuamanJordan_Conversion
```

### Paso 1.2: Inicializar el proyecto Node.js

Ejecuta:

```bash
npm init -y
```

### Paso 1.3: Instalar dependencias

Ejecuta:

```bash
# Servidor web (opcional pero recomendado)
npm install express

# Herramientas de desarrollo (Testing y Calidad de Código)
npm install --save-dev jest eslint
```

### Paso 1.4: Crear archivo `.gitignore`

1. Crea un nuevo archivo llamado `.gitignore` en la raíz del proyecto.
2. Pega el siguiente contenido:

```text
node_modules/
.env
coverage/
.firebase/
.DS_Store
```

### Paso 1.5: Configurar `package.json`

1. Abre el archivo `package.json` que se creó automáticamente.
2. **Borra** la sección `"scripts"` actual.
3. **Pega** esta nueva sección `"scripts"` y la configuración de `"jest"`:

```json
  "scripts": {
    "start": "node src/index.js",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint ."
  },
  "jest": {
    "collectCoverage": true,
    "coverageThreshold": {
      "global": {
        "lines": 85,
        "branches": 85
      }
    }
  },
```

### Paso 1.6: Crear configuración de ESLint

1. Crea un nuevo archivo llamado `eslint.config.js` en la raíz.
2. Pega el siguiente código:

```javascript
module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
    },
};
```

---

## 🧠 PARTE 2: LÓGICA Y PRUEBAS (CI)

### Paso 2.1: Crear estructura de carpetas

Ejecuta en la terminal:

```bash
mkdir src
mkdir src\utils
mkdir src\test
```

### Paso 2.2: Crear el archivo `src/utils/conversion.js`

1. Navega a la carpeta `src/utils`.
2. Crea el archivo `conversion.js`.
3. Pega este código:

```javascript
function toCelsius(f) {
  if (typeof f !== 'number' || !Number.isFinite(f)) {
    throw new TypeError('El valor debe ser un número finito');
  }
  return Number(((f - 32) * 5 / 9).toFixed(1));
}

function toFahrenheit(c) {
  if (typeof c !== 'number' || !Number.isFinite(c)) {
    throw new TypeError('El valor debe ser un número finito');
  }
  return Number(((c * 9 / 5) + 32).toFixed(1));
}

function movingAverages(series, window) {
  if (!Array.isArray(series) || series.some(v => typeof v !=='number' || !Number.isFinite(v))) {
    throw new TypeError('Serie inválida, debe contener solo números finitos');
  }
  if (!Number.isInteger(window) || window < 2 || window > series.length) {
    throw new RangeError('Ventana fuera de rango');
  }

  const averages = [];
  for (let i = 0; i <= series.length - window; i++) {
    const slice = series.slice(i, i + window);
    const avg = slice.reduce((acc, val) => acc + val, 0) / window;
    averages.push(Number(avg.toFixed(2)));
  }
  return averages;
}

module.exports = { toCelsius, toFahrenheit, movingAverages };
```

**Explicación de las funciones:**

- **toCelsius(f)**: Convierte grados Fahrenheit a Celsius usando la fórmula: C = (F - 32) × 5/9
- **toFahrenheit(c)**: Convierte grados Celsius a Fahrenheit usando la fórmula: F = C × 9/5 + 32
- **movingAverages(series, window)**: Calcula promedios móviles de una serie numérica con una ventana deslizante

### Paso 2.3: Crear el archivo `src/index.js` (Punto de entrada)

1. Ve a la carpeta `src`.
2. Crea el archivo `index.js`.
3. Pega este código:

```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API de Conversiones y Promedios Móviles - Jordan Guaman');
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor escuchando en puerto ${port}`);
    });
}

module.exports = app;
```

### Paso 2.4: Crear Pruebas Unitarias

1. Ve a la carpeta `src/test`.
2. Crea el archivo `conversion.test.js` y pega:

```javascript
const { toCelsius, toFahrenheit, movingAverages } = require('../utils/conversion.js');

describe('Pruebas para funciones matemáticas', () => {
  test('Convertir Fahrenheit a Celsius', () => {
    expect(toCelsius(32)).toBe(0.0);
    expect(toCelsius(212)).toBe(100.0);
    expect(toCelsius(-40)).toBe(-40.0);
    expect(() => toCelsius('32')).toThrow(TypeError);
    expect(() => toCelsius(null)).toThrow(TypeError);
  });

  test('Convertir Celsius a Fahrenheit', () => {
    expect(toFahrenheit(0)).toBe(32.0);
    expect(toFahrenheit(100)).toBe(212.0);
    expect(toFahrenheit(-40)).toBe(-40.0);
    expect(() => toFahrenheit('0')).toThrow(TypeError);
    expect(() => toFahrenheit(null)).toThrow(TypeError);
  });

  test('Calcular promedios móviles', () => {
    const series = [10, 20, 30, 40];
    expect(movingAverages(series, 2)).toEqual([15.00, 25.00, 35.00]);

    const series1 = [1, 2, 3];
    expect(movingAverages(series1, 3)).toEqual([2.00]);

    expect(() => movingAverages('not an array', 3)).toThrow(TypeError);
    expect(() => movingAverages(series, 'not a number')).toThrow(RangeError);
    expect(() => movingAverages(series, 6)).toThrow(RangeError);
  });
});
```

### Paso 2.5: Verificar Pruebas Localmente

Ejecuta en la terminal para asegurar que todo está bien antes de subir:

```bash
npm run test:coverage
```

*Debes ver una tabla verde con % de cobertura > 85%.*

---

## 🌐 PARTE 3: PÁGINA WEB (CD)

### Paso 3.1: Crear carpeta pública

Ejecuta:

```bash
mkdir public
```

### Paso 3.2: Crear `public/index.html`

1. Dentro de la carpeta `public`.
2. Crea el archivo `index.html`.
3. Pega este código personalizando tus datos:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conversiones & Promedios Móviles — Jordan Guaman</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #333; padding: 40px; min-height: 100vh; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        h1 { color: #667eea; border-bottom: 3px solid #764ba2; padding-bottom: 15px; margin-bottom: 25px; font-size: 2rem; }
        h2 { color: #667eea; margin-top: 30px; margin-bottom: 15px; font-size: 1.5rem; }
        .info-section { background: linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 100%); border-left: 5px solid #667eea; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .info-section h2 { margin-top: 0; color: #5e35b1; font-size: 1.3rem; }
        .info-section p { margin: 10px 0; line-height: 1.6; }
        .converter { background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #e0e0e0; }
        .converter h3 { color: #667eea; margin-bottom: 15px; }
        .input-group { margin: 15px 0; }
        .input-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #555; }
        .input-group input { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; }
        .input-group input:focus { outline: none; border-color: #667eea; }
        button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; }
        button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
        button:active { transform: translateY(0); }
        .result { margin-top: 20px; padding: 15px; background: #e8f5e9; border-left: 5px solid #4caf50; border-radius: 8px; font-weight: 600; color: #2e7d32; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        th, td { border: 1px solid #e0e0e0; padding: 15px; text-align: left; }
        th { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        tr:hover { background-color: #f1f3f4; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 10px 0; padding-left: 30px; position: relative; }
        .feature-list li:before { content: "✓"; position: absolute; left: 0; color: #4caf50; font-weight: bold; font-size: 1.2rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌡️ Conversiones & Promedios Móviles</h1>
        
        <div class="info-section">
            <h2>📋 Datos del Estudiante</h2>
            <p><strong>Nombre:</strong> Jordan Guaman</p>
            <p><strong>NRC:</strong> 27854</p>
            <p><strong>Correo:</strong> jaguaman16@espe.edu.ec</p>
            <p><strong>Presentación:</strong> Estudiante de Ingeniería de Software especializado en CI/CD. Este proyecto demuestra la implementación de funciones de conversión de temperaturas y cálculo de promedios móviles con pruebas automatizadas, integración continua con GitHub Actions y despliegue automatizado en Firebase Hosting.</p>
        </div>

        <h2>🔧 Funcionalidades del Proyecto</h2>
        <ul class="feature-list">
            <li><strong>Conversión Fahrenheit a Celsius:</strong> Convierte temperaturas de °F a °C usando la fórmula C = (F - 32) × 5/9</li>
            <li><strong>Conversión Celsius a Fahrenheit:</strong> Convierte temperaturas de °C a °F usando la fórmula F = C × 9/5 + 32</li>
            <li><strong>Promedios Móviles:</strong> Calcula promedios móviles de series numéricas con ventana deslizante</li>
            <li><strong>Validaciones Completas:</strong> Incluye manejo robusto de errores (TypeError y RangeError)</li>
            <li><strong>Cobertura de Pruebas:</strong> >85% de cobertura en líneas y ramas</li>
        </ul>

        <div class="converter">
            <h3>🌡️ Conversor de Temperatura (Demo Interactiva)</h3>
            <div class="input-group">
                <label for="fahrenheit">Fahrenheit (°F):</label>
                <input type="number" id="fahrenheit" placeholder="Ej: 32" step="0.1">
            </div>
            <button onclick="convertToC()">Convertir a Celsius</button>
            <div id="resultC" class="result" style="display: none;"></div>

            <div class="input-group" style="margin-top: 25px;">
                <label for="celsius">Celsius (°C):</label>
                <input type="number" id="celsius" placeholder="Ej: 0" step="0.1">
            </div>
            <button onclick="convertToF()">Convertir a Fahrenheit</button>
            <div id="resultF" class="result" style="display: none;"></div>
        </div>

        <h2>📊 Ejemplos de Conversión</h2>
        <table>
            <thead>
                <tr>
                    <th>Fahrenheit (°F)</th>
                    <th>Celsius (°C)</th>
                    <th>Contexto</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>32.0</td>
                    <td>0.0</td>
                    <td>Punto de congelación del agua</td>
                </tr>
                <tr>
                    <td>212.0</td>
                    <td>100.0</td>
                    <td>Punto de ebullición del agua</td>
                </tr>
                <tr>
                    <td>98.6</td>
                    <td>37.0</td>
                    <td>Temperatura corporal normal</td>
                </tr>
                <tr>
                    <td>-40.0</td>
                    <td>-40.0</td>
                    <td>Punto de convergencia F=C</td>
                </tr>
                <tr>
                    <td>68.0</td>
                    <td>20.0</td>
                    <td>Temperatura ambiente típica</td>
                </tr>
            </tbody>
        </table>

        <h2>📈 Ejemplo de Promedios Móviles</h2>
        <div class="converter">
            <p><strong>Serie de entrada:</strong> [10, 20, 30, 40]</p>
            <p><strong>Ventana:</strong> 2</p>
            <p><strong>Resultado:</strong> [15.00, 25.00, 35.00]</p>
            <br>
            <p style="font-size: 0.9rem; color: #666;">
                <strong>Cálculo:</strong><br>
                • Promedio(10, 20) = 15.00<br>
                • Promedio(20, 30) = 25.00<br>
                • Promedio(30, 40) = 35.00
            </p>
        </div>

        <h2>🚀 Stack Tecnológico</h2>
        <table>
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Tecnología</th>
                    <th>Propósito</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Runtime</td>
                    <td>Node.js 18</td>
                    <td>Entorno de ejecución JavaScript</td>
                </tr>
                <tr>
                    <td>Testing</td>
                    <td>Jest</td>
                    <td>Framework de pruebas unitarias</td>
                </tr>
                <tr>
                    <td>Linter</td>
                    <td>ESLint</td>
                    <td>Análisis estático de código</td>
                </tr>
                <tr>
                    <td>CI/CD</td>
                    <td>GitHub Actions</td>
                    <td>Integración y despliegue continuo</td>
                </tr>
                <tr>
                    <td>Hosting</td>
                    <td>Firebase Hosting</td>
                    <td>Despliegue de aplicación web</td>
                </tr>
            </tbody>
        </table>
    </div>

    <script>
        function toCelsius(f) {
            return Number(((f - 32) * 5 / 9).toFixed(1));
        }

        function toFahrenheit(c) {
            return Number(((c * 9 / 5) + 32).toFixed(1));
        }

        function convertToC() {
            const f = parseFloat(document.getElementById('fahrenheit').value);
            const resultDiv = document.getElementById('resultC');
            
            if (isNaN(f) || !isFinite(f)) {
                resultDiv.style.display = 'block';
                resultDiv.style.background = '#ffebee';
                resultDiv.style.borderLeftColor = '#f44336';
                resultDiv.style.color = '#c62828';
                resultDiv.textContent = '❌ Error: Ingresa un número válido';
                return;
            }
            
            const c = toCelsius(f);
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#e8f5e9';
            resultDiv.style.borderLeftColor = '#4caf50';
            resultDiv.style.color = '#2e7d32';
            resultDiv.textContent = `✅ Resultado: ${f}°F = ${c}°C`;
        }

        function convertToF() {
            const c = parseFloat(document.getElementById('celsius').value);
            const resultDiv = document.getElementById('resultF');
            
            if (isNaN(c) || !isFinite(c)) {
                resultDiv.style.display = 'block';
                resultDiv.style.background = '#ffebee';
                resultDiv.style.borderLeftColor = '#f44336';
                resultDiv.style.color = '#c62828';
                resultDiv.textContent = '❌ Error: Ingresa un número válido';
                return;
            }
            
            const f = toFahrenheit(c);
            resultDiv.style.display = 'block';
            resultDiv.style.background = '#e8f5e9';
            resultDiv.style.borderLeftColor = '#4caf50';
            resultDiv.style.color = '#2e7d32';
            resultDiv.textContent = `✅ Resultado: ${c}°C = ${f}°F`;
        }

        // Permitir conversión con Enter
        document.getElementById('fahrenheit').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') convertToC();
        });
        
        document.getElementById('celsius').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') convertToF();
        });
    </script>
</body>
</html>
```

---

## 🚀 PARTE 4: GIT E INTEGRACIÓN CONTINUA (CI)

### Paso 4.1: Inicializar Git

Ejecuta:

```bash
git init
git add .
git commit -m "Commit inicial - Proyecto Conversiones"
git branch -M main
```

### Paso 4.2: Crear el Workflow de CI

1. Crea la carpeta `.github` en la raíz.
2. Dentro de `.github`, crea la carpeta `workflows`.
3. Dentro de `workflows`, crea el archivo `ci.yml`.
4. Pega este código:

```yaml
name: CI Workflow

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run Lint
      run: npm run lint
      
    - name: Run Tests with Coverage
      run: npm run test:coverage
```

### Paso 4.3: Conectar y Subir a GitHub

1. Crea un **repositorio vacío** en tu cuenta de GitHub llamado `GuamanJordan_Conversion`.
2. Copia la URL del repositorio (HTTPS).
3. Ejecuta en tu terminal (reemplaza TU_USUARIO):

```bash
git remote add origin https://github.com/TU_USUARIO/GuamanJordan_Conversion.git
git push -u origin main
```

---

## 🔥 PARTE 5: DESPLIEGUE EN FIREBASE (CD)

### Paso 5.1: Instalar herramientas de Firebase

Si no las tienes, ejecuta:

```bash
npm install -g firebase-tools
```

### Paso 5.2: Iniciar sesión y el proyecto

1. `firebase login` (Inicia sesión con tu cuenta de Google).
2. `firebase init hosting`

**Responde a las preguntas EXACTAMENTE así:**

* **Are you ready to proceed?** -> `y`
* **Please select an option:** -> `Use an existing project` (sugerido: crea uno en la web de Firebase Console antes) O `Create a new project` (crealo desde la terminal).
* **What do you want to use as your public directory?** -> `public`
* **Configure as a single-page app (rewrite all urls to /index.html)?** -> `N`
* **Set up automatic builds and deploys with GitHub?** -> `y`

### Paso 5.3: Configurar GitHub Actions con Firebase

Al decir `y` a la última pregunta anterior, te pedirá loguearte en GitHub desde el navegador.

* **For which GitHub repository would you like to set up a GitHub workflow?** -> `TU_USUARIO/GuamanJordan_Conversion`
* **Set up the workflow to run a build script before every deploy?** -> `N` (Ya que es HTML estático).
* **Set up automatic deployment to your site's live channel when a PR is merged?** -> `y`
* **What is the name of the GitHub branch associated with your site's live channel?** -> `main`

---

## 📸 PARTE 6: OBTENCIÓN DE EVIDENCIAS (RÚBRICA)

Sigue estos pasos EXACTOS en orden para obtener todos los puntos del examen.

### 📋 RÚBRICA COMPLETA

✅ **Captura del PR con CI** (2 puntos)
✅ **Capturas de error en el Lint y en las pruebas** (1 punto)
✅ **Capturas del run de CI** (2 puntos)
✅ **Captura del deploy Live** (2 puntos)

**Total: 7 puntos**

---

### 📸 EVIDENCIA 1: Error intencional en Lint o Pruebas (1 punto)

**Objetivo:** Demostrar que el CI detecta errores de sintaxis o pruebas fallidas.

**1. Provocar el error:**

1. Abre el archivo `src/utils/conversion.js`.
2. Ve a la función `toCelsius` (línea 1).
3. **Borra** la última llave `}` de cierre de la función (alrededor de la línea 5).
4. Guarda el archivo (`Ctrl + S`).
5. Ejecuta en la terminal:

   ```bash
   git add .
   git commit -m "Provocando error de sintaxis para evidencia"
   git push
   ```

**2. Sacar la CAPTURA DEL ERROR:**

1. Ve a tu repositorio en GitHub.
2. Haz clic en la pestaña **Actions**.
3. Verás una ejecución con una **X Roja** ❌ (probablemente diga "CI Workflow").
4. Haz clic en ella.
5. Haz clic en el trabajo `build-and-test` (a la izquierda).
6. Despliega el paso que falló (probablemente `Run Lint` o `Run Tests`).
7. **📸 TOMA LA CAPTURA 1:** Donde se vea claramente:
   - El nombre del workflow en rojo
   - El paso específico que falló
   - El mensaje de error en la consola

**3. Arreglar el error:**

1. Vuelve al archivo `src/utils/conversion.js`.
2. **Escribe de nuevo** la llave `}` que borraste.
3. Guarda el archivo (`Ctrl + S`).
4. Ejecuta en la terminal:

   ```bash
   git add .
   git commit -m "Corrigiendo error de sintaxis"
   git push
   ```

---

### 📸 EVIDENCIA 2: Run de CI exitoso (2 puntos)

**1. Sacar la CAPTURA DEL ÉXITO:**

1. Ve de nuevo a la pestaña **Actions** en GitHub.
2. Espera a que la nueva ejecución termine con un **Check Verde** ✅.
3. Haz clic en esa ejecución verde.
4. Haz clic en el trabajo `build-and-test` (a la izquierda).
5. Despliega los pasos importantes:
   - `Run Lint` (debe mostrar "✓" o mensaje de éxito)
   - `Run Tests with Coverage` (debe mostrar tabla de cobertura)
6. **📸 TOMA LA CAPTURA 2:** Donde se vea:
   - El **Check Verde** general ✅
   - Los pasos completados exitosamente
   - La **tabla de Coverage** mostrando >85% en lines y branches
   - Opcionalmente, el mensaje "All checks passed"

---

### 📸 EVIDENCIA 3: Pull Request con CI (2 puntos)

**Objetivo:** Demostrar que el CI se ejecuta en Pull Requests y Firebase genera preview.

**1. Crear una rama y hacer cambios:**

1. En la terminal, crea una nueva rama:

   ```bash
   git checkout -b actualizar-titulo
   ```

2. Abre el archivo `public/index.html`.
3. Busca la etiqueta `<h1>` (línea ~22) y cámbiala:
   * De: `<h1>🌡️ Conversiones & Promedios Móviles</h1>`
   * A: `<h1>🌡️ Conversiones & Promedios Móviles - ACTUALIZADO</h1>`
4. Guarda el archivo.
5. Sube los cambios a la nueva rama:

   ```bash
   git add .
   git commit -m "Actualizar título de la página"
   git push origin actualizar-titulo
   ```

**2. Crear el Pull Request:**

1. Ve a la página principal de tu repositorio en GitHub.
2. Verás un botón amarillo/verde que dice **"Compare & pull request"**. Haz clic ahí.
3. Escribe un título como "Actualización de título en página web".
4. Haz clic en el botón verde **"Create pull request"**.

**3. Esperar y Capturar:**

1. En la pantalla del Pull Request, espera unos segundos (o minutos).
2. Se ejecutarán varias "checks" abajo.
3. Espera hasta que todas estén en **Verde** ✅.
4. Busca un comentario automático del bot `github-actions` (o Firebase Bot) que dice **"Deploy preview ready!"** o similar y muestra un link azul al preview.
5. **📸 TOMA LA CAPTURA 3:** Debe verse:
   - El título del Pull Request
   - El check verde "All checks have passed" o similar
   - El comentario automático con el link de "Deploy preview"
   - Los checks individuales (CI Workflow, Firebase Hosting preview)

---

### 📸 EVIDENCIA 4: Deploy Live en Producción (2 puntos)

**Objetivo:** Demostrar que el merge a main despliega automáticamente a producción.

**1. Hacer Merge:**

1. En la misma pantalla del Pull Request anterior (donde sacaste la captura 3).
2. Haz clic en el botón verde **"Merge pull request"**.
3. Haz clic en **"Confirm merge"**.
4. Opcionalmente, puedes eliminar la rama `actualizar-titulo`.

**2. Verificar Deploy:**

1. Ve a la pestaña **Actions**.
2. Verás que se ejecuta un nuevo workflow llamado algo como:
   - `Deploy to Firebase Hosting on merge`
   - `CI Workflow` (ejecutándose en la rama main)
3. Espera a que termine y se ponga en **Verde** ✅.

**3. Ver la página y Capturar:**

1. Abre una nueva pestaña en tu navegador.
2. Escribe la URL de tu proyecto Firebase (ej: `https://guamanjordan-conversion.web.app` o la que te haya dado Firebase).
3. Verifica que el título `<h1>` diga "🌡️ Conversiones & Promedios Móviles - ACTUALIZADO".
4. Prueba los convertidores interactivos:
   - Ingresa 32 en Fahrenheit y verifica que convierte a 0°C
   - Ingresa 100 en Celsius y verifica que convierte a 212°F
5. **📸 TOMA LA CAPTURA 4:** Captura toda la pantalla del navegador mostrando:
   - La URL correcta en la barra de direcciones (tu dominio de Firebase)
   - La página web completamente cargada
   - El título actualizado visible
   - Preferiblemente con algún conversor funcionando (mostrando un resultado)

---

## ✅ CHECKLIST FINAL ANTES DE ENTREGAR

Verifica que tienes las 4 capturas requeridas:

- [ ] **Captura 1:** Error en CI (X roja) con mensaje de fallo visible (1 punto)
- [ ] **Captura 2:** CI exitoso (✓ verde) con tabla de coverage >85% (2 puntos)
- [ ] **Captura 3:** Pull Request con checks verdes y link de preview (2 puntos)
- [ ] **Captura 4:** Página web desplegada en Firebase con URL y contenido visible (2 puntos)

### Formato de Entrega

Crea un documento PDF con:

1. **Portada** con tu nombre, NRC y título del proyecto
2. **Captura 1** con descripción breve
3. **Captura 2** con descripción breve
4. **Captura 3** con descripción breve
5. **Captura 4** con descripción breve
6. **URLs importantes:**
   - Repositorio GitHub: `https://github.com/TU_USUARIO/GuamanJordan_Conversion`
   - Sitio desplegado: `https://tu-proyecto.web.app`

---

## 🎯 CONCEPTOS CLAVE DEL PROYECTO

### CI/CD Pipeline
- **Continuous Integration (CI):** Automatización de pruebas y lint en cada push/PR
- **Continuous Deployment (CD):** Despliegue automático a Firebase en cada merge a main

### Cobertura de Código
- **Lines:** Porcentaje de líneas de código ejecutadas en las pruebas
- **Branches:** Porcentaje de ramificaciones (if/else) probadas
- **Threshold:** Umbral mínimo del 85% configurado en Jest

### Validaciones Implementadas
- **TypeError:** Para entradas no numéricas o no finitas
- **RangeError:** Para ventanas fuera de rango en promedios móviles
- **Precisión:** .toFixed(1) para conversiones, .toFixed(2) para promedios

---

**¡FELICIDADES! HAS TERMINADO EL EXAMEN DE CONVERSIONES.**

Asegúrate de poner estas 4 capturas en tu documento PDF y las URLs de tu repositorio y sitio desplegado.

**Última revisión:** 10 de Febrero de 2026
**Autor:** Jordan Guaman
