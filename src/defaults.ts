/**
 * The default value for the `maxLen` option
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
 */
export const CACHE_SIZE = 100
