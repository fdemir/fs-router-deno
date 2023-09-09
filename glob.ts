interface Options {
  match?: string[];
  ignore?: string[];
}

export const glob = (dir: string, options: Options) => {
  const files = Deno.readDirSync(dir);

  let paths: string[] = [];

  for (const file of files) {
    if (options.ignore?.includes(file.name)) {
      continue;
    }

    if (options.match && !file.isDirectory) {
      const match = options.match.some((m) => file.name.endsWith(m));

      if (!match) {
        continue;
      }
    }

    if (file.isDirectory) {
      paths = paths.concat(glob(`${dir}/${file.name}`, options));
    } else {
      paths.push(`${dir}/${file.name}`);
    }
  }

  return paths;
};
