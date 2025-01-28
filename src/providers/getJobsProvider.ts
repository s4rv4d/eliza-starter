import { Provider, IAgentRuntime, Memory, elizaLogger } from "@elizaos/core";

export const jobsProvider: Provider = {
  get: async (_runtime: IAgentRuntime, _message: Memory) => {
    try {
      elizaLogger.log("fetching jobs now...");

      // response
      const response = await fetch("https://jobs-api-xi-one.vercel.app/jobs");

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      const jobs = data.response?.jobs;

      if (!jobs || jobs.length === 0) {
        return "No job openings are currently available in Base.";
      }

      // Format the job listings into a readable message
      const jobList = jobs
        .map((job: any, index: number) => {
          const title = job.message?.job_title || "Unknown Job Title";
          const link = job.message?.link || "No link available";
          return `${index + 1}. **${title}** - [Apply Here](${link})`;
        })
        .join("\n");

      return `Here are the current job openings in Base:\n\n${jobList}`;
    } catch (e) {
      elizaLogger.error(`failed to fetch jobs, err: ${e.message}`);
    }
  },
};
