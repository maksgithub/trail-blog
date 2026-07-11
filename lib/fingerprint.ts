export function getFingerprint(): string {
  let fp = localStorage.getItem("visitor_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("visitor_fp", fp);
  }
  return fp;
}
