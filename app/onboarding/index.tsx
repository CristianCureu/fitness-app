import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import BodyMetricsStep from "./steps/body-metrics";
import FitnessGoalsStep from "./steps/fitness-goals";
import InviteCodeStep from "./steps/invite-code";
import PersonalInfoStep from "./steps/personal-info";
import ReviewStep from "./steps/review";

export default function OnboardingScreen() {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  // Render the appropriate step based on currentStep
  switch (currentStep) {
    case 1:
      return <InviteCodeStep />;
    case 2:
      return <PersonalInfoStep />;
    case 3:
      return <BodyMetricsStep />;
    case 4:
      return <FitnessGoalsStep />;
    case 5:
      return <ReviewStep />;
    default:
      return <InviteCodeStep />;
  }
}
