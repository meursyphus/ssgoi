import { SUPPORTED_LANGUAGES } from "./supported-languages";

export const generateStaticParams = () => {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
};
