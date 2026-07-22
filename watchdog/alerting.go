package watchdog

import (
	"errors"
	"log"
	"os"
	"time"

	"github.com/TwiN/gatus/v5/alerting"
	"github.com/TwiN/gatus/v5/config/endpoint"
	"github.com/TwiN/gatus/v5/storage/store"
	"github.com/TwiN/logr"
)

// HandleAlerting takes care of alerts to resolve and alerts to trigger based on result success or failure
func HandleAlerting(ep *endpoint.Endpoint, result *endpoint.Result, alertingConfig *alerting.Config) {
	if alertingConfig == nil {
		return
	}
	// Determine the effective alert status key
	alertStatus := result.StatusKey()

	if result.Success && !result.Degraded {
		// UP: resolve all alerts
		handleAlertsToResolve(ep, result, alertingConfig)
		ep.LastAlertStatus = alertStatus
	} else if result.Degraded {
		// DEGRADED: degraded alerting
		handleDegradedAlerts(ep, result, alertingConfig)
		ep.LastAlertStatus = alertStatus
	} else {
		// DOWN: failure alerting
		handleAlertsToTrigger(ep, result, alertingConfig)
		ep.LastAlertStatus = alertStatus
	}
}

func handleAlertsToTrigger(ep *endpoint.Endpoint, result *endpoint.Result, alertingConfig *alerting.Config) {
	ep.NumberOfSuccessesInARow = 0
	ep.NumberOfDegradedInARow = 0
	ep.NumberOfFailuresInARow++

	// If the status type changed (e.g. DEGRADED → UNHEALTHY), reset Triggered so
	// alerts are sent as "initial" rather than "reminder".
	resetTriggeredOnStatusChange(ep, "UNHEALTHY")

	handleAlertBatch(ep, result, alertingConfig, ep.NumberOfFailuresInARow, "UNHEALTHY")
}

func handleDegradedAlerts(ep *endpoint.Endpoint, result *endpoint.Result, alertingConfig *alerting.Config) {
	ep.NumberOfSuccessesInARow = 0
	ep.NumberOfFailuresInARow = 0
	ep.NumberOfDegradedInARow++

	// If the status type changed (e.g. UNHEALTHY → DEGRADED), reset Triggered so
	// alerts are sent as "initial" rather than "reminder".
	resetTriggeredOnStatusChange(ep, "DEGRADED")

	handleAlertBatch(ep, result, alertingConfig, ep.NumberOfDegradedInARow, "DEGRADED")
}

// resetTriggeredOnStatusChange resets the Triggered flag for all alerts when the
// alert status type transitions between DEGRADED and UNHEALTHY.
// This ensures that cross-type transitions send "initial" alerts instead of "reminder".
func resetTriggeredOnStatusChange(ep *endpoint.Endpoint, newStatus string) {
	// Only reset if the status type actually changed between DEGRADED and UNHEALTHY.
	// HEALTHY → non-HEALTHY transitions are handled by handleAlertsToResolve resetting Triggered.
	if (newStatus == "DEGRADED" || newStatus == "UNHEALTHY") &&
		(ep.LastAlertStatus == "DEGRADED" || ep.LastAlertStatus == "UNHEALTHY") &&
		ep.LastAlertStatus != newStatus {
		for _, endpointAlert := range ep.Alerts {
			endpointAlert.Triggered = false
			if err := store.Get().DeleteTriggeredEndpointAlert(ep, endpointAlert); err != nil {
				// Silently fail - non-critical operation
				logr.Debugf("[watchdog.resetTriggeredOnStatusChange] Failed to delete persisted alert for endpoint=%s: %s", ep.Key(), err.Error())
			}
		}
	}
}

// handleAlertBatch is the shared core of handleAlertsToTrigger and handleDegradedAlerts.
// It sends alerts for all configured alerting providers, respecting FailureThreshold,
// MinimumReminderInterval, and whether this is an initial or reminder alert.
func handleAlertBatch(ep *endpoint.Endpoint, result *endpoint.Result, alertingConfig *alerting.Config, thresholdCounter int, statusLabel string) {
	lastReminderSent := ep.LastReminderSent
	for _, endpointAlert := range ep.Alerts {
		if !endpointAlert.IsEnabled() || endpointAlert.FailureThreshold > thresholdCounter {
			continue
		}
		sendInitialAlert := !endpointAlert.Triggered
		sendReminder := endpointAlert.Triggered && endpointAlert.MinimumReminderInterval > 0 && time.Since(lastReminderSent) >= endpointAlert.MinimumReminderInterval
		if !sendInitialAlert && !sendReminder {
			logr.Debugf("[watchdog.handleAlertBatch] Alert for endpoint=%s with description='%s' is not due for triggering or reminding, skipping", ep.Name, endpointAlert.GetDescription())
			continue
		}
		alertProvider := alertingConfig.GetAlertingProviderByAlertType(endpointAlert.Type)
		if alertProvider == nil {
			logr.Warnf("[watchdog.handleAlertBatch] Not sending alert of type=%s for endpoint with key=%s despite being TRIGGERED (%s), because the provider wasn't configured properly", endpointAlert.Type, ep.Key(), statusLabel)
			continue
		}
		alertTypeStr := "reminder"
		if sendInitialAlert {
			alertTypeStr = "initial"
		}
		logr.Infof("[watchdog.handleAlertBatch] Sending %s alert because alert for endpoint with key=%s with description='%s' has been TRIGGERED (%s)", endpointAlert.Type, ep.Key(), endpointAlert.GetDescription(), statusLabel)
		log.Printf("[watchdog.handleAlertBatch] Sending %s %s alert because alert for endpoint=%s with description='%s' has been TRIGGERED (%s)", alertTypeStr, endpointAlert.Type, ep.Name, endpointAlert.GetDescription(), statusLabel)
		var err error
		if os.Getenv("MOCK_ALERT_PROVIDER") == "true" {
			if os.Getenv("MOCK_ALERT_PROVIDER_ERROR") == "true" {
				err = errors.New("error")
			}
		} else {
			err = alertProvider.Send(ep, endpointAlert, result, false)
		}
		if err != nil {
			logr.Errorf("[watchdog.handleAlertBatch] Failed to send an alert for endpoint with key=%s: %s", ep.Key(), err.Error())
		} else {
			if sendInitialAlert {
				endpointAlert.Triggered = true
			}
			ep.LastReminderSent = time.Now()
			if err := store.Get().UpsertTriggeredEndpointAlert(ep, endpointAlert); err != nil {
				logr.Errorf("[watchdog.handleAlertBatch] Failed to persist triggered endpoint alert for endpoint with key=%s: %s", ep.Key(), err.Error())
			}
		}
	}
}

func handleAlertsToResolve(ep *endpoint.Endpoint, result *endpoint.Result, alertingConfig *alerting.Config) {
	ep.NumberOfDegradedInARow = 0
	ep.NumberOfSuccessesInARow++
	for _, endpointAlert := range ep.Alerts {
		isStillBelowSuccessThreshold := endpointAlert.SuccessThreshold > ep.NumberOfSuccessesInARow
		if isStillBelowSuccessThreshold && endpointAlert.IsEnabled() && endpointAlert.Triggered {
			// Persist NumberOfSuccessesInARow
			if err := store.Get().UpsertTriggeredEndpointAlert(ep, endpointAlert); err != nil {
				logr.Errorf("[watchdog.handleAlertsToResolve] Failed to update triggered endpoint alert for endpoint with key=%s: %s", ep.Key(), err.Error())
			}
		}
		if !endpointAlert.IsEnabled() || !endpointAlert.Triggered || isStillBelowSuccessThreshold {
			continue
		}
		// Even if the alert provider returns an error, we still set the alert's Triggered variable to false.
		// Further explanation can be found on Alert's Triggered field.
		endpointAlert.Triggered = false
		if err := store.Get().DeleteTriggeredEndpointAlert(ep, endpointAlert); err != nil {
			logr.Errorf("[watchdog.handleAlertsToResolve] Failed to delete persisted triggered endpoint alert for endpoint with key=%s: %s", ep.Key(), err.Error())
		}
		if !endpointAlert.IsSendingOnResolved() {
			logr.Debugf("[watchdog.handleAlertsToResolve] Not sending request to provider of alert with type=%s for endpoint with key=%s despite being RESOLVED, because send-on-resolved is set to false", endpointAlert.Type, ep.Key())
			continue
		}
		alertProvider := alertingConfig.GetAlertingProviderByAlertType(endpointAlert.Type)
		if alertProvider != nil {
			logr.Infof("[watchdog.handleAlertsToResolve] Sending %s alert because alert for endpoint with key=%s with description='%s' has been RESOLVED", endpointAlert.Type, ep.Key(), endpointAlert.GetDescription())
			err := alertProvider.Send(ep, endpointAlert, result, true)
			if err != nil {
				logr.Errorf("[watchdog.handleAlertsToResolve] Failed to send an alert for endpoint with key=%s: %s", ep.Key(), err.Error())
			}
		} else {
			logr.Warnf("[watchdog.handleAlertsToResolve] Not sending alert of type=%s for endpoint with key=%s despite being RESOLVED, because the provider wasn't configured properly", endpointAlert.Type, ep.Key())
		}
	}
	ep.NumberOfFailuresInARow = 0
}
