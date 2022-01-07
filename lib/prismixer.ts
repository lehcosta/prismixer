import fs from "fs";
import path from "path";
import glob from "glob";
import { promisify } from "util";
import { printSchema, getSchema, Schema, Block } from "@mrleebo/prisma-ast";
import { uniqWith, uniqBy, isEqual } from "lodash";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export interface MixerOptions {
  input: string[];
  output: string;
}

export async function prismixer(options: MixerOptions) {
  let schemas: Schema[] = [
    {
      type: "schema",
      list: [],
    },
  ];

  for (const input of options.input) {
    for (const file of glob.sync(input)) {
      const schema = await readFile(file, { encoding: "utf-8" });
      const blocks = getSchema(schema);
      schemas[0].list = [...schemas[0].list, ...blocks.list];
    }
  }

  // if the model already exists in our found models, merge the fields
  schemas[0].list = schemas[0].list.reduce((acc, current: any) => {
    const x = acc.find((item) => item.type === "model" && item.name === current.name);
    if (!x) {
      const newCurr = {
        ...current,
      };
      return [...acc, newCurr];
    } else {
      if (x.type === "model" && x.properties) {
        // Merge model properties and remove duplicate properties
        x.properties = uniqBy([...current.properties, ...x.properties], "name");
      }
      return acc;
    }
  }, [] as Block[]);

  // Order schema by priority
  const sortGuide = ["datasource", "generator", "enum", "model"];
  schemas[0].list = schemas[0].list.sort((it1, it2) => {
    return sortGuide.indexOf(it1.type) - sortGuide.indexOf(it2.type);
  });
  schemas[0].list = schemas[0].list.filter((item) => item.type !== "break");

  // remove duplicated elements
  schemas[0].list = uniqWith(schemas[0].list, isEqual);

  let output = `
    ${schemas.map((schema) => printSchema(schema)).join("")}
  `;

  await writeFile(path.join(process.cwd(), options.output), output);
}
