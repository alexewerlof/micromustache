// @public (undocumented)
export function asyncRender(
  template: Template,
  scope?: Scope,
  options?: ICompilerOptions
): Promise<string>

// @public (undocumented)
export function asyncRenderTag(
  scope: Scope,
  options: ICompilerOptions
): TagFn<Promise<string>>

// @public
export function compile(template: Template, options?: ICompilerOptions): Resolver;

// @public (undocumented)
export function compileTag(options: ICompilerOptions): TagFn<Resolver>;

// @public
export function render(
  template: Template,
  scope?: Scope,
  options?: ICompilerOptions
): string

// @public (undocumented)
export function format<T>(strings: string[], values: any[], valueToString: (value: T) => string): string;

// @public
export function get(scope: Scope, path: string): any;

// @public
export function getKeys(scope: Scope, pathArr: string[]): any;

// @public (undocumented)
interface ICompilerOptions extends IParseOptions, IStringifyOptions, IResolverOptions {
}

// @public (undocumented)
interface IParseOptions {
  closeSymbol?: string;
  openSymbol?: string;
}

// @public (undocumented)
interface IResolverOptions extends IStringifyOptions {
  // (undocumented)
  resolveFn?: ResolveFn;
  // (undocumented)
  resolveFnContext?: any;
}

// @public (undocumented)
interface IStringifyOptions {
  invalidObj?: string;
  invalidType?: string;
}

// @public (undocumented)
interface ITagInput<T> {
  // (undocumented)
  strings: string[];
  // (undocumented)
  values: T[];
}

// @public (undocumented)
class NameToken {
  constructor(varName: string);
  // (undocumented)
  readonly paths: string[];
  // (undocumented)
  readonly varName: string;
}

// @public
export function parseString(template: string, options?: IParseOptions): ITagInput<string>;

// @public
export function render(
  template: Template,
  scope?: Scope,
  options?: ICompilerOptions
): string

// @public (undocumented)
export function renderTag(
  scope: Scope,
  options: ICompilerOptions
): TagFn<string>

// @public (undocumented)
class Resolver {
  constructor(tokens: ITagInput<NameToken>, options: IResolverOptions);
  // (undocumented)
  asyncRender(scope?: Scope, resolveFn?: ResolveFn): Promise<string>;
  // (undocumented)
  render(scope?: Scope, resolveFn?: ResolveFn): string;
}

// @public
export function stringify(value: any, { invalidType, invalidObj }?: IStringifyOptions): string;

// @public (undocumented)
export function stringifyTagParams(strings: string[], values: any[], options?: IStringifyOptions): string;

// @public (undocumented)
export function tokenize(template: Template, options?: IParseOptions): ITagInput<NameToken>;

// @public (undocumented)
export function toPath(path: string): string[];

// @public (undocumented)
export function unquote(value: string): string;

// WARNING: Unsupported export: Scope
// WARNING: Unsupported export: ResolveFn
// WARNING: Unsupported export: TokenType
// WARNING: Unsupported export: Template
// WARNING: Unsupported export: TagFn
// (No @packagedocumentation comment for this package)
