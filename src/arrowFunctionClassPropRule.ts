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
      if (node.initializer !== undefined && isArrowFunction(node.initializer)) {
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
  const af: ts.ArrowFunction = node.initializer;
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
    '{',
  );

  const semicolon = getChildOfKind(node, ts.SyntaxKind.SemicolonToken);
  const closingFunctionFix = semicolon
    ? Lint.Replacement.replaceFromTo(semicolon.getStart(), semicolon.getEnd(), '}')
    : Lint.Replacement.appendText(node.getEnd(), '}');

  const parenthesizedExpression = getChildOfKind(af, ts.SyntaxKind.ParenthesizedExpression);
  if (parenthesizedExpression) {
    const parenthesizedExpressionFix = [
      Lint.Replacement.replaceFromTo(
        parenthesizedExpression.getStart(),
        parenthesizedExpression.getStart() + 1,
        'return ',
      ),
      Lint.Replacement.deleteFromTo(parenthesizedExpression.getEnd() - 1, parenthesizedExpression.getEnd()),
    ];
    return [assignmentRemoveFix, arrowReplaceFix, ...parenthesizedExpressionFix, closingFunctionFix];
  }

  const a = af.getChildren();
  const lastElement = a[a.length - 1]
  const returnFix = Lint.Replacement.appendText(lastElement.getStart(), 'return ');

  return [assignmentRemoveFix, arrowReplaceFix, returnFix, closingFunctionFix];
}
