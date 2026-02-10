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