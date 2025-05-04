// src/utils/circuitBreaker.ts
export enum CircuitState {
  CLOSED, // Normal operation - requests go through
  OPEN, // Failure detected - requests are rejected immediately
  HALF_OPEN, // Testing if service is back after cool-down period
}

interface CircuitBreakerOptions {
  failureThreshold: number; // Number of failures before opening circuit
  resetTimeout: number; // Time in ms before trying service again
  timeoutDuration: number; // Request timeout in ms
  onOpen?: () => void; // Callback when circuit opens
  onClose?: () => void; // Callback when circuit closes
  fallbackResponse?: unknown; // Default response when circuit is open
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private nextAttempt: number = Date.now();
  private options: CircuitBreakerOptions;

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    this.options = {
      failureThreshold: 3,
      resetTimeout: 30000, // 30 seconds
      timeoutDuration: 15000, // 15 seconds
      ...options,
    };
  }

  public async execute<T>(fn: () => Promise<T>, timeout?: number): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() > this.nextAttempt) {
        // Move to half-open state to test if service is back
        this.state = CircuitState.HALF_OPEN;
      } else {
        // Circuit is open - fail fast with fallback response
        if (this.options.fallbackResponse !== undefined) {
          return this.options.fallbackResponse as T;
        }
        throw new Error("Circuit is open - service unavailable");
      }
    }

    try {
      // Set up a timeout for the request
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("Request timeout")),
          timeout ?? this.options.timeoutDuration
        );
      });

      // Race between the actual request and the timeout
      const response = await Promise.race([fn(), timeoutPromise]);

      // Success - reset failure count
      this.onSuccess();
      return response;
    } catch (error) {
      return this.onFailure(error);
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state !== CircuitState.CLOSED) {
      this.state = CircuitState.CLOSED;
      this.options.onClose?.();
    }
  }

  private onFailure(error: unknown): never {
    this.failureCount++;

    if (
      this.state === CircuitState.HALF_OPEN ||
      (this.state === CircuitState.CLOSED &&
        this.failureCount >= this.options.failureThreshold)
    ) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.options.resetTimeout;
      this.options.onOpen?.();
    }

    throw error;
  }

  public getState(): CircuitState {
    return this.state;
  }

  public reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
  }

  public getRemainingBlockTime(): number {
    if (this.state === CircuitState.OPEN) {
      return Math.max(0, this.nextAttempt - Date.now());
    }
    return 0;
  }
}

// Create a singleton instance for backend API
const backendCircuitBreaker = new CircuitBreaker({
  onOpen: () => {
    console.error(
      "⚠️ Backend service circuit breaker OPEN - API calls will fail fast"
    );
  },
  onClose: () => {
    console.log(
      "✅ Backend service circuit breaker CLOSED - API calls flowing"
    );
  },
});

export default backendCircuitBreaker;
