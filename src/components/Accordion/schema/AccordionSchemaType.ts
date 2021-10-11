type ContentURLs = {
  sources: string[];
  readCaseStudy: string;
};

export interface AccordionContent {
  title: string;
  body: string;
  urls: ContentURLs;
  variant: "simple" | "advanced";
}

interface AccordionSection {
  title: string;
  subtitle?: string;
  color: string;
  background?: string;
  sectionColor?: string;
  content: AccordionContent;
  sections?: AccordionSection[];
  columns?: number;
  open?: boolean;
  fullWidth?: boolean;
  expandable?: boolean;
  selected?: {
    color: string;
  };
}

export interface AccordionType {
  open?: boolean;
  title: string;
  content: AccordionSection[];
}
