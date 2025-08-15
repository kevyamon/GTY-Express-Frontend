// vite-plugin-version-injector.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export default function versionInjector() {
  return {
    name: 'version-injector',
    apply: 'build', // S'applique uniquement lors du build pour la production
    transformIndexHtml(html) {
      try {
        // 1. Lire la version depuis package.json
        const packageJsonPath = path.resolve(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const displayVersion = packageJson.version;

        // 2. Récupérer le hash du dernier commit Git
        const gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim();
        const fullVersion = `${displayVersion}-${gitCommitHash}`;
        
        // --- NOTRE AJOUT : CAPTURER LA DATE DE DÉPLOIEMENT ---
        const deployedAt = new Date().toISOString();
        // --- FIN DE L'AJOUT ---

        // 3. Créer le fichier meta.json avec TOUTES les informations
        const metaData = {
          displayVersion: displayVersion,
          fullVersion: fullVersion,
          deployedAt: deployedAt, // <-- On ajoute la date ici
        };
        
        const distPath = path.resolve(process.cwd(), 'dist');
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath, { recursive: true });
        }
        fs.writeFileSync(path.resolve(distPath, 'meta.json'), JSON.stringify(metaData));

        // 4. Injecter la version complète dans la balise meta de index.html
        return html.replace(
          '<head>',
          `<head>\n    <meta name="app-version" content="${fullVersion}">`
        );
      } catch (error) {
        console.error('Erreur dans le plugin versionInjector:', error);
        return html; // En cas d'erreur, on retourne le HTML original
      }
    },
  };
}