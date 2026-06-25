"use client";

const FACTS = [
  {
    label: "Based",
    value: "Rotterdam, NL",
  },
  {
    label: "Discipline",
    value: "Brand · Type · Editorial",
  },
  {
    label: "Clients",
    value: "MoMA · Frame · Wax & Wane",
  },
  {
    label: "Press",
    value: "It's Nice That · Eye on Design",
  },
];
const PORTRAITS = [
  {
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=400&h=400&q=80",
    className: "top-[18%] left-[6%] size-20 lg:size-28 -rotate-6",
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=facearea&facepad=2&w=400&h=400&q=80",
    className: "top-[10%] right-[8%] size-16 lg:size-24 rotate-3",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=400&h=400&q=80",
    className: "bottom-[24%] left-[12%] size-24 lg:size-32 rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=facearea&facepad=2&w=400&h=400&q=80",
    className: "bottom-[18%] right-[10%] size-20 lg:size-28 -rotate-3",
  },
];
export default function AboutPage() {
  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full overflow-y-auto px-6 lg:px-10">
        {PORTRAITS.map((p) => (
          <img
            key={p.src}
            src={p.src}
            alt=""
            className={`pointer-events-none absolute rounded-full object-cover shadow-[0_8px_24px_-12px_rgba(217,74,53,0.45)] ring-2 ring-[#f4ecdd] ${p.className}`}
          />
        ))}

        <section className="flex flex-col items-center pt-36 lg:pt-44">
          <p className="text-[11px] tracking-[0.32em] text-[#d94a35]/70 uppercase">
            Independent Designer · Est. 2018
          </p>
          <h1 className="mt-4 text-center font-serif text-5xl leading-[0.95] font-black tracking-tight text-[#d94a35] sm:text-6xl lg:text-7xl">
            ABOUT
            <br />
            ME
          </h1>
        </section>

        <section className="mx-auto mt-16 w-full max-w-2xl text-center">
          <p className="text-base leading-relaxed text-[#1a1a1a]/85 lg:text-lg">
            Nora Hale is a graphic designer and type maker working at the seam
            between editorial systems and unruly display lettering. Her practice
            spans identity, custom type, and the occasional album sleeve — all
            built one stubborn glyph at a time.
          </p>

          <dl className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 text-left text-xs tracking-[0.18em] uppercase">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="text-[#d94a35]/80">{f.label}</dt>
                <dd className="mt-1 text-[#1a1a1a]/85">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-20 flex flex-col items-center pb-10">
          <h2 className="text-center font-serif text-7xl leading-[0.85] font-black tracking-tight text-[#d94a35] sm:text-8xl lg:text-[11rem]">
            NORA
            <br />
            HALE
          </h2>
        </section>
      </div>
    </div>
  );
}
