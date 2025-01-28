import { Provider, IAgentRuntime, Memory, elizaLogger } from "@elizaos/core";
import Mustache from "mustache";

export const notablePeopleProvider: Provider = {
  get: async (_runtime: IAgentRuntime, _message: Memory) => {
    try {
      elizaLogger.log("fetching notable people now...");

      const template = `
{{#response}}
----------------------
- {{twitter_id}}: {{about}}
----------------------
{{/response}}
            `;

      const response = await fetch(
        "https://jobs-api-xi-one.vercel.app/notable_people_on_base"
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      const output: string = Mustache.render(template, data);

      elizaLogger.log(`output is ${output}`);

      return `Here are the list of notable people on base:\n\n${output}`;
    } catch (e) {
      elizaLogger.error(`failed to info, err: ${e.message}`);
    }
  },
};
