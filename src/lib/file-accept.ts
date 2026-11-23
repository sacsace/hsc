/** Check whether a File matches an HTML accept attribute value. */
export function fileMatchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept || accept.trim() === "*" || accept.trim() === "*/*") return true;
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (!tokens.length) return true;

  const mime = (file.type || "").toLowerCase();
  const name = file.name.toLowerCase();
  const ext = name.includes(".") ? `.${name.split(".").pop()}` : "";

  return tokens.some((token) => {
    if (token.endsWith("/*")) {
      const prefix = token.slice(0, -1);
      return Boolean(mime) && mime.startsWith(prefix);
    }
    if (token.startsWith(".")) {
      return ext === token || name.endsWith(token);
    }
    if (token.includes("/")) {
      return mime === token;
    }
    return ext === `.${token}` || name.endsWith(`.${token}`);
  });
}

export const UPLOAD_NOT_ALLOWED_MESSAGE = "업로드할 수 없습니다.";
