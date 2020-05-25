import packageJson from "../../package.json";

export function getCurrentVersion(): string {
  return packageJson.version;
}

export function isCurrentVersionHigherThan(version: string): boolean {
  const [major, minor, patch] = version.split(".").map((el) => parseInt(el));
  const [currentMajor, currentMinor, currentPatch] = getCurrentVersion()
    .split(".")
    .map((el) => parseInt(el));

  return (
    currentMajor > major ||
    (currentMajor === major && currentMinor > minor) ||
    (currentMajor === major && currentMinor === minor && currentPatch > patch)
  );
}
