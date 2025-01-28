import { Provider, IAgentRuntime, Memory, elizaLogger } from "@elizaos/core";
import Mustache from "mustache";

export const tutorialsProvider: Provider = {
  get: async (_runtime: IAgentRuntime, _message: Memory) => {
    try {
      elizaLogger.log("fetching base tutorails now...");

      const template = `
{{#response}}
----------------------
 - {{title}} : {{description}}; link: {{link}}
----------------------
{{/response}}
            `;

      const response = await fetch(
        "https://jobs-api-xi-one.vercel.app/base_tutorials"
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      const output: string = Mustache.render(template, data);

      elizaLogger.log(`output is ${output}`);

      return `Here are the list of tutorials on base:\n\n${output}`;
    } catch (e) {
      elizaLogger.error(`failed to get info, err: ${e.message}`);
    }
  },
};
