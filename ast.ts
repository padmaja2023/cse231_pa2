export type Program<A> = 
  | {glob: Array<Globals<A>>, statements: Array<Stmt<A>>}

export type Globals<A> = 
  | { tag: "varDef", value: VarDef}
  | { tag: "funcDef", value: FuncDef<A>}  

export type VarDef = 
  | {name: TypedVar, value: Literal}  

export type TypedVar = 
  | { a : Type, name: string} 

export type FuncDef<A> =
  | {a? : A, name: string, vars: Array<TypedVar>} 

export type FuncBody<A> = 
  | {varDefs: [{tag: "varDef", value: VarDef}], statements: [Stmt<A>]}

export type Stmt<A> =
  | { tag: "assign", name: string, type : string, value: Expr<A> }
  | {tag: "if", ifcond: Expr<A>, elifcond: Expr<A>, ifbody: Array<Stmt<A>>, elifbody: Array<Stmt<A>>, elsebody: Array<Stmt<A>>}
  | { tag: "while", cond: Expr<A>, body: Array<Stmt<A>> }
  | { tag: "pass" }
  | { tag: "return", value: Expr<A> }
  | { tag: "expr", expr: Expr<A> }
  | { tag: "define", name: string, parameters: Array<Parameter>, ret: Type, body: Array<Stmt<A>> }

export type Expr<A> = 
  | { a? : A, tag: "literal", value: Literal }
  | { a? : A, tag: "name", name: string }
  | { a? : A, tag: "uniop", expr: Expr<A>, op: string }
  | { a? : A, tag: "binop", left: Expr<A>, op: string, right: Expr<A> }
  | { a? : A, tag: "paranexpr", expr: Expr<A> }
  | { a? : A, tag: "call", name: string, args: Array<Expr<A>> }

export type Literal =
  | { typ: Type, value: string }
  | { typ: Type, value: number }
  
export type Type =
  | "int"
  | "bool"
  | "none"

export type Parameter =
  | { name: string, type: Type }
