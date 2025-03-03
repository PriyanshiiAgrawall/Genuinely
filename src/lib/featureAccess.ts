import { SubscriptionTier } from "@/models/User";

interface FeatureLimits {
    [SubscriptionTier.FREE]: number;
    [SubscriptionTier.PRO]: number;
    [SubscriptionTier.LIFETIME]: number;
}

const testimonialLimits: FeatureLimits = {
    [SubscriptionTier.FREE]: 50,
    [SubscriptionTier.PRO]: Infinity,
    [SubscriptionTier.LIFETIME]: Infinity,
};

const spaceLimits: FeatureLimits = {
    [SubscriptionTier.FREE]: 1,
    [SubscriptionTier.PRO]: 100,
    [SubscriptionTier.LIFETIME]: Infinity,
};

export function canCollectTestimonial(tier: SubscriptionTier, currentCount: number): boolean {
    if (currentCount < testimonialLimits[tier]) { return true; }
    else {
        return false;
    }
}

export function canCreateSpace(tier: SubscriptionTier, currentCount: number): boolean {
    if (currentCount < spaceLimits[tier]) { return true; }
    else {
        return false;
    }
}
