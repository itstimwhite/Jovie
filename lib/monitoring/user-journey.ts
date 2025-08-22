'use client';

import { track } from '@/lib/analytics';

/**
 * User Journey Tracker class for monitoring user flows
 */
export class UserJourneyTracker {
  private journeyName: string;
  private steps: string[];
  private currentStep: number = -1;
  private startTime: number = 0;
  private stepTimes: Record<string, number> = {};

  /**
   * Create a new user journey tracker
   * @param journeyName The name of the journey (e.g., 'onboarding', 'checkout')
   * @param steps Array of step names in order
   */
  constructor(journeyName: string, steps: string[]) {
    this.journeyName = journeyName;
    this.steps = steps;
  }

  /**
   * Start tracking the journey
   */
  start() {
    this.startTime = Date.now();
    this.currentStep = -1;
    this.stepTimes = {};

    // Track journey start
    track(`journey_${this.journeyName}_start`, {
      timestamp: this.startTime,
    });

    return this;
  }

  /**
   * Advance to the next step in the journey
   * @param data Optional data to include with the step
   */
  nextStep(data: Record<string, unknown> = {}) {
    this.currentStep++;

    if (this.currentStep >= this.steps.length) {
      console.warn(`Journey ${this.journeyName} has no more steps defined`);
      return this;
    }

    const stepName = this.steps[this.currentStep];
    const stepTime = Date.now();
    this.stepTimes[stepName] = stepTime;

    // Calculate time since journey start and time since previous step
    const timeSinceStart = stepTime - this.startTime;
    const previousStep =
      this.currentStep > 0 ? this.steps[this.currentStep - 1] : null;
    const timeSincePreviousStep = previousStep
      ? stepTime - this.stepTimes[previousStep]
      : 0;

    // Track step completion
    track(`journey_${this.journeyName}_step`, {
      journey: this.journeyName,
      step: stepName,
      stepIndex: this.currentStep,
      timeSinceStart,
      timeSincePreviousStep,
      ...data,
    });

    // Dispatch custom event for other components to listen to
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(`jovie:${this.journeyName}_${stepName}`, {
        detail: {
          journey: this.journeyName,
          step: stepName,
          stepIndex: this.currentStep,
          timeSinceStart,
          ...data,
        },
      });
      window.dispatchEvent(event);
    }

    return this;
  }

  /**
   * Go to a specific step in the journey (by name)
   * @param stepName The name of the step to go to
   * @param data Optional data to include with the step
   */
  goToStep(stepName: string, data: Record<string, unknown> = {}) {
    const stepIndex = this.steps.indexOf(stepName);

    if (stepIndex === -1) {
      console.warn(`Step ${stepName} not found in journey ${this.journeyName}`);
      return this;
    }

    this.currentStep = stepIndex;
    const stepTime = Date.now();
    this.stepTimes[stepName] = stepTime;

    // Calculate time since journey start
    const timeSinceStart = stepTime - this.startTime;

    // Track step
    track(`journey_${this.journeyName}_step`, {
      journey: this.journeyName,
      step: stepName,
      stepIndex,
      timeSinceStart,
      outOfOrder: true,
      ...data,
    });

    return this;
  }

  /**
   * Complete the journey
   * @param success Whether the journey was completed successfully
   * @param data Optional data to include with completion
   */
  complete(success: boolean = true, data: Record<string, unknown> = {}) {
    const completionTime = Date.now();
    const totalTime = completionTime - this.startTime;

    // Track journey completion
    track(`journey_${this.journeyName}_complete`, {
      journey: this.journeyName,
      success,
      totalTime,
      stepsCompleted: this.currentStep + 1,
      totalSteps: this.steps.length,
      completionRate: ((this.currentStep + 1) / this.steps.length) * 100,
      ...data,
    });

    // Dispatch custom event for journey completion
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(`jovie:${this.journeyName}_complete`, {
        detail: {
          journey: this.journeyName,
          success,
          totalTime,
          stepsCompleted: this.currentStep + 1,
          totalSteps: this.steps.length,
          ...data,
        },
      });
      window.dispatchEvent(event);
    }

    return this;
  }

  /**
   * Abandon the journey
   * @param reason Reason for abandonment
   * @param data Optional data to include
   */
  abandon(reason: string, data: Record<string, unknown> = {}) {
    const abandonTime = Date.now();
    const totalTime = abandonTime - this.startTime;

    // Track journey abandonment
    track(`journey_${this.journeyName}_abandon`, {
      journey: this.journeyName,
      reason,
      totalTime,
      lastStep: this.currentStep >= 0 ? this.steps[this.currentStep] : null,
      stepsCompleted: this.currentStep + 1,
      totalSteps: this.steps.length,
      completionRate: ((this.currentStep + 1) / this.steps.length) * 100,
      ...data,
    });

    return this;
  }

  /**
   * Track the onboarding funnel
   * Static helper method to create a standard onboarding journey
   */
  static trackOnboardingFunnel() {
    const steps = [
      'onboarding_start',
      'artist_selected',
      'handle_entered',
      'handle_validated',
      'profile_created',
      'onboarding_complete',
    ];

    const journey = new UserJourneyTracker('onboarding', steps).start();

    // Set up event listeners for each step
    if (typeof window !== 'undefined') {
      steps.forEach((step) => {
        window.addEventListener(`jovie:${step}`, (event: Event) => {
          const customEvent = event as CustomEvent;
          journey.goToStep(step, customEvent.detail || {});
        });
      });

      // Listen for completion event
      window.addEventListener('jovie:onboarding_complete', (event: Event) => {
        const customEvent = event as CustomEvent;
        journey.complete(true, customEvent.detail || {});
      });

      // Listen for abandonment events
      window.addEventListener('jovie:onboarding_abandon', (event: Event) => {
        const customEvent = event as CustomEvent;
        journey.abandon(
          customEvent.detail?.reason || 'unknown',
          customEvent.detail || {}
        );
      });
    }

    return journey;
  }
}
