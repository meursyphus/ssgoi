type Props = { className?: string };

export function ChromeMark({ className }: Props) {
  return <img src="/logos/chrome.svg" alt="Chrome" className={className} />;
}

export function SafariMark({ className }: Props) {
  return <img src="/logos/safari.svg" alt="Safari" className={className} />;
}

export function FirefoxMark({ className }: Props) {
  return <img src="/logos/firefox.svg" alt="Firefox" className={className} />;
}

export function EdgeMark({ className }: Props) {
  return <img src="/logos/edge.svg" alt="Edge" className={className} />;
}
