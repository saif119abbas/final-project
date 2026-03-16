export async function deliverToSubscribers(
  subscriberUrls: string[],
  body: unknown,
): Promise<{ failed: { url: string; error: string }[] }> {
  const failed: { url: string; error: string }[] = [];

  await Promise.all(
    subscriberUrls.map(async (url) => {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          failed.push({
            url,
            error: `HTTP ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`,
          });
        }
      } catch (err) {
        failed.push({
          url,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }),
  );

  return { failed };
}

