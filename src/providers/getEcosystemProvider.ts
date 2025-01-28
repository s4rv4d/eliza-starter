import { Provider, IAgentRuntime, Memory, elizaLogger } from "@elizaos/core";
import Mustache from "mustache";

export const appsProvider: Provider = {
  get: async (_runtime: IAgentRuntime, _message: Memory) => {
    try {
      elizaLogger.log("fetching ecosystem apps now...");

      const template = `
{{#response}}
---------
- {{title}}: {{description}}; link: {{href}}
-------------
{{/response}}
            `;

      const response = await fetch(
        "https://jobs-api-xi-one.vercel.app/ecosystem-apps"
      );

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      const output: string = Mustache.render(template, data);

      elizaLogger.log(`output is ${output}`);

      return `Here are the list of apps:\n\n${data}`;
    } catch (e) {
      elizaLogger.error(`failed to get info, err: ${e.message}`);
    }
  },
};
