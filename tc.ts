import { Expr, Stmt, Type } from "./ast";

type functions = Map<string, [Type[], Type]>;
type variables = Map<string, Type>;

const opType = new Map<string, [string, Type]>();
opType.set("+", ["int", "int"]);
opType.set("-", ["int", "int"]);
opType.set("*", ["int", "int"]);
opType.set("%", ["int", "int"]);
opType.set("<=", ["int", "bool"]);
opType.set(">=", ["int", "bool"]);
opType.set("<", ["int", "bool"]);
opType.set(">", ["int", "bool"]);
opType.set("not", ["bool", "bool"]);
opType.set("==", ["int", "bool"]);
opType.set("!=", ["int", "bool"]);
opType.set("is", ["none", "bool"]);
opType.set("not", ["bool", "bool"]);

export function tcExpr(e: Expr<Type>, functions: functions, variables: variables): Type {
  switch (e.tag) {
    case "literal": return e.value.typ;
    case "name":
      if (!variables.has(e.name)) {
        throw new Error("TypeError: Variable " + e.name + " not defined.");
      }
      return variables.get(e.name);
    case "call":
      if (e.name === "print") {
        if (e.args.length !== 1) { throw new Error("TypeError: print expects a single argument"); }
        e.args[0].a = tcExpr(e.args[0], functions, variables)
        return e.args[0].a;
      }
      if (!functions.has(e.name)) {
        throw new Error(`TypeError: Function ${e.name} not found`);
      }
      const [args, ret] = functions.get(e.name);
      if (args.length !== e.args.length) {
        throw new Error(`TypeError: Expected ${args.length} arguments but got ${e.args.length}`);
      }
      args.forEach((a, i) => {
        const argtyp = tcExpr(e.args[i], functions, variables);
        if (a !== argtyp) { throw new Error(`TypeError: Got ${argtyp} as argument ${i + 1}, expected ${a}`); }
      });
      return ret;
    case "binop":
      var operator = e.op;
      var lhsType = tcExpr(e.left, functions, variables);
      var rhsType = tcExpr(e.right, functions, variables);
      if (opType.get(operator)[0] != lhsType || opType.get(operator)[0] != rhsType) {
        throw new Error("TypeError: Incompatible operands in binary expression.");
      }
      return opType.get(operator)[1];
    case "uniop":
      var operator = e.op;
      var operand = tcExpr(e.expr, functions, variables);
      if (opType.get(operator)[0] != operand) {
        throw new Error("TypeError: Incompatible operand in unary expression.");
      }
      return opType.get(operator)[1];
    default:
      throw new Error("TypeError: Unhandled expression")
  }
}

export function tcStmt(s: Stmt<Type>, functions: functions, variables: variables, currentReturn: Type): boolean {
  switch (s.tag) {
    case "assign": 
      const rhs = tcExpr(s.value, functions, variables);
      if (variables.has(s.name) && variables.get(s.name) != rhs) {
        throw new Error(`TypeError: Cannot assign ${rhs} to ${variables.get(s.name)}`);
      }
      else if (variables.has(s.name) && variables.get(s.name) != tcExpr(s.value, functions, variables)) {
        throw new Error("TypeError: Return type of function and variable do not match");
      }
      else { variables.set(s.name, rhs); }
      return false;
    case "while":
      if (tcExpr(s.cond, functions, variables) != "bool") {
        throw new Error("TypeError: Condition in while statement must be boolean");
      }
      return false;
    case "if":
      if (tcExpr(s.ifcond, functions, variables) != "bool") {
        throw new Error("TypeError: Condition in if statement must be boolean");
      }
      if (s.elifcond != undefined && tcExpr(s.elifcond, functions, variables) != "bool") {
        throw new Error("TypeError: Condition in elif statement must be boolean");
      }
      return false;
    case "define":
      const localvars = new Map<string, Type>(variables.entries());
      s.parameters.forEach(p => { localvars.set(p.name, p.type) });
      s.body.forEach(bs => tcStmt(bs, functions, localvars, s.ret));
      return false;
    case "expr": 
      return tcExpr(s.expr, functions, variables) == "bool";
    case "return": 
      const type = tcExpr(s.value, functions, variables);
      if (type !== currentReturn) {
        throw new Error(`TypeError: ${type} returned, ${currentReturn} expected.`);
      }
      return false;
  }
}

export function tcProgram(p: Stmt<Type>[]): boolean {
  const functions = new Map<string, [Type[], Type]>();
  functions.set("print", [["int", "bool"], "none"]);
  p.forEach(s => { if (s.tag === "define") {
      functions.set(s.name, [s.parameters.map(p => p.type), s.ret]);
    }
  });
  const globals = new Map<string, Type>();
  var type = false;
  p.forEach(s => {
    type = tcStmt(s, functions, globals, "none");
  });
  return type;
}