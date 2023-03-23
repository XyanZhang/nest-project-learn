import { Injectable } from '@nestjs/common';
import sanitizeHtml, { defaults } from 'sanitize-html';
import { merge } from 'lodash';

// src/modules/content/services/sanitize.service.ts
@Injectable()
export class SanitizeService {
  protected config: sanitizeHtml.IOptions = {};

  constructor() {
    this.config = {
      allowedTags: defaults.allowedTags.concat(['img', 'code']),
      allowedAttributes: {
        ...defaults.allowedAttributes,
        '*': ['class', 'style', 'height', 'width'],
      },
      parser: {
        lowerCaseTags: true,
      },
    };
  }

  sanitize(body: string, options?: sanitizeHtml.IOptions) {
    return sanitizeHtml(
      body,
      merge(this.config, options ?? {}, {
        arrayMerge: (_d, s, _o) => s,
      }),
    );
  }
}
