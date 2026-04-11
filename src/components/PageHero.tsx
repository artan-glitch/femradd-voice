import { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  breadcrumbs: { label: string; href?: string }[];
  updatedAt?: string;
}

export default function PageHero({ title, subtitle, icon, breadcrumbs, updatedAt }: Props) {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary/30 via-secondary/20 to-primary/10 dark:from-primary/15 dark:via-secondary/10 dark:to-background border-b border-primary/20"
      aria-label={title}
    >
      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/30 dark:bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-80 h-80 rounded-full bg-secondary/30 dark:bg-secondary/15 blur-3xl" />

      <div className="container relative py-12 md:py-16">
        <Breadcrumbs items={breadcrumbs} className="mb-6" />
        {icon && (
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 dark:bg-primary/15 text-primary mb-5 shadow-sm">
            {icon}
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
        {updatedAt && (
          <p className="text-sm text-muted-foreground mt-3">
            Përditësuar më: {updatedAt}
          </p>
        )}
      </div>
    </section>
  );
}
