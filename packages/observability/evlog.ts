import { initLogger, type RequestLogger } from "evlog";
import { createDrainPipeline } from "evlog/pipeline";
import { createPostHogDrain } from "evlog/posthog";
import { keys } from "./keys";

/**
 * Evlog - Wide events and structured logging
 * Drains to PostHog for distributed tracing
 */

const postHogKey = keys().NEXT_PUBLIC_POSTHOG_KEY;
const postHogHost = keys().NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

// Initialize logger with PostHog drain
export const initEvlog = () => {
  if (!postHogKey) {
    return;
  }

  const pipeline = createDrainPipeline({
    batch: {
      intervalMs: 5000,
      size: 25,
    },
  });

  initLogger({
    env: {
      service: "next-ship",
    },
    drain: pipeline(
      createPostHogDrain({
        apiKey: postHogKey,
        host: postHogHost,
      })
    ),
  });
};

// Re-export for use in apps
export { createError, createRequestLogger, useLogger } from "evlog";
export type { RequestLogger };
