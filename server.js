const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Chemin vers le dossier out
let outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  outDir = path.join(__dirname, 'out');
}

console.log(`📁 Serveur les fichiers depuis: ${outDir}`);

// Servez les fichiers statiques
app.use(express.static(outDir));

// Route fallback pour les routes React
app.get('*', (req, res) => {
  const indexPath = path.join(outDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur port ${PORT}`);
  console.log(`📂 Fichiers servis depuis: ${outDir}`);
});
