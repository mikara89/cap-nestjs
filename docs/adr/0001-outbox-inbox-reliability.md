# ADR 0001: Use Outbox and Inbox as the Reliability Model

## Status

Accepted

## Context

Applications need to publish and consume messages without losing work when a
broker, handler, or process fails. Directly emitting messages from business code
does not provide enough recovery information for reliable retries.

## Decision

CAP persists produced messages in an outbox before transport emission and
persists consumed messages in an inbox before handler execution.

Outbox records remain retryable until they are marked published. Inbox records
remain retryable until they are marked processed.

## Consequences

- Storage is part of the reliability boundary.
- Transport failures can be retried without losing the original message.
- Handler failures can be retried with backoff.
- Adapters must implement durable storage semantics for production use.
- Operators need tools, such as the dashboard, to inspect and manage message
  state.

## Links

- [Architecture](../architecture.md)
- [Roadmap](../roadmap.md)
