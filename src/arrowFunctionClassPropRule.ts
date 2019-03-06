import * as ts from 'typescript';
import * as Lint from 'tslint';
import { getChildOfKind } from 'tsutils';
export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'arrow functions are not allowed';

  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'arrow-function-class-prop',
    type: 'functionality',
    description: '',
    options: null,
    optionsDescription: 'Not configurable',
    typescriptOnly: true,
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithFunction(sourceFile, walk);
  }
}

function walk(ctx: Lint.WalkContext<void>) {
  const cb = (node: ts.Node) => {
    ts.forEachChild(node, cb);
    if (isPropertyDeclaration(node)) {
      if (isArrowFunction(node.initializer)) {
        ctx.addFailureAtNode(node, Rule.FAILURE_STRING, [...prepareFix(node)]);
      }
    }
  };
  ts.forEachChild(ctx.sourceFile, cb);
}

function isPropertyDeclaration(node: ts.Node): node is ts.PropertyDeclaration {
  return node.kind === ts.SyntaxKind.PropertyDeclaration;
}
function isArrowFunction(node: ts.Node): node is ts.ArrowFunction {
  return node.kind === ts.SyntaxKind.ArrowFunction;
}

function prepareFix(node) {
  const af = node.initializer;
  const block = getChildOfKind(af, ts.SyntaxKind.Block);
  const assignmentRemoveFix = Lint.Replacement.deleteFromTo(node.name.getEnd(), af.getStart());
  if (block !== undefined) {
    const arrowReplaceFix = Lint.Replacement.deleteFromTo(
      af.equalsGreaterThanToken.getStart(),
      af.equalsGreaterThanToken.getEnd(),
    );
    return [assignmentRemoveFix, arrowReplaceFix];
  }
  const arrowReplaceFix = Lint.Replacement.replaceFromTo(
    af.equalsGreaterThanToken.getStart(),
    af.equalsGreaterThanToken.getEnd(),
    '{ return',
  );
  const semicolon = getChildOfKind(node, ts.SyntaxKind.SemicolonToken);
  const closingFunctionFix = semicolon
    ? Lint.Replacement.replaceFromTo(semicolon.getStart(), semicolon.getEnd(), ' }')
    : Lint.Replacement.appendText(node.getEnd(), '}');
  return [assignmentRemoveFix, arrowReplaceFix, closingFunctionFix];
}
