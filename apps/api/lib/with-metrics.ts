import { metrics } from "@/lib/metrics";

type ApiRouteHandler = (request: Request) => Promise<Response> | Response;

export const withMetrics = (
	route: string,
	handler: ApiRouteHandler,
): ApiRouteHandler => {
	return async (request: Request) => {
		const method = request.method.toUpperCase();
		const inFlightLabels = { route };

		metrics.httpRequestsInFlight.inc(inFlightLabels);
		const stopTimer = metrics.httpRequestDurationSeconds.startTimer({
			method,
			route,
		});

		let status = 500;

		try {
			const response = await handler(request);
			status = response.status;
			return response;
		} finally {
			const statusLabel = String(status);
			metrics.httpRequestsInFlight.dec(inFlightLabels);
			metrics.httpRequestsTotal.inc({ method, route, status: statusLabel });
			stopTimer({ status: statusLabel });
		}
	};
};
