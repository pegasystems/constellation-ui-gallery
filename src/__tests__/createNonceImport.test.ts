import fs from 'fs';
import path from 'path';

describe('Component index (ts/tsx) files include create-nonce import', () => {
  const componentsDir = path.resolve(__dirname, '../components');
  const EXPECTED_IMPORT_REGEX = /import\s+['"]\.\.\/shared\/create-nonce['"];?/;
  const EXPECTED_IMPORT_GLOBAL = new RegExp(EXPECTED_IMPORT_REGEX.source, 'g');

  // Gather all component folders except shared and test directories
  const componentFolders = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'shared' && !d.name.startsWith('__'))
    .map((d) => d.name);

  const missingImport: string[] = [];
  const withoutIndex: string[] = [];
  const multipleImport: string[] = [];

  componentFolders.forEach((folder) => {
    const indexTsx = path.join(componentsDir, folder, 'index.tsx');
    const indexTs = path.join(componentsDir, folder, 'index.ts');
    let indexPath: string | undefined;
    if (fs.existsSync(indexTsx)) indexPath = indexTsx;
    else if (fs.existsSync(indexTs)) indexPath = indexTs;
    else {
      withoutIndex.push(folder);
      return;
    }
    const content = fs.readFileSync(indexPath, 'utf8');
    const matches = content.match(EXPECTED_IMPORT_GLOBAL) || [];
    if (matches.length === 0) {
      missingImport.push(folder);
    } else if (matches.length > 1) {
      multipleImport.push(folder);
    }
  });

  it('every component has index.ts or index.tsx', () => {
    expect(withoutIndex).toHaveLength(0);
  });

  it("every component's index imports '../shared/create-nonce' exactly once", () => {
    if (missingImport.length) {
      console.error('Missing import in:', missingImport);
    }
    if (multipleImport.length) {
      console.error('Multiple imports found in:', multipleImport);
    }
    expect(missingImport).toHaveLength(0);
    expect(multipleImport).toHaveLength(0);
  });
});
