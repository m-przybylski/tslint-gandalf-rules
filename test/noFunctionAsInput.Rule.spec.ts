import { lintHelper } from './lint-utils';

const rule = 'no-function-as-input'

describe('no-input-functions', () => {
  it('should detect input of type function', () => {
    const src = `class SomeClass { 
      @Input() somefn: () => void }`
    const result = lintHelper({ src, rule });
    expect(result.errorCount).toBe(1);
  })
})