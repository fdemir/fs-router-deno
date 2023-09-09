import { RouteContext } from "../../type.ts";

export default function handler({
  params,
}: RouteContext<{
  name: string;
}>) {
  return {
    content: `Heloo ${params.name}!`,
  };
}
