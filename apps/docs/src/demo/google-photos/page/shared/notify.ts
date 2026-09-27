import { toast } from "sonner";

/**
 * Passive status toast. The shell's Toaster sits at the top, right over the
 * app bars (Back / Close / Cancel), so these let taps pass through instead of
 * blocking the header until they time out.
 */
export function notify(message: string) {
  toast(message, { className: "pointer-events-none", duration: 2500 });
}
