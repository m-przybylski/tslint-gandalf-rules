import { lintHelper, getFixedResult } from './lint-utils';

describe('arrow-function-class-prop', () => {
  const rule = 'arrow-function-class-prop';
  it('should report an error with one-liners', () => {
    const src = `export class SomeClass { public doMagic = (): string => 'magic'; public doMoreMagic() { return 'more magic' } }`;
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
  });
  it('should fix an error with one-liners', () => {
    const src = `export class SomeClass { public doMagic = (): string => 'magic'; public doMoreMagic() { return 'more magic' } }`;
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { public doMagic(): string { return 'magic' } public doMoreMagic() { return 'more magic' } }`,
    );
  });
  it('should fix an error with one-liners no semicolon', () => {
    const src = `export class SomeClass { public doMagic = (): string => 'magic' public doMoreMagic() { return 'more magic' } }`;
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { public doMagic(): string { return 'magic'} public doMoreMagic() { return 'more magic' } }`,
    );
  });
  it('should fix an error with one-liners not returning any value', () => {
    const src = `export class SomeClass { public doMagic = (): void => { 'magic' }; public doMoreMagic() { return 'more magic' } }`;
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { public doMagic(): void  { 'magic' }; public doMoreMagic() { return 'more magic' } }`,
    );
  });
  it('should fix an error with multiple line function and no return', () => {
    const src = `export class SomeClass { public doMagic = (): void => { const a = 'magic'; const b = 'magic' }; public doMoreMagic() { return 'more magic' } }`;
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { public doMagic(): void  { const a = 'magic'; const b = 'magic' }; public doMoreMagic() { return 'more magic' } }`,
    );
  });
  it('should fix an error with multiple line function and return', () => {
    const src = `export class SomeClass { public doMagic = (): string => { const a = 'magic'; const b = 'magic' return a }; public doMoreMagic() { return 'more magic' } }`;
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { public doMagic(): string  { const a = 'magic'; const b = 'magic' return a }; public doMoreMagic() { return 'more magic' } }`,
    );
  });
});
