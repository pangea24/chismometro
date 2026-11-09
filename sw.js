// Chismómetro: recibe el chat que se comparte desde WhatsApp («Exportar chat» → Chismómetro).
// El archivo se deja un momento en la caché del propio móvil, la página lo lee y lo borra. No sale del teléfono.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "POST" || !url.pathname.endsWith("/compartir")) return;
  e.respondWith((async () => {
    try {
      const datos = await e.request.formData();
      const f = datos.getAll("chat").find(x => x && typeof x !== "string");
      if (f) {
        const c = await caches.open("compartido");
        await c.put("chat", new Response(f, { headers: { "x-nombre": encodeURIComponent(f.name || "chat.txt") } }));
      }
    } catch (err) {}
    return Response.redirect(new URL("./?compartido=1", self.registration.scope).href, 303);
  })());
});
