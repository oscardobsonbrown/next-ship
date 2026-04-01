'use client';

import SwaggerUIReact from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

/**
 * Swagger UI component wrapper
 * Renders OpenAPI spec as interactive documentation
 */

interface SwaggerUIProps {
  spec: Record<string, unknown>;
}

export function SwaggerUI({ spec }: SwaggerUIProps) {
  return (
    <SwaggerUIReact
      spec={spec}
      docExpansion="list"
      displayOperationId={true}
      filter={true}
      deepLinking={true}
    />
  );
}
