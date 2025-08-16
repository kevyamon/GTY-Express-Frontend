import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import packageJson from './package.json';

// Fonction robuste pour récupérer les informations Git
function getGitInfo(command) {
  try {
    // Exécute la commande Git et nettoie le résultat
    return execSync(command).toString().trim();
  } catch (e) {
    console.error(`Erreur lors de l'exécution de la commande git : ${command}`, e);
    // Retourne 'N/A' si la commande échoue (ex: pas dans un dépôt git)
    return 'N/A';
  }
}

export default function versionInjector() {
  // Récupère les informations une seule fois au démarrage
  const version = packageJson.version;
  const commitHash = getGitInfo('git rev-parse --short HEAD');
  const commitDate = getGitInfo('git log -1 --format=%cI'); // Date au format ISO 8601

  return {
    name: 'vite-plugin-version-injector',

    // Ce hook s'exécute au tout début du processus de build
    buildStart() {
      // Prépare les informations qui seront écrites dans le fichier JSON
      const versionInfo = {
        version,
        commitHash,
        commitDate,
      };

      // S'assure que le dossier 'public' existe avant d'y écrire
      const publicDir = path.resolve(process.cwd(), 'public');
      if (!existsSync(publicDir)) {
        mkdirSync(publicDir);
      }
      
      // Écrit les informations dans public/version.json
      // Ce fichier sera interrogé par l'application pour détecter les mises à jour
      writeFileSync(
        path.join(publicDir, 'version.json'),
        JSON.stringify(versionInfo, null, 2)
      );

      console.log(`✅ Fichier version.json généré : v${version} (${commitHash})`);
    },

    // Ce hook modifie le fichier index.html à la volée
    transformIndexHtml(html) {
      // Crée la balise meta qui stockera la version actuelle de l'application
      const metaTag = `<meta name="app-version" content="${commitHash}">`;
      
      // Insère la balise juste avant la fin de la balise </head>
      return html.replace('</head>', `  ${metaTag}\n</head>`);
    },
  };
}