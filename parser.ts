import { TreeCursor } from 'lezer';
import { parser } from 'lezer-python';
import { Parameter, Stmt, Expr, Type } from './ast';

var binops = ["+", "-", "*", "//", "%", "==", "!=", "<=", ">=", "<", ">", "is"]
var uniops = ["+", "-", "not"]

export function parseProgram(source: string): Array<Stmt<Type>> {
  const t = parser.parse(source).cursor();
  return traverseStmts(source, t);
}

export function traverseStmts(s: string, t: TreeCursor) {
  // The top node in the program is a Script node with a list of children
  // that are various statements
  t.firstChild();
  const stmts = [];
  do {
    stmts.push(traverseStmt(s, t));
  } while (t.nextSibling()); // t.nextSibling() returns false when it reaches
  //  the end of the list of children
  return stmts;
}

/*
  Invariant – t must focus on the same node at the end of the traversal
*/
export function traverseStmt(s: string, t: TreeCursor): Stmt<Type> {
  switch (t.type.name) {
    case "ReturnStatement":
      t.firstChild();  // Focus return keyword
      t.nextSibling(); // Focus expression
      var value = traverseExpr(s, t);
      t.parent();
      return { tag: "return", value };
    case "AssignStatement":
      t.firstChild(); // focused on name (the first child)
      var name = s.substring(t.from, t.to);
      t.nextSibling(); // focused on = sign. May need this for complex tasks, like +=!
      var type = "none";
      if (s.substring(t.from, t.to) != "=") {
        t.firstChild();
        t.nextSibling();
        type = s.substring(t.from, t.to);
        t.parent();
        t.nextSibling();
      }
      t.nextSibling(); // focused on the value expression
      var value = traverseExpr(s, t);
      t.parent();
      return { type: type, tag: "assign", name, value };
    case "ExpressionStatement":
      t.firstChild();
      var expr = traverseExpr(s, t);
      t.parent();
      return { tag: "expr", expr: expr };
    case "IfStatement":
      t.firstChild();
      t.nextSibling();

      const ifcond = traverseExpr(s, t);
      t.nextSibling();
      t.firstChild();
      const ifbody = [];
      while (t.nextSibling()) {
        ifbody.push(traverseStmt(s, t));
      }
      t.parent();

      t.nextSibling();
      var elifbody = [];
      var elifcond;
      if (s.substring(t.from, t.to) == "elif") {
        t.nextSibling();
        elifcond = traverseExpr(s, t);
        t.nextSibling();
        t.firstChild();
        while (t.nextSibling()) {
          elifbody.push(traverseStmt(s, t));
        }
        t.parent();
      }
      if (elifbody.length > 0) {
        t.nextSibling();
      }

      var elsebody = [];
      if (s.substring(t.from, t.to) == "else") {
        t.nextSibling();
        t.nextSibling();
        t.firstChild();
        while (t.nextSibling()) {
          elsebody.push(traverseStmt(s, t));
        }
        t.parent();
      }
      t.parent();
      return { tag: "if", ifcond, ifbody, elifcond, elifbody, elsebody }
    case "WhileStatement":
      t.firstChild();
      t.nextSibling();

      const cond = traverseExpr(s, t);
      t.nextSibling();
      t.firstChild();
      const whilebody = [];
      while (t.nextSibling()) {
        whilebody.push(traverseStmt(s, t));
      }
      t.parent();
      t.parent();
      return { tag: "while", cond, body: whilebody }
    case "FunctionDefinition":
      t.firstChild();  // Focus on def
      t.nextSibling(); // Focus on name of function
      var name = s.substring(t.from, t.to);
      t.nextSibling(); // Focus on ParamList
      var parameters = traverseParameters(s, t);
      t.nextSibling(); // Focus on Body or TypeDef
      let ret: Type = "none";
      let maybeTD = t;
      if (maybeTD.type.name === "TypeDef") {
        t.firstChild();
        ret = traverseType(s, t);
        t.parent();
      }
      t.nextSibling(); // Focus on single statement (for now)
      t.firstChild();  // Focus on :
      const body = [];
      while (t.nextSibling()) {
        body.push(traverseStmt(s, t));
      }
      t.parent();      // Pop to Body
      t.parent();      // Pop to FunctionDefinition
      return {
        tag: "define",
        name, parameters, body, ret
      }

  }
}

export function traverseType(s: string, t: TreeCursor): Type {
  switch (t.type.name) {
    case "VariableName":
      const name = s.substring(t.from, t.to);
      if (!(name == "int" || name == "bool" || name == "none")) {
        throw new Error("ParseError: Unknown type: " + name)
      }
      return name;
    default:
      throw new Error("ParseError: Unknown type: " + t.type.name)

  }
}

export function traverseParameters(s: string, t: TreeCursor): Array<Parameter> {
  t.firstChild();  // Focuses on open paren
  const parameters = []
  t.nextSibling(); // Focuses on a VariableName
  while (t.type.name !== ")") {
    let name = s.substring(t.from, t.to);
    t.nextSibling(); // Focuses on "TypeDef", hopefully, or "," if mistake

    let nextTagName = t.type.name; 
    if (nextTagName !== "TypeDef") { throw new Error("ParseError: Parameter type not mentioned " + name) };
    t.firstChild();  // Enter TypeDef
    t.nextSibling(); // Focuses on type itself
    var type = traverseType(s, t);
    t.parent();
    t.nextSibling(); // Move on to comma or ")"
    parameters.push({ name, type });
    t.nextSibling(); // Focuses on a VariableName
  }
  t.parent();       // Pop to ParamList
  return parameters;
}

export function traverseExpr(s: string, t: TreeCursor): Expr<Type> {
  switch (t.type.name) {
    case "Boolean":
      return { a: "bool", tag: "literal", value: { typ: "bool", value: s.substring(t.from, t.to) } };
    case "Number":
      return { a: "int", tag: "literal", value: { typ: "int", value: Number(s.substring(t.from, t.to)) } };
    case "None":
      return { a: "none", tag: "literal", value: { typ: "none", value: s.substring(t.from, t.to) } };
    case "VariableName":
      return { tag: "name", name: s.substring(t.from, t.to) };
    case "BinaryExpression":
      t.firstChild();
      const left = traverseExpr(s, t);
      t.nextSibling()
      const binopr = s.substring(t.from, t.to)
      if (!binops.includes(binopr)) {
        throw new Error("ParseError: Invalid binary operation (+,-,*,//,%,==,!=,<=,>=,<,> is)")
      }
      t.nextSibling()
      const right = traverseExpr(s, t);
      t.parent()
      return { tag: "binop", left, op: binopr, right }
    case "UnaryExpression":
      t.firstChild();
      const uniopr = s.substring(t.from, t.to);
      t.nextSibling();
      const val = traverseExpr(s, t);
      if (!uniops.includes(uniopr)) {
        throw new Error("ParseError: Invalid unary operation (not, +, -)")
      }
      t.parent();
      return { tag: "uniop", expr: val, op: uniopr }
    case "ParenthesizedExpression":
      t.firstChild();
      t.nextSibling();
      const expr = traverseExpr(s, t);
      t.parent()
      return expr;
    case "CallExpression":
      t.firstChild(); // Focus name
      const name = s.substring(t.from, t.to);
      t.nextSibling(); // Focus ArgList
      t.firstChild(); // Focus open paren
      var args = traverseArguments(t, s);
      t.parent();
      t.parent();
      return { tag: "call", name, args };
  }
}

export function traverseArguments(c: TreeCursor, s: string): Expr<Type>[] {
  const args = [];
  c.nextSibling();
  while (c.type.name !== ")") {
    let expr = traverseExpr(s, c);
    args.push(expr);
    c.nextSibling(); // Focuses on either "," or ")"
    c.nextSibling(); // Focuses on a VariableName
  }
  return args;
}