export interface RouteContext<Params extends { [key: string]: string } = {}> {
  params: Params;
}
