import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs'; // On importe les modules 'fs' pour écrire un fichier
import path from 'path'; // On importe 'path' pour gérer les chemins de fichiers
import packageJson from './package.json';

// La fonction pour récupérer les infos Git reste la même
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
  const commitDate = getGitInfo('git log -1 --format=%cI'); 

  return {
    name: 'vite-plugin-version-injector',

    // Ce hook se lance juste avant le début de la construction du site
    buildStart() {
      // --- C'EST LA NOUVELLE PARTIE IMPORTANTE ---
      const versionInfo = {
        version,
        commitHash,
        commitDate,
      };

      // On s'assure que le dossier 'public' existe
      const publicDir = path.resolve(process.cwd(), 'public');
      if (!existsSync(publicDir)) {
        mkdirSync(publicDir);
      }
      
      // On écrit les informations dans un nouveau fichier : public/version.json
      writeFileSync(
        path.join(publicDir, 'version.json'),
        JSON.stringify(versionInfo, null, 2)
      );

      console.log(`✅ Fichier version.json généré avec la version : ${version} (${commitHash})`);
      // --- FIN DE LA NOUVELLE PARTIE ---
    },

    // Le reste de la configuration ne change pas, il injecte toujours les variables
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