export type DeleteClientLogoParams = {
  id: number;
  imagePath: string;
};

export async function deleteClientLogo(
  _client: any,
  params: DeleteClientLogoParams,
) {
  const res = await fetch("/api/admin/client-logos", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete logo");
  }

  return res.json();
}
