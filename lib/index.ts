import { Command, flags } from "@oclif/command";
import path from "path";
import { promisify } from "util";
import jsonfile from "jsonfile";

import { prismixer, MixerOptions } from "./prismixer";

const readJsonFile = promisify(jsonfile.readFile);

class Prismixer extends Command {
  static description = "Allows you to have multiple Prisma schema files";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
  };

  async run() {
    this.log(`Prismixer: mixing your schemas...`);

    const options: MixerOptions = (await readJsonFile(
      path.join(process.cwd(), "prismixer.config.json")
    )) as MixerOptions;

    if (!options.output) options.output = "prisma/schema.prisma";

    await prismixer(options);
  }
}

export = Prismixer;
