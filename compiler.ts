import wabt from 'wabt';
import { Stmt, Expr, Type } from './ast';
import { parseProgram } from './parser';
import { tcProgram } from './tc';

type Env = Map<string, boolean>;

export async function run(watSource: string, import_object: any): Promise<number> {
  const wabtApi = await wabt();

  // Next three lines are wat2wasm
  const parsed = wabtApi.parseWat("example", watSource);
  const binary = parsed.toBinary({});
  const wasmModule = await WebAssembly.instantiate(binary.buffer, import_object);

  // This next line is wasm-interp
  return (wasmModule.instance.exports as any)._start();
}

(window as any)["runWat"] = run;

function variableNames(stmts: Stmt<Type>[]): string[] {
  const vars: Array<string> = [];
  stmts.forEach((stmt) => {
    if (stmt.tag === "assign") { vars.push(stmt.name); }
  });
  return vars;
}

export function codeGenExpr(expr: Expr<Type>, locals: Env): Array<string> {
  const opCode = new Map<string, string>();
  opCode.set("+", "(i32.add)");
  opCode.set("-", "(i32.sub)");
  opCode.set("*", "(i32.mul)");
  opCode.set("%", "(i32.rem_s)");
  opCode.set("<=", "(i32.le_s)");
  opCode.set(">=", "(i32.ge_s)");
  opCode.set("<", "(i32.lt_s)");
  opCode.set(">", "(i32.gt_s)");
  opCode.set("not", "(i32.not)");
  opCode.set("==", "(i32.eq)");
  opCode.set("!=", "(i32.ne)");
  opCode.set("is", "(i32.eq)");
  opCode.set("not", "(i32.xnor)");

  switch (expr.tag) {
    case "name":
      if (locals.has(expr.name)) { return [`(local.get $${expr.name})`]; }
      else { return [`(global.get $${expr.name})`]; }
    case "literal":
      if (expr.value.typ == "int") { return [`(i32.const ${expr.value.value})`]; }
      else if (expr.value.typ == "bool") {
        if (expr.value.value == "True") { return [`(i32.const 1)`]; }
        else { return [`(i32.const 0)`]; }
      } else {
        return [`(i32.const 0)`];
      }
    case "call":
      const valStmts = expr.args.map(e => codeGenExpr(e, locals)).flat();
      let toCall = expr.name;
      if (expr.name === "print") {
        switch (expr.args[0].a) {
          case "bool": toCall = "print_bool"; break;
          case "int": toCall = "print_num"; break;
          case "none": toCall = "print_none"; break;
        }
      }
      valStmts.push(`(call $${toCall})`);
      return valStmts;
    case "uniop":
      var ops = opCode.get(expr.op);
      var stmts = codeGenExpr(expr.expr, locals);
      if (expr.op == "not") {
        return stmts.concat(`(call $not_operator)`);
      }
      return [`(i32.const 0)`].concat(stmts, ops);
    case "binop":
      var left = codeGenExpr(expr.left, locals);
      var right = codeGenExpr(expr.right, locals);
      var ops = opCode.get(expr.op);
      return left.concat(right, ops);
  }
}

export function codeGenStmt(stmt: Stmt<Type>, locals: Env): Array<string> {
  switch (stmt.tag) {
    case "assign":
      var valStmts = codeGenExpr(stmt.value, locals);
      if (locals.has(stmt.name)) { valStmts.push(`(local.set $${stmt.name})`); }
      else { valStmts.push(`(global.set $${stmt.name})`); }
      return [].concat(valStmts);
    case "expr":
      const result = codeGenExpr(stmt.expr, locals);
      result.push("(local.set $scratch)");
      return result;
    case "if":
      var ifcond = codeGenExpr(stmt.ifcond, locals).flat().join("\n");
      var if_body: Array<string> = [];
      stmt.ifbody.forEach((b) => {
        var st = codeGenStmt(b, locals);
        if_body = if_body.concat(st);
      });
      const ifbody = if_body.flat().join("\n");
      
      var elifExists = false;
      var elseExists = false;
      if (stmt.elifcond != undefined) {
        var elifcond = codeGenExpr(stmt.elifcond, locals).flat().join("\n");
        var elif_body: Array<string> = [];
        stmt.elifbody.forEach((b) => {
          elif_body = elif_body.concat(codeGenStmt(b, locals));
        });
        var elifbody = elif_body.flat().join("\n");
        elifExists = true;
      }

      if (stmt.elsebody.length > 0) {
        var else_body: Array<string> = [];
        stmt.elsebody.forEach((b) => {
          var st = codeGenStmt(b, locals);
          else_body = else_body.concat(st);
        });
        var elsebody = else_body.flat().join("\n");
        elseExists = true;
      }

      if (elifExists && elseExists) {
        return [`${ifcond} ( if  
          (then
            ${ifbody}
          )
          (else
            
            ${elifcond} ( if
              (then
                ${elifbody}
              )
              (else
                ${elsebody} 
              )
            )
          )
        )`]
      }
      else if (elifExists) {
        return [`${ifcond} ( if  
          (then
            ${ifbody}
          )
          (else
            
            ${elsebody} 
          )
        )`]
      }
      else {
        return [`${ifcond} ( if  
        (then
          ${ifbody}
        ))`]
      }
    case "while":
      var cond = codeGenExpr(stmt.cond, locals);
      var condition = cond.flat().join("\n");
      var body: Array<string> = [];
      stmt.body.forEach((b) => {
        var st = codeGenStmt(b, locals);
        body = body.concat(st);
      });
      const whilebody = body.flat().join("\n");
      return [`
          (loop
            
            ${whilebody}
            (br_if 0 ${condition})
            )`];
    case "define":
      const withParamsAndVariables = new Map<string, boolean>(locals.entries());
      const variables = variableNames(stmt.body);
      variables.forEach(v => withParamsAndVariables.set(v, true));
      stmt.parameters.forEach(p => withParamsAndVariables.set(p.name, true));

      const params = stmt.parameters.map(p => `(param $${p.name} i32)`).join(" ");
      const localDecls = variables.map(v => `(local $${v} i32)`).join("\n");
      const stmts = stmt.body.map(s => codeGenStmt(s, withParamsAndVariables)).flat();
      const stmtsBody = stmts.join("\n");
      return [`(func $${stmt.name} ${params} (result i32)
      (local $scratch i32)
      ${localDecls}
      ${stmtsBody}
      (i32.const 0))`];
    case "return":
      var valStmts = codeGenExpr(stmt.value, locals);
      valStmts.push("return");
      return valStmts;
    
  }
}


export function compile(source: string): string {
  const ast = parseProgram(source);
  tcProgram(ast);

  const env = new Map<string, boolean>();
  const vars: Array<string> = [];
  ast.forEach((stmt) => {
    if (stmt.tag === "assign") { vars.push(stmt.name); }
  });
  const funcs: Array<string> = [];
  ast.forEach((stmt) => {
    if (stmt.tag === "define") { funcs.push(codeGenStmt(stmt, env).join("\n")); }
  });

  const allFuns = funcs.join("\n\n");
  const stmts = ast.filter((stmt) => stmt.tag !== "define");
  var uniqVars = vars.filter(function (e, i) { return vars.indexOf(e) == i; })
  const globDecls = uniqVars.map(v => `(global $${v} (mut i32) (i32.const 0))`).join("\n");

  const allStmts = stmts.map(s => codeGenStmt(s, env)).flat();

  const main = [`(local $scratch i32)`, ...allStmts].join("\n");

  const lastStmt = ast[ast.length - 1];
  const isExpr = lastStmt.tag === "expr";
  var retType = "";
  var retVal = "";
  if (isExpr) {
    retType = "(result i32)";
    retVal = "(local.get $scratch)"
  }

  return `
    (module
      (func $print_num (import "imports" "print_num") (param i32) (result i32))
      (func $print_bool (import "imports" "print_bool") (param i32) (result i32))
      (func $print_none (import "imports" "print_none") (param i32) (result i32))
      (func $not_operator (import "imports" "not_operator") (param i32) (result i32))
      ${globDecls}
      ${allFuns}
      (func (export "_start") ${retType}
        ${main}
        ${retVal}
      )
    ) 
  `;
}
