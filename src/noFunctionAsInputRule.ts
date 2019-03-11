import * as ts from 'typescript';
import * as Lint from 'tslint';
export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'functions are not allowed to be input use output';

  public static metadata: Lint.IRuleMetadata = {
    ruleName: 'no-function-as-input',
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
    if (isPropertyDeclaration(node) && isFunctionType(node) && hasInputDecorator(node)) {
      ctx.addFailureAtNode(node, Rule.FAILURE_STRING);
    }
  };
  ts.forEachChild(ctx.sourceFile, cb);
}

function isPropertyDeclaration(node: ts.Node): node is ts.PropertyDeclaration {
  return node.kind === ts.SyntaxKind.PropertyDeclaration;
}

function isFunctionType(node: ts.PropertyDeclaration): boolean {
  return node.type !== undefined && node.type.kind === ts.SyntaxKind.FunctionType;
}

function isSyntaxList(node: ts.Node): node is ts.SyntaxList {
  return node.kind === ts.SyntaxKind.SyntaxList;
}

function isInputDecorator(node: ts.Node): node is ts.Decorator {
  return (
    node.kind === ts.SyntaxKind.Decorator &&
    node
      .getText()
      .toLowerCase()
      .indexOf('input') !== -1
  );
}

function hasInputDecorator(node: ts.PropertyDeclaration): boolean {
  for (const child of node.getChildren()) {
    if (isSyntaxList(child)) {
      for (const syntaxList of child.getChildren()) {
        if (isInputDecorator(syntaxList)) {
          return true;
        }
      }
    }
  }

  return false;
}
