import { glob } from "./glob.ts";
import { RouteContext } from "./type.ts";
import { paramsToObject } from "./utils.ts";

const manifest = new Map<string, string>();

const files = glob("pages", { match: [".ts"] });

for (const file of files) {
  const isRoot = file === "pages/index.ts";

  const path = isRoot ? "/" : file.replace("pages", "").replace(".ts", "");

  manifest.set(path, file);
}

const server = Deno.listen({ port: 8080 });

const handler = async (conn: Deno.Conn) => {
  const httpConn = Deno.serveHttp(conn);

  for await (const requestEvent of httpConn) {
    const { respondWith } = requestEvent;

    const { pathname, searchParams } = new URL(requestEvent.request.url);

    const file = manifest.get(pathname);

    if (file) {
      const { default: Route } = await import(`./${file}`);

      const ctx: RouteContext = {
        params: paramsToObject(Array.from(searchParams.entries())),
      };

      const response = Route(ctx);

      respondWith(
        new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    }
  }
};

for await (const conn of server) {
  handler(conn);
}
