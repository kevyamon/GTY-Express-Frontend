import { execSync } from 'child_process';
import packageJson from './package.json';

// Fonction pour exécuter une commande et retourner le résultat nettoyé
function getGitInfo(command) {
  try {
    return execSync(command).toString().trim();
  } catch (e) {
    console.error(`Erreur lors de l'exécution de la commande git : ${command}`, e);
    return 'N/A';
  }
}

export default function versionInjector() {
  const version = packageJson.version;
  const commitHash = getGitInfo('git rev-parse --short HEAD');
  // Nouvelle commande pour récupérer la date du commit au format ISO 8601
  const commitDate = getGitInfo('git log -1 --format=%cI'); 

  return {
    name: 'vite-plugin-version-injector',

    // Hook qui se lance au démarrage du build
    buildStart() {
      // Affiche le message dans la console de déploiement
      console.log(`✅ Version injectée : ${version} (${commitHash})`);
    },

    // Hook pour transformer le fichier index.html
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `  <meta name="version" content="${version}" />
          <meta name="commit-hash" content="${commitHash}" />
          <meta name="commit-date" content="${commitDate}" />
        </head>`
      );
    },

    // On s'assure que les variables sont aussi disponibles dans l'app
    config() {
      return {
        define: {
          'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
          'import.meta.env.VITE_COMMIT_HASH': JSON.stringify(commitHash),
          'import.meta.env.VITE_COMMIT_DATE': JSON.stringify(commitDate),
        },
      };
    },
  };
}