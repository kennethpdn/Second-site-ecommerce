import React, { useEffect } from 'react';
import {
  updateHeadMetadata,
  updateHeadMetadataForRoute,
  MetadataOptions,
  ProductMetadataOptions,
} from '../utils/updateMetadata.ts';

export interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  canonicalPath?: string;
  image?: string;
  type?: 'website' | 'product';
  product?: ProductMetadataOptions;
  noindex?: boolean;
  routePath?: string;
}

/**
 * SEOHead component
 * Wraps dynamic metadata updates (title, meta description, canonical link,
 * Open Graph tags, Twitter Card tags, and Schema.org structured data).
 */
export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  url,
  canonicalPath,
  image,
  type = 'website',
  product,
  noindex = false,
  routePath,
}) => {
  useEffect(() => {
    const activePath =
      canonicalPath ||
      routePath ||
      (typeof window !== 'undefined' ? window.location.pathname : '/');

    if (title && description) {
      updateHeadMetadata({
        title,
        description,
        canonicalPath: activePath,
        image,
        type,
        product,
        noindex,
      });
    } else {
      updateHeadMetadataForRoute(activePath, {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(image ? { image } : {}),
        type,
        product,
        noindex,
      });
    }
  }, [
    title,
    description,
    url,
    canonicalPath,
    routePath,
    image,
    type,
    product?.price,
    product?.currency,
    product?.availability,
    product?.brand,
    noindex,
  ]);

  return null;
};
