package endpoint

import (
	"time"
)

// Event is something that happens at a specific time
type Event struct {
	// Type is the kind of event
	Type EventType `json:"type"`

	// Timestamp is the moment at which the event happened
	Timestamp time.Time `json:"timestamp"`

	// Message is a human-readable description providing additional context about the event
	Message string `json:"message,omitempty"`
}

// EventType is, uh, the types of events?
type EventType string

var (
	// EventStart is a type of event that represents when an endpoint starts being monitored
	EventStart EventType = "START"

	// EventHealthy is a type of event that represents an endpoint passing all of its conditions
	EventHealthy EventType = "HEALTHY"

	// EventUnhealthy is a type of event that represents an endpoint failing one or more of its conditions
	EventUnhealthy EventType = "UNHEALTHY"

	// EventDegraded is a type of event that represents an endpoint passing all connectivity conditions,
	// but failing one or more performance conditions
	EventDegraded EventType = "DEGRADED"
)

// NewEventFromResult creates an Event from a Result
func NewEventFromResult(result *Result) *Event {
	event := &Event{Timestamp: result.Timestamp}
	if result.Degraded {
		event.Type = EventDegraded
		event.Message = buildEventMessage(result)
	} else if result.Success {
		event.Type = EventHealthy
	} else {
		event.Type = EventUnhealthy
		event.Message = buildEventMessage(result)
	}
	return event
}

// buildEventMessage constructs a human-readable message describing the failure context.
func buildEventMessage(result *Result) string {
	if result.ConnectivityFailed && result.PerformanceFailed {
		return "Connectivity conditions failed, and performance conditions also failed"
	}
	if result.ConnectivityFailed {
		return "Connectivity conditions failed"
	}
	if result.PerformanceFailed {
		return "Performance conditions failed"
	}
	return ""
}
