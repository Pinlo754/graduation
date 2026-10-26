import type { SiteConfig } from "@/config/site";
import { Gallery } from "../Gallery";
import { SectionHeading } from "../SectionHeading";

export function GallerySection({ config }: { config: SiteConfig }) {
  return (
    <section id="memories" className="section memories" aria-labelledby="memories-title">
      <div className="container">
        <SectionHeading
          index="04"
          kicker="ls ./memories"
          id="memories-title"
          title={
            <>
              Những <em>khoảnh khắc</em> đã qua
            </>
          }
          lead="Mỗi tấm ảnh là một commit nhỏ trong lịch sử của mình — và rất nhiều trong số đó có bạn."
        />
        <Gallery items={config.gallery} showSetupHint={process.env.NODE_ENV === "development"} />
      </div>
    </section>
  );
}
