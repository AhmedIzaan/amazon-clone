export interface ReviewInsight {
  headline: string
  positives: string[]
  consideration: string
}

const reviewInsights: Record<string, ReviewInsight> = {
  'audio-001': { headline: 'Comfort and controls stand out', positives: ['Comfortable across long work sessions', 'Controls feel simpler than app-first alternatives'], consideration: 'Noise cancellation is tuned for everyday focus, not maximum travel isolation.' },
  'home-001': { headline: 'Small footprint, genuinely useful light', positives: ['Warm dimming works well at night', 'Touch controls are easy to find in the dark'], consideration: 'Best suited to focused bedside or desk lighting rather than a whole room.' },
  'outdoors-001': { headline: 'Compact without feeling cramped', positives: ['Organization handles daily essentials well', 'Back panel stays comfortable on warmer walks'], consideration: 'The 18L capacity favors day trips and commuting over overnight packing.' },
  'kitchen-001': { headline: 'A commuter-friendly everyday tumbler', positives: ['Narrow base fits common cup holders', 'Lid and interior are straightforward to clean'], consideration: 'The 20 oz size is practical for commuting but smaller than all-day bottles.' },
  'workspace-001': { headline: 'Quiet feel with easy device switching', positives: ['Low-profile keys work well in shared spaces', 'Three-device switching is quick and predictable'], consideration: 'Shoppers wanting deep mechanical key travel may prefer a taller board.' },
  'home-002': { headline: 'Convenience wins for quick cleanups', positives: ['Easy to reach for crumbs and car interiors', 'Washable filter keeps maintenance simple'], consideration: 'Designed as a spot cleaner rather than a replacement for a full-size vacuum.' },
}

export function getReviewInsight(productId: string, fallbackFeatures: string[]): ReviewInsight {
  return reviewInsights[productId] ?? {
    headline: 'Buyers respond well to the everyday details',
    positives: fallbackFeatures.slice(0, 2),
    consideration: 'Review the dimensions and variant choices to make sure it fits your routine.',
  }
}
