/* eslint-disable camelcase */
/**
 * Track feature usage with ThriveStack
 * @param featureName - Name of the feature being used
 * @param userId - User ID for tracking
 */
export function trackThriveStackFeatureUsage({
  featureName,
  userId,
}: {
  featureName: string;
  userId: string;
}) {
  if (typeof window !== 'undefined' && window.thriveStack && userId) {
    window.thriveStack.track([
      {
        event_name: 'feature_used',
        properties: {
          feature_name: featureName,
          user_role: 'user',
        },
        user_id: userId,
        timestamp: new Date().toISOString(),
        context: {
          group_id: userId,
        },
      },
    ]);
  }
}
