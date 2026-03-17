import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
}

export default function ArticleFAQ({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="my-10" aria-label="Pyetjet e shpeshta">
      <h2 className="text-2xl font-bold text-foreground mb-6">Pyetjet e Shpeshta</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm md:text-base">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ${
                openIndex === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
