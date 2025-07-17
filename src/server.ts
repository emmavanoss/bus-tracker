const PORT = 3000;

console.log(`Server running on port ${PORT}`);

Bun.serve({
    port: PORT,
    routes: {
        "/": new Response("OK")
    }
});