import { PortableText, type PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-[17px] leading-[1.6] text-ink/85">{children}</p>,
    h2: ({ children }) => <h2 className="pt-6 text-[22px] font-semibold tracking-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="pt-4 text-[18px] font-semibold">{children}</h3>,
    blockquote: ({ children }) => <blockquote className="border-l-2 border-hair pl-4 text-mute">{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-1.5 pl-5 text-[17px] text-ink/85">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-1.5 pl-5 text-[17px] text-ink/85">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="text-link hover:underline">
        {children}
      </a>
    ),
  },
};

export function RichText({ value }: { value: { _type: string; _key?: string }[] }) {
  return (
    <div className="space-y-4">
      <PortableText value={value} components={components} />
    </div>
  );
}
