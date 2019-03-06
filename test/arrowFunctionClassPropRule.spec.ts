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
      `export class SomeClass { public doMagic(): string { return 'magic'} public doMoreMagic() { return 'more magic' } }`,
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
  it('should work with break lines', () => {
    const src = `export class SomeClass { public doMagic = (): string =>
'magic' ; public doMoreMagic() { return 'more magic' } }`;
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { public doMagic(): string {
return 'magic' } public doMoreMagic() { return 'more magic' } }`,
    );
  });
  it('should work with number literal', () => {
    const src = `export class SomeClass { public doMagic = (): number =>
1 ; public doMoreMagic() { return 'more magic' } }`;
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { public doMagic(): number {
return 1 } public doMoreMagic() { return 'more magic' } }`,
    );
  });
  it('should work with object literal', () => {
    const src = `export class SomeClass { public doMagic = (): Object =>
        ({ magic: true }) ; public doMoreMagic() { return 'more magic' } }`;
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { public doMagic(): Object {
        return { magic: true } } public doMoreMagic() { return 'more magic' } }`,
    );
  });
  it('should work with conditional expression', () => {
    const src = `export class SomeClass { private getMoneyAmount = (paidCallTime: number, servicePrice: number): number =>
a > 0 ? 1 : 0; }`
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
    expect(getFixedResult({ src, rule })).toEqual(
      `export class SomeClass { private getMoneyAmount(paidCallTime: number, servicePrice: number): number {
return a > 0 ? 1 : 0} }`,
    );
  });
});
