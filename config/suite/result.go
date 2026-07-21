package suite

import (
	"time"

	"github.com/TwiN/gatus/v5/config/endpoint"
)

// Result represents the result of a suite execution
type Result struct {
	// Name of the suite
	Name string `json:"name,omitempty"`

	// Group of the suite
	Group string `json:"group,omitempty"`

	// Success indicates whether all required endpoints succeeded
	Success bool `json:"success"`

	// Degraded indicates the suite is functional but at least one endpoint has performance issues
	Degraded bool `json:"degraded"`

	// Timestamp is when the suite execution started
	Timestamp time.Time `json:"timestamp"`

	// Duration is how long the entire suite execution took
	Duration time.Duration `json:"duration"`

	// EndpointResults contains the results of each endpoint execution
	EndpointResults []*endpoint.Result `json:"endpointResults"`

	// Context is the final state of the context after all endpoints executed
	Context map[string]interface{} `json:"-"`

	// Errors contains any suite-level errors
	Errors []string `json:"errors,omitempty"`
}

// AddError adds an error to the suite result
func (r *Result) AddError(err string) {
	r.Errors = append(r.Errors, err)
}

// CalculateSuccess determines if the suite execution was successful
func (r *Result) CalculateSuccess() {
	r.Success = true
	r.Degraded = false
	// Check if any endpoints failed (all endpoints are required)
	for _, epResult := range r.EndpointResults {
		if !epResult.Success {
			r.Success = false
			break
		}
		if epResult.Degraded {
			r.Degraded = true
		}
	}
	// Also check for suite-level errors
	if len(r.Errors) > 0 {
		r.Success = false
		r.Degraded = false
	}
	// If there's a DOWN endpoint, degraded is irrelevant
	if !r.Success {
		r.Degraded = false
	}
}
