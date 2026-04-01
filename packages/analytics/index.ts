export { default as posthog, posthog as analytics } from "posthog-js";
export {
	captureError,
	captureMessage,
	onError,
	serverCaptureError,
} from "./errors";
