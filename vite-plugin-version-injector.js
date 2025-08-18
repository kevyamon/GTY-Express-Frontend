// vite-plugin-version-injector.js

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// On lit le fichier package.json de manière robuste pour obtenir la version
const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf-8'));

// Fonction pour exécuter une commande Git et gérer les erreurs
function getGitInfo(command) {
  try {
    return execSync(command).toString().trim();
  } catch (e) {
    console.warn(`Avertissement : Impossible d'exécuter la commande git. Utilisation de valeurs par défaut.`);
    // Retourne une valeur par défaut si git n'est pas disponible
    return command.includes('rev-parse') ? 'local' : new Date().toISOString();
  }
}

export default function versionInjector() {
  const manualVersion = pkg.version;
  const gitCommitHash = getGitInfo('git rev-parse --short HEAD');
  const commitDate = getGitInfo('git log -1 --format=%cI'); // Récupère la date du commit au format ISO 8601
  const fullVersion = `${manualVersion}-${gitCommitHash}`; // La version complète pour la détection

  return {
    name: 'version-injector',
    
    transformIndexHtml(html) {
      // On injecte toujours la version COMPLÈTE dans l'HTML pour une identification unique
      const metaTag = `<meta name="app-version" content="${fullVersion}">`;
      return html.replace('</head>', `  ${metaTag}\n</head>`);
    },
    
    closeBundle() {
      const distPath = path.resolve(process.cwd(), 'dist');
      if (!fs.existsSync(distPath)) fs.mkdirSync(distPath);
      
      // Le fichier meta.json contient maintenant toutes les infos nécessaires
      const meta = { 
        fullVersion: fullVersion,       // Pour la logique de détection
        version: manualVersion,         // Pour l'affichage utilisateur (renommé pour plus de clarté)
        commitDate: commitDate          // La date du commit
      };
      fs.writeFileSync(path.join(distPath, 'meta.json'), JSON.stringify(meta, null, 2));
      
      console.log(`\nVersion complète injectée : ${fullVersion}`);
    }
  };
}