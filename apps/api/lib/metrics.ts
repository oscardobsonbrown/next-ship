import {
	Counter,
	collectDefaultMetrics,
	Gauge,
	Histogram,
	Registry,
} from "prom-client";

type MetricsRegistryState = {
	register: Registry;
	httpRequestsTotal: Counter<"method" | "route" | "status">;
	httpRequestDurationSeconds: Histogram<"method" | "route" | "status">;
	httpRequestsInFlight: Gauge<"route">;
};

declare global {
	var __nextShipApiMetrics: MetricsRegistryState | undefined;
}

const initializeMetrics = (): MetricsRegistryState => {
	const register = new Registry();
	collectDefaultMetrics({ register });

	const httpRequestsTotal = new Counter({
		name: "http_requests_total",
		help: "Total number of HTTP requests",
		labelNames: ["method", "route", "status"],
		registers: [register],
	});

	const httpRequestDurationSeconds = new Histogram({
		name: "http_request_duration_seconds",
		help: "HTTP request duration in seconds",
		labelNames: ["method", "route", "status"],
		buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
		registers: [register],
	});

	const httpRequestsInFlight = new Gauge({
		name: "http_requests_in_flight",
		help: "Number of in-flight HTTP requests",
		labelNames: ["route"],
		registers: [register],
	});

	return {
		register,
		httpRequestsTotal,
		httpRequestDurationSeconds,
		httpRequestsInFlight,
	};
};

export const metrics = globalThis.__nextShipApiMetrics ?? initializeMetrics();

if (!globalThis.__nextShipApiMetrics) {
	globalThis.__nextShipApiMetrics = metrics;
}

export const getMetricsPayload = async () => {
	return {
		contentType: metrics.register.contentType,
		body: await metrics.register.metrics(),
	};
};
