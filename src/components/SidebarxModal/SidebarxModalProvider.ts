import React from "react";
import { AccordionContent } from "../Accordion/schema/AccordionSchemaType";

interface SidebarxModalProviderProps {
  current: AccordionContent | undefined;
  setCurrent: React.Dispatch<
    React.SetStateAction<AccordionContent | undefined>
  >;
}

const SidebarxModalProvider =
  React.createContext<SidebarxModalProviderProps | null>(null);

export default SidebarxModalProvider;
