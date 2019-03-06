[![NPM][npm-image]][npm-url]

# tslint-rules

A set of custom [TSLint](https://github.com/palantir/tslint) rules.


# Usage

Install from npm to your devDependencies:
```
npm install --save-dev tslint-gandalf-rules
```

Configure tslint to use the custom-tslint-rules folder:

Add the following path to the `rulesDirectory` setting in your `tslint.json` file:

```json
{
   "extends": [
     "tslint-gandalf-rules"
   ],
   "rules": {
     ...
   }
}
```

Now configure some of the new rules.


# Available Rules

## `arrow-function-class-prop`
<details>
  <summary>prevent from creating arrow functions as class property</summary>

#### Rationale:


#### Usage:
```json
...
"rules": {
  "arrow-function-class-prop": true
}
...
```

#### Options:

No options at the moment

</details>

# Contributions and Development

Issue reports and pull requests are highly welcome! Please make sure to provide sensible tests along with your pull request.

To get started with development, clone the project and run `yarn install`.
To run the tests execute `yarn test`.


[deps-image]: https://img.shields.io/david/BendingBender/tslint-rules.svg?style=flat-square
[deps-url]: https://david-dm.org/BendingBender/tslint-rules
[dev-deps-image]: https://img.shields.io/david/dev/BendingBender/tslint-rules.svg?style=flat-square
[dev-deps-url]: https://david-dm.org/BendingBender/tslint-rules?type=dev
[npm-image]: https://nodei.co/npm/tslint-gandalf-rules.png?downloads=true
[npm-url]: https://npmjs.org/package/tslint-gandalf-rules