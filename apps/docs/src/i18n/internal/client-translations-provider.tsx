"use client";

import React, { createContext } from "react";
import { Messages } from "../messages/types";

interface TranslationsContextType {
  messages: Messages;
  lang: string;
}

export const TranslationsContext = createContext<TranslationsContextType>({
  messages: {} as Messages,
  lang: "",
});

interface TranslationsProviderProps {
  messages: Messages;
  lang: string;
  children: React.ReactNode;
}

export const ClientTranslationsProvider: React.FC<
  TranslationsProviderProps
> = ({ messages, lang, children }) => {
  return (
    <TranslationsContext.Provider value={{ messages, lang }}>
      {children}
    </TranslationsContext.Provider>
  );
};
