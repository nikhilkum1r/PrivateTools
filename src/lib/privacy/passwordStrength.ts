/**
 * Password strength checker using the zxcvbn algorithm.
 * Fully offline — no network requests.
 */

export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  color: string;
  crackTime: string;
  entropy: number;
  suggestions: string[];
  warning: string;
}

const LABELS = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"] as const;
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"] as const;

export async function checkPassword(password: string): Promise<PasswordStrengthResult> {
  if (!password) {
    return {
      score: 0, label: "Very Weak", color: COLORS[0],
      crackTime: "instant", entropy: 0, suggestions: ["Enter a password to check its strength."], warning: "",
    };
  }

  // Dynamically import zxcvbn to avoid increasing initial bundle size
  const zxcvbn = (await import("zxcvbn")).default;
  const result = zxcvbn(password);

  const score = result.score as 0 | 1 | 2 | 3 | 4;
  const crackDisplay = result.crack_times_display.offline_slow_hashing_1e4_per_second as string;

  return {
    score,
    label: LABELS[score],
    color: COLORS[score],
    crackTime: crackDisplay,
    entropy: Math.round(result.guesses_log10 * 3.32), // approx bits
    suggestions: result.feedback.suggestions,
    warning: result.feedback.warning ?? "",
  };
}
