import { Provider, IAgentRuntime, Memory, elizaLogger } from "@elizaos/core";

import Mustache from "mustache";

interface Content {
  key: string;
  value: string;
}

interface Chunk {
  content: Content[];
}

interface Response {
  response: {
    chunks: Chunk[];
  };
  status: number;
}

export const baseCDPProvider: Provider = {
  get: async (_runtime: IAgentRuntime, _message: Memory) => {
    try {
      elizaLogger.log("fetching cdp docs now...");

      const template = `
            {{#response.chunks}}
            {{#content}}
                {{key}}: {{value}}
            {{/content}}
            {{/response.chunks}}
            `;

      const response = await fetch(
        "https://jobs-api-xi-one.vercel.app/cdp-docs"
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data: Response = await response.json();

      const output: string = Mustache.render(template, data);

      // elizaLogger.log(`output is ${output}`);

      return `Here is the cdp documentation:\n\n${data}`;
    } catch (e) {
      elizaLogger.error(`failed to cdp docs, err: ${e.message}`);
    }
  },
};
