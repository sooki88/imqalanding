// app/queries/upload-and-create-client-logo.ts
export type UploadAndCreateClientLogoParams = {
  file: File;
  name?: string | null;
  alt: string;
  sortOrder: number;
};

export async function uploadAndCreateClientLogo(
  _client: any,
  { file, name, alt, sortOrder }: UploadAndCreateClientLogoParams,
) {
  const form = new FormData();
  form.append("file", file);
  form.append("alt", alt);
  form.append("sortOrder", String(sortOrder));
  if (name !== undefined && name !== null) form.append("name", name);

  const res = await fetch("/api/admin/client-logos", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to upload logo");
  }

  return res.json();
}
