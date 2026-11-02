import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** Base CDN URL (crop/hotspot applied). Width and quality are added per request by `image-loader.ts`. */
export const imageUrl = (source: SanityImageSource) => builder.image(source).auto("format").fit("max").url();

/** 1200×630 crop for OpenGraph previews. */
export const ogImageUrl = (source: SanityImageSource) =>
  builder.image(source).width(1200).height(630).fit("crop").auto("format").url();
