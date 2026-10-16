/**
 * Hands a run generated in the browser (chapter 5's artifact demo) to the
 * viewer page, so "Open in the viewer" shows it without a download. Plain
 * module state: `File` objects do not survive serialisation, and the hand-off
 * only happens on client-side navigation anyway.
 */
export interface DemoRunFile {
  path: string;
  file: File;
}

let pending: DemoRunFile[] | null = null;

export const useDemoRun = () => ({
  set(files: DemoRunFile[]) {
    pending = files;
  },
  /** Returns the pending run once and clears it. */
  take(): DemoRunFile[] | null {
    const files = pending;
    pending = null;
    return files;
  },
});
