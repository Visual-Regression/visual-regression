import fs from 'fs';
import path from 'path';

const DEFAULT_IGNORE: readonly string[] = ['node_modules', '.git'];

/** Every file below `dir` (absolute paths, sorted), never descending into `ignore`d directory names. Missing `dir` yields nothing. */
export const listFiles = (
  dir: string,
  ignore: readonly string[] = DEFAULT_IGNORE,
): string[] => {
  const found: string[] = [];
  const walk = (current: string) => {
    let dirents: fs.Dirent[];
    try {
      dirents = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const dirent of dirents) {
      const full = path.join(current, dirent.name);
      if (dirent.isDirectory()) {
        if (!ignore.includes(dirent.name)) walk(full);
      } else if (dirent.isFile()) {
        found.push(full);
      }
    }
  };
  walk(path.resolve(dir));
  return found.sort();
};

/** `home.png` -> `home`; keeps everything before the last extension. */
export const stemOf = (file: string) => path.basename(file, path.extname(file));

export const isImage = (file: string) => /\.(png|jpe?g|webp)$/i.test(file);
