import { albanianWomen } from "@/data/articles";

export default function AlbanianWomenSection() {
  return (
    <section aria-label="Gratë Shqiptare" className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Gratë Shqiptare
        </h2>
        <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
          {albanianWomen.map((woman) => (
            <div key={woman.id} className="flex flex-col items-center gap-3 min-w-[120px] snap-center">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <img
                  src={woman.image}
                  alt={woman.name}
                  loading="lazy"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{woman.name}</p>
                <p className="text-xs text-muted-foreground">{woman.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
