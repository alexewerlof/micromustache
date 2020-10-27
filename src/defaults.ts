/**
 * The default value for the `maxTemplateLen` option
 */
export const MAX_TEMPLATE_LEN = 1 << 20 // 1MiB

/**
 * The default value for the `maxPathCount` option
 */
export const MAX_PATH_COUNT = 5000

/**
 * The default value for the `maxPathLen` option
 */
export const MAX_PATH_LEN = 1000

/**
 * The default value for the `maxRefDepth` option
 */
export const MAX_REF_DEPTH = 10

/**
 * The default value for the `tags` option
 */
export const TAGS = Object.freeze(['{{', '}}'])

/**
 * @internal
 * The size of the [[pathToRef]] cache
 * If a path is cached, the actual tokenization algorithm will not be called which significantly
 * improves performance.
 * However, this cache is size-limited to prevent degrading the user's software over a period of
 * time.
 * If the cache is full, we start removing older paths one at a time.
 */
export const CACHE_SIZE = 100
