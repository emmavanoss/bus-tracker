const PORT = 3000;

console.log(`Server running on port ${PORT}`);

export const runServer = () =>
  Bun.serve({
    port: PORT,
    routes: {
      "/": new Response("OK"),
    },
  });
