/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./compiler.ts":
/*!*********************!*\
  !*** ./compiler.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.compile = exports.codeGenStmt = exports.codeGenExpr = exports.run = void 0;
var wabt_1 = __importDefault(__webpack_require__(/*! wabt */ "wabt"));
var parser_1 = __webpack_require__(/*! ./parser */ "./parser.ts");
var tc_1 = __webpack_require__(/*! ./tc */ "./tc.ts");
function run(watSource, import_object) {
    return __awaiter(this, void 0, void 0, function () {
        var wabtApi, parsed, binary, wasmModule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, wabt_1.default)()];
                case 1:
                    wabtApi = _a.sent();
                    parsed = wabtApi.parseWat("example", watSource);
                    binary = parsed.toBinary({});
                    return [4 /*yield*/, WebAssembly.instantiate(binary.buffer, import_object)];
                case 2:
                    wasmModule = _a.sent();
                    // This next line is wasm-interp
                    return [2 /*return*/, wasmModule.instance.exports._start()];
            }
        });
    });
}
exports.run = run;
window["runWat"] = run;
function variableNames(stmts) {
    var vars = [];
    stmts.forEach(function (stmt) {
        if (stmt.tag === "assign") {
            vars.push(stmt.name);
        }
    });
    return vars;
}
function codeGenExpr(expr, locals) {
    var opCode = new Map();
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
            if (locals.has(expr.name)) {
                return ["(local.get $".concat(expr.name, ")")];
            }
            else {
                return ["(global.get $".concat(expr.name, ")")];
            }
        case "literal":
            if (expr.value.typ == "int") {
                return ["(i32.const ".concat(expr.value.value, ")")];
            }
            else if (expr.value.typ == "bool") {
                if (expr.value.value == "True") {
                    return ["(i32.const 1)"];
                }
                else {
                    return ["(i32.const 0)"];
                }
            }
            else {
                return ["(i32.const 0)"];
            }
        case "call":
            var valStmts = expr.args.map(function (e) { return codeGenExpr(e, locals); }).flat();
            var toCall = expr.name;
            if (expr.name === "print") {
                switch (expr.args[0].a) {
                    case "bool":
                        toCall = "print_bool";
                        break;
                    case "int":
                        toCall = "print_num";
                        break;
                    case "none":
                        toCall = "print_none";
                        break;
                }
            }
            valStmts.push("(call $".concat(toCall, ")"));
            return valStmts;
        case "uniop":
            var ops = opCode.get(expr.op);
            var stmts = codeGenExpr(expr.expr, locals);
            if (expr.op == "not") {
                return stmts.concat("(call $not_operator)");
            }
            return ["(i32.const 0)"].concat(stmts, ops);
        case "binop":
            var left = codeGenExpr(expr.left, locals);
            var right = codeGenExpr(expr.right, locals);
            var ops = opCode.get(expr.op);
            return left.concat(right, ops);
    }
}
exports.codeGenExpr = codeGenExpr;
function codeGenStmt(stmt, locals) {
    switch (stmt.tag) {
        case "assign":
            var valStmts = codeGenExpr(stmt.value, locals);
            if (locals.has(stmt.name)) {
                valStmts.push("(local.set $".concat(stmt.name, ")"));
            }
            else {
                valStmts.push("(global.set $".concat(stmt.name, ")"));
            }
            return [].concat(valStmts);
        case "expr":
            var result = codeGenExpr(stmt.expr, locals);
            result.push("(local.set $scratch)");
            return result;
        case "if":
            var ifcond = codeGenExpr(stmt.ifcond, locals).flat().join("\n");
            var if_body = [];
            stmt.ifbody.forEach(function (b) {
                var st = codeGenStmt(b, locals);
                if_body = if_body.concat(st);
            });
            var ifbody = if_body.flat().join("\n");
            var elifExists = false;
            var elseExists = false;
            if (stmt.elifcond != undefined) {
                var elifcond = codeGenExpr(stmt.elifcond, locals).flat().join("\n");
                var elif_body = [];
                stmt.elifbody.forEach(function (b) {
                    elif_body = elif_body.concat(codeGenStmt(b, locals));
                });
                var elifbody = elif_body.flat().join("\n");
                elifExists = true;
            }
            if (stmt.elsebody.length > 0) {
                var else_body = [];
                stmt.elsebody.forEach(function (b) {
                    var st = codeGenStmt(b, locals);
                    else_body = else_body.concat(st);
                });
                var elsebody = else_body.flat().join("\n");
                elseExists = true;
            }
            if (elifExists && elseExists) {
                return ["".concat(ifcond, " ( if  \n          (then\n            ").concat(ifbody, "\n          )\n          (else\n            \n            ").concat(elifcond, " ( if\n              (then\n                ").concat(elifbody, "\n              )\n              (else\n                ").concat(elsebody, " \n              )\n            )\n          )\n        )")];
            }
            else if (elifExists) {
                return ["".concat(ifcond, " ( if  \n          (then\n            ").concat(ifbody, "\n          )\n          (else\n            \n            ").concat(elsebody, " \n          )\n        )")];
            }
            else {
                return ["".concat(ifcond, " ( if  \n        (then\n          ").concat(ifbody, "\n        ))")];
            }
        case "while":
            var cond = codeGenExpr(stmt.cond, locals);
            var condition = cond.flat().join("\n");
            var body = [];
            stmt.body.forEach(function (b) {
                var st = codeGenStmt(b, locals);
                body = body.concat(st);
            });
            var whilebody = body.flat().join("\n");
            return ["\n          (loop\n            \n            ".concat(whilebody, "\n            (br_if 0 ").concat(condition, ")\n            )")];
        case "define":
            var withParamsAndVariables_1 = new Map(locals.entries());
            var variables = variableNames(stmt.body);
            variables.forEach(function (v) { return withParamsAndVariables_1.set(v, true); });
            stmt.parameters.forEach(function (p) { return withParamsAndVariables_1.set(p.name, true); });
            var params = stmt.parameters.map(function (p) { return "(param $".concat(p.name, " i32)"); }).join(" ");
            var localDecls = variables.map(function (v) { return "(local $".concat(v, " i32)"); }).join("\n");
            var stmts = stmt.body.map(function (s) { return codeGenStmt(s, withParamsAndVariables_1); }).flat();
            var stmtsBody = stmts.join("\n");
            return ["(func $".concat(stmt.name, " ").concat(params, " (result i32)\n      (local $scratch i32)\n      ").concat(localDecls, "\n      ").concat(stmtsBody, "\n      (i32.const 0))")];
        case "return":
            var valStmts = codeGenExpr(stmt.value, locals);
            valStmts.push("return");
            return valStmts;
    }
}
exports.codeGenStmt = codeGenStmt;
function compile(source) {
    var ast = (0, parser_1.parseProgram)(source);
    (0, tc_1.tcProgram)(ast);
    var env = new Map();
    var vars = [];
    ast.forEach(function (stmt) {
        if (stmt.tag === "assign") {
            vars.push(stmt.name);
        }
    });
    var funcs = [];
    ast.forEach(function (stmt) {
        if (stmt.tag === "define") {
            funcs.push(codeGenStmt(stmt, env).join("\n"));
        }
    });
    var allFuns = funcs.join("\n\n");
    var stmts = ast.filter(function (stmt) { return stmt.tag !== "define"; });
    var uniqVars = vars.filter(function (e, i) { return vars.indexOf(e) == i; });
    var globDecls = uniqVars.map(function (v) { return "(global $".concat(v, " (mut i32) (i32.const 0))"); }).join("\n");
    var allStmts = stmts.map(function (s) { return codeGenStmt(s, env); }).flat();
    var main = __spreadArray(["(local $scratch i32)"], allStmts, true).join("\n");
    var lastStmt = ast[ast.length - 1];
    var isExpr = lastStmt.tag === "expr";
    var retType = "";
    var retVal = "";
    if (isExpr) {
        retType = "(result i32)";
        retVal = "(local.get $scratch)";
    }
    return "\n    (module\n      (func $print_num (import \"imports\" \"print_num\") (param i32) (result i32))\n      (func $print_bool (import \"imports\" \"print_bool\") (param i32) (result i32))\n      (func $print_none (import \"imports\" \"print_none\") (param i32) (result i32))\n      (func $not_operator (import \"imports\" \"not_operator\") (param i32) (result i32))\n      ".concat(globDecls, "\n      ").concat(allFuns, "\n      (func (export \"_start\") ").concat(retType, "\n        ").concat(main, "\n        ").concat(retVal, "\n      )\n    ) \n  ");
}
exports.compile = compile;


/***/ }),

/***/ "./parser.ts":
/*!*******************!*\
  !*** ./parser.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.traverseArguments = exports.traverseExpr = exports.traverseParameters = exports.traverseType = exports.traverseStmt = exports.traverseStmts = exports.parseProgram = void 0;
var lezer_python_1 = __webpack_require__(/*! lezer-python */ "./node_modules/lezer-python/dist/index.cjs");
var binops = ["+", "-", "*", "//", "%", "==", "!=", "<=", ">=", "<", ">", "is"];
var uniops = ["+", "-", "not"];
function parseProgram(source) {
    var t = lezer_python_1.parser.parse(source).cursor();
    return traverseStmts(source, t);
}
exports.parseProgram = parseProgram;
function traverseStmts(s, t) {
    // The top node in the program is a Script node with a list of children
    // that are various statements
    t.firstChild();
    var stmts = [];
    do {
        stmts.push(traverseStmt(s, t));
    } while (t.nextSibling()); // t.nextSibling() returns false when it reaches
    //  the end of the list of children
    return stmts;
}
exports.traverseStmts = traverseStmts;
/*
  Invariant – t must focus on the same node at the end of the traversal
*/
function traverseStmt(s, t) {
    switch (t.type.name) {
        case "ReturnStatement":
            t.firstChild(); // Focus return keyword
            t.nextSibling(); // Focus expression
            var value = traverseExpr(s, t);
            t.parent();
            return { tag: "return", value: value };
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
            return { type: type, tag: "assign", name: name, value: value };
        case "ExpressionStatement":
            t.firstChild();
            var expr = traverseExpr(s, t);
            t.parent();
            return { tag: "expr", expr: expr };
        case "IfStatement":
            t.firstChild();
            t.nextSibling();
            var ifcond = traverseExpr(s, t);
            t.nextSibling();
            t.firstChild();
            var ifbody = [];
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
            return { tag: "if", ifcond: ifcond, ifbody: ifbody, elifcond: elifcond, elifbody: elifbody, elsebody: elsebody };
        case "WhileStatement":
            t.firstChild();
            t.nextSibling();
            var cond = traverseExpr(s, t);
            t.nextSibling();
            t.firstChild();
            var whilebody = [];
            while (t.nextSibling()) {
                whilebody.push(traverseStmt(s, t));
            }
            t.parent();
            t.parent();
            return { tag: "while", cond: cond, body: whilebody };
        case "FunctionDefinition":
            t.firstChild(); // Focus on def
            t.nextSibling(); // Focus on name of function
            var name = s.substring(t.from, t.to);
            t.nextSibling(); // Focus on ParamList
            var parameters = traverseParameters(s, t);
            t.nextSibling(); // Focus on Body or TypeDef
            var ret = "none";
            var maybeTD = t;
            if (maybeTD.type.name === "TypeDef") {
                t.firstChild();
                ret = traverseType(s, t);
                t.parent();
            }
            t.nextSibling(); // Focus on single statement (for now)
            t.firstChild(); // Focus on :
            var body = [];
            while (t.nextSibling()) {
                body.push(traverseStmt(s, t));
            }
            t.parent(); // Pop to Body
            t.parent(); // Pop to FunctionDefinition
            return {
                tag: "define",
                name: name,
                parameters: parameters,
                body: body,
                ret: ret
            };
    }
}
exports.traverseStmt = traverseStmt;
function traverseType(s, t) {
    switch (t.type.name) {
        case "VariableName":
            var name_1 = s.substring(t.from, t.to);
            if (!(name_1 == "int" || name_1 == "bool" || name_1 == "none")) {
                throw new Error("ParseError: Unknown type: " + name_1);
            }
            return name_1;
        default:
            throw new Error("ParseError: Unknown type: " + t.type.name);
    }
}
exports.traverseType = traverseType;
function traverseParameters(s, t) {
    t.firstChild(); // Focuses on open paren
    var parameters = [];
    t.nextSibling(); // Focuses on a VariableName
    while (t.type.name !== ")") {
        var name_2 = s.substring(t.from, t.to);
        t.nextSibling(); // Focuses on "TypeDef", hopefully, or "," if mistake
        var nextTagName = t.type.name;
        if (nextTagName !== "TypeDef") {
            throw new Error("ParseError: Parameter type not mentioned " + name_2);
        }
        ;
        t.firstChild(); // Enter TypeDef
        t.nextSibling(); // Focuses on type itself
        var type = traverseType(s, t);
        t.parent();
        t.nextSibling(); // Move on to comma or ")"
        parameters.push({ name: name_2, type: type });
        t.nextSibling(); // Focuses on a VariableName
    }
    t.parent(); // Pop to ParamList
    return parameters;
}
exports.traverseParameters = traverseParameters;
function traverseExpr(s, t) {
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
            var left = traverseExpr(s, t);
            t.nextSibling();
            var binopr = s.substring(t.from, t.to);
            if (!binops.includes(binopr)) {
                throw new Error("ParseError: Invalid binary operation (+,-,*,//,%,==,!=,<=,>=,<,> is)");
            }
            t.nextSibling();
            var right = traverseExpr(s, t);
            t.parent();
            return { tag: "binop", left: left, op: binopr, right: right };
        case "UnaryExpression":
            t.firstChild();
            var uniopr = s.substring(t.from, t.to);
            t.nextSibling();
            var val = traverseExpr(s, t);
            if (!uniops.includes(uniopr)) {
                throw new Error("ParseError: Invalid unary operation (not, +, -)");
            }
            t.parent();
            return { tag: "uniop", expr: val, op: uniopr };
        case "ParenthesizedExpression":
            t.firstChild();
            t.nextSibling();
            var expr = traverseExpr(s, t);
            t.parent();
            return expr;
        case "CallExpression":
            t.firstChild(); // Focus name
            var name_3 = s.substring(t.from, t.to);
            t.nextSibling(); // Focus ArgList
            t.firstChild(); // Focus open paren
            var args = traverseArguments(t, s);
            t.parent();
            t.parent();
            return { tag: "call", name: name_3, args: args };
    }
}
exports.traverseExpr = traverseExpr;
function traverseArguments(c, s) {
    var args = [];
    c.nextSibling();
    while (c.type.name !== ")") {
        var expr = traverseExpr(s, c);
        args.push(expr);
        c.nextSibling(); // Focuses on either "," or ")"
        c.nextSibling(); // Focuses on a VariableName
    }
    return args;
}
exports.traverseArguments = traverseArguments;


/***/ }),

/***/ "./tc.ts":
/*!***************!*\
  !*** ./tc.ts ***!
  \***************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tcProgram = exports.tcStmt = exports.tcExpr = void 0;
var opType = new Map();
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
function tcExpr(e, functions, variables) {
    switch (e.tag) {
        case "literal": return e.value.typ;
        case "name":
            if (!variables.has(e.name)) {
                throw new Error("TypeError: Variable " + e.name + " not defined.");
            }
            return variables.get(e.name);
        case "call":
            if (e.name === "print") {
                if (e.args.length !== 1) {
                    throw new Error("TypeError: print expects a single argument");
                }
                e.args[0].a = tcExpr(e.args[0], functions, variables);
                return e.args[0].a;
            }
            if (!functions.has(e.name)) {
                throw new Error("TypeError: Function ".concat(e.name, " not found"));
            }
            var _a = functions.get(e.name), args = _a[0], ret = _a[1];
            if (args.length !== e.args.length) {
                throw new Error("TypeError: Expected ".concat(args.length, " arguments but got ").concat(e.args.length));
            }
            args.forEach(function (a, i) {
                var argtyp = tcExpr(e.args[i], functions, variables);
                if (a !== argtyp) {
                    throw new Error("TypeError: Got ".concat(argtyp, " as argument ").concat(i + 1, ", expected ").concat(a));
                }
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
            throw new Error("TypeError: Unhandled expression");
    }
}
exports.tcExpr = tcExpr;
function tcStmt(s, functions, variables, currentReturn) {
    switch (s.tag) {
        case "assign":
            var rhs = tcExpr(s.value, functions, variables);
            if (variables.has(s.name) && variables.get(s.name) != rhs) {
                throw new Error("TypeError: Cannot assign ".concat(rhs, " to ").concat(variables.get(s.name)));
            }
            else if (variables.has(s.name) && variables.get(s.name) != tcExpr(s.value, functions, variables)) {
                throw new Error("TypeError: Return type of function and variable do not match");
            }
            else {
                variables.set(s.name, rhs);
            }
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
            var localvars_1 = new Map(variables.entries());
            s.parameters.forEach(function (p) { localvars_1.set(p.name, p.type); });
            s.body.forEach(function (bs) { return tcStmt(bs, functions, localvars_1, s.ret); });
            return false;
        case "expr":
            return tcExpr(s.expr, functions, variables) == "bool";
        case "return":
            var type = tcExpr(s.value, functions, variables);
            if (type !== currentReturn) {
                throw new Error("TypeError: ".concat(type, " returned, ").concat(currentReturn, " expected."));
            }
            return false;
    }
}
exports.tcStmt = tcStmt;
function tcProgram(p) {
    var functions = new Map();
    functions.set("print", [["int", "bool"], "none"]);
    p.forEach(function (s) {
        if (s.tag === "define") {
            functions.set(s.name, [s.parameters.map(function (p) { return p.type; }), s.ret]);
        }
    });
    var globals = new Map();
    var type = false;
    p.forEach(function (s) {
        type = tcStmt(s, functions, globals, "none");
    });
    return type;
}
exports.tcProgram = tcProgram;


/***/ }),

/***/ "./webstart.ts":
/*!*********************!*\
  !*** ./webstart.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var compiler_1 = __webpack_require__(/*! ./compiler */ "./compiler.ts");
document.addEventListener("DOMContentLoaded", function () { return __awaiter(void 0, void 0, void 0, function () {
    function display(arg) {
        var output = document.getElementById("output");
        output.textContent += arg + "\n";
    }
    var importObject, runButton, userCode;
    return __generator(this, function (_a) {
        importObject = {
            imports: {
                print_num: function (arg) {
                    console.log("Logging from WASM: ", arg);
                    display(String(arg));
                    return arg;
                },
                not_operator: function (arg) {
                    console.log("Logging from WASM: ", arg);
                    console.log("Logging from WASM: ", arg);
                    display(String(!arg));
                    return !arg;
                },
                print_bool: function (arg) {
                    if (arg === 0) {
                        display("False");
                    }
                    else {
                        display("True");
                    }
                    return arg;
                },
                print_none: function (arg) {
                    display("None");
                    return arg;
                },
                print_any: function (arg) {
                    display(arg.toString());
                    return arg;
                }
            },
        };
        runButton = document.getElementById("run");
        userCode = document.getElementById("user-code");
        runButton.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
            var program, output, wat, code, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        program = userCode.value;
                        output = document.getElementById("output");
                        output.innerHTML = "";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        wat = (0, compiler_1.compile)(program);
                        code = document.getElementById("generated-code");
                        code.textContent = wat;
                        return [4 /*yield*/, (0, compiler_1.run)(wat, importObject)];
                    case 2:
                        result = _a.sent();
                        output.textContent += String(result);
                        output.setAttribute("style", "color: black");
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        output.textContent = String(e_1);
                        output.setAttribute("style", "color: red");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        userCode.value = localStorage.getItem("program");
        userCode.addEventListener("keypress", function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                localStorage.setItem("program", userCode.value);
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });


/***/ }),

/***/ "wabt":
/*!***********************!*\
  !*** external "wabt" ***!
  \***********************/
/***/ ((module) => {

module.exports = wabt;

/***/ }),

/***/ "./node_modules/lezer-python/dist/index.cjs":
/*!**************************************************!*\
  !*** ./node_modules/lezer-python/dist/index.cjs ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var lezer = __webpack_require__(/*! lezer */ "./node_modules/lezer/dist/index.cjs");

// This file was generated by lezer-generator. You probably shouldn't edit it.
const printKeyword = 1,
  indent = 162,
  dedent = 163,
  newline$1 = 164,
  newlineBracketed = 165,
  newlineEmpty = 166,
  eof = 167,
  ParenthesizedExpression = 21,
  TupleExpression = 47,
  ComprehensionExpression = 48,
  ArrayExpression = 52,
  ArrayComprehensionExpression = 55,
  DictionaryExpression = 56,
  DictionaryComprehensionExpression = 59,
  SetExpression = 60,
  SetComprehensionExpression = 61,
  ArgList = 63,
  ParamList = 121;

const newline = 10, carriageReturn = 13, space = 32, tab = 9, hash = 35, parenOpen = 40, dot = 46;

const bracketed = [
  ParenthesizedExpression, TupleExpression, ComprehensionExpression, ArrayExpression, ArrayComprehensionExpression,
  DictionaryExpression, DictionaryComprehensionExpression, SetExpression, SetComprehensionExpression, ArgList, ParamList
];

let cachedIndent = 0, cachedInput = null, cachedPos = 0;
function getIndent(input, pos) {
  if (pos == cachedPos && input == cachedInput) return cachedIndent
  cachedInput = input; cachedPos = pos;
  return cachedIndent = getIndentInner(input, pos)
}

function getIndentInner(input, pos) {
  for (let indent = 0;; pos++) {
    let ch = input.get(pos);
    if (ch == space) indent++;
    else if (ch == tab) indent += 8 - (indent % 8);
    else if (ch == newline || ch == carriageReturn || ch == hash) return -1
    else return indent
  }
}

const newlines = new lezer.ExternalTokenizer((input, token, stack) => {
  let next = input.get(token.start);
  if (next < 0) {
    token.accept(eof, token.start);
  } else if (next != newline && next != carriageReturn) ; else if (stack.startOf(bracketed) != null) {
    token.accept(newlineBracketed, token.start + 1);
  } else if (getIndent(input, token.start + 1) < 0) {
    token.accept(newlineEmpty, token.start + 1);
  } else {
    token.accept(newline$1, token.start + 1);
  }
}, {contextual: true, fallback: true});

const indentation = new lezer.ExternalTokenizer((input, token, stack) => {
  let prev = input.get(token.start - 1), depth;
  if ((prev == newline || prev == carriageReturn) &&
      (depth = getIndent(input, token.start)) >= 0 &&
      depth != stack.context.depth &&
      stack.startOf(bracketed) == null)
    token.accept(depth < stack.context.depth ? dedent : indent, token.start);
});

function IndentLevel(parent, depth) {
  this.parent = parent;
  this.depth = depth;
  this.hash = (parent ? parent.hash + parent.hash << 8 : 0) + depth + (depth << 4);
}

const topIndent = new IndentLevel(null, 0);

const trackIndent = new lezer.ContextTracker({
  start: topIndent,
  shift(context, term, input, stack) {
    return term == indent ? new IndentLevel(context, getIndent(input, stack.pos)) :
      term == dedent ? context.parent : context
  },
  hash(context) { return context.hash }
});

const legacyPrint = new lezer.ExternalTokenizer((input, token) => {
  let pos = token.start;
  for (let print = "print", i = 0; i < print.length; i++, pos++)
    if (input.get(pos) != print.charCodeAt(i)) return
  let end = pos;
  if (/\w/.test(String.fromCharCode(input.get(pos)))) return
  for (;; pos++) {
    let next = input.get(pos);
    if (next == space || next == tab) continue
    if (next != parenOpen && next != dot && next != newline && next != carriageReturn && next != hash)
      token.accept(printKeyword, end);
    return
  }
});

// This file was generated by lezer-generator. You probably shouldn't edit it.
const spec_identifier = {__proto__:null,await:40, or:48, and:50, in:54, not:56, is:58, if:64, else:66, lambda:70, yield:88, from:90, async:98, for:100, None:152, True:154, False:154, del:168, pass:172, break:176, continue:180, return:184, raise:192, import:196, as:198, global:202, nonlocal:204, assert:208, elif:218, while:222, try:228, except:230, finally:232, with:236, def:240, class:250};
const parser = lezer.Parser.deserialize({
  version: 13,
  states: "!?|O`Q$IXOOO%cQ$I[O'#GaOOQ$IS'#Cm'#CmOOQ$IS'#Cn'#CnO'RQ$IWO'#ClO(tQ$I[O'#G`OOQ$IS'#Ga'#GaOOQ$IS'#DR'#DROOQ$IS'#G`'#G`O)bQ$IWO'#CqO)rQ$IWO'#DbO*SQ$IWO'#DfOOQ$IS'#Ds'#DsO*gO`O'#DsO*oOpO'#DsO*wO!bO'#DtO+SO#tO'#DtO+_O&jO'#DtO+jO,UO'#DtO-lQ$I[O'#GQOOQ$IS'#GQ'#GQO'RQ$IWO'#GPO/OQ$I[O'#GPOOQ$IS'#E]'#E]O/gQ$IWO'#E^OOQ$IS'#GO'#GOO/qQ$IWO'#F}OOQ$IV'#F}'#F}O/|Q$IWO'#FPOOQ$IS'#Fr'#FrO0RQ$IWO'#FOOOQ$IV'#HZ'#HZOOQ$IV'#F|'#F|OOQ$IT'#FR'#FRQ`Q$IXOOO'RQ$IWO'#CoO0aQ$IWO'#CzO0hQ$IWO'#DOO0vQ$IWO'#GeO1WQ$I[O'#EQO'RQ$IWO'#EROOQ$IS'#ET'#ETOOQ$IS'#EV'#EVOOQ$IS'#EX'#EXO1lQ$IWO'#EZO2SQ$IWO'#E_O/|Q$IWO'#EaO2gQ$I[O'#EaO/|Q$IWO'#EdO/gQ$IWO'#EgO/gQ$IWO'#EkO/gQ$IWO'#EnO2rQ$IWO'#EpO2yQ$IWO'#EuO3UQ$IWO'#EqO/gQ$IWO'#EuO/|Q$IWO'#EwO/|Q$IWO'#E|OOQ$IS'#Cc'#CcOOQ$IS'#Cd'#CdOOQ$IS'#Ce'#CeOOQ$IS'#Cf'#CfOOQ$IS'#Cg'#CgOOQ$IS'#Ch'#ChOOQ$IS'#Cj'#CjO'RQ$IWO,58|O'RQ$IWO,58|O'RQ$IWO,58|O'RQ$IWO,58|O'RQ$IWO,58|O'RQ$IWO,58|O3ZQ$IWO'#DmOOQ$IS,5:W,5:WO3nQ$IWO,5:ZO3{Q%1`O,5:ZO4QQ$I[O,59WO0aQ$IWO,59_O0aQ$IWO,59_O0aQ$IWO,59_O6pQ$IWO,59_O6uQ$IWO,59_O6|Q$IWO,59gO7TQ$IWO'#G`O8ZQ$IWO'#G_OOQ$IS'#G_'#G_OOQ$IS'#DX'#DXO8rQ$IWO,59]O'RQ$IWO,59]O9QQ$IWO,59]O9VQ$IWO,5:PO'RQ$IWO,5:POOQ$IS,59|,59|O9eQ$IWO,59|O9jQ$IWO,5:VO'RQ$IWO,5:VO'RQ$IWO,5:TOOQ$IS,5:Q,5:QO9{Q$IWO,5:QO:QQ$IWO,5:UOOOO'#FZ'#FZO:VO`O,5:_OOQ$IS,5:_,5:_OOOO'#F['#F[O:_OpO,5:_O:gQ$IWO'#DuOOOO'#F]'#F]O:wO!bO,5:`OOQ$IS,5:`,5:`OOOO'#F`'#F`O;SO#tO,5:`OOOO'#Fa'#FaO;_O&jO,5:`OOOO'#Fb'#FbO;jO,UO,5:`OOQ$IS'#Fc'#FcO;uQ$I[O,5:dO>gQ$I[O,5<kO?QQ%GlO,5<kO?qQ$I[O,5<kOOQ$IS,5:x,5:xO@YQ$IXO'#FkOAiQ$IWO,5;TOOQ$IV,5<i,5<iOAtQ$I[O'#HWOB]Q$IWO,5;kOOQ$IS-E9p-E9pOOQ$IV,5;j,5;jO3PQ$IWO'#EwOOQ$IT-E9P-E9POBeQ$I[O,59ZODlQ$I[O,59fOEVQ$IWO'#GbOEbQ$IWO'#GbO/|Q$IWO'#GbOEmQ$IWO'#DQOEuQ$IWO,59jOEzQ$IWO'#GfO'RQ$IWO'#GfO/gQ$IWO,5=POOQ$IS,5=P,5=PO/gQ$IWO'#D|OOQ$IS'#D}'#D}OFiQ$IWO'#FeOFyQ$IWO,58zOGXQ$IWO,58zO)eQ$IWO,5:jOG^Q$I[O'#GhOOQ$IS,5:m,5:mOOQ$IS,5:u,5:uOGqQ$IWO,5:yOHSQ$IWO,5:{OOQ$IS'#Fh'#FhOHbQ$I[O,5:{OHpQ$IWO,5:{OHuQ$IWO'#HYOOQ$IS,5;O,5;OOITQ$IWO'#HVOOQ$IS,5;R,5;RO3UQ$IWO,5;VO3UQ$IWO,5;YOIfQ$I[O'#H[O'RQ$IWO'#H[OIpQ$IWO,5;[O2rQ$IWO,5;[O/gQ$IWO,5;aO/|Q$IWO,5;cOIuQ$IXO'#ElOKOQ$IZO,5;]ONaQ$IWO'#H]O3UQ$IWO,5;aONlQ$IWO,5;cONqQ$IWO,5;hO!#fQ$I[O1G.hO!#mQ$I[O1G.hO!&^Q$I[O1G.hO!&hQ$I[O1G.hO!)RQ$I[O1G.hO!)fQ$I[O1G.hO!)yQ$IWO'#GnO!*XQ$I[O'#GQO/gQ$IWO'#GnO!*cQ$IWO'#GmOOQ$IS,5:X,5:XO!*kQ$IWO,5:XO!*pQ$IWO'#GoO!*{Q$IWO'#GoO!+`Q$IWO1G/uOOQ$IS'#Dq'#DqOOQ$IS1G/u1G/uOOQ$IS1G.y1G.yO!,`Q$I[O1G.yO!,gQ$I[O1G.yO0aQ$IWO1G.yO!-SQ$IWO1G/ROOQ$IS'#DW'#DWO/gQ$IWO,59qOOQ$IS1G.w1G.wO!-ZQ$IWO1G/cO!-kQ$IWO1G/cO!-sQ$IWO1G/dO'RQ$IWO'#GgO!-xQ$IWO'#GgO!-}Q$I[O1G.wO!._Q$IWO,59fO!/eQ$IWO,5=VO!/uQ$IWO,5=VO!/}Q$IWO1G/kO!0SQ$I[O1G/kOOQ$IS1G/h1G/hO!0dQ$IWO,5=QO!1ZQ$IWO,5=QO/gQ$IWO1G/oO!1xQ$IWO1G/qO!1}Q$I[O1G/qO!2_Q$I[O1G/oOOQ$IS1G/l1G/lOOQ$IS1G/p1G/pOOOO-E9X-E9XOOQ$IS1G/y1G/yOOOO-E9Y-E9YO!2oQ$IWO'#GzO/gQ$IWO'#GzO!2}Q$IWO,5:aOOOO-E9Z-E9ZOOQ$IS1G/z1G/zOOOO-E9^-E9^OOOO-E9_-E9_OOOO-E9`-E9`OOQ$IS-E9a-E9aO!3YQ%GlO1G2VO!3yQ$I[O1G2VO'RQ$IWO,5<OOOQ$IS,5<O,5<OOOQ$IS-E9b-E9bOOQ$IS,5<V,5<VOOQ$IS-E9i-E9iOOQ$IV1G0o1G0oO/|Q$IWO'#FgO!4bQ$I[O,5=rOOQ$IS1G1V1G1VO!4yQ$IWO1G1VOOQ$IS'#DS'#DSO/gQ$IWO,5<|OOQ$IS,5<|,5<|O!5OQ$IWO'#FSO!5ZQ$IWO,59lO!5cQ$IWO1G/UO!5mQ$I[O,5=QOOQ$IS1G2k1G2kOOQ$IS,5:h,5:hO!6^Q$IWO'#GPOOQ$IS,5<P,5<POOQ$IS-E9c-E9cO!6oQ$IWO1G.fOOQ$IS1G0U1G0UO!6}Q$IWO,5=SO!7_Q$IWO,5=SO/gQ$IWO1G0eO/gQ$IWO1G0eO/|Q$IWO1G0gOOQ$IS-E9f-E9fO!7pQ$IWO1G0gO!7{Q$IWO1G0gO!8QQ$IWO,5=tO!8`Q$IWO,5=tO!8nQ$IWO,5=qO!9UQ$IWO,5=qO!9gQ$IZO1G0qO!<uQ$IZO1G0tO!@QQ$IWO,5=vO!@[Q$IWO,5=vO!@dQ$I[O,5=vO/gQ$IWO1G0vO!@nQ$IWO1G0vO3UQ$IWO1G0{ONlQ$IWO1G0}OOQ$IV,5;W,5;WO!@sQ$IYO,5;WO!@xQ$IZO1G0wO!DZQ$IWO'#FoO3UQ$IWO1G0wO3UQ$IWO1G0wO!DhQ$IWO,5=wO!DuQ$IWO,5=wO/|Q$IWO,5=wOOQ$IV1G0{1G0{O!D}Q$IWO'#EyO!E`Q%1`O1G0}OOQ$IV1G1S1G1SO3UQ$IWO1G1SOOQ$IS,5=Y,5=YOOQ$IS'#Dn'#DnO/gQ$IWO,5=YO!EhQ$IWO,5=XO!E{Q$IWO,5=XOOQ$IS1G/s1G/sO!FTQ$IWO,5=ZO!FeQ$IWO,5=ZO!FmQ$IWO,5=ZO!GQQ$IWO,5=ZO!GbQ$IWO,5=ZOOQ$IS7+%a7+%aOOQ$IS7+$e7+$eO!5cQ$IWO7+$mO!ITQ$IWO1G.yO!I[Q$IWO1G.yOOQ$IS1G/]1G/]OOQ$IS,5;p,5;pO'RQ$IWO,5;pOOQ$IS7+$}7+$}O!IcQ$IWO7+$}OOQ$IS-E9S-E9SOOQ$IS7+%O7+%OO!IsQ$IWO,5=RO'RQ$IWO,5=ROOQ$IS7+$c7+$cO!IxQ$IWO7+$}O!JQQ$IWO7+%OO!JVQ$IWO1G2qOOQ$IS7+%V7+%VO!JgQ$IWO1G2qO!JoQ$IWO7+%VOOQ$IS,5;o,5;oO'RQ$IWO,5;oO!JtQ$IWO1G2lOOQ$IS-E9R-E9RO!KkQ$IWO7+%ZOOQ$IS7+%]7+%]O!KyQ$IWO1G2lO!LhQ$IWO7+%]O!LmQ$IWO1G2rO!L}Q$IWO1G2rO!MVQ$IWO7+%ZO!M[Q$IWO,5=fO!MrQ$IWO,5=fO!MrQ$IWO,5=fO!NQO!LQO'#DwO!N]OSO'#G{OOOO1G/{1G/{O!NbQ$IWO1G/{O!NjQ%GlO7+'qO# ZQ$I[O1G1jP# tQ$IWO'#FdOOQ$IS,5<R,5<ROOQ$IS-E9e-E9eOOQ$IS7+&q7+&qOOQ$IS1G2h1G2hOOQ$IS,5;n,5;nOOQ$IS-E9Q-E9QOOQ$IS7+$p7+$pO#!RQ$IWO,5<kO#!lQ$IWO,5<kO#!}Q$I[O,5;qO##bQ$IWO1G2nOOQ$IS-E9T-E9TOOQ$IS7+&P7+&PO##rQ$IWO7+&POOQ$IS7+&R7+&RO#$QQ$IWO'#HXO/|Q$IWO7+&RO#$fQ$IWO7+&ROOQ$IS,5<U,5<UO#$qQ$IWO1G3`OOQ$IS-E9h-E9hOOQ$IS,5<Q,5<QO#%PQ$IWO1G3]OOQ$IS-E9d-E9dO#%gQ$IZO7+&]O!DZQ$IWO'#FmO3UQ$IWO7+&]O3UQ$IWO7+&`O#(uQ$I[O,5<YO'RQ$IWO,5<YO#)PQ$IWO1G3bOOQ$IS-E9l-E9lO#)ZQ$IWO1G3bO3UQ$IWO7+&bO/gQ$IWO7+&bOOQ$IV7+&g7+&gO!E`Q%1`O7+&iO#)cQ$IXO1G0rOOQ$IV-E9m-E9mO3UQ$IWO7+&cO3UQ$IWO7+&cOOQ$IV,5<Z,5<ZO#+UQ$IWO,5<ZOOQ$IV7+&c7+&cO#+aQ$IZO7+&cO#.lQ$IWO,5<[O#.wQ$IWO1G3cOOQ$IS-E9n-E9nO#/UQ$IWO1G3cO#/^Q$IWO'#H_O#/lQ$IWO'#H_O/|Q$IWO'#H_OOQ$IS'#H_'#H_O#/wQ$IWO'#H^OOQ$IS,5;e,5;eO#0PQ$IWO,5;eO/gQ$IWO'#E{OOQ$IV7+&i7+&iO3UQ$IWO7+&iOOQ$IV7+&n7+&nOOQ$IS1G2t1G2tOOQ$IS,5;s,5;sO#0UQ$IWO1G2sOOQ$IS-E9V-E9VO#0iQ$IWO,5;tO#0tQ$IWO,5;tO#1XQ$IWO1G2uOOQ$IS-E9W-E9WO#1iQ$IWO1G2uO#1qQ$IWO1G2uO#2RQ$IWO1G2uO#1iQ$IWO1G2uOOQ$IS<<HX<<HXO#2^Q$I[O1G1[OOQ$IS<<Hi<<HiP#2kQ$IWO'#FUO6|Q$IWO1G2mO#2xQ$IWO1G2mO#2}Q$IWO<<HiOOQ$IS<<Hj<<HjO#3_Q$IWO7+(]OOQ$IS<<Hq<<HqO#3oQ$I[O1G1ZP#4`Q$IWO'#FTO#4mQ$IWO7+(^O#4}Q$IWO7+(^O#5VQ$IWO<<HuO#5[Q$IWO7+(WOOQ$IS<<Hw<<HwO#6RQ$IWO,5;rO'RQ$IWO,5;rOOQ$IS-E9U-E9UOOQ$IS<<Hu<<HuOOQ$IS,5;x,5;xO/gQ$IWO,5;xO#6WQ$IWO1G3QOOQ$IS-E9[-E9[O#6nQ$IWO1G3QOOOO'#F_'#F_O#6|O!LQO,5:cOOOO,5=g,5=gOOOO7+%g7+%gO#7XQ$IWO1G2VO#7rQ$IWO1G2VP'RQ$IWO'#FVO/gQ$IWO<<IkO#8TQ$IWO,5=sO#8fQ$IWO,5=sO/|Q$IWO,5=sO#8wQ$IWO<<ImOOQ$IS<<Im<<ImO/|Q$IWO<<ImP/|Q$IWO'#FjP/gQ$IWO'#FfOOQ$IV-E9k-E9kO3UQ$IWO<<IwOOQ$IV,5<X,5<XO3UQ$IWO,5<XOOQ$IV<<Iw<<IwOOQ$IV<<Iz<<IzO#8|Q$I[O1G1tP#9WQ$IWO'#FnO#9_Q$IWO7+(|O#9iQ$IZO<<I|O3UQ$IWO<<I|OOQ$IV<<JT<<JTO3UQ$IWO<<JTOOQ$IV'#Fl'#FlO#<tQ$IZO7+&^OOQ$IV<<I}<<I}O#>mQ$IZO<<I}OOQ$IV1G1u1G1uO/|Q$IWO1G1uO3UQ$IWO<<I}O/|Q$IWO1G1vP/gQ$IWO'#FpO#AxQ$IWO7+(}O#BVQ$IWO7+(}OOQ$IS'#Ez'#EzO/gQ$IWO,5=yO#B_Q$IWO,5=yOOQ$IS,5=y,5=yO#BjQ$IWO,5=xO#B{Q$IWO,5=xOOQ$IS1G1P1G1POOQ$IS,5;g,5;gP#CTQ$IWO'#FXO#CeQ$IWO1G1`O#CxQ$IWO1G1`O#DYQ$IWO1G1`P#DeQ$IWO'#FYO#DrQ$IWO7+(aO#ESQ$IWO7+(aO#ESQ$IWO7+(aO#E[Q$IWO7+(aO#ElQ$IWO7+(XO6|Q$IWO7+(XOOQ$ISAN>TAN>TO#FVQ$IWO<<KxOOQ$ISAN>aAN>aO/gQ$IWO1G1^O#FgQ$I[O1G1^P#FqQ$IWO'#FWOOQ$IS1G1d1G1dP#GOQ$IWO'#F^O#G]Q$IWO7+(lOOOO-E9]-E9]O#GsQ$IWO7+'qOOQ$ISAN?VAN?VO#H^Q$IWO,5<TO#HrQ$IWO1G3_OOQ$IS-E9g-E9gO#ITQ$IWO1G3_OOQ$ISAN?XAN?XO#IfQ$IWOAN?XOOQ$IVAN?cAN?cOOQ$IV1G1s1G1sO3UQ$IWOAN?hO#IkQ$IZOAN?hOOQ$IVAN?oAN?oOOQ$IV-E9j-E9jOOQ$IV<<Ix<<IxO3UQ$IWOAN?iO3UQ$IWO7+'aOOQ$IVAN?iAN?iOOQ$IS7+'b7+'bO#LvQ$IWO<<LiOOQ$IS1G3e1G3eO/gQ$IWO1G3eOOQ$IS,5<],5<]O#MTQ$IWO1G3dOOQ$IS-E9o-E9oO#MfQ$IWO7+&zO#MvQ$IWO7+&zOOQ$IS7+&z7+&zO#NRQ$IWO<<K{O#NcQ$IWO<<K{O#NcQ$IWO<<K{O#NkQ$IWO'#GiOOQ$IS<<Ks<<KsO#NuQ$IWO<<KsOOQ$IS7+&x7+&xO/|Q$IWO1G1oP/|Q$IWO'#FiO$ `Q$IWO7+(yO$ qQ$IWO7+(yOOQ$ISG24sG24sOOQ$IVG25SG25SO3UQ$IWOG25SOOQ$IVG25TG25TOOQ$IV<<J{<<J{OOQ$IS7+)P7+)PP$!SQ$IWO'#FqOOQ$IS<<Jf<<JfO$!bQ$IWO<<JfO$!rQ$IWOANAgO$#SQ$IWOANAgO$#[Q$IWO'#GjOOQ$IS'#Gj'#GjO0hQ$IWO'#DaO$#uQ$IWO,5=TOOQ$ISANA_ANA_OOQ$IS7+'Z7+'ZO$$^Q$IWO<<LeOOQ$IVLD*nLD*nOOQ$ISAN@QAN@QO$$oQ$IWOG27RO$%PQ$IWO,59{OOQ$IS1G2o1G2oO#NkQ$IWO1G/gOOQ$IS7+%R7+%RO6|Q$IWO'#CzO6|Q$IWO,59_O6|Q$IWO,59_O6|Q$IWO,59_O$%UQ$I[O,5<kO6|Q$IWO1G.yO/gQ$IWO1G/UO/gQ$IWO7+$mP$%iQ$IWO'#FdO'RQ$IWO'#GPO$%vQ$IWO,59_O$%{Q$IWO,59_O$&SQ$IWO,59jO$&XQ$IWO1G/RO0hQ$IWO'#DOO6|Q$IWO,59g",
  stateData: "$&o~O$oOS$lOS$kOSQOS~OPhOTeOdsOfXOltOp!SOsuO|vO}!PO!R!VO!S!UO!VYO!ZZO!fdO!mdO!ndO!odO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO#c!TO#f!WO#j!XO#l!YO#q!ZO#tlO$jqO$zQO${QO%PRO%QVO%e[O%f]O%i^O%l_O%r`O%uaO%wbO~OT!aO]!aO_!bOf!iO!V!kO!d!lO$u![O$v!]O$w!^O$x!_O$y!_O$z!`O${!`O$|!aO$}!aO%O!aO~Oh%TXi%TXj%TXk%TXl%TXm%TXp%TXw%TXx%TX!s%TX#^%TX$j%TX$m%TX%V%TX!O%TX!R%TX!S%TX%W%TX!W%TX![%TX}%TX#V%TXq%TX!j%TX~P$_OdsOfXO!VYO!ZZO!fdO!mdO!ndO!odO$zQO${QO%PRO%QVO%e[O%f]O%i^O%l_O%r`O%uaO%wbO~Ow%SXx%SX#^%SX$j%SX$m%SX%V%SX~Oh!oOi!pOj!nOk!nOl!qOm!rOp!sO!s%SX~P(`OT!yOl-fOs-tO|vO~P'ROT!|Ol-fOs-tO!W!}O~P'ROT#QO_#ROl-fOs-tO![#SO~P'RO%g#VO%h#XO~O%j#YO%k#XO~O!Z#[O%m#]O%q#_O~O!Z#[O%s#`O%t#_O~O!Z#[O%h#_O%v#bO~O!Z#[O%k#_O%x#dO~OT$tX]$tX_$tXf$tXh$tXi$tXj$tXk$tXl$tXm$tXp$tXw$tX!V$tX!d$tX$u$tX$v$tX$w$tX$x$tX$y$tX$z$tX${$tX$|$tX$}$tX%O$tX!O$tX!R$tX!S$tX~O%e[O%f]O%i^O%l_O%r`O%uaO%wbOx$tX!s$tX#^$tX$j$tX$m$tX%V$tX%W$tX!W$tX![$tX}$tX#V$tXq$tX!j$tX~P+uOw#iOx$sX!s$sX#^$sX$j$sX$m$sX%V$sX~Ol-fOs-tO~P'RO#^#lO$j#nO$m#nO~O%QVO~O!R#sO#l!YO#q!ZO#tlO~OltO~P'ROT#xO_#yO%QVOxtP~OT#}Ol-fOs-tO}$OO~P'ROx$QO!s$VO%V$RO#^!tX$j!tX$m!tX~OT#}Ol-fOs-tO#^!}X$j!}X$m!}X~P'ROl-fOs-tO#^#RX$j#RX$m#RX~P'RO!d$]O!m$]O%QVO~OT$gO~P'RO!S$iO#j$jO#l$kO~Ox$lO~OT$zO_$zOl-fOs-tO!O$|O~P'ROl-fOs-tOx%PO~P'RO%d%RO~O_!bOf!iO!V!kO!d!lOT`a]`ah`ai`aj`ak`al`am`ap`aw`ax`a!s`a#^`a$j`a$m`a$u`a$v`a$w`a$x`a$y`a$z`a${`a$|`a$}`a%O`a%V`a!O`a!R`a!S`a%W`a!W`a![`a}`a#V`aq`a!j`a~Ok%WO~Ol%WO~P'ROl-fO~P'ROh-hOi-iOj-gOk-gOl-pOm-qOp-uO!O%SX!R%SX!S%SX%W%SX!W%SX![%SX}%SX#V%SX!j%SX~P(`O%W%YOw%RX!O%RX!R%RX!S%RX!W%RXx%RX~Ow%]O!O%[O!R%aO!S%`O~O!O%[O~Ow%dO!R%aO!S%`O!W%_X~O!W%hO~Ow%iOx%kO!R%aO!S%`O![%YX~O![%oO~O![%pO~O%g#VO%h%rO~O%j#YO%k%rO~OT%uOl-fOs-tO|vO~P'RO!Z#[O%m#]O%q%xO~O!Z#[O%s#`O%t%xO~O!Z#[O%h%xO%v#bO~O!Z#[O%k%xO%x#dO~OT!la]!la_!laf!lah!lai!laj!lak!lal!lam!lap!law!lax!la!V!la!d!la!s!la#^!la$j!la$m!la$u!la$v!la$w!la$x!la$y!la$z!la${!la$|!la$}!la%O!la%V!la!O!la!R!la!S!la%W!la!W!la![!la}!la#V!laq!la!j!la~P#vOw%}Ox$sa!s$sa#^$sa$j$sa$m$sa%V$sa~P$_OT&POltOsuOx$sa!s$sa#^$sa$j$sa$m$sa%V$sa~P'ROw%}Ox$sa!s$sa#^$sa$j$sa$m$sa%V$sa~OPhOTeOltOsuO|vO}!PO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO#^$_X$j$_X$m$_X~P'RO#^#lO$j&UO$m&UO~O!d&VOf%zX$j%zX#V%zX#^%zX$m%zX#U%zX~Of!iO$j&XO~Ohcaicajcakcalcamcapcawcaxca!sca#^ca$jca$mca%Vca!Oca!Rca!Sca%Wca!Wca![ca}ca#Vcaqca!jca~P$_Opnawnaxna#^na$jna$mna%Vna~Oh!oOi!pOj!nOk!nOl!qOm!rO!sna~PDTO%V&ZOw%UXx%UX~O%QVOw%UXx%UX~Ow&^OxtX~Ox&`O~Ow%iO#^%YX$j%YX$m%YX!O%YXx%YX![%YX!j%YX%V%YX~OT-oOl-fOs-tO|vO~P'RO%V$RO#^Sa$jSa$mSa~O%V$RO~Ow&iO#^%[X$j%[X$m%[Xk%[X~P$_Ow&lO}&kO#^#Ra$j#Ra$m#Ra~O#V&mO#^#Ta$j#Ta$m#Ta~O!d$]O!m$]O#U&oO%QVO~O#U&oO~Ow&qO#^%|X$j%|X$m%|X~Ow&sO#^%yX$j%yX$m%yXx%yX~Ow&wOk&OX~P$_Ok&zO~OPhOTeOltOsuO|vO}!PO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO$j'PO~P'ROq'TO#g'RO#h'SOP#eaT#ead#eaf#eal#eap#eas#ea|#ea}#ea!R#ea!S#ea!V#ea!Z#ea!f#ea!m#ea!n#ea!o#ea!v#ea!x#ea!z#ea!|#ea#O#ea#S#ea#U#ea#X#ea#Y#ea#[#ea#c#ea#f#ea#j#ea#l#ea#q#ea#t#ea$g#ea$j#ea$z#ea${#ea%P#ea%Q#ea%e#ea%f#ea%i#ea%l#ea%r#ea%u#ea%w#ea$i#ea$m#ea~Ow'UO#V'WOx&PX~Of'YO~Of!iOx$lO~OT!aO]!aO_!bOf!iO!V!kO!d!lO$w!^O$x!_O$y!_O$z!`O${!`O$|!aO$}!aO%O!aOhUiiUijUikUilUimUipUiwUixUi!sUi#^Ui$jUi$mUi$uUi%VUi!OUi!RUi!SUi%WUi!WUi![Ui}Ui#VUiqUi!jUi~O$v!]O~PNyO$vUi~PNyOT!aO]!aO_!bOf!iO!V!kO!d!lO$z!`O${!`O$|!aO$}!aO%O!aOhUiiUijUikUilUimUipUiwUixUi!sUi#^Ui$jUi$mUi$uUi$vUi$wUi%VUi!OUi!RUi!SUi%WUi!WUi![Ui}Ui#VUiqUi!jUi~O$x!_O$y!_O~P!#tO$xUi$yUi~P!#tO_!bOf!iO!V!kO!d!lOhUiiUijUikUilUimUipUiwUixUi!sUi#^Ui$jUi$mUi$uUi$vUi$wUi$xUi$yUi$zUi${Ui%VUi!OUi!RUi!SUi%WUi!WUi![Ui}Ui#VUiqUi!jUi~OT!aO]!aO$|!aO$}!aO%O!aO~P!&rOTUi]Ui$|Ui$}Ui%OUi~P!&rO!R%aO!S%`Ow%bX!O%bX~O%V'_O%W'_O~P+uOw'aO!O%aX~O!O'cO~Ow'dOx'fO!W%cX~Ol-fOs-tOw'dOx'gO!W%cX~P'RO!W'iO~Oj!nOk!nOl!qOm!rOhgipgiwgixgi!sgi#^gi$jgi$mgi%Vgi~Oi!pO~P!+eOigi~P!+eOh-hOi-iOj-gOk-gOl-pOm-qO~Oq'kO~P!,nOT'pOl-fOs-tO!O'qO~P'ROw'rO!O'qO~O!O'tO~O!S'vO~Ow'rO!O'wO!R%aO!S%`O~P$_Oh-hOi-iOj-gOk-gOl-pOm-qO!Ona!Rna!Sna%Wna!Wna![na}na#Vnaqna!jna~PDTOT'pOl-fOs-tO!W%_a~P'ROw'zO!W%_a~O!W'{O~Ow'zO!R%aO!S%`O!W%_a~P$_OT(POl-fOs-tO![%Ya#^%Ya$j%Ya$m%Ya!O%Yax%Ya!j%Ya%V%Ya~P'ROw(QO![%Ya#^%Ya$j%Ya$m%Ya!O%Yax%Ya!j%Ya%V%Ya~O![(TO~Ow(QO!R%aO!S%`O![%Ya~P$_Ow(WO!R%aO!S%`O![%`a~P$_Ow(ZOx%nX![%nX!j%nX~Ox(^O![(`O!j(aO~OT&POltOsuOx$si!s$si#^$si$j$si$m$si%V$si~P'ROw(bOx$si!s$si#^$si$j$si$m$si%V$si~O!d&VOf%za$j%za#V%za#^%za$m%za#U%za~O$j(gO~OT#xO_#yO%QVO~Ow&^Oxta~OltOsuO~P'ROw(QO#^%Ya$j%Ya$m%Ya!O%Yax%Ya![%Ya!j%Ya%V%Ya~P$_Ow(lO#^$sX$j$sX$m$sX%V$sX~O%V$RO#^Si$jSi$mSi~O#^%[a$j%[a$m%[ak%[a~P'ROw(oO#^%[a$j%[a$m%[ak%[a~OT(sOf(uO%QVO~O#U(vO~O%QVO#^%|a$j%|a$m%|a~Ow(xO#^%|a$j%|a$m%|a~Ol-fOs-tO#^%ya$j%ya$m%yax%ya~P'ROw({O#^%ya$j%ya$m%yax%ya~Oq)PO#a)OOP#_iT#_id#_if#_il#_ip#_is#_i|#_i}#_i!R#_i!S#_i!V#_i!Z#_i!f#_i!m#_i!n#_i!o#_i!v#_i!x#_i!z#_i!|#_i#O#_i#S#_i#U#_i#X#_i#Y#_i#[#_i#c#_i#f#_i#j#_i#l#_i#q#_i#t#_i$g#_i$j#_i$z#_i${#_i%P#_i%Q#_i%e#_i%f#_i%i#_i%l#_i%r#_i%u#_i%w#_i$i#_i$m#_i~Oq)QOP#biT#bid#bif#bil#bip#bis#bi|#bi}#bi!R#bi!S#bi!V#bi!Z#bi!f#bi!m#bi!n#bi!o#bi!v#bi!x#bi!z#bi!|#bi#O#bi#S#bi#U#bi#X#bi#Y#bi#[#bi#c#bi#f#bi#j#bi#l#bi#q#bi#t#bi$g#bi$j#bi$z#bi${#bi%P#bi%Q#bi%e#bi%f#bi%i#bi%l#bi%r#bi%u#bi%w#bi$i#bi$m#bi~OT)SOk&Oa~P'ROw)TOk&Oa~Ow)TOk&Oa~P$_Ok)XO~O$h)[O~Oq)_O#g'RO#h)^OP#eiT#eid#eif#eil#eip#eis#ei|#ei}#ei!R#ei!S#ei!V#ei!Z#ei!f#ei!m#ei!n#ei!o#ei!v#ei!x#ei!z#ei!|#ei#O#ei#S#ei#U#ei#X#ei#Y#ei#[#ei#c#ei#f#ei#j#ei#l#ei#q#ei#t#ei$g#ei$j#ei$z#ei${#ei%P#ei%Q#ei%e#ei%f#ei%i#ei%l#ei%r#ei%u#ei%w#ei$i#ei$m#ei~Ol-fOs-tOx$lO~P'ROl-fOs-tOx&Pa~P'ROw)eOx&Pa~OT)iO_)jO!O)mO$|)kO%QVO~Ox$lO&S)oO~OT$zO_$zOl-fOs-tO!O%aa~P'ROw)uO!O%aa~Ol-fOs-tOx)xO!W%ca~P'ROw)yO!W%ca~Ol-fOs-tOw)yOx)|O!W%ca~P'ROl-fOs-tOw)yO!W%ca~P'ROw)yOx)|O!W%ca~Oj-gOk-gOl-pOm-qOhgipgiwgi!Ogi!Rgi!Sgi%Wgi!Wgixgi![gi#^gi$jgi$mgi}gi#Vgiqgi!jgi%Vgi~Oi-iO~P!GmOigi~P!GmOT'pOl-fOs-tO!O*RO~P'ROk*TO~Ow*VO!O*RO~O!O*WO~OT'pOl-fOs-tO!W%_i~P'ROw*XO!W%_i~O!W*YO~OT(POl-fOs-tO![%Yi#^%Yi$j%Yi$m%Yi!O%Yix%Yi!j%Yi%V%Yi~P'ROw*]O!R%aO!S%`O![%`i~Ow*`O![%Yi#^%Yi$j%Yi$m%Yi!O%Yix%Yi!j%Yi%V%Yi~O![*aO~O_*cOl-fOs-tO![%`i~P'ROw*]O![%`i~O![*eO~OT*gOl-fOs-tOx%na![%na!j%na~P'ROw*hOx%na![%na!j%na~O!Z#[O%p*kO![!kX~O![*mO~Ox(^O![*nO~OT&POltOsuOx$sq!s$sq#^$sq$j$sq$m$sq%V$sq~P'ROw$Wix$Wi!s$Wi#^$Wi$j$Wi$m$Wi%V$Wi~P$_OT&POltOsuO~P'ROT&POl-fOs-tO#^$sa$j$sa$m$sa%V$sa~P'ROw*oO#^$sa$j$sa$m$sa%V$sa~Ow#ya#^#ya$j#ya$m#yak#ya~P$_O#^%[i$j%[i$m%[ik%[i~P'ROw*rO#^#Rq$j#Rq$m#Rq~Ow*sO#V*uO#^%{X$j%{X$m%{X!O%{X~OT*wOf*xO%QVO~O%QVO#^%|i$j%|i$m%|i~Ol-fOs-tO#^%yi$j%yi$m%yix%yi~P'ROq*|O#a)OOP#_qT#_qd#_qf#_ql#_qp#_qs#_q|#_q}#_q!R#_q!S#_q!V#_q!Z#_q!f#_q!m#_q!n#_q!o#_q!v#_q!x#_q!z#_q!|#_q#O#_q#S#_q#U#_q#X#_q#Y#_q#[#_q#c#_q#f#_q#j#_q#l#_q#q#_q#t#_q$g#_q$j#_q$z#_q${#_q%P#_q%Q#_q%e#_q%f#_q%i#_q%l#_q%r#_q%u#_q%w#_q$i#_q$m#_q~Ok$baw$ba~P$_OT)SOk&Oi~P'ROw+TOk&Oi~OPhOTeOltOp!SOsuO|vO}!PO!R!VO!S!UO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO#c!TO#f!WO#j!XO#l!YO#q!ZO#tlO~P'ROw+_Ox$lO#V+_O~O#h+`OP#eqT#eqd#eqf#eql#eqp#eqs#eq|#eq}#eq!R#eq!S#eq!V#eq!Z#eq!f#eq!m#eq!n#eq!o#eq!v#eq!x#eq!z#eq!|#eq#O#eq#S#eq#U#eq#X#eq#Y#eq#[#eq#c#eq#f#eq#j#eq#l#eq#q#eq#t#eq$g#eq$j#eq$z#eq${#eq%P#eq%Q#eq%e#eq%f#eq%i#eq%l#eq%r#eq%u#eq%w#eq$i#eq$m#eq~O#V+aOw$dax$da~Ol-fOs-tOx&Pi~P'ROw+cOx&Pi~Ox$QO%V+eOw&RX!O&RX~O%QVOw&RX!O&RX~Ow+iO!O&QX~O!O+kO~OT$zO_$zOl-fOs-tO!O%ai~P'ROx+nOw#|a!W#|a~Ol-fOs-tOx+oOw#|a!W#|a~P'ROl-fOs-tOx)xO!W%ci~P'ROw+rO!W%ci~Ol-fOs-tOw+rO!W%ci~P'ROw+rOx+uO!W%ci~Ow#xi!O#xi!W#xi~P$_OT'pOl-fOs-tO~P'ROk+wO~OT'pOl-fOs-tO!O+xO~P'ROT'pOl-fOs-tO!W%_q~P'ROw#wi![#wi#^#wi$j#wi$m#wi!O#wix#wi!j#wi%V#wi~P$_OT(POl-fOs-tO~P'RO_*cOl-fOs-tO![%`q~P'ROw+yO![%`q~O![+zO~OT(POl-fOs-tO![%Yq#^%Yq$j%Yq$m%Yq!O%Yqx%Yq!j%Yq%V%Yq~P'ROx+{O~OT*gOl-fOs-tOx%ni![%ni!j%ni~P'ROw,QOx%ni![%ni!j%ni~O!Z#[O%p*kO![!ka~OT&POl-fOs-tO#^$si$j$si$m$si%V$si~P'ROw,SO#^$si$j$si$m$si%V$si~O%QVO#^%{a$j%{a$m%{a!O%{a~Ow,VO#^%{a$j%{a$m%{a!O%{a~O!O,YO~Ok$biw$bi~P$_OT)SO~P'ROT)SOk&Oq~P'ROq,^OP#dyT#dyd#dyf#dyl#dyp#dys#dy|#dy}#dy!R#dy!S#dy!V#dy!Z#dy!f#dy!m#dy!n#dy!o#dy!v#dy!x#dy!z#dy!|#dy#O#dy#S#dy#U#dy#X#dy#Y#dy#[#dy#c#dy#f#dy#j#dy#l#dy#q#dy#t#dy$g#dy$j#dy$z#dy${#dy%P#dy%Q#dy%e#dy%f#dy%i#dy%l#dy%r#dy%u#dy%w#dy$i#dy$m#dy~OPhOTeOltOp!SOsuO|vO}!PO!R!VO!S!UO!vxO!xyO!zzO!|{O#O|O#S}O#U!OO#X!QO#Y!QO#[!RO#c!TO#f!WO#j!XO#l!YO#q!ZO#tlO$i,bO$m,bO~P'RO#h,cOP#eyT#eyd#eyf#eyl#eyp#eys#ey|#ey}#ey!R#ey!S#ey!V#ey!Z#ey!f#ey!m#ey!n#ey!o#ey!v#ey!x#ey!z#ey!|#ey#O#ey#S#ey#U#ey#X#ey#Y#ey#[#ey#c#ey#f#ey#j#ey#l#ey#q#ey#t#ey$g#ey$j#ey$z#ey${#ey%P#ey%Q#ey%e#ey%f#ey%i#ey%l#ey%r#ey%u#ey%w#ey$i#ey$m#ey~Ol-fOs-tOx&Pq~P'ROw,gOx&Pq~O%V+eOw&Ra!O&Ra~OT)iO_)jO$|)kO%QVO!O&Qa~Ow,kO!O&Qa~OT$zO_$zOl-fOs-tO~P'ROl-fOs-tOx,mOw#|i!W#|i~P'ROl-fOs-tOw#|i!W#|i~P'ROx,mOw#|i!W#|i~Ol-fOs-tOx)xO~P'ROl-fOs-tOx)xO!W%cq~P'ROw,pO!W%cq~Ol-fOs-tOw,pO!W%cq~P'ROp,sO!R%aO!S%`O!O%Zq!W%Zq![%Zqw%Zq~P!,nO_*cOl-fOs-tO![%`y~P'ROw#zi![#zi~P$_O_*cOl-fOs-tO~P'ROT*gOl-fOs-tO~P'ROT*gOl-fOs-tOx%nq![%nq!j%nq~P'ROT&POl-fOs-tO#^$sq$j$sq$m$sq%V$sq~P'RO#V,wOw$]a#^$]a$j$]a$m$]a!O$]a~O%QVO#^%{i$j%{i$m%{i!O%{i~Ow,yO#^%{i$j%{i$m%{i!O%{i~O!O,{O~Oq,}OP#d!RT#d!Rd#d!Rf#d!Rl#d!Rp#d!Rs#d!R|#d!R}#d!R!R#d!R!S#d!R!V#d!R!Z#d!R!f#d!R!m#d!R!n#d!R!o#d!R!v#d!R!x#d!R!z#d!R!|#d!R#O#d!R#S#d!R#U#d!R#X#d!R#Y#d!R#[#d!R#c#d!R#f#d!R#j#d!R#l#d!R#q#d!R#t#d!R$g#d!R$j#d!R$z#d!R${#d!R%P#d!R%Q#d!R%e#d!R%f#d!R%i#d!R%l#d!R%r#d!R%u#d!R%w#d!R$i#d!R$m#d!R~Ol-fOs-tOx&Py~P'ROT)iO_)jO$|)kO%QVO!O&Qi~Ol-fOs-tOw#|q!W#|q~P'ROx-TOw#|q!W#|q~Ol-fOs-tOx)xO!W%cy~P'ROw-UO!W%cy~Ol-fOs-YO~P'ROp,sO!R%aO!S%`O!O%Zy!W%Zy![%Zyw%Zy~P!,nO%QVO#^%{q$j%{q$m%{q!O%{q~Ow-^O#^%{q$j%{q$m%{q!O%{q~OT)iO_)jO$|)kO%QVO~Ol-fOs-tOw#|y!W#|y~P'ROl-fOs-tOx)xO!W%c!R~P'ROw-aO!W%c!R~Op%^X!O%^X!R%^X!S%^X!W%^X![%^Xw%^X~P!,nOp,sO!R%aO!S%`O!O%]a!W%]a![%]aw%]a~O%QVO#^%{y$j%{y$m%{y!O%{y~Ol-fOs-tOx)xO!W%c!Z~P'ROx-dO~Ow*oO#^$sa$j$sa$m$sa%V$sa~P$_OT&POl-fOs-tO~P'ROk-kO~Ol-kO~P'ROx-lO~Oq-mO~P!,nO%f%i%u%w%e!Z%m%s%v%x%l%r%l%Q~",
  goto: "!,u&SPPPP&TP&])n*T*k+S+l,VP,qP&]-_-_&]P&]P0pPPPPPP0p3`PP3`P5l5u:yPP:|;[;_PPP&]&]PP;k&]PP&]&]PP&]&]&]&];o<c&]P<fP<i<i@OP@d&]PPP@h@n&TP&T&TP&TP&TP&TP&TP&T&T&TP&TPP&TPP&TP@tP@{ARP@{P@{@{PPP@{PBzPCTCZCaBzP@{CgPCnCtCzDWDjDpDzEQEnEtEzFQF[FbFhFnFtFzG^GhGnGtGzHUH[HbHhHnHxIOIYI`PPPPPPPPPIiIqIzJUJaPPPPPPPPPPPPNv! `!%n!(zPP!)S!)b!)k!*a!*W!*j!*p!*s!*v!*y!+RPPPPPPPPPP!+U!+XPPPPPPPPP!+_!+k!+w!,T!,W!,^!,d!,j!,m]iOr#l$l)[+Z'odOSXYZehrstvx|}!R!S!T!U!X!c!d!e!f!g!h!i!k!n!o!p!r!s!y!|#Q#R#[#i#l#}$O$Q$S$V$g$i$j$l$z%P%W%Z%]%`%d%i%k%u%}&P&[&`&i&k&l&s&w&z'R'U'`'a'd'f'g'k'p'r'v'z(P(Q(W(Z(b(d(l(o({)O)S)T)X)[)e)o)u)x)y)|*S*T*V*X*[*]*`*c*g*h*o*q*r*z+S+T+Z+b+c+f+m+n+o+q+r+u+w+y+{+},P,Q,S,g,i,m,p,s-T-U-a-d-f-g-h-i-k-l-m-n-o-q-uw!cP#h#u$W$f%b%g%m%n&a&y(c(n)R*Q*Z+R+|-jy!dP#h#u$W$f$r%b%g%m%n&a&y(c(n)R*Q*Z+R+|-j{!eP#h#u$W$f$r$s%b%g%m%n&a&y(c(n)R*Q*Z+R+|-j}!fP#h#u$W$f$r$s$t%b%g%m%n&a&y(c(n)R*Q*Z+R+|-j!P!gP#h#u$W$f$r$s$t$u%b%g%m%n&a&y(c(n)R*Q*Z+R+|-j!R!hP#h#u$W$f$r$s$t$u$v%b%g%m%n&a&y(c(n)R*Q*Z+R+|-j!V!hP!m#h#u$W$f$r$s$t$u$v$w%b%g%m%n&a&y(c(n)R*Q*Z+R+|-j'oSOSXYZehrstvx|}!R!S!T!U!X!c!d!e!f!g!h!i!k!n!o!p!r!s!y!|#Q#R#[#i#l#}$O$Q$S$V$g$i$j$l$z%P%W%Z%]%`%d%i%k%u%}&P&[&`&i&k&l&s&w&z'R'U'`'a'd'f'g'k'p'r'v'z(P(Q(W(Z(b(d(l(o({)O)S)T)X)[)e)o)u)x)y)|*S*T*V*X*[*]*`*c*g*h*o*q*r*z+S+T+Z+b+c+f+m+n+o+q+r+u+w+y+{+},P,Q,S,g,i,m,p,s-T-U-a-d-f-g-h-i-k-l-m-n-o-q-u&ZUOXYZhrtv|}!R!S!T!X!i!k!n!o!p!r!s#[#i#l$O$Q$S$V$j$l$z%P%W%Z%]%d%i%k%u%}&[&`&k&l&s&z'R'U'`'a'd'f'g'k'r'z(Q(W(Z(b(d(l({)O)X)[)e)o)u)x)y)|*S*T*V*X*[*]*`*g*h*o*r*z+Z+b+c+f+m+n+o+q+r+u+w+y+{+},P,Q,S,g,i,m,p,s-T-U-a-d-f-g-h-i-k-l-m-n-q-u%eWOXYZhrv|}!R!S!T!X!i!k#[#i#l$O$Q$S$V$j$l$z%P%Z%]%d%i%k%u%}&[&`&k&l&s&z'R'U'`'a'd'f'g'k'r'z(Q(W(Z(b(d(l({)O)X)[)e)o)u)x)y)|*S*V*X*[*]*`*g*h*o*r*z+Z+b+c+f+m+n+o+q+r+u+y+{+},P,Q,S,g,i,m,p-T-U-a-l-m-nQ#{uQ-b-YR-r-t'fdOSXYZehrstvx|}!R!S!T!U!X!c!d!e!f!g!h!k!n!o!p!r!s!y!|#Q#R#[#i#l#}$O$Q$S$V$g$i$j$l$z%P%W%Z%]%`%d%i%k%u%}&P&[&`&i&k&l&s&w&z'R'U'`'d'f'g'k'p'r'v'z(P(Q(W(Z(b(d(l(o({)O)S)T)X)[)e)o)x)y)|*S*T*V*X*[*]*`*c*g*h*o*q*r*z+S+T+Z+b+c+f+n+o+q+r+u+w+y+{+},P,Q,S,g,i,m,p,s-T-U-a-d-f-g-h-i-k-l-m-n-o-q-uW#ol!O!P$^W#wu&^-Y-tQ$`!QQ$p!YQ$q!ZW$y!i'a)u+mS&]#x#yQ&}$kQ(e&VQ(s&mW(t&o(u(v*xU(w&q(x*yQ)g'WW)h'Y+i,k-RS+h)i)jY,U*s,V,x,y-^Q,X*uQ,d+_Q,f+aR-],wR&[#wi!vXY!S!T%]%d'r'z)O*S*V*XR%Z!uQ!zXQ%v#[Q&e$SR&h$VT-X,s-d!U!jP!m#h#u$W$f$r$s$t$u$v$w%b%g%m%n&a&y(c(n)R*Q*Z+R+|-jQ&Y#pR']$qR'`$yR%S!l'ncOSXYZehrstvx|}!R!S!T!U!X!c!d!e!f!g!h!i!k!n!o!p!r!s!y!|#Q#R#[#i#l#}$O$Q$S$V$g$i$j$l$z%P%W%Z%]%`%d%i%k%u%}&P&[&`&i&k&l&s&w&z'R'U'`'a'd'f'g'k'p'r'v'z(P(Q(W(Z(b(d(l(o({)O)S)T)X)[)e)o)u)x)y)|*S*T*V*X*[*]*`*c*g*h*o*q*r*z+S+T+Z+b+c+f+m+n+o+q+r+u+w+y+{+},P,Q,S,g,i,m,p,s-T-U-a-d-f-g-h-i-k-l-m-n-o-q-uT#fc#gS#]_#^S#``#aS#ba#cS#db#eT*k(^*lT(_%v(aQ$UwR+g)hX$Sw$T$U&gZkOr$l)[+ZXoOr)[+ZQ$m!WQ&u$dQ&v$eQ'X$oQ'[$qQ)Y&|Q)`'RQ)b'SQ)c'TQ)p'ZQ)r']Q*})OQ+P)PQ+Q)QQ+U)WS+W)Z)qQ+[)^Q+])_Q+^)aQ,[*|Q,]+OQ,_+VQ,`+XQ,e+`Q,|,^Q-O,cQ-P,dR-_,}WoOr)[+ZR#rnQ'Z$pR)Z&}Q+f)hR,i+gQ)q'ZR+X)ZZmOnr)[+ZQrOR#trQ&_#zR(j&_S%j#P#|S(R%j(UT(U%m&aQ%^!xQ%e!{W's%^%e'x'|Q'x%bR'|%gQ&j$WR(p&jQ(X%nQ*^(ST*d(X*^Q'b${R)v'bS'e%O%PY)z'e){+s,q-VU){'f'g'hU+s)|)}*OS,q+t+uR-V,rQ#W]R%q#WQ#Z^R%s#ZQ#^_R%w#^Q([%tS*i([*jR*j(]Q*l(^R,R*lQ#a`R%y#aQ#caR%z#cQ#ebR%{#eQ#gcR%|#gQ#jfQ&O#hW&R#j&O(m*pQ(m&dR*p-jQ$TwS&f$T&gR&g$UQ&t$bR(|&tQ&W#oR(f&WQ$^!PR&n$^Q*t(tS,W*t,zR,z,XQ&r$`R(y&rQ#mjR&T#mQ+Z)[R,a+ZQ(}&uR*{(}Q&x$fS)U&x)VR)V&yQ'Q$mR)]'QQ'V$nS)f'V+dR+d)gQ+j)lR,l+jWnOr)[+ZR#qnSqOrT+Y)[+ZWpOr)[+ZR'O$lYjOr$l)[+ZR&S#l[wOr#l$l)[+ZR&e$S&YPOXYZhrtv|}!R!S!T!X!i!k!n!o!p!r!s#[#i#l$O$Q$S$V$j$l$z%P%W%Z%]%d%i%k%u%}&[&`&k&l&s&z'R'U'`'a'd'f'g'k'r'z(Q(W(Z(b(d(l({)O)X)[)e)o)u)x)y)|*S*T*V*X*[*]*`*g*h*o*r*z+Z+b+c+f+m+n+o+q+r+u+w+y+{+},P,Q,S,g,i,m,p,s-T-U-a-d-f-g-h-i-k-l-m-n-q-uQ!mSQ#heQ#usU$Wx%`'vS$f!U$iQ$r!cQ$s!dQ$t!eQ$u!fQ$v!gQ$w!hQ%b!yQ%g!|Q%m#QQ%n#RQ&a#}Q&y$gQ(c&PU(n&i(o*qW)R&w)T+S+TQ*Q'pQ*Z(PQ+R)SQ+|*cR-j-oQ!xXQ!{YQ$d!SQ$e!T^'o%]%d'r'z*S*V*XR+O)O[fOr#l$l)[+Zh!uXY!S!T%]%d'r'z)O*S*V*XQ#PZQ#khS#|v|Q$Z}W$b!R$V&z)XS$n!X$jW$x!i'a)u+mQ%O!kQ%t#[`&Q#i%}(b(d(l*o,S-nQ&b$OQ&c$QQ&d$SQ'^$zQ'h%PQ'n%ZW(O%i(Q*[*`Q(S%kQ(]%uQ(h&[S(k&`-lQ(q&kQ(r&lU(z&s({*zQ)a'RY)d'U)e+b+c,gQ)s'`^)w'd)y+q+r,p-U-aQ)}'fQ*O'gS*P'k-mW*b(W*]+y+}W*f(Z*h,P,QQ+l)oQ+p)xQ+t)|Q,O*gQ,T*rQ,h+fQ,n+nQ,o+oQ,r+uQ,v+{Q-Q,iQ-S,mR-`-ThTOr#i#l$l%}&`'k(b(d)[+Z$z!tXYZhv|}!R!S!T!X!i!k#[$O$Q$S$V$j$z%P%Z%]%d%i%k%u&[&k&l&s&z'R'U'`'a'd'f'g'r'z(Q(W(Z(l({)O)X)e)o)u)x)y)|*S*V*X*[*]*`*g*h*o*r*z+b+c+f+m+n+o+q+r+u+y+{+},P,Q,S,g,i,m,p-T-U-a-l-m-nQ#vtW%T!n!r-g-qQ%U!oQ%V!pQ%X!sQ%c-fS'j%W-kQ'l-hQ'm-iQ+v*TQ,u+wS-W,s-dR-s-uU#zu-Y-tR(i&^[gOr#l$l)[+ZX!wX#[$S$VQ#UZQ$PvR$Y|Q%_!xQ%f!{Q%l#PQ'^$xQ'y%bQ'}%gQ(V%mQ(Y%nQ*_(SQ,t+vQ-[,uR-c-ZQ$XxQ'u%`R*U'vQ-Z,sR-e-dR#OYR#TZR$}!iQ${!iV)t'a)u+mR%Q!kR%v#[Q(`%vR*n(aQ$c!RQ&h$VQ)W&zR+V)XQ#plQ$[!OQ$_!PR&p$^Q(s&oQ*v(uQ*w(vR,Z*xR$a!QXpOr)[+ZQ$h!UR&{$iQ$o!XR&|$jR)n'YQ)l'YV,j+i,k-R",
  nodeNames: "⚠ print Comment Script AssignStatement * BinaryExpression BitOp BitOp BitOp BitOp ArithOp ArithOp @ ArithOp ** UnaryExpression ArithOp BitOp AwaitExpression await ParenthesizedExpression ( BinaryExpression or and CompareOp in not is UnaryExpression ConditionalExpression if else LambdaExpression lambda ParamList VariableName AssignOp , : NamedExpression AssignOp YieldExpression yield from ) TupleExpression ComprehensionExpression async for LambdaExpression ArrayExpression [ ] ArrayComprehensionExpression DictionaryExpression { } DictionaryComprehensionExpression SetExpression SetComprehensionExpression CallExpression ArgList AssignOp MemberExpression . PropertyName Number String FormatString FormatReplacement FormatConversion FormatSpec ContinuedString Ellipsis None Boolean TypeDef AssignOp UpdateStatement UpdateOp ExpressionStatement DeleteStatement del PassStatement pass BreakStatement break ContinueStatement continue ReturnStatement return YieldStatement PrintStatement RaiseStatement raise ImportStatement import as ScopeStatement global nonlocal AssertStatement assert StatementGroup ; IfStatement Body elif WhileStatement while ForStatement TryStatement try except finally WithStatement with FunctionDefinition def ParamList AssignOp TypeDef ClassDefinition class DecoratedStatement Decorator At",
  maxTerm: 234,
  context: trackIndent,
  nodeProps: [
    [lezer.NodeProp.group, -14,4,80,82,83,85,87,89,91,93,94,95,97,100,103,"Statement Statement",-22,6,16,19,21,37,47,48,52,55,56,59,60,61,62,65,68,69,70,74,75,76,77,"Expression",-9,105,107,110,112,113,117,119,124,126,"Statement"]
  ],
  skippedNodes: [0,2],
  repeatNodeCount: 32,
  tokenData: "&AaMgR!^OX$}XY!#xY[$}[]!#x]p$}pq!#xqr!&Srs!)yst!C{tu$}uv$+}vw$.awx$/mxy$Lgyz$Mmz{$Ns{|%#c|}%$o}!O%%u!O!P%([!P!Q%3b!Q!R%6Q!R![%:S![!]%EO!]!^%Gb!^!_%Hh!_!`%KW!`!a%Ld!a!b$}!b!c& P!c!d&!_!d!e&$P!e!h&!_!h!i&.R!i!t&!_!t!u&7g!u!w&!_!w!x&,a!x!}&!_!}#O&9q#O#P!%b#P#Q&:w#Q#R&;}#R#S&!_#S#T$}#T#U&!_#U#V&$P#V#Y&!_#Y#Z&.R#Z#f&!_#f#g&7g#g#i&!_#i#j&,a#j#o&!_#o#p&=Z#p#q&>P#q#r&?]#r#s&@Z#s$g$}$g~&!_<r%`Z%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}9[&^Z%p7[%gS%m`%v!bOr'PrsCxsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'P9['^Z%p7[%gS%jW%m`%v!bOr'Prs&Rsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'P8z(WZ%p7[%jWOr(yrs)wsw(ywx;bx#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y8z)UZ%p7[%gS%jW%v!bOr(yrs)wsw(ywx(Px#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y8z*QZ%p7[%gS%v!bOr(yrs*ssw(ywx(Px#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y8z*|Z%p7[%gS%v!bOr(yrs+osw(ywx(Px#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y8r+xX%p7[%gS%v!bOw+owx,ex#O+o#O#P.V#P#o+o#o#p0^#p#q+o#q#r.k#r~+o8r,jX%p7[Ow+owx-Vx#O+o#O#P.V#P#o+o#o#p0^#p#q+o#q#r.k#r~+o8r-[X%p7[Ow+owx-wx#O+o#O#P.V#P#o+o#o#p0^#p#q+o#q#r.k#r~+o7[-|R%p7[O#o-w#p#q-w#r~-w8r.[T%p7[O#o+o#o#p.k#p#q+o#q#r.k#r~+o!f.rV%gS%v!bOw.kwx/Xx#O.k#O#P0W#P#o.k#o#p0^#p~.k!f/[VOw.kwx/qx#O.k#O#P0W#P#o.k#o#p0^#p~.k!f/tUOw.kx#O.k#O#P0W#P#o.k#o#p0^#p~.k!f0ZPO~.k!f0cV%gSOw0xwx1^x#O0x#O#P2P#P#o0x#o#p.k#p~0xS0}T%gSOw0xwx1^x#O0x#O#P2P#P~0xS1aTOw0xwx1px#O0x#O#P2P#P~0xS1sSOw0xx#O0x#O#P2P#P~0xS2SPO~0x8z2[T%p7[O#o(y#o#p2k#p#q(y#q#r2k#r~(y!n2tX%gS%jW%v!bOr2krs3asw2kwx4wx#O2k#O#P7h#P#o2k#o#p7n#p~2k!n3hX%gS%v!bOr2krs4Tsw2kwx4wx#O2k#O#P7h#P#o2k#o#p7n#p~2k!n4[X%gS%v!bOr2krs.ksw2kwx4wx#O2k#O#P7h#P#o2k#o#p7n#p~2k!n4|X%jWOr2krs3asw2kwx5ix#O2k#O#P7h#P#o2k#o#p7n#p~2k!n5nX%jWOr2krs3asw2kwx6Zx#O2k#O#P7h#P#o2k#o#p7n#p~2kW6`T%jWOr6Zrs6os#O6Z#O#P7b#P~6ZW6rTOr6Zrs7Rs#O6Z#O#P7b#P~6ZW7USOr6Zs#O6Z#O#P7b#P~6ZW7ePO~6Z!n7kPO~2k!n7uX%gS%jWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#p2k#p~8b[8iV%gS%jWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P~8b[9TV%gSOr8brs9jsw8bwx:Ux#O8b#O#P;[#P~8b[9oV%gSOr8brs0xsw8bwx:Ux#O8b#O#P;[#P~8b[:ZV%jWOr8brs9Osw8bwx:px#O8b#O#P;[#P~8b[:uV%jWOr8brs9Osw8bwx6Zx#O8b#O#P;[#P~8b[;_PO~8b8z;iZ%p7[%jWOr(yrs)wsw(ywx<[x#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(y7d<cX%p7[%jWOr<[rs=Os#O<[#O#P>b#P#o<[#o#p6Z#p#q<[#q#r6Z#r~<[7d=TX%p7[Or<[rs=ps#O<[#O#P>b#P#o<[#o#p6Z#p#q<[#q#r6Z#r~<[7d=uX%p7[Or<[rs-ws#O<[#O#P>b#P#o<[#o#p6Z#p#q<[#q#r6Z#r~<[7d>gT%p7[O#o<[#o#p6Z#p#q<[#q#r6Z#r~<[9[>{T%p7[O#o'P#o#p?[#p#q'P#q#r?[#r~'P#O?gX%gS%jW%m`%v!bOr?[rs@Ssw?[wx4wx#O?[#O#PCO#P#o?[#o#pCU#p~?[#O@]X%gS%m`%v!bOr?[rs@xsw?[wx4wx#O?[#O#PCO#P#o?[#o#pCU#p~?[#OARX%gS%m`%v!bOr?[rsAnsw?[wx4wx#O?[#O#PCO#P#o?[#o#pCU#p~?[!vAwV%gS%m`%v!bOwAnwx/Xx#OAn#O#PB^#P#oAn#o#pBd#p~An!vBaPO~An!vBiV%gSOw0xwx1^x#O0x#O#P2P#P#o0x#o#pAn#p~0x#OCRPO~?[#OC]X%gS%jWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#p?[#p~8b9[DTZ%p7[%gS%m`%v!bOr'PrsDvsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'P9SERX%p7[%gS%m`%v!bOwDvwx,ex#ODv#O#PEn#P#oDv#o#pBd#p#qDv#q#rAn#r~Dv9SEsT%p7[O#oDv#o#pAn#p#qDv#q#rAn#r~Dv<bF_Z%p7[%jW%sp%x#tOrGQrs)wswGQwxM^x#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQ<bGaZ%p7[%gS%jW%sp%v!b%x#tOrGQrs)wswGQwxFSx#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQ<bHXT%p7[O#oGQ#o#pHh#p#qGQ#q#rHh#r~GQ&UHuX%gS%jW%sp%v!b%x#tOrHhrs3aswHhwxIbx#OHh#O#PLd#P#oHh#o#pLj#p~Hh&UIkX%jW%sp%x#tOrHhrs3aswHhwxJWx#OHh#O#PLd#P#oHh#o#pLj#p~Hh&UJaX%jW%sp%x#tOrHhrs3aswHhwxJ|x#OHh#O#PLd#P#oHh#o#pLj#p~Hh$nKVX%jW%sp%x#tOrJ|rs6oswJ|wxJ|x#OJ|#O#PKr#P#oJ|#o#pKx#p~J|$nKuPO~J|$nK}V%jWOr6Zrs6os#O6Z#O#P7b#P#o6Z#o#pJ|#p~6Z&ULgPO~Hh&ULqX%gS%jWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#pHh#p~8b<bMiZ%p7[%jW%sp%x#tOrGQrs)wswGQwxN[x#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQ:zNgZ%p7[%jW%sp%x#tOrN[rs=OswN[wxN[x#ON[#O#P! Y#P#oN[#o#pKx#p#qN[#q#rJ|#r~N[:z! _T%p7[O#oN[#o#pJ|#p#qN[#q#rJ|#r~N[<r! sT%p7[O#o$}#o#p!!S#p#q$}#q#r!!S#r~$}&f!!cX%gS%jW%m`%sp%v!b%x#tOr!!Srs@Ssw!!SwxIbx#O!!S#O#P!#O#P#o!!S#o#p!#U#p~!!S&f!#RPO~!!S&f!#]X%gS%jWOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#p!!S#p~8bMg!$]a%p7[%gS%jW$o1s%m`%sp%v!b%x#tOX$}XY!#xY[$}[]!#x]p$}pq!#xqr$}rs&Rsw$}wxFSx#O$}#O#P!%b#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Mg!%gX%p7[OY$}YZ!#xZ]$}]^!#x^#o$}#o#p!!S#p#q$}#q#r!!S#r~$}<u!&eb%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`!'m!`#O$}#O#P! n#P#T$}#T#U!(s#U#f$}#f#g!(s#g#h!(s#h#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u!(QZjR%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u!)WZ!jR%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{!*Y_%tp%p7[%gS%e,X%m`%v!bOY!+XYZ'PZ]!+X]^'P^r!+Xrs!BPsw!+Xwx!-gx#O!+X#O#P!>e#P#o!+X#o#p!@}#p#q!+X#q#r!>y#r~!+XDe!+h_%p7[%gS%jW%e,X%m`%v!bOY!+XYZ'PZ]!+X]^'P^r!+Xrs!,gsw!+Xwx!-gx#O!+X#O#P!>e#P#o!+X#o#p!@}#p#q!+X#q#r!>y#r~!+XDe!,tZ%p7[%gS%e,X%m`%v!bOr'PrsCxsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PDT!-p_%p7[%jW%e,XOY!.oYZ(yZ]!.o]^(y^r!.ors!/{sw!.owx!;Rx#O!.o#O#P!0y#P#o!.o#o#p!6m#p#q!.o#q#r!1_#r~!.oDT!.|_%p7[%gS%jW%e,X%v!bOY!.oYZ(yZ]!.o]^(y^r!.ors!/{sw!.owx!-gx#O!.o#O#P!0y#P#o!.o#o#p!6m#p#q!.o#q#r!1_#r~!.oDT!0WZ%p7[%gS%e,X%v!bOr(yrs*ssw(ywx(Px#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(yDT!1OT%p7[O#o!.o#o#p!1_#p#q!.o#q#r!1_#r~!.o-w!1j]%gS%jW%e,X%v!bOY!1_YZ2kZ]!1_]^2k^r!1_rs!2csw!1_wx!3Xx#O!1_#O#P!6g#P#o!1_#o#p!6m#p~!1_-w!2lX%gS%e,X%v!bOr2krs4Tsw2kwx4wx#O2k#O#P7h#P#o2k#o#p7n#p~2k-w!3`]%jW%e,XOY!1_YZ2kZ]!1_]^2k^r!1_rs!2csw!1_wx!4Xx#O!1_#O#P!6g#P#o!1_#o#p!6m#p~!1_-w!4`]%jW%e,XOY!1_YZ2kZ]!1_]^2k^r!1_rs!2csw!1_wx!5Xx#O!1_#O#P!6g#P#o!1_#o#p!6m#p~!1_,a!5`X%jW%e,XOY!5XYZ6ZZ]!5X]^6Z^r!5Xrs!5{s#O!5X#O#P!6a#P~!5X,a!6QT%e,XOr6Zrs7Rs#O6Z#O#P7b#P~6Z,a!6dPO~!5X-w!6jPO~!1_-w!6v]%gS%jW%e,XOY!7oYZ8bZ]!7o]^8b^r!7ors!8ksw!7owx!9Xx#O!7o#O#P!:{#P#o!7o#o#p!1_#p~!7o,e!7xZ%gS%jW%e,XOY!7oYZ8bZ]!7o]^8b^r!7ors!8ksw!7owx!9Xx#O!7o#O#P!:{#P~!7o,e!8rV%gS%e,XOr8brs9jsw8bwx:Ux#O8b#O#P;[#P~8b,e!9`Z%jW%e,XOY!7oYZ8bZ]!7o]^8b^r!7ors!8ksw!7owx!:Rx#O!7o#O#P!:{#P~!7o,e!:YZ%jW%e,XOY!7oYZ8bZ]!7o]^8b^r!7ors!8ksw!7owx!5Xx#O!7o#O#P!:{#P~!7o,e!;OPO~!7oDT!;[_%p7[%jW%e,XOY!.oYZ(yZ]!.o]^(y^r!.ors!/{sw!.owx!<Zx#O!.o#O#P!0y#P#o!.o#o#p!6m#p#q!.o#q#r!1_#r~!.oBm!<d]%p7[%jW%e,XOY!<ZYZ<[Z]!<Z]^<[^r!<Zrs!=]s#O!<Z#O#P!>P#P#o!<Z#o#p!5X#p#q!<Z#q#r!5X#r~!<ZBm!=dX%p7[%e,XOr<[rs=ps#O<[#O#P>b#P#o<[#o#p6Z#p#q<[#q#r6Z#r~<[Bm!>UT%p7[O#o!<Z#o#p!5X#p#q!<Z#q#r!5X#r~!<ZDe!>jT%p7[O#o!+X#o#p!>y#p#q!+X#q#r!>y#r~!+X.X!?W]%gS%jW%e,X%m`%v!bOY!>yYZ?[Z]!>y]^?[^r!>yrs!@Psw!>ywx!3Xx#O!>y#O#P!@w#P#o!>y#o#p!@}#p~!>y.X!@[X%gS%e,X%m`%v!bOr?[rs@xsw?[wx4wx#O?[#O#PCO#P#o?[#o#pCU#p~?[.X!@zPO~!>y.X!AW]%gS%jW%e,XOY!7oYZ8bZ]!7o]^8b^r!7ors!8ksw!7owx!9Xx#O!7o#O#P!:{#P#o!7o#o#p!>y#p~!7oGZ!B^Z%p7[%gS%e,X%m`%v!bOr'Prs!CPsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PGZ!C`X%k#|%p7[%gS%i,X%m`%v!bOwDvwx,ex#ODv#O#PEn#P#oDv#o#pBd#p#qDv#q#rAn#r~DvMg!D`_Q1s%p7[%gS%jW%m`%sp%v!b%x#tOY!C{YZ$}Z]!C{]^$}^r!C{rs!E_sw!C{wx#Hqx#O!C{#O#P$(i#P#o!C{#o#p$*{#p#q!C{#q#r$)]#r~!C{JP!El_Q1s%p7[%gS%m`%v!bOY!FkYZ'PZ]!Fk]^'P^r!Fkrs#Eksw!Fkwx!Gyx#O!Fk#O#P#=u#P#o!Fk#o#p#Di#p#q!Fk#q#r#>i#r~!FkJP!Fz_Q1s%p7[%gS%jW%m`%v!bOY!FkYZ'PZ]!Fk]^'P^r!Fkrs!E_sw!Fkwx!Gyx#O!Fk#O#P#=u#P#o!Fk#o#p#Di#p#q!Fk#q#r#>i#r~!FkIo!HS_Q1s%p7[%jWOY!IRYZ(yZ]!IR]^(y^r!IRrs!J_sw!IRwx#8wx#O!IR#O#P#*R#P#o!IR#o#p#2}#p#q!IR#q#r#*u#r~!IRIo!I`_Q1s%p7[%gS%jW%v!bOY!IRYZ(yZ]!IR]^(y^r!IRrs!J_sw!IRwx!Gyx#O!IR#O#P#*R#P#o!IR#o#p#2}#p#q!IR#q#r#*u#r~!IRIo!Jj_Q1s%p7[%gS%v!bOY!IRYZ(yZ]!IR]^(y^r!IRrs!Kisw!IRwx!Gyx#O!IR#O#P#*R#P#o!IR#o#p#2}#p#q!IR#q#r#*u#r~!IRIo!Kt_Q1s%p7[%gS%v!bOY!IRYZ(yZ]!IR]^(y^r!IRrs!Lssw!IRwx!Gyx#O!IR#O#P#*R#P#o!IR#o#p#2}#p#q!IR#q#r#*u#r~!IRIg!MO]Q1s%p7[%gS%v!bOY!LsYZ+oZ]!Ls]^+o^w!Lswx!Mwx#O!Ls#O#P#!y#P#o!Ls#o#p#&m#p#q!Ls#q#r##m#r~!LsIg!NO]Q1s%p7[OY!LsYZ+oZ]!Ls]^+o^w!Lswx!Nwx#O!Ls#O#P#!y#P#o!Ls#o#p#&m#p#q!Ls#q#r##m#r~!LsIg# O]Q1s%p7[OY!LsYZ+oZ]!Ls]^+o^w!Lswx# wx#O!Ls#O#P#!y#P#o!Ls#o#p#&m#p#q!Ls#q#r##m#r~!LsHP#!OXQ1s%p7[OY# wYZ-wZ]# w]^-w^#o# w#o#p#!k#p#q# w#q#r#!k#r~# w1s#!pRQ1sOY#!kZ]#!k^~#!kIg##QXQ1s%p7[OY!LsYZ+oZ]!Ls]^+o^#o!Ls#o#p##m#p#q!Ls#q#r##m#r~!Ls3Z##vZQ1s%gS%v!bOY##mYZ.kZ]##m]^.k^w##mwx#$ix#O##m#O#P#&X#P#o##m#o#p#&m#p~##m3Z#$nZQ1sOY##mYZ.kZ]##m]^.k^w##mwx#%ax#O##m#O#P#&X#P#o##m#o#p#&m#p~##m3Z#%fZQ1sOY##mYZ.kZ]##m]^.k^w##mwx#!kx#O##m#O#P#&X#P#o##m#o#p#&m#p~##m3Z#&^TQ1sOY##mYZ.kZ]##m]^.k^~##m3Z#&tZQ1s%gSOY#'gYZ0xZ]#'g]^0x^w#'gwx#(Zx#O#'g#O#P#)m#P#o#'g#o#p##m#p~#'g1w#'nXQ1s%gSOY#'gYZ0xZ]#'g]^0x^w#'gwx#(Zx#O#'g#O#P#)m#P~#'g1w#(`XQ1sOY#'gYZ0xZ]#'g]^0x^w#'gwx#({x#O#'g#O#P#)m#P~#'g1w#)QXQ1sOY#'gYZ0xZ]#'g]^0x^w#'gwx#!kx#O#'g#O#P#)m#P~#'g1w#)rTQ1sOY#'gYZ0xZ]#'g]^0x^~#'gIo#*YXQ1s%p7[OY!IRYZ(yZ]!IR]^(y^#o!IR#o#p#*u#p#q!IR#q#r#*u#r~!IR3c#+Q]Q1s%gS%jW%v!bOY#*uYZ2kZ]#*u]^2k^r#*urs#+ysw#*uwx#-}x#O#*u#O#P#2i#P#o#*u#o#p#2}#p~#*u3c#,S]Q1s%gS%v!bOY#*uYZ2kZ]#*u]^2k^r#*urs#,{sw#*uwx#-}x#O#*u#O#P#2i#P#o#*u#o#p#2}#p~#*u3c#-U]Q1s%gS%v!bOY#*uYZ2kZ]#*u]^2k^r#*urs##msw#*uwx#-}x#O#*u#O#P#2i#P#o#*u#o#p#2}#p~#*u3c#.U]Q1s%jWOY#*uYZ2kZ]#*u]^2k^r#*urs#+ysw#*uwx#.}x#O#*u#O#P#2i#P#o#*u#o#p#2}#p~#*u3c#/U]Q1s%jWOY#*uYZ2kZ]#*u]^2k^r#*urs#+ysw#*uwx#/}x#O#*u#O#P#2i#P#o#*u#o#p#2}#p~#*u1{#0UXQ1s%jWOY#/}YZ6ZZ]#/}]^6Z^r#/}rs#0qs#O#/}#O#P#2T#P~#/}1{#0vXQ1sOY#/}YZ6ZZ]#/}]^6Z^r#/}rs#1cs#O#/}#O#P#2T#P~#/}1{#1hXQ1sOY#/}YZ6ZZ]#/}]^6Z^r#/}rs#!ks#O#/}#O#P#2T#P~#/}1{#2YTQ1sOY#/}YZ6ZZ]#/}]^6Z^~#/}3c#2nTQ1sOY#*uYZ2kZ]#*u]^2k^~#*u3c#3W]Q1s%gS%jWOY#4PYZ8bZ]#4P]^8b^r#4Prs#4{sw#4Pwx#6ox#O#4P#O#P#8c#P#o#4P#o#p#*u#p~#4P2P#4YZQ1s%gS%jWOY#4PYZ8bZ]#4P]^8b^r#4Prs#4{sw#4Pwx#6ox#O#4P#O#P#8c#P~#4P2P#5SZQ1s%gSOY#4PYZ8bZ]#4P]^8b^r#4Prs#5usw#4Pwx#6ox#O#4P#O#P#8c#P~#4P2P#5|ZQ1s%gSOY#4PYZ8bZ]#4P]^8b^r#4Prs#'gsw#4Pwx#6ox#O#4P#O#P#8c#P~#4P2P#6vZQ1s%jWOY#4PYZ8bZ]#4P]^8b^r#4Prs#4{sw#4Pwx#7ix#O#4P#O#P#8c#P~#4P2P#7pZQ1s%jWOY#4PYZ8bZ]#4P]^8b^r#4Prs#4{sw#4Pwx#/}x#O#4P#O#P#8c#P~#4P2P#8hTQ1sOY#4PYZ8bZ]#4P]^8b^~#4PIo#9Q_Q1s%p7[%jWOY!IRYZ(yZ]!IR]^(y^r!IRrs!J_sw!IRwx#:Px#O!IR#O#P#*R#P#o!IR#o#p#2}#p#q!IR#q#r#*u#r~!IRHX#:Y]Q1s%p7[%jWOY#:PYZ<[Z]#:P]^<[^r#:Prs#;Rs#O#:P#O#P#=R#P#o#:P#o#p#/}#p#q#:P#q#r#/}#r~#:PHX#;Y]Q1s%p7[OY#:PYZ<[Z]#:P]^<[^r#:Prs#<Rs#O#:P#O#P#=R#P#o#:P#o#p#/}#p#q#:P#q#r#/}#r~#:PHX#<Y]Q1s%p7[OY#:PYZ<[Z]#:P]^<[^r#:Prs# ws#O#:P#O#P#=R#P#o#:P#o#p#/}#p#q#:P#q#r#/}#r~#:PHX#=YXQ1s%p7[OY#:PYZ<[Z]#:P]^<[^#o#:P#o#p#/}#p#q#:P#q#r#/}#r~#:PJP#=|XQ1s%p7[OY!FkYZ'PZ]!Fk]^'P^#o!Fk#o#p#>i#p#q!Fk#q#r#>i#r~!Fk3s#>v]Q1s%gS%jW%m`%v!bOY#>iYZ?[Z]#>i]^?[^r#>irs#?osw#>iwx#-}x#O#>i#O#P#DT#P#o#>i#o#p#Di#p~#>i3s#?z]Q1s%gS%m`%v!bOY#>iYZ?[Z]#>i]^?[^r#>irs#@ssw#>iwx#-}x#O#>i#O#P#DT#P#o#>i#o#p#Di#p~#>i3s#AO]Q1s%gS%m`%v!bOY#>iYZ?[Z]#>i]^?[^r#>irs#Awsw#>iwx#-}x#O#>i#O#P#DT#P#o#>i#o#p#Di#p~#>i3k#BSZQ1s%gS%m`%v!bOY#AwYZAnZ]#Aw]^An^w#Awwx#$ix#O#Aw#O#P#Bu#P#o#Aw#o#p#CZ#p~#Aw3k#BzTQ1sOY#AwYZAnZ]#Aw]^An^~#Aw3k#CbZQ1s%gSOY#'gYZ0xZ]#'g]^0x^w#'gwx#(Zx#O#'g#O#P#)m#P#o#'g#o#p#Aw#p~#'g3s#DYTQ1sOY#>iYZ?[Z]#>i]^?[^~#>i3s#Dr]Q1s%gS%jWOY#4PYZ8bZ]#4P]^8b^r#4Prs#4{sw#4Pwx#6ox#O#4P#O#P#8c#P#o#4P#o#p#>i#p~#4PJP#Ex_Q1s%p7[%gS%m`%v!bOY!FkYZ'PZ]!Fk]^'P^r!Fkrs#Fwsw!Fkwx!Gyx#O!Fk#O#P#=u#P#o!Fk#o#p#Di#p#q!Fk#q#r#>i#r~!FkIw#GU]Q1s%p7[%gS%m`%v!bOY#FwYZDvZ]#Fw]^Dv^w#Fwwx!Mwx#O#Fw#O#P#G}#P#o#Fw#o#p#CZ#p#q#Fw#q#r#Aw#r~#FwIw#HUXQ1s%p7[OY#FwYZDvZ]#Fw]^Dv^#o#Fw#o#p#Aw#p#q#Fw#q#r#Aw#r~#FwMV#IO_Q1s%p7[%jW%sp%x#tOY#I}YZGQZ]#I}]^GQ^r#I}rs!J_sw#I}wx$%]x#O#I}#O#P#K_#P#o#I}#o#p$$Z#p#q#I}#q#r#LR#r~#I}MV#J`_Q1s%p7[%gS%jW%sp%v!b%x#tOY#I}YZGQZ]#I}]^GQ^r#I}rs!J_sw#I}wx#Hqx#O#I}#O#P#K_#P#o#I}#o#p$$Z#p#q#I}#q#r#LR#r~#I}MV#KfXQ1s%p7[OY#I}YZGQZ]#I}]^GQ^#o#I}#o#p#LR#p#q#I}#q#r#LR#r~#I}6y#Lb]Q1s%gS%jW%sp%v!b%x#tOY#LRYZHhZ]#LR]^Hh^r#LRrs#+ysw#LRwx#MZx#O#LR#O#P$#u#P#o#LR#o#p$$Z#p~#LR6y#Mf]Q1s%jW%sp%x#tOY#LRYZHhZ]#LR]^Hh^r#LRrs#+ysw#LRwx#N_x#O#LR#O#P$#u#P#o#LR#o#p$$Z#p~#LR6y#Nj]Q1s%jW%sp%x#tOY#LRYZHhZ]#LR]^Hh^r#LRrs#+ysw#LRwx$ cx#O#LR#O#P$#u#P#o#LR#o#p$$Z#p~#LR5c$ n]Q1s%jW%sp%x#tOY$ cYZJ|Z]$ c]^J|^r$ crs#0qsw$ cwx$ cx#O$ c#O#P$!g#P#o$ c#o#p$!{#p~$ c5c$!lTQ1sOY$ cYZJ|Z]$ c]^J|^~$ c5c$#SZQ1s%jWOY#/}YZ6ZZ]#/}]^6Z^r#/}rs#0qs#O#/}#O#P#2T#P#o#/}#o#p$ c#p~#/}6y$#zTQ1sOY#LRYZHhZ]#LR]^Hh^~#LR6y$$d]Q1s%gS%jWOY#4PYZ8bZ]#4P]^8b^r#4Prs#4{sw#4Pwx#6ox#O#4P#O#P#8c#P#o#4P#o#p#LR#p~#4PMV$%j_Q1s%p7[%jW%sp%x#tOY#I}YZGQZ]#I}]^GQ^r#I}rs!J_sw#I}wx$&ix#O#I}#O#P#K_#P#o#I}#o#p$$Z#p#q#I}#q#r#LR#r~#I}Ko$&v_Q1s%p7[%jW%sp%x#tOY$&iYZN[Z]$&i]^N[^r$&irs#;Rsw$&iwx$&ix#O$&i#O#P$'u#P#o$&i#o#p$!{#p#q$&i#q#r$ c#r~$&iKo$'|XQ1s%p7[OY$&iYZN[Z]$&i]^N[^#o$&i#o#p$ c#p#q$&i#q#r$ c#r~$&iMg$(pXQ1s%p7[OY!C{YZ$}Z]!C{]^$}^#o!C{#o#p$)]#p#q!C{#q#r$)]#r~!C{7Z$)n]Q1s%gS%jW%m`%sp%v!b%x#tOY$)]YZ!!SZ]$)]]^!!S^r$)]rs#?osw$)]wx#MZx#O$)]#O#P$*g#P#o$)]#o#p$*{#p~$)]7Z$*lTQ1sOY$)]YZ!!SZ]$)]]^!!S^~$)]7Z$+U]Q1s%gS%jWOY#4PYZ8bZ]#4P]^8b^r#4Prs#4{sw#4Pwx#6ox#O#4P#O#P#8c#P#o#4P#o#p$)]#p~#4PGz$,b]$}Q%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz$-nZ!s,W%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz$.t]$wQ%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{$/|_%q`%p7[%jW%e,X%sp%x#tOY$0{YZGQZ]$0{]^GQ^r$0{rs$2]sw$0{wx$Jex#O$0{#O#P$Fw#P#o$0{#o#p$Ic#p#q$0{#q#r$G]#r~$0{Gk$1^_%p7[%gS%jW%e,X%sp%v!b%x#tOY$0{YZGQZ]$0{]^GQ^r$0{rs$2]sw$0{wx$Ewx#O$0{#O#P$Fw#P#o$0{#o#p$Ic#p#q$0{#q#r$G]#r~$0{DT$2h_%p7[%gS%e,X%v!bOY$3gYZ(yZ]$3g]^(y^r$3grs$Basw$3gwx$4sx#O$3g#O#P$5o#P#o$3g#o#p$={#p#q$3g#q#r$6T#r~$3gDT$3t_%p7[%gS%jW%e,X%v!bOY$3gYZ(yZ]$3g]^(y^r$3grs$2]sw$3gwx$4sx#O$3g#O#P$5o#P#o$3g#o#p$={#p#q$3g#q#r$6T#r~$3gDT$4|Z%p7[%jW%e,XOr(yrs)wsw(ywx;bx#O(y#O#P2V#P#o(y#o#p7n#p#q(y#q#r2k#r~(yDT$5tT%p7[O#o$3g#o#p$6T#p#q$3g#q#r$6T#r~$3g-w$6`]%gS%jW%e,X%v!bOY$6TYZ2kZ]$6T]^2k^r$6Trs$7Xsw$6Twx$=Rx#O$6T#O#P$=u#P#o$6T#o#p$={#p~$6T-w$7b]%gS%e,X%v!bOY$6TYZ2kZ]$6T]^2k^r$6Trs$8Zsw$6Twx$=Rx#O$6T#O#P$=u#P#o$6T#o#p$={#p~$6T-w$8d]%gS%e,X%v!bOY$6TYZ2kZ]$6T]^2k^r$6Trs$9]sw$6Twx$=Rx#O$6T#O#P$=u#P#o$6T#o#p$={#p~$6T-o$9fZ%gS%e,X%v!bOY$9]YZ.kZ]$9]]^.k^w$9]wx$:Xx#O$9]#O#P$:s#P#o$9]#o#p$:y#p~$9]-o$:^V%e,XOw.kwx/qx#O.k#O#P0W#P#o.k#o#p0^#p~.k-o$:vPO~$9]-o$;QZ%gS%e,XOY$;sYZ0xZ]$;s]^0x^w$;swx$<gx#O$;s#O#P$<{#P#o$;s#o#p$9]#p~$;s,]$;zX%gS%e,XOY$;sYZ0xZ]$;s]^0x^w$;swx$<gx#O$;s#O#P$<{#P~$;s,]$<lT%e,XOw0xwx1px#O0x#O#P2P#P~0x,]$=OPO~$;s-w$=YX%jW%e,XOr2krs3asw2kwx5ix#O2k#O#P7h#P#o2k#o#p7n#p~2k-w$=xPO~$6T-w$>U]%gS%jW%e,XOY$>}YZ8bZ]$>}]^8b^r$>}rs$?ysw$>}wx$Amx#O$>}#O#P$BZ#P#o$>}#o#p$6T#p~$>},e$?WZ%gS%jW%e,XOY$>}YZ8bZ]$>}]^8b^r$>}rs$?ysw$>}wx$Amx#O$>}#O#P$BZ#P~$>},e$@QZ%gS%e,XOY$>}YZ8bZ]$>}]^8b^r$>}rs$@ssw$>}wx$Amx#O$>}#O#P$BZ#P~$>},e$@zZ%gS%e,XOY$>}YZ8bZ]$>}]^8b^r$>}rs$;ssw$>}wx$Amx#O$>}#O#P$BZ#P~$>},e$AtV%jW%e,XOr8brs9Osw8bwx:px#O8b#O#P;[#P~8b,e$B^PO~$>}DT$Bl_%p7[%gS%e,X%v!bOY$3gYZ(yZ]$3g]^(y^r$3grs$Cksw$3gwx$4sx#O$3g#O#P$5o#P#o$3g#o#p$={#p#q$3g#q#r$6T#r~$3gC{$Cv]%p7[%gS%e,X%v!bOY$CkYZ+oZ]$Ck]^+o^w$Ckwx$Dox#O$Ck#O#P$Ec#P#o$Ck#o#p$:y#p#q$Ck#q#r$9]#r~$CkC{$DvX%p7[%e,XOw+owx-Vx#O+o#O#P.V#P#o+o#o#p0^#p#q+o#q#r.k#r~+oC{$EhT%p7[O#o$Ck#o#p$9]#p#q$Ck#q#r$9]#r~$CkGk$FUZ%p7[%jW%e,X%sp%x#tOrGQrs)wswGQwxM^x#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQGk$F|T%p7[O#o$0{#o#p$G]#p#q$0{#q#r$G]#r~$0{1_$Gl]%gS%jW%e,X%sp%v!b%x#tOY$G]YZHhZ]$G]]^Hh^r$G]rs$7Xsw$G]wx$Hex#O$G]#O#P$I]#P#o$G]#o#p$Ic#p~$G]1_$HpX%jW%e,X%sp%x#tOrHhrs3aswHhwxJWx#OHh#O#PLd#P#oHh#o#pLj#p~Hh1_$I`PO~$G]1_$Il]%gS%jW%e,XOY$>}YZ8bZ]$>}]^8b^r$>}rs$?ysw$>}wx$Amx#O$>}#O#P$BZ#P#o$>}#o#p$G]#p~$>}Gk$JrZ%p7[%jW%e,X%sp%x#tOrGQrs)wswGQwx$Kex#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQGk$KtZ%h!f%p7[%jW%f,X%sp%x#tOrN[rs=OswN[wxN[x#ON[#O#P! Y#P#oN[#o#pKx#p#qN[#q#rJ|#r~N[G{$LzZf,X%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u$NQZ!OR%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{% W_T,X%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSxz$}z{%!V{!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%!j]_R%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%#v]$z,X%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u%%SZwR%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Mg%&Y^${,X%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`!a%'U!a#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}B^%'iZ&S&j%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%(o_!dQ%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!O$}!O!P%)n!P!Q$}!Q![%,O![#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%*P]%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!O$}!O!P%*x!P#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%+]Z!m,X%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%,cg!f,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%,O![!g$}!g!h%-z!h!l$}!l!m%2[!m#O$}#O#P! n#P#R$}#R#S%,O#S#X$}#X#Y%-z#Y#^$}#^#_%2[#_#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%.]a%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx{$}{|%/b|}$}}!O%/b!O!Q$}!Q![%0l![#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%/s]%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%0l![#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%1Pc!f,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%0l![!l$}!l!m%2[!m#O$}#O#P! n#P#R$}#R#S%0l#S#^$}#^#_%2[#_#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%2oZ!f,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%3u_$|R%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!P$}!P!Q%4t!Q!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz%5X]%OQ%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%6eu!f,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!O$}!O!P%8x!P!Q$}!Q![%:S![!d$}!d!e%<U!e!g$}!g!h%-z!h!l$}!l!m%2[!m!q$}!q!r%?O!r!z$}!z!{%Ar!{#O$}#O#P! n#P#R$}#R#S%:S#S#U$}#U#V%<U#V#X$}#X#Y%-z#Y#^$}#^#_%2[#_#c$}#c#d%?O#d#l$}#l#m%Ar#m#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%9Z]%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%,O![#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%:gi!f,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!O$}!O!P%8x!P!Q$}!Q![%:S![!g$}!g!h%-z!h!l$}!l!m%2[!m#O$}#O#P! n#P#R$}#R#S%:S#S#X$}#X#Y%-z#Y#^$}#^#_%2[#_#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%<g`%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q!R%=i!R!S%=i!S#O$}#O#P! n#P#R$}#R#S%=i#S#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%=|`!f,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q!R%=i!R!S%=i!S#O$}#O#P! n#P#R$}#R#S%=i#S#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%?a_%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q!Y%@`!Y#O$}#O#P! n#P#R$}#R#S%@`#S#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%@s_!f,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q!Y%@`!Y#O$}#O#P! n#P#R$}#R#S%@`#S#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%BTc%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%C`![!c$}!c!i%C`!i#O$}#O#P! n#P#R$}#R#S%C`#S#T$}#T#Z%C`#Z#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy%Csc!f,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!Q$}!Q![%C`![!c$}!c!i%C`!i#O$}#O#P! n#P#R$}#R#S%C`#S#T$}#T#Z%C`#Z#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Mg%Ec]x1s%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`%F[!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u%FoZ%WR%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%GuZ#^,X%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%H{_jR%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!^$}!^!_%Iz!_!`!'m!`!a!'m!a#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz%J_]$xQ%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%Kk]%V,X%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`!'m!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{%Lw^jR%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`!'m!`!a%Ms!a#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz%NW]$yQ%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}G{& f]]Q#tP%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Mg&!tc%p7[%gS%jW%d&j%m`%sp%v!b%x#t%Q,XOr$}rs&Rsw$}wxFSx!Q$}!Q![&!_![!c$}!c!}&!_!}#O$}#O#P! n#P#R$}#R#S&!_#S#T$}#T#o&!_#o#p!#U#p#q$}#q#r!!S#r$g$}$g~&!_Mg&$fg%p7[%gS%jW%d&j%m`%sp%v!b%x#t%Q,XOr$}rs&%}sw$}wx&)Tx!Q$}!Q![&!_![!c$}!c!t&!_!t!u&,a!u!}&!_!}#O$}#O#P! n#P#R$}#R#S&!_#S#T$}#T#f&!_#f#g&,a#g#o&!_#o#p!#U#p#q$}#q#r!!S#r$g$}$g~&!_De&&[_%p7[%gS%e,X%m`%v!bOY!+XYZ'PZ]!+X]^'P^r!+Xrs&'Zsw!+Xwx!-gx#O!+X#O#P!>e#P#o!+X#o#p!@}#p#q!+X#q#r!>y#r~!+XDe&'hZ%p7[%gS%e,X%m`%v!bOr'Prs&(Zsw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PD]&(hX%p7[%gS%i,X%m`%v!bOwDvwx,ex#ODv#O#PEn#P#oDv#o#pBd#p#qDv#q#rAn#r~DvGk&)b_%p7[%jW%e,X%sp%x#tOY$0{YZGQZ]$0{]^GQ^r$0{rs$2]sw$0{wx&*ax#O$0{#O#P$Fw#P#o$0{#o#p$Ic#p#q$0{#q#r$G]#r~$0{Gk&*nZ%p7[%jW%e,X%sp%x#tOrGQrs)wswGQwx&+ax#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQFT&+nZ%p7[%jW%f,X%sp%x#tOrN[rs=OswN[wxN[x#ON[#O#P! Y#P#oN[#o#pKx#p#qN[#q#rJ|#r~N[Mg&,vc%p7[%gS%jW%d&j%m`%sp%v!b%x#t%Q,XOr$}rs&%}sw$}wx&)Tx!Q$}!Q![&!_![!c$}!c!}&!_!}#O$}#O#P! n#P#R$}#R#S&!_#S#T$}#T#o&!_#o#p!#U#p#q$}#q#r!!S#r$g$}$g~&!_Mg&.hg%p7[%gS%jW%d&j%m`%sp%v!b%x#t%Q,XOr$}rs&0Psw$}wx&2wx!Q$}!Q![&!_![!c$}!c!t&!_!t!u&5u!u!}&!_!}#O$}#O#P! n#P#R$}#R#S&!_#S#T$}#T#f&!_#f#g&5u#g#o&!_#o#p!#U#p#q$}#q#r!!S#r$g$}$g~&!_De&0^Z%p7[%gS%m`%v!b%r,XOr'Prs&1Psw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PDe&1[Z%p7[%gS%m`%v!bOr'Prs&1}sw'Pwx(Px#O'P#O#P>v#P#o'P#o#pCU#p#q'P#q#r?[#r~'PD]&2[X%p7[%gS%w,X%m`%v!bOwDvwx,ex#ODv#O#PEn#P#oDv#o#pBd#p#qDv#q#rAn#r~DvGk&3UZ%p7[%jW%sp%x#t%l,XOrGQrs)wswGQwx&3wx#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQGk&4SZ%p7[%jW%sp%x#tOrGQrs)wswGQwx&4ux#OGQ#O#PHS#P#oGQ#o#pLj#p#qGQ#q#rHh#r~GQFT&5SZ%p7[%jW%u,X%sp%x#tOrN[rs=OswN[wxN[x#ON[#O#P! Y#P#oN[#o#pKx#p#qN[#q#rJ|#r~N[Mg&6[c%p7[%gS%jW%d&j%m`%sp%v!b%x#t%Q,XOr$}rs&0Psw$}wx&2wx!Q$}!Q![&!_![!c$}!c!}&!_!}#O$}#O#P! n#P#R$}#R#S&!_#S#T$}#T#o&!_#o#p!#U#p#q$}#q#r!!S#r$g$}$g~&!_Mg&7|k%p7[%gS%jW%d&j%m`%sp%v!b%x#t%Q,XOr$}rs&%}sw$}wx&)Tx!Q$}!Q![&!_![!c$}!c!h&!_!h!i&5u!i!t&!_!t!u&,a!u!}&!_!}#O$}#O#P! n#P#R$}#R#S&!_#S#T$}#T#U&!_#U#V&,a#V#Y&!_#Y#Z&5u#Z#o&!_#o#p!#U#p#q$}#q#r!!S#r$g$}$g~&!_G{&:UZ!V,X%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u&;[Z!WR%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gz&<b]$vQ%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}Gy&=dX%gS%jW!ZGmOr8brs9Osw8bwx:Ux#O8b#O#P;[#P#o8b#o#p!!S#p~8bGz&>d]$uQ%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx!_$}!_!`$-Z!`#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}<u&?nX![7_%gS%jW%m`%sp%v!b%x#tOr!!Srs@Ssw!!SwxIbx#O!!S#O#P!#O#P#o!!S#o#p!#U#p~!!SGy&@nZ%P,V%p7[%gS%jW%m`%sp%v!b%x#tOr$}rs&Rsw$}wxFSx#O$}#O#P! n#P#o$}#o#p!#U#p#q$}#q#r!!S#r~$}",
  tokenizers: [legacyPrint, indentation, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, newlines],
  topRules: {"Script":[0,3]},
  specialized: [{term: 186, get: value => spec_identifier[value] || -1}],
  tokenPrec: 6594
});

exports.parser = parser;


/***/ }),

/***/ "./node_modules/lezer-tree/dist/tree.cjs":
/*!***********************************************!*\
  !*** ./node_modules/lezer-tree/dist/tree.cjs ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({ value: true }));

/// The default maximum length of a `TreeBuffer` node.
const DefaultBufferLength = 1024;
let nextPropID = 0;
const CachedNode = new WeakMap();
/// Each [node type](#tree.NodeType) can have metadata associated with
/// it in props. Instances of this class represent prop names.
class NodeProp {
    /// Create a new node prop type. You can optionally pass a
    /// `deserialize` function.
    constructor({ deserialize } = {}) {
        this.id = nextPropID++;
        this.deserialize = deserialize || (() => {
            throw new Error("This node type doesn't define a deserialize function");
        });
    }
    /// Create a string-valued node prop whose deserialize function is
    /// the identity function.
    static string() { return new NodeProp({ deserialize: str => str }); }
    /// Create a number-valued node prop whose deserialize function is
    /// just `Number`.
    static number() { return new NodeProp({ deserialize: Number }); }
    /// Creates a boolean-valued node prop whose deserialize function
    /// returns true for any input.
    static flag() { return new NodeProp({ deserialize: () => true }); }
    /// Store a value for this prop in the given object. This can be
    /// useful when building up a prop object to pass to the
    /// [`NodeType`](#tree.NodeType) constructor. Returns its first
    /// argument.
    set(propObj, value) {
        propObj[this.id] = value;
        return propObj;
    }
    /// This is meant to be used with
    /// [`NodeSet.extend`](#tree.NodeSet.extend) or
    /// [`Parser.withProps`](#lezer.Parser.withProps) to compute prop
    /// values for each node type in the set. Takes a [match
    /// object](#tree.NodeType^match) or function that returns undefined
    /// if the node type doesn't get this prop, and the prop's value if
    /// it does.
    add(match) {
        if (typeof match != "function")
            match = NodeType.match(match);
        return (type) => {
            let result = match(type);
            return result === undefined ? null : [this, result];
        };
    }
}
/// Prop that is used to describe matching delimiters. For opening
/// delimiters, this holds an array of node names (written as a
/// space-separated string when declaring this prop in a grammar)
/// for the node types of closing delimiters that match it.
NodeProp.closedBy = new NodeProp({ deserialize: str => str.split(" ") });
/// The inverse of [`openedBy`](#tree.NodeProp^closedBy). This is
/// attached to closing delimiters, holding an array of node names
/// of types of matching opening delimiters.
NodeProp.openedBy = new NodeProp({ deserialize: str => str.split(" ") });
/// Used to assign node types to groups (for example, all node
/// types that represent an expression could be tagged with an
/// `"Expression"` group).
NodeProp.group = new NodeProp({ deserialize: str => str.split(" ") });
const noProps = Object.create(null);
/// Each node in a syntax tree has a node type associated with it.
class NodeType {
    /// @internal
    constructor(
    /// The name of the node type. Not necessarily unique, but if the
    /// grammar was written properly, different node types with the
    /// same name within a node set should play the same semantic
    /// role.
    name, 
    /// @internal
    props, 
    /// The id of this node in its set. Corresponds to the term ids
    /// used in the parser.
    id, 
    /// @internal
    flags = 0) {
        this.name = name;
        this.props = props;
        this.id = id;
        this.flags = flags;
    }
    static define(spec) {
        let props = spec.props && spec.props.length ? Object.create(null) : noProps;
        let flags = (spec.top ? 1 /* Top */ : 0) | (spec.skipped ? 2 /* Skipped */ : 0) |
            (spec.error ? 4 /* Error */ : 0) | (spec.name == null ? 8 /* Anonymous */ : 0);
        let type = new NodeType(spec.name || "", props, spec.id, flags);
        if (spec.props)
            for (let src of spec.props) {
                if (!Array.isArray(src))
                    src = src(type);
                if (src)
                    src[0].set(props, src[1]);
            }
        return type;
    }
    /// Retrieves a node prop for this type. Will return `undefined` if
    /// the prop isn't present on this node.
    prop(prop) { return this.props[prop.id]; }
    /// True when this is the top node of a grammar.
    get isTop() { return (this.flags & 1 /* Top */) > 0; }
    /// True when this node is produced by a skip rule.
    get isSkipped() { return (this.flags & 2 /* Skipped */) > 0; }
    /// Indicates whether this is an error node.
    get isError() { return (this.flags & 4 /* Error */) > 0; }
    /// When true, this node type doesn't correspond to a user-declared
    /// named node, for example because it is used to cache repetition.
    get isAnonymous() { return (this.flags & 8 /* Anonymous */) > 0; }
    /// Returns true when this node's name or one of its
    /// [groups](#tree.NodeProp^group) matches the given string.
    is(name) {
        if (typeof name == 'string') {
            if (this.name == name)
                return true;
            let group = this.prop(NodeProp.group);
            return group ? group.indexOf(name) > -1 : false;
        }
        return this.id == name;
    }
    /// Create a function from node types to arbitrary values by
    /// specifying an object whose property names are node or
    /// [group](#tree.NodeProp^group) names. Often useful with
    /// [`NodeProp.add`](#tree.NodeProp.add). You can put multiple
    /// names, separated by spaces, in a single property name to map
    /// multiple node names to a single value.
    static match(map) {
        let direct = Object.create(null);
        for (let prop in map)
            for (let name of prop.split(" "))
                direct[name] = map[prop];
        return (node) => {
            for (let groups = node.prop(NodeProp.group), i = -1; i < (groups ? groups.length : 0); i++) {
                let found = direct[i < 0 ? node.name : groups[i]];
                if (found)
                    return found;
            }
        };
    }
}
/// An empty dummy node type to use when no actual type is available.
NodeType.none = new NodeType("", Object.create(null), 0, 8 /* Anonymous */);
/// A node set holds a collection of node types. It is used to
/// compactly represent trees by storing their type ids, rather than a
/// full pointer to the type object, in a number array. Each parser
/// [has](#lezer.Parser.nodeSet) a node set, and [tree
/// buffers](#tree.TreeBuffer) can only store collections of nodes
/// from the same set. A set can have a maximum of 2**16 (65536)
/// node types in it, so that the ids fit into 16-bit typed array
/// slots.
class NodeSet {
    /// Create a set with the given types. The `id` property of each
    /// type should correspond to its position within the array.
    constructor(
    /// The node types in this set, by id.
    types) {
        this.types = types;
        for (let i = 0; i < types.length; i++)
            if (types[i].id != i)
                throw new RangeError("Node type ids should correspond to array positions when creating a node set");
    }
    /// Create a copy of this set with some node properties added. The
    /// arguments to this method should be created with
    /// [`NodeProp.add`](#tree.NodeProp.add).
    extend(...props) {
        let newTypes = [];
        for (let type of this.types) {
            let newProps = null;
            for (let source of props) {
                let add = source(type);
                if (add) {
                    if (!newProps)
                        newProps = Object.assign({}, type.props);
                    add[0].set(newProps, add[1]);
                }
            }
            newTypes.push(newProps ? new NodeType(type.name, newProps, type.id, type.flags) : type);
        }
        return new NodeSet(newTypes);
    }
}
/// A piece of syntax tree. There are two ways to approach these
/// trees: the way they are actually stored in memory, and the
/// convenient way.
///
/// Syntax trees are stored as a tree of `Tree` and `TreeBuffer`
/// objects. By packing detail information into `TreeBuffer` leaf
/// nodes, the representation is made a lot more memory-efficient.
///
/// However, when you want to actually work with tree nodes, this
/// representation is very awkward, so most client code will want to
/// use the `TreeCursor` interface instead, which provides a view on
/// some part of this data structure, and can be used to move around
/// to adjacent nodes.
class Tree {
    /// Construct a new tree. You usually want to go through
    /// [`Tree.build`](#tree.Tree^build) instead.
    constructor(type, 
    /// The tree's child nodes. Children small enough to fit in a
    /// `TreeBuffer will be represented as such, other children can be
    /// further `Tree` instances with their own internal structure.
    children, 
    /// The positions (offsets relative to the start of this tree) of
    /// the children.
    positions, 
    /// The total length of this tree
    length) {
        this.type = type;
        this.children = children;
        this.positions = positions;
        this.length = length;
    }
    /// @internal
    toString() {
        let children = this.children.map(c => c.toString()).join();
        return !this.type.name ? children :
            (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) +
                (children.length ? "(" + children + ")" : "");
    }
    /// Get a [tree cursor](#tree.TreeCursor) rooted at this tree. When
    /// `pos` is given, the cursor is [moved](#tree.TreeCursor.moveTo)
    /// to the given position and side.
    cursor(pos, side = 0) {
        let scope = (pos != null && CachedNode.get(this)) || this.topNode;
        let cursor = new TreeCursor(scope);
        if (pos != null) {
            cursor.moveTo(pos, side);
            CachedNode.set(this, cursor._tree);
        }
        return cursor;
    }
    /// Get a [tree cursor](#tree.TreeCursor) that, unlike regular
    /// cursors, doesn't skip [anonymous](#tree.NodeType.isAnonymous)
    /// nodes.
    fullCursor() {
        return new TreeCursor(this.topNode, true);
    }
    /// Get a [syntax node](#tree.SyntaxNode) object for the top of the
    /// tree.
    get topNode() {
        return new TreeNode(this, 0, 0, null);
    }
    /// Get the [syntax node](#tree.SyntaxNode) at the given position.
    /// If `side` is -1, this will move into nodes that end at the
    /// position. If 1, it'll move into nodes that start at the
    /// position. With 0, it'll only enter nodes that cover the position
    /// from both sides.
    resolve(pos, side = 0) {
        return this.cursor(pos, side).node;
    }
    /// Iterate over the tree and its children, calling `enter` for any
    /// node that touches the `from`/`to` region (if given) before
    /// running over such a node's children, and `leave` (if given) when
    /// leaving the node. When `enter` returns `false`, the given node
    /// will not have its children iterated over (or `leave` called).
    iterate(spec) {
        let { enter, leave, from = 0, to = this.length } = spec;
        for (let c = this.cursor();;) {
            let mustLeave = false;
            if (c.from <= to && c.to >= from && (c.type.isAnonymous || enter(c.type, c.from, c.to) !== false)) {
                if (c.firstChild())
                    continue;
                if (!c.type.isAnonymous)
                    mustLeave = true;
            }
            for (;;) {
                if (mustLeave && leave)
                    leave(c.type, c.from, c.to);
                mustLeave = c.type.isAnonymous;
                if (c.nextSibling())
                    break;
                if (!c.parent())
                    return;
                mustLeave = true;
            }
        }
    }
    /// Balance the direct children of this tree.
    balance(maxBufferLength = DefaultBufferLength) {
        return this.children.length <= BalanceBranchFactor ? this
            : balanceRange(this.type, NodeType.none, this.children, this.positions, 0, this.children.length, 0, maxBufferLength, this.length, 0);
    }
    /// Build a tree from a postfix-ordered buffer of node information,
    /// or a cursor over such a buffer.
    static build(data) { return buildTree(data); }
}
/// The empty tree
Tree.empty = new Tree(NodeType.none, [], [], 0);
// For trees that need a context hash attached, we're using this
// kludge which assigns an extra property directly after
// initialization (creating a single new object shape).
function withHash(tree, hash) {
    if (hash)
        tree.contextHash = hash;
    return tree;
}
/// Tree buffers contain (type, start, end, endIndex) quads for each
/// node. In such a buffer, nodes are stored in prefix order (parents
/// before children, with the endIndex of the parent indicating which
/// children belong to it)
class TreeBuffer {
    /// Create a tree buffer @internal
    constructor(
    /// @internal
    buffer, 
    // The total length of the group of nodes in the buffer.
    length, 
    /// @internal
    set, type = NodeType.none) {
        this.buffer = buffer;
        this.length = length;
        this.set = set;
        this.type = type;
    }
    /// @internal
    toString() {
        let result = [];
        for (let index = 0; index < this.buffer.length;) {
            result.push(this.childString(index));
            index = this.buffer[index + 3];
        }
        return result.join(",");
    }
    /// @internal
    childString(index) {
        let id = this.buffer[index], endIndex = this.buffer[index + 3];
        let type = this.set.types[id], result = type.name;
        if (/\W/.test(result) && !type.isError)
            result = JSON.stringify(result);
        index += 4;
        if (endIndex == index)
            return result;
        let children = [];
        while (index < endIndex) {
            children.push(this.childString(index));
            index = this.buffer[index + 3];
        }
        return result + "(" + children.join(",") + ")";
    }
    /// @internal
    findChild(startIndex, endIndex, dir, after) {
        let { buffer } = this, pick = -1;
        for (let i = startIndex; i != endIndex; i = buffer[i + 3]) {
            if (after != -100000000 /* None */) {
                let start = buffer[i + 1], end = buffer[i + 2];
                if (dir > 0) {
                    if (end > after)
                        pick = i;
                    if (end > after)
                        break;
                }
                else {
                    if (start < after)
                        pick = i;
                    if (end >= after)
                        break;
                }
            }
            else {
                pick = i;
                if (dir > 0)
                    break;
            }
        }
        return pick;
    }
}
class TreeNode {
    constructor(node, from, index, _parent) {
        this.node = node;
        this.from = from;
        this.index = index;
        this._parent = _parent;
    }
    get type() { return this.node.type; }
    get name() { return this.node.type.name; }
    get to() { return this.from + this.node.length; }
    nextChild(i, dir, after, full = false) {
        for (let parent = this;;) {
            for (let { children, positions } = parent.node, e = dir > 0 ? children.length : -1; i != e; i += dir) {
                let next = children[i], start = positions[i] + parent.from;
                if (after != -100000000 /* None */ && (dir < 0 ? start >= after : start + next.length <= after))
                    continue;
                if (next instanceof TreeBuffer) {
                    let index = next.findChild(0, next.buffer.length, dir, after == -100000000 /* None */ ? -100000000 /* None */ : after - start);
                    if (index > -1)
                        return new BufferNode(new BufferContext(parent, next, i, start), null, index);
                }
                else if (full || (!next.type.isAnonymous || hasChild(next))) {
                    let inner = new TreeNode(next, start, i, parent);
                    return full || !inner.type.isAnonymous ? inner : inner.nextChild(dir < 0 ? next.children.length - 1 : 0, dir, after);
                }
            }
            if (full || !parent.type.isAnonymous)
                return null;
            i = parent.index + dir;
            parent = parent._parent;
            if (!parent)
                return null;
        }
    }
    get firstChild() { return this.nextChild(0, 1, -100000000 /* None */); }
    get lastChild() { return this.nextChild(this.node.children.length - 1, -1, -100000000 /* None */); }
    childAfter(pos) { return this.nextChild(0, 1, pos); }
    childBefore(pos) { return this.nextChild(this.node.children.length - 1, -1, pos); }
    nextSignificantParent() {
        let val = this;
        while (val.type.isAnonymous && val._parent)
            val = val._parent;
        return val;
    }
    get parent() {
        return this._parent ? this._parent.nextSignificantParent() : null;
    }
    get nextSibling() {
        return this._parent ? this._parent.nextChild(this.index + 1, 1, -1) : null;
    }
    get prevSibling() {
        return this._parent ? this._parent.nextChild(this.index - 1, -1, -1) : null;
    }
    get cursor() { return new TreeCursor(this); }
    resolve(pos, side = 0) {
        return this.cursor.moveTo(pos, side).node;
    }
    getChild(type, before = null, after = null) {
        let r = getChildren(this, type, before, after);
        return r.length ? r[0] : null;
    }
    getChildren(type, before = null, after = null) {
        return getChildren(this, type, before, after);
    }
    /// @internal
    toString() { return this.node.toString(); }
}
function getChildren(node, type, before, after) {
    let cur = node.cursor, result = [];
    if (!cur.firstChild())
        return result;
    if (before != null)
        while (!cur.type.is(before))
            if (!cur.nextSibling())
                return result;
    for (;;) {
        if (after != null && cur.type.is(after))
            return result;
        if (cur.type.is(type))
            result.push(cur.node);
        if (!cur.nextSibling())
            return after == null ? result : [];
    }
}
class BufferContext {
    constructor(parent, buffer, index, start) {
        this.parent = parent;
        this.buffer = buffer;
        this.index = index;
        this.start = start;
    }
}
class BufferNode {
    constructor(context, _parent, index) {
        this.context = context;
        this._parent = _parent;
        this.index = index;
        this.type = context.buffer.set.types[context.buffer.buffer[index]];
    }
    get name() { return this.type.name; }
    get from() { return this.context.start + this.context.buffer.buffer[this.index + 1]; }
    get to() { return this.context.start + this.context.buffer.buffer[this.index + 2]; }
    child(dir, after) {
        let { buffer } = this.context;
        let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, after == -100000000 /* None */ ? -100000000 /* None */ : after - this.context.start);
        return index < 0 ? null : new BufferNode(this.context, this, index);
    }
    get firstChild() { return this.child(1, -100000000 /* None */); }
    get lastChild() { return this.child(-1, -100000000 /* None */); }
    childAfter(pos) { return this.child(1, pos); }
    childBefore(pos) { return this.child(-1, pos); }
    get parent() {
        return this._parent || this.context.parent.nextSignificantParent();
    }
    externalSibling(dir) {
        return this._parent ? null : this.context.parent.nextChild(this.context.index + dir, dir, -1);
    }
    get nextSibling() {
        let { buffer } = this.context;
        let after = buffer.buffer[this.index + 3];
        if (after < (this._parent ? buffer.buffer[this._parent.index + 3] : buffer.buffer.length))
            return new BufferNode(this.context, this._parent, after);
        return this.externalSibling(1);
    }
    get prevSibling() {
        let { buffer } = this.context;
        let parentStart = this._parent ? this._parent.index + 4 : 0;
        if (this.index == parentStart)
            return this.externalSibling(-1);
        return new BufferNode(this.context, this._parent, buffer.findChild(parentStart, this.index, -1, -100000000 /* None */));
    }
    get cursor() { return new TreeCursor(this); }
    resolve(pos, side = 0) {
        return this.cursor.moveTo(pos, side).node;
    }
    /// @internal
    toString() { return this.context.buffer.childString(this.index); }
    getChild(type, before = null, after = null) {
        let r = getChildren(this, type, before, after);
        return r.length ? r[0] : null;
    }
    getChildren(type, before = null, after = null) {
        return getChildren(this, type, before, after);
    }
}
/// A tree cursor object focuses on a given node in a syntax tree, and
/// allows you to move to adjacent nodes.
class TreeCursor {
    /// @internal
    constructor(node, full = false) {
        this.full = full;
        this.buffer = null;
        this.stack = [];
        this.index = 0;
        this.bufferNode = null;
        if (node instanceof TreeNode) {
            this.yieldNode(node);
        }
        else {
            this._tree = node.context.parent;
            this.buffer = node.context;
            for (let n = node._parent; n; n = n._parent)
                this.stack.unshift(n.index);
            this.bufferNode = node;
            this.yieldBuf(node.index);
        }
    }
    /// Shorthand for `.type.name`.
    get name() { return this.type.name; }
    yieldNode(node) {
        if (!node)
            return false;
        this._tree = node;
        this.type = node.type;
        this.from = node.from;
        this.to = node.to;
        return true;
    }
    yieldBuf(index, type) {
        this.index = index;
        let { start, buffer } = this.buffer;
        this.type = type || buffer.set.types[buffer.buffer[index]];
        this.from = start + buffer.buffer[index + 1];
        this.to = start + buffer.buffer[index + 2];
        return true;
    }
    yield(node) {
        if (!node)
            return false;
        if (node instanceof TreeNode) {
            this.buffer = null;
            return this.yieldNode(node);
        }
        this.buffer = node.context;
        return this.yieldBuf(node.index, node.type);
    }
    /// @internal
    toString() {
        return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
    }
    /// @internal
    enter(dir, after) {
        if (!this.buffer)
            return this.yield(this._tree.nextChild(dir < 0 ? this._tree.node.children.length - 1 : 0, dir, after, this.full));
        let { buffer } = this.buffer;
        let index = buffer.findChild(this.index + 4, buffer.buffer[this.index + 3], dir, after == -100000000 /* None */ ? -100000000 /* None */ : after - this.buffer.start);
        if (index < 0)
            return false;
        this.stack.push(this.index);
        return this.yieldBuf(index);
    }
    /// Move the cursor to this node's first child. When this returns
    /// false, the node has no child, and the cursor has not been moved.
    firstChild() { return this.enter(1, -100000000 /* None */); }
    /// Move the cursor to this node's last child.
    lastChild() { return this.enter(-1, -100000000 /* None */); }
    /// Move the cursor to the first child that starts at or after `pos`.
    childAfter(pos) { return this.enter(1, pos); }
    /// Move to the last child that ends at or before `pos`.
    childBefore(pos) { return this.enter(-1, pos); }
    /// Move the node's parent node, if this isn't the top node.
    parent() {
        if (!this.buffer)
            return this.yieldNode(this.full ? this._tree._parent : this._tree.parent);
        if (this.stack.length)
            return this.yieldBuf(this.stack.pop());
        let parent = this.full ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
        this.buffer = null;
        return this.yieldNode(parent);
    }
    /// @internal
    sibling(dir) {
        if (!this.buffer)
            return !this._tree._parent ? false
                : this.yield(this._tree._parent.nextChild(this._tree.index + dir, dir, -100000000 /* None */, this.full));
        let { buffer } = this.buffer, d = this.stack.length - 1;
        if (dir < 0) {
            let parentStart = d < 0 ? 0 : this.stack[d] + 4;
            if (this.index != parentStart)
                return this.yieldBuf(buffer.findChild(parentStart, this.index, -1, -100000000 /* None */));
        }
        else {
            let after = buffer.buffer[this.index + 3];
            if (after < (d < 0 ? buffer.buffer.length : buffer.buffer[this.stack[d] + 3]))
                return this.yieldBuf(after);
        }
        return d < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + dir, dir, -100000000 /* None */, this.full)) : false;
    }
    /// Move to this node's next sibling, if any.
    nextSibling() { return this.sibling(1); }
    /// Move to this node's previous sibling, if any.
    prevSibling() { return this.sibling(-1); }
    atLastNode(dir) {
        let index, parent, { buffer } = this;
        if (buffer) {
            if (dir > 0) {
                if (this.index < buffer.buffer.buffer.length)
                    return false;
            }
            else {
                for (let i = 0; i < this.index; i++)
                    if (buffer.buffer.buffer[i + 3] < this.index)
                        return false;
            }
            ({ index, parent } = buffer);
        }
        else {
            ({ index, _parent: parent } = this._tree);
        }
        for (; parent; { index, _parent: parent } = parent) {
            for (let i = index + dir, e = dir < 0 ? -1 : parent.node.children.length; i != e; i += dir) {
                let child = parent.node.children[i];
                if (this.full || !child.type.isAnonymous || child instanceof TreeBuffer || hasChild(child))
                    return false;
            }
        }
        return true;
    }
    move(dir) {
        if (this.enter(dir, -100000000 /* None */))
            return true;
        for (;;) {
            if (this.sibling(dir))
                return true;
            if (this.atLastNode(dir) || !this.parent())
                return false;
        }
    }
    /// Move to the next node in a
    /// [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order_(NLR))
    /// traversal, going from a node to its first child or, if the
    /// current node is empty, its next sibling or the next sibling of
    /// the first parent node that has one.
    next() { return this.move(1); }
    /// Move to the next node in a last-to-first pre-order traveral. A
    /// node is followed by ist last child or, if it has none, its
    /// previous sibling or the previous sibling of the first parent
    /// node that has one.
    prev() { return this.move(-1); }
    /// Move the cursor to the innermost node that covers `pos`. If
    /// `side` is -1, it will enter nodes that end at `pos`. If it is 1,
    /// it will enter nodes that start at `pos`.
    moveTo(pos, side = 0) {
        // Move up to a node that actually holds the position, if possible
        while (this.from == this.to ||
            (side < 1 ? this.from >= pos : this.from > pos) ||
            (side > -1 ? this.to <= pos : this.to < pos))
            if (!this.parent())
                break;
        // Then scan down into child nodes as far as possible
        for (;;) {
            if (side < 0 ? !this.childBefore(pos) : !this.childAfter(pos))
                break;
            if (this.from == this.to ||
                (side < 1 ? this.from >= pos : this.from > pos) ||
                (side > -1 ? this.to <= pos : this.to < pos)) {
                this.parent();
                break;
            }
        }
        return this;
    }
    /// Get a [syntax node](#tree.SyntaxNode) at the cursor's current
    /// position.
    get node() {
        if (!this.buffer)
            return this._tree;
        let cache = this.bufferNode, result = null, depth = 0;
        if (cache && cache.context == this.buffer) {
            scan: for (let index = this.index, d = this.stack.length; d >= 0;) {
                for (let c = cache; c; c = c._parent)
                    if (c.index == index) {
                        if (index == this.index)
                            return c;
                        result = c;
                        depth = d + 1;
                        break scan;
                    }
                index = this.stack[--d];
            }
        }
        for (let i = depth; i < this.stack.length; i++)
            result = new BufferNode(this.buffer, result, this.stack[i]);
        return this.bufferNode = new BufferNode(this.buffer, result, this.index);
    }
    /// Get the [tree](#tree.Tree) that represents the current node, if
    /// any. Will return null when the node is in a [tree
    /// buffer](#tree.TreeBuffer).
    get tree() {
        return this.buffer ? null : this._tree.node;
    }
}
function hasChild(tree) {
    return tree.children.some(ch => !ch.type.isAnonymous || ch instanceof TreeBuffer || hasChild(ch));
}
class FlatBufferCursor {
    constructor(buffer, index) {
        this.buffer = buffer;
        this.index = index;
    }
    get id() { return this.buffer[this.index - 4]; }
    get start() { return this.buffer[this.index - 3]; }
    get end() { return this.buffer[this.index - 2]; }
    get size() { return this.buffer[this.index - 1]; }
    get pos() { return this.index; }
    next() { this.index -= 4; }
    fork() { return new FlatBufferCursor(this.buffer, this.index); }
}
const BalanceBranchFactor = 8;
function buildTree(data) {
    var _a;
    let { buffer, nodeSet, topID = 0, maxBufferLength = DefaultBufferLength, reused = [], minRepeatType = nodeSet.types.length } = data;
    let cursor = Array.isArray(buffer) ? new FlatBufferCursor(buffer, buffer.length) : buffer;
    let types = nodeSet.types;
    let contextHash = 0;
    function takeNode(parentStart, minPos, children, positions, inRepeat) {
        let { id, start, end, size } = cursor;
        let startPos = start - parentStart;
        if (size < 0) {
            if (size == -1) { // Reused node
                children.push(reused[id]);
                positions.push(startPos);
            }
            else { // Context change
                contextHash = id;
            }
            cursor.next();
            return;
        }
        let type = types[id], node, buffer;
        if (end - start <= maxBufferLength && (buffer = findBufferSize(cursor.pos - minPos, inRepeat))) {
            // Small enough for a buffer, and no reused nodes inside
            let data = new Uint16Array(buffer.size - buffer.skip);
            let endPos = cursor.pos - buffer.size, index = data.length;
            while (cursor.pos > endPos)
                index = copyToBuffer(buffer.start, data, index, inRepeat);
            node = new TreeBuffer(data, end - buffer.start, nodeSet, inRepeat < 0 ? NodeType.none : types[inRepeat]);
            startPos = buffer.start - parentStart;
        }
        else { // Make it a node
            let endPos = cursor.pos - size;
            cursor.next();
            let localChildren = [], localPositions = [];
            let localInRepeat = id >= minRepeatType ? id : -1;
            while (cursor.pos > endPos) {
                if (cursor.id == localInRepeat)
                    cursor.next();
                else
                    takeNode(start, endPos, localChildren, localPositions, localInRepeat);
            }
            localChildren.reverse();
            localPositions.reverse();
            if (localInRepeat > -1 && localChildren.length > BalanceBranchFactor)
                node = balanceRange(type, type, localChildren, localPositions, 0, localChildren.length, 0, maxBufferLength, end - start, contextHash);
            else
                node = withHash(new Tree(type, localChildren, localPositions, end - start), contextHash);
        }
        children.push(node);
        positions.push(startPos);
    }
    function findBufferSize(maxSize, inRepeat) {
        // Scan through the buffer to find previous siblings that fit
        // together in a TreeBuffer, and don't contain any reused nodes
        // (which can't be stored in a buffer).
        // If `inRepeat` is > -1, ignore node boundaries of that type for
        // nesting, but make sure the end falls either at the start
        // (`maxSize`) or before such a node.
        let fork = cursor.fork();
        let size = 0, start = 0, skip = 0, minStart = fork.end - maxBufferLength;
        let result = { size: 0, start: 0, skip: 0 };
        scan: for (let minPos = fork.pos - maxSize; fork.pos > minPos;) {
            // Pretend nested repeat nodes of the same type don't exist
            if (fork.id == inRepeat) {
                // Except that we store the current state as a valid return
                // value.
                result.size = size;
                result.start = start;
                result.skip = skip;
                skip += 4;
                size += 4;
                fork.next();
                continue;
            }
            let nodeSize = fork.size, startPos = fork.pos - nodeSize;
            if (nodeSize < 0 || startPos < minPos || fork.start < minStart)
                break;
            let localSkipped = fork.id >= minRepeatType ? 4 : 0;
            let nodeStart = fork.start;
            fork.next();
            while (fork.pos > startPos) {
                if (fork.size < 0)
                    break scan;
                if (fork.id >= minRepeatType)
                    localSkipped += 4;
                fork.next();
            }
            start = nodeStart;
            size += nodeSize;
            skip += localSkipped;
        }
        if (inRepeat < 0 || size == maxSize) {
            result.size = size;
            result.start = start;
            result.skip = skip;
        }
        return result.size > 4 ? result : undefined;
    }
    function copyToBuffer(bufferStart, buffer, index, inRepeat) {
        let { id, start, end, size } = cursor;
        cursor.next();
        if (id == inRepeat)
            return index;
        let startIndex = index;
        if (size > 4) {
            let endPos = cursor.pos - (size - 4);
            while (cursor.pos > endPos)
                index = copyToBuffer(bufferStart, buffer, index, inRepeat);
        }
        if (id < minRepeatType) { // Don't copy repeat nodes into buffers
            buffer[--index] = startIndex;
            buffer[--index] = end - bufferStart;
            buffer[--index] = start - bufferStart;
            buffer[--index] = id;
        }
        return index;
    }
    let children = [], positions = [];
    while (cursor.pos > 0)
        takeNode(data.start || 0, 0, children, positions, -1);
    let length = (_a = data.length) !== null && _a !== void 0 ? _a : (children.length ? positions[0] + children[0].length : 0);
    return new Tree(types[topID], children.reverse(), positions.reverse(), length);
}
function balanceRange(outerType, innerType, children, positions, from, to, start, maxBufferLength, length, contextHash) {
    let localChildren = [], localPositions = [];
    if (length <= maxBufferLength) {
        for (let i = from; i < to; i++) {
            localChildren.push(children[i]);
            localPositions.push(positions[i] - start);
        }
    }
    else {
        let maxChild = Math.max(maxBufferLength, Math.ceil(length * 1.5 / BalanceBranchFactor));
        for (let i = from; i < to;) {
            let groupFrom = i, groupStart = positions[i];
            i++;
            for (; i < to; i++) {
                let nextEnd = positions[i] + children[i].length;
                if (nextEnd - groupStart > maxChild)
                    break;
            }
            if (i == groupFrom + 1) {
                let only = children[groupFrom];
                if (only instanceof Tree && only.type == innerType && only.length > maxChild << 1) { // Too big, collapse
                    for (let j = 0; j < only.children.length; j++) {
                        localChildren.push(only.children[j]);
                        localPositions.push(only.positions[j] + groupStart - start);
                    }
                    continue;
                }
                localChildren.push(only);
            }
            else if (i == groupFrom + 1) {
                localChildren.push(children[groupFrom]);
            }
            else {
                let inner = balanceRange(innerType, innerType, children, positions, groupFrom, i, groupStart, maxBufferLength, positions[i - 1] + children[i - 1].length - groupStart, contextHash);
                if (innerType != NodeType.none && !containsType(inner.children, innerType))
                    inner = withHash(new Tree(NodeType.none, inner.children, inner.positions, inner.length), contextHash);
                localChildren.push(inner);
            }
            localPositions.push(groupStart - start);
        }
    }
    return withHash(new Tree(outerType, localChildren, localPositions, length), contextHash);
}
function containsType(nodes, type) {
    for (let elt of nodes)
        if (elt.type == type)
            return true;
    return false;
}
/// Tree fragments are used during [incremental
/// parsing](#lezer.ParseOptions.fragments) to track parts of old
/// trees that can be reused in a new parse. An array of fragments is
/// used to track regions of an old tree whose nodes might be reused
/// in new parses. Use the static
/// [`applyChanges`](#tree.TreeFragment^applyChanges) method to update
/// fragments for document changes.
class TreeFragment {
    constructor(
    /// The start of the unchanged range pointed to by this fragment.
    /// This refers to an offset in the _updated_ document (as opposed
    /// to the original tree).
    from, 
    /// The end of the unchanged range.
    to, 
    /// The tree that this fragment is based on.
    tree, 
    /// The offset between the fragment's tree and the document that
    /// this fragment can be used against. Add this when going from
    /// document to tree positions, subtract it to go from tree to
    /// document positions.
    offset, open) {
        this.from = from;
        this.to = to;
        this.tree = tree;
        this.offset = offset;
        this.open = open;
    }
    get openStart() { return (this.open & 1 /* Start */) > 0; }
    get openEnd() { return (this.open & 2 /* End */) > 0; }
    /// Apply a set of edits to an array of fragments, removing or
    /// splitting fragments as necessary to remove edited ranges, and
    /// adjusting offsets for fragments that moved.
    static applyChanges(fragments, changes, minGap = 128) {
        if (!changes.length)
            return fragments;
        let result = [];
        let fI = 1, nextF = fragments.length ? fragments[0] : null;
        let cI = 0, pos = 0, off = 0;
        for (;;) {
            let nextC = cI < changes.length ? changes[cI++] : null;
            let nextPos = nextC ? nextC.fromA : 1e9;
            if (nextPos - pos >= minGap)
                while (nextF && nextF.from < nextPos) {
                    let cut = nextF;
                    if (pos >= cut.from || nextPos <= cut.to || off) {
                        let fFrom = Math.max(cut.from, pos) - off, fTo = Math.min(cut.to, nextPos) - off;
                        cut = fFrom >= fTo ? null :
                            new TreeFragment(fFrom, fTo, cut.tree, cut.offset + off, (cI > 0 ? 1 /* Start */ : 0) | (nextC ? 2 /* End */ : 0));
                    }
                    if (cut)
                        result.push(cut);
                    if (nextF.to > nextPos)
                        break;
                    nextF = fI < fragments.length ? fragments[fI++] : null;
                }
            if (!nextC)
                break;
            pos = nextC.toA;
            off = nextC.toA - nextC.toB;
        }
        return result;
    }
    /// Create a set of fragments from a freshly parsed tree, or update
    /// an existing set of fragments by replacing the ones that overlap
    /// with a tree with content from the new tree. When `partial` is
    /// true, the parse is treated as incomplete, and the token at its
    /// end is not included in [`safeTo`](#tree.TreeFragment.safeTo).
    static addTree(tree, fragments = [], partial = false) {
        let result = [new TreeFragment(0, tree.length, tree, 0, partial ? 2 /* End */ : 0)];
        for (let f of fragments)
            if (f.to > tree.length)
                result.push(f);
        return result;
    }
}
// Creates an `Input` that is backed by a single, flat string.
function stringInput(input) { return new StringInput(input); }
class StringInput {
    constructor(string, length = string.length) {
        this.string = string;
        this.length = length;
    }
    get(pos) {
        return pos < 0 || pos >= this.length ? -1 : this.string.charCodeAt(pos);
    }
    lineAfter(pos) {
        if (pos < 0)
            return "";
        let end = this.string.indexOf("\n", pos);
        return this.string.slice(pos, end < 0 ? this.length : Math.min(end, this.length));
    }
    read(from, to) { return this.string.slice(from, Math.min(this.length, to)); }
    clip(at) { return new StringInput(this.string, at); }
}

exports.DefaultBufferLength = DefaultBufferLength;
exports.NodeProp = NodeProp;
exports.NodeSet = NodeSet;
exports.NodeType = NodeType;
exports.Tree = Tree;
exports.TreeBuffer = TreeBuffer;
exports.TreeCursor = TreeCursor;
exports.TreeFragment = TreeFragment;
exports.stringInput = stringInput;
//# sourceMappingURL=tree.cjs.map


/***/ }),

/***/ "./node_modules/lezer/dist/index.cjs":
/*!*******************************************!*\
  !*** ./node_modules/lezer/dist/index.cjs ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({ value: true }));

var lezerTree = __webpack_require__(/*! lezer-tree */ "./node_modules/lezer-tree/dist/tree.cjs");

/// A parse stack. These are used internally by the parser to track
/// parsing progress. They also provide some properties and methods
/// that external code such as a tokenizer can use to get information
/// about the parse state.
class Stack {
    /// @internal
    constructor(
    /// A the parse that this stack is part of @internal
    p, 
    /// Holds state, pos, value stack pos (15 bits array index, 15 bits
    /// buffer index) triplets for all but the top state
    /// @internal
    stack, 
    /// The current parse state @internal
    state, 
    // The position at which the next reduce should take place. This
    // can be less than `this.pos` when skipped expressions have been
    // added to the stack (which should be moved outside of the next
    // reduction)
    /// @internal
    reducePos, 
    /// The input position up to which this stack has parsed.
    pos, 
    /// The dynamic score of the stack, including dynamic precedence
    /// and error-recovery penalties
    /// @internal
    score, 
    // The output buffer. Holds (type, start, end, size) quads
    // representing nodes created by the parser, where `size` is
    // amount of buffer array entries covered by this node.
    /// @internal
    buffer, 
    // The base offset of the buffer. When stacks are split, the split
    // instance shared the buffer history with its parent up to
    // `bufferBase`, which is the absolute offset (including the
    // offset of previous splits) into the buffer at which this stack
    // starts writing.
    /// @internal
    bufferBase, 
    /// @internal
    curContext, 
    // A parent stack from which this was split off, if any. This is
    // set up so that it always points to a stack that has some
    // additional buffer content, never to a stack with an equal
    // `bufferBase`.
    /// @internal
    parent) {
        this.p = p;
        this.stack = stack;
        this.state = state;
        this.reducePos = reducePos;
        this.pos = pos;
        this.score = score;
        this.buffer = buffer;
        this.bufferBase = bufferBase;
        this.curContext = curContext;
        this.parent = parent;
    }
    /// @internal
    toString() {
        return `[${this.stack.filter((_, i) => i % 3 == 0).concat(this.state)}]@${this.pos}${this.score ? "!" + this.score : ""}`;
    }
    // Start an empty stack
    /// @internal
    static start(p, state, pos = 0) {
        let cx = p.parser.context;
        return new Stack(p, [], state, pos, pos, 0, [], 0, cx ? new StackContext(cx, cx.start) : null, null);
    }
    /// The stack's current [context](#lezer.ContextTracker) value, if
    /// any. Its type will depend on the context tracker's type
    /// parameter, or it will be `null` if there is no context
    /// tracker.
    get context() { return this.curContext ? this.curContext.context : null; }
    // Push a state onto the stack, tracking its start position as well
    // as the buffer base at that point.
    /// @internal
    pushState(state, start) {
        this.stack.push(this.state, start, this.bufferBase + this.buffer.length);
        this.state = state;
    }
    // Apply a reduce action
    /// @internal
    reduce(action) {
        let depth = action >> 19 /* ReduceDepthShift */, type = action & 65535 /* ValueMask */;
        let { parser } = this.p;
        let dPrec = parser.dynamicPrecedence(type);
        if (dPrec)
            this.score += dPrec;
        if (depth == 0) {
            // Zero-depth reductions are a special case—they add stuff to
            // the stack without popping anything off.
            if (type < parser.minRepeatTerm)
                this.storeNode(type, this.reducePos, this.reducePos, 4, true);
            this.pushState(parser.getGoto(this.state, type, true), this.reducePos);
            this.reduceContext(type);
            return;
        }
        // Find the base index into `this.stack`, content after which will
        // be dropped. Note that with `StayFlag` reductions we need to
        // consume two extra frames (the dummy parent node for the skipped
        // expression and the state that we'll be staying in, which should
        // be moved to `this.state`).
        let base = this.stack.length - ((depth - 1) * 3) - (action & 262144 /* StayFlag */ ? 6 : 0);
        let start = this.stack[base - 2];
        let bufferBase = this.stack[base - 1], count = this.bufferBase + this.buffer.length - bufferBase;
        // Store normal terms or `R -> R R` repeat reductions
        if (type < parser.minRepeatTerm || (action & 131072 /* RepeatFlag */)) {
            let pos = parser.stateFlag(this.state, 1 /* Skipped */) ? this.pos : this.reducePos;
            this.storeNode(type, start, pos, count + 4, true);
        }
        if (action & 262144 /* StayFlag */) {
            this.state = this.stack[base];
        }
        else {
            let baseStateID = this.stack[base - 3];
            this.state = parser.getGoto(baseStateID, type, true);
        }
        while (this.stack.length > base)
            this.stack.pop();
        this.reduceContext(type);
    }
    // Shift a value into the buffer
    /// @internal
    storeNode(term, start, end, size = 4, isReduce = false) {
        if (term == 0 /* Err */) { // Try to omit/merge adjacent error nodes
            let cur = this, top = this.buffer.length;
            if (top == 0 && cur.parent) {
                top = cur.bufferBase - cur.parent.bufferBase;
                cur = cur.parent;
            }
            if (top > 0 && cur.buffer[top - 4] == 0 /* Err */ && cur.buffer[top - 1] > -1) {
                if (start == end)
                    return;
                if (cur.buffer[top - 2] >= start) {
                    cur.buffer[top - 2] = end;
                    return;
                }
            }
        }
        if (!isReduce || this.pos == end) { // Simple case, just append
            this.buffer.push(term, start, end, size);
        }
        else { // There may be skipped nodes that have to be moved forward
            let index = this.buffer.length;
            if (index > 0 && this.buffer[index - 4] != 0 /* Err */)
                while (index > 0 && this.buffer[index - 2] > end) {
                    // Move this record forward
                    this.buffer[index] = this.buffer[index - 4];
                    this.buffer[index + 1] = this.buffer[index - 3];
                    this.buffer[index + 2] = this.buffer[index - 2];
                    this.buffer[index + 3] = this.buffer[index - 1];
                    index -= 4;
                    if (size > 4)
                        size -= 4;
                }
            this.buffer[index] = term;
            this.buffer[index + 1] = start;
            this.buffer[index + 2] = end;
            this.buffer[index + 3] = size;
        }
    }
    // Apply a shift action
    /// @internal
    shift(action, next, nextEnd) {
        if (action & 131072 /* GotoFlag */) {
            this.pushState(action & 65535 /* ValueMask */, this.pos);
        }
        else if ((action & 262144 /* StayFlag */) == 0) { // Regular shift
            let start = this.pos, nextState = action, { parser } = this.p;
            if (nextEnd > this.pos || next <= parser.maxNode) {
                this.pos = nextEnd;
                if (!parser.stateFlag(nextState, 1 /* Skipped */))
                    this.reducePos = nextEnd;
            }
            this.pushState(nextState, start);
            if (next <= parser.maxNode)
                this.buffer.push(next, start, nextEnd, 4);
            this.shiftContext(next);
        }
        else { // Shift-and-stay, which means this is a skipped token
            if (next <= this.p.parser.maxNode)
                this.buffer.push(next, this.pos, nextEnd, 4);
            this.pos = nextEnd;
        }
    }
    // Apply an action
    /// @internal
    apply(action, next, nextEnd) {
        if (action & 65536 /* ReduceFlag */)
            this.reduce(action);
        else
            this.shift(action, next, nextEnd);
    }
    // Add a prebuilt node into the buffer. This may be a reused node or
    // the result of running a nested parser.
    /// @internal
    useNode(value, next) {
        let index = this.p.reused.length - 1;
        if (index < 0 || this.p.reused[index] != value) {
            this.p.reused.push(value);
            index++;
        }
        let start = this.pos;
        this.reducePos = this.pos = start + value.length;
        this.pushState(next, start);
        this.buffer.push(index, start, this.reducePos, -1 /* size < 0 means this is a reused value */);
        if (this.curContext)
            this.updateContext(this.curContext.tracker.reuse(this.curContext.context, value, this.p.input, this));
    }
    // Split the stack. Due to the buffer sharing and the fact
    // that `this.stack` tends to stay quite shallow, this isn't very
    // expensive.
    /// @internal
    split() {
        let parent = this;
        let off = parent.buffer.length;
        // Because the top of the buffer (after this.pos) may be mutated
        // to reorder reductions and skipped tokens, and shared buffers
        // should be immutable, this copies any outstanding skipped tokens
        // to the new buffer, and puts the base pointer before them.
        while (off > 0 && parent.buffer[off - 2] > parent.reducePos)
            off -= 4;
        let buffer = parent.buffer.slice(off), base = parent.bufferBase + off;
        // Make sure parent points to an actual parent with content, if there is such a parent.
        while (parent && base == parent.bufferBase)
            parent = parent.parent;
        return new Stack(this.p, this.stack.slice(), this.state, this.reducePos, this.pos, this.score, buffer, base, this.curContext, parent);
    }
    // Try to recover from an error by 'deleting' (ignoring) one token.
    /// @internal
    recoverByDelete(next, nextEnd) {
        let isNode = next <= this.p.parser.maxNode;
        if (isNode)
            this.storeNode(next, this.pos, nextEnd);
        this.storeNode(0 /* Err */, this.pos, nextEnd, isNode ? 8 : 4);
        this.pos = this.reducePos = nextEnd;
        this.score -= 200 /* Token */;
    }
    /// Check if the given term would be able to be shifted (optionally
    /// after some reductions) on this stack. This can be useful for
    /// external tokenizers that want to make sure they only provide a
    /// given token when it applies.
    canShift(term) {
        for (let sim = new SimulatedStack(this);;) {
            let action = this.p.parser.stateSlot(sim.top, 4 /* DefaultReduce */) || this.p.parser.hasAction(sim.top, term);
            if ((action & 65536 /* ReduceFlag */) == 0)
                return true;
            if (action == 0)
                return false;
            sim.reduce(action);
        }
    }
    /// Find the start position of the rule that is currently being parsed.
    get ruleStart() {
        for (let state = this.state, base = this.stack.length;;) {
            let force = this.p.parser.stateSlot(state, 5 /* ForcedReduce */);
            if (!(force & 65536 /* ReduceFlag */))
                return 0;
            base -= 3 * (force >> 19 /* ReduceDepthShift */);
            if ((force & 65535 /* ValueMask */) < this.p.parser.minRepeatTerm)
                return this.stack[base + 1];
            state = this.stack[base];
        }
    }
    /// Find the start position of an instance of any of the given term
    /// types, or return `null` when none of them are found.
    ///
    /// **Note:** this is only reliable when there is at least some
    /// state that unambiguously matches the given rule on the stack.
    /// I.e. if you have a grammar like this, where the difference
    /// between `a` and `b` is only apparent at the third token:
    ///
    ///     a { b | c }
    ///     b { "x" "y" "x" }
    ///     c { "x" "y" "z" }
    ///
    /// Then a parse state after `"x"` will not reliably tell you that
    /// `b` is on the stack. You _can_ pass `[b, c]` to reliably check
    /// for either of those two rules (assuming that `a` isn't part of
    /// some rule that includes other things starting with `"x"`).
    ///
    /// When `before` is given, this keeps scanning up the stack until
    /// it finds a match that starts before that position.
    ///
    /// Note that you have to be careful when using this in tokenizers,
    /// since it's relatively easy to introduce data dependencies that
    /// break incremental parsing by using this method.
    startOf(types, before) {
        let state = this.state, frame = this.stack.length, { parser } = this.p;
        for (;;) {
            let force = parser.stateSlot(state, 5 /* ForcedReduce */);
            let depth = force >> 19 /* ReduceDepthShift */, term = force & 65535 /* ValueMask */;
            if (types.indexOf(term) > -1) {
                let base = frame - (3 * (force >> 19 /* ReduceDepthShift */)), pos = this.stack[base + 1];
                if (before == null || before > pos)
                    return pos;
            }
            if (frame == 0)
                return null;
            if (depth == 0) {
                frame -= 3;
                state = this.stack[frame];
            }
            else {
                frame -= 3 * (depth - 1);
                state = parser.getGoto(this.stack[frame - 3], term, true);
            }
        }
    }
    // Apply up to Recover.MaxNext recovery actions that conceptually
    // inserts some missing token or rule.
    /// @internal
    recoverByInsert(next) {
        if (this.stack.length >= 300 /* MaxInsertStackDepth */)
            return [];
        let nextStates = this.p.parser.nextStates(this.state);
        if (nextStates.length > 4 /* MaxNext */ << 1 || this.stack.length >= 120 /* DampenInsertStackDepth */) {
            let best = [];
            for (let i = 0, s; i < nextStates.length; i += 2) {
                if ((s = nextStates[i + 1]) != this.state && this.p.parser.hasAction(s, next))
                    best.push(nextStates[i], s);
            }
            if (this.stack.length < 120 /* DampenInsertStackDepth */)
                for (let i = 0; best.length < 4 /* MaxNext */ << 1 && i < nextStates.length; i += 2) {
                    let s = nextStates[i + 1];
                    if (!best.some((v, i) => (i & 1) && v == s))
                        best.push(nextStates[i], s);
                }
            nextStates = best;
        }
        let result = [];
        for (let i = 0; i < nextStates.length && result.length < 4 /* MaxNext */; i += 2) {
            let s = nextStates[i + 1];
            if (s == this.state)
                continue;
            let stack = this.split();
            stack.storeNode(0 /* Err */, stack.pos, stack.pos, 4, true);
            stack.pushState(s, this.pos);
            stack.shiftContext(nextStates[i]);
            stack.score -= 200 /* Token */;
            result.push(stack);
        }
        return result;
    }
    // Force a reduce, if possible. Return false if that can't
    // be done.
    /// @internal
    forceReduce() {
        let reduce = this.p.parser.stateSlot(this.state, 5 /* ForcedReduce */);
        if ((reduce & 65536 /* ReduceFlag */) == 0)
            return false;
        if (!this.p.parser.validAction(this.state, reduce)) {
            this.storeNode(0 /* Err */, this.reducePos, this.reducePos, 4, true);
            this.score -= 100 /* Reduce */;
        }
        this.reduce(reduce);
        return true;
    }
    /// @internal
    forceAll() {
        while (!this.p.parser.stateFlag(this.state, 2 /* Accepting */) && this.forceReduce()) { }
        return this;
    }
    /// Check whether this state has no further actions (assumed to be a direct descendant of the
    /// top state, since any other states must be able to continue
    /// somehow). @internal
    get deadEnd() {
        if (this.stack.length != 3)
            return false;
        let { parser } = this.p;
        return parser.data[parser.stateSlot(this.state, 1 /* Actions */)] == 65535 /* End */ &&
            !parser.stateSlot(this.state, 4 /* DefaultReduce */);
    }
    /// Restart the stack (put it back in its start state). Only safe
    /// when this.stack.length == 3 (state is directly below the top
    /// state). @internal
    restart() {
        this.state = this.stack[0];
        this.stack.length = 0;
    }
    /// @internal
    sameState(other) {
        if (this.state != other.state || this.stack.length != other.stack.length)
            return false;
        for (let i = 0; i < this.stack.length; i += 3)
            if (this.stack[i] != other.stack[i])
                return false;
        return true;
    }
    /// Get the parser used by this stack.
    get parser() { return this.p.parser; }
    /// Test whether a given dialect (by numeric ID, as exported from
    /// the terms file) is enabled.
    dialectEnabled(dialectID) { return this.p.parser.dialect.flags[dialectID]; }
    shiftContext(term) {
        if (this.curContext)
            this.updateContext(this.curContext.tracker.shift(this.curContext.context, term, this.p.input, this));
    }
    reduceContext(term) {
        if (this.curContext)
            this.updateContext(this.curContext.tracker.reduce(this.curContext.context, term, this.p.input, this));
    }
    /// @internal
    emitContext() {
        let cx = this.curContext;
        if (!cx.tracker.strict)
            return;
        let last = this.buffer.length - 1;
        if (last < 0 || this.buffer[last] != -2)
            this.buffer.push(cx.hash, this.reducePos, this.reducePos, -2);
    }
    updateContext(context) {
        if (context != this.curContext.context) {
            let newCx = new StackContext(this.curContext.tracker, context);
            if (newCx.hash != this.curContext.hash)
                this.emitContext();
            this.curContext = newCx;
        }
    }
}
class StackContext {
    constructor(tracker, context) {
        this.tracker = tracker;
        this.context = context;
        this.hash = tracker.hash(context);
    }
}
var Recover;
(function (Recover) {
    Recover[Recover["Token"] = 200] = "Token";
    Recover[Recover["Reduce"] = 100] = "Reduce";
    Recover[Recover["MaxNext"] = 4] = "MaxNext";
    Recover[Recover["MaxInsertStackDepth"] = 300] = "MaxInsertStackDepth";
    Recover[Recover["DampenInsertStackDepth"] = 120] = "DampenInsertStackDepth";
})(Recover || (Recover = {}));
// Used to cheaply run some reductions to scan ahead without mutating
// an entire stack
class SimulatedStack {
    constructor(stack) {
        this.stack = stack;
        this.top = stack.state;
        this.rest = stack.stack;
        this.offset = this.rest.length;
    }
    reduce(action) {
        let term = action & 65535 /* ValueMask */, depth = action >> 19 /* ReduceDepthShift */;
        if (depth == 0) {
            if (this.rest == this.stack.stack)
                this.rest = this.rest.slice();
            this.rest.push(this.top, 0, 0);
            this.offset += 3;
        }
        else {
            this.offset -= (depth - 1) * 3;
        }
        let goto = this.stack.p.parser.getGoto(this.rest[this.offset - 3], term, true);
        this.top = goto;
    }
}
// This is given to `Tree.build` to build a buffer, and encapsulates
// the parent-stack-walking necessary to read the nodes.
class StackBufferCursor {
    constructor(stack, pos, index) {
        this.stack = stack;
        this.pos = pos;
        this.index = index;
        this.buffer = stack.buffer;
        if (this.index == 0)
            this.maybeNext();
    }
    static create(stack) {
        return new StackBufferCursor(stack, stack.bufferBase + stack.buffer.length, stack.buffer.length);
    }
    maybeNext() {
        let next = this.stack.parent;
        if (next != null) {
            this.index = this.stack.bufferBase - next.bufferBase;
            this.stack = next;
            this.buffer = next.buffer;
        }
    }
    get id() { return this.buffer[this.index - 4]; }
    get start() { return this.buffer[this.index - 3]; }
    get end() { return this.buffer[this.index - 2]; }
    get size() { return this.buffer[this.index - 1]; }
    next() {
        this.index -= 4;
        this.pos -= 4;
        if (this.index == 0)
            this.maybeNext();
    }
    fork() {
        return new StackBufferCursor(this.stack, this.pos, this.index);
    }
}

/// Tokenizers write the tokens they read into instances of this class.
class Token {
    constructor() {
        /// The start of the token. This is set by the parser, and should not
        /// be mutated by the tokenizer.
        this.start = -1;
        /// This starts at -1, and should be updated to a term id when a
        /// matching token is found.
        this.value = -1;
        /// When setting `.value`, you should also set `.end` to the end
        /// position of the token. (You'll usually want to use the `accept`
        /// method.)
        this.end = -1;
    }
    /// Accept a token, setting `value` and `end` to the given values.
    accept(value, end) {
        this.value = value;
        this.end = end;
    }
}
/// @internal
class TokenGroup {
    constructor(data, id) {
        this.data = data;
        this.id = id;
    }
    token(input, token, stack) { readToken(this.data, input, token, stack, this.id); }
}
TokenGroup.prototype.contextual = TokenGroup.prototype.fallback = TokenGroup.prototype.extend = false;
/// Exports that are used for `@external tokens` in the grammar should
/// export an instance of this class.
class ExternalTokenizer {
    /// Create a tokenizer. The first argument is the function that,
    /// given an input stream and a token object,
    /// [fills](#lezer.Token.accept) the token object if it recognizes a
    /// token. `token.start` should be used as the start position to
    /// scan from.
    constructor(
    /// @internal
    token, options = {}) {
        this.token = token;
        this.contextual = !!options.contextual;
        this.fallback = !!options.fallback;
        this.extend = !!options.extend;
    }
}
// Tokenizer data is stored a big uint16 array containing, for each
// state:
//
//  - A group bitmask, indicating what token groups are reachable from
//    this state, so that paths that can only lead to tokens not in
//    any of the current groups can be cut off early.
//
//  - The position of the end of the state's sequence of accepting
//    tokens
//
//  - The number of outgoing edges for the state
//
//  - The accepting tokens, as (token id, group mask) pairs
//
//  - The outgoing edges, as (start character, end character, state
//    index) triples, with end character being exclusive
//
// This function interprets that data, running through a stream as
// long as new states with the a matching group mask can be reached,
// and updating `token` when it matches a token.
function readToken(data, input, token, stack, group) {
    let state = 0, groupMask = 1 << group, dialect = stack.p.parser.dialect;
    scan: for (let pos = token.start;;) {
        if ((groupMask & data[state]) == 0)
            break;
        let accEnd = data[state + 1];
        // Check whether this state can lead to a token in the current group
        // Accept tokens in this state, possibly overwriting
        // lower-precedence / shorter tokens
        for (let i = state + 3; i < accEnd; i += 2)
            if ((data[i + 1] & groupMask) > 0) {
                let term = data[i];
                if (dialect.allows(term) &&
                    (token.value == -1 || token.value == term || stack.p.parser.overrides(term, token.value))) {
                    token.accept(term, pos);
                    break;
                }
            }
        let next = input.get(pos++);
        // Do a binary search on the state's edges
        for (let low = 0, high = data[state + 2]; low < high;) {
            let mid = (low + high) >> 1;
            let index = accEnd + mid + (mid << 1);
            let from = data[index], to = data[index + 1];
            if (next < from)
                high = mid;
            else if (next >= to)
                low = mid + 1;
            else {
                state = data[index + 2];
                continue scan;
            }
        }
        break;
    }
}

// See lezer-generator/src/encode.ts for comments about the encoding
// used here
function decodeArray(input, Type = Uint16Array) {
    if (typeof input != "string")
        return input;
    let array = null;
    for (let pos = 0, out = 0; pos < input.length;) {
        let value = 0;
        for (;;) {
            let next = input.charCodeAt(pos++), stop = false;
            if (next == 126 /* BigValCode */) {
                value = 65535 /* BigVal */;
                break;
            }
            if (next >= 92 /* Gap2 */)
                next--;
            if (next >= 34 /* Gap1 */)
                next--;
            let digit = next - 32 /* Start */;
            if (digit >= 46 /* Base */) {
                digit -= 46 /* Base */;
                stop = true;
            }
            value += digit;
            if (stop)
                break;
            value *= 46 /* Base */;
        }
        if (array)
            array[out++] = value;
        else
            array = new Type(value);
    }
    return array;
}

// FIXME find some way to reduce recovery work done when the input
// doesn't match the grammar at all.
// Environment variable used to control console output
const verbose = typeof process != "undefined" && /\bparse\b/.test(process.env.LOG);
let stackIDs = null;
function cutAt(tree, pos, side) {
    let cursor = tree.cursor(pos);
    for (;;) {
        if (!(side < 0 ? cursor.childBefore(pos) : cursor.childAfter(pos)))
            for (;;) {
                if ((side < 0 ? cursor.to < pos : cursor.from > pos) && !cursor.type.isError)
                    return side < 0 ? Math.max(0, Math.min(cursor.to - 1, pos - 5)) : Math.min(tree.length, Math.max(cursor.from + 1, pos + 5));
                if (side < 0 ? cursor.prevSibling() : cursor.nextSibling())
                    break;
                if (!cursor.parent())
                    return side < 0 ? 0 : tree.length;
            }
    }
}
class FragmentCursor {
    constructor(fragments) {
        this.fragments = fragments;
        this.i = 0;
        this.fragment = null;
        this.safeFrom = -1;
        this.safeTo = -1;
        this.trees = [];
        this.start = [];
        this.index = [];
        this.nextFragment();
    }
    nextFragment() {
        let fr = this.fragment = this.i == this.fragments.length ? null : this.fragments[this.i++];
        if (fr) {
            this.safeFrom = fr.openStart ? cutAt(fr.tree, fr.from + fr.offset, 1) - fr.offset : fr.from;
            this.safeTo = fr.openEnd ? cutAt(fr.tree, fr.to + fr.offset, -1) - fr.offset : fr.to;
            while (this.trees.length) {
                this.trees.pop();
                this.start.pop();
                this.index.pop();
            }
            this.trees.push(fr.tree);
            this.start.push(-fr.offset);
            this.index.push(0);
            this.nextStart = this.safeFrom;
        }
        else {
            this.nextStart = 1e9;
        }
    }
    // `pos` must be >= any previously given `pos` for this cursor
    nodeAt(pos) {
        if (pos < this.nextStart)
            return null;
        while (this.fragment && this.safeTo <= pos)
            this.nextFragment();
        if (!this.fragment)
            return null;
        for (;;) {
            let last = this.trees.length - 1;
            if (last < 0) { // End of tree
                this.nextFragment();
                return null;
            }
            let top = this.trees[last], index = this.index[last];
            if (index == top.children.length) {
                this.trees.pop();
                this.start.pop();
                this.index.pop();
                continue;
            }
            let next = top.children[index];
            let start = this.start[last] + top.positions[index];
            if (start > pos) {
                this.nextStart = start;
                return null;
            }
            else if (start == pos && start + next.length <= this.safeTo) {
                return start == pos && start >= this.safeFrom ? next : null;
            }
            if (next instanceof lezerTree.TreeBuffer) {
                this.index[last]++;
                this.nextStart = start + next.length;
            }
            else {
                this.index[last]++;
                if (start + next.length >= pos) { // Enter this node
                    this.trees.push(next);
                    this.start.push(start);
                    this.index.push(0);
                }
            }
        }
    }
}
class CachedToken extends Token {
    constructor() {
        super(...arguments);
        this.extended = -1;
        this.mask = 0;
        this.context = 0;
    }
    clear(start) {
        this.start = start;
        this.value = this.extended = -1;
    }
}
const dummyToken = new Token;
class TokenCache {
    constructor(parser) {
        this.tokens = [];
        this.mainToken = dummyToken;
        this.actions = [];
        this.tokens = parser.tokenizers.map(_ => new CachedToken);
    }
    getActions(stack, input) {
        let actionIndex = 0;
        let main = null;
        let { parser } = stack.p, { tokenizers } = parser;
        let mask = parser.stateSlot(stack.state, 3 /* TokenizerMask */);
        let context = stack.curContext ? stack.curContext.hash : 0;
        for (let i = 0; i < tokenizers.length; i++) {
            if (((1 << i) & mask) == 0)
                continue;
            let tokenizer = tokenizers[i], token = this.tokens[i];
            if (main && !tokenizer.fallback)
                continue;
            if (tokenizer.contextual || token.start != stack.pos || token.mask != mask || token.context != context) {
                this.updateCachedToken(token, tokenizer, stack, input);
                token.mask = mask;
                token.context = context;
            }
            if (token.value != 0 /* Err */) {
                let startIndex = actionIndex;
                if (token.extended > -1)
                    actionIndex = this.addActions(stack, token.extended, token.end, actionIndex);
                actionIndex = this.addActions(stack, token.value, token.end, actionIndex);
                if (!tokenizer.extend) {
                    main = token;
                    if (actionIndex > startIndex)
                        break;
                }
            }
        }
        while (this.actions.length > actionIndex)
            this.actions.pop();
        if (!main) {
            main = dummyToken;
            main.start = stack.pos;
            if (stack.pos == input.length)
                main.accept(stack.p.parser.eofTerm, stack.pos);
            else
                main.accept(0 /* Err */, stack.pos + 1);
        }
        this.mainToken = main;
        return this.actions;
    }
    updateCachedToken(token, tokenizer, stack, input) {
        token.clear(stack.pos);
        tokenizer.token(input, token, stack);
        if (token.value > -1) {
            let { parser } = stack.p;
            for (let i = 0; i < parser.specialized.length; i++)
                if (parser.specialized[i] == token.value) {
                    let result = parser.specializers[i](input.read(token.start, token.end), stack);
                    if (result >= 0 && stack.p.parser.dialect.allows(result >> 1)) {
                        if ((result & 1) == 0 /* Specialize */)
                            token.value = result >> 1;
                        else
                            token.extended = result >> 1;
                        break;
                    }
                }
        }
        else if (stack.pos == input.length) {
            token.accept(stack.p.parser.eofTerm, stack.pos);
        }
        else {
            token.accept(0 /* Err */, stack.pos + 1);
        }
    }
    putAction(action, token, end, index) {
        // Don't add duplicate actions
        for (let i = 0; i < index; i += 3)
            if (this.actions[i] == action)
                return index;
        this.actions[index++] = action;
        this.actions[index++] = token;
        this.actions[index++] = end;
        return index;
    }
    addActions(stack, token, end, index) {
        let { state } = stack, { parser } = stack.p, { data } = parser;
        for (let set = 0; set < 2; set++) {
            for (let i = parser.stateSlot(state, set ? 2 /* Skip */ : 1 /* Actions */);; i += 3) {
                if (data[i] == 65535 /* End */) {
                    if (data[i + 1] == 1 /* Next */) {
                        i = pair(data, i + 2);
                    }
                    else {
                        if (index == 0 && data[i + 1] == 2 /* Other */)
                            index = this.putAction(pair(data, i + 1), token, end, index);
                        break;
                    }
                }
                if (data[i] == token)
                    index = this.putAction(pair(data, i + 1), token, end, index);
            }
        }
        return index;
    }
}
var Rec;
(function (Rec) {
    Rec[Rec["Distance"] = 5] = "Distance";
    Rec[Rec["MaxRemainingPerStep"] = 3] = "MaxRemainingPerStep";
    Rec[Rec["MinBufferLengthPrune"] = 200] = "MinBufferLengthPrune";
    Rec[Rec["ForceReduceLimit"] = 10] = "ForceReduceLimit";
})(Rec || (Rec = {}));
/// A parse context can be used for step-by-step parsing. After
/// creating it, you repeatedly call `.advance()` until it returns a
/// tree to indicate it has reached the end of the parse.
class Parse {
    constructor(parser, input, startPos, context) {
        this.parser = parser;
        this.input = input;
        this.startPos = startPos;
        this.context = context;
        // The position to which the parse has advanced.
        this.pos = 0;
        this.recovering = 0;
        this.nextStackID = 0x2654;
        this.nested = null;
        this.nestEnd = 0;
        this.nestWrap = null;
        this.reused = [];
        this.tokens = new TokenCache(parser);
        this.topTerm = parser.top[1];
        this.stacks = [Stack.start(this, parser.top[0], this.startPos)];
        let fragments = context === null || context === void 0 ? void 0 : context.fragments;
        this.fragments = fragments && fragments.length ? new FragmentCursor(fragments) : null;
    }
    // Move the parser forward. This will process all parse stacks at
    // `this.pos` and try to advance them to a further position. If no
    // stack for such a position is found, it'll start error-recovery.
    //
    // When the parse is finished, this will return a syntax tree. When
    // not, it returns `null`.
    advance() {
        if (this.nested) {
            let result = this.nested.advance();
            this.pos = this.nested.pos;
            if (result) {
                this.finishNested(this.stacks[0], result);
                this.nested = null;
            }
            return null;
        }
        let stacks = this.stacks, pos = this.pos;
        // This will hold stacks beyond `pos`.
        let newStacks = this.stacks = [];
        let stopped, stoppedTokens;
        let maybeNest;
        // Keep advancing any stacks at `pos` until they either move
        // forward or can't be advanced. Gather stacks that can't be
        // advanced further in `stopped`.
        for (let i = 0; i < stacks.length; i++) {
            let stack = stacks[i], nest;
            for (;;) {
                if (stack.pos > pos) {
                    newStacks.push(stack);
                }
                else if (nest = this.checkNest(stack)) {
                    if (!maybeNest || maybeNest.stack.score < stack.score)
                        maybeNest = nest;
                }
                else if (this.advanceStack(stack, newStacks, stacks)) {
                    continue;
                }
                else {
                    if (!stopped) {
                        stopped = [];
                        stoppedTokens = [];
                    }
                    stopped.push(stack);
                    let tok = this.tokens.mainToken;
                    stoppedTokens.push(tok.value, tok.end);
                }
                break;
            }
        }
        if (maybeNest) {
            this.startNested(maybeNest);
            return null;
        }
        if (!newStacks.length) {
            let finished = stopped && findFinished(stopped);
            if (finished)
                return this.stackToTree(finished);
            if (this.parser.strict) {
                if (verbose && stopped)
                    console.log("Stuck with token " + this.parser.getName(this.tokens.mainToken.value));
                throw new SyntaxError("No parse at " + pos);
            }
            if (!this.recovering)
                this.recovering = 5 /* Distance */;
        }
        if (this.recovering && stopped) {
            let finished = this.runRecovery(stopped, stoppedTokens, newStacks);
            if (finished)
                return this.stackToTree(finished.forceAll());
        }
        if (this.recovering) {
            let maxRemaining = this.recovering == 1 ? 1 : this.recovering * 3 /* MaxRemainingPerStep */;
            if (newStacks.length > maxRemaining) {
                newStacks.sort((a, b) => b.score - a.score);
                while (newStacks.length > maxRemaining)
                    newStacks.pop();
            }
            if (newStacks.some(s => s.reducePos > pos))
                this.recovering--;
        }
        else if (newStacks.length > 1) {
            // Prune stacks that are in the same state, or that have been
            // running without splitting for a while, to avoid getting stuck
            // with multiple successful stacks running endlessly on.
            outer: for (let i = 0; i < newStacks.length - 1; i++) {
                let stack = newStacks[i];
                for (let j = i + 1; j < newStacks.length; j++) {
                    let other = newStacks[j];
                    if (stack.sameState(other) ||
                        stack.buffer.length > 200 /* MinBufferLengthPrune */ && other.buffer.length > 200 /* MinBufferLengthPrune */) {
                        if (((stack.score - other.score) || (stack.buffer.length - other.buffer.length)) > 0) {
                            newStacks.splice(j--, 1);
                        }
                        else {
                            newStacks.splice(i--, 1);
                            continue outer;
                        }
                    }
                }
            }
        }
        this.pos = newStacks[0].pos;
        for (let i = 1; i < newStacks.length; i++)
            if (newStacks[i].pos < this.pos)
                this.pos = newStacks[i].pos;
        return null;
    }
    // Returns an updated version of the given stack, or null if the
    // stack can't advance normally. When `split` and `stacks` are
    // given, stacks split off by ambiguous operations will be pushed to
    // `split`, or added to `stacks` if they move `pos` forward.
    advanceStack(stack, stacks, split) {
        let start = stack.pos, { input, parser } = this;
        let base = verbose ? this.stackID(stack) + " -> " : "";
        if (this.fragments) {
            let strictCx = stack.curContext && stack.curContext.tracker.strict, cxHash = strictCx ? stack.curContext.hash : 0;
            for (let cached = this.fragments.nodeAt(start); cached;) {
                let match = this.parser.nodeSet.types[cached.type.id] == cached.type ? parser.getGoto(stack.state, cached.type.id) : -1;
                if (match > -1 && cached.length && (!strictCx || (cached.contextHash || 0) == cxHash)) {
                    stack.useNode(cached, match);
                    if (verbose)
                        console.log(base + this.stackID(stack) + ` (via reuse of ${parser.getName(cached.type.id)})`);
                    return true;
                }
                if (!(cached instanceof lezerTree.Tree) || cached.children.length == 0 || cached.positions[0] > 0)
                    break;
                let inner = cached.children[0];
                if (inner instanceof lezerTree.Tree)
                    cached = inner;
                else
                    break;
            }
        }
        let defaultReduce = parser.stateSlot(stack.state, 4 /* DefaultReduce */);
        if (defaultReduce > 0) {
            stack.reduce(defaultReduce);
            if (verbose)
                console.log(base + this.stackID(stack) + ` (via always-reduce ${parser.getName(defaultReduce & 65535 /* ValueMask */)})`);
            return true;
        }
        let actions = this.tokens.getActions(stack, input);
        for (let i = 0; i < actions.length;) {
            let action = actions[i++], term = actions[i++], end = actions[i++];
            let last = i == actions.length || !split;
            let localStack = last ? stack : stack.split();
            localStack.apply(action, term, end);
            if (verbose)
                console.log(base + this.stackID(localStack) + ` (via ${(action & 65536 /* ReduceFlag */) == 0 ? "shift"
                    : `reduce of ${parser.getName(action & 65535 /* ValueMask */)}`} for ${parser.getName(term)} @ ${start}${localStack == stack ? "" : ", split"})`);
            if (last)
                return true;
            else if (localStack.pos > start)
                stacks.push(localStack);
            else
                split.push(localStack);
        }
        return false;
    }
    // Advance a given stack forward as far as it will go. Returns the
    // (possibly updated) stack if it got stuck, or null if it moved
    // forward and was given to `pushStackDedup`.
    advanceFully(stack, newStacks) {
        let pos = stack.pos;
        for (;;) {
            let nest = this.checkNest(stack);
            if (nest)
                return nest;
            if (!this.advanceStack(stack, null, null))
                return false;
            if (stack.pos > pos) {
                pushStackDedup(stack, newStacks);
                return true;
            }
        }
    }
    runRecovery(stacks, tokens, newStacks) {
        let finished = null, restarted = false;
        let maybeNest;
        for (let i = 0; i < stacks.length; i++) {
            let stack = stacks[i], token = tokens[i << 1], tokenEnd = tokens[(i << 1) + 1];
            let base = verbose ? this.stackID(stack) + " -> " : "";
            if (stack.deadEnd) {
                if (restarted)
                    continue;
                restarted = true;
                stack.restart();
                if (verbose)
                    console.log(base + this.stackID(stack) + " (restarted)");
                let done = this.advanceFully(stack, newStacks);
                if (done) {
                    if (done !== true)
                        maybeNest = done;
                    continue;
                }
            }
            let force = stack.split(), forceBase = base;
            for (let j = 0; force.forceReduce() && j < 10 /* ForceReduceLimit */; j++) {
                if (verbose)
                    console.log(forceBase + this.stackID(force) + " (via force-reduce)");
                let done = this.advanceFully(force, newStacks);
                if (done) {
                    if (done !== true)
                        maybeNest = done;
                    break;
                }
                if (verbose)
                    forceBase = this.stackID(force) + " -> ";
            }
            for (let insert of stack.recoverByInsert(token)) {
                if (verbose)
                    console.log(base + this.stackID(insert) + " (via recover-insert)");
                this.advanceFully(insert, newStacks);
            }
            if (this.input.length > stack.pos) {
                if (tokenEnd == stack.pos) {
                    tokenEnd++;
                    token = 0 /* Err */;
                }
                stack.recoverByDelete(token, tokenEnd);
                if (verbose)
                    console.log(base + this.stackID(stack) + ` (via recover-delete ${this.parser.getName(token)})`);
                pushStackDedup(stack, newStacks);
            }
            else if (!finished || finished.score < stack.score) {
                finished = stack;
            }
        }
        if (finished)
            return finished;
        if (maybeNest)
            for (let s of this.stacks)
                if (s.score > maybeNest.stack.score) {
                    maybeNest = undefined;
                    break;
                }
        if (maybeNest)
            this.startNested(maybeNest);
        return null;
    }
    forceFinish() {
        let stack = this.stacks[0].split();
        if (this.nested)
            this.finishNested(stack, this.nested.forceFinish());
        return this.stackToTree(stack.forceAll());
    }
    // Convert the stack's buffer to a syntax tree.
    stackToTree(stack, pos = stack.pos) {
        if (this.parser.context)
            stack.emitContext();
        return lezerTree.Tree.build({ buffer: StackBufferCursor.create(stack),
            nodeSet: this.parser.nodeSet,
            topID: this.topTerm,
            maxBufferLength: this.parser.bufferLength,
            reused: this.reused,
            start: this.startPos,
            length: pos - this.startPos,
            minRepeatType: this.parser.minRepeatTerm });
    }
    checkNest(stack) {
        let info = this.parser.findNested(stack.state);
        if (!info)
            return null;
        let spec = info.value;
        if (typeof spec == "function")
            spec = spec(this.input, stack);
        return spec ? { stack, info, spec } : null;
    }
    startNested(nest) {
        let { stack, info, spec } = nest;
        this.stacks = [stack];
        this.nestEnd = this.scanForNestEnd(stack, info.end, spec.filterEnd);
        this.nestWrap = typeof spec.wrapType == "number" ? this.parser.nodeSet.types[spec.wrapType] : spec.wrapType || null;
        if (spec.startParse) {
            this.nested = spec.startParse(this.input.clip(this.nestEnd), stack.pos, this.context);
        }
        else {
            this.finishNested(stack);
        }
    }
    scanForNestEnd(stack, endToken, filter) {
        for (let pos = stack.pos; pos < this.input.length; pos++) {
            dummyToken.start = pos;
            dummyToken.value = -1;
            endToken.token(this.input, dummyToken, stack);
            if (dummyToken.value > -1 && (!filter || filter(this.input.read(pos, dummyToken.end))))
                return pos;
        }
        return this.input.length;
    }
    finishNested(stack, tree) {
        if (this.nestWrap)
            tree = new lezerTree.Tree(this.nestWrap, tree ? [tree] : [], tree ? [0] : [], this.nestEnd - stack.pos);
        else if (!tree)
            tree = new lezerTree.Tree(lezerTree.NodeType.none, [], [], this.nestEnd - stack.pos);
        let info = this.parser.findNested(stack.state);
        stack.useNode(tree, this.parser.getGoto(stack.state, info.placeholder, true));
        if (verbose)
            console.log(this.stackID(stack) + ` (via unnest)`);
    }
    stackID(stack) {
        let id = (stackIDs || (stackIDs = new WeakMap)).get(stack);
        if (!id)
            stackIDs.set(stack, id = String.fromCodePoint(this.nextStackID++));
        return id + stack;
    }
}
function pushStackDedup(stack, newStacks) {
    for (let i = 0; i < newStacks.length; i++) {
        let other = newStacks[i];
        if (other.pos == stack.pos && other.sameState(stack)) {
            if (newStacks[i].score < stack.score)
                newStacks[i] = stack;
            return;
        }
    }
    newStacks.push(stack);
}
class Dialect {
    constructor(source, flags, disabled) {
        this.source = source;
        this.flags = flags;
        this.disabled = disabled;
    }
    allows(term) { return !this.disabled || this.disabled[term] == 0; }
}
const id = x => x;
/// Context trackers are used to track stateful context (such as
/// indentation in the Python grammar, or parent elements in the XML
/// grammar) needed by external tokenizers. You declare them in a
/// grammar file as `@context exportName from "module"`.
///
/// Context values should be immutable, and can be updated (replaced)
/// on shift or reduce actions.
class ContextTracker {
    /// The export used in a `@context` declaration should be of this
    /// type.
    constructor(spec) {
        this.start = spec.start;
        this.shift = spec.shift || id;
        this.reduce = spec.reduce || id;
        this.reuse = spec.reuse || id;
        this.hash = spec.hash;
        this.strict = spec.strict !== false;
    }
}
/// A parser holds the parse tables for a given grammar, as generated
/// by `lezer-generator`.
class Parser {
    /// @internal
    constructor(spec) {
        /// @internal
        this.bufferLength = lezerTree.DefaultBufferLength;
        /// @internal
        this.strict = false;
        this.cachedDialect = null;
        if (spec.version != 13 /* Version */)
            throw new RangeError(`Parser version (${spec.version}) doesn't match runtime version (${13 /* Version */})`);
        let tokenArray = decodeArray(spec.tokenData);
        let nodeNames = spec.nodeNames.split(" ");
        this.minRepeatTerm = nodeNames.length;
        this.context = spec.context;
        for (let i = 0; i < spec.repeatNodeCount; i++)
            nodeNames.push("");
        let nodeProps = [];
        for (let i = 0; i < nodeNames.length; i++)
            nodeProps.push([]);
        function setProp(nodeID, prop, value) {
            nodeProps[nodeID].push([prop, prop.deserialize(String(value))]);
        }
        if (spec.nodeProps)
            for (let propSpec of spec.nodeProps) {
                let prop = propSpec[0];
                for (let i = 1; i < propSpec.length;) {
                    let next = propSpec[i++];
                    if (next >= 0) {
                        setProp(next, prop, propSpec[i++]);
                    }
                    else {
                        let value = propSpec[i + -next];
                        for (let j = -next; j > 0; j--)
                            setProp(propSpec[i++], prop, value);
                        i++;
                    }
                }
            }
        this.specialized = new Uint16Array(spec.specialized ? spec.specialized.length : 0);
        this.specializers = [];
        if (spec.specialized)
            for (let i = 0; i < spec.specialized.length; i++) {
                this.specialized[i] = spec.specialized[i].term;
                this.specializers[i] = spec.specialized[i].get;
            }
        this.states = decodeArray(spec.states, Uint32Array);
        this.data = decodeArray(spec.stateData);
        this.goto = decodeArray(spec.goto);
        let topTerms = Object.keys(spec.topRules).map(r => spec.topRules[r][1]);
        this.nodeSet = new lezerTree.NodeSet(nodeNames.map((name, i) => lezerTree.NodeType.define({
            name: i >= this.minRepeatTerm ? undefined : name,
            id: i,
            props: nodeProps[i],
            top: topTerms.indexOf(i) > -1,
            error: i == 0,
            skipped: spec.skippedNodes && spec.skippedNodes.indexOf(i) > -1
        })));
        this.maxTerm = spec.maxTerm;
        this.tokenizers = spec.tokenizers.map(value => typeof value == "number" ? new TokenGroup(tokenArray, value) : value);
        this.topRules = spec.topRules;
        this.nested = (spec.nested || []).map(([name, value, endToken, placeholder]) => {
            return { name, value, end: new TokenGroup(decodeArray(endToken), 0), placeholder };
        });
        this.dialects = spec.dialects || {};
        this.dynamicPrecedences = spec.dynamicPrecedences || null;
        this.tokenPrecTable = spec.tokenPrec;
        this.termNames = spec.termNames || null;
        this.maxNode = this.nodeSet.types.length - 1;
        this.dialect = this.parseDialect();
        this.top = this.topRules[Object.keys(this.topRules)[0]];
    }
    /// Parse a given string or stream.
    parse(input, startPos = 0, context = {}) {
        if (typeof input == "string")
            input = lezerTree.stringInput(input);
        let cx = new Parse(this, input, startPos, context);
        for (;;) {
            let done = cx.advance();
            if (done)
                return done;
        }
    }
    /// Start an incremental parse.
    startParse(input, startPos = 0, context = {}) {
        if (typeof input == "string")
            input = lezerTree.stringInput(input);
        return new Parse(this, input, startPos, context);
    }
    /// Get a goto table entry @internal
    getGoto(state, term, loose = false) {
        let table = this.goto;
        if (term >= table[0])
            return -1;
        for (let pos = table[term + 1];;) {
            let groupTag = table[pos++], last = groupTag & 1;
            let target = table[pos++];
            if (last && loose)
                return target;
            for (let end = pos + (groupTag >> 1); pos < end; pos++)
                if (table[pos] == state)
                    return target;
            if (last)
                return -1;
        }
    }
    /// Check if this state has an action for a given terminal @internal
    hasAction(state, terminal) {
        let data = this.data;
        for (let set = 0; set < 2; set++) {
            for (let i = this.stateSlot(state, set ? 2 /* Skip */ : 1 /* Actions */), next;; i += 3) {
                if ((next = data[i]) == 65535 /* End */) {
                    if (data[i + 1] == 1 /* Next */)
                        next = data[i = pair(data, i + 2)];
                    else if (data[i + 1] == 2 /* Other */)
                        return pair(data, i + 2);
                    else
                        break;
                }
                if (next == terminal || next == 0 /* Err */)
                    return pair(data, i + 1);
            }
        }
        return 0;
    }
    /// @internal
    stateSlot(state, slot) {
        return this.states[(state * 6 /* Size */) + slot];
    }
    /// @internal
    stateFlag(state, flag) {
        return (this.stateSlot(state, 0 /* Flags */) & flag) > 0;
    }
    /// @internal
    findNested(state) {
        let flags = this.stateSlot(state, 0 /* Flags */);
        return flags & 4 /* StartNest */ ? this.nested[flags >> 10 /* NestShift */] : null;
    }
    /// @internal
    validAction(state, action) {
        if (action == this.stateSlot(state, 4 /* DefaultReduce */))
            return true;
        for (let i = this.stateSlot(state, 1 /* Actions */);; i += 3) {
            if (this.data[i] == 65535 /* End */) {
                if (this.data[i + 1] == 1 /* Next */)
                    i = pair(this.data, i + 2);
                else
                    return false;
            }
            if (action == pair(this.data, i + 1))
                return true;
        }
    }
    /// Get the states that can follow this one through shift actions or
    /// goto jumps. @internal
    nextStates(state) {
        let result = [];
        for (let i = this.stateSlot(state, 1 /* Actions */);; i += 3) {
            if (this.data[i] == 65535 /* End */) {
                if (this.data[i + 1] == 1 /* Next */)
                    i = pair(this.data, i + 2);
                else
                    break;
            }
            if ((this.data[i + 2] & (65536 /* ReduceFlag */ >> 16)) == 0) {
                let value = this.data[i + 1];
                if (!result.some((v, i) => (i & 1) && v == value))
                    result.push(this.data[i], value);
            }
        }
        return result;
    }
    /// @internal
    overrides(token, prev) {
        let iPrev = findOffset(this.data, this.tokenPrecTable, prev);
        return iPrev < 0 || findOffset(this.data, this.tokenPrecTable, token) < iPrev;
    }
    /// Configure the parser. Returns a new parser instance that has the
    /// given settings modified. Settings not provided in `config` are
    /// kept from the original parser.
    configure(config) {
        // Hideous reflection-based kludge to make it easy to create a
        // slightly modified copy of a parser.
        let copy = Object.assign(Object.create(Parser.prototype), this);
        if (config.props)
            copy.nodeSet = this.nodeSet.extend(...config.props);
        if (config.top) {
            let info = this.topRules[config.top];
            if (!info)
                throw new RangeError(`Invalid top rule name ${config.top}`);
            copy.top = info;
        }
        if (config.tokenizers)
            copy.tokenizers = this.tokenizers.map(t => {
                let found = config.tokenizers.find(r => r.from == t);
                return found ? found.to : t;
            });
        if (config.dialect)
            copy.dialect = this.parseDialect(config.dialect);
        if (config.nested)
            copy.nested = this.nested.map(obj => {
                if (!Object.prototype.hasOwnProperty.call(config.nested, obj.name))
                    return obj;
                return { name: obj.name, value: config.nested[obj.name], end: obj.end, placeholder: obj.placeholder };
            });
        if (config.strict != null)
            copy.strict = config.strict;
        if (config.bufferLength != null)
            copy.bufferLength = config.bufferLength;
        return copy;
    }
    /// Returns the name associated with a given term. This will only
    /// work for all terms when the parser was generated with the
    /// `--names` option. By default, only the names of tagged terms are
    /// stored.
    getName(term) {
        return this.termNames ? this.termNames[term] : String(term <= this.maxNode && this.nodeSet.types[term].name || term);
    }
    /// The eof term id is always allocated directly after the node
    /// types. @internal
    get eofTerm() { return this.maxNode + 1; }
    /// Tells you whether this grammar has any nested grammars.
    get hasNested() { return this.nested.length > 0; }
    /// The type of top node produced by the parser.
    get topNode() { return this.nodeSet.types[this.top[1]]; }
    /// @internal
    dynamicPrecedence(term) {
        let prec = this.dynamicPrecedences;
        return prec == null ? 0 : prec[term] || 0;
    }
    /// @internal
    parseDialect(dialect) {
        if (this.cachedDialect && this.cachedDialect.source == dialect)
            return this.cachedDialect;
        let values = Object.keys(this.dialects), flags = values.map(() => false);
        if (dialect)
            for (let part of dialect.split(" ")) {
                let id = values.indexOf(part);
                if (id >= 0)
                    flags[id] = true;
            }
        let disabled = null;
        for (let i = 0; i < values.length; i++)
            if (!flags[i]) {
                for (let j = this.dialects[values[i]], id; (id = this.data[j++]) != 65535 /* End */;)
                    (disabled || (disabled = new Uint8Array(this.maxTerm + 1)))[id] = 1;
            }
        return this.cachedDialect = new Dialect(dialect, flags, disabled);
    }
    /// (used by the output of the parser generator) @internal
    static deserialize(spec) {
        return new Parser(spec);
    }
}
function pair(data, off) { return data[off] | (data[off + 1] << 16); }
function findOffset(data, start, term) {
    for (let i = start, next; (next = data[i]) != 65535 /* End */; i++)
        if (next == term)
            return i - start;
    return -1;
}
function findFinished(stacks) {
    let best = null;
    for (let stack of stacks) {
        if (stack.pos == stack.p.input.length &&
            stack.p.parser.stateFlag(stack.state, 2 /* Accepting */) &&
            (!best || best.score < stack.score))
            best = stack;
    }
    return best;
}

exports.NodeProp = lezerTree.NodeProp;
exports.NodeSet = lezerTree.NodeSet;
exports.NodeType = lezerTree.NodeType;
exports.Tree = lezerTree.Tree;
exports.TreeCursor = lezerTree.TreeCursor;
exports.ContextTracker = ContextTracker;
exports.ExternalTokenizer = ExternalTokenizer;
exports.Parser = Parser;
exports.Stack = Stack;
exports.Token = Token;
//# sourceMappingURL=index.cjs.map


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./webstart.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVkscUNBQXFDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsSUFBSSxLQUFLLElBQUksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLFlBQVksa0NBQWtDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsWUFBWSxrQ0FBa0MsUUFBUSxTQUFTLG9CQUFvQixhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsb0JBQW9CLGFBQWEsYUFBYSxhQUFhLFlBQVksa0NBQWtDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxhQUFhLFlBQVksc0NBQXNDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxhQUFhLFlBQVksa0NBQWtDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsWUFBWSxxQ0FBcUMsUUFBUSxTQUFTLGFBQWEsYUFBYSxhQUFhLFlBQVkscUNBQXFDLFFBQVEsU0FBUyxhQUFhLGFBQWEsWUFBWSxFQUFFLG9DQUFvQyxRQUFRLFNBQVMsYUFBYSxhQUFhLFlBQVksRUFBRSxHQUFHLCtCQUErQixRQUFRLFNBQVMsMkJBQTJCLGFBQWEsYUFBYSxZQUFZLHFDQUFxQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsWUFBWSxFQUFFLG9DQUFvQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsWUFBWSxFQUFFLGtDQUFrQyxRQUFRLFNBQVMsb0JBQW9CLGFBQWEsYUFBYSxZQUFZLHFDQUFxQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsWUFBWSxFQUFFLHFDQUFxQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsWUFBWSwwQ0FBMEMsUUFBUSxTQUFT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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsMkNBQTJDO0FBQ3pELG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwyQkFBMkI7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsU0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBLDJEQUEyRCx5Q0FBeUM7QUFDcEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0EsOEJBQThCLHFDQUFxQztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQjtBQUNoQixlQUFlO0FBQ2YsZ0JBQWdCO0FBQ2hCLFlBQVk7QUFDWixrQkFBa0I7QUFDbEIsc0JBQXNCO0FBQ3RCLHlCQUF5QjtBQUN6QixjQUFjO0FBQ2QsYUFBYTtBQUNiLGFBQWE7QUFDYjs7Ozs7OztVQ3YrQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYi1hc20taml0Ly4vY29tcGlsZXIudHMiLCJ3ZWJwYWNrOi8vd2ViLWFzbS1qaXQvLi9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vd2ViLWFzbS1qaXQvLi90Yy50cyIsIndlYnBhY2s6Ly93ZWItYXNtLWppdC8uL3dlYnN0YXJ0LnRzIiwid2VicGFjazovL3dlYi1hc20taml0L2V4dGVybmFsIHZhciBcIndhYnRcIiIsIndlYnBhY2s6Ly93ZWItYXNtLWppdC8uL25vZGVfbW9kdWxlcy9sZXplci1weXRob24vZGlzdC9pbmRleC5janMiLCJ3ZWJwYWNrOi8vd2ViLWFzbS1qaXQvLi9ub2RlX21vZHVsZXMvbGV6ZXItdHJlZS9kaXN0L3RyZWUuY2pzIiwid2VicGFjazovL3dlYi1hc20taml0Ly4vbm9kZV9tb2R1bGVzL2xlemVyL2Rpc3QvaW5kZXguY2pzIiwid2VicGFjazovL3dlYi1hc20taml0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYi1hc20taml0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vd2ViLWFzbS1qaXQvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3dlYi1hc20taml0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvbXBpbGUgPSBleHBvcnRzLmNvZGVHZW5TdG10ID0gZXhwb3J0cy5jb2RlR2VuRXhwciA9IGV4cG9ydHMucnVuID0gdm9pZCAwO1xudmFyIHdhYnRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwid2FidFwiKSk7XG52YXIgcGFyc2VyXzEgPSByZXF1aXJlKFwiLi9wYXJzZXJcIik7XG52YXIgdGNfMSA9IHJlcXVpcmUoXCIuL3RjXCIpO1xuZnVuY3Rpb24gcnVuKHdhdFNvdXJjZSwgaW1wb3J0X29iamVjdCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdhYnRBcGksIHBhcnNlZCwgYmluYXJ5LCB3YXNtTW9kdWxlO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCAoMCwgd2FidF8xLmRlZmF1bHQpKCldO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgd2FidEFwaSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkID0gd2FidEFwaS5wYXJzZVdhdChcImV4YW1wbGVcIiwgd2F0U291cmNlKTtcbiAgICAgICAgICAgICAgICAgICAgYmluYXJ5ID0gcGFyc2VkLnRvQmluYXJ5KHt9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGUoYmluYXJ5LmJ1ZmZlciwgaW1wb3J0X29iamVjdCldO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgd2FzbU1vZHVsZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBuZXh0IGxpbmUgaXMgd2FzbS1pbnRlcnBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi8sIHdhc21Nb2R1bGUuaW5zdGFuY2UuZXhwb3J0cy5fc3RhcnQoKV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZXhwb3J0cy5ydW4gPSBydW47XG53aW5kb3dbXCJydW5XYXRcIl0gPSBydW47XG5mdW5jdGlvbiB2YXJpYWJsZU5hbWVzKHN0bXRzKSB7XG4gICAgdmFyIHZhcnMgPSBbXTtcbiAgICBzdG10cy5mb3JFYWNoKGZ1bmN0aW9uIChzdG10KSB7XG4gICAgICAgIGlmIChzdG10LnRhZyA9PT0gXCJhc3NpZ25cIikge1xuICAgICAgICAgICAgdmFycy5wdXNoKHN0bXQubmFtZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFycztcbn1cbmZ1bmN0aW9uIGNvZGVHZW5FeHByKGV4cHIsIGxvY2Fscykge1xuICAgIHZhciBvcENvZGUgPSBuZXcgTWFwKCk7XG4gICAgb3BDb2RlLnNldChcIitcIiwgXCIoaTMyLmFkZClcIik7XG4gICAgb3BDb2RlLnNldChcIi1cIiwgXCIoaTMyLnN1YilcIik7XG4gICAgb3BDb2RlLnNldChcIipcIiwgXCIoaTMyLm11bClcIik7XG4gICAgb3BDb2RlLnNldChcIiVcIiwgXCIoaTMyLnJlbV9zKVwiKTtcbiAgICBvcENvZGUuc2V0KFwiPD1cIiwgXCIoaTMyLmxlX3MpXCIpO1xuICAgIG9wQ29kZS5zZXQoXCI+PVwiLCBcIihpMzIuZ2VfcylcIik7XG4gICAgb3BDb2RlLnNldChcIjxcIiwgXCIoaTMyLmx0X3MpXCIpO1xuICAgIG9wQ29kZS5zZXQoXCI+XCIsIFwiKGkzMi5ndF9zKVwiKTtcbiAgICBvcENvZGUuc2V0KFwibm90XCIsIFwiKGkzMi5ub3QpXCIpO1xuICAgIG9wQ29kZS5zZXQoXCI9PVwiLCBcIihpMzIuZXEpXCIpO1xuICAgIG9wQ29kZS5zZXQoXCIhPVwiLCBcIihpMzIubmUpXCIpO1xuICAgIG9wQ29kZS5zZXQoXCJpc1wiLCBcIihpMzIuZXEpXCIpO1xuICAgIG9wQ29kZS5zZXQoXCJub3RcIiwgXCIoaTMyLnhub3IpXCIpO1xuICAgIHN3aXRjaCAoZXhwci50YWcpIHtcbiAgICAgICAgY2FzZSBcIm5hbWVcIjpcbiAgICAgICAgICAgIGlmIChsb2NhbHMuaGFzKGV4cHIubmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1wiKGxvY2FsLmdldCAkXCIuY29uY2F0KGV4cHIubmFtZSwgXCIpXCIpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXCIoZ2xvYmFsLmdldCAkXCIuY29uY2F0KGV4cHIubmFtZSwgXCIpXCIpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgY2FzZSBcImxpdGVyYWxcIjpcbiAgICAgICAgICAgIGlmIChleHByLnZhbHVlLnR5cCA9PSBcImludFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcIihpMzIuY29uc3QgXCIuY29uY2F0KGV4cHIudmFsdWUudmFsdWUsIFwiKVwiKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChleHByLnZhbHVlLnR5cCA9PSBcImJvb2xcIikge1xuICAgICAgICAgICAgICAgIGlmIChleHByLnZhbHVlLnZhbHVlID09IFwiVHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXCIoaTMyLmNvbnN0IDEpXCJdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcIihpMzIuY29uc3QgMClcIl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcIihpMzIuY29uc3QgMClcIl07XG4gICAgICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJjYWxsXCI6XG4gICAgICAgICAgICB2YXIgdmFsU3RtdHMgPSBleHByLmFyZ3MubWFwKGZ1bmN0aW9uIChlKSB7IHJldHVybiBjb2RlR2VuRXhwcihlLCBsb2NhbHMpOyB9KS5mbGF0KCk7XG4gICAgICAgICAgICB2YXIgdG9DYWxsID0gZXhwci5uYW1lO1xuICAgICAgICAgICAgaWYgKGV4cHIubmFtZSA9PT0gXCJwcmludFwiKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChleHByLmFyZ3NbMF0uYSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYm9vbFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdG9DYWxsID0gXCJwcmludF9ib29sXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImludFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdG9DYWxsID0gXCJwcmludF9udW1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibm9uZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdG9DYWxsID0gXCJwcmludF9ub25lXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWxTdG10cy5wdXNoKFwiKGNhbGwgJFwiLmNvbmNhdCh0b0NhbGwsIFwiKVwiKSk7XG4gICAgICAgICAgICByZXR1cm4gdmFsU3RtdHM7XG4gICAgICAgIGNhc2UgXCJ1bmlvcFwiOlxuICAgICAgICAgICAgdmFyIG9wcyA9IG9wQ29kZS5nZXQoZXhwci5vcCk7XG4gICAgICAgICAgICB2YXIgc3RtdHMgPSBjb2RlR2VuRXhwcihleHByLmV4cHIsIGxvY2Fscyk7XG4gICAgICAgICAgICBpZiAoZXhwci5vcCA9PSBcIm5vdFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0bXRzLmNvbmNhdChcIihjYWxsICRub3Rfb3BlcmF0b3IpXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtcIihpMzIuY29uc3QgMClcIl0uY29uY2F0KHN0bXRzLCBvcHMpO1xuICAgICAgICBjYXNlIFwiYmlub3BcIjpcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gY29kZUdlbkV4cHIoZXhwci5sZWZ0LCBsb2NhbHMpO1xuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gY29kZUdlbkV4cHIoZXhwci5yaWdodCwgbG9jYWxzKTtcbiAgICAgICAgICAgIHZhciBvcHMgPSBvcENvZGUuZ2V0KGV4cHIub3ApO1xuICAgICAgICAgICAgcmV0dXJuIGxlZnQuY29uY2F0KHJpZ2h0LCBvcHMpO1xuICAgIH1cbn1cbmV4cG9ydHMuY29kZUdlbkV4cHIgPSBjb2RlR2VuRXhwcjtcbmZ1bmN0aW9uIGNvZGVHZW5TdG10KHN0bXQsIGxvY2Fscykge1xuICAgIHN3aXRjaCAoc3RtdC50YWcpIHtcbiAgICAgICAgY2FzZSBcImFzc2lnblwiOlxuICAgICAgICAgICAgdmFyIHZhbFN0bXRzID0gY29kZUdlbkV4cHIoc3RtdC52YWx1ZSwgbG9jYWxzKTtcbiAgICAgICAgICAgIGlmIChsb2NhbHMuaGFzKHN0bXQubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YWxTdG10cy5wdXNoKFwiKGxvY2FsLnNldCAkXCIuY29uY2F0KHN0bXQubmFtZSwgXCIpXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbFN0bXRzLnB1c2goXCIoZ2xvYmFsLnNldCAkXCIuY29uY2F0KHN0bXQubmFtZSwgXCIpXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXS5jb25jYXQodmFsU3RtdHMpO1xuICAgICAgICBjYXNlIFwiZXhwclwiOlxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNvZGVHZW5FeHByKHN0bXQuZXhwciwgbG9jYWxzKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKFwiKGxvY2FsLnNldCAkc2NyYXRjaClcIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICBjYXNlIFwiaWZcIjpcbiAgICAgICAgICAgIHZhciBpZmNvbmQgPSBjb2RlR2VuRXhwcihzdG10LmlmY29uZCwgbG9jYWxzKS5mbGF0KCkuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgIHZhciBpZl9ib2R5ID0gW107XG4gICAgICAgICAgICBzdG10LmlmYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN0ID0gY29kZUdlblN0bXQoYiwgbG9jYWxzKTtcbiAgICAgICAgICAgICAgICBpZl9ib2R5ID0gaWZfYm9keS5jb25jYXQoc3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgaWZib2R5ID0gaWZfYm9keS5mbGF0KCkuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgIHZhciBlbGlmRXhpc3RzID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgZWxzZUV4aXN0cyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHN0bXQuZWxpZmNvbmQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsaWZjb25kID0gY29kZUdlbkV4cHIoc3RtdC5lbGlmY29uZCwgbG9jYWxzKS5mbGF0KCkuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZWxpZl9ib2R5ID0gW107XG4gICAgICAgICAgICAgICAgc3RtdC5lbGlmYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsaWZfYm9keSA9IGVsaWZfYm9keS5jb25jYXQoY29kZUdlblN0bXQoYiwgbG9jYWxzKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGVsaWZib2R5ID0gZWxpZl9ib2R5LmZsYXQoKS5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIGVsaWZFeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0bXQuZWxzZWJvZHkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHZhciBlbHNlX2JvZHkgPSBbXTtcbiAgICAgICAgICAgICAgICBzdG10LmVsc2Vib2R5LmZvckVhY2goZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ID0gY29kZUdlblN0bXQoYiwgbG9jYWxzKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZV9ib2R5ID0gZWxzZV9ib2R5LmNvbmNhdChzdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGVsc2Vib2R5ID0gZWxzZV9ib2R5LmZsYXQoKS5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIGVsc2VFeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVsaWZFeGlzdHMgJiYgZWxzZUV4aXN0cykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXCJcIi5jb25jYXQoaWZjb25kLCBcIiAoIGlmICBcXG4gICAgICAgICAgKHRoZW5cXG4gICAgICAgICAgICBcIikuY29uY2F0KGlmYm9keSwgXCJcXG4gICAgICAgICAgKVxcbiAgICAgICAgICAoZWxzZVxcbiAgICAgICAgICAgIFxcbiAgICAgICAgICAgIFwiKS5jb25jYXQoZWxpZmNvbmQsIFwiICggaWZcXG4gICAgICAgICAgICAgICh0aGVuXFxuICAgICAgICAgICAgICAgIFwiKS5jb25jYXQoZWxpZmJvZHksIFwiXFxuICAgICAgICAgICAgICApXFxuICAgICAgICAgICAgICAoZWxzZVxcbiAgICAgICAgICAgICAgICBcIikuY29uY2F0KGVsc2Vib2R5LCBcIiBcXG4gICAgICAgICAgICAgIClcXG4gICAgICAgICAgICApXFxuICAgICAgICAgIClcXG4gICAgICAgIClcIildO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZWxpZkV4aXN0cykge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXCJcIi5jb25jYXQoaWZjb25kLCBcIiAoIGlmICBcXG4gICAgICAgICAgKHRoZW5cXG4gICAgICAgICAgICBcIikuY29uY2F0KGlmYm9keSwgXCJcXG4gICAgICAgICAgKVxcbiAgICAgICAgICAoZWxzZVxcbiAgICAgICAgICAgIFxcbiAgICAgICAgICAgIFwiKS5jb25jYXQoZWxzZWJvZHksIFwiIFxcbiAgICAgICAgICApXFxuICAgICAgICApXCIpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXCJcIi5jb25jYXQoaWZjb25kLCBcIiAoIGlmICBcXG4gICAgICAgICh0aGVuXFxuICAgICAgICAgIFwiKS5jb25jYXQoaWZib2R5LCBcIlxcbiAgICAgICAgKSlcIildO1xuICAgICAgICAgICAgfVxuICAgICAgICBjYXNlIFwid2hpbGVcIjpcbiAgICAgICAgICAgIHZhciBjb25kID0gY29kZUdlbkV4cHIoc3RtdC5jb25kLCBsb2NhbHMpO1xuICAgICAgICAgICAgdmFyIGNvbmRpdGlvbiA9IGNvbmQuZmxhdCgpLmpvaW4oXCJcXG5cIik7XG4gICAgICAgICAgICB2YXIgYm9keSA9IFtdO1xuICAgICAgICAgICAgc3RtdC5ib2R5LmZvckVhY2goZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3QgPSBjb2RlR2VuU3RtdChiLCBsb2NhbHMpO1xuICAgICAgICAgICAgICAgIGJvZHkgPSBib2R5LmNvbmNhdChzdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB3aGlsZWJvZHkgPSBib2R5LmZsYXQoKS5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIFtcIlxcbiAgICAgICAgICAobG9vcFxcbiAgICAgICAgICAgIFxcbiAgICAgICAgICAgIFwiLmNvbmNhdCh3aGlsZWJvZHksIFwiXFxuICAgICAgICAgICAgKGJyX2lmIDAgXCIpLmNvbmNhdChjb25kaXRpb24sIFwiKVxcbiAgICAgICAgICAgIClcIildO1xuICAgICAgICBjYXNlIFwiZGVmaW5lXCI6XG4gICAgICAgICAgICB2YXIgd2l0aFBhcmFtc0FuZFZhcmlhYmxlc18xID0gbmV3IE1hcChsb2NhbHMuZW50cmllcygpKTtcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZXMgPSB2YXJpYWJsZU5hbWVzKHN0bXQuYm9keSk7XG4gICAgICAgICAgICB2YXJpYWJsZXMuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gd2l0aFBhcmFtc0FuZFZhcmlhYmxlc18xLnNldCh2LCB0cnVlKTsgfSk7XG4gICAgICAgICAgICBzdG10LnBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAocCkgeyByZXR1cm4gd2l0aFBhcmFtc0FuZFZhcmlhYmxlc18xLnNldChwLm5hbWUsIHRydWUpOyB9KTtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBzdG10LnBhcmFtZXRlcnMubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBcIihwYXJhbSAkXCIuY29uY2F0KHAubmFtZSwgXCIgaTMyKVwiKTsgfSkuam9pbihcIiBcIik7XG4gICAgICAgICAgICB2YXIgbG9jYWxEZWNscyA9IHZhcmlhYmxlcy5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFwiKGxvY2FsICRcIi5jb25jYXQodiwgXCIgaTMyKVwiKTsgfSkuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgIHZhciBzdG10cyA9IHN0bXQuYm9keS5tYXAoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIGNvZGVHZW5TdG10KHMsIHdpdGhQYXJhbXNBbmRWYXJpYWJsZXNfMSk7IH0pLmZsYXQoKTtcbiAgICAgICAgICAgIHZhciBzdG10c0JvZHkgPSBzdG10cy5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIFtcIihmdW5jICRcIi5jb25jYXQoc3RtdC5uYW1lLCBcIiBcIikuY29uY2F0KHBhcmFtcywgXCIgKHJlc3VsdCBpMzIpXFxuICAgICAgKGxvY2FsICRzY3JhdGNoIGkzMilcXG4gICAgICBcIikuY29uY2F0KGxvY2FsRGVjbHMsIFwiXFxuICAgICAgXCIpLmNvbmNhdChzdG10c0JvZHksIFwiXFxuICAgICAgKGkzMi5jb25zdCAwKSlcIildO1xuICAgICAgICBjYXNlIFwicmV0dXJuXCI6XG4gICAgICAgICAgICB2YXIgdmFsU3RtdHMgPSBjb2RlR2VuRXhwcihzdG10LnZhbHVlLCBsb2NhbHMpO1xuICAgICAgICAgICAgdmFsU3RtdHMucHVzaChcInJldHVyblwiKTtcbiAgICAgICAgICAgIHJldHVybiB2YWxTdG10cztcbiAgICB9XG59XG5leHBvcnRzLmNvZGVHZW5TdG10ID0gY29kZUdlblN0bXQ7XG5mdW5jdGlvbiBjb21waWxlKHNvdXJjZSkge1xuICAgIHZhciBhc3QgPSAoMCwgcGFyc2VyXzEucGFyc2VQcm9ncmFtKShzb3VyY2UpO1xuICAgICgwLCB0Y18xLnRjUHJvZ3JhbSkoYXN0KTtcbiAgICB2YXIgZW52ID0gbmV3IE1hcCgpO1xuICAgIHZhciB2YXJzID0gW107XG4gICAgYXN0LmZvckVhY2goZnVuY3Rpb24gKHN0bXQpIHtcbiAgICAgICAgaWYgKHN0bXQudGFnID09PSBcImFzc2lnblwiKSB7XG4gICAgICAgICAgICB2YXJzLnB1c2goc3RtdC5uYW1lKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBmdW5jcyA9IFtdO1xuICAgIGFzdC5mb3JFYWNoKGZ1bmN0aW9uIChzdG10KSB7XG4gICAgICAgIGlmIChzdG10LnRhZyA9PT0gXCJkZWZpbmVcIikge1xuICAgICAgICAgICAgZnVuY3MucHVzaChjb2RlR2VuU3RtdChzdG10LCBlbnYpLmpvaW4oXCJcXG5cIikpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGFsbEZ1bnMgPSBmdW5jcy5qb2luKFwiXFxuXFxuXCIpO1xuICAgIHZhciBzdG10cyA9IGFzdC5maWx0ZXIoZnVuY3Rpb24gKHN0bXQpIHsgcmV0dXJuIHN0bXQudGFnICE9PSBcImRlZmluZVwiOyB9KTtcbiAgICB2YXIgdW5pcVZhcnMgPSB2YXJzLmZpbHRlcihmdW5jdGlvbiAoZSwgaSkgeyByZXR1cm4gdmFycy5pbmRleE9mKGUpID09IGk7IH0pO1xuICAgIHZhciBnbG9iRGVjbHMgPSB1bmlxVmFycy5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFwiKGdsb2JhbCAkXCIuY29uY2F0KHYsIFwiIChtdXQgaTMyKSAoaTMyLmNvbnN0IDApKVwiKTsgfSkuam9pbihcIlxcblwiKTtcbiAgICB2YXIgYWxsU3RtdHMgPSBzdG10cy5tYXAoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIGNvZGVHZW5TdG10KHMsIGVudik7IH0pLmZsYXQoKTtcbiAgICB2YXIgbWFpbiA9IF9fc3ByZWFkQXJyYXkoW1wiKGxvY2FsICRzY3JhdGNoIGkzMilcIl0sIGFsbFN0bXRzLCB0cnVlKS5qb2luKFwiXFxuXCIpO1xuICAgIHZhciBsYXN0U3RtdCA9IGFzdFthc3QubGVuZ3RoIC0gMV07XG4gICAgdmFyIGlzRXhwciA9IGxhc3RTdG10LnRhZyA9PT0gXCJleHByXCI7XG4gICAgdmFyIHJldFR5cGUgPSBcIlwiO1xuICAgIHZhciByZXRWYWwgPSBcIlwiO1xuICAgIGlmIChpc0V4cHIpIHtcbiAgICAgICAgcmV0VHlwZSA9IFwiKHJlc3VsdCBpMzIpXCI7XG4gICAgICAgIHJldFZhbCA9IFwiKGxvY2FsLmdldCAkc2NyYXRjaClcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwiXFxuICAgIChtb2R1bGVcXG4gICAgICAoZnVuYyAkcHJpbnRfbnVtIChpbXBvcnQgXFxcImltcG9ydHNcXFwiIFxcXCJwcmludF9udW1cXFwiKSAocGFyYW0gaTMyKSAocmVzdWx0IGkzMikpXFxuICAgICAgKGZ1bmMgJHByaW50X2Jvb2wgKGltcG9ydCBcXFwiaW1wb3J0c1xcXCIgXFxcInByaW50X2Jvb2xcXFwiKSAocGFyYW0gaTMyKSAocmVzdWx0IGkzMikpXFxuICAgICAgKGZ1bmMgJHByaW50X25vbmUgKGltcG9ydCBcXFwiaW1wb3J0c1xcXCIgXFxcInByaW50X25vbmVcXFwiKSAocGFyYW0gaTMyKSAocmVzdWx0IGkzMikpXFxuICAgICAgKGZ1bmMgJG5vdF9vcGVyYXRvciAoaW1wb3J0IFxcXCJpbXBvcnRzXFxcIiBcXFwibm90X29wZXJhdG9yXFxcIikgKHBhcmFtIGkzMikgKHJlc3VsdCBpMzIpKVxcbiAgICAgIFwiLmNvbmNhdChnbG9iRGVjbHMsIFwiXFxuICAgICAgXCIpLmNvbmNhdChhbGxGdW5zLCBcIlxcbiAgICAgIChmdW5jIChleHBvcnQgXFxcIl9zdGFydFxcXCIpIFwiKS5jb25jYXQocmV0VHlwZSwgXCJcXG4gICAgICAgIFwiKS5jb25jYXQobWFpbiwgXCJcXG4gICAgICAgIFwiKS5jb25jYXQocmV0VmFsLCBcIlxcbiAgICAgIClcXG4gICAgKSBcXG4gIFwiKTtcbn1cbmV4cG9ydHMuY29tcGlsZSA9IGNvbXBpbGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudHJhdmVyc2VBcmd1bWVudHMgPSBleHBvcnRzLnRyYXZlcnNlRXhwciA9IGV4cG9ydHMudHJhdmVyc2VQYXJhbWV0ZXJzID0gZXhwb3J0cy50cmF2ZXJzZVR5cGUgPSBleHBvcnRzLnRyYXZlcnNlU3RtdCA9IGV4cG9ydHMudHJhdmVyc2VTdG10cyA9IGV4cG9ydHMucGFyc2VQcm9ncmFtID0gdm9pZCAwO1xudmFyIGxlemVyX3B5dGhvbl8xID0gcmVxdWlyZShcImxlemVyLXB5dGhvblwiKTtcbnZhciBiaW5vcHMgPSBbXCIrXCIsIFwiLVwiLCBcIipcIiwgXCIvL1wiLCBcIiVcIiwgXCI9PVwiLCBcIiE9XCIsIFwiPD1cIiwgXCI+PVwiLCBcIjxcIiwgXCI+XCIsIFwiaXNcIl07XG52YXIgdW5pb3BzID0gW1wiK1wiLCBcIi1cIiwgXCJub3RcIl07XG5mdW5jdGlvbiBwYXJzZVByb2dyYW0oc291cmNlKSB7XG4gICAgdmFyIHQgPSBsZXplcl9weXRob25fMS5wYXJzZXIucGFyc2Uoc291cmNlKS5jdXJzb3IoKTtcbiAgICByZXR1cm4gdHJhdmVyc2VTdG10cyhzb3VyY2UsIHQpO1xufVxuZXhwb3J0cy5wYXJzZVByb2dyYW0gPSBwYXJzZVByb2dyYW07XG5mdW5jdGlvbiB0cmF2ZXJzZVN0bXRzKHMsIHQpIHtcbiAgICAvLyBUaGUgdG9wIG5vZGUgaW4gdGhlIHByb2dyYW0gaXMgYSBTY3JpcHQgbm9kZSB3aXRoIGEgbGlzdCBvZiBjaGlsZHJlblxuICAgIC8vIHRoYXQgYXJlIHZhcmlvdXMgc3RhdGVtZW50c1xuICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgIHZhciBzdG10cyA9IFtdO1xuICAgIGRvIHtcbiAgICAgICAgc3RtdHMucHVzaCh0cmF2ZXJzZVN0bXQocywgdCkpO1xuICAgIH0gd2hpbGUgKHQubmV4dFNpYmxpbmcoKSk7IC8vIHQubmV4dFNpYmxpbmcoKSByZXR1cm5zIGZhbHNlIHdoZW4gaXQgcmVhY2hlc1xuICAgIC8vICB0aGUgZW5kIG9mIHRoZSBsaXN0IG9mIGNoaWxkcmVuXG4gICAgcmV0dXJuIHN0bXRzO1xufVxuZXhwb3J0cy50cmF2ZXJzZVN0bXRzID0gdHJhdmVyc2VTdG10cztcbi8qXG4gIEludmFyaWFudCDigJMgdCBtdXN0IGZvY3VzIG9uIHRoZSBzYW1lIG5vZGUgYXQgdGhlIGVuZCBvZiB0aGUgdHJhdmVyc2FsXG4qL1xuZnVuY3Rpb24gdHJhdmVyc2VTdG10KHMsIHQpIHtcbiAgICBzd2l0Y2ggKHQudHlwZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgXCJSZXR1cm5TdGF0ZW1lbnRcIjpcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBGb2N1cyByZXR1cm4ga2V5d29yZFxuICAgICAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBGb2N1cyBleHByZXNzaW9uXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0cmF2ZXJzZUV4cHIocywgdCk7XG4gICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgcmV0dXJuIHsgdGFnOiBcInJldHVyblwiLCB2YWx1ZTogdmFsdWUgfTtcbiAgICAgICAgY2FzZSBcIkFzc2lnblN0YXRlbWVudFwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7IC8vIGZvY3VzZWQgb24gbmFtZSAodGhlIGZpcnN0IGNoaWxkKVxuICAgICAgICAgICAgdmFyIG5hbWUgPSBzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pO1xuICAgICAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBmb2N1c2VkIG9uID0gc2lnbi4gTWF5IG5lZWQgdGhpcyBmb3IgY29tcGxleCB0YXNrcywgbGlrZSArPSFcbiAgICAgICAgICAgIHZhciB0eXBlID0gXCJub25lXCI7XG4gICAgICAgICAgICBpZiAocy5zdWJzdHJpbmcodC5mcm9tLCB0LnRvKSAhPSBcIj1cIikge1xuICAgICAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgICAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgICAgICB0eXBlID0gcy5zdWJzdHJpbmcodC5mcm9tLCB0LnRvKTtcbiAgICAgICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gZm9jdXNlZCBvbiB0aGUgdmFsdWUgZXhwcmVzc2lvblxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdHJhdmVyc2VFeHByKHMsIHQpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHR5cGUsIHRhZzogXCJhc3NpZ25cIiwgbmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlIH07XG4gICAgICAgIGNhc2UgXCJFeHByZXNzaW9uU3RhdGVtZW50XCI6XG4gICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgIHZhciBleHByID0gdHJhdmVyc2VFeHByKHMsIHQpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiB7IHRhZzogXCJleHByXCIsIGV4cHI6IGV4cHIgfTtcbiAgICAgICAgY2FzZSBcIklmU3RhdGVtZW50XCI6XG4gICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIHZhciBpZmNvbmQgPSB0cmF2ZXJzZUV4cHIocywgdCk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgIHZhciBpZmJvZHkgPSBbXTtcbiAgICAgICAgICAgIHdoaWxlICh0Lm5leHRTaWJsaW5nKCkpIHtcbiAgICAgICAgICAgICAgICBpZmJvZHkucHVzaCh0cmF2ZXJzZVN0bXQocywgdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIHZhciBlbGlmYm9keSA9IFtdO1xuICAgICAgICAgICAgdmFyIGVsaWZjb25kO1xuICAgICAgICAgICAgaWYgKHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50bykgPT0gXCJlbGlmXCIpIHtcbiAgICAgICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICAgICAgZWxpZmNvbmQgPSB0cmF2ZXJzZUV4cHIocywgdCk7XG4gICAgICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0Lm5leHRTaWJsaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxpZmJvZHkucHVzaCh0cmF2ZXJzZVN0bXQocywgdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVsaWZib2R5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZWxzZWJvZHkgPSBbXTtcbiAgICAgICAgICAgIGlmIChzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pID09IFwiZWxzZVwiKSB7XG4gICAgICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAodC5uZXh0U2libGluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Vib2R5LnB1c2godHJhdmVyc2VTdG10KHMsIHQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQucGFyZW50KCk7XG4gICAgICAgICAgICByZXR1cm4geyB0YWc6IFwiaWZcIiwgaWZjb25kOiBpZmNvbmQsIGlmYm9keTogaWZib2R5LCBlbGlmY29uZDogZWxpZmNvbmQsIGVsaWZib2R5OiBlbGlmYm9keSwgZWxzZWJvZHk6IGVsc2Vib2R5IH07XG4gICAgICAgIGNhc2UgXCJXaGlsZVN0YXRlbWVudFwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB2YXIgY29uZCA9IHRyYXZlcnNlRXhwcihzLCB0KTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgICAgICAgICAgdmFyIHdoaWxlYm9keSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKHQubmV4dFNpYmxpbmcoKSkge1xuICAgICAgICAgICAgICAgIHdoaWxlYm9keS5wdXNoKHRyYXZlcnNlU3RtdChzLCB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiB7IHRhZzogXCJ3aGlsZVwiLCBjb25kOiBjb25kLCBib2R5OiB3aGlsZWJvZHkgfTtcbiAgICAgICAgY2FzZSBcIkZ1bmN0aW9uRGVmaW5pdGlvblwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7IC8vIEZvY3VzIG9uIGRlZlxuICAgICAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBGb2N1cyBvbiBuYW1lIG9mIGZ1bmN0aW9uXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50byk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7IC8vIEZvY3VzIG9uIFBhcmFtTGlzdFxuICAgICAgICAgICAgdmFyIHBhcmFtZXRlcnMgPSB0cmF2ZXJzZVBhcmFtZXRlcnMocywgdCk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7IC8vIEZvY3VzIG9uIEJvZHkgb3IgVHlwZURlZlxuICAgICAgICAgICAgdmFyIHJldCA9IFwibm9uZVwiO1xuICAgICAgICAgICAgdmFyIG1heWJlVEQgPSB0O1xuICAgICAgICAgICAgaWYgKG1heWJlVEQudHlwZS5uYW1lID09PSBcIlR5cGVEZWZcIikge1xuICAgICAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgICAgICAgICAgICAgIHJldCA9IHRyYXZlcnNlVHlwZShzLCB0KTtcbiAgICAgICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBGb2N1cyBvbiBzaW5nbGUgc3RhdGVtZW50IChmb3Igbm93KVxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7IC8vIEZvY3VzIG9uIDpcbiAgICAgICAgICAgIHZhciBib2R5ID0gW107XG4gICAgICAgICAgICB3aGlsZSAodC5uZXh0U2libGluZygpKSB7XG4gICAgICAgICAgICAgICAgYm9keS5wdXNoKHRyYXZlcnNlU3RtdChzLCB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0LnBhcmVudCgpOyAvLyBQb3AgdG8gQm9keVxuICAgICAgICAgICAgdC5wYXJlbnQoKTsgLy8gUG9wIHRvIEZ1bmN0aW9uRGVmaW5pdGlvblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0YWc6IFwiZGVmaW5lXCIsXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBwYXJhbWV0ZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgICAgICAgICAgcmV0OiByZXRcbiAgICAgICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0cy50cmF2ZXJzZVN0bXQgPSB0cmF2ZXJzZVN0bXQ7XG5mdW5jdGlvbiB0cmF2ZXJzZVR5cGUocywgdCkge1xuICAgIHN3aXRjaCAodC50eXBlLm5hbWUpIHtcbiAgICAgICAgY2FzZSBcIlZhcmlhYmxlTmFtZVwiOlxuICAgICAgICAgICAgdmFyIG5hbWVfMSA9IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50byk7XG4gICAgICAgICAgICBpZiAoIShuYW1lXzEgPT0gXCJpbnRcIiB8fCBuYW1lXzEgPT0gXCJib29sXCIgfHwgbmFtZV8xID09IFwibm9uZVwiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlRXJyb3I6IFVua25vd24gdHlwZTogXCIgKyBuYW1lXzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5hbWVfMTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlRXJyb3I6IFVua25vd24gdHlwZTogXCIgKyB0LnR5cGUubmFtZSk7XG4gICAgfVxufVxuZXhwb3J0cy50cmF2ZXJzZVR5cGUgPSB0cmF2ZXJzZVR5cGU7XG5mdW5jdGlvbiB0cmF2ZXJzZVBhcmFtZXRlcnMocywgdCkge1xuICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBGb2N1c2VzIG9uIG9wZW4gcGFyZW5cbiAgICB2YXIgcGFyYW1ldGVycyA9IFtdO1xuICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXNlcyBvbiBhIFZhcmlhYmxlTmFtZVxuICAgIHdoaWxlICh0LnR5cGUubmFtZSAhPT0gXCIpXCIpIHtcbiAgICAgICAgdmFyIG5hbWVfMiA9IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50byk7XG4gICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXNlcyBvbiBcIlR5cGVEZWZcIiwgaG9wZWZ1bGx5LCBvciBcIixcIiBpZiBtaXN0YWtlXG4gICAgICAgIHZhciBuZXh0VGFnTmFtZSA9IHQudHlwZS5uYW1lO1xuICAgICAgICBpZiAobmV4dFRhZ05hbWUgIT09IFwiVHlwZURlZlwiKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXJzZUVycm9yOiBQYXJhbWV0ZXIgdHlwZSBub3QgbWVudGlvbmVkIFwiICsgbmFtZV8yKTtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBFbnRlciBUeXBlRGVmXG4gICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXNlcyBvbiB0eXBlIGl0c2VsZlxuICAgICAgICB2YXIgdHlwZSA9IHRyYXZlcnNlVHlwZShzLCB0KTtcbiAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBNb3ZlIG9uIHRvIGNvbW1hIG9yIFwiKVwiXG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCh7IG5hbWU6IG5hbWVfMiwgdHlwZTogdHlwZSB9KTtcbiAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBGb2N1c2VzIG9uIGEgVmFyaWFibGVOYW1lXG4gICAgfVxuICAgIHQucGFyZW50KCk7IC8vIFBvcCB0byBQYXJhbUxpc3RcbiAgICByZXR1cm4gcGFyYW1ldGVycztcbn1cbmV4cG9ydHMudHJhdmVyc2VQYXJhbWV0ZXJzID0gdHJhdmVyc2VQYXJhbWV0ZXJzO1xuZnVuY3Rpb24gdHJhdmVyc2VFeHByKHMsIHQpIHtcbiAgICBzd2l0Y2ggKHQudHlwZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgXCJCb29sZWFuXCI6XG4gICAgICAgICAgICByZXR1cm4geyBhOiBcImJvb2xcIiwgdGFnOiBcImxpdGVyYWxcIiwgdmFsdWU6IHsgdHlwOiBcImJvb2xcIiwgdmFsdWU6IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50bykgfSB9O1xuICAgICAgICBjYXNlIFwiTnVtYmVyXCI6XG4gICAgICAgICAgICByZXR1cm4geyBhOiBcImludFwiLCB0YWc6IFwibGl0ZXJhbFwiLCB2YWx1ZTogeyB0eXA6IFwiaW50XCIsIHZhbHVlOiBOdW1iZXIocy5zdWJzdHJpbmcodC5mcm9tLCB0LnRvKSkgfSB9O1xuICAgICAgICBjYXNlIFwiTm9uZVwiOlxuICAgICAgICAgICAgcmV0dXJuIHsgYTogXCJub25lXCIsIHRhZzogXCJsaXRlcmFsXCIsIHZhbHVlOiB7IHR5cDogXCJub25lXCIsIHZhbHVlOiBzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pIH0gfTtcbiAgICAgICAgY2FzZSBcIlZhcmlhYmxlTmFtZVwiOlxuICAgICAgICAgICAgcmV0dXJuIHsgdGFnOiBcIm5hbWVcIiwgbmFtZTogcy5zdWJzdHJpbmcodC5mcm9tLCB0LnRvKSB9O1xuICAgICAgICBjYXNlIFwiQmluYXJ5RXhwcmVzc2lvblwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IHRyYXZlcnNlRXhwcihzLCB0KTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIHZhciBiaW5vcHIgPSBzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pO1xuICAgICAgICAgICAgaWYgKCFiaW5vcHMuaW5jbHVkZXMoYmlub3ByKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlRXJyb3I6IEludmFsaWQgYmluYXJ5IG9wZXJhdGlvbiAoKywtLCosLy8sJSw9PSwhPSw8PSw+PSw8LD4gaXMpXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gdHJhdmVyc2VFeHByKHMsIHQpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiB7IHRhZzogXCJiaW5vcFwiLCBsZWZ0OiBsZWZ0LCBvcDogYmlub3ByLCByaWdodDogcmlnaHQgfTtcbiAgICAgICAgY2FzZSBcIlVuYXJ5RXhwcmVzc2lvblwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7XG4gICAgICAgICAgICB2YXIgdW5pb3ByID0gcy5zdWJzdHJpbmcodC5mcm9tLCB0LnRvKTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIHZhciB2YWwgPSB0cmF2ZXJzZUV4cHIocywgdCk7XG4gICAgICAgICAgICBpZiAoIXVuaW9wcy5pbmNsdWRlcyh1bmlvcHIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFyc2VFcnJvcjogSW52YWxpZCB1bmFyeSBvcGVyYXRpb24gKG5vdCwgKywgLSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgcmV0dXJuIHsgdGFnOiBcInVuaW9wXCIsIGV4cHI6IHZhbCwgb3A6IHVuaW9wciB9O1xuICAgICAgICBjYXNlIFwiUGFyZW50aGVzaXplZEV4cHJlc3Npb25cIjpcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgdmFyIGV4cHIgPSB0cmF2ZXJzZUV4cHIocywgdCk7XG4gICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgICAgIGNhc2UgXCJDYWxsRXhwcmVzc2lvblwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7IC8vIEZvY3VzIG5hbWVcbiAgICAgICAgICAgIHZhciBuYW1lXzMgPSBzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pO1xuICAgICAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBGb2N1cyBBcmdMaXN0XG4gICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTsgLy8gRm9jdXMgb3BlbiBwYXJlblxuICAgICAgICAgICAgdmFyIGFyZ3MgPSB0cmF2ZXJzZUFyZ3VtZW50cyh0LCBzKTtcbiAgICAgICAgICAgIHQucGFyZW50KCk7XG4gICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgcmV0dXJuIHsgdGFnOiBcImNhbGxcIiwgbmFtZTogbmFtZV8zLCBhcmdzOiBhcmdzIH07XG4gICAgfVxufVxuZXhwb3J0cy50cmF2ZXJzZUV4cHIgPSB0cmF2ZXJzZUV4cHI7XG5mdW5jdGlvbiB0cmF2ZXJzZUFyZ3VtZW50cyhjLCBzKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICBjLm5leHRTaWJsaW5nKCk7XG4gICAgd2hpbGUgKGMudHlwZS5uYW1lICE9PSBcIilcIikge1xuICAgICAgICB2YXIgZXhwciA9IHRyYXZlcnNlRXhwcihzLCBjKTtcbiAgICAgICAgYXJncy5wdXNoKGV4cHIpO1xuICAgICAgICBjLm5leHRTaWJsaW5nKCk7IC8vIEZvY3VzZXMgb24gZWl0aGVyIFwiLFwiIG9yIFwiKVwiXG4gICAgICAgIGMubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXNlcyBvbiBhIFZhcmlhYmxlTmFtZVxuICAgIH1cbiAgICByZXR1cm4gYXJncztcbn1cbmV4cG9ydHMudHJhdmVyc2VBcmd1bWVudHMgPSB0cmF2ZXJzZUFyZ3VtZW50cztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50Y1Byb2dyYW0gPSBleHBvcnRzLnRjU3RtdCA9IGV4cG9ydHMudGNFeHByID0gdm9pZCAwO1xudmFyIG9wVHlwZSA9IG5ldyBNYXAoKTtcbm9wVHlwZS5zZXQoXCIrXCIsIFtcImludFwiLCBcImludFwiXSk7XG5vcFR5cGUuc2V0KFwiLVwiLCBbXCJpbnRcIiwgXCJpbnRcIl0pO1xub3BUeXBlLnNldChcIipcIiwgW1wiaW50XCIsIFwiaW50XCJdKTtcbm9wVHlwZS5zZXQoXCIlXCIsIFtcImludFwiLCBcImludFwiXSk7XG5vcFR5cGUuc2V0KFwiPD1cIiwgW1wiaW50XCIsIFwiYm9vbFwiXSk7XG5vcFR5cGUuc2V0KFwiPj1cIiwgW1wiaW50XCIsIFwiYm9vbFwiXSk7XG5vcFR5cGUuc2V0KFwiPFwiLCBbXCJpbnRcIiwgXCJib29sXCJdKTtcbm9wVHlwZS5zZXQoXCI+XCIsIFtcImludFwiLCBcImJvb2xcIl0pO1xub3BUeXBlLnNldChcIm5vdFwiLCBbXCJib29sXCIsIFwiYm9vbFwiXSk7XG5vcFR5cGUuc2V0KFwiPT1cIiwgW1wiaW50XCIsIFwiYm9vbFwiXSk7XG5vcFR5cGUuc2V0KFwiIT1cIiwgW1wiaW50XCIsIFwiYm9vbFwiXSk7XG5vcFR5cGUuc2V0KFwiaXNcIiwgW1wibm9uZVwiLCBcImJvb2xcIl0pO1xub3BUeXBlLnNldChcIm5vdFwiLCBbXCJib29sXCIsIFwiYm9vbFwiXSk7XG5mdW5jdGlvbiB0Y0V4cHIoZSwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpIHtcbiAgICBzd2l0Y2ggKGUudGFnKSB7XG4gICAgICAgIGNhc2UgXCJsaXRlcmFsXCI6IHJldHVybiBlLnZhbHVlLnR5cDtcbiAgICAgICAgY2FzZSBcIm5hbWVcIjpcbiAgICAgICAgICAgIGlmICghdmFyaWFibGVzLmhhcyhlLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBWYXJpYWJsZSBcIiArIGUubmFtZSArIFwiIG5vdCBkZWZpbmVkLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZXMuZ2V0KGUubmFtZSk7XG4gICAgICAgIGNhc2UgXCJjYWxsXCI6XG4gICAgICAgICAgICBpZiAoZS5uYW1lID09PSBcInByaW50XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS5hcmdzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUeXBlRXJyb3I6IHByaW50IGV4cGVjdHMgYSBzaW5nbGUgYXJndW1lbnRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGUuYXJnc1swXS5hID0gdGNFeHByKGUuYXJnc1swXSwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBlLmFyZ3NbMF0uYTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZnVuY3Rpb25zLmhhcyhlLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBGdW5jdGlvbiBcIi5jb25jYXQoZS5uYW1lLCBcIiBub3QgZm91bmRcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIF9hID0gZnVuY3Rpb25zLmdldChlLm5hbWUpLCBhcmdzID0gX2FbMF0sIHJldCA9IF9hWzFdO1xuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSBlLmFyZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBFeHBlY3RlZCBcIi5jb25jYXQoYXJncy5sZW5ndGgsIFwiIGFyZ3VtZW50cyBidXQgZ290IFwiKS5jb25jYXQoZS5hcmdzLmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChhLCBpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3R5cCA9IHRjRXhwcihlLmFyZ3NbaV0sIGZ1bmN0aW9ucywgdmFyaWFibGVzKTtcbiAgICAgICAgICAgICAgICBpZiAoYSAhPT0gYXJndHlwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogR290IFwiLmNvbmNhdChhcmd0eXAsIFwiIGFzIGFyZ3VtZW50IFwiKS5jb25jYXQoaSArIDEsIFwiLCBleHBlY3RlZCBcIikuY29uY2F0KGEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIGNhc2UgXCJiaW5vcFwiOlxuICAgICAgICAgICAgdmFyIG9wZXJhdG9yID0gZS5vcDtcbiAgICAgICAgICAgIHZhciBsaHNUeXBlID0gdGNFeHByKGUubGVmdCwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgdmFyIHJoc1R5cGUgPSB0Y0V4cHIoZS5yaWdodCwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgaWYgKG9wVHlwZS5nZXQob3BlcmF0b3IpWzBdICE9IGxoc1R5cGUgfHwgb3BUeXBlLmdldChvcGVyYXRvcilbMF0gIT0gcmhzVHlwZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogSW5jb21wYXRpYmxlIG9wZXJhbmRzIGluIGJpbmFyeSBleHByZXNzaW9uLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcFR5cGUuZ2V0KG9wZXJhdG9yKVsxXTtcbiAgICAgICAgY2FzZSBcInVuaW9wXCI6XG4gICAgICAgICAgICB2YXIgb3BlcmF0b3IgPSBlLm9wO1xuICAgICAgICAgICAgdmFyIG9wZXJhbmQgPSB0Y0V4cHIoZS5leHByLCBmdW5jdGlvbnMsIHZhcmlhYmxlcyk7XG4gICAgICAgICAgICBpZiAob3BUeXBlLmdldChvcGVyYXRvcilbMF0gIT0gb3BlcmFuZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogSW5jb21wYXRpYmxlIG9wZXJhbmQgaW4gdW5hcnkgZXhwcmVzc2lvbi5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3BUeXBlLmdldChvcGVyYXRvcilbMV07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUeXBlRXJyb3I6IFVuaGFuZGxlZCBleHByZXNzaW9uXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMudGNFeHByID0gdGNFeHByO1xuZnVuY3Rpb24gdGNTdG10KHMsIGZ1bmN0aW9ucywgdmFyaWFibGVzLCBjdXJyZW50UmV0dXJuKSB7XG4gICAgc3dpdGNoIChzLnRhZykge1xuICAgICAgICBjYXNlIFwiYXNzaWduXCI6XG4gICAgICAgICAgICB2YXIgcmhzID0gdGNFeHByKHMudmFsdWUsIGZ1bmN0aW9ucywgdmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZXMuaGFzKHMubmFtZSkgJiYgdmFyaWFibGVzLmdldChzLm5hbWUpICE9IHJocykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogQ2Fubm90IGFzc2lnbiBcIi5jb25jYXQocmhzLCBcIiB0byBcIikuY29uY2F0KHZhcmlhYmxlcy5nZXQocy5uYW1lKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFyaWFibGVzLmhhcyhzLm5hbWUpICYmIHZhcmlhYmxlcy5nZXQocy5uYW1lKSAhPSB0Y0V4cHIocy52YWx1ZSwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBSZXR1cm4gdHlwZSBvZiBmdW5jdGlvbiBhbmQgdmFyaWFibGUgZG8gbm90IG1hdGNoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyaWFibGVzLnNldChzLm5hbWUsIHJocyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNhc2UgXCJ3aGlsZVwiOlxuICAgICAgICAgICAgaWYgKHRjRXhwcihzLmNvbmQsIGZ1bmN0aW9ucywgdmFyaWFibGVzKSAhPSBcImJvb2xcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogQ29uZGl0aW9uIGluIHdoaWxlIHN0YXRlbWVudCBtdXN0IGJlIGJvb2xlYW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNhc2UgXCJpZlwiOlxuICAgICAgICAgICAgaWYgKHRjRXhwcihzLmlmY29uZCwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpICE9IFwiYm9vbFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBDb25kaXRpb24gaW4gaWYgc3RhdGVtZW50IG11c3QgYmUgYm9vbGVhblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLmVsaWZjb25kICE9IHVuZGVmaW5lZCAmJiB0Y0V4cHIocy5lbGlmY29uZCwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpICE9IFwiYm9vbFwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBDb25kaXRpb24gaW4gZWxpZiBzdGF0ZW1lbnQgbXVzdCBiZSBib29sZWFuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjYXNlIFwiZGVmaW5lXCI6XG4gICAgICAgICAgICB2YXIgbG9jYWx2YXJzXzEgPSBuZXcgTWFwKHZhcmlhYmxlcy5lbnRyaWVzKCkpO1xuICAgICAgICAgICAgcy5wYXJhbWV0ZXJzLmZvckVhY2goZnVuY3Rpb24gKHApIHsgbG9jYWx2YXJzXzEuc2V0KHAubmFtZSwgcC50eXBlKTsgfSk7XG4gICAgICAgICAgICBzLmJvZHkuZm9yRWFjaChmdW5jdGlvbiAoYnMpIHsgcmV0dXJuIHRjU3RtdChicywgZnVuY3Rpb25zLCBsb2NhbHZhcnNfMSwgcy5yZXQpOyB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY2FzZSBcImV4cHJcIjpcbiAgICAgICAgICAgIHJldHVybiB0Y0V4cHIocy5leHByLCBmdW5jdGlvbnMsIHZhcmlhYmxlcykgPT0gXCJib29sXCI7XG4gICAgICAgIGNhc2UgXCJyZXR1cm5cIjpcbiAgICAgICAgICAgIHZhciB0eXBlID0gdGNFeHByKHMudmFsdWUsIGZ1bmN0aW9ucywgdmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmICh0eXBlICE9PSBjdXJyZW50UmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBcIi5jb25jYXQodHlwZSwgXCIgcmV0dXJuZWQsIFwiKS5jb25jYXQoY3VycmVudFJldHVybiwgXCIgZXhwZWN0ZWQuXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5leHBvcnRzLnRjU3RtdCA9IHRjU3RtdDtcbmZ1bmN0aW9uIHRjUHJvZ3JhbShwKSB7XG4gICAgdmFyIGZ1bmN0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICBmdW5jdGlvbnMuc2V0KFwicHJpbnRcIiwgW1tcImludFwiLCBcImJvb2xcIl0sIFwibm9uZVwiXSk7XG4gICAgcC5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIGlmIChzLnRhZyA9PT0gXCJkZWZpbmVcIikge1xuICAgICAgICAgICAgZnVuY3Rpb25zLnNldChzLm5hbWUsIFtzLnBhcmFtZXRlcnMubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBwLnR5cGU7IH0pLCBzLnJldF0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGdsb2JhbHMgPSBuZXcgTWFwKCk7XG4gICAgdmFyIHR5cGUgPSBmYWxzZTtcbiAgICBwLmZvckVhY2goZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgdHlwZSA9IHRjU3RtdChzLCBmdW5jdGlvbnMsIGdsb2JhbHMsIFwibm9uZVwiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHlwZTtcbn1cbmV4cG9ydHMudGNQcm9ncmFtID0gdGNQcm9ncmFtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGNvbXBpbGVyXzEgPSByZXF1aXJlKFwiLi9jb21waWxlclwiKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gZGlzcGxheShhcmcpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3V0cHV0XCIpO1xuICAgICAgICBvdXRwdXQudGV4dENvbnRlbnQgKz0gYXJnICsgXCJcXG5cIjtcbiAgICB9XG4gICAgdmFyIGltcG9ydE9iamVjdCwgcnVuQnV0dG9uLCB1c2VyQ29kZTtcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIGltcG9ydE9iamVjdCA9IHtcbiAgICAgICAgICAgIGltcG9ydHM6IHtcbiAgICAgICAgICAgICAgICBwcmludF9udW06IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnaW5nIGZyb20gV0FTTTogXCIsIGFyZyk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkoU3RyaW5nKGFyZykpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbm90X29wZXJhdG9yOiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2luZyBmcm9tIFdBU006IFwiLCBhcmcpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2dpbmcgZnJvbSBXQVNNOiBcIiwgYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheShTdHJpbmcoIWFyZykpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWFyZztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByaW50X2Jvb2w6IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheShcIkZhbHNlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheShcIlRydWVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByaW50X25vbmU6IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheShcIk5vbmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcmludF9hbnk6IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheShhcmcudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgcnVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJydW5cIik7XG4gICAgICAgIHVzZXJDb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1c2VyLWNvZGVcIik7XG4gICAgICAgIHJ1bkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwcm9ncmFtLCBvdXRwdXQsIHdhdCwgY29kZSwgcmVzdWx0LCBlXzE7XG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmFtID0gdXNlckNvZGUudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm91dHB1dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzEsIDMsICwgNF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2F0ID0gKDAsIGNvbXBpbGVyXzEuY29tcGlsZSkocHJvZ3JhbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZW5lcmF0ZWQtY29kZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUudGV4dENvbnRlbnQgPSB3YXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCAoMCwgY29tcGlsZXJfMS5ydW4pKHdhdCwgaW1wb3J0T2JqZWN0KV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC50ZXh0Q29udGVudCArPSBTdHJpbmcocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImNvbG9yOiBibGFja1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBlXzEgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQudGV4dENvbnRlbnQgPSBTdHJpbmcoZV8xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dHB1dC5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcImNvbG9yOiByZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICAgICAgdXNlckNvZGUudmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInByb2dyYW1cIik7XG4gICAgICAgIHVzZXJDb2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicHJvZ3JhbVwiLCB1c2VyQ29kZS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyB9KTtcbiAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgIH0pO1xufSk7IH0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB3YWJ0OyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIGxlemVyID0gcmVxdWlyZSgnbGV6ZXInKTtcblxuLy8gVGhpcyBmaWxlIHdhcyBnZW5lcmF0ZWQgYnkgbGV6ZXItZ2VuZXJhdG9yLiBZb3UgcHJvYmFibHkgc2hvdWxkbid0IGVkaXQgaXQuXG5jb25zdCBwcmludEtleXdvcmQgPSAxLFxuICBpbmRlbnQgPSAxNjIsXG4gIGRlZGVudCA9IDE2MyxcbiAgbmV3bGluZSQxID0gMTY0LFxuICBuZXdsaW5lQnJhY2tldGVkID0gMTY1LFxuICBuZXdsaW5lRW1wdHkgPSAxNjYsXG4gIGVvZiA9IDE2NyxcbiAgUGFyZW50aGVzaXplZEV4cHJlc3Npb24gPSAyMSxcbiAgVHVwbGVFeHByZXNzaW9uID0gNDcsXG4gIENvbXByZWhlbnNpb25FeHByZXNzaW9uID0gNDgsXG4gIEFycmF5RXhwcmVzc2lvbiA9IDUyLFxuICBBcnJheUNvbXByZWhlbnNpb25FeHByZXNzaW9uID0gNTUsXG4gIERpY3Rpb25hcnlFeHByZXNzaW9uID0gNTYsXG4gIERpY3Rpb25hcnlDb21wcmVoZW5zaW9uRXhwcmVzc2lvbiA9IDU5LFxuICBTZXRFeHByZXNzaW9uID0gNjAsXG4gIFNldENvbXByZWhlbnNpb25FeHByZXNzaW9uID0gNjEsXG4gIEFyZ0xpc3QgPSA2MyxcbiAgUGFyYW1MaXN0ID0gMTIxO1xuXG5jb25zdCBuZXdsaW5lID0gMTAsIGNhcnJpYWdlUmV0dXJuID0gMTMsIHNwYWNlID0gMzIsIHRhYiA9IDksIGhhc2ggPSAzNSwgcGFyZW5PcGVuID0gNDAsIGRvdCA9IDQ2O1xuXG5jb25zdCBicmFja2V0ZWQgPSBbXG4gIFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uLCBUdXBsZUV4cHJlc3Npb24sIENvbXByZWhlbnNpb25FeHByZXNzaW9uLCBBcnJheUV4cHJlc3Npb24sIEFycmF5Q29tcHJlaGVuc2lvbkV4cHJlc3Npb24sXG4gIERpY3Rpb25hcnlFeHByZXNzaW9uLCBEaWN0aW9uYXJ5Q29tcHJlaGVuc2lvbkV4cHJlc3Npb24sIFNldEV4cHJlc3Npb24sIFNldENvbXByZWhlbnNpb25FeHByZXNzaW9uLCBBcmdMaXN0LCBQYXJhbUxpc3Rcbl07XG5cbmxldCBjYWNoZWRJbmRlbnQgPSAwLCBjYWNoZWRJbnB1dCA9IG51bGwsIGNhY2hlZFBvcyA9IDA7XG5mdW5jdGlvbiBnZXRJbmRlbnQoaW5wdXQsIHBvcykge1xuICBpZiAocG9zID09IGNhY2hlZFBvcyAmJiBpbnB1dCA9PSBjYWNoZWRJbnB1dCkgcmV0dXJuIGNhY2hlZEluZGVudFxuICBjYWNoZWRJbnB1dCA9IGlucHV0OyBjYWNoZWRQb3MgPSBwb3M7XG4gIHJldHVybiBjYWNoZWRJbmRlbnQgPSBnZXRJbmRlbnRJbm5lcihpbnB1dCwgcG9zKVxufVxuXG5mdW5jdGlvbiBnZXRJbmRlbnRJbm5lcihpbnB1dCwgcG9zKSB7XG4gIGZvciAobGV0IGluZGVudCA9IDA7OyBwb3MrKykge1xuICAgIGxldCBjaCA9IGlucHV0LmdldChwb3MpO1xuICAgIGlmIChjaCA9PSBzcGFjZSkgaW5kZW50Kys7XG4gICAgZWxzZSBpZiAoY2ggPT0gdGFiKSBpbmRlbnQgKz0gOCAtIChpbmRlbnQgJSA4KTtcbiAgICBlbHNlIGlmIChjaCA9PSBuZXdsaW5lIHx8IGNoID09IGNhcnJpYWdlUmV0dXJuIHx8IGNoID09IGhhc2gpIHJldHVybiAtMVxuICAgIGVsc2UgcmV0dXJuIGluZGVudFxuICB9XG59XG5cbmNvbnN0IG5ld2xpbmVzID0gbmV3IGxlemVyLkV4dGVybmFsVG9rZW5pemVyKChpbnB1dCwgdG9rZW4sIHN0YWNrKSA9PiB7XG4gIGxldCBuZXh0ID0gaW5wdXQuZ2V0KHRva2VuLnN0YXJ0KTtcbiAgaWYgKG5leHQgPCAwKSB7XG4gICAgdG9rZW4uYWNjZXB0KGVvZiwgdG9rZW4uc3RhcnQpO1xuICB9IGVsc2UgaWYgKG5leHQgIT0gbmV3bGluZSAmJiBuZXh0ICE9IGNhcnJpYWdlUmV0dXJuKSA7IGVsc2UgaWYgKHN0YWNrLnN0YXJ0T2YoYnJhY2tldGVkKSAhPSBudWxsKSB7XG4gICAgdG9rZW4uYWNjZXB0KG5ld2xpbmVCcmFja2V0ZWQsIHRva2VuLnN0YXJ0ICsgMSk7XG4gIH0gZWxzZSBpZiAoZ2V0SW5kZW50KGlucHV0LCB0b2tlbi5zdGFydCArIDEpIDwgMCkge1xuICAgIHRva2VuLmFjY2VwdChuZXdsaW5lRW1wdHksIHRva2VuLnN0YXJ0ICsgMSk7XG4gIH0gZWxzZSB7XG4gICAgdG9rZW4uYWNjZXB0KG5ld2xpbmUkMSwgdG9rZW4uc3RhcnQgKyAxKTtcbiAgfVxufSwge2NvbnRleHR1YWw6IHRydWUsIGZhbGxiYWNrOiB0cnVlfSk7XG5cbmNvbnN0IGluZGVudGF0aW9uID0gbmV3IGxlemVyLkV4dGVybmFsVG9rZW5pemVyKChpbnB1dCwgdG9rZW4sIHN0YWNrKSA9PiB7XG4gIGxldCBwcmV2ID0gaW5wdXQuZ2V0KHRva2VuLnN0YXJ0IC0gMSksIGRlcHRoO1xuICBpZiAoKHByZXYgPT0gbmV3bGluZSB8fCBwcmV2ID09IGNhcnJpYWdlUmV0dXJuKSAmJlxuICAgICAgKGRlcHRoID0gZ2V0SW5kZW50KGlucHV0LCB0b2tlbi5zdGFydCkpID49IDAgJiZcbiAgICAgIGRlcHRoICE9IHN0YWNrLmNvbnRleHQuZGVwdGggJiZcbiAgICAgIHN0YWNrLnN0YXJ0T2YoYnJhY2tldGVkKSA9PSBudWxsKVxuICAgIHRva2VuLmFjY2VwdChkZXB0aCA8IHN0YWNrLmNvbnRleHQuZGVwdGggPyBkZWRlbnQgOiBpbmRlbnQsIHRva2VuLnN0YXJ0KTtcbn0pO1xuXG5mdW5jdGlvbiBJbmRlbnRMZXZlbChwYXJlbnQsIGRlcHRoKSB7XG4gIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICB0aGlzLmRlcHRoID0gZGVwdGg7XG4gIHRoaXMuaGFzaCA9IChwYXJlbnQgPyBwYXJlbnQuaGFzaCArIHBhcmVudC5oYXNoIDw8IDggOiAwKSArIGRlcHRoICsgKGRlcHRoIDw8IDQpO1xufVxuXG5jb25zdCB0b3BJbmRlbnQgPSBuZXcgSW5kZW50TGV2ZWwobnVsbCwgMCk7XG5cbmNvbnN0IHRyYWNrSW5kZW50ID0gbmV3IGxlemVyLkNvbnRleHRUcmFja2VyKHtcbiAgc3RhcnQ6IHRvcEluZGVudCxcbiAgc2hpZnQoY29udGV4dCwgdGVybSwgaW5wdXQsIHN0YWNrKSB7XG4gICAgcmV0dXJuIHRlcm0gPT0gaW5kZW50ID8gbmV3IEluZGVudExldmVsKGNvbnRleHQsIGdldEluZGVudChpbnB1dCwgc3RhY2sucG9zKSkgOlxuICAgICAgdGVybSA9PSBkZWRlbnQgPyBjb250ZXh0LnBhcmVudCA6IGNvbnRleHRcbiAgfSxcbiAgaGFzaChjb250ZXh0KSB7IHJldHVybiBjb250ZXh0Lmhhc2ggfVxufSk7XG5cbmNvbnN0IGxlZ2FjeVByaW50ID0gbmV3IGxlemVyLkV4dGVybmFsVG9rZW5pemVyKChpbnB1dCwgdG9rZW4pID0+IHtcbiAgbGV0IHBvcyA9IHRva2VuLnN0YXJ0O1xuICBmb3IgKGxldCBwcmludCA9IFwicHJpbnRcIiwgaSA9IDA7IGkgPCBwcmludC5sZW5ndGg7IGkrKywgcG9zKyspXG4gICAgaWYgKGlucHV0LmdldChwb3MpICE9IHByaW50LmNoYXJDb2RlQXQoaSkpIHJldHVyblxuICBsZXQgZW5kID0gcG9zO1xuICBpZiAoL1xcdy8udGVzdChTdHJpbmcuZnJvbUNoYXJDb2RlKGlucHV0LmdldChwb3MpKSkpIHJldHVyblxuICBmb3IgKDs7IHBvcysrKSB7XG4gICAgbGV0IG5leHQgPSBpbnB1dC5nZXQocG9zKTtcbiAgICBpZiAobmV4dCA9PSBzcGFjZSB8fCBuZXh0ID09IHRhYikgY29udGludWVcbiAgICBpZiAobmV4dCAhPSBwYXJlbk9wZW4gJiYgbmV4dCAhPSBkb3QgJiYgbmV4dCAhPSBuZXdsaW5lICYmIG5leHQgIT0gY2FycmlhZ2VSZXR1cm4gJiYgbmV4dCAhPSBoYXNoKVxuICAgICAgdG9rZW4uYWNjZXB0KHByaW50S2V5d29yZCwgZW5kKTtcbiAgICByZXR1cm5cbiAgfVxufSk7XG5cbi8vIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGJ5IGxlemVyLWdlbmVyYXRvci4gWW91IHByb2JhYmx5IHNob3VsZG4ndCBlZGl0IGl0LlxuY29uc3Qgc3BlY19pZGVudGlmaWVyID0ge19fcHJvdG9fXzpudWxsLGF3YWl0OjQwLCBvcjo0OCwgYW5kOjUwLCBpbjo1NCwgbm90OjU2LCBpczo1OCwgaWY6NjQsIGVsc2U6NjYsIGxhbWJkYTo3MCwgeWllbGQ6ODgsIGZyb206OTAsIGFzeW5jOjk4LCBmb3I6MTAwLCBOb25lOjE1MiwgVHJ1ZToxNTQsIEZhbHNlOjE1NCwgZGVsOjE2OCwgcGFzczoxNzIsIGJyZWFrOjE3NiwgY29udGludWU6MTgwLCByZXR1cm46MTg0LCByYWlzZToxOTIsIGltcG9ydDoxOTYsIGFzOjE5OCwgZ2xvYmFsOjIwMiwgbm9ubG9jYWw6MjA0LCBhc3NlcnQ6MjA4LCBlbGlmOjIxOCwgd2hpbGU6MjIyLCB0cnk6MjI4LCBleGNlcHQ6MjMwLCBmaW5hbGx5OjIzMiwgd2l0aDoyMzYsIGRlZjoyNDAsIGNsYXNzOjI1MH07XG5jb25zdCBwYXJzZXIgPSBsZXplci5QYXJzZXIuZGVzZXJpYWxpemUoe1xuICB2ZXJzaW9uOiAxMyxcbiAgc3RhdGVzOiBcIiE/fE9gUSRJWE9PTyVjUSRJW08nI0dhT09RJElTJyNDbScjQ21PT1EkSVMnI0NuJyNDbk8nUlEkSVdPJyNDbE8odFEkSVtPJyNHYE9PUSRJUycjR2EnI0dhT09RJElTJyNEUicjRFJPT1EkSVMnI0dgJyNHYE8pYlEkSVdPJyNDcU8pclEkSVdPJyNEYk8qU1EkSVdPJyNEZk9PUSRJUycjRHMnI0RzTypnT2BPJyNEc08qb09wTycjRHNPKndPIWJPJyNEdE8rU08jdE8nI0R0TytfTyZqTycjRHRPK2pPLFVPJyNEdE8tbFEkSVtPJyNHUU9PUSRJUycjR1EnI0dRTydSUSRJV08nI0dQTy9PUSRJW08nI0dQT09RJElTJyNFXScjRV1PL2dRJElXTycjRV5PT1EkSVMnI0dPJyNHT08vcVEkSVdPJyNGfU9PUSRJVicjRn0nI0Z9Ty98USRJV08nI0ZQT09RJElTJyNGcicjRnJPMFJRJElXTycjRk9PT1EkSVYnI0haJyNIWk9PUSRJVicjRnwnI0Z8T09RJElUJyNGUicjRlJRYFEkSVhPT08nUlEkSVdPJyNDb08wYVEkSVdPJyNDek8waFEkSVdPJyNET08wdlEkSVdPJyNHZU8xV1EkSVtPJyNFUU8nUlEkSVdPJyNFUk9PUSRJUycjRVQnI0VUT09RJElTJyNFVicjRVZPT1EkSVMnI0VYJyNFWE8xbFEkSVdPJyNFWk8yU1EkSVdPJyNFX08vfFEkSVdPJyNFYU8yZ1EkSVtPJyNFYU8vfFEkSVdPJyNFZE8vZ1EkSVdPJyNFZ08vZ1EkSVdPJyNFa08vZ1EkSVdPJyNFbk8yclEkSVdPJyNFcE8yeVEkSVdPJyNFdU8zVVEkSVdPJyNFcU8vZ1EkSVdPJyNFdU8vfFEkSVdPJyNFd08vfFEkSVdPJyNFfE9PUSRJUycjQ2MnI0NjT09RJElTJyNDZCcjQ2RPT1EkSVMnI0NlJyNDZU9PUSRJUycjQ2YnI0NmT09RJElTJyNDZycjQ2dPT1EkSVMnI0NoJyNDaE9PUSRJUycjQ2onI0NqTydSUSRJV08sNTh8TydSUSRJV08sNTh8TydSUSRJV08sNTh8TydSUSRJV08sNTh8TydSUSRJV08sNTh8TydSUSRJV08sNTh8TzNaUSRJV08nI0RtT09RJElTLDU6Vyw1OldPM25RJElXTyw1OlpPM3tRJTFgTyw1OlpPNFFRJElbTyw1OVdPMGFRJElXTyw1OV9PMGFRJElXTyw1OV9PMGFRJElXTyw1OV9PNnBRJElXTyw1OV9PNnVRJElXTyw1OV9PNnxRJElXTyw1OWdPN1RRJElXTycjR2BPOFpRJElXTycjR19PT1EkSVMnI0dfJyNHX09PUSRJUycjRFgnI0RYTzhyUSRJV08sNTldTydSUSRJV08sNTldTzlRUSRJV08sNTldTzlWUSRJV08sNTpQTydSUSRJV08sNTpQT09RJElTLDU5fCw1OXxPOWVRJElXTyw1OXxPOWpRJElXTyw1OlZPJ1JRJElXTyw1OlZPJ1JRJElXTyw1OlRPT1EkSVMsNTpRLDU6UU85e1EkSVdPLDU6UU86UVEkSVdPLDU6VU9PT08nI0ZaJyNGWk86Vk9gTyw1Ol9PT1EkSVMsNTpfLDU6X09PT08nI0ZbJyNGW086X09wTyw1Ol9POmdRJElXTycjRHVPT09PJyNGXScjRl1POndPIWJPLDU6YE9PUSRJUyw1OmAsNTpgT09PTycjRmAnI0ZgTztTTyN0Tyw1OmBPT09PJyNGYScjRmFPO19PJmpPLDU6YE9PT08nI0ZiJyNGYk87ak8sVU8sNTpgT09RJElTJyNGYycjRmNPO3VRJElbTyw1OmRPPmdRJElbTyw1PGtPP1FRJUdsTyw1PGtPP3FRJElbTyw1PGtPT1EkSVMsNTp4LDU6eE9AWVEkSVhPJyNGa09BaVEkSVdPLDU7VE9PUSRJViw1PGksNTxpT0F0USRJW08nI0hXT0JdUSRJV08sNTtrT09RJElTLUU5cC1FOXBPT1EkSVYsNTtqLDU7ak8zUFEkSVdPJyNFd09PUSRJVC1FOVAtRTlQT0JlUSRJW08sNTlaT0RsUSRJW08sNTlmT0VWUSRJV08nI0diT0ViUSRJV08nI0diTy98USRJV08nI0diT0VtUSRJV08nI0RRT0V1USRJV08sNTlqT0V6USRJV08nI0dmTydSUSRJV08nI0dmTy9nUSRJV08sNT1QT09RJElTLDU9UCw1PVBPL2dRJElXTycjRHxPT1EkSVMnI0R9JyNEfU9GaVEkSVdPJyNGZU9GeVEkSVdPLDU4ek9HWFEkSVdPLDU4ek8pZVEkSVdPLDU6ak9HXlEkSVtPJyNHaE9PUSRJUyw1Om0sNTptT09RJElTLDU6dSw1OnVPR3FRJElXTyw1OnlPSFNRJElXTyw1OntPT1EkSVMnI0ZoJyNGaE9IYlEkSVtPLDU6e09IcFEkSVdPLDU6e09IdVEkSVdPJyNIWU9PUSRJUyw1O08sNTtPT0lUUSRJV08nI0hWT09RJElTLDU7Uiw1O1JPM1VRJElXTyw1O1ZPM1VRJElXTyw1O1lPSWZRJElbTycjSFtPJ1JRJElXTycjSFtPSXBRJElXTyw1O1tPMnJRJElXTyw1O1tPL2dRJElXTyw1O2FPL3xRJElXTyw1O2NPSXVRJElYTycjRWxPS09RJElaTyw1O11PTmFRJElXTycjSF1PM1VRJElXTyw1O2FPTmxRJElXTyw1O2NPTnFRJElXTyw1O2hPISNmUSRJW08xRy5oTyEjbVEkSVtPMUcuaE8hJl5RJElbTzFHLmhPISZoUSRJW08xRy5oTyEpUlEkSVtPMUcuaE8hKWZRJElbTzFHLmhPISl5USRJV08nI0duTyEqWFEkSVtPJyNHUU8vZ1EkSVdPJyNHbk8hKmNRJElXTycjR21PT1EkSVMsNTpYLDU6WE8hKmtRJElXTyw1OlhPISpwUSRJV08nI0dvTyEqe1EkSVdPJyNHb08hK2BRJElXTzFHL3VPT1EkSVMnI0RxJyNEcU9PUSRJUzFHL3UxRy91T09RJElTMUcueTFHLnlPISxgUSRJW08xRy55TyEsZ1EkSVtPMUcueU8wYVEkSVdPMUcueU8hLVNRJElXTzFHL1JPT1EkSVMnI0RXJyNEV08vZ1EkSVdPLDU5cU9PUSRJUzFHLncxRy53TyEtWlEkSVdPMUcvY08hLWtRJElXTzFHL2NPIS1zUSRJV08xRy9kTydSUSRJV08nI0dnTyEteFEkSVdPJyNHZ08hLX1RJElbTzFHLndPIS5fUSRJV08sNTlmTyEvZVEkSVdPLDU9Vk8hL3VRJElXTyw1PVZPIS99USRJV08xRy9rTyEwU1EkSVtPMUcva09PUSRJUzFHL2gxRy9oTyEwZFEkSVdPLDU9UU8hMVpRJElXTyw1PVFPL2dRJElXTzFHL29PITF4USRJV08xRy9xTyExfVEkSVtPMUcvcU8hMl9RJElbTzFHL29PT1EkSVMxRy9sMUcvbE9PUSRJUzFHL3AxRy9wT09PTy1FOVgtRTlYT09RJElTMUcveTFHL3lPT09PLUU5WS1FOVlPITJvUSRJV08nI0d6Ty9nUSRJV08nI0d6TyEyfVEkSVdPLDU6YU9PT08tRTlaLUU5Wk9PUSRJUzFHL3oxRy96T09PTy1FOV4tRTleT09PTy1FOV8tRTlfT09PTy1FOWAtRTlgT09RJElTLUU5YS1FOWFPITNZUSVHbE8xRzJWTyEzeVEkSVtPMUcyVk8nUlEkSVdPLDU8T09PUSRJUyw1PE8sNTxPT09RJElTLUU5Yi1FOWJPT1EkSVMsNTxWLDU8Vk9PUSRJUy1FOWktRTlpT09RJElWMUcwbzFHMG9PL3xRJElXTycjRmdPITRiUSRJW08sNT1yT09RJElTMUcxVjFHMVZPITR5USRJV08xRzFWT09RJElTJyNEUycjRFNPL2dRJElXTyw1PHxPT1EkSVMsNTx8LDU8fE8hNU9RJElXTycjRlNPITVaUSRJV08sNTlsTyE1Y1EkSVdPMUcvVU8hNW1RJElbTyw1PVFPT1EkSVMxRzJrMUcya09PUSRJUyw1OmgsNTpoTyE2XlEkSVdPJyNHUE9PUSRJUyw1PFAsNTxQT09RJElTLUU5Yy1FOWNPITZvUSRJV08xRy5mT09RJElTMUcwVTFHMFVPITZ9USRJV08sNT1TTyE3X1EkSVdPLDU9U08vZ1EkSVdPMUcwZU8vZ1EkSVdPMUcwZU8vfFEkSVdPMUcwZ09PUSRJUy1FOWYtRTlmTyE3cFEkSVdPMUcwZ08hN3tRJElXTzFHMGdPIThRUSRJV08sNT10TyE4YFEkSVdPLDU9dE8hOG5RJElXTyw1PXFPITlVUSRJV08sNT1xTyE5Z1EkSVpPMUcwcU8hPHVRJElaTzFHMHRPIUBRUSRJV08sNT12TyFAW1EkSVdPLDU9dk8hQGRRJElbTyw1PXZPL2dRJElXTzFHMHZPIUBuUSRJV08xRzB2TzNVUSRJV08xRzB7T05sUSRJV08xRzB9T09RJElWLDU7Vyw1O1dPIUBzUSRJWU8sNTtXTyFAeFEkSVpPMUcwd08hRFpRJElXTycjRm9PM1VRJElXTzFHMHdPM1VRJElXTzFHMHdPIURoUSRJV08sNT13TyFEdVEkSVdPLDU9d08vfFEkSVdPLDU9d09PUSRJVjFHMHsxRzB7TyFEfVEkSVdPJyNFeU8hRWBRJTFgTzFHMH1PT1EkSVYxRzFTMUcxU08zVVEkSVdPMUcxU09PUSRJUyw1PVksNT1ZT09RJElTJyNEbicjRG5PL2dRJElXTyw1PVlPIUVoUSRJV08sNT1YTyFFe1EkSVdPLDU9WE9PUSRJUzFHL3MxRy9zTyFGVFEkSVdPLDU9Wk8hRmVRJElXTyw1PVpPIUZtUSRJV08sNT1aTyFHUVEkSVdPLDU9Wk8hR2JRJElXTyw1PVpPT1EkSVM3KyVhNyslYU9PUSRJUzcrJGU3KyRlTyE1Y1EkSVdPNyskbU8hSVRRJElXTzFHLnlPIUlbUSRJV08xRy55T09RJElTMUcvXTFHL11PT1EkSVMsNTtwLDU7cE8nUlEkSVdPLDU7cE9PUSRJUzcrJH03KyR9TyFJY1EkSVdPNyskfU9PUSRJUy1FOVMtRTlTT09RJElTNyslTzcrJU9PIUlzUSRJV08sNT1STydSUSRJV08sNT1ST09RJElTNyskYzcrJGNPIUl4USRJV083KyR9TyFKUVEkSVdPNyslT08hSlZRJElXTzFHMnFPT1EkSVM3KyVWNyslVk8hSmdRJElXTzFHMnFPIUpvUSRJV083KyVWT09RJElTLDU7byw1O29PJ1JRJElXTyw1O29PIUp0USRJV08xRzJsT09RJElTLUU5Ui1FOVJPIUtrUSRJV083KyVaT09RJElTNyslXTcrJV1PIUt5USRJV08xRzJsTyFMaFEkSVdPNyslXU8hTG1RJElXTzFHMnJPIUx9USRJV08xRzJyTyFNVlEkSVdPNyslWk8hTVtRJElXTyw1PWZPIU1yUSRJV08sNT1mTyFNclEkSVdPLDU9Zk8hTlFPIUxRTycjRHdPIU5dT1NPJyNHe09PT08xRy97MUcve08hTmJRJElXTzFHL3tPIU5qUSVHbE83KydxTyMgWlEkSVtPMUcxalAjIHRRJElXTycjRmRPT1EkSVMsNTxSLDU8Uk9PUSRJUy1FOWUtRTllT09RJElTNysmcTcrJnFPT1EkSVMxRzJoMUcyaE9PUSRJUyw1O24sNTtuT09RJElTLUU5US1FOVFPT1EkSVM3KyRwNyskcE8jIVJRJElXTyw1PGtPIyFsUSRJV08sNTxrTyMhfVEkSVtPLDU7cU8jI2JRJElXTzFHMm5PT1EkSVMtRTlULUU5VE9PUSRJUzcrJlA3KyZQTyMjclEkSVdPNysmUE9PUSRJUzcrJlI3KyZSTyMkUVEkSVdPJyNIWE8vfFEkSVdPNysmUk8jJGZRJElXTzcrJlJPT1EkSVMsNTxVLDU8VU8jJHFRJElXTzFHM2BPT1EkSVMtRTloLUU5aE9PUSRJUyw1PFEsNTxRTyMlUFEkSVdPMUczXU9PUSRJUy1FOWQtRTlkTyMlZ1EkSVpPNysmXU8hRFpRJElXTycjRm1PM1VRJElXTzcrJl1PM1VRJElXTzcrJmBPIyh1USRJW08sNTxZTydSUSRJV08sNTxZTyMpUFEkSVdPMUczYk9PUSRJUy1FOWwtRTlsTyMpWlEkSVdPMUczYk8zVVEkSVdPNysmYk8vZ1EkSVdPNysmYk9PUSRJVjcrJmc3KyZnTyFFYFElMWBPNysmaU8jKWNRJElYTzFHMHJPT1EkSVYtRTltLUU5bU8zVVEkSVdPNysmY08zVVEkSVdPNysmY09PUSRJViw1PFosNTxaTyMrVVEkSVdPLDU8Wk9PUSRJVjcrJmM3KyZjTyMrYVEkSVpPNysmY08jLmxRJElXTyw1PFtPIy53USRJV08xRzNjT09RJElTLUU5bi1FOW5PIy9VUSRJV08xRzNjTyMvXlEkSVdPJyNIX08jL2xRJElXTycjSF9PL3xRJElXTycjSF9PT1EkSVMnI0hfJyNIX08jL3dRJElXTycjSF5PT1EkSVMsNTtlLDU7ZU8jMFBRJElXTyw1O2VPL2dRJElXTycjRXtPT1EkSVY3KyZpNysmaU8zVVEkSVdPNysmaU9PUSRJVjcrJm43KyZuT09RJElTMUcydDFHMnRPT1EkSVMsNTtzLDU7c08jMFVRJElXTzFHMnNPT1EkSVMtRTlWLUU5Vk8jMGlRJElXTyw1O3RPIzB0USRJV08sNTt0TyMxWFEkSVdPMUcydU9PUSRJUy1FOVctRTlXTyMxaVEkSVdPMUcydU8jMXFRJElXTzFHMnVPIzJSUSRJV08xRzJ1TyMxaVEkSVdPMUcydU9PUSRJUzw8SFg8PEhYTyMyXlEkSVtPMUcxW09PUSRJUzw8SGk8PEhpUCMya1EkSVdPJyNGVU82fFEkSVdPMUcybU8jMnhRJElXTzFHMm1PIzJ9USRJV088PEhpT09RJElTPDxIajw8SGpPIzNfUSRJV083KyhdT09RJElTPDxIcTw8SHFPIzNvUSRJW08xRzFaUCM0YFEkSVdPJyNGVE8jNG1RJElXTzcrKF5PIzR9USRJV083KyheTyM1VlEkSVdPPDxIdU8jNVtRJElXTzcrKFdPT1EkSVM8PEh3PDxId08jNlJRJElXTyw1O3JPJ1JRJElXTyw1O3JPT1EkSVMtRTlVLUU5VU9PUSRJUzw8SHU8PEh1T09RJElTLDU7eCw1O3hPL2dRJElXTyw1O3hPIzZXUSRJV08xRzNRT09RJElTLUU5Wy1FOVtPIzZuUSRJV08xRzNRT09PTycjRl8nI0ZfTyM2fE8hTFFPLDU6Y09PT08sNT1nLDU9Z09PT083KyVnNyslZ08jN1hRJElXTzFHMlZPIzdyUSRJV08xRzJWUCdSUSRJV08nI0ZWTy9nUSRJV088PElrTyM4VFEkSVdPLDU9c08jOGZRJElXTyw1PXNPL3xRJElXTyw1PXNPIzh3USRJV088PEltT09RJElTPDxJbTw8SW1PL3xRJElXTzw8SW1QL3xRJElXTycjRmpQL2dRJElXTycjRmZPT1EkSVYtRTlrLUU5a08zVVEkSVdPPDxJd09PUSRJViw1PFgsNTxYTzNVUSRJV08sNTxYT09RJElWPDxJdzw8SXdPT1EkSVY8PEl6PDxJek8jOHxRJElbTzFHMXRQIzlXUSRJV08nI0ZuTyM5X1EkSVdPNysofE8jOWlRJElaTzw8SXxPM1VRJElXTzw8SXxPT1EkSVY8PEpUPDxKVE8zVVEkSVdPPDxKVE9PUSRJVicjRmwnI0ZsTyM8dFEkSVpPNysmXk9PUSRJVjw8SX08PEl9TyM+bVEkSVpPPDxJfU9PUSRJVjFHMXUxRzF1Ty98USRJV08xRzF1TzNVUSRJV088PEl9Ty98USRJV08xRzF2UC9nUSRJV08nI0ZwTyNBeFEkSVdPNysofU8jQlZRJElXTzcrKH1PT1EkSVMnI0V6JyNFek8vZ1EkSVdPLDU9eU8jQl9RJElXTyw1PXlPT1EkSVMsNT15LDU9eU8jQmpRJElXTyw1PXhPI0J7USRJV08sNT14T09RJElTMUcxUDFHMVBPT1EkSVMsNTtnLDU7Z1AjQ1RRJElXTycjRlhPI0NlUSRJV08xRzFgTyNDeFEkSVdPMUcxYE8jRFlRJElXTzFHMWBQI0RlUSRJV08nI0ZZTyNEclEkSVdPNysoYU8jRVNRJElXTzcrKGFPI0VTUSRJV083KyhhTyNFW1EkSVdPNysoYU8jRWxRJElXTzcrKFhPNnxRJElXTzcrKFhPT1EkSVNBTj5UQU4+VE8jRlZRJElXTzw8S3hPT1EkSVNBTj5hQU4+YU8vZ1EkSVdPMUcxXk8jRmdRJElbTzFHMV5QI0ZxUSRJV08nI0ZXT09RJElTMUcxZDFHMWRQI0dPUSRJV08nI0ZeTyNHXVEkSVdPNysobE9PT08tRTldLUU5XU8jR3NRJElXTzcrJ3FPT1EkSVNBTj9WQU4/Vk8jSF5RJElXTyw1PFRPI0hyUSRJV08xRzNfT09RJElTLUU5Zy1FOWdPI0lUUSRJV08xRzNfT09RJElTQU4/WEFOP1hPI0lmUSRJV09BTj9YT09RJElWQU4/Y0FOP2NPT1EkSVYxRzFzMUcxc08zVVEkSVdPQU4/aE8jSWtRJElaT0FOP2hPT1EkSVZBTj9vQU4/b09PUSRJVi1FOWotRTlqT09RJElWPDxJeDw8SXhPM1VRJElXT0FOP2lPM1VRJElXTzcrJ2FPT1EkSVZBTj9pQU4/aU9PUSRJUzcrJ2I3KydiTyNMdlEkSVdPPDxMaU9PUSRJUzFHM2UxRzNlTy9nUSRJV08xRzNlT09RJElTLDU8XSw1PF1PI01UUSRJV08xRzNkT09RJElTLUU5by1FOW9PI01mUSRJV083KyZ6TyNNdlEkSVdPNysmek9PUSRJUzcrJno3KyZ6TyNOUlEkSVdPPDxLe08jTmNRJElXTzw8S3tPI05jUSRJV088PEt7TyNOa1EkSVdPJyNHaU9PUSRJUzw8S3M8PEtzTyNOdVEkSVdPPDxLc09PUSRJUzcrJng3KyZ4Ty98USRJV08xRzFvUC98USRJV08nI0ZpTyQgYFEkSVdPNysoeU8kIHFRJElXTzcrKHlPT1EkSVNHMjRzRzI0c09PUSRJVkcyNVNHMjVTTzNVUSRJV09HMjVTT09RJElWRzI1VEcyNVRPT1EkSVY8PEp7PDxKe09PUSRJUzcrKVA3KylQUCQhU1EkSVdPJyNGcU9PUSRJUzw8SmY8PEpmTyQhYlEkSVdPPDxKZk8kIXJRJElXT0FOQWdPJCNTUSRJV09BTkFnTyQjW1EkSVdPJyNHak9PUSRJUycjR2onI0dqTzBoUSRJV08nI0RhTyQjdVEkSVdPLDU9VE9PUSRJU0FOQV9BTkFfT09RJElTNysnWjcrJ1pPJCReUSRJV088PExlT09RJElWTEQqbkxEKm5PT1EkSVNBTkBRQU5AUU8kJG9RJElXT0cyN1JPJCVQUSRJV08sNTl7T09RJElTMUcybzFHMm9PI05rUSRJV08xRy9nT09RJElTNyslUjcrJVJPNnxRJElXTycjQ3pPNnxRJElXTyw1OV9PNnxRJElXTyw1OV9PNnxRJElXTyw1OV9PJCVVUSRJW08sNTxrTzZ8USRJV08xRy55Ty9nUSRJV08xRy9VTy9nUSRJV083KyRtUCQlaVEkSVdPJyNGZE8nUlEkSVdPJyNHUE8kJXZRJElXTyw1OV9PJCV7USRJV08sNTlfTyQmU1EkSVdPLDU5ak8kJlhRJElXTzFHL1JPMGhRJElXTycjRE9PNnxRJElXTyw1OWdcIixcbiAgc3RhdGVEYXRhOiBcIiQmb35PJG9PUyRsT1Mka09TUU9Tfk9QaE9UZU9kc09mWE9sdE9wIVNPc3VPfHZPfSFQTyFSIVZPIVMhVU8hVllPIVpaTyFmZE8hbWRPIW5kTyFvZE8hdnhPIXh5TyF6ek8hfHtPI098TyNTfU8jVSFPTyNYIVFPI1khUU8jWyFSTyNjIVRPI2YhV08jaiFYTyNsIVlPI3EhWk8jdGxPJGpxTyR6UU8ke1FPJVBSTyVRVk8lZVtPJWZdTyVpXk8lbF9PJXJgTyV1YU8ld2JPfk9UIWFPXSFhT18hYk9mIWlPIVYha08hZCFsTyR1IVtPJHYhXU8kdyFeTyR4IV9PJHkhX08keiFgTyR7IWBPJHwhYU8kfSFhTyVPIWFPfk9oJVRYaSVUWGolVFhrJVRYbCVUWG0lVFhwJVRYdyVUWHglVFghcyVUWCNeJVRYJGolVFgkbSVUWCVWJVRYIU8lVFghUiVUWCFTJVRYJVclVFghVyVUWCFbJVRYfSVUWCNWJVRYcSVUWCFqJVRYflAkX09kc09mWE8hVllPIVpaTyFmZE8hbWRPIW5kTyFvZE8kelFPJHtRTyVQUk8lUVZPJWVbTyVmXU8laV5PJWxfTyVyYE8ldWFPJXdiT35PdyVTWHglU1gjXiVTWCRqJVNYJG0lU1glViVTWH5PaCFvT2khcE9qIW5PayFuT2whcU9tIXJPcCFzTyFzJVNYflAoYE9UIXlPbC1mT3MtdE98dk9+UCdST1QhfE9sLWZPcy10TyFXIX1PflAnUk9UI1FPXyNST2wtZk9zLXRPIVsjU09+UCdSTyVnI1ZPJWgjWE9+TyVqI1lPJWsjWE9+TyFaI1tPJW0jXU8lcSNfT35PIVojW08lcyNgTyV0I19Pfk8hWiNbTyVoI19PJXYjYk9+TyFaI1tPJWsjX08leCNkT35PVCR0WF0kdFhfJHRYZiR0WGgkdFhpJHRYaiR0WGskdFhsJHRYbSR0WHAkdFh3JHRYIVYkdFghZCR0WCR1JHRYJHYkdFgkdyR0WCR4JHRYJHkkdFgkeiR0WCR7JHRYJHwkdFgkfSR0WCVPJHRYIU8kdFghUiR0WCFTJHRYfk8lZVtPJWZdTyVpXk8lbF9PJXJgTyV1YU8ld2JPeCR0WCFzJHRYI14kdFgkaiR0WCRtJHRYJVYkdFglVyR0WCFXJHRYIVskdFh9JHRYI1YkdFhxJHRYIWokdFh+UCt1T3cjaU94JHNYIXMkc1gjXiRzWCRqJHNYJG0kc1glViRzWH5PbC1mT3MtdE9+UCdSTyNeI2xPJGojbk8kbSNuT35PJVFWT35PIVIjc08jbCFZTyNxIVpPI3RsT35PbHRPflAnUk9UI3hPXyN5TyVRVk94dFB+T1QjfU9sLWZPcy10T30kT09+UCdST3gkUU8hcyRWTyVWJFJPI14hdFgkaiF0WCRtIXRYfk9UI31PbC1mT3MtdE8jXiF9WCRqIX1YJG0hfVh+UCdST2wtZk9zLXRPI14jUlgkaiNSWCRtI1JYflAnUk8hZCRdTyFtJF1PJVFWT35PVCRnT35QJ1JPIVMkaU8jaiRqTyNsJGtPfk94JGxPfk9UJHpPXyR6T2wtZk9zLXRPIU8kfE9+UCdST2wtZk9zLXRPeCVQT35QJ1JPJWQlUk9+T18hYk9mIWlPIVYha08hZCFsT1RgYV1gYWhgYWlgYWpgYWtgYWxgYW1gYXBgYXdgYXhgYSFzYGEjXmBhJGpgYSRtYGEkdWBhJHZgYSR3YGEkeGBhJHlgYSR6YGEke2BhJHxgYSR9YGElT2BhJVZgYSFPYGEhUmBhIVNgYSVXYGEhV2BhIVtgYX1gYSNWYGFxYGEhamBhfk9rJVdPfk9sJVdPflAnUk9sLWZPflAnUk9oLWhPaS1pT2otZ09rLWdPbC1wT20tcU9wLXVPIU8lU1ghUiVTWCFTJVNYJVclU1ghVyVTWCFbJVNYfSVTWCNWJVNYIWolU1h+UChgTyVXJVlPdyVSWCFPJVJYIVIlUlghUyVSWCFXJVJYeCVSWH5PdyVdTyFPJVtPIVIlYU8hUyVgT35PIU8lW09+T3clZE8hUiVhTyFTJWBPIVclX1h+TyFXJWhPfk93JWlPeCVrTyFSJWFPIVMlYE8hWyVZWH5PIVslb09+TyFbJXBPfk8lZyNWTyVoJXJPfk8laiNZTyVrJXJPfk9UJXVPbC1mT3MtdE98dk9+UCdSTyFaI1tPJW0jXU8lcSV4T35PIVojW08lcyNgTyV0JXhPfk8hWiNbTyVoJXhPJXYjYk9+TyFaI1tPJWsleE8leCNkT35PVCFsYV0hbGFfIWxhZiFsYWghbGFpIWxhaiFsYWshbGFsIWxhbSFsYXAhbGF3IWxheCFsYSFWIWxhIWQhbGEhcyFsYSNeIWxhJGohbGEkbSFsYSR1IWxhJHYhbGEkdyFsYSR4IWxhJHkhbGEkeiFsYSR7IWxhJHwhbGEkfSFsYSVPIWxhJVYhbGEhTyFsYSFSIWxhIVMhbGElVyFsYSFXIWxhIVshbGF9IWxhI1YhbGFxIWxhIWohbGF+UCN2T3clfU94JHNhIXMkc2EjXiRzYSRqJHNhJG0kc2ElViRzYX5QJF9PVCZQT2x0T3N1T3gkc2EhcyRzYSNeJHNhJGokc2EkbSRzYSVWJHNhflAnUk93JX1PeCRzYSFzJHNhI14kc2EkaiRzYSRtJHNhJVYkc2F+T1BoT1RlT2x0T3N1T3x2T30hUE8hdnhPIXh5TyF6ek8hfHtPI098TyNTfU8jVSFPTyNYIVFPI1khUU8jWyFSTyNeJF9YJGokX1gkbSRfWH5QJ1JPI14jbE8kaiZVTyRtJlVPfk8hZCZWT2YlelgkaiV6WCNWJXpYI14lelgkbSV6WCNVJXpYfk9mIWlPJGomWE9+T2hjYWljYWpjYWtjYWxjYW1jYXBjYXdjYXhjYSFzY2EjXmNhJGpjYSRtY2ElVmNhIU9jYSFSY2EhU2NhJVdjYSFXY2EhW2NhfWNhI1ZjYXFjYSFqY2F+UCRfT3BuYXduYXhuYSNebmEkam5hJG1uYSVWbmF+T2ghb09pIXBPaiFuT2shbk9sIXFPbSFyTyFzbmF+UERUTyVWJlpPdyVVWHglVVh+TyVRVk93JVVYeCVVWH5PdyZeT3h0WH5PeCZgT35PdyVpTyNeJVlYJGolWVgkbSVZWCFPJVlYeCVZWCFbJVlYIWolWVglViVZWH5PVC1vT2wtZk9zLXRPfHZPflAnUk8lViRSTyNeU2EkalNhJG1TYX5PJVYkUk9+T3cmaU8jXiVbWCRqJVtYJG0lW1hrJVtYflAkX093JmxPfSZrTyNeI1JhJGojUmEkbSNSYX5PI1YmbU8jXiNUYSRqI1RhJG0jVGF+TyFkJF1PIW0kXU8jVSZvTyVRVk9+TyNVJm9Pfk93JnFPI14lfFgkaiV8WCRtJXxYfk93JnNPI14leVgkaiV5WCRtJXlYeCV5WH5PdyZ3T2smT1h+UCRfT2smek9+T1BoT1RlT2x0T3N1T3x2T30hUE8hdnhPIXh5TyF6ek8hfHtPI098TyNTfU8jVSFPTyNYIVFPI1khUU8jWyFSTyRqJ1BPflAnUk9xJ1RPI2cnUk8jaCdTT1AjZWFUI2VhZCNlYWYjZWFsI2VhcCNlYXMjZWF8I2VhfSNlYSFSI2VhIVMjZWEhViNlYSFaI2VhIWYjZWEhbSNlYSFuI2VhIW8jZWEhdiNlYSF4I2VhIXojZWEhfCNlYSNPI2VhI1MjZWEjVSNlYSNYI2VhI1kjZWEjWyNlYSNjI2VhI2YjZWEjaiNlYSNsI2VhI3EjZWEjdCNlYSRnI2VhJGojZWEkeiNlYSR7I2VhJVAjZWElUSNlYSVlI2VhJWYjZWElaSNlYSVsI2VhJXIjZWEldSNlYSV3I2VhJGkjZWEkbSNlYX5PdydVTyNWJ1dPeCZQWH5PZidZT35PZiFpT3gkbE9+T1QhYU9dIWFPXyFiT2YhaU8hViFrTyFkIWxPJHchXk8keCFfTyR5IV9PJHohYE8keyFgTyR8IWFPJH0hYU8lTyFhT2hVaWlVaWpVaWtVaWxVaW1VaXBVaXdVaXhVaSFzVWkjXlVpJGpVaSRtVWkkdVVpJVZVaSFPVWkhUlVpIVNVaSVXVWkhV1VpIVtVaX1VaSNWVWlxVWkhalVpfk8kdiFdT35QTnlPJHZVaX5QTnlPVCFhT10hYU9fIWJPZiFpTyFWIWtPIWQhbE8keiFgTyR7IWBPJHwhYU8kfSFhTyVPIWFPaFVpaVVpalVpa1VpbFVpbVVpcFVpd1VpeFVpIXNVaSNeVWkkalVpJG1VaSR1VWkkdlVpJHdVaSVWVWkhT1VpIVJVaSFTVWklV1VpIVdVaSFbVWl9VWkjVlVpcVVpIWpVaX5PJHghX08keSFfT35QISN0TyR4VWkkeVVpflAhI3RPXyFiT2YhaU8hViFrTyFkIWxPaFVpaVVpalVpa1VpbFVpbVVpcFVpd1VpeFVpIXNVaSNeVWkkalVpJG1VaSR1VWkkdlVpJHdVaSR4VWkkeVVpJHpVaSR7VWklVlVpIU9VaSFSVWkhU1VpJVdVaSFXVWkhW1VpfVVpI1ZVaXFVaSFqVWl+T1QhYU9dIWFPJHwhYU8kfSFhTyVPIWFPflAhJnJPVFVpXVVpJHxVaSR9VWklT1VpflAhJnJPIVIlYU8hUyVgT3clYlghTyViWH5PJVYnX08lVydfT35QK3VPdydhTyFPJWFYfk8hTydjT35PdydkT3gnZk8hVyVjWH5PbC1mT3MtdE93J2RPeCdnTyFXJWNYflAnUk8hVydpT35PaiFuT2shbk9sIXFPbSFyT2hnaXBnaXdnaXhnaSFzZ2kjXmdpJGpnaSRtZ2klVmdpfk9pIXBPflAhK2VPaWdpflAhK2VPaC1oT2ktaU9qLWdPay1nT2wtcE9tLXFPfk9xJ2tPflAhLG5PVCdwT2wtZk9zLXRPIU8ncU9+UCdST3cnck8hTydxT35PIU8ndE9+TyFTJ3ZPfk93J3JPIU8nd08hUiVhTyFTJWBPflAkX09oLWhPaS1pT2otZ09rLWdPbC1wT20tcU8hT25hIVJuYSFTbmElV25hIVduYSFbbmF9bmEjVm5hcW5hIWpuYX5QRFRPVCdwT2wtZk9zLXRPIVclX2F+UCdST3cnek8hVyVfYX5PIVcne09+T3cnek8hUiVhTyFTJWBPIVclX2F+UCRfT1QoUE9sLWZPcy10TyFbJVlhI14lWWEkaiVZYSRtJVlhIU8lWWF4JVlhIWolWWElViVZYX5QJ1JPdyhRTyFbJVlhI14lWWEkaiVZYSRtJVlhIU8lWWF4JVlhIWolWWElViVZYX5PIVsoVE9+T3coUU8hUiVhTyFTJWBPIVslWWF+UCRfT3coV08hUiVhTyFTJWBPIVslYGF+UCRfT3coWk94JW5YIVslblghaiVuWH5PeCheTyFbKGBPIWooYU9+T1QmUE9sdE9zdU94JHNpIXMkc2kjXiRzaSRqJHNpJG0kc2klViRzaX5QJ1JPdyhiT3gkc2khcyRzaSNeJHNpJGokc2kkbSRzaSVWJHNpfk8hZCZWT2YlemEkaiV6YSNWJXphI14lemEkbSV6YSNVJXphfk8kaihnT35PVCN4T18jeU8lUVZPfk93Jl5PeHRhfk9sdE9zdU9+UCdST3coUU8jXiVZYSRqJVlhJG0lWWEhTyVZYXglWWEhWyVZYSFqJVlhJVYlWWF+UCRfT3cobE8jXiRzWCRqJHNYJG0kc1glViRzWH5PJVYkUk8jXlNpJGpTaSRtU2l+TyNeJVthJGolW2EkbSVbYWslW2F+UCdST3cob08jXiVbYSRqJVthJG0lW2FrJVthfk9UKHNPZih1TyVRVk9+TyNVKHZPfk8lUVZPI14lfGEkaiV8YSRtJXxhfk93KHhPI14lfGEkaiV8YSRtJXxhfk9sLWZPcy10TyNeJXlhJGoleWEkbSV5YXgleWF+UCdST3coe08jXiV5YSRqJXlhJG0leWF4JXlhfk9xKVBPI2EpT09QI19pVCNfaWQjX2lmI19pbCNfaXAjX2lzI19pfCNfaX0jX2khUiNfaSFTI19pIVYjX2khWiNfaSFmI19pIW0jX2khbiNfaSFvI19pIXYjX2kheCNfaSF6I19pIXwjX2kjTyNfaSNTI19pI1UjX2kjWCNfaSNZI19pI1sjX2kjYyNfaSNmI19pI2ojX2kjbCNfaSNxI19pI3QjX2kkZyNfaSRqI19pJHojX2kkeyNfaSVQI19pJVEjX2klZSNfaSVmI19pJWkjX2klbCNfaSVyI19pJXUjX2kldyNfaSRpI19pJG0jX2l+T3EpUU9QI2JpVCNiaWQjYmlmI2JpbCNiaXAjYmlzI2JpfCNiaX0jYmkhUiNiaSFTI2JpIVYjYmkhWiNiaSFmI2JpIW0jYmkhbiNiaSFvI2JpIXYjYmkheCNiaSF6I2JpIXwjYmkjTyNiaSNTI2JpI1UjYmkjWCNiaSNZI2JpI1sjYmkjYyNiaSNmI2JpI2ojYmkjbCNiaSNxI2JpI3QjYmkkZyNiaSRqI2JpJHojYmkkeyNiaSVQI2JpJVEjYmklZSNiaSVmI2JpJWkjYmklbCNiaSVyI2JpJXUjYmkldyNiaSRpI2JpJG0jYml+T1QpU09rJk9hflAnUk93KVRPayZPYX5PdylUT2smT2F+UCRfT2spWE9+TyRoKVtPfk9xKV9PI2cnUk8jaCleT1AjZWlUI2VpZCNlaWYjZWlsI2VpcCNlaXMjZWl8I2VpfSNlaSFSI2VpIVMjZWkhViNlaSFaI2VpIWYjZWkhbSNlaSFuI2VpIW8jZWkhdiNlaSF4I2VpIXojZWkhfCNlaSNPI2VpI1MjZWkjVSNlaSNYI2VpI1kjZWkjWyNlaSNjI2VpI2YjZWkjaiNlaSNsI2VpI3EjZWkjdCNlaSRnI2VpJGojZWkkeiNlaSR7I2VpJVAjZWklUSNlaSVlI2VpJWYjZWklaSNlaSVsI2VpJXIjZWkldSNlaSV3I2VpJGkjZWkkbSNlaX5PbC1mT3MtdE94JGxPflAnUk9sLWZPcy10T3gmUGF+UCdST3cpZU94JlBhfk9UKWlPXylqTyFPKW1PJHwpa08lUVZPfk94JGxPJlMpb09+T1Qkek9fJHpPbC1mT3MtdE8hTyVhYX5QJ1JPdyl1TyFPJWFhfk9sLWZPcy10T3gpeE8hVyVjYX5QJ1JPdyl5TyFXJWNhfk9sLWZPcy10T3cpeU94KXxPIVclY2F+UCdST2wtZk9zLXRPdyl5TyFXJWNhflAnUk93KXlPeCl8TyFXJWNhfk9qLWdPay1nT2wtcE9tLXFPaGdpcGdpd2dpIU9naSFSZ2khU2dpJVdnaSFXZ2l4Z2khW2dpI15naSRqZ2kkbWdpfWdpI1ZnaXFnaSFqZ2klVmdpfk9pLWlPflAhR21PaWdpflAhR21PVCdwT2wtZk9zLXRPIU8qUk9+UCdST2sqVE9+T3cqVk8hTypST35PIU8qV09+T1QncE9sLWZPcy10TyFXJV9pflAnUk93KlhPIVclX2l+TyFXKllPfk9UKFBPbC1mT3MtdE8hWyVZaSNeJVlpJGolWWkkbSVZaSFPJVlpeCVZaSFqJVlpJVYlWWl+UCdST3cqXU8hUiVhTyFTJWBPIVslYGl+T3cqYE8hWyVZaSNeJVlpJGolWWkkbSVZaSFPJVlpeCVZaSFqJVlpJVYlWWl+TyFbKmFPfk9fKmNPbC1mT3MtdE8hWyVgaX5QJ1JPdypdTyFbJWBpfk8hWyplT35PVCpnT2wtZk9zLXRPeCVuYSFbJW5hIWolbmF+UCdST3cqaE94JW5hIVslbmEhaiVuYX5PIVojW08lcCprTyFbIWtYfk8hWyptT35PeCheTyFbKm5Pfk9UJlBPbHRPc3VPeCRzcSFzJHNxI14kc3EkaiRzcSRtJHNxJVYkc3F+UCdST3ckV2l4JFdpIXMkV2kjXiRXaSRqJFdpJG0kV2klViRXaX5QJF9PVCZQT2x0T3N1T35QJ1JPVCZQT2wtZk9zLXRPI14kc2EkaiRzYSRtJHNhJVYkc2F+UCdST3cqb08jXiRzYSRqJHNhJG0kc2ElViRzYX5PdyN5YSNeI3lhJGojeWEkbSN5YWsjeWF+UCRfTyNeJVtpJGolW2kkbSVbaWslW2l+UCdST3cqck8jXiNScSRqI1JxJG0jUnF+T3cqc08jVip1TyNeJXtYJGole1gkbSV7WCFPJXtYfk9UKndPZip4TyVRVk9+TyVRVk8jXiV8aSRqJXxpJG0lfGl+T2wtZk9zLXRPI14leWkkaiV5aSRtJXlpeCV5aX5QJ1JPcSp8TyNhKU9PUCNfcVQjX3FkI19xZiNfcWwjX3FwI19xcyNfcXwjX3F9I19xIVIjX3EhUyNfcSFWI19xIVojX3EhZiNfcSFtI19xIW4jX3EhbyNfcSF2I19xIXgjX3EheiNfcSF8I19xI08jX3EjUyNfcSNVI19xI1gjX3EjWSNfcSNbI19xI2MjX3EjZiNfcSNqI19xI2wjX3EjcSNfcSN0I19xJGcjX3EkaiNfcSR6I19xJHsjX3ElUCNfcSVRI19xJWUjX3ElZiNfcSVpI19xJWwjX3ElciNfcSV1I19xJXcjX3EkaSNfcSRtI19xfk9rJGJhdyRiYX5QJF9PVClTT2smT2l+UCdST3crVE9rJk9pfk9QaE9UZU9sdE9wIVNPc3VPfHZPfSFQTyFSIVZPIVMhVU8hdnhPIXh5TyF6ek8hfHtPI098TyNTfU8jVSFPTyNYIVFPI1khUU8jWyFSTyNjIVRPI2YhV08jaiFYTyNsIVlPI3EhWk8jdGxPflAnUk93K19PeCRsTyNWK19Pfk8jaCtgT1AjZXFUI2VxZCNlcWYjZXFsI2VxcCNlcXMjZXF8I2VxfSNlcSFSI2VxIVMjZXEhViNlcSFaI2VxIWYjZXEhbSNlcSFuI2VxIW8jZXEhdiNlcSF4I2VxIXojZXEhfCNlcSNPI2VxI1MjZXEjVSNlcSNYI2VxI1kjZXEjWyNlcSNjI2VxI2YjZXEjaiNlcSNsI2VxI3EjZXEjdCNlcSRnI2VxJGojZXEkeiNlcSR7I2VxJVAjZXElUSNlcSVlI2VxJWYjZXElaSNlcSVsI2VxJXIjZXEldSNlcSV3I2VxJGkjZXEkbSNlcX5PI1YrYU93JGRheCRkYX5PbC1mT3MtdE94JlBpflAnUk93K2NPeCZQaX5PeCRRTyVWK2VPdyZSWCFPJlJYfk8lUVZPdyZSWCFPJlJYfk93K2lPIU8mUVh+TyFPK2tPfk9UJHpPXyR6T2wtZk9zLXRPIU8lYWl+UCdST3grbk93I3xhIVcjfGF+T2wtZk9zLXRPeCtvT3cjfGEhVyN8YX5QJ1JPbC1mT3MtdE94KXhPIVclY2l+UCdST3crck8hVyVjaX5PbC1mT3MtdE93K3JPIVclY2l+UCdST3crck94K3VPIVclY2l+T3cjeGkhTyN4aSFXI3hpflAkX09UJ3BPbC1mT3MtdE9+UCdST2srd09+T1QncE9sLWZPcy10TyFPK3hPflAnUk9UJ3BPbC1mT3MtdE8hVyVfcX5QJ1JPdyN3aSFbI3dpI14jd2kkaiN3aSRtI3dpIU8jd2l4I3dpIWojd2klViN3aX5QJF9PVChQT2wtZk9zLXRPflAnUk9fKmNPbC1mT3MtdE8hWyVgcX5QJ1JPdyt5TyFbJWBxfk8hWyt6T35PVChQT2wtZk9zLXRPIVslWXEjXiVZcSRqJVlxJG0lWXEhTyVZcXglWXEhaiVZcSVWJVlxflAnUk94K3tPfk9UKmdPbC1mT3MtdE94JW5pIVslbmkhaiVuaX5QJ1JPdyxRT3glbmkhWyVuaSFqJW5pfk8hWiNbTyVwKmtPIVsha2F+T1QmUE9sLWZPcy10TyNeJHNpJGokc2kkbSRzaSVWJHNpflAnUk93LFNPI14kc2kkaiRzaSRtJHNpJVYkc2l+TyVRVk8jXiV7YSRqJXthJG0le2EhTyV7YX5PdyxWTyNeJXthJGole2EkbSV7YSFPJXthfk8hTyxZT35PayRiaXckYml+UCRfT1QpU09+UCdST1QpU09rJk9xflAnUk9xLF5PUCNkeVQjZHlkI2R5ZiNkeWwjZHlwI2R5cyNkeXwjZHl9I2R5IVIjZHkhUyNkeSFWI2R5IVojZHkhZiNkeSFtI2R5IW4jZHkhbyNkeSF2I2R5IXgjZHkheiNkeSF8I2R5I08jZHkjUyNkeSNVI2R5I1gjZHkjWSNkeSNbI2R5I2MjZHkjZiNkeSNqI2R5I2wjZHkjcSNkeSN0I2R5JGcjZHkkaiNkeSR6I2R5JHsjZHklUCNkeSVRI2R5JWUjZHklZiNkeSVpI2R5JWwjZHklciNkeSV1I2R5JXcjZHkkaSNkeSRtI2R5fk9QaE9UZU9sdE9wIVNPc3VPfHZPfSFQTyFSIVZPIVMhVU8hdnhPIXh5TyF6ek8hfHtPI098TyNTfU8jVSFPTyNYIVFPI1khUU8jWyFSTyNjIVRPI2YhV08jaiFYTyNsIVlPI3EhWk8jdGxPJGksYk8kbSxiT35QJ1JPI2gsY09QI2V5VCNleWQjZXlmI2V5bCNleXAjZXlzI2V5fCNleX0jZXkhUiNleSFTI2V5IVYjZXkhWiNleSFmI2V5IW0jZXkhbiNleSFvI2V5IXYjZXkheCNleSF6I2V5IXwjZXkjTyNleSNTI2V5I1UjZXkjWCNleSNZI2V5I1sjZXkjYyNleSNmI2V5I2ojZXkjbCNleSNxI2V5I3QjZXkkZyNleSRqI2V5JHojZXkkeyNleSVQI2V5JVEjZXklZSNleSVmI2V5JWkjZXklbCNleSVyI2V5JXUjZXkldyNleSRpI2V5JG0jZXl+T2wtZk9zLXRPeCZQcX5QJ1JPdyxnT3gmUHF+TyVWK2VPdyZSYSFPJlJhfk9UKWlPXylqTyR8KWtPJVFWTyFPJlFhfk93LGtPIU8mUWF+T1Qkek9fJHpPbC1mT3MtdE9+UCdST2wtZk9zLXRPeCxtT3cjfGkhVyN8aX5QJ1JPbC1mT3MtdE93I3xpIVcjfGl+UCdST3gsbU93I3xpIVcjfGl+T2wtZk9zLXRPeCl4T35QJ1JPbC1mT3MtdE94KXhPIVclY3F+UCdST3cscE8hVyVjcX5PbC1mT3MtdE93LHBPIVclY3F+UCdST3Asc08hUiVhTyFTJWBPIU8lWnEhVyVacSFbJVpxdyVacX5QISxuT18qY09sLWZPcy10TyFbJWB5flAnUk93I3ppIVsjeml+UCRfT18qY09sLWZPcy10T35QJ1JPVCpnT2wtZk9zLXRPflAnUk9UKmdPbC1mT3MtdE94JW5xIVslbnEhaiVucX5QJ1JPVCZQT2wtZk9zLXRPI14kc3EkaiRzcSRtJHNxJVYkc3F+UCdSTyNWLHdPdyRdYSNeJF1hJGokXWEkbSRdYSFPJF1hfk8lUVZPI14le2kkaiV7aSRtJXtpIU8le2l+T3cseU8jXiV7aSRqJXtpJG0le2khTyV7aX5PIU8se09+T3EsfU9QI2QhUlQjZCFSZCNkIVJmI2QhUmwjZCFScCNkIVJzI2QhUnwjZCFSfSNkIVIhUiNkIVIhUyNkIVIhViNkIVIhWiNkIVIhZiNkIVIhbSNkIVIhbiNkIVIhbyNkIVIhdiNkIVIheCNkIVIheiNkIVIhfCNkIVIjTyNkIVIjUyNkIVIjVSNkIVIjWCNkIVIjWSNkIVIjWyNkIVIjYyNkIVIjZiNkIVIjaiNkIVIjbCNkIVIjcSNkIVIjdCNkIVIkZyNkIVIkaiNkIVIkeiNkIVIkeyNkIVIlUCNkIVIlUSNkIVIlZSNkIVIlZiNkIVIlaSNkIVIlbCNkIVIlciNkIVIldSNkIVIldyNkIVIkaSNkIVIkbSNkIVJ+T2wtZk9zLXRPeCZQeX5QJ1JPVClpT18pak8kfClrTyVRVk8hTyZRaX5PbC1mT3MtdE93I3xxIVcjfHF+UCdST3gtVE93I3xxIVcjfHF+T2wtZk9zLXRPeCl4TyFXJWN5flAnUk93LVVPIVclY3l+T2wtZk9zLVlPflAnUk9wLHNPIVIlYU8hUyVgTyFPJVp5IVclWnkhWyVaeXclWnl+UCEsbk8lUVZPI14le3EkaiV7cSRtJXtxIU8le3F+T3ctXk8jXiV7cSRqJXtxJG0le3EhTyV7cX5PVClpT18pak8kfClrTyVRVk9+T2wtZk9zLXRPdyN8eSFXI3x5flAnUk9sLWZPcy10T3gpeE8hVyVjIVJ+UCdST3ctYU8hVyVjIVJ+T3AlXlghTyVeWCFSJV5YIVMlXlghVyVeWCFbJV5YdyVeWH5QISxuT3Asc08hUiVhTyFTJWBPIU8lXWEhVyVdYSFbJV1hdyVdYX5PJVFWTyNeJXt5JGole3kkbSV7eSFPJXt5fk9sLWZPcy10T3gpeE8hVyVjIVp+UCdST3gtZE9+T3cqb08jXiRzYSRqJHNhJG0kc2ElViRzYX5QJF9PVCZQT2wtZk9zLXRPflAnUk9rLWtPfk9sLWtPflAnUk94LWxPfk9xLW1PflAhLG5PJWYlaSV1JXclZSFaJW0lcyV2JXglbCVyJWwlUX5cIixcbiAgZ290bzogXCIhLHUmU1BQUFAmVFAmXSluKlQqaytTK2wsVlAscVAmXS1fLV8mXVAmXVAwcFBQUFBQUDBwM2BQUDNgUDVsNXU6eVBQOnw7WztfUFBQJl0mXVBQO2smXVBQJl0mXVBQJl0mXSZdJl07bzxjJl1QPGZQPGk8aUBPUEBkJl1QUFBAaEBuJlRQJlQmVFAmVFAmVFAmVFAmVFAmVCZUJlRQJlRQUCZUUFAmVFBAdFBAe0FSUEB7UEB7QHtQUFBAe1BCelBDVENaQ2FCelBAe0NnUENuQ3RDekRXRGpEcER6RVFFbkV0RXpGUUZbRmJGaEZuRnRGekdeR2hHbkd0R3pIVUhbSGJIaEhuSHhJT0lZSWBQUFBQUFBQUFBJaUlxSXpKVUphUFBQUFBQUFBQUFBQTnYhIGAhJW4hKHpQUCEpUyEpYiEpayEqYSEqVyEqaiEqcCEqcyEqdiEqeSErUlBQUFBQUFBQUFAhK1UhK1hQUFBQUFBQUFAhK18hK2shK3chLFQhLFchLF4hLGQhLGohLG1daU9yI2wkbClbK1onb2RPU1hZWmVocnN0dnh8fSFSIVMhVCFVIVghYyFkIWUhZiFnIWghaSFrIW4hbyFwIXIhcyF5IXwjUSNSI1sjaSNsI30kTyRRJFMkViRnJGkkaiRsJHolUCVXJVolXSVgJWQlaSVrJXUlfSZQJlsmYCZpJmsmbCZzJncmeidSJ1UnYCdhJ2QnZidnJ2sncCdyJ3YneihQKFEoVyhaKGIoZChsKG8oeylPKVMpVClYKVspZSlvKXUpeCl5KXwqUypUKlYqWCpbKl0qYCpjKmcqaCpvKnEqcip6K1MrVCtaK2IrYytmK20rbitvK3Ercit1K3creSt7K30sUCxRLFMsZyxpLG0scCxzLVQtVS1hLWQtZi1nLWgtaS1rLWwtbS1uLW8tcS11dyFjUCNoI3UkVyRmJWIlZyVtJW4mYSZ5KGMobilSKlEqWitSK3wtankhZFAjaCN1JFckZiRyJWIlZyVtJW4mYSZ5KGMobilSKlEqWitSK3wtanshZVAjaCN1JFckZiRyJHMlYiVnJW0lbiZhJnkoYyhuKVIqUSpaK1IrfC1qfSFmUCNoI3UkVyRmJHIkcyR0JWIlZyVtJW4mYSZ5KGMobilSKlEqWitSK3wtaiFQIWdQI2gjdSRXJGYkciRzJHQkdSViJWclbSVuJmEmeShjKG4pUipRKlorUit8LWohUiFoUCNoI3UkVyRmJHIkcyR0JHUkdiViJWclbSVuJmEmeShjKG4pUipRKlorUit8LWohViFoUCFtI2gjdSRXJGYkciRzJHQkdSR2JHclYiVnJW0lbiZhJnkoYyhuKVIqUSpaK1IrfC1qJ29TT1NYWVplaHJzdHZ4fH0hUiFTIVQhVSFYIWMhZCFlIWYhZyFoIWkhayFuIW8hcCFyIXMheSF8I1EjUiNbI2kjbCN9JE8kUSRTJFYkZyRpJGokbCR6JVAlVyVaJV0lYCVkJWklayV1JX0mUCZbJmAmaSZrJmwmcyZ3JnonUidVJ2AnYSdkJ2YnZydrJ3Ancid2J3ooUChRKFcoWihiKGQobChvKHspTylTKVQpWClbKWUpbyl1KXgpeSl8KlMqVCpWKlgqWypdKmAqYypnKmgqbypxKnIqeitTK1QrWitiK2MrZittK24rbytxK3IrdSt3K3kreyt9LFAsUSxTLGcsaSxtLHAscy1ULVUtYS1kLWYtZy1oLWktay1sLW0tbi1vLXEtdSZaVU9YWVpocnR2fH0hUiFTIVQhWCFpIWshbiFvIXAhciFzI1sjaSNsJE8kUSRTJFYkaiRsJHolUCVXJVolXSVkJWklayV1JX0mWyZgJmsmbCZzJnonUidVJ2AnYSdkJ2YnZydrJ3IneihRKFcoWihiKGQobCh7KU8pWClbKWUpbyl1KXgpeSl8KlMqVCpWKlgqWypdKmAqZypoKm8qcip6K1orYitjK2YrbStuK28rcStyK3Urdyt5K3srfSxQLFEsUyxnLGksbSxwLHMtVC1VLWEtZC1mLWctaC1pLWstbC1tLW4tcS11JWVXT1hZWmhydnx9IVIhUyFUIVghaSFrI1sjaSNsJE8kUSRTJFYkaiRsJHolUCVaJV0lZCVpJWsldSV9JlsmYCZrJmwmcyZ6J1InVSdgJ2EnZCdmJ2cnaydyJ3ooUShXKFooYihkKGwoeylPKVgpWyllKW8pdSl4KXkpfCpTKlYqWCpbKl0qYCpnKmgqbypyKnorWitiK2MrZittK24rbytxK3IrdSt5K3srfSxQLFEsUyxnLGksbSxwLVQtVS1hLWwtbS1uUSN7dVEtYi1ZUi1yLXQnZmRPU1hZWmVocnN0dnh8fSFSIVMhVCFVIVghYyFkIWUhZiFnIWghayFuIW8hcCFyIXMheSF8I1EjUiNbI2kjbCN9JE8kUSRTJFYkZyRpJGokbCR6JVAlVyVaJV0lYCVkJWklayV1JX0mUCZbJmAmaSZrJmwmcyZ3JnonUidVJ2AnZCdmJ2cnaydwJ3Indid6KFAoUShXKFooYihkKGwobyh7KU8pUylUKVgpWyllKW8peCl5KXwqUypUKlYqWCpbKl0qYCpjKmcqaCpvKnEqcip6K1MrVCtaK2IrYytmK24rbytxK3IrdSt3K3kreyt9LFAsUSxTLGcsaSxtLHAscy1ULVUtYS1kLWYtZy1oLWktay1sLW0tbi1vLXEtdVcjb2whTyFQJF5XI3d1Jl4tWS10USRgIVFRJHAhWVEkcSFaVyR5IWknYSl1K21TJl0jeCN5USZ9JGtRKGUmVlEocyZtVyh0Jm8odSh2KnhVKHcmcSh4KnlRKWcnV1cpaCdZK2ksay1SUytoKWkpalksVSpzLFYseCx5LV5RLFgqdVEsZCtfUSxmK2FSLV0sd1ImWyN3aSF2WFkhUyFUJV0lZCdyJ3opTypTKlYqWFIlWiF1USF6WFEldiNbUSZlJFNSJmgkVlQtWCxzLWQhVSFqUCFtI2gjdSRXJGYkciRzJHQkdSR2JHclYiVnJW0lbiZhJnkoYyhuKVIqUSpaK1IrfC1qUSZZI3BSJ10kcVInYCR5UiVTIWwnbmNPU1hZWmVocnN0dnh8fSFSIVMhVCFVIVghYyFkIWUhZiFnIWghaSFrIW4hbyFwIXIhcyF5IXwjUSNSI1sjaSNsI30kTyRRJFMkViRnJGkkaiRsJHolUCVXJVolXSVgJWQlaSVrJXUlfSZQJlsmYCZpJmsmbCZzJncmeidSJ1UnYCdhJ2QnZidnJ2sncCdyJ3YneihQKFEoVyhaKGIoZChsKG8oeylPKVMpVClYKVspZSlvKXUpeCl5KXwqUypUKlYqWCpbKl0qYCpjKmcqaCpvKnEqcip6K1MrVCtaK2IrYytmK20rbitvK3Ercit1K3creSt7K30sUCxRLFMsZyxpLG0scCxzLVQtVS1hLWQtZi1nLWgtaS1rLWwtbS1uLW8tcS11VCNmYyNnUyNdXyNeUyNgYCNhUyNiYSNjUyNkYiNlVCprKF4qbFQoXyV2KGFRJFV3UitnKWhYJFN3JFQkVSZnWmtPciRsKVsrWlhvT3IpWytaUSRtIVdRJnUkZFEmdiRlUSdYJG9RJ1skcVEpWSZ8USlgJ1JRKWInU1EpYydUUSlwJ1pRKXInXVEqfSlPUStQKVBRK1EpUVErVSlXUytXKVopcVErWyleUStdKV9RK14pYVEsWyp8USxdK09RLF8rVlEsYCtYUSxlK2BRLHwsXlEtTyxjUS1QLGRSLV8sfVdvT3IpWytaUiNyblEnWiRwUilaJn1RK2YpaFIsaStnUSlxJ1pSK1gpWlptT25yKVsrWlFyT1IjdHJRJl8jelIoaiZfUyVqI1AjfFMoUiVqKFVUKFUlbSZhUSVeIXhRJWUhe1cncyVeJWUneCd8USd4JWJSJ3wlZ1EmaiRXUihwJmpRKFglblEqXihTVCpkKFgqXlEnYiR7Uil2J2JTJ2UlTyVQWSl6J2UpeytzLHEtVlUpeydmJ2cnaFUrcyl8KX0qT1MscSt0K3VSLVYsclEjV11SJXEjV1EjWl5SJXMjWlEjXl9SJXcjXlEoWyV0UyppKFsqalIqaihdUSpsKF5SLFIqbFEjYWBSJXkjYVEjY2FSJXojY1EjZWJSJXsjZVEjZ2NSJXwjZ1EjamZRJk8jaFcmUiNqJk8obSpwUShtJmRSKnAtalEkVHdTJmYkVCZnUiZnJFVRJnQkYlIofCZ0USZXI29SKGYmV1EkXiFQUiZuJF5RKnQodFMsVyp0LHpSLHosWFEmciRgUih5JnJRI21qUiZUI21RK1opW1IsYStaUSh9JnVSKnsofVEmeCRmUylVJngpVlIpViZ5USdRJG1SKV0nUVEnViRuUylmJ1YrZFIrZClnUStqKWxSLGwralduT3IpWytaUiNxblNxT3JUK1kpWytaV3BPcilbK1pSJ08kbFlqT3IkbClbK1pSJlMjbFt3T3IjbCRsKVsrWlImZSRTJllQT1hZWmhydHZ8fSFSIVMhVCFYIWkhayFuIW8hcCFyIXMjWyNpI2wkTyRRJFMkViRqJGwkeiVQJVclWiVdJWQlaSVrJXUlfSZbJmAmayZsJnMmeidSJ1UnYCdhJ2QnZidnJ2sncid6KFEoVyhaKGIoZChsKHspTylYKVspZSlvKXUpeCl5KXwqUypUKlYqWCpbKl0qYCpnKmgqbypyKnorWitiK2MrZittK24rbytxK3IrdSt3K3kreyt9LFAsUSxTLGcsaSxtLHAscy1ULVUtYS1kLWYtZy1oLWktay1sLW0tbi1xLXVRIW1TUSNoZVEjdXNVJFd4JWAndlMkZiFVJGlRJHIhY1EkcyFkUSR0IWVRJHUhZlEkdiFnUSR3IWhRJWIheVElZyF8USVtI1FRJW4jUlEmYSN9USZ5JGdRKGMmUFUobiZpKG8qcVcpUiZ3KVQrUytUUSpRJ3BRKlooUFErUilTUSt8KmNSLWotb1EheFhRIXtZUSRkIVNRJGUhVF4nbyVdJWQncid6KlMqVipYUitPKU9bZk9yI2wkbClbK1poIXVYWSFTIVQlXSVkJ3IneilPKlMqVipYUSNQWlEja2hTI3x2fFEkWn1XJGIhUiRWJnopWFMkbiFYJGpXJHghaSdhKXUrbVElTyFrUSV0I1tgJlEjaSV9KGIoZChsKm8sUy1uUSZiJE9RJmMkUVEmZCRTUSdeJHpRJ2glUFEnbiVaVyhPJWkoUSpbKmBRKFMla1EoXSV1UShoJltTKGsmYC1sUShxJmtRKHImbFUoeiZzKHsqelEpYSdSWSlkJ1UpZStiK2MsZ1EpcydgXil3J2QpeStxK3IscC1VLWFRKX0nZlEqTydnUypQJ2stbVcqYihXKl0reSt9VypmKFoqaCxQLFFRK2wpb1ErcCl4USt0KXxRLE8qZ1EsVCpyUSxoK2ZRLG4rblEsbytvUSxyK3VRLHYre1EtUSxpUS1TLG1SLWAtVGhUT3IjaSNsJGwlfSZgJ2soYihkKVsrWiR6IXRYWVpodnx9IVIhUyFUIVghaSFrI1skTyRRJFMkViRqJHolUCVaJV0lZCVpJWsldSZbJmsmbCZzJnonUidVJ2AnYSdkJ2YnZydyJ3ooUShXKFoobCh7KU8pWCllKW8pdSl4KXkpfCpTKlYqWCpbKl0qYCpnKmgqbypyKnorYitjK2YrbStuK28rcStyK3UreSt7K30sUCxRLFMsZyxpLG0scC1ULVUtYS1sLW0tblEjdnRXJVQhbiFyLWctcVElVSFvUSVWIXBRJVghc1ElYy1mUydqJVcta1EnbC1oUSdtLWlRK3YqVFEsdSt3Uy1XLHMtZFItcy11VSN6dS1ZLXRSKGkmXltnT3IjbCRsKVsrWlghd1gjWyRTJFZRI1VaUSRQdlIkWXxRJV8heFElZiF7USVsI1BRJ14keFEneSViUSd9JWdRKFYlbVEoWSVuUSpfKFNRLHQrdlEtWyx1Ui1jLVpRJFh4USd1JWBSKlUndlEtWixzUi1lLWRSI09ZUiNUWlIkfSFpUSR7IWlWKXQnYSl1K21SJVEha1IldiNbUShgJXZSKm4oYVEkYyFSUSZoJFZRKVcmelIrVilYUSNwbFEkWyFPUSRfIVBSJnAkXlEocyZvUSp2KHVRKncodlIsWip4UiRhIVFYcE9yKVsrWlEkaCFVUiZ7JGlRJG8hWFImfCRqUiluJ1lRKWwnWVYsaitpLGstUlwiLFxuICBub2RlTmFtZXM6IFwi4pqgIHByaW50IENvbW1lbnQgU2NyaXB0IEFzc2lnblN0YXRlbWVudCAqIEJpbmFyeUV4cHJlc3Npb24gQml0T3AgQml0T3AgQml0T3AgQml0T3AgQXJpdGhPcCBBcml0aE9wIEAgQXJpdGhPcCAqKiBVbmFyeUV4cHJlc3Npb24gQXJpdGhPcCBCaXRPcCBBd2FpdEV4cHJlc3Npb24gYXdhaXQgUGFyZW50aGVzaXplZEV4cHJlc3Npb24gKCBCaW5hcnlFeHByZXNzaW9uIG9yIGFuZCBDb21wYXJlT3AgaW4gbm90IGlzIFVuYXJ5RXhwcmVzc2lvbiBDb25kaXRpb25hbEV4cHJlc3Npb24gaWYgZWxzZSBMYW1iZGFFeHByZXNzaW9uIGxhbWJkYSBQYXJhbUxpc3QgVmFyaWFibGVOYW1lIEFzc2lnbk9wICwgOiBOYW1lZEV4cHJlc3Npb24gQXNzaWduT3AgWWllbGRFeHByZXNzaW9uIHlpZWxkIGZyb20gKSBUdXBsZUV4cHJlc3Npb24gQ29tcHJlaGVuc2lvbkV4cHJlc3Npb24gYXN5bmMgZm9yIExhbWJkYUV4cHJlc3Npb24gQXJyYXlFeHByZXNzaW9uIFsgXSBBcnJheUNvbXByZWhlbnNpb25FeHByZXNzaW9uIERpY3Rpb25hcnlFeHByZXNzaW9uIHsgfSBEaWN0aW9uYXJ5Q29tcHJlaGVuc2lvbkV4cHJlc3Npb24gU2V0RXhwcmVzc2lvbiBTZXRDb21wcmVoZW5zaW9uRXhwcmVzc2lvbiBDYWxsRXhwcmVzc2lvbiBBcmdMaXN0IEFzc2lnbk9wIE1lbWJlckV4cHJlc3Npb24gLiBQcm9wZXJ0eU5hbWUgTnVtYmVyIFN0cmluZyBGb3JtYXRTdHJpbmcgRm9ybWF0UmVwbGFjZW1lbnQgRm9ybWF0Q29udmVyc2lvbiBGb3JtYXRTcGVjIENvbnRpbnVlZFN0cmluZyBFbGxpcHNpcyBOb25lIEJvb2xlYW4gVHlwZURlZiBBc3NpZ25PcCBVcGRhdGVTdGF0ZW1lbnQgVXBkYXRlT3AgRXhwcmVzc2lvblN0YXRlbWVudCBEZWxldGVTdGF0ZW1lbnQgZGVsIFBhc3NTdGF0ZW1lbnQgcGFzcyBCcmVha1N0YXRlbWVudCBicmVhayBDb250aW51ZVN0YXRlbWVudCBjb250aW51ZSBSZXR1cm5TdGF0ZW1lbnQgcmV0dXJuIFlpZWxkU3RhdGVtZW50IFByaW50U3RhdGVtZW50IFJhaXNlU3RhdGVtZW50IHJhaXNlIEltcG9ydFN0YXRlbWVudCBpbXBvcnQgYXMgU2NvcGVTdGF0ZW1lbnQgZ2xvYmFsIG5vbmxvY2FsIEFzc2VydFN0YXRlbWVudCBhc3NlcnQgU3RhdGVtZW50R3JvdXAgOyBJZlN0YXRlbWVudCBCb2R5IGVsaWYgV2hpbGVTdGF0ZW1lbnQgd2hpbGUgRm9yU3RhdGVtZW50IFRyeVN0YXRlbWVudCB0cnkgZXhjZXB0IGZpbmFsbHkgV2l0aFN0YXRlbWVudCB3aXRoIEZ1bmN0aW9uRGVmaW5pdGlvbiBkZWYgUGFyYW1MaXN0IEFzc2lnbk9wIFR5cGVEZWYgQ2xhc3NEZWZpbml0aW9uIGNsYXNzIERlY29yYXRlZFN0YXRlbWVudCBEZWNvcmF0b3IgQXRcIixcbiAgbWF4VGVybTogMjM0LFxuICBjb250ZXh0OiB0cmFja0luZGVudCxcbiAgbm9kZVByb3BzOiBbXG4gICAgW2xlemVyLk5vZGVQcm9wLmdyb3VwLCAtMTQsNCw4MCw4Miw4Myw4NSw4Nyw4OSw5MSw5Myw5NCw5NSw5NywxMDAsMTAzLFwiU3RhdGVtZW50IFN0YXRlbWVudFwiLC0yMiw2LDE2LDE5LDIxLDM3LDQ3LDQ4LDUyLDU1LDU2LDU5LDYwLDYxLDYyLDY1LDY4LDY5LDcwLDc0LDc1LDc2LDc3LFwiRXhwcmVzc2lvblwiLC05LDEwNSwxMDcsMTEwLDExMiwxMTMsMTE3LDExOSwxMjQsMTI2LFwiU3RhdGVtZW50XCJdXG4gIF0sXG4gIHNraXBwZWROb2RlczogWzAsMl0sXG4gIHJlcGVhdE5vZGVDb3VudDogMzIsXG4gIHRva2VuRGF0YTogXCImQWFNZ1IhXk9YJH1YWSEjeFlbJH1bXSEjeF1wJH1wcSEjeHFyISZTcnMhKXlzdCFDe3R1JH11diQrfXZ3JC5hd3gkL214eSRMZ3l6JE1tenskTnN7fCUjY3x9JSRvfSFPJSV1IU8hUCUoWyFQIVElM2IhUSFSJTZRIVIhWyU6UyFbIV0lRU8hXSFeJUdiIV4hXyVIaCFfIWAlS1chYCFhJUxkIWEhYiR9IWIhYyYgUCFjIWQmIV8hZCFlJiRQIWUhaCYhXyFoIWkmLlIhaSF0JiFfIXQhdSY3ZyF1IXcmIV8hdyF4JixhIXghfSYhXyF9I08mOXEjTyNQISViI1AjUSY6dyNRI1ImO30jUiNTJiFfI1MjVCR9I1QjVSYhXyNVI1YmJFAjViNZJiFfI1kjWiYuUiNaI2YmIV8jZiNnJjdnI2cjaSYhXyNpI2omLGEjaiNvJiFfI28jcCY9WiNwI3EmPlAjcSNyJj9dI3IjcyZAWiNzJGckfSRnfiYhXzxyJWBaJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH05WyZeWiVwN1slZ1MlbWAldiFiT3InUHJzQ3hzdydQd3goUHgjTydQI08jUD52I1AjbydQI28jcENVI3AjcSdQI3Ejcj9bI3J+J1A5WydeWiVwN1slZ1MlalclbWAldiFiT3InUHJzJlJzdydQd3goUHgjTydQI08jUD52I1AjbydQI28jcENVI3AjcSdQI3Ejcj9bI3J+J1A4eihXWiVwN1slaldPcih5cnMpd3N3KHl3eDtieCNPKHkjTyNQMlYjUCNvKHkjbyNwN24jcCNxKHkjcSNyMmsjcn4oeTh6KVVaJXA3WyVnUyVqVyV2IWJPcih5cnMpd3N3KHl3eChQeCNPKHkjTyNQMlYjUCNvKHkjbyNwN24jcCNxKHkjcSNyMmsjcn4oeTh6KlFaJXA3WyVnUyV2IWJPcih5cnMqc3N3KHl3eChQeCNPKHkjTyNQMlYjUCNvKHkjbyNwN24jcCNxKHkjcSNyMmsjcn4oeTh6KnxaJXA3WyVnUyV2IWJPcih5cnMrb3N3KHl3eChQeCNPKHkjTyNQMlYjUCNvKHkjbyNwN24jcCNxKHkjcSNyMmsjcn4oeThyK3hYJXA3WyVnUyV2IWJPdytvd3gsZXgjTytvI08jUC5WI1AjbytvI28jcDBeI3AjcStvI3Ejci5rI3J+K284cixqWCVwN1tPdytvd3gtVngjTytvI08jUC5WI1AjbytvI28jcDBeI3AjcStvI3Ejci5rI3J+K284ci1bWCVwN1tPdytvd3gtd3gjTytvI08jUC5WI1AjbytvI28jcDBeI3AjcStvI3Ejci5rI3J+K283Wy18UiVwN1tPI28tdyNwI3EtdyNyfi13OHIuW1QlcDdbTyNvK28jbyNwLmsjcCNxK28jcSNyLmsjcn4rbyFmLnJWJWdTJXYhYk93Lmt3eC9YeCNPLmsjTyNQMFcjUCNvLmsjbyNwMF4jcH4uayFmL1tWT3cua3d4L3F4I08uayNPI1AwVyNQI28uayNvI3AwXiNwfi5rIWYvdFVPdy5reCNPLmsjTyNQMFcjUCNvLmsjbyNwMF4jcH4uayFmMFpQT34uayFmMGNWJWdTT3cweHd4MV54I08weCNPI1AyUCNQI28weCNvI3AuayNwfjB4UzB9VCVnU093MHh3eDFeeCNPMHgjTyNQMlAjUH4weFMxYVRPdzB4d3gxcHgjTzB4I08jUDJQI1B+MHhTMXNTT3cweHgjTzB4I08jUDJQI1B+MHhTMlNQT34weDh6MltUJXA3W08jbyh5I28jcDJrI3AjcSh5I3EjcjJrI3J+KHkhbjJ0WCVnUyVqVyV2IWJPcjJrcnMzYXN3Mmt3eDR3eCNPMmsjTyNQN2gjUCNvMmsjbyNwN24jcH4yayFuM2hYJWdTJXYhYk9yMmtyczRUc3cya3d4NHd4I08yayNPI1A3aCNQI28yayNvI3A3biNwfjJrIW40W1glZ1MldiFiT3Iya3JzLmtzdzJrd3g0d3gjTzJrI08jUDdoI1AjbzJrI28jcDduI3B+MmshbjR8WCVqV09yMmtyczNhc3cya3d4NWl4I08yayNPI1A3aCNQI28yayNvI3A3biNwfjJrIW41blglaldPcjJrcnMzYXN3Mmt3eDZaeCNPMmsjTyNQN2gjUCNvMmsjbyNwN24jcH4ya1c2YFQlaldPcjZacnM2b3MjTzZaI08jUDdiI1B+NlpXNnJUT3I2WnJzN1JzI082WiNPI1A3YiNQfjZaVzdVU09yNlpzI082WiNPI1A3YiNQfjZaVzdlUE9+NlohbjdrUE9+Mmshbjd1WCVnUyVqV09yOGJyczlPc3c4Ynd4OlV4I084YiNPI1A7WyNQI284YiNvI3AyayNwfjhiWzhpViVnUyVqV09yOGJyczlPc3c4Ynd4OlV4I084YiNPI1A7WyNQfjhiWzlUViVnU09yOGJyczlqc3c4Ynd4OlV4I084YiNPI1A7WyNQfjhiWzlvViVnU09yOGJyczB4c3c4Ynd4OlV4I084YiNPI1A7WyNQfjhiWzpaViVqV09yOGJyczlPc3c4Ynd4OnB4I084YiNPI1A7WyNQfjhiWzp1ViVqV09yOGJyczlPc3c4Ynd4Nlp4I084YiNPI1A7WyNQfjhiWztfUE9+OGI4ejtpWiVwN1slaldPcih5cnMpd3N3KHl3eDxbeCNPKHkjTyNQMlYjUCNvKHkjbyNwN24jcCNxKHkjcSNyMmsjcn4oeTdkPGNYJXA3WyVqV09yPFtycz1PcyNPPFsjTyNQPmIjUCNvPFsjbyNwNlojcCNxPFsjcSNyNlojcn48WzdkPVRYJXA3W09yPFtycz1wcyNPPFsjTyNQPmIjUCNvPFsjbyNwNlojcCNxPFsjcSNyNlojcn48WzdkPXVYJXA3W09yPFtycy13cyNPPFsjTyNQPmIjUCNvPFsjbyNwNlojcCNxPFsjcSNyNlojcn48WzdkPmdUJXA3W08jbzxbI28jcDZaI3AjcTxbI3EjcjZaI3J+PFs5Wz57VCVwN1tPI28nUCNvI3A/WyNwI3EnUCNxI3I/WyNyfidQI08/Z1glZ1MlalclbWAldiFiT3I/W3JzQFNzdz9bd3g0d3gjTz9bI08jUENPI1Ajbz9bI28jcENVI3B+P1sjT0BdWCVnUyVtYCV2IWJPcj9bcnNAeHN3P1t3eDR3eCNPP1sjTyNQQ08jUCNvP1sjbyNwQ1UjcH4/WyNPQVJYJWdTJW1gJXYhYk9yP1tyc0Fuc3c/W3d4NHd4I08/WyNPI1BDTyNQI28/WyNvI3BDVSNwfj9bIXZBd1YlZ1MlbWAldiFiT3dBbnd4L1h4I09BbiNPI1BCXiNQI29BbiNvI3BCZCNwfkFuIXZCYVBPfkFuIXZCaVYlZ1NPdzB4d3gxXngjTzB4I08jUDJQI1AjbzB4I28jcEFuI3B+MHgjT0NSUE9+P1sjT0NdWCVnUyVqV09yOGJyczlPc3c4Ynd4OlV4I084YiNPI1A7WyNQI284YiNvI3A/WyNwfjhiOVtEVFolcDdbJWdTJW1gJXYhYk9yJ1Byc0R2c3cnUHd4KFB4I08nUCNPI1A+diNQI28nUCNvI3BDVSNwI3EnUCNxI3I/WyNyfidQOVNFUlglcDdbJWdTJW1gJXYhYk93RHZ3eCxleCNPRHYjTyNQRW4jUCNvRHYjbyNwQmQjcCNxRHYjcSNyQW4jcn5EdjlTRXNUJXA3W08jb0R2I28jcEFuI3AjcUR2I3EjckFuI3J+RHY8YkZfWiVwN1slalclc3AleCN0T3JHUXJzKXdzd0dRd3hNXngjT0dRI08jUEhTI1Ajb0dRI28jcExqI3AjcUdRI3EjckhoI3J+R1E8YkdhWiVwN1slZ1Mlalclc3AldiFiJXgjdE9yR1Fycyl3c3dHUXd4RlN4I09HUSNPI1BIUyNQI29HUSNvI3BMaiNwI3FHUSNxI3JIaCNyfkdRPGJIWFQlcDdbTyNvR1EjbyNwSGgjcCNxR1EjcSNySGgjcn5HUSZVSHVYJWdTJWpXJXNwJXYhYiV4I3RPckhocnMzYXN3SGh3eElieCNPSGgjTyNQTGQjUCNvSGgjbyNwTGojcH5IaCZVSWtYJWpXJXNwJXgjdE9ySGhyczNhc3dIaHd4Sld4I09IaCNPI1BMZCNQI29IaCNvI3BMaiNwfkhoJlVKYVglalclc3AleCN0T3JIaHJzM2Fzd0hod3hKfHgjT0hoI08jUExkI1Ajb0hoI28jcExqI3B+SGgkbktWWCVqVyVzcCV4I3RPckp8cnM2b3N3Snx3eEp8eCNPSnwjTyNQS3IjUCNvSnwjbyNwS3gjcH5KfCRuS3VQT35KfCRuS31WJWpXT3I2WnJzNm9zI082WiNPI1A3YiNQI282WiNvI3BKfCNwfjZaJlVMZ1BPfkhoJlVMcVglZ1MlaldPcjhicnM5T3N3OGJ3eDpVeCNPOGIjTyNQO1sjUCNvOGIjbyNwSGgjcH44YjxiTWlaJXA3WyVqVyVzcCV4I3RPckdRcnMpd3N3R1F3eE5beCNPR1EjTyNQSFMjUCNvR1EjbyNwTGojcCNxR1EjcSNySGgjcn5HUTp6TmdaJXA3WyVqVyVzcCV4I3RPck5bcnM9T3N3Tlt3eE5beCNPTlsjTyNQISBZI1Ajb05bI28jcEt4I3AjcU5bI3Ejckp8I3J+Tls6eiEgX1QlcDdbTyNvTlsjbyNwSnwjcCNxTlsjcSNySnwjcn5OWzxyISBzVCVwN1tPI28kfSNvI3AhIVMjcCNxJH0jcSNyISFTI3J+JH0mZiEhY1glZ1MlalclbWAlc3AldiFiJXgjdE9yISFTcnNAU3N3ISFTd3hJYngjTyEhUyNPI1AhI08jUCNvISFTI28jcCEjVSNwfiEhUyZmISNSUE9+ISFTJmYhI11YJWdTJWpXT3I4YnJzOU9zdzhid3g6VXgjTzhiI08jUDtbI1AjbzhiI28jcCEhUyNwfjhiTWchJF1hJXA3WyVnUyVqVyRvMXMlbWAlc3AldiFiJXgjdE9YJH1YWSEjeFlbJH1bXSEjeF1wJH1wcSEjeHFyJH1ycyZSc3ckfXd4RlN4I08kfSNPI1AhJWIjUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9TWchJWdYJXA3W09ZJH1ZWiEjeFpdJH1dXiEjeF4jbyR9I28jcCEhUyNwI3EkfSNxI3IhIVMjcn4kfTx1ISZlYiVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAhJ20hYCNPJH0jTyNQISBuI1AjVCR9I1QjVSEocyNVI2YkfSNmI2chKHMjZyNoIShzI2gjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfTx1IShRWmpSJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH08dSEpV1ohalIlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7ISpZXyV0cCVwN1slZ1MlZSxYJW1gJXYhYk9ZIStYWVonUFpdIStYXV4nUF5yIStYcnMhQlBzdyErWHd4IS1neCNPIStYI08jUCE+ZSNQI28hK1gjbyNwIUB9I3AjcSErWCNxI3IhPnkjcn4hK1hEZSEraF8lcDdbJWdTJWpXJWUsWCVtYCV2IWJPWSErWFlaJ1BaXSErWF1eJ1BeciErWHJzISxnc3chK1h3eCEtZ3gjTyErWCNPI1AhPmUjUCNvIStYI28jcCFAfSNwI3EhK1gjcSNyIT55I3J+IStYRGUhLHRaJXA3WyVnUyVlLFglbWAldiFiT3InUHJzQ3hzdydQd3goUHgjTydQI08jUD52I1AjbydQI28jcENVI3AjcSdQI3Ejcj9bI3J+J1BEVCEtcF8lcDdbJWpXJWUsWE9ZIS5vWVooeVpdIS5vXV4oeV5yIS5vcnMhL3tzdyEub3d4ITtSeCNPIS5vI08jUCEweSNQI28hLm8jbyNwITZtI3AjcSEubyNxI3IhMV8jcn4hLm9EVCEufF8lcDdbJWdTJWpXJWUsWCV2IWJPWSEub1laKHlaXSEub11eKHleciEub3JzIS97c3chLm93eCEtZ3gjTyEubyNPI1AhMHkjUCNvIS5vI28jcCE2bSNwI3EhLm8jcSNyITFfI3J+IS5vRFQhMFdaJXA3WyVnUyVlLFgldiFiT3IoeXJzKnNzdyh5d3goUHgjTyh5I08jUDJWI1Ajbyh5I28jcDduI3AjcSh5I3EjcjJrI3J+KHlEVCExT1QlcDdbTyNvIS5vI28jcCExXyNwI3EhLm8jcSNyITFfI3J+IS5vLXchMWpdJWdTJWpXJWUsWCV2IWJPWSExX1laMmtaXSExX11eMmteciExX3JzITJjc3chMV93eCEzWHgjTyExXyNPI1AhNmcjUCNvITFfI28jcCE2bSNwfiExXy13ITJsWCVnUyVlLFgldiFiT3Iya3JzNFRzdzJrd3g0d3gjTzJrI08jUDdoI1AjbzJrI28jcDduI3B+MmstdyEzYF0lalclZSxYT1khMV9ZWjJrWl0hMV9dXjJrXnIhMV9ycyEyY3N3ITFfd3ghNFh4I08hMV8jTyNQITZnI1AjbyExXyNvI3AhNm0jcH4hMV8tdyE0YF0lalclZSxYT1khMV9ZWjJrWl0hMV9dXjJrXnIhMV9ycyEyY3N3ITFfd3ghNVh4I08hMV8jTyNQITZnI1AjbyExXyNvI3AhNm0jcH4hMV8sYSE1YFglalclZSxYT1khNVhZWjZaWl0hNVhdXjZaXnIhNVhycyE1e3MjTyE1WCNPI1AhNmEjUH4hNVgsYSE2UVQlZSxYT3I2WnJzN1JzI082WiNPI1A3YiNQfjZaLGEhNmRQT34hNVgtdyE2alBPfiExXy13ITZ2XSVnUyVqVyVlLFhPWSE3b1laOGJaXSE3b11eOGJeciE3b3JzIThrc3chN293eCE5WHgjTyE3byNPI1AhOnsjUCNvITdvI28jcCExXyNwfiE3byxlITd4WiVnUyVqVyVlLFhPWSE3b1laOGJaXSE3b11eOGJeciE3b3JzIThrc3chN293eCE5WHgjTyE3byNPI1AhOnsjUH4hN28sZSE4clYlZ1MlZSxYT3I4YnJzOWpzdzhid3g6VXgjTzhiI08jUDtbI1B+OGIsZSE5YFolalclZSxYT1khN29ZWjhiWl0hN29dXjhiXnIhN29ycyE4a3N3ITdvd3ghOlJ4I08hN28jTyNQITp7I1B+ITdvLGUhOllaJWpXJWUsWE9ZITdvWVo4YlpdITdvXV44Yl5yITdvcnMhOGtzdyE3b3d4ITVYeCNPITdvI08jUCE6eyNQfiE3byxlITtPUE9+ITdvRFQhO1tfJXA3WyVqVyVlLFhPWSEub1laKHlaXSEub11eKHleciEub3JzIS97c3chLm93eCE8WngjTyEubyNPI1AhMHkjUCNvIS5vI28jcCE2bSNwI3EhLm8jcSNyITFfI3J+IS5vQm0hPGRdJXA3WyVqVyVlLFhPWSE8WllaPFtaXSE8Wl1ePFteciE8WnJzIT1dcyNPITxaI08jUCE+UCNQI28hPFojbyNwITVYI3AjcSE8WiNxI3IhNVgjcn4hPFpCbSE9ZFglcDdbJWUsWE9yPFtycz1wcyNPPFsjTyNQPmIjUCNvPFsjbyNwNlojcCNxPFsjcSNyNlojcn48W0JtIT5VVCVwN1tPI28hPFojbyNwITVYI3AjcSE8WiNxI3IhNVgjcn4hPFpEZSE+alQlcDdbTyNvIStYI28jcCE+eSNwI3EhK1gjcSNyIT55I3J+IStYLlghP1ddJWdTJWpXJWUsWCVtYCV2IWJPWSE+eVlaP1taXSE+eV1eP1teciE+eXJzIUBQc3chPnl3eCEzWHgjTyE+eSNPI1AhQHcjUCNvIT55I28jcCFAfSNwfiE+eS5YIUBbWCVnUyVlLFglbWAldiFiT3I/W3JzQHhzdz9bd3g0d3gjTz9bI08jUENPI1Ajbz9bI28jcENVI3B+P1suWCFAelBPfiE+eS5YIUFXXSVnUyVqVyVlLFhPWSE3b1laOGJaXSE3b11eOGJeciE3b3JzIThrc3chN293eCE5WHgjTyE3byNPI1AhOnsjUCNvITdvI28jcCE+eSNwfiE3b0daIUJeWiVwN1slZ1MlZSxYJW1gJXYhYk9yJ1BycyFDUHN3J1B3eChQeCNPJ1AjTyNQPnYjUCNvJ1AjbyNwQ1UjcCNxJ1AjcSNyP1sjcn4nUEdaIUNgWCVrI3wlcDdbJWdTJWksWCVtYCV2IWJPd0R2d3gsZXgjT0R2I08jUEVuI1Ajb0R2I28jcEJkI3AjcUR2I3EjckFuI3J+RHZNZyFEYF9RMXMlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPWSFDe1laJH1aXSFDe11eJH1eciFDe3JzIUVfc3chQ3t3eCNIcXgjTyFDeyNPI1AkKGkjUCNvIUN7I28jcCQqeyNwI3EhQ3sjcSNyJCldI3J+IUN7SlAhRWxfUTFzJXA3WyVnUyVtYCV2IWJPWSFGa1laJ1BaXSFGa11eJ1BeciFGa3JzI0Vrc3chRmt3eCFHeXgjTyFGayNPI1AjPXUjUCNvIUZrI28jcCNEaSNwI3EhRmsjcSNyIz5pI3J+IUZrSlAhRnpfUTFzJXA3WyVnUyVqVyVtYCV2IWJPWSFGa1laJ1BaXSFGa11eJ1BeciFGa3JzIUVfc3chRmt3eCFHeXgjTyFGayNPI1AjPXUjUCNvIUZrI28jcCNEaSNwI3EhRmsjcSNyIz5pI3J+IUZrSW8hSFNfUTFzJXA3WyVqV09ZIUlSWVooeVpdIUlSXV4oeV5yIUlScnMhSl9zdyFJUnd4Izh3eCNPIUlSI08jUCMqUiNQI28hSVIjbyNwIzJ9I3AjcSFJUiNxI3IjKnUjcn4hSVJJbyFJYF9RMXMlcDdbJWdTJWpXJXYhYk9ZIUlSWVooeVpdIUlSXV4oeV5yIUlScnMhSl9zdyFJUnd4IUd5eCNPIUlSI08jUCMqUiNQI28hSVIjbyNwIzJ9I3AjcSFJUiNxI3IjKnUjcn4hSVJJbyFKal9RMXMlcDdbJWdTJXYhYk9ZIUlSWVooeVpdIUlSXV4oeV5yIUlScnMhS2lzdyFJUnd4IUd5eCNPIUlSI08jUCMqUiNQI28hSVIjbyNwIzJ9I3AjcSFJUiNxI3IjKnUjcn4hSVJJbyFLdF9RMXMlcDdbJWdTJXYhYk9ZIUlSWVooeVpdIUlSXV4oeV5yIUlScnMhTHNzdyFJUnd4IUd5eCNPIUlSI08jUCMqUiNQI28hSVIjbyNwIzJ9I3AjcSFJUiNxI3IjKnUjcn4hSVJJZyFNT11RMXMlcDdbJWdTJXYhYk9ZIUxzWVorb1pdIUxzXV4rb153IUxzd3ghTXd4I08hTHMjTyNQIyF5I1AjbyFMcyNvI3AjJm0jcCNxIUxzI3EjciMjbSNyfiFMc0lnIU5PXVExcyVwN1tPWSFMc1laK29aXSFMc11eK29edyFMc3d4IU53eCNPIUxzI08jUCMheSNQI28hTHMjbyNwIyZtI3AjcSFMcyNxI3IjI20jcn4hTHNJZyMgT11RMXMlcDdbT1khTHNZWitvWl0hTHNdXitvXnchTHN3eCMgd3gjTyFMcyNPI1AjIXkjUCNvIUxzI28jcCMmbSNwI3EhTHMjcSNyIyNtI3J+IUxzSFAjIU9YUTFzJXA3W09ZIyB3WVotd1pdIyB3XV4td14jbyMgdyNvI3AjIWsjcCNxIyB3I3EjciMhayNyfiMgdzFzIyFwUlExc09ZIyFrWl0jIWtefiMha0lnIyNRWFExcyVwN1tPWSFMc1laK29aXSFMc11eK29eI28hTHMjbyNwIyNtI3AjcSFMcyNxI3IjI20jcn4hTHMzWiMjdlpRMXMlZ1MldiFiT1kjI21ZWi5rWl0jI21dXi5rXncjI213eCMkaXgjTyMjbSNPI1AjJlgjUCNvIyNtI28jcCMmbSNwfiMjbTNaIyRuWlExc09ZIyNtWVoua1pdIyNtXV4ua153IyNtd3gjJWF4I08jI20jTyNQIyZYI1AjbyMjbSNvI3AjJm0jcH4jI20zWiMlZlpRMXNPWSMjbVlaLmtaXSMjbV1eLmtedyMjbXd4IyFreCNPIyNtI08jUCMmWCNQI28jI20jbyNwIyZtI3B+IyNtM1ojJl5UUTFzT1kjI21ZWi5rWl0jI21dXi5rXn4jI20zWiMmdFpRMXMlZ1NPWSMnZ1laMHhaXSMnZ11eMHhedyMnZ3d4IyhaeCNPIydnI08jUCMpbSNQI28jJ2cjbyNwIyNtI3B+IydnMXcjJ25YUTFzJWdTT1kjJ2dZWjB4Wl0jJ2ddXjB4XncjJ2d3eCMoWngjTyMnZyNPI1AjKW0jUH4jJ2cxdyMoYFhRMXNPWSMnZ1laMHhaXSMnZ11eMHhedyMnZ3d4Iyh7eCNPIydnI08jUCMpbSNQfiMnZzF3IylRWFExc09ZIydnWVoweFpdIydnXV4weF53Iydnd3gjIWt4I08jJ2cjTyNQIyltI1B+IydnMXcjKXJUUTFzT1kjJ2dZWjB4Wl0jJ2ddXjB4Xn4jJ2dJbyMqWVhRMXMlcDdbT1khSVJZWih5Wl0hSVJdXih5XiNvIUlSI28jcCMqdSNwI3EhSVIjcSNyIyp1I3J+IUlSM2MjK1FdUTFzJWdTJWpXJXYhYk9ZIyp1WVoya1pdIyp1XV4ya15yIyp1cnMjK3lzdyMqdXd4Iy19eCNPIyp1I08jUCMyaSNQI28jKnUjbyNwIzJ9I3B+Iyp1M2MjLFNdUTFzJWdTJXYhYk9ZIyp1WVoya1pdIyp1XV4ya15yIyp1cnMjLHtzdyMqdXd4Iy19eCNPIyp1I08jUCMyaSNQI28jKnUjbyNwIzJ9I3B+Iyp1M2MjLVVdUTFzJWdTJXYhYk9ZIyp1WVoya1pdIyp1XV4ya15yIyp1cnMjI21zdyMqdXd4Iy19eCNPIyp1I08jUCMyaSNQI28jKnUjbyNwIzJ9I3B+Iyp1M2MjLlVdUTFzJWpXT1kjKnVZWjJrWl0jKnVdXjJrXnIjKnVycyMreXN3Iyp1d3gjLn14I08jKnUjTyNQIzJpI1AjbyMqdSNvI3AjMn0jcH4jKnUzYyMvVV1RMXMlaldPWSMqdVlaMmtaXSMqdV1eMmteciMqdXJzIyt5c3cjKnV3eCMvfXgjTyMqdSNPI1AjMmkjUCNvIyp1I28jcCMyfSNwfiMqdTF7IzBVWFExcyVqV09ZIy99WVo2WlpdIy99XV42Wl5yIy99cnMjMHFzI08jL30jTyNQIzJUI1B+Iy99MXsjMHZYUTFzT1kjL31ZWjZaWl0jL31dXjZaXnIjL31ycyMxY3MjTyMvfSNPI1AjMlQjUH4jL30xeyMxaFhRMXNPWSMvfVlaNlpaXSMvfV1eNlpeciMvfXJzIyFrcyNPIy99I08jUCMyVCNQfiMvfTF7IzJZVFExc09ZIy99WVo2WlpdIy99XV42Wl5+Iy99M2MjMm5UUTFzT1kjKnVZWjJrWl0jKnVdXjJrXn4jKnUzYyMzV11RMXMlZ1MlaldPWSM0UFlaOGJaXSM0UF1eOGJeciM0UHJzIzR7c3cjNFB3eCM2b3gjTyM0UCNPI1AjOGMjUCNvIzRQI28jcCMqdSNwfiM0UDJQIzRZWlExcyVnUyVqV09ZIzRQWVo4YlpdIzRQXV44Yl5yIzRQcnMjNHtzdyM0UHd4IzZveCNPIzRQI08jUCM4YyNQfiM0UDJQIzVTWlExcyVnU09ZIzRQWVo4YlpdIzRQXV44Yl5yIzRQcnMjNXVzdyM0UHd4IzZveCNPIzRQI08jUCM4YyNQfiM0UDJQIzV8WlExcyVnU09ZIzRQWVo4YlpdIzRQXV44Yl5yIzRQcnMjJ2dzdyM0UHd4IzZveCNPIzRQI08jUCM4YyNQfiM0UDJQIzZ2WlExcyVqV09ZIzRQWVo4YlpdIzRQXV44Yl5yIzRQcnMjNHtzdyM0UHd4IzdpeCNPIzRQI08jUCM4YyNQfiM0UDJQIzdwWlExcyVqV09ZIzRQWVo4YlpdIzRQXV44Yl5yIzRQcnMjNHtzdyM0UHd4Iy99eCNPIzRQI08jUCM4YyNQfiM0UDJQIzhoVFExc09ZIzRQWVo4YlpdIzRQXV44Yl5+IzRQSW8jOVFfUTFzJXA3WyVqV09ZIUlSWVooeVpdIUlSXV4oeV5yIUlScnMhSl9zdyFJUnd4IzpQeCNPIUlSI08jUCMqUiNQI28hSVIjbyNwIzJ9I3AjcSFJUiNxI3IjKnUjcn4hSVJIWCM6WV1RMXMlcDdbJWpXT1kjOlBZWjxbWl0jOlBdXjxbXnIjOlBycyM7UnMjTyM6UCNPI1AjPVIjUCNvIzpQI28jcCMvfSNwI3EjOlAjcSNyIy99I3J+IzpQSFgjO1ldUTFzJXA3W09ZIzpQWVo8W1pdIzpQXV48W15yIzpQcnMjPFJzI08jOlAjTyNQIz1SI1AjbyM6UCNvI3AjL30jcCNxIzpQI3EjciMvfSNyfiM6UEhYIzxZXVExcyVwN1tPWSM6UFlaPFtaXSM6UF1ePFteciM6UHJzIyB3cyNPIzpQI08jUCM9UiNQI28jOlAjbyNwIy99I3AjcSM6UCNxI3IjL30jcn4jOlBIWCM9WVhRMXMlcDdbT1kjOlBZWjxbWl0jOlBdXjxbXiNvIzpQI28jcCMvfSNwI3EjOlAjcSNyIy99I3J+IzpQSlAjPXxYUTFzJXA3W09ZIUZrWVonUFpdIUZrXV4nUF4jbyFGayNvI3AjPmkjcCNxIUZrI3EjciM+aSNyfiFGazNzIz52XVExcyVnUyVqVyVtYCV2IWJPWSM+aVlaP1taXSM+aV1eP1teciM+aXJzIz9vc3cjPml3eCMtfXgjTyM+aSNPI1AjRFQjUCNvIz5pI28jcCNEaSNwfiM+aTNzIz96XVExcyVnUyVtYCV2IWJPWSM+aVlaP1taXSM+aV1eP1teciM+aXJzI0Bzc3cjPml3eCMtfXgjTyM+aSNPI1AjRFQjUCNvIz5pI28jcCNEaSNwfiM+aTNzI0FPXVExcyVnUyVtYCV2IWJPWSM+aVlaP1taXSM+aV1eP1teciM+aXJzI0F3c3cjPml3eCMtfXgjTyM+aSNPI1AjRFQjUCNvIz5pI28jcCNEaSNwfiM+aTNrI0JTWlExcyVnUyVtYCV2IWJPWSNBd1laQW5aXSNBd11eQW5edyNBd3d4IyRpeCNPI0F3I08jUCNCdSNQI28jQXcjbyNwI0NaI3B+I0F3M2sjQnpUUTFzT1kjQXdZWkFuWl0jQXddXkFuXn4jQXczayNDYlpRMXMlZ1NPWSMnZ1laMHhaXSMnZ11eMHhedyMnZ3d4IyhaeCNPIydnI08jUCMpbSNQI28jJ2cjbyNwI0F3I3B+IydnM3MjRFlUUTFzT1kjPmlZWj9bWl0jPmldXj9bXn4jPmkzcyNEcl1RMXMlZ1MlaldPWSM0UFlaOGJaXSM0UF1eOGJeciM0UHJzIzR7c3cjNFB3eCM2b3gjTyM0UCNPI1AjOGMjUCNvIzRQI28jcCM+aSNwfiM0UEpQI0V4X1ExcyVwN1slZ1MlbWAldiFiT1khRmtZWidQWl0hRmtdXidQXnIhRmtycyNGd3N3IUZrd3ghR3l4I08hRmsjTyNQIz11I1AjbyFGayNvI3AjRGkjcCNxIUZrI3EjciM+aSNyfiFGa0l3I0dVXVExcyVwN1slZ1MlbWAldiFiT1kjRndZWkR2Wl0jRnddXkR2XncjRnd3eCFNd3gjTyNGdyNPI1AjR30jUCNvI0Z3I28jcCNDWiNwI3EjRncjcSNyI0F3I3J+I0Z3SXcjSFVYUTFzJXA3W09ZI0Z3WVpEdlpdI0Z3XV5Edl4jbyNGdyNvI3AjQXcjcCNxI0Z3I3EjciNBdyNyfiNGd01WI0lPX1ExcyVwN1slalclc3AleCN0T1kjSX1ZWkdRWl0jSX1dXkdRXnIjSX1ycyFKX3N3I0l9d3gkJV14I08jSX0jTyNQI0tfI1AjbyNJfSNvI3AkJFojcCNxI0l9I3EjciNMUiNyfiNJfU1WI0pgX1ExcyVwN1slZ1Mlalclc3AldiFiJXgjdE9ZI0l9WVpHUVpdI0l9XV5HUV5yI0l9cnMhSl9zdyNJfXd4I0hxeCNPI0l9I08jUCNLXyNQI28jSX0jbyNwJCRaI3AjcSNJfSNxI3IjTFIjcn4jSX1NViNLZlhRMXMlcDdbT1kjSX1ZWkdRWl0jSX1dXkdRXiNvI0l9I28jcCNMUiNwI3EjSX0jcSNyI0xSI3J+I0l9NnkjTGJdUTFzJWdTJWpXJXNwJXYhYiV4I3RPWSNMUllaSGhaXSNMUl1eSGheciNMUnJzIyt5c3cjTFJ3eCNNWngjTyNMUiNPI1AkI3UjUCNvI0xSI28jcCQkWiNwfiNMUjZ5I01mXVExcyVqVyVzcCV4I3RPWSNMUllaSGhaXSNMUl1eSGheciNMUnJzIyt5c3cjTFJ3eCNOX3gjTyNMUiNPI1AkI3UjUCNvI0xSI28jcCQkWiNwfiNMUjZ5I05qXVExcyVqVyVzcCV4I3RPWSNMUllaSGhaXSNMUl1eSGheciNMUnJzIyt5c3cjTFJ3eCQgY3gjTyNMUiNPI1AkI3UjUCNvI0xSI28jcCQkWiNwfiNMUjVjJCBuXVExcyVqVyVzcCV4I3RPWSQgY1laSnxaXSQgY11eSnxeciQgY3JzIzBxc3ckIGN3eCQgY3gjTyQgYyNPI1AkIWcjUCNvJCBjI28jcCQheyNwfiQgYzVjJCFsVFExc09ZJCBjWVpKfFpdJCBjXV5KfF5+JCBjNWMkI1NaUTFzJWpXT1kjL31ZWjZaWl0jL31dXjZaXnIjL31ycyMwcXMjTyMvfSNPI1AjMlQjUCNvIy99I28jcCQgYyNwfiMvfTZ5JCN6VFExc09ZI0xSWVpIaFpdI0xSXV5IaF5+I0xSNnkkJGRdUTFzJWdTJWpXT1kjNFBZWjhiWl0jNFBdXjhiXnIjNFBycyM0e3N3IzRQd3gjNm94I08jNFAjTyNQIzhjI1AjbyM0UCNvI3AjTFIjcH4jNFBNViQlal9RMXMlcDdbJWpXJXNwJXgjdE9ZI0l9WVpHUVpdI0l9XV5HUV5yI0l9cnMhSl9zdyNJfXd4JCZpeCNPI0l9I08jUCNLXyNQI28jSX0jbyNwJCRaI3AjcSNJfSNxI3IjTFIjcn4jSX1LbyQmdl9RMXMlcDdbJWpXJXNwJXgjdE9ZJCZpWVpOW1pdJCZpXV5OW15yJCZpcnMjO1JzdyQmaXd4JCZpeCNPJCZpI08jUCQndSNQI28kJmkjbyNwJCF7I3AjcSQmaSNxI3IkIGMjcn4kJmlLbyQnfFhRMXMlcDdbT1kkJmlZWk5bWl0kJmldXk5bXiNvJCZpI28jcCQgYyNwI3EkJmkjcSNyJCBjI3J+JCZpTWckKHBYUTFzJXA3W09ZIUN7WVokfVpdIUN7XV4kfV4jbyFDeyNvI3AkKV0jcCNxIUN7I3EjciQpXSNyfiFDezdaJCluXVExcyVnUyVqVyVtYCVzcCV2IWIleCN0T1kkKV1ZWiEhU1pdJCldXV4hIVNeciQpXXJzIz9vc3ckKV13eCNNWngjTyQpXSNPI1AkKmcjUCNvJCldI28jcCQqeyNwfiQpXTdaJCpsVFExc09ZJCldWVohIVNaXSQpXV1eISFTXn4kKV03WiQrVV1RMXMlZ1MlaldPWSM0UFlaOGJaXSM0UF1eOGJeciM0UHJzIzR7c3cjNFB3eCM2b3gjTyM0UCNPI1AjOGMjUCNvIzRQI28jcCQpXSNwfiM0UEd6JCxiXSR9USVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd6JC1uWiFzLFclcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd6JC50XSR3USVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JC98XyVxYCVwN1slalclZSxYJXNwJXgjdE9ZJDB7WVpHUVpdJDB7XV5HUV5yJDB7cnMkMl1zdyQwe3d4JEpleCNPJDB7I08jUCRGdyNQI28kMHsjbyNwJEljI3AjcSQweyNxI3IkR10jcn4kMHtHayQxXl8lcDdbJWdTJWpXJWUsWCVzcCV2IWIleCN0T1kkMHtZWkdRWl0kMHtdXkdRXnIkMHtycyQyXXN3JDB7d3gkRXd4I08kMHsjTyNQJEZ3I1AjbyQweyNvI3AkSWMjcCNxJDB7I3EjciRHXSNyfiQwe0RUJDJoXyVwN1slZ1MlZSxYJXYhYk9ZJDNnWVooeVpdJDNnXV4oeV5yJDNncnMkQmFzdyQzZ3d4JDRzeCNPJDNnI08jUCQ1byNQI28kM2cjbyNwJD17I3AjcSQzZyNxI3IkNlQjcn4kM2dEVCQzdF8lcDdbJWdTJWpXJWUsWCV2IWJPWSQzZ1laKHlaXSQzZ11eKHleciQzZ3JzJDJdc3ckM2d3eCQ0c3gjTyQzZyNPI1AkNW8jUCNvJDNnI28jcCQ9eyNwI3EkM2cjcSNyJDZUI3J+JDNnRFQkNHxaJXA3WyVqVyVlLFhPcih5cnMpd3N3KHl3eDtieCNPKHkjTyNQMlYjUCNvKHkjbyNwN24jcCNxKHkjcSNyMmsjcn4oeURUJDV0VCVwN1tPI28kM2cjbyNwJDZUI3AjcSQzZyNxI3IkNlQjcn4kM2ctdyQ2YF0lZ1MlalclZSxYJXYhYk9ZJDZUWVoya1pdJDZUXV4ya15yJDZUcnMkN1hzdyQ2VHd4JD1SeCNPJDZUI08jUCQ9dSNQI28kNlQjbyNwJD17I3B+JDZULXckN2JdJWdTJWUsWCV2IWJPWSQ2VFlaMmtaXSQ2VF1eMmteciQ2VHJzJDhac3ckNlR3eCQ9UngjTyQ2VCNPI1AkPXUjUCNvJDZUI28jcCQ9eyNwfiQ2VC13JDhkXSVnUyVlLFgldiFiT1kkNlRZWjJrWl0kNlRdXjJrXnIkNlRycyQ5XXN3JDZUd3gkPVJ4I08kNlQjTyNQJD11I1AjbyQ2VCNvI3AkPXsjcH4kNlQtbyQ5ZlolZ1MlZSxYJXYhYk9ZJDldWVoua1pdJDldXV4ua153JDldd3gkOlh4I08kOV0jTyNQJDpzI1AjbyQ5XSNvI3AkOnkjcH4kOV0tbyQ6XlYlZSxYT3cua3d4L3F4I08uayNPI1AwVyNQI28uayNvI3AwXiNwfi5rLW8kOnZQT34kOV0tbyQ7UVolZ1MlZSxYT1kkO3NZWjB4Wl0kO3NdXjB4XnckO3N3eCQ8Z3gjTyQ7cyNPI1AkPHsjUCNvJDtzI28jcCQ5XSNwfiQ7cyxdJDt6WCVnUyVlLFhPWSQ7c1laMHhaXSQ7c11eMHhedyQ7c3d4JDxneCNPJDtzI08jUCQ8eyNQfiQ7cyxdJDxsVCVlLFhPdzB4d3gxcHgjTzB4I08jUDJQI1B+MHgsXSQ9T1BPfiQ7cy13JD1ZWCVqVyVlLFhPcjJrcnMzYXN3Mmt3eDVpeCNPMmsjTyNQN2gjUCNvMmsjbyNwN24jcH4yay13JD14UE9+JDZULXckPlVdJWdTJWpXJWUsWE9ZJD59WVo4YlpdJD59XV44Yl5yJD59cnMkP3lzdyQ+fXd4JEFteCNPJD59I08jUCRCWiNQI28kPn0jbyNwJDZUI3B+JD59LGUkP1daJWdTJWpXJWUsWE9ZJD59WVo4YlpdJD59XV44Yl5yJD59cnMkP3lzdyQ+fXd4JEFteCNPJD59I08jUCRCWiNQfiQ+fSxlJEBRWiVnUyVlLFhPWSQ+fVlaOGJaXSQ+fV1eOGJeciQ+fXJzJEBzc3ckPn13eCRBbXgjTyQ+fSNPI1AkQlojUH4kPn0sZSRAelolZ1MlZSxYT1kkPn1ZWjhiWl0kPn1dXjhiXnIkPn1ycyQ7c3N3JD59d3gkQW14I08kPn0jTyNQJEJaI1B+JD59LGUkQXRWJWpXJWUsWE9yOGJyczlPc3c4Ynd4OnB4I084YiNPI1A7WyNQfjhiLGUkQl5QT34kPn1EVCRCbF8lcDdbJWdTJWUsWCV2IWJPWSQzZ1laKHlaXSQzZ11eKHleciQzZ3JzJENrc3ckM2d3eCQ0c3gjTyQzZyNPI1AkNW8jUCNvJDNnI28jcCQ9eyNwI3EkM2cjcSNyJDZUI3J+JDNnQ3skQ3ZdJXA3WyVnUyVlLFgldiFiT1kkQ2tZWitvWl0kQ2tdXitvXnckQ2t3eCREb3gjTyRDayNPI1AkRWMjUCNvJENrI28jcCQ6eSNwI3EkQ2sjcSNyJDldI3J+JENrQ3skRHZYJXA3WyVlLFhPdytvd3gtVngjTytvI08jUC5WI1AjbytvI28jcDBeI3AjcStvI3Ejci5rI3J+K29DeyRFaFQlcDdbTyNvJENrI28jcCQ5XSNwI3EkQ2sjcSNyJDldI3J+JENrR2skRlVaJXA3WyVqVyVlLFglc3AleCN0T3JHUXJzKXdzd0dRd3hNXngjT0dRI08jUEhTI1Ajb0dRI28jcExqI3AjcUdRI3EjckhoI3J+R1FHayRGfFQlcDdbTyNvJDB7I28jcCRHXSNwI3EkMHsjcSNyJEddI3J+JDB7MV8kR2xdJWdTJWpXJWUsWCVzcCV2IWIleCN0T1kkR11ZWkhoWl0kR11dXkhoXnIkR11ycyQ3WHN3JEddd3gkSGV4I08kR10jTyNQJEldI1AjbyRHXSNvI3AkSWMjcH4kR10xXyRIcFglalclZSxYJXNwJXgjdE9ySGhyczNhc3dIaHd4Sld4I09IaCNPI1BMZCNQI29IaCNvI3BMaiNwfkhoMV8kSWBQT34kR10xXyRJbF0lZ1MlalclZSxYT1kkPn1ZWjhiWl0kPn1dXjhiXnIkPn1ycyQ/eXN3JD59d3gkQW14I08kPn0jTyNQJEJaI1AjbyQ+fSNvI3AkR10jcH4kPn1HayRKclolcDdbJWpXJWUsWCVzcCV4I3RPckdRcnMpd3N3R1F3eCRLZXgjT0dRI08jUEhTI1Ajb0dRI28jcExqI3AjcUdRI3EjckhoI3J+R1FHayRLdFolaCFmJXA3WyVqVyVmLFglc3AleCN0T3JOW3JzPU9zd05bd3hOW3gjT05bI08jUCEgWSNQI29OWyNvI3BLeCNwI3FOWyNxI3JKfCNyfk5bR3skTHpaZixYJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH08dSROUVohT1IlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JSBXX1QsWCVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4eiR9enslIVZ7IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JSFqXV9SJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCQtWiFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3slI3ZdJHosWCVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfTx1JSVTWndSJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1NZyUmWV4keyxYJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCQtWiFgIWElJ1UhYSNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUJeJSdpWiZTJmolcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JShvXyFkUSVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IU8kfSFPIVAlKW4hUCFRJH0hUSFbJSxPIVsjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyUqUF0lcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFPJH0hTyFQJSp4IVAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyUrXVohbSxYJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSUsY2chZixWJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghUSR9IVEhWyUsTyFbIWckfSFnIWglLXohaCFsJH0hbCFtJTJbIW0jTyR9I08jUCEgbiNQI1IkfSNSI1MlLE8jUyNYJH0jWCNZJS16I1kjXiR9I14jXyUyWyNfI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSUuXWElcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeHskfXt8JS9ifH0kfX0hTyUvYiFPIVEkfSFRIVslMGwhWyNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JS9zXSVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IVEkfSFRIVslMGwhWyNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JTFQYyFmLFYlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFbJTBsIVshbCR9IWwhbSUyWyFtI08kfSNPI1AhIG4jUCNSJH0jUiNTJTBsI1MjXiR9I14jXyUyWyNfI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSUyb1ohZixWJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyUzdV8kfFIlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFQJH0hUCFRJTR0IVEhXyR9IV8hYCQtWiFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3olNVhdJU9RJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCQtWiFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3klNmV1IWYsViVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IU8kfSFPIVAlOHghUCFRJH0hUSFbJTpTIVshZCR9IWQhZSU8VSFlIWckfSFnIWglLXohaCFsJH0hbCFtJTJbIW0hcSR9IXEhciU/TyFyIXokfSF6IXslQXIheyNPJH0jTyNQISBuI1AjUiR9I1IjUyU6UyNTI1UkfSNVI1YlPFUjViNYJH0jWCNZJS16I1kjXiR9I14jXyUyWyNfI2MkfSNjI2QlP08jZCNsJH0jbCNtJUFyI20jbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JTlaXSVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IVEkfSFRIVslLE8hWyNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JTpnaSFmLFYlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFPJH0hTyFQJTh4IVAhUSR9IVEhWyU6UyFbIWckfSFnIWglLXohaCFsJH0hbCFtJTJbIW0jTyR9I08jUCEgbiNQI1IkfSNSI1MlOlMjUyNYJH0jWCNZJS16I1kjXiR9I14jXyUyWyNfI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSU8Z2AlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFSJT1pIVIhUyU9aSFTI08kfSNPI1AhIG4jUCNSJH0jUiNTJT1pI1MjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JT18YCFmLFYlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFSJT1pIVIhUyU9aSFTI08kfSNPI1AhIG4jUCNSJH0jUiNTJT1pI1MjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JT9hXyVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IVEkfSFRIVklQGAhWSNPJH0jTyNQISBuI1AjUiR9I1IjUyVAYCNTI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSVAc18hZixWJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghUSR9IVEhWSVAYCFZI08kfSNPI1AhIG4jUCNSJH0jUiNTJUBgI1MjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JUJUYyVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IVEkfSFRIVslQ2AhWyFjJH0hYyFpJUNgIWkjTyR9I08jUCEgbiNQI1IkfSNSI1MlQ2AjUyNUJH0jVCNaJUNgI1ojbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JUNzYyFmLFYlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFbJUNgIVshYyR9IWMhaSVDYCFpI08kfSNPI1AhIG4jUCNSJH0jUiNTJUNgI1MjVCR9I1QjWiVDYCNaI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1NZyVFY114MXMlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgJUZbIWAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH08dSVGb1olV1IlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JUd1WiNeLFglcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JUh7X2pSJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXiR9IV4hXyVJeiFfIWAhJ20hYCFhISdtIWEjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeiVKX10keFElcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgJC1aIWAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyVLa10lVixYJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCEnbSFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3slTHdealIlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgISdtIWAhYSVNcyFhI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3olTlddJHlRJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCQtWiFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3smIGZdXVEjdFAlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgJC1aIWAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1NZyYhdGMlcDdbJWdTJWpXJWQmaiVtYCVzcCV2IWIleCN0JVEsWE9yJH1ycyZSc3ckfXd4RlN4IVEkfSFRIVsmIV8hWyFjJH0hYyF9JiFfIX0jTyR9I08jUCEgbiNQI1IkfSNSI1MmIV8jUyNUJH0jVCNvJiFfI28jcCEjVSNwI3EkfSNxI3IhIVMjciRnJH0kZ34mIV9NZyYkZmclcDdbJWdTJWpXJWQmaiVtYCVzcCV2IWIleCN0JVEsWE9yJH1ycyYlfXN3JH13eCYpVHghUSR9IVEhWyYhXyFbIWMkfSFjIXQmIV8hdCF1JixhIXUhfSYhXyF9I08kfSNPI1AhIG4jUCNSJH0jUiNTJiFfI1MjVCR9I1QjZiYhXyNmI2cmLGEjZyNvJiFfI28jcCEjVSNwI3EkfSNxI3IhIVMjciRnJH0kZ34mIV9EZSYmW18lcDdbJWdTJWUsWCVtYCV2IWJPWSErWFlaJ1BaXSErWF1eJ1BeciErWHJzJidac3chK1h3eCEtZ3gjTyErWCNPI1AhPmUjUCNvIStYI28jcCFAfSNwI3EhK1gjcSNyIT55I3J+IStYRGUmJ2haJXA3WyVnUyVlLFglbWAldiFiT3InUHJzJihac3cnUHd4KFB4I08nUCNPI1A+diNQI28nUCNvI3BDVSNwI3EnUCNxI3I/WyNyfidQRF0mKGhYJXA3WyVnUyVpLFglbWAldiFiT3dEdnd4LGV4I09EdiNPI1BFbiNQI29EdiNvI3BCZCNwI3FEdiNxI3JBbiNyfkR2R2smKWJfJXA3WyVqVyVlLFglc3AleCN0T1kkMHtZWkdRWl0kMHtdXkdRXnIkMHtycyQyXXN3JDB7d3gmKmF4I08kMHsjTyNQJEZ3I1AjbyQweyNvI3AkSWMjcCNxJDB7I3EjciRHXSNyfiQwe0drJipuWiVwN1slalclZSxYJXNwJXgjdE9yR1Fycyl3c3dHUXd4JitheCNPR1EjTyNQSFMjUCNvR1EjbyNwTGojcCNxR1EjcSNySGgjcn5HUUZUJituWiVwN1slalclZixYJXNwJXgjdE9yTltycz1Pc3dOW3d4Tlt4I09OWyNPI1AhIFkjUCNvTlsjbyNwS3gjcCNxTlsjcSNySnwjcn5OW01nJix2YyVwN1slZ1MlalclZCZqJW1gJXNwJXYhYiV4I3QlUSxYT3IkfXJzJiV9c3ckfXd4JilUeCFRJH0hUSFbJiFfIVshYyR9IWMhfSYhXyF9I08kfSNPI1AhIG4jUCNSJH0jUiNTJiFfI1MjVCR9I1QjbyYhXyNvI3AhI1UjcCNxJH0jcSNyISFTI3IkZyR9JGd+JiFfTWcmLmhnJXA3WyVnUyVqVyVkJmolbWAlc3AldiFiJXgjdCVRLFhPciR9cnMmMFBzdyR9d3gmMnd4IVEkfSFRIVsmIV8hWyFjJH0hYyF0JiFfIXQhdSY1dSF1IX0mIV8hfSNPJH0jTyNQISBuI1AjUiR9I1IjUyYhXyNTI1QkfSNUI2YmIV8jZiNnJjV1I2cjbyYhXyNvI3AhI1UjcCNxJH0jcSNyISFTI3IkZyR9JGd+JiFfRGUmMF5aJXA3WyVnUyVtYCV2IWIlcixYT3InUHJzJjFQc3cnUHd4KFB4I08nUCNPI1A+diNQI28nUCNvI3BDVSNwI3EnUCNxI3I/WyNyfidQRGUmMVtaJXA3WyVnUyVtYCV2IWJPcidQcnMmMX1zdydQd3goUHgjTydQI08jUD52I1AjbydQI28jcENVI3AjcSdQI3Ejcj9bI3J+J1BEXSYyW1glcDdbJWdTJXcsWCVtYCV2IWJPd0R2d3gsZXgjT0R2I08jUEVuI1Ajb0R2I28jcEJkI3AjcUR2I3EjckFuI3J+RHZHayYzVVolcDdbJWpXJXNwJXgjdCVsLFhPckdRcnMpd3N3R1F3eCYzd3gjT0dRI08jUEhTI1Ajb0dRI28jcExqI3AjcUdRI3EjckhoI3J+R1FHayY0U1olcDdbJWpXJXNwJXgjdE9yR1Fycyl3c3dHUXd4JjR1eCNPR1EjTyNQSFMjUCNvR1EjbyNwTGojcCNxR1EjcSNySGgjcn5HUUZUJjVTWiVwN1slalcldSxYJXNwJXgjdE9yTltycz1Pc3dOW3d4Tlt4I09OWyNPI1AhIFkjUCNvTlsjbyNwS3gjcCNxTlsjcSNySnwjcn5OW01nJjZbYyVwN1slZ1MlalclZCZqJW1gJXNwJXYhYiV4I3QlUSxYT3IkfXJzJjBQc3ckfXd4JjJ3eCFRJH0hUSFbJiFfIVshYyR9IWMhfSYhXyF9I08kfSNPI1AhIG4jUCNSJH0jUiNTJiFfI1MjVCR9I1QjbyYhXyNvI3AhI1UjcCNxJH0jcSNyISFTI3IkZyR9JGd+JiFfTWcmN3xrJXA3WyVnUyVqVyVkJmolbWAlc3AldiFiJXgjdCVRLFhPciR9cnMmJX1zdyR9d3gmKVR4IVEkfSFRIVsmIV8hWyFjJH0hYyFoJiFfIWghaSY1dSFpIXQmIV8hdCF1JixhIXUhfSYhXyF9I08kfSNPI1AhIG4jUCNSJH0jUiNTJiFfI1MjVCR9I1QjVSYhXyNVI1YmLGEjViNZJiFfI1kjWiY1dSNaI28mIV8jbyNwISNVI3AjcSR9I3EjciEhUyNyJGckfSRnfiYhX0d7JjpVWiFWLFglcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfTx1JjtbWiFXUiVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4I08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3omPGJdJHZRJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCQtWiFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3kmPWRYJWdTJWpXIVpHbU9yOGJyczlPc3c4Ynd4OlV4I084YiNPI1A7WyNQI284YiNvI3AhIVMjcH44Ykd6Jj5kXSR1USVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfTx1Jj9uWCFbN18lZ1MlalclbWAlc3AldiFiJXgjdE9yISFTcnNAU3N3ISFTd3hJYngjTyEhUyNPI1AhI08jUCNvISFTI28jcCEjVSNwfiEhU0d5JkBuWiVQLFYlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfVwiLFxuICB0b2tlbml6ZXJzOiBbbGVnYWN5UHJpbnQsIGluZGVudGF0aW9uLCAwLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgbmV3bGluZXNdLFxuICB0b3BSdWxlczoge1wiU2NyaXB0XCI6WzAsM119LFxuICBzcGVjaWFsaXplZDogW3t0ZXJtOiAxODYsIGdldDogdmFsdWUgPT4gc3BlY19pZGVudGlmaWVyW3ZhbHVlXSB8fCAtMX1dLFxuICB0b2tlblByZWM6IDY1OTRcbn0pO1xuXG5leHBvcnRzLnBhcnNlciA9IHBhcnNlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuLy8vIFRoZSBkZWZhdWx0IG1heGltdW0gbGVuZ3RoIG9mIGEgYFRyZWVCdWZmZXJgIG5vZGUuXG5jb25zdCBEZWZhdWx0QnVmZmVyTGVuZ3RoID0gMTAyNDtcbmxldCBuZXh0UHJvcElEID0gMDtcbmNvbnN0IENhY2hlZE5vZGUgPSBuZXcgV2Vha01hcCgpO1xuLy8vIEVhY2ggW25vZGUgdHlwZV0oI3RyZWUuTm9kZVR5cGUpIGNhbiBoYXZlIG1ldGFkYXRhIGFzc29jaWF0ZWQgd2l0aFxuLy8vIGl0IGluIHByb3BzLiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyByZXByZXNlbnQgcHJvcCBuYW1lcy5cbmNsYXNzIE5vZGVQcm9wIHtcbiAgICAvLy8gQ3JlYXRlIGEgbmV3IG5vZGUgcHJvcCB0eXBlLiBZb3UgY2FuIG9wdGlvbmFsbHkgcGFzcyBhXG4gICAgLy8vIGBkZXNlcmlhbGl6ZWAgZnVuY3Rpb24uXG4gICAgY29uc3RydWN0b3IoeyBkZXNlcmlhbGl6ZSB9ID0ge30pIHtcbiAgICAgICAgdGhpcy5pZCA9IG5leHRQcm9wSUQrKztcbiAgICAgICAgdGhpcy5kZXNlcmlhbGl6ZSA9IGRlc2VyaWFsaXplIHx8ICgoKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG5vZGUgdHlwZSBkb2Vzbid0IGRlZmluZSBhIGRlc2VyaWFsaXplIGZ1bmN0aW9uXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8vIENyZWF0ZSBhIHN0cmluZy12YWx1ZWQgbm9kZSBwcm9wIHdob3NlIGRlc2VyaWFsaXplIGZ1bmN0aW9uIGlzXG4gICAgLy8vIHRoZSBpZGVudGl0eSBmdW5jdGlvbi5cbiAgICBzdGF0aWMgc3RyaW5nKCkgeyByZXR1cm4gbmV3IE5vZGVQcm9wKHsgZGVzZXJpYWxpemU6IHN0ciA9PiBzdHIgfSk7IH1cbiAgICAvLy8gQ3JlYXRlIGEgbnVtYmVyLXZhbHVlZCBub2RlIHByb3Agd2hvc2UgZGVzZXJpYWxpemUgZnVuY3Rpb24gaXNcbiAgICAvLy8ganVzdCBgTnVtYmVyYC5cbiAgICBzdGF0aWMgbnVtYmVyKCkgeyByZXR1cm4gbmV3IE5vZGVQcm9wKHsgZGVzZXJpYWxpemU6IE51bWJlciB9KTsgfVxuICAgIC8vLyBDcmVhdGVzIGEgYm9vbGVhbi12YWx1ZWQgbm9kZSBwcm9wIHdob3NlIGRlc2VyaWFsaXplIGZ1bmN0aW9uXG4gICAgLy8vIHJldHVybnMgdHJ1ZSBmb3IgYW55IGlucHV0LlxuICAgIHN0YXRpYyBmbGFnKCkgeyByZXR1cm4gbmV3IE5vZGVQcm9wKHsgZGVzZXJpYWxpemU6ICgpID0+IHRydWUgfSk7IH1cbiAgICAvLy8gU3RvcmUgYSB2YWx1ZSBmb3IgdGhpcyBwcm9wIGluIHRoZSBnaXZlbiBvYmplY3QuIFRoaXMgY2FuIGJlXG4gICAgLy8vIHVzZWZ1bCB3aGVuIGJ1aWxkaW5nIHVwIGEgcHJvcCBvYmplY3QgdG8gcGFzcyB0byB0aGVcbiAgICAvLy8gW2BOb2RlVHlwZWBdKCN0cmVlLk5vZGVUeXBlKSBjb25zdHJ1Y3Rvci4gUmV0dXJucyBpdHMgZmlyc3RcbiAgICAvLy8gYXJndW1lbnQuXG4gICAgc2V0KHByb3BPYmosIHZhbHVlKSB7XG4gICAgICAgIHByb3BPYmpbdGhpcy5pZF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHByb3BPYmo7XG4gICAgfVxuICAgIC8vLyBUaGlzIGlzIG1lYW50IHRvIGJlIHVzZWQgd2l0aFxuICAgIC8vLyBbYE5vZGVTZXQuZXh0ZW5kYF0oI3RyZWUuTm9kZVNldC5leHRlbmQpIG9yXG4gICAgLy8vIFtgUGFyc2VyLndpdGhQcm9wc2BdKCNsZXplci5QYXJzZXIud2l0aFByb3BzKSB0byBjb21wdXRlIHByb3BcbiAgICAvLy8gdmFsdWVzIGZvciBlYWNoIG5vZGUgdHlwZSBpbiB0aGUgc2V0LiBUYWtlcyBhIFttYXRjaFxuICAgIC8vLyBvYmplY3RdKCN0cmVlLk5vZGVUeXBlXm1hdGNoKSBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgdW5kZWZpbmVkXG4gICAgLy8vIGlmIHRoZSBub2RlIHR5cGUgZG9lc24ndCBnZXQgdGhpcyBwcm9wLCBhbmQgdGhlIHByb3AncyB2YWx1ZSBpZlxuICAgIC8vLyBpdCBkb2VzLlxuICAgIGFkZChtYXRjaCkge1xuICAgICAgICBpZiAodHlwZW9mIG1hdGNoICE9IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgIG1hdGNoID0gTm9kZVR5cGUubWF0Y2gobWF0Y2gpO1xuICAgICAgICByZXR1cm4gKHR5cGUpID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBtYXRjaCh0eXBlKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBbdGhpcywgcmVzdWx0XTtcbiAgICAgICAgfTtcbiAgICB9XG59XG4vLy8gUHJvcCB0aGF0IGlzIHVzZWQgdG8gZGVzY3JpYmUgbWF0Y2hpbmcgZGVsaW1pdGVycy4gRm9yIG9wZW5pbmdcbi8vLyBkZWxpbWl0ZXJzLCB0aGlzIGhvbGRzIGFuIGFycmF5IG9mIG5vZGUgbmFtZXMgKHdyaXR0ZW4gYXMgYVxuLy8vIHNwYWNlLXNlcGFyYXRlZCBzdHJpbmcgd2hlbiBkZWNsYXJpbmcgdGhpcyBwcm9wIGluIGEgZ3JhbW1hcilcbi8vLyBmb3IgdGhlIG5vZGUgdHlwZXMgb2YgY2xvc2luZyBkZWxpbWl0ZXJzIHRoYXQgbWF0Y2ggaXQuXG5Ob2RlUHJvcC5jbG9zZWRCeSA9IG5ldyBOb2RlUHJvcCh7IGRlc2VyaWFsaXplOiBzdHIgPT4gc3RyLnNwbGl0KFwiIFwiKSB9KTtcbi8vLyBUaGUgaW52ZXJzZSBvZiBbYG9wZW5lZEJ5YF0oI3RyZWUuTm9kZVByb3BeY2xvc2VkQnkpLiBUaGlzIGlzXG4vLy8gYXR0YWNoZWQgdG8gY2xvc2luZyBkZWxpbWl0ZXJzLCBob2xkaW5nIGFuIGFycmF5IG9mIG5vZGUgbmFtZXNcbi8vLyBvZiB0eXBlcyBvZiBtYXRjaGluZyBvcGVuaW5nIGRlbGltaXRlcnMuXG5Ob2RlUHJvcC5vcGVuZWRCeSA9IG5ldyBOb2RlUHJvcCh7IGRlc2VyaWFsaXplOiBzdHIgPT4gc3RyLnNwbGl0KFwiIFwiKSB9KTtcbi8vLyBVc2VkIHRvIGFzc2lnbiBub2RlIHR5cGVzIHRvIGdyb3VwcyAoZm9yIGV4YW1wbGUsIGFsbCBub2RlXG4vLy8gdHlwZXMgdGhhdCByZXByZXNlbnQgYW4gZXhwcmVzc2lvbiBjb3VsZCBiZSB0YWdnZWQgd2l0aCBhblxuLy8vIGBcIkV4cHJlc3Npb25cImAgZ3JvdXApLlxuTm9kZVByb3AuZ3JvdXAgPSBuZXcgTm9kZVByb3AoeyBkZXNlcmlhbGl6ZTogc3RyID0+IHN0ci5zcGxpdChcIiBcIikgfSk7XG5jb25zdCBub1Byb3BzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbi8vLyBFYWNoIG5vZGUgaW4gYSBzeW50YXggdHJlZSBoYXMgYSBub2RlIHR5cGUgYXNzb2NpYXRlZCB3aXRoIGl0LlxuY2xhc3MgTm9kZVR5cGUge1xuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvLy8gVGhlIG5hbWUgb2YgdGhlIG5vZGUgdHlwZS4gTm90IG5lY2Vzc2FyaWx5IHVuaXF1ZSwgYnV0IGlmIHRoZVxuICAgIC8vLyBncmFtbWFyIHdhcyB3cml0dGVuIHByb3Blcmx5LCBkaWZmZXJlbnQgbm9kZSB0eXBlcyB3aXRoIHRoZVxuICAgIC8vLyBzYW1lIG5hbWUgd2l0aGluIGEgbm9kZSBzZXQgc2hvdWxkIHBsYXkgdGhlIHNhbWUgc2VtYW50aWNcbiAgICAvLy8gcm9sZS5cbiAgICBuYW1lLCBcbiAgICAvLy8gQGludGVybmFsXG4gICAgcHJvcHMsIFxuICAgIC8vLyBUaGUgaWQgb2YgdGhpcyBub2RlIGluIGl0cyBzZXQuIENvcnJlc3BvbmRzIHRvIHRoZSB0ZXJtIGlkc1xuICAgIC8vLyB1c2VkIGluIHRoZSBwYXJzZXIuXG4gICAgaWQsIFxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBmbGFncyA9IDApIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZmxhZ3MgPSBmbGFncztcbiAgICB9XG4gICAgc3RhdGljIGRlZmluZShzcGVjKSB7XG4gICAgICAgIGxldCBwcm9wcyA9IHNwZWMucHJvcHMgJiYgc3BlYy5wcm9wcy5sZW5ndGggPyBPYmplY3QuY3JlYXRlKG51bGwpIDogbm9Qcm9wcztcbiAgICAgICAgbGV0IGZsYWdzID0gKHNwZWMudG9wID8gMSAvKiBUb3AgKi8gOiAwKSB8IChzcGVjLnNraXBwZWQgPyAyIC8qIFNraXBwZWQgKi8gOiAwKSB8XG4gICAgICAgICAgICAoc3BlYy5lcnJvciA/IDQgLyogRXJyb3IgKi8gOiAwKSB8IChzcGVjLm5hbWUgPT0gbnVsbCA/IDggLyogQW5vbnltb3VzICovIDogMCk7XG4gICAgICAgIGxldCB0eXBlID0gbmV3IE5vZGVUeXBlKHNwZWMubmFtZSB8fCBcIlwiLCBwcm9wcywgc3BlYy5pZCwgZmxhZ3MpO1xuICAgICAgICBpZiAoc3BlYy5wcm9wcylcbiAgICAgICAgICAgIGZvciAobGV0IHNyYyBvZiBzcGVjLnByb3BzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHNyYykpXG4gICAgICAgICAgICAgICAgICAgIHNyYyA9IHNyYyh0eXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoc3JjKVxuICAgICAgICAgICAgICAgICAgICBzcmNbMF0uc2V0KHByb3BzLCBzcmNbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZTtcbiAgICB9XG4gICAgLy8vIFJldHJpZXZlcyBhIG5vZGUgcHJvcCBmb3IgdGhpcyB0eXBlLiBXaWxsIHJldHVybiBgdW5kZWZpbmVkYCBpZlxuICAgIC8vLyB0aGUgcHJvcCBpc24ndCBwcmVzZW50IG9uIHRoaXMgbm9kZS5cbiAgICBwcm9wKHByb3ApIHsgcmV0dXJuIHRoaXMucHJvcHNbcHJvcC5pZF07IH1cbiAgICAvLy8gVHJ1ZSB3aGVuIHRoaXMgaXMgdGhlIHRvcCBub2RlIG9mIGEgZ3JhbW1hci5cbiAgICBnZXQgaXNUb3AoKSB7IHJldHVybiAodGhpcy5mbGFncyAmIDEgLyogVG9wICovKSA+IDA7IH1cbiAgICAvLy8gVHJ1ZSB3aGVuIHRoaXMgbm9kZSBpcyBwcm9kdWNlZCBieSBhIHNraXAgcnVsZS5cbiAgICBnZXQgaXNTa2lwcGVkKCkgeyByZXR1cm4gKHRoaXMuZmxhZ3MgJiAyIC8qIFNraXBwZWQgKi8pID4gMDsgfVxuICAgIC8vLyBJbmRpY2F0ZXMgd2hldGhlciB0aGlzIGlzIGFuIGVycm9yIG5vZGUuXG4gICAgZ2V0IGlzRXJyb3IoKSB7IHJldHVybiAodGhpcy5mbGFncyAmIDQgLyogRXJyb3IgKi8pID4gMDsgfVxuICAgIC8vLyBXaGVuIHRydWUsIHRoaXMgbm9kZSB0eXBlIGRvZXNuJ3QgY29ycmVzcG9uZCB0byBhIHVzZXItZGVjbGFyZWRcbiAgICAvLy8gbmFtZWQgbm9kZSwgZm9yIGV4YW1wbGUgYmVjYXVzZSBpdCBpcyB1c2VkIHRvIGNhY2hlIHJlcGV0aXRpb24uXG4gICAgZ2V0IGlzQW5vbnltb3VzKCkgeyByZXR1cm4gKHRoaXMuZmxhZ3MgJiA4IC8qIEFub255bW91cyAqLykgPiAwOyB9XG4gICAgLy8vIFJldHVybnMgdHJ1ZSB3aGVuIHRoaXMgbm9kZSdzIG5hbWUgb3Igb25lIG9mIGl0c1xuICAgIC8vLyBbZ3JvdXBzXSgjdHJlZS5Ob2RlUHJvcF5ncm91cCkgbWF0Y2hlcyB0aGUgZ2l2ZW4gc3RyaW5nLlxuICAgIGlzKG5hbWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5uYW1lID09IG5hbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSB0aGlzLnByb3AoTm9kZVByb3AuZ3JvdXApO1xuICAgICAgICAgICAgcmV0dXJuIGdyb3VwID8gZ3JvdXAuaW5kZXhPZihuYW1lKSA+IC0xIDogZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaWQgPT0gbmFtZTtcbiAgICB9XG4gICAgLy8vIENyZWF0ZSBhIGZ1bmN0aW9uIGZyb20gbm9kZSB0eXBlcyB0byBhcmJpdHJhcnkgdmFsdWVzIGJ5XG4gICAgLy8vIHNwZWNpZnlpbmcgYW4gb2JqZWN0IHdob3NlIHByb3BlcnR5IG5hbWVzIGFyZSBub2RlIG9yXG4gICAgLy8vIFtncm91cF0oI3RyZWUuTm9kZVByb3BeZ3JvdXApIG5hbWVzLiBPZnRlbiB1c2VmdWwgd2l0aFxuICAgIC8vLyBbYE5vZGVQcm9wLmFkZGBdKCN0cmVlLk5vZGVQcm9wLmFkZCkuIFlvdSBjYW4gcHV0IG11bHRpcGxlXG4gICAgLy8vIG5hbWVzLCBzZXBhcmF0ZWQgYnkgc3BhY2VzLCBpbiBhIHNpbmdsZSBwcm9wZXJ0eSBuYW1lIHRvIG1hcFxuICAgIC8vLyBtdWx0aXBsZSBub2RlIG5hbWVzIHRvIGEgc2luZ2xlIHZhbHVlLlxuICAgIHN0YXRpYyBtYXRjaChtYXApIHtcbiAgICAgICAgbGV0IGRpcmVjdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGZvciAobGV0IHByb3AgaW4gbWFwKVxuICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBvZiBwcm9wLnNwbGl0KFwiIFwiKSlcbiAgICAgICAgICAgICAgICBkaXJlY3RbbmFtZV0gPSBtYXBbcHJvcF07XG4gICAgICAgIHJldHVybiAobm9kZSkgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgZ3JvdXBzID0gbm9kZS5wcm9wKE5vZGVQcm9wLmdyb3VwKSwgaSA9IC0xOyBpIDwgKGdyb3VwcyA/IGdyb3Vwcy5sZW5ndGggOiAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gZGlyZWN0W2kgPCAwID8gbm9kZS5uYW1lIDogZ3JvdXBzW2ldXTtcbiAgICAgICAgICAgICAgICBpZiAoZm91bmQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3VuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG59XG4vLy8gQW4gZW1wdHkgZHVtbXkgbm9kZSB0eXBlIHRvIHVzZSB3aGVuIG5vIGFjdHVhbCB0eXBlIGlzIGF2YWlsYWJsZS5cbk5vZGVUeXBlLm5vbmUgPSBuZXcgTm9kZVR5cGUoXCJcIiwgT2JqZWN0LmNyZWF0ZShudWxsKSwgMCwgOCAvKiBBbm9ueW1vdXMgKi8pO1xuLy8vIEEgbm9kZSBzZXQgaG9sZHMgYSBjb2xsZWN0aW9uIG9mIG5vZGUgdHlwZXMuIEl0IGlzIHVzZWQgdG9cbi8vLyBjb21wYWN0bHkgcmVwcmVzZW50IHRyZWVzIGJ5IHN0b3JpbmcgdGhlaXIgdHlwZSBpZHMsIHJhdGhlciB0aGFuIGFcbi8vLyBmdWxsIHBvaW50ZXIgdG8gdGhlIHR5cGUgb2JqZWN0LCBpbiBhIG51bWJlciBhcnJheS4gRWFjaCBwYXJzZXJcbi8vLyBbaGFzXSgjbGV6ZXIuUGFyc2VyLm5vZGVTZXQpIGEgbm9kZSBzZXQsIGFuZCBbdHJlZVxuLy8vIGJ1ZmZlcnNdKCN0cmVlLlRyZWVCdWZmZXIpIGNhbiBvbmx5IHN0b3JlIGNvbGxlY3Rpb25zIG9mIG5vZGVzXG4vLy8gZnJvbSB0aGUgc2FtZSBzZXQuIEEgc2V0IGNhbiBoYXZlIGEgbWF4aW11bSBvZiAyKioxNiAoNjU1MzYpXG4vLy8gbm9kZSB0eXBlcyBpbiBpdCwgc28gdGhhdCB0aGUgaWRzIGZpdCBpbnRvIDE2LWJpdCB0eXBlZCBhcnJheVxuLy8vIHNsb3RzLlxuY2xhc3MgTm9kZVNldCB7XG4gICAgLy8vIENyZWF0ZSBhIHNldCB3aXRoIHRoZSBnaXZlbiB0eXBlcy4gVGhlIGBpZGAgcHJvcGVydHkgb2YgZWFjaFxuICAgIC8vLyB0eXBlIHNob3VsZCBjb3JyZXNwb25kIHRvIGl0cyBwb3NpdGlvbiB3aXRoaW4gdGhlIGFycmF5LlxuICAgIGNvbnN0cnVjdG9yKFxuICAgIC8vLyBUaGUgbm9kZSB0eXBlcyBpbiB0aGlzIHNldCwgYnkgaWQuXG4gICAgdHlwZXMpIHtcbiAgICAgICAgdGhpcy50eXBlcyA9IHR5cGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgaWYgKHR5cGVzW2ldLmlkICE9IGkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJOb2RlIHR5cGUgaWRzIHNob3VsZCBjb3JyZXNwb25kIHRvIGFycmF5IHBvc2l0aW9ucyB3aGVuIGNyZWF0aW5nIGEgbm9kZSBzZXRcIik7XG4gICAgfVxuICAgIC8vLyBDcmVhdGUgYSBjb3B5IG9mIHRoaXMgc2V0IHdpdGggc29tZSBub2RlIHByb3BlcnRpZXMgYWRkZWQuIFRoZVxuICAgIC8vLyBhcmd1bWVudHMgdG8gdGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNyZWF0ZWQgd2l0aFxuICAgIC8vLyBbYE5vZGVQcm9wLmFkZGBdKCN0cmVlLk5vZGVQcm9wLmFkZCkuXG4gICAgZXh0ZW5kKC4uLnByb3BzKSB7XG4gICAgICAgIGxldCBuZXdUeXBlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCB0eXBlIG9mIHRoaXMudHlwZXMpIHtcbiAgICAgICAgICAgIGxldCBuZXdQcm9wcyA9IG51bGw7XG4gICAgICAgICAgICBmb3IgKGxldCBzb3VyY2Ugb2YgcHJvcHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgYWRkID0gc291cmNlKHR5cGUpO1xuICAgICAgICAgICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXdQcm9wcylcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1Byb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdHlwZS5wcm9wcyk7XG4gICAgICAgICAgICAgICAgICAgIGFkZFswXS5zZXQobmV3UHJvcHMsIGFkZFsxXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3VHlwZXMucHVzaChuZXdQcm9wcyA/IG5ldyBOb2RlVHlwZSh0eXBlLm5hbWUsIG5ld1Byb3BzLCB0eXBlLmlkLCB0eXBlLmZsYWdzKSA6IHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgTm9kZVNldChuZXdUeXBlcyk7XG4gICAgfVxufVxuLy8vIEEgcGllY2Ugb2Ygc3ludGF4IHRyZWUuIFRoZXJlIGFyZSB0d28gd2F5cyB0byBhcHByb2FjaCB0aGVzZVxuLy8vIHRyZWVzOiB0aGUgd2F5IHRoZXkgYXJlIGFjdHVhbGx5IHN0b3JlZCBpbiBtZW1vcnksIGFuZCB0aGVcbi8vLyBjb252ZW5pZW50IHdheS5cbi8vL1xuLy8vIFN5bnRheCB0cmVlcyBhcmUgc3RvcmVkIGFzIGEgdHJlZSBvZiBgVHJlZWAgYW5kIGBUcmVlQnVmZmVyYFxuLy8vIG9iamVjdHMuIEJ5IHBhY2tpbmcgZGV0YWlsIGluZm9ybWF0aW9uIGludG8gYFRyZWVCdWZmZXJgIGxlYWZcbi8vLyBub2RlcywgdGhlIHJlcHJlc2VudGF0aW9uIGlzIG1hZGUgYSBsb3QgbW9yZSBtZW1vcnktZWZmaWNpZW50LlxuLy8vXG4vLy8gSG93ZXZlciwgd2hlbiB5b3Ugd2FudCB0byBhY3R1YWxseSB3b3JrIHdpdGggdHJlZSBub2RlcywgdGhpc1xuLy8vIHJlcHJlc2VudGF0aW9uIGlzIHZlcnkgYXdrd2FyZCwgc28gbW9zdCBjbGllbnQgY29kZSB3aWxsIHdhbnQgdG9cbi8vLyB1c2UgdGhlIGBUcmVlQ3Vyc29yYCBpbnRlcmZhY2UgaW5zdGVhZCwgd2hpY2ggcHJvdmlkZXMgYSB2aWV3IG9uXG4vLy8gc29tZSBwYXJ0IG9mIHRoaXMgZGF0YSBzdHJ1Y3R1cmUsIGFuZCBjYW4gYmUgdXNlZCB0byBtb3ZlIGFyb3VuZFxuLy8vIHRvIGFkamFjZW50IG5vZGVzLlxuY2xhc3MgVHJlZSB7XG4gICAgLy8vIENvbnN0cnVjdCBhIG5ldyB0cmVlLiBZb3UgdXN1YWxseSB3YW50IHRvIGdvIHRocm91Z2hcbiAgICAvLy8gW2BUcmVlLmJ1aWxkYF0oI3RyZWUuVHJlZV5idWlsZCkgaW5zdGVhZC5cbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBcbiAgICAvLy8gVGhlIHRyZWUncyBjaGlsZCBub2Rlcy4gQ2hpbGRyZW4gc21hbGwgZW5vdWdoIHRvIGZpdCBpbiBhXG4gICAgLy8vIGBUcmVlQnVmZmVyIHdpbGwgYmUgcmVwcmVzZW50ZWQgYXMgc3VjaCwgb3RoZXIgY2hpbGRyZW4gY2FuIGJlXG4gICAgLy8vIGZ1cnRoZXIgYFRyZWVgIGluc3RhbmNlcyB3aXRoIHRoZWlyIG93biBpbnRlcm5hbCBzdHJ1Y3R1cmUuXG4gICAgY2hpbGRyZW4sIFxuICAgIC8vLyBUaGUgcG9zaXRpb25zIChvZmZzZXRzIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGlzIHRyZWUpIG9mXG4gICAgLy8vIHRoZSBjaGlsZHJlbi5cbiAgICBwb3NpdGlvbnMsIFxuICAgIC8vLyBUaGUgdG90YWwgbGVuZ3RoIG9mIHRoaXMgdHJlZVxuICAgIGxlbmd0aCkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMucG9zaXRpb25zID0gcG9zaXRpb25zO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuLm1hcChjID0+IGMudG9TdHJpbmcoKSkuam9pbigpO1xuICAgICAgICByZXR1cm4gIXRoaXMudHlwZS5uYW1lID8gY2hpbGRyZW4gOlxuICAgICAgICAgICAgKC9cXFcvLnRlc3QodGhpcy50eXBlLm5hbWUpICYmICF0aGlzLnR5cGUuaXNFcnJvciA/IEpTT04uc3RyaW5naWZ5KHRoaXMudHlwZS5uYW1lKSA6IHRoaXMudHlwZS5uYW1lKSArXG4gICAgICAgICAgICAgICAgKGNoaWxkcmVuLmxlbmd0aCA/IFwiKFwiICsgY2hpbGRyZW4gKyBcIilcIiA6IFwiXCIpO1xuICAgIH1cbiAgICAvLy8gR2V0IGEgW3RyZWUgY3Vyc29yXSgjdHJlZS5UcmVlQ3Vyc29yKSByb290ZWQgYXQgdGhpcyB0cmVlLiBXaGVuXG4gICAgLy8vIGBwb3NgIGlzIGdpdmVuLCB0aGUgY3Vyc29yIGlzIFttb3ZlZF0oI3RyZWUuVHJlZUN1cnNvci5tb3ZlVG8pXG4gICAgLy8vIHRvIHRoZSBnaXZlbiBwb3NpdGlvbiBhbmQgc2lkZS5cbiAgICBjdXJzb3IocG9zLCBzaWRlID0gMCkge1xuICAgICAgICBsZXQgc2NvcGUgPSAocG9zICE9IG51bGwgJiYgQ2FjaGVkTm9kZS5nZXQodGhpcykpIHx8IHRoaXMudG9wTm9kZTtcbiAgICAgICAgbGV0IGN1cnNvciA9IG5ldyBUcmVlQ3Vyc29yKHNjb3BlKTtcbiAgICAgICAgaWYgKHBvcyAhPSBudWxsKSB7XG4gICAgICAgICAgICBjdXJzb3IubW92ZVRvKHBvcywgc2lkZSk7XG4gICAgICAgICAgICBDYWNoZWROb2RlLnNldCh0aGlzLCBjdXJzb3IuX3RyZWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJzb3I7XG4gICAgfVxuICAgIC8vLyBHZXQgYSBbdHJlZSBjdXJzb3JdKCN0cmVlLlRyZWVDdXJzb3IpIHRoYXQsIHVubGlrZSByZWd1bGFyXG4gICAgLy8vIGN1cnNvcnMsIGRvZXNuJ3Qgc2tpcCBbYW5vbnltb3VzXSgjdHJlZS5Ob2RlVHlwZS5pc0Fub255bW91cylcbiAgICAvLy8gbm9kZXMuXG4gICAgZnVsbEN1cnNvcigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUcmVlQ3Vyc29yKHRoaXMudG9wTm9kZSwgdHJ1ZSk7XG4gICAgfVxuICAgIC8vLyBHZXQgYSBbc3ludGF4IG5vZGVdKCN0cmVlLlN5bnRheE5vZGUpIG9iamVjdCBmb3IgdGhlIHRvcCBvZiB0aGVcbiAgICAvLy8gdHJlZS5cbiAgICBnZXQgdG9wTm9kZSgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUcmVlTm9kZSh0aGlzLCAwLCAwLCBudWxsKTtcbiAgICB9XG4gICAgLy8vIEdldCB0aGUgW3N5bnRheCBub2RlXSgjdHJlZS5TeW50YXhOb2RlKSBhdCB0aGUgZ2l2ZW4gcG9zaXRpb24uXG4gICAgLy8vIElmIGBzaWRlYCBpcyAtMSwgdGhpcyB3aWxsIG1vdmUgaW50byBub2RlcyB0aGF0IGVuZCBhdCB0aGVcbiAgICAvLy8gcG9zaXRpb24uIElmIDEsIGl0J2xsIG1vdmUgaW50byBub2RlcyB0aGF0IHN0YXJ0IGF0IHRoZVxuICAgIC8vLyBwb3NpdGlvbi4gV2l0aCAwLCBpdCdsbCBvbmx5IGVudGVyIG5vZGVzIHRoYXQgY292ZXIgdGhlIHBvc2l0aW9uXG4gICAgLy8vIGZyb20gYm90aCBzaWRlcy5cbiAgICByZXNvbHZlKHBvcywgc2lkZSA9IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyc29yKHBvcywgc2lkZSkubm9kZTtcbiAgICB9XG4gICAgLy8vIEl0ZXJhdGUgb3ZlciB0aGUgdHJlZSBhbmQgaXRzIGNoaWxkcmVuLCBjYWxsaW5nIGBlbnRlcmAgZm9yIGFueVxuICAgIC8vLyBub2RlIHRoYXQgdG91Y2hlcyB0aGUgYGZyb21gL2B0b2AgcmVnaW9uIChpZiBnaXZlbikgYmVmb3JlXG4gICAgLy8vIHJ1bm5pbmcgb3ZlciBzdWNoIGEgbm9kZSdzIGNoaWxkcmVuLCBhbmQgYGxlYXZlYCAoaWYgZ2l2ZW4pIHdoZW5cbiAgICAvLy8gbGVhdmluZyB0aGUgbm9kZS4gV2hlbiBgZW50ZXJgIHJldHVybnMgYGZhbHNlYCwgdGhlIGdpdmVuIG5vZGVcbiAgICAvLy8gd2lsbCBub3QgaGF2ZSBpdHMgY2hpbGRyZW4gaXRlcmF0ZWQgb3ZlciAob3IgYGxlYXZlYCBjYWxsZWQpLlxuICAgIGl0ZXJhdGUoc3BlYykge1xuICAgICAgICBsZXQgeyBlbnRlciwgbGVhdmUsIGZyb20gPSAwLCB0byA9IHRoaXMubGVuZ3RoIH0gPSBzcGVjO1xuICAgICAgICBmb3IgKGxldCBjID0gdGhpcy5jdXJzb3IoKTs7KSB7XG4gICAgICAgICAgICBsZXQgbXVzdExlYXZlID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoYy5mcm9tIDw9IHRvICYmIGMudG8gPj0gZnJvbSAmJiAoYy50eXBlLmlzQW5vbnltb3VzIHx8IGVudGVyKGMudHlwZSwgYy5mcm9tLCBjLnRvKSAhPT0gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGMuZmlyc3RDaGlsZCgpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoIWMudHlwZS5pc0Fub255bW91cylcbiAgICAgICAgICAgICAgICAgICAgbXVzdExlYXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgICAgICBpZiAobXVzdExlYXZlICYmIGxlYXZlKVxuICAgICAgICAgICAgICAgICAgICBsZWF2ZShjLnR5cGUsIGMuZnJvbSwgYy50byk7XG4gICAgICAgICAgICAgICAgbXVzdExlYXZlID0gYy50eXBlLmlzQW5vbnltb3VzO1xuICAgICAgICAgICAgICAgIGlmIChjLm5leHRTaWJsaW5nKCkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGlmICghYy5wYXJlbnQoKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIG11c3RMZWF2ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8vIEJhbGFuY2UgdGhlIGRpcmVjdCBjaGlsZHJlbiBvZiB0aGlzIHRyZWUuXG4gICAgYmFsYW5jZShtYXhCdWZmZXJMZW5ndGggPSBEZWZhdWx0QnVmZmVyTGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA8PSBCYWxhbmNlQnJhbmNoRmFjdG9yID8gdGhpc1xuICAgICAgICAgICAgOiBiYWxhbmNlUmFuZ2UodGhpcy50eXBlLCBOb2RlVHlwZS5ub25lLCB0aGlzLmNoaWxkcmVuLCB0aGlzLnBvc2l0aW9ucywgMCwgdGhpcy5jaGlsZHJlbi5sZW5ndGgsIDAsIG1heEJ1ZmZlckxlbmd0aCwgdGhpcy5sZW5ndGgsIDApO1xuICAgIH1cbiAgICAvLy8gQnVpbGQgYSB0cmVlIGZyb20gYSBwb3N0Zml4LW9yZGVyZWQgYnVmZmVyIG9mIG5vZGUgaW5mb3JtYXRpb24sXG4gICAgLy8vIG9yIGEgY3Vyc29yIG92ZXIgc3VjaCBhIGJ1ZmZlci5cbiAgICBzdGF0aWMgYnVpbGQoZGF0YSkgeyByZXR1cm4gYnVpbGRUcmVlKGRhdGEpOyB9XG59XG4vLy8gVGhlIGVtcHR5IHRyZWVcblRyZWUuZW1wdHkgPSBuZXcgVHJlZShOb2RlVHlwZS5ub25lLCBbXSwgW10sIDApO1xuLy8gRm9yIHRyZWVzIHRoYXQgbmVlZCBhIGNvbnRleHQgaGFzaCBhdHRhY2hlZCwgd2UncmUgdXNpbmcgdGhpc1xuLy8ga2x1ZGdlIHdoaWNoIGFzc2lnbnMgYW4gZXh0cmEgcHJvcGVydHkgZGlyZWN0bHkgYWZ0ZXJcbi8vIGluaXRpYWxpemF0aW9uIChjcmVhdGluZyBhIHNpbmdsZSBuZXcgb2JqZWN0IHNoYXBlKS5cbmZ1bmN0aW9uIHdpdGhIYXNoKHRyZWUsIGhhc2gpIHtcbiAgICBpZiAoaGFzaClcbiAgICAgICAgdHJlZS5jb250ZXh0SGFzaCA9IGhhc2g7XG4gICAgcmV0dXJuIHRyZWU7XG59XG4vLy8gVHJlZSBidWZmZXJzIGNvbnRhaW4gKHR5cGUsIHN0YXJ0LCBlbmQsIGVuZEluZGV4KSBxdWFkcyBmb3IgZWFjaFxuLy8vIG5vZGUuIEluIHN1Y2ggYSBidWZmZXIsIG5vZGVzIGFyZSBzdG9yZWQgaW4gcHJlZml4IG9yZGVyIChwYXJlbnRzXG4vLy8gYmVmb3JlIGNoaWxkcmVuLCB3aXRoIHRoZSBlbmRJbmRleCBvZiB0aGUgcGFyZW50IGluZGljYXRpbmcgd2hpY2hcbi8vLyBjaGlsZHJlbiBiZWxvbmcgdG8gaXQpXG5jbGFzcyBUcmVlQnVmZmVyIHtcbiAgICAvLy8gQ3JlYXRlIGEgdHJlZSBidWZmZXIgQGludGVybmFsXG4gICAgY29uc3RydWN0b3IoXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGJ1ZmZlciwgXG4gICAgLy8gVGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgZ3JvdXAgb2Ygbm9kZXMgaW4gdGhlIGJ1ZmZlci5cbiAgICBsZW5ndGgsIFxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBzZXQsIHR5cGUgPSBOb2RlVHlwZS5ub25lKSB7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy5zZXQgPSBzZXQ7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5idWZmZXIubGVuZ3RoOykge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jaGlsZFN0cmluZyhpbmRleCkpO1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmJ1ZmZlcltpbmRleCArIDNdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQuam9pbihcIixcIik7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBjaGlsZFN0cmluZyhpbmRleCkge1xuICAgICAgICBsZXQgaWQgPSB0aGlzLmJ1ZmZlcltpbmRleF0sIGVuZEluZGV4ID0gdGhpcy5idWZmZXJbaW5kZXggKyAzXTtcbiAgICAgICAgbGV0IHR5cGUgPSB0aGlzLnNldC50eXBlc1tpZF0sIHJlc3VsdCA9IHR5cGUubmFtZTtcbiAgICAgICAgaWYgKC9cXFcvLnRlc3QocmVzdWx0KSAmJiAhdHlwZS5pc0Vycm9yKVxuICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcbiAgICAgICAgaW5kZXggKz0gNDtcbiAgICAgICAgaWYgKGVuZEluZGV4ID09IGluZGV4KVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gW107XG4gICAgICAgIHdoaWxlIChpbmRleCA8IGVuZEluZGV4KSB7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMuY2hpbGRTdHJpbmcoaW5kZXgpKTtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5idWZmZXJbaW5kZXggKyAzXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0ICsgXCIoXCIgKyBjaGlsZHJlbi5qb2luKFwiLFwiKSArIFwiKVwiO1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgZmluZENoaWxkKHN0YXJ0SW5kZXgsIGVuZEluZGV4LCBkaXIsIGFmdGVyKSB7XG4gICAgICAgIGxldCB7IGJ1ZmZlciB9ID0gdGhpcywgcGljayA9IC0xO1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSAhPSBlbmRJbmRleDsgaSA9IGJ1ZmZlcltpICsgM10pIHtcbiAgICAgICAgICAgIGlmIChhZnRlciAhPSAtMTAwMDAwMDAwIC8qIE5vbmUgKi8pIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnQgPSBidWZmZXJbaSArIDFdLCBlbmQgPSBidWZmZXJbaSArIDJdO1xuICAgICAgICAgICAgICAgIGlmIChkaXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmQgPiBhZnRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpY2sgPSBpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kID4gYWZ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydCA8IGFmdGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgcGljayA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmQgPj0gYWZ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwaWNrID0gaTtcbiAgICAgICAgICAgICAgICBpZiAoZGlyID4gMClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBpY2s7XG4gICAgfVxufVxuY2xhc3MgVHJlZU5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG5vZGUsIGZyb20sIGluZGV4LCBfcGFyZW50KSB7XG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgICAgIHRoaXMuZnJvbSA9IGZyb207XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gX3BhcmVudDtcbiAgICB9XG4gICAgZ2V0IHR5cGUoKSB7IHJldHVybiB0aGlzLm5vZGUudHlwZTsgfVxuICAgIGdldCBuYW1lKCkgeyByZXR1cm4gdGhpcy5ub2RlLnR5cGUubmFtZTsgfVxuICAgIGdldCB0bygpIHsgcmV0dXJuIHRoaXMuZnJvbSArIHRoaXMubm9kZS5sZW5ndGg7IH1cbiAgICBuZXh0Q2hpbGQoaSwgZGlyLCBhZnRlciwgZnVsbCA9IGZhbHNlKSB7XG4gICAgICAgIGZvciAobGV0IHBhcmVudCA9IHRoaXM7Oykge1xuICAgICAgICAgICAgZm9yIChsZXQgeyBjaGlsZHJlbiwgcG9zaXRpb25zIH0gPSBwYXJlbnQubm9kZSwgZSA9IGRpciA+IDAgPyBjaGlsZHJlbi5sZW5ndGggOiAtMTsgaSAhPSBlOyBpICs9IGRpcikge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gY2hpbGRyZW5baV0sIHN0YXJ0ID0gcG9zaXRpb25zW2ldICsgcGFyZW50LmZyb207XG4gICAgICAgICAgICAgICAgaWYgKGFmdGVyICE9IC0xMDAwMDAwMDAgLyogTm9uZSAqLyAmJiAoZGlyIDwgMCA/IHN0YXJ0ID49IGFmdGVyIDogc3RhcnQgKyBuZXh0Lmxlbmd0aCA8PSBhZnRlcikpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmIChuZXh0IGluc3RhbmNlb2YgVHJlZUJ1ZmZlcikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBuZXh0LmZpbmRDaGlsZCgwLCBuZXh0LmJ1ZmZlci5sZW5ndGgsIGRpciwgYWZ0ZXIgPT0gLTEwMDAwMDAwMCAvKiBOb25lICovID8gLTEwMDAwMDAwMCAvKiBOb25lICovIDogYWZ0ZXIgLSBzdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXJOb2RlKG5ldyBCdWZmZXJDb250ZXh0KHBhcmVudCwgbmV4dCwgaSwgc3RhcnQpLCBudWxsLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGZ1bGwgfHwgKCFuZXh0LnR5cGUuaXNBbm9ueW1vdXMgfHwgaGFzQ2hpbGQobmV4dCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbm5lciA9IG5ldyBUcmVlTm9kZShuZXh0LCBzdGFydCwgaSwgcGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGwgfHwgIWlubmVyLnR5cGUuaXNBbm9ueW1vdXMgPyBpbm5lciA6IGlubmVyLm5leHRDaGlsZChkaXIgPCAwID8gbmV4dC5jaGlsZHJlbi5sZW5ndGggLSAxIDogMCwgZGlyLCBhZnRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZ1bGwgfHwgIXBhcmVudC50eXBlLmlzQW5vbnltb3VzKVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgaSA9IHBhcmVudC5pbmRleCArIGRpcjtcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5fcGFyZW50O1xuICAgICAgICAgICAgaWYgKCFwYXJlbnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGZpcnN0Q2hpbGQoKSB7IHJldHVybiB0aGlzLm5leHRDaGlsZCgwLCAxLCAtMTAwMDAwMDAwIC8qIE5vbmUgKi8pOyB9XG4gICAgZ2V0IGxhc3RDaGlsZCgpIHsgcmV0dXJuIHRoaXMubmV4dENoaWxkKHRoaXMubm9kZS5jaGlsZHJlbi5sZW5ndGggLSAxLCAtMSwgLTEwMDAwMDAwMCAvKiBOb25lICovKTsgfVxuICAgIGNoaWxkQWZ0ZXIocG9zKSB7IHJldHVybiB0aGlzLm5leHRDaGlsZCgwLCAxLCBwb3MpOyB9XG4gICAgY2hpbGRCZWZvcmUocG9zKSB7IHJldHVybiB0aGlzLm5leHRDaGlsZCh0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoIC0gMSwgLTEsIHBvcyk7IH1cbiAgICBuZXh0U2lnbmlmaWNhbnRQYXJlbnQoKSB7XG4gICAgICAgIGxldCB2YWwgPSB0aGlzO1xuICAgICAgICB3aGlsZSAodmFsLnR5cGUuaXNBbm9ueW1vdXMgJiYgdmFsLl9wYXJlbnQpXG4gICAgICAgICAgICB2YWwgPSB2YWwuX3BhcmVudDtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudCA/IHRoaXMuX3BhcmVudC5uZXh0U2lnbmlmaWNhbnRQYXJlbnQoKSA6IG51bGw7XG4gICAgfVxuICAgIGdldCBuZXh0U2libGluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudCA/IHRoaXMuX3BhcmVudC5uZXh0Q2hpbGQodGhpcy5pbmRleCArIDEsIDEsIC0xKSA6IG51bGw7XG4gICAgfVxuICAgIGdldCBwcmV2U2libGluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudCA/IHRoaXMuX3BhcmVudC5uZXh0Q2hpbGQodGhpcy5pbmRleCAtIDEsIC0xLCAtMSkgOiBudWxsO1xuICAgIH1cbiAgICBnZXQgY3Vyc29yKCkgeyByZXR1cm4gbmV3IFRyZWVDdXJzb3IodGhpcyk7IH1cbiAgICByZXNvbHZlKHBvcywgc2lkZSA9IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyc29yLm1vdmVUbyhwb3MsIHNpZGUpLm5vZGU7XG4gICAgfVxuICAgIGdldENoaWxkKHR5cGUsIGJlZm9yZSA9IG51bGwsIGFmdGVyID0gbnVsbCkge1xuICAgICAgICBsZXQgciA9IGdldENoaWxkcmVuKHRoaXMsIHR5cGUsIGJlZm9yZSwgYWZ0ZXIpO1xuICAgICAgICByZXR1cm4gci5sZW5ndGggPyByWzBdIDogbnVsbDtcbiAgICB9XG4gICAgZ2V0Q2hpbGRyZW4odHlwZSwgYmVmb3JlID0gbnVsbCwgYWZ0ZXIgPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBnZXRDaGlsZHJlbih0aGlzLCB0eXBlLCBiZWZvcmUsIGFmdGVyKTtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHRvU3RyaW5nKCkgeyByZXR1cm4gdGhpcy5ub2RlLnRvU3RyaW5nKCk7IH1cbn1cbmZ1bmN0aW9uIGdldENoaWxkcmVuKG5vZGUsIHR5cGUsIGJlZm9yZSwgYWZ0ZXIpIHtcbiAgICBsZXQgY3VyID0gbm9kZS5jdXJzb3IsIHJlc3VsdCA9IFtdO1xuICAgIGlmICghY3VyLmZpcnN0Q2hpbGQoKSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoYmVmb3JlICE9IG51bGwpXG4gICAgICAgIHdoaWxlICghY3VyLnR5cGUuaXMoYmVmb3JlKSlcbiAgICAgICAgICAgIGlmICghY3VyLm5leHRTaWJsaW5nKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICBmb3IgKDs7KSB7XG4gICAgICAgIGlmIChhZnRlciAhPSBudWxsICYmIGN1ci50eXBlLmlzKGFmdGVyKSlcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIGlmIChjdXIudHlwZS5pcyh0eXBlKSlcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGN1ci5ub2RlKTtcbiAgICAgICAgaWYgKCFjdXIubmV4dFNpYmxpbmcoKSlcbiAgICAgICAgICAgIHJldHVybiBhZnRlciA9PSBudWxsID8gcmVzdWx0IDogW107XG4gICAgfVxufVxuY2xhc3MgQnVmZmVyQ29udGV4dCB7XG4gICAgY29uc3RydWN0b3IocGFyZW50LCBidWZmZXIsIGluZGV4LCBzdGFydCkge1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgIH1cbn1cbmNsYXNzIEJ1ZmZlck5vZGUge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQsIF9wYXJlbnQsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IF9wYXJlbnQ7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy50eXBlID0gY29udGV4dC5idWZmZXIuc2V0LnR5cGVzW2NvbnRleHQuYnVmZmVyLmJ1ZmZlcltpbmRleF1dO1xuICAgIH1cbiAgICBnZXQgbmFtZSgpIHsgcmV0dXJuIHRoaXMudHlwZS5uYW1lOyB9XG4gICAgZ2V0IGZyb20oKSB7IHJldHVybiB0aGlzLmNvbnRleHQuc3RhcnQgKyB0aGlzLmNvbnRleHQuYnVmZmVyLmJ1ZmZlclt0aGlzLmluZGV4ICsgMV07IH1cbiAgICBnZXQgdG8oKSB7IHJldHVybiB0aGlzLmNvbnRleHQuc3RhcnQgKyB0aGlzLmNvbnRleHQuYnVmZmVyLmJ1ZmZlclt0aGlzLmluZGV4ICsgMl07IH1cbiAgICBjaGlsZChkaXIsIGFmdGVyKSB7XG4gICAgICAgIGxldCB7IGJ1ZmZlciB9ID0gdGhpcy5jb250ZXh0O1xuICAgICAgICBsZXQgaW5kZXggPSBidWZmZXIuZmluZENoaWxkKHRoaXMuaW5kZXggKyA0LCBidWZmZXIuYnVmZmVyW3RoaXMuaW5kZXggKyAzXSwgZGlyLCBhZnRlciA9PSAtMTAwMDAwMDAwIC8qIE5vbmUgKi8gPyAtMTAwMDAwMDAwIC8qIE5vbmUgKi8gOiBhZnRlciAtIHRoaXMuY29udGV4dC5zdGFydCk7XG4gICAgICAgIHJldHVybiBpbmRleCA8IDAgPyBudWxsIDogbmV3IEJ1ZmZlck5vZGUodGhpcy5jb250ZXh0LCB0aGlzLCBpbmRleCk7XG4gICAgfVxuICAgIGdldCBmaXJzdENoaWxkKCkgeyByZXR1cm4gdGhpcy5jaGlsZCgxLCAtMTAwMDAwMDAwIC8qIE5vbmUgKi8pOyB9XG4gICAgZ2V0IGxhc3RDaGlsZCgpIHsgcmV0dXJuIHRoaXMuY2hpbGQoLTEsIC0xMDAwMDAwMDAgLyogTm9uZSAqLyk7IH1cbiAgICBjaGlsZEFmdGVyKHBvcykgeyByZXR1cm4gdGhpcy5jaGlsZCgxLCBwb3MpOyB9XG4gICAgY2hpbGRCZWZvcmUocG9zKSB7IHJldHVybiB0aGlzLmNoaWxkKC0xLCBwb3MpOyB9XG4gICAgZ2V0IHBhcmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudCB8fCB0aGlzLmNvbnRleHQucGFyZW50Lm5leHRTaWduaWZpY2FudFBhcmVudCgpO1xuICAgIH1cbiAgICBleHRlcm5hbFNpYmxpbmcoZGlyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyBudWxsIDogdGhpcy5jb250ZXh0LnBhcmVudC5uZXh0Q2hpbGQodGhpcy5jb250ZXh0LmluZGV4ICsgZGlyLCBkaXIsIC0xKTtcbiAgICB9XG4gICAgZ2V0IG5leHRTaWJsaW5nKCkge1xuICAgICAgICBsZXQgeyBidWZmZXIgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgbGV0IGFmdGVyID0gYnVmZmVyLmJ1ZmZlclt0aGlzLmluZGV4ICsgM107XG4gICAgICAgIGlmIChhZnRlciA8ICh0aGlzLl9wYXJlbnQgPyBidWZmZXIuYnVmZmVyW3RoaXMuX3BhcmVudC5pbmRleCArIDNdIDogYnVmZmVyLmJ1ZmZlci5sZW5ndGgpKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXJOb2RlKHRoaXMuY29udGV4dCwgdGhpcy5fcGFyZW50LCBhZnRlcik7XG4gICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsU2libGluZygxKTtcbiAgICB9XG4gICAgZ2V0IHByZXZTaWJsaW5nKCkge1xuICAgICAgICBsZXQgeyBidWZmZXIgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgbGV0IHBhcmVudFN0YXJ0ID0gdGhpcy5fcGFyZW50ID8gdGhpcy5fcGFyZW50LmluZGV4ICsgNCA6IDA7XG4gICAgICAgIGlmICh0aGlzLmluZGV4ID09IHBhcmVudFN0YXJ0KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXh0ZXJuYWxTaWJsaW5nKC0xKTtcbiAgICAgICAgcmV0dXJuIG5ldyBCdWZmZXJOb2RlKHRoaXMuY29udGV4dCwgdGhpcy5fcGFyZW50LCBidWZmZXIuZmluZENoaWxkKHBhcmVudFN0YXJ0LCB0aGlzLmluZGV4LCAtMSwgLTEwMDAwMDAwMCAvKiBOb25lICovKSk7XG4gICAgfVxuICAgIGdldCBjdXJzb3IoKSB7IHJldHVybiBuZXcgVHJlZUN1cnNvcih0aGlzKTsgfVxuICAgIHJlc29sdmUocG9zLCBzaWRlID0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJzb3IubW92ZVRvKHBvcywgc2lkZSkubm9kZTtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHRvU3RyaW5nKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LmJ1ZmZlci5jaGlsZFN0cmluZyh0aGlzLmluZGV4KTsgfVxuICAgIGdldENoaWxkKHR5cGUsIGJlZm9yZSA9IG51bGwsIGFmdGVyID0gbnVsbCkge1xuICAgICAgICBsZXQgciA9IGdldENoaWxkcmVuKHRoaXMsIHR5cGUsIGJlZm9yZSwgYWZ0ZXIpO1xuICAgICAgICByZXR1cm4gci5sZW5ndGggPyByWzBdIDogbnVsbDtcbiAgICB9XG4gICAgZ2V0Q2hpbGRyZW4odHlwZSwgYmVmb3JlID0gbnVsbCwgYWZ0ZXIgPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBnZXRDaGlsZHJlbih0aGlzLCB0eXBlLCBiZWZvcmUsIGFmdGVyKTtcbiAgICB9XG59XG4vLy8gQSB0cmVlIGN1cnNvciBvYmplY3QgZm9jdXNlcyBvbiBhIGdpdmVuIG5vZGUgaW4gYSBzeW50YXggdHJlZSwgYW5kXG4vLy8gYWxsb3dzIHlvdSB0byBtb3ZlIHRvIGFkamFjZW50IG5vZGVzLlxuY2xhc3MgVHJlZUN1cnNvciB7XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGNvbnN0cnVjdG9yKG5vZGUsIGZ1bGwgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmZ1bGwgPSBmdWxsO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7XG4gICAgICAgIHRoaXMuYnVmZmVyTm9kZSA9IG51bGw7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgVHJlZU5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMueWllbGROb2RlKG5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdHJlZSA9IG5vZGUuY29udGV4dC5wYXJlbnQ7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IG5vZGUuY29udGV4dDtcbiAgICAgICAgICAgIGZvciAobGV0IG4gPSBub2RlLl9wYXJlbnQ7IG47IG4gPSBuLl9wYXJlbnQpXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFjay51bnNoaWZ0KG4uaW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJOb2RlID0gbm9kZTtcbiAgICAgICAgICAgIHRoaXMueWllbGRCdWYobm9kZS5pbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8vIFNob3J0aGFuZCBmb3IgYC50eXBlLm5hbWVgLlxuICAgIGdldCBuYW1lKCkgeyByZXR1cm4gdGhpcy50eXBlLm5hbWU7IH1cbiAgICB5aWVsZE5vZGUobm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHRoaXMuX3RyZWUgPSBub2RlO1xuICAgICAgICB0aGlzLnR5cGUgPSBub2RlLnR5cGU7XG4gICAgICAgIHRoaXMuZnJvbSA9IG5vZGUuZnJvbTtcbiAgICAgICAgdGhpcy50byA9IG5vZGUudG87XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB5aWVsZEJ1ZihpbmRleCwgdHlwZSkge1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGxldCB7IHN0YXJ0LCBidWZmZXIgfSA9IHRoaXMuYnVmZmVyO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlIHx8IGJ1ZmZlci5zZXQudHlwZXNbYnVmZmVyLmJ1ZmZlcltpbmRleF1dO1xuICAgICAgICB0aGlzLmZyb20gPSBzdGFydCArIGJ1ZmZlci5idWZmZXJbaW5kZXggKyAxXTtcbiAgICAgICAgdGhpcy50byA9IHN0YXJ0ICsgYnVmZmVyLmJ1ZmZlcltpbmRleCArIDJdO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgeWllbGQobm9kZSkge1xuICAgICAgICBpZiAoIW5vZGUpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgVHJlZU5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnlpZWxkTm9kZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1ZmZlciA9IG5vZGUuY29udGV4dDtcbiAgICAgICAgcmV0dXJuIHRoaXMueWllbGRCdWYobm9kZS5pbmRleCwgbm9kZS50eXBlKTtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXIgPyB0aGlzLmJ1ZmZlci5idWZmZXIuY2hpbGRTdHJpbmcodGhpcy5pbmRleCkgOiB0aGlzLl90cmVlLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBlbnRlcihkaXIsIGFmdGVyKSB7XG4gICAgICAgIGlmICghdGhpcy5idWZmZXIpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy55aWVsZCh0aGlzLl90cmVlLm5leHRDaGlsZChkaXIgPCAwID8gdGhpcy5fdHJlZS5ub2RlLmNoaWxkcmVuLmxlbmd0aCAtIDEgOiAwLCBkaXIsIGFmdGVyLCB0aGlzLmZ1bGwpKTtcbiAgICAgICAgbGV0IHsgYnVmZmVyIH0gPSB0aGlzLmJ1ZmZlcjtcbiAgICAgICAgbGV0IGluZGV4ID0gYnVmZmVyLmZpbmRDaGlsZCh0aGlzLmluZGV4ICsgNCwgYnVmZmVyLmJ1ZmZlclt0aGlzLmluZGV4ICsgM10sIGRpciwgYWZ0ZXIgPT0gLTEwMDAwMDAwMCAvKiBOb25lICovID8gLTEwMDAwMDAwMCAvKiBOb25lICovIDogYWZ0ZXIgLSB0aGlzLmJ1ZmZlci5zdGFydCk7XG4gICAgICAgIGlmIChpbmRleCA8IDApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHRoaXMuc3RhY2sucHVzaCh0aGlzLmluZGV4KTtcbiAgICAgICAgcmV0dXJuIHRoaXMueWllbGRCdWYoaW5kZXgpO1xuICAgIH1cbiAgICAvLy8gTW92ZSB0aGUgY3Vyc29yIHRvIHRoaXMgbm9kZSdzIGZpcnN0IGNoaWxkLiBXaGVuIHRoaXMgcmV0dXJuc1xuICAgIC8vLyBmYWxzZSwgdGhlIG5vZGUgaGFzIG5vIGNoaWxkLCBhbmQgdGhlIGN1cnNvciBoYXMgbm90IGJlZW4gbW92ZWQuXG4gICAgZmlyc3RDaGlsZCgpIHsgcmV0dXJuIHRoaXMuZW50ZXIoMSwgLTEwMDAwMDAwMCAvKiBOb25lICovKTsgfVxuICAgIC8vLyBNb3ZlIHRoZSBjdXJzb3IgdG8gdGhpcyBub2RlJ3MgbGFzdCBjaGlsZC5cbiAgICBsYXN0Q2hpbGQoKSB7IHJldHVybiB0aGlzLmVudGVyKC0xLCAtMTAwMDAwMDAwIC8qIE5vbmUgKi8pOyB9XG4gICAgLy8vIE1vdmUgdGhlIGN1cnNvciB0byB0aGUgZmlyc3QgY2hpbGQgdGhhdCBzdGFydHMgYXQgb3IgYWZ0ZXIgYHBvc2AuXG4gICAgY2hpbGRBZnRlcihwb3MpIHsgcmV0dXJuIHRoaXMuZW50ZXIoMSwgcG9zKTsgfVxuICAgIC8vLyBNb3ZlIHRvIHRoZSBsYXN0IGNoaWxkIHRoYXQgZW5kcyBhdCBvciBiZWZvcmUgYHBvc2AuXG4gICAgY2hpbGRCZWZvcmUocG9zKSB7IHJldHVybiB0aGlzLmVudGVyKC0xLCBwb3MpOyB9XG4gICAgLy8vIE1vdmUgdGhlIG5vZGUncyBwYXJlbnQgbm9kZSwgaWYgdGhpcyBpc24ndCB0aGUgdG9wIG5vZGUuXG4gICAgcGFyZW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMueWllbGROb2RlKHRoaXMuZnVsbCA/IHRoaXMuX3RyZWUuX3BhcmVudCA6IHRoaXMuX3RyZWUucGFyZW50KTtcbiAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMueWllbGRCdWYodGhpcy5zdGFjay5wb3AoKSk7XG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLmZ1bGwgPyB0aGlzLmJ1ZmZlci5wYXJlbnQgOiB0aGlzLmJ1ZmZlci5wYXJlbnQubmV4dFNpZ25pZmljYW50UGFyZW50KCk7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMueWllbGROb2RlKHBhcmVudCk7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBzaWJsaW5nKGRpcikge1xuICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKVxuICAgICAgICAgICAgcmV0dXJuICF0aGlzLl90cmVlLl9wYXJlbnQgPyBmYWxzZVxuICAgICAgICAgICAgICAgIDogdGhpcy55aWVsZCh0aGlzLl90cmVlLl9wYXJlbnQubmV4dENoaWxkKHRoaXMuX3RyZWUuaW5kZXggKyBkaXIsIGRpciwgLTEwMDAwMDAwMCAvKiBOb25lICovLCB0aGlzLmZ1bGwpKTtcbiAgICAgICAgbGV0IHsgYnVmZmVyIH0gPSB0aGlzLmJ1ZmZlciwgZCA9IHRoaXMuc3RhY2subGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKGRpciA8IDApIHtcbiAgICAgICAgICAgIGxldCBwYXJlbnRTdGFydCA9IGQgPCAwID8gMCA6IHRoaXMuc3RhY2tbZF0gKyA0O1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggIT0gcGFyZW50U3RhcnQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueWllbGRCdWYoYnVmZmVyLmZpbmRDaGlsZChwYXJlbnRTdGFydCwgdGhpcy5pbmRleCwgLTEsIC0xMDAwMDAwMDAgLyogTm9uZSAqLykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGFmdGVyID0gYnVmZmVyLmJ1ZmZlclt0aGlzLmluZGV4ICsgM107XG4gICAgICAgICAgICBpZiAoYWZ0ZXIgPCAoZCA8IDAgPyBidWZmZXIuYnVmZmVyLmxlbmd0aCA6IGJ1ZmZlci5idWZmZXJbdGhpcy5zdGFja1tkXSArIDNdKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy55aWVsZEJ1ZihhZnRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGQgPCAwID8gdGhpcy55aWVsZCh0aGlzLmJ1ZmZlci5wYXJlbnQubmV4dENoaWxkKHRoaXMuYnVmZmVyLmluZGV4ICsgZGlyLCBkaXIsIC0xMDAwMDAwMDAgLyogTm9uZSAqLywgdGhpcy5mdWxsKSkgOiBmYWxzZTtcbiAgICB9XG4gICAgLy8vIE1vdmUgdG8gdGhpcyBub2RlJ3MgbmV4dCBzaWJsaW5nLCBpZiBhbnkuXG4gICAgbmV4dFNpYmxpbmcoKSB7IHJldHVybiB0aGlzLnNpYmxpbmcoMSk7IH1cbiAgICAvLy8gTW92ZSB0byB0aGlzIG5vZGUncyBwcmV2aW91cyBzaWJsaW5nLCBpZiBhbnkuXG4gICAgcHJldlNpYmxpbmcoKSB7IHJldHVybiB0aGlzLnNpYmxpbmcoLTEpOyB9XG4gICAgYXRMYXN0Tm9kZShkaXIpIHtcbiAgICAgICAgbGV0IGluZGV4LCBwYXJlbnQsIHsgYnVmZmVyIH0gPSB0aGlzO1xuICAgICAgICBpZiAoYnVmZmVyKSB7XG4gICAgICAgICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGV4IDwgYnVmZmVyLmJ1ZmZlci5idWZmZXIubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5kZXg7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1ZmZlci5idWZmZXIuYnVmZmVyW2kgKyAzXSA8IHRoaXMuaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoeyBpbmRleCwgcGFyZW50IH0gPSBidWZmZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKHsgaW5kZXgsIF9wYXJlbnQ6IHBhcmVudCB9ID0gdGhpcy5fdHJlZSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7IHBhcmVudDsgeyBpbmRleCwgX3BhcmVudDogcGFyZW50IH0gPSBwYXJlbnQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBpbmRleCArIGRpciwgZSA9IGRpciA8IDAgPyAtMSA6IHBhcmVudC5ub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSAhPSBlOyBpICs9IGRpcikge1xuICAgICAgICAgICAgICAgIGxldCBjaGlsZCA9IHBhcmVudC5ub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZ1bGwgfHwgIWNoaWxkLnR5cGUuaXNBbm9ueW1vdXMgfHwgY2hpbGQgaW5zdGFuY2VvZiBUcmVlQnVmZmVyIHx8IGhhc0NoaWxkKGNoaWxkKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBtb3ZlKGRpcikge1xuICAgICAgICBpZiAodGhpcy5lbnRlcihkaXIsIC0xMDAwMDAwMDAgLyogTm9uZSAqLykpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2libGluZyhkaXIpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXRMYXN0Tm9kZShkaXIpIHx8ICF0aGlzLnBhcmVudCgpKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLy8gTW92ZSB0byB0aGUgbmV4dCBub2RlIGluIGFcbiAgICAvLy8gW3ByZS1vcmRlcl0oaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVHJlZV90cmF2ZXJzYWwjUHJlLW9yZGVyXyhOTFIpKVxuICAgIC8vLyB0cmF2ZXJzYWwsIGdvaW5nIGZyb20gYSBub2RlIHRvIGl0cyBmaXJzdCBjaGlsZCBvciwgaWYgdGhlXG4gICAgLy8vIGN1cnJlbnQgbm9kZSBpcyBlbXB0eSwgaXRzIG5leHQgc2libGluZyBvciB0aGUgbmV4dCBzaWJsaW5nIG9mXG4gICAgLy8vIHRoZSBmaXJzdCBwYXJlbnQgbm9kZSB0aGF0IGhhcyBvbmUuXG4gICAgbmV4dCgpIHsgcmV0dXJuIHRoaXMubW92ZSgxKTsgfVxuICAgIC8vLyBNb3ZlIHRvIHRoZSBuZXh0IG5vZGUgaW4gYSBsYXN0LXRvLWZpcnN0IHByZS1vcmRlciB0cmF2ZXJhbC4gQVxuICAgIC8vLyBub2RlIGlzIGZvbGxvd2VkIGJ5IGlzdCBsYXN0IGNoaWxkIG9yLCBpZiBpdCBoYXMgbm9uZSwgaXRzXG4gICAgLy8vIHByZXZpb3VzIHNpYmxpbmcgb3IgdGhlIHByZXZpb3VzIHNpYmxpbmcgb2YgdGhlIGZpcnN0IHBhcmVudFxuICAgIC8vLyBub2RlIHRoYXQgaGFzIG9uZS5cbiAgICBwcmV2KCkgeyByZXR1cm4gdGhpcy5tb3ZlKC0xKTsgfVxuICAgIC8vLyBNb3ZlIHRoZSBjdXJzb3IgdG8gdGhlIGlubmVybW9zdCBub2RlIHRoYXQgY292ZXJzIGBwb3NgLiBJZlxuICAgIC8vLyBgc2lkZWAgaXMgLTEsIGl0IHdpbGwgZW50ZXIgbm9kZXMgdGhhdCBlbmQgYXQgYHBvc2AuIElmIGl0IGlzIDEsXG4gICAgLy8vIGl0IHdpbGwgZW50ZXIgbm9kZXMgdGhhdCBzdGFydCBhdCBgcG9zYC5cbiAgICBtb3ZlVG8ocG9zLCBzaWRlID0gMCkge1xuICAgICAgICAvLyBNb3ZlIHVwIHRvIGEgbm9kZSB0aGF0IGFjdHVhbGx5IGhvbGRzIHRoZSBwb3NpdGlvbiwgaWYgcG9zc2libGVcbiAgICAgICAgd2hpbGUgKHRoaXMuZnJvbSA9PSB0aGlzLnRvIHx8XG4gICAgICAgICAgICAoc2lkZSA8IDEgPyB0aGlzLmZyb20gPj0gcG9zIDogdGhpcy5mcm9tID4gcG9zKSB8fFxuICAgICAgICAgICAgKHNpZGUgPiAtMSA/IHRoaXMudG8gPD0gcG9zIDogdGhpcy50byA8IHBvcykpXG4gICAgICAgICAgICBpZiAoIXRoaXMucGFyZW50KCkpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFRoZW4gc2NhbiBkb3duIGludG8gY2hpbGQgbm9kZXMgYXMgZmFyIGFzIHBvc3NpYmxlXG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGlmIChzaWRlIDwgMCA/ICF0aGlzLmNoaWxkQmVmb3JlKHBvcykgOiAhdGhpcy5jaGlsZEFmdGVyKHBvcykpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBpZiAodGhpcy5mcm9tID09IHRoaXMudG8gfHxcbiAgICAgICAgICAgICAgICAoc2lkZSA8IDEgPyB0aGlzLmZyb20gPj0gcG9zIDogdGhpcy5mcm9tID4gcG9zKSB8fFxuICAgICAgICAgICAgICAgIChzaWRlID4gLTEgPyB0aGlzLnRvIDw9IHBvcyA6IHRoaXMudG8gPCBwb3MpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8vIEdldCBhIFtzeW50YXggbm9kZV0oI3RyZWUuU3ludGF4Tm9kZSkgYXQgdGhlIGN1cnNvcidzIGN1cnJlbnRcbiAgICAvLy8gcG9zaXRpb24uXG4gICAgZ2V0IG5vZGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5idWZmZXIpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJlZTtcbiAgICAgICAgbGV0IGNhY2hlID0gdGhpcy5idWZmZXJOb2RlLCByZXN1bHQgPSBudWxsLCBkZXB0aCA9IDA7XG4gICAgICAgIGlmIChjYWNoZSAmJiBjYWNoZS5jb250ZXh0ID09IHRoaXMuYnVmZmVyKSB7XG4gICAgICAgICAgICBzY2FuOiBmb3IgKGxldCBpbmRleCA9IHRoaXMuaW5kZXgsIGQgPSB0aGlzLnN0YWNrLmxlbmd0aDsgZCA+PSAwOykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGMgPSBjYWNoZTsgYzsgYyA9IGMuX3BhcmVudClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMuaW5kZXggPT0gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSB0aGlzLmluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHRoID0gZCArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhayBzY2FuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLnN0YWNrWy0tZF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IGRlcHRoOyBpIDwgdGhpcy5zdGFjay5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIHJlc3VsdCA9IG5ldyBCdWZmZXJOb2RlKHRoaXMuYnVmZmVyLCByZXN1bHQsIHRoaXMuc3RhY2tbaV0pO1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJOb2RlID0gbmV3IEJ1ZmZlck5vZGUodGhpcy5idWZmZXIsIHJlc3VsdCwgdGhpcy5pbmRleCk7XG4gICAgfVxuICAgIC8vLyBHZXQgdGhlIFt0cmVlXSgjdHJlZS5UcmVlKSB0aGF0IHJlcHJlc2VudHMgdGhlIGN1cnJlbnQgbm9kZSwgaWZcbiAgICAvLy8gYW55LiBXaWxsIHJldHVybiBudWxsIHdoZW4gdGhlIG5vZGUgaXMgaW4gYSBbdHJlZVxuICAgIC8vLyBidWZmZXJdKCN0cmVlLlRyZWVCdWZmZXIpLlxuICAgIGdldCB0cmVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXIgPyBudWxsIDogdGhpcy5fdHJlZS5ub2RlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGhhc0NoaWxkKHRyZWUpIHtcbiAgICByZXR1cm4gdHJlZS5jaGlsZHJlbi5zb21lKGNoID0+ICFjaC50eXBlLmlzQW5vbnltb3VzIHx8IGNoIGluc3RhbmNlb2YgVHJlZUJ1ZmZlciB8fCBoYXNDaGlsZChjaCkpO1xufVxuY2xhc3MgRmxhdEJ1ZmZlckN1cnNvciB7XG4gICAgY29uc3RydWN0b3IoYnVmZmVyLCBpbmRleCkge1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIH1cbiAgICBnZXQgaWQoKSB7IHJldHVybiB0aGlzLmJ1ZmZlclt0aGlzLmluZGV4IC0gNF07IH1cbiAgICBnZXQgc3RhcnQoKSB7IHJldHVybiB0aGlzLmJ1ZmZlclt0aGlzLmluZGV4IC0gM107IH1cbiAgICBnZXQgZW5kKCkgeyByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5pbmRleCAtIDJdOyB9XG4gICAgZ2V0IHNpemUoKSB7IHJldHVybiB0aGlzLmJ1ZmZlclt0aGlzLmluZGV4IC0gMV07IH1cbiAgICBnZXQgcG9zKCkgeyByZXR1cm4gdGhpcy5pbmRleDsgfVxuICAgIG5leHQoKSB7IHRoaXMuaW5kZXggLT0gNDsgfVxuICAgIGZvcmsoKSB7IHJldHVybiBuZXcgRmxhdEJ1ZmZlckN1cnNvcih0aGlzLmJ1ZmZlciwgdGhpcy5pbmRleCk7IH1cbn1cbmNvbnN0IEJhbGFuY2VCcmFuY2hGYWN0b3IgPSA4O1xuZnVuY3Rpb24gYnVpbGRUcmVlKGRhdGEpIHtcbiAgICB2YXIgX2E7XG4gICAgbGV0IHsgYnVmZmVyLCBub2RlU2V0LCB0b3BJRCA9IDAsIG1heEJ1ZmZlckxlbmd0aCA9IERlZmF1bHRCdWZmZXJMZW5ndGgsIHJldXNlZCA9IFtdLCBtaW5SZXBlYXRUeXBlID0gbm9kZVNldC50eXBlcy5sZW5ndGggfSA9IGRhdGE7XG4gICAgbGV0IGN1cnNvciA9IEFycmF5LmlzQXJyYXkoYnVmZmVyKSA/IG5ldyBGbGF0QnVmZmVyQ3Vyc29yKGJ1ZmZlciwgYnVmZmVyLmxlbmd0aCkgOiBidWZmZXI7XG4gICAgbGV0IHR5cGVzID0gbm9kZVNldC50eXBlcztcbiAgICBsZXQgY29udGV4dEhhc2ggPSAwO1xuICAgIGZ1bmN0aW9uIHRha2VOb2RlKHBhcmVudFN0YXJ0LCBtaW5Qb3MsIGNoaWxkcmVuLCBwb3NpdGlvbnMsIGluUmVwZWF0KSB7XG4gICAgICAgIGxldCB7IGlkLCBzdGFydCwgZW5kLCBzaXplIH0gPSBjdXJzb3I7XG4gICAgICAgIGxldCBzdGFydFBvcyA9IHN0YXJ0IC0gcGFyZW50U3RhcnQ7XG4gICAgICAgIGlmIChzaXplIDwgMCkge1xuICAgICAgICAgICAgaWYgKHNpemUgPT0gLTEpIHsgLy8gUmV1c2VkIG5vZGVcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHJldXNlZFtpZF0pO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKHN0YXJ0UG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvLyBDb250ZXh0IGNoYW5nZVxuICAgICAgICAgICAgICAgIGNvbnRleHRIYXNoID0gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjdXJzb3IubmV4dCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0eXBlID0gdHlwZXNbaWRdLCBub2RlLCBidWZmZXI7XG4gICAgICAgIGlmIChlbmQgLSBzdGFydCA8PSBtYXhCdWZmZXJMZW5ndGggJiYgKGJ1ZmZlciA9IGZpbmRCdWZmZXJTaXplKGN1cnNvci5wb3MgLSBtaW5Qb3MsIGluUmVwZWF0KSkpIHtcbiAgICAgICAgICAgIC8vIFNtYWxsIGVub3VnaCBmb3IgYSBidWZmZXIsIGFuZCBubyByZXVzZWQgbm9kZXMgaW5zaWRlXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG5ldyBVaW50MTZBcnJheShidWZmZXIuc2l6ZSAtIGJ1ZmZlci5za2lwKTtcbiAgICAgICAgICAgIGxldCBlbmRQb3MgPSBjdXJzb3IucG9zIC0gYnVmZmVyLnNpemUsIGluZGV4ID0gZGF0YS5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoY3Vyc29yLnBvcyA+IGVuZFBvcylcbiAgICAgICAgICAgICAgICBpbmRleCA9IGNvcHlUb0J1ZmZlcihidWZmZXIuc3RhcnQsIGRhdGEsIGluZGV4LCBpblJlcGVhdCk7XG4gICAgICAgICAgICBub2RlID0gbmV3IFRyZWVCdWZmZXIoZGF0YSwgZW5kIC0gYnVmZmVyLnN0YXJ0LCBub2RlU2V0LCBpblJlcGVhdCA8IDAgPyBOb2RlVHlwZS5ub25lIDogdHlwZXNbaW5SZXBlYXRdKTtcbiAgICAgICAgICAgIHN0YXJ0UG9zID0gYnVmZmVyLnN0YXJ0IC0gcGFyZW50U3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIE1ha2UgaXQgYSBub2RlXG4gICAgICAgICAgICBsZXQgZW5kUG9zID0gY3Vyc29yLnBvcyAtIHNpemU7XG4gICAgICAgICAgICBjdXJzb3IubmV4dCgpO1xuICAgICAgICAgICAgbGV0IGxvY2FsQ2hpbGRyZW4gPSBbXSwgbG9jYWxQb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIGxldCBsb2NhbEluUmVwZWF0ID0gaWQgPj0gbWluUmVwZWF0VHlwZSA/IGlkIDogLTE7XG4gICAgICAgICAgICB3aGlsZSAoY3Vyc29yLnBvcyA+IGVuZFBvcykge1xuICAgICAgICAgICAgICAgIGlmIChjdXJzb3IuaWQgPT0gbG9jYWxJblJlcGVhdClcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yLm5leHQoKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRha2VOb2RlKHN0YXJ0LCBlbmRQb3MsIGxvY2FsQ2hpbGRyZW4sIGxvY2FsUG9zaXRpb25zLCBsb2NhbEluUmVwZWF0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsQ2hpbGRyZW4ucmV2ZXJzZSgpO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbnMucmV2ZXJzZSgpO1xuICAgICAgICAgICAgaWYgKGxvY2FsSW5SZXBlYXQgPiAtMSAmJiBsb2NhbENoaWxkcmVuLmxlbmd0aCA+IEJhbGFuY2VCcmFuY2hGYWN0b3IpXG4gICAgICAgICAgICAgICAgbm9kZSA9IGJhbGFuY2VSYW5nZSh0eXBlLCB0eXBlLCBsb2NhbENoaWxkcmVuLCBsb2NhbFBvc2l0aW9ucywgMCwgbG9jYWxDaGlsZHJlbi5sZW5ndGgsIDAsIG1heEJ1ZmZlckxlbmd0aCwgZW5kIC0gc3RhcnQsIGNvbnRleHRIYXNoKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBub2RlID0gd2l0aEhhc2gobmV3IFRyZWUodHlwZSwgbG9jYWxDaGlsZHJlbiwgbG9jYWxQb3NpdGlvbnMsIGVuZCAtIHN0YXJ0KSwgY29udGV4dEhhc2gpO1xuICAgICAgICB9XG4gICAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgICAgIHBvc2l0aW9ucy5wdXNoKHN0YXJ0UG9zKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmluZEJ1ZmZlclNpemUobWF4U2l6ZSwgaW5SZXBlYXQpIHtcbiAgICAgICAgLy8gU2NhbiB0aHJvdWdoIHRoZSBidWZmZXIgdG8gZmluZCBwcmV2aW91cyBzaWJsaW5ncyB0aGF0IGZpdFxuICAgICAgICAvLyB0b2dldGhlciBpbiBhIFRyZWVCdWZmZXIsIGFuZCBkb24ndCBjb250YWluIGFueSByZXVzZWQgbm9kZXNcbiAgICAgICAgLy8gKHdoaWNoIGNhbid0IGJlIHN0b3JlZCBpbiBhIGJ1ZmZlcikuXG4gICAgICAgIC8vIElmIGBpblJlcGVhdGAgaXMgPiAtMSwgaWdub3JlIG5vZGUgYm91bmRhcmllcyBvZiB0aGF0IHR5cGUgZm9yXG4gICAgICAgIC8vIG5lc3RpbmcsIGJ1dCBtYWtlIHN1cmUgdGhlIGVuZCBmYWxscyBlaXRoZXIgYXQgdGhlIHN0YXJ0XG4gICAgICAgIC8vIChgbWF4U2l6ZWApIG9yIGJlZm9yZSBzdWNoIGEgbm9kZS5cbiAgICAgICAgbGV0IGZvcmsgPSBjdXJzb3IuZm9yaygpO1xuICAgICAgICBsZXQgc2l6ZSA9IDAsIHN0YXJ0ID0gMCwgc2tpcCA9IDAsIG1pblN0YXJ0ID0gZm9yay5lbmQgLSBtYXhCdWZmZXJMZW5ndGg7XG4gICAgICAgIGxldCByZXN1bHQgPSB7IHNpemU6IDAsIHN0YXJ0OiAwLCBza2lwOiAwIH07XG4gICAgICAgIHNjYW46IGZvciAobGV0IG1pblBvcyA9IGZvcmsucG9zIC0gbWF4U2l6ZTsgZm9yay5wb3MgPiBtaW5Qb3M7KSB7XG4gICAgICAgICAgICAvLyBQcmV0ZW5kIG5lc3RlZCByZXBlYXQgbm9kZXMgb2YgdGhlIHNhbWUgdHlwZSBkb24ndCBleGlzdFxuICAgICAgICAgICAgaWYgKGZvcmsuaWQgPT0gaW5SZXBlYXQpIHtcbiAgICAgICAgICAgICAgICAvLyBFeGNlcHQgdGhhdCB3ZSBzdG9yZSB0aGUgY3VycmVudCBzdGF0ZSBhcyBhIHZhbGlkIHJldHVyblxuICAgICAgICAgICAgICAgIC8vIHZhbHVlLlxuICAgICAgICAgICAgICAgIHJlc3VsdC5zaXplID0gc2l6ZTtcbiAgICAgICAgICAgICAgICByZXN1bHQuc3RhcnQgPSBzdGFydDtcbiAgICAgICAgICAgICAgICByZXN1bHQuc2tpcCA9IHNraXA7XG4gICAgICAgICAgICAgICAgc2tpcCArPSA0O1xuICAgICAgICAgICAgICAgIHNpemUgKz0gNDtcbiAgICAgICAgICAgICAgICBmb3JrLm5leHQoKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBub2RlU2l6ZSA9IGZvcmsuc2l6ZSwgc3RhcnRQb3MgPSBmb3JrLnBvcyAtIG5vZGVTaXplO1xuICAgICAgICAgICAgaWYgKG5vZGVTaXplIDwgMCB8fCBzdGFydFBvcyA8IG1pblBvcyB8fCBmb3JrLnN0YXJ0IDwgbWluU3RhcnQpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBsZXQgbG9jYWxTa2lwcGVkID0gZm9yay5pZCA+PSBtaW5SZXBlYXRUeXBlID8gNCA6IDA7XG4gICAgICAgICAgICBsZXQgbm9kZVN0YXJ0ID0gZm9yay5zdGFydDtcbiAgICAgICAgICAgIGZvcmsubmV4dCgpO1xuICAgICAgICAgICAgd2hpbGUgKGZvcmsucG9zID4gc3RhcnRQb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoZm9yay5zaXplIDwgMClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgc2NhbjtcbiAgICAgICAgICAgICAgICBpZiAoZm9yay5pZCA+PSBtaW5SZXBlYXRUeXBlKVxuICAgICAgICAgICAgICAgICAgICBsb2NhbFNraXBwZWQgKz0gNDtcbiAgICAgICAgICAgICAgICBmb3JrLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXJ0ID0gbm9kZVN0YXJ0O1xuICAgICAgICAgICAgc2l6ZSArPSBub2RlU2l6ZTtcbiAgICAgICAgICAgIHNraXAgKz0gbG9jYWxTa2lwcGVkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpblJlcGVhdCA8IDAgfHwgc2l6ZSA9PSBtYXhTaXplKSB7XG4gICAgICAgICAgICByZXN1bHQuc2l6ZSA9IHNpemU7XG4gICAgICAgICAgICByZXN1bHQuc3RhcnQgPSBzdGFydDtcbiAgICAgICAgICAgIHJlc3VsdC5za2lwID0gc2tpcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0LnNpemUgPiA0ID8gcmVzdWx0IDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb3B5VG9CdWZmZXIoYnVmZmVyU3RhcnQsIGJ1ZmZlciwgaW5kZXgsIGluUmVwZWF0KSB7XG4gICAgICAgIGxldCB7IGlkLCBzdGFydCwgZW5kLCBzaXplIH0gPSBjdXJzb3I7XG4gICAgICAgIGN1cnNvci5uZXh0KCk7XG4gICAgICAgIGlmIChpZCA9PSBpblJlcGVhdClcbiAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgbGV0IHN0YXJ0SW5kZXggPSBpbmRleDtcbiAgICAgICAgaWYgKHNpemUgPiA0KSB7XG4gICAgICAgICAgICBsZXQgZW5kUG9zID0gY3Vyc29yLnBvcyAtIChzaXplIC0gNCk7XG4gICAgICAgICAgICB3aGlsZSAoY3Vyc29yLnBvcyA+IGVuZFBvcylcbiAgICAgICAgICAgICAgICBpbmRleCA9IGNvcHlUb0J1ZmZlcihidWZmZXJTdGFydCwgYnVmZmVyLCBpbmRleCwgaW5SZXBlYXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpZCA8IG1pblJlcGVhdFR5cGUpIHsgLy8gRG9uJ3QgY29weSByZXBlYXQgbm9kZXMgaW50byBidWZmZXJzXG4gICAgICAgICAgICBidWZmZXJbLS1pbmRleF0gPSBzdGFydEluZGV4O1xuICAgICAgICAgICAgYnVmZmVyWy0taW5kZXhdID0gZW5kIC0gYnVmZmVyU3RhcnQ7XG4gICAgICAgICAgICBidWZmZXJbLS1pbmRleF0gPSBzdGFydCAtIGJ1ZmZlclN0YXJ0O1xuICAgICAgICAgICAgYnVmZmVyWy0taW5kZXhdID0gaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgICBsZXQgY2hpbGRyZW4gPSBbXSwgcG9zaXRpb25zID0gW107XG4gICAgd2hpbGUgKGN1cnNvci5wb3MgPiAwKVxuICAgICAgICB0YWtlTm9kZShkYXRhLnN0YXJ0IHx8IDAsIDAsIGNoaWxkcmVuLCBwb3NpdGlvbnMsIC0xKTtcbiAgICBsZXQgbGVuZ3RoID0gKF9hID0gZGF0YS5sZW5ndGgpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChjaGlsZHJlbi5sZW5ndGggPyBwb3NpdGlvbnNbMF0gKyBjaGlsZHJlblswXS5sZW5ndGggOiAwKTtcbiAgICByZXR1cm4gbmV3IFRyZWUodHlwZXNbdG9wSURdLCBjaGlsZHJlbi5yZXZlcnNlKCksIHBvc2l0aW9ucy5yZXZlcnNlKCksIGxlbmd0aCk7XG59XG5mdW5jdGlvbiBiYWxhbmNlUmFuZ2Uob3V0ZXJUeXBlLCBpbm5lclR5cGUsIGNoaWxkcmVuLCBwb3NpdGlvbnMsIGZyb20sIHRvLCBzdGFydCwgbWF4QnVmZmVyTGVuZ3RoLCBsZW5ndGgsIGNvbnRleHRIYXNoKSB7XG4gICAgbGV0IGxvY2FsQ2hpbGRyZW4gPSBbXSwgbG9jYWxQb3NpdGlvbnMgPSBbXTtcbiAgICBpZiAobGVuZ3RoIDw9IG1heEJ1ZmZlckxlbmd0aCkge1xuICAgICAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8IHRvOyBpKyspIHtcbiAgICAgICAgICAgIGxvY2FsQ2hpbGRyZW4ucHVzaChjaGlsZHJlbltpXSk7XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uc1tpXSAtIHN0YXJ0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGV0IG1heENoaWxkID0gTWF0aC5tYXgobWF4QnVmZmVyTGVuZ3RoLCBNYXRoLmNlaWwobGVuZ3RoICogMS41IC8gQmFsYW5jZUJyYW5jaEZhY3RvcikpO1xuICAgICAgICBmb3IgKGxldCBpID0gZnJvbTsgaSA8IHRvOykge1xuICAgICAgICAgICAgbGV0IGdyb3VwRnJvbSA9IGksIGdyb3VwU3RhcnQgPSBwb3NpdGlvbnNbaV07XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IHRvOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dEVuZCA9IHBvc2l0aW9uc1tpXSArIGNoaWxkcmVuW2ldLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAobmV4dEVuZCAtIGdyb3VwU3RhcnQgPiBtYXhDaGlsZClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSA9PSBncm91cEZyb20gKyAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9ubHkgPSBjaGlsZHJlbltncm91cEZyb21dO1xuICAgICAgICAgICAgICAgIGlmIChvbmx5IGluc3RhbmNlb2YgVHJlZSAmJiBvbmx5LnR5cGUgPT0gaW5uZXJUeXBlICYmIG9ubHkubGVuZ3RoID4gbWF4Q2hpbGQgPDwgMSkgeyAvLyBUb28gYmlnLCBjb2xsYXBzZVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG9ubHkuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsQ2hpbGRyZW4ucHVzaChvbmx5LmNoaWxkcmVuW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsUG9zaXRpb25zLnB1c2gob25seS5wb3NpdGlvbnNbal0gKyBncm91cFN0YXJ0IC0gc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb2NhbENoaWxkcmVuLnB1c2gob25seSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpID09IGdyb3VwRnJvbSArIDEpIHtcbiAgICAgICAgICAgICAgICBsb2NhbENoaWxkcmVuLnB1c2goY2hpbGRyZW5bZ3JvdXBGcm9tXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5uZXIgPSBiYWxhbmNlUmFuZ2UoaW5uZXJUeXBlLCBpbm5lclR5cGUsIGNoaWxkcmVuLCBwb3NpdGlvbnMsIGdyb3VwRnJvbSwgaSwgZ3JvdXBTdGFydCwgbWF4QnVmZmVyTGVuZ3RoLCBwb3NpdGlvbnNbaSAtIDFdICsgY2hpbGRyZW5baSAtIDFdLmxlbmd0aCAtIGdyb3VwU3RhcnQsIGNvbnRleHRIYXNoKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5uZXJUeXBlICE9IE5vZGVUeXBlLm5vbmUgJiYgIWNvbnRhaW5zVHlwZShpbm5lci5jaGlsZHJlbiwgaW5uZXJUeXBlKSlcbiAgICAgICAgICAgICAgICAgICAgaW5uZXIgPSB3aXRoSGFzaChuZXcgVHJlZShOb2RlVHlwZS5ub25lLCBpbm5lci5jaGlsZHJlbiwgaW5uZXIucG9zaXRpb25zLCBpbm5lci5sZW5ndGgpLCBjb250ZXh0SGFzaCk7XG4gICAgICAgICAgICAgICAgbG9jYWxDaGlsZHJlbi5wdXNoKGlubmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb25zLnB1c2goZ3JvdXBTdGFydCAtIHN0YXJ0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gd2l0aEhhc2gobmV3IFRyZWUob3V0ZXJUeXBlLCBsb2NhbENoaWxkcmVuLCBsb2NhbFBvc2l0aW9ucywgbGVuZ3RoKSwgY29udGV4dEhhc2gpO1xufVxuZnVuY3Rpb24gY29udGFpbnNUeXBlKG5vZGVzLCB0eXBlKSB7XG4gICAgZm9yIChsZXQgZWx0IG9mIG5vZGVzKVxuICAgICAgICBpZiAoZWx0LnR5cGUgPT0gdHlwZSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbn1cbi8vLyBUcmVlIGZyYWdtZW50cyBhcmUgdXNlZCBkdXJpbmcgW2luY3JlbWVudGFsXG4vLy8gcGFyc2luZ10oI2xlemVyLlBhcnNlT3B0aW9ucy5mcmFnbWVudHMpIHRvIHRyYWNrIHBhcnRzIG9mIG9sZFxuLy8vIHRyZWVzIHRoYXQgY2FuIGJlIHJldXNlZCBpbiBhIG5ldyBwYXJzZS4gQW4gYXJyYXkgb2YgZnJhZ21lbnRzIGlzXG4vLy8gdXNlZCB0byB0cmFjayByZWdpb25zIG9mIGFuIG9sZCB0cmVlIHdob3NlIG5vZGVzIG1pZ2h0IGJlIHJldXNlZFxuLy8vIGluIG5ldyBwYXJzZXMuIFVzZSB0aGUgc3RhdGljXG4vLy8gW2BhcHBseUNoYW5nZXNgXSgjdHJlZS5UcmVlRnJhZ21lbnReYXBwbHlDaGFuZ2VzKSBtZXRob2QgdG8gdXBkYXRlXG4vLy8gZnJhZ21lbnRzIGZvciBkb2N1bWVudCBjaGFuZ2VzLlxuY2xhc3MgVHJlZUZyYWdtZW50IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvLy8gVGhlIHN0YXJ0IG9mIHRoZSB1bmNoYW5nZWQgcmFuZ2UgcG9pbnRlZCB0byBieSB0aGlzIGZyYWdtZW50LlxuICAgIC8vLyBUaGlzIHJlZmVycyB0byBhbiBvZmZzZXQgaW4gdGhlIF91cGRhdGVkXyBkb2N1bWVudCAoYXMgb3Bwb3NlZFxuICAgIC8vLyB0byB0aGUgb3JpZ2luYWwgdHJlZSkuXG4gICAgZnJvbSwgXG4gICAgLy8vIFRoZSBlbmQgb2YgdGhlIHVuY2hhbmdlZCByYW5nZS5cbiAgICB0bywgXG4gICAgLy8vIFRoZSB0cmVlIHRoYXQgdGhpcyBmcmFnbWVudCBpcyBiYXNlZCBvbi5cbiAgICB0cmVlLCBcbiAgICAvLy8gVGhlIG9mZnNldCBiZXR3ZWVuIHRoZSBmcmFnbWVudCdzIHRyZWUgYW5kIHRoZSBkb2N1bWVudCB0aGF0XG4gICAgLy8vIHRoaXMgZnJhZ21lbnQgY2FuIGJlIHVzZWQgYWdhaW5zdC4gQWRkIHRoaXMgd2hlbiBnb2luZyBmcm9tXG4gICAgLy8vIGRvY3VtZW50IHRvIHRyZWUgcG9zaXRpb25zLCBzdWJ0cmFjdCBpdCB0byBnbyBmcm9tIHRyZWUgdG9cbiAgICAvLy8gZG9jdW1lbnQgcG9zaXRpb25zLlxuICAgIG9mZnNldCwgb3Blbikge1xuICAgICAgICB0aGlzLmZyb20gPSBmcm9tO1xuICAgICAgICB0aGlzLnRvID0gdG87XG4gICAgICAgIHRoaXMudHJlZSA9IHRyZWU7XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICB0aGlzLm9wZW4gPSBvcGVuO1xuICAgIH1cbiAgICBnZXQgb3BlblN0YXJ0KCkgeyByZXR1cm4gKHRoaXMub3BlbiAmIDEgLyogU3RhcnQgKi8pID4gMDsgfVxuICAgIGdldCBvcGVuRW5kKCkgeyByZXR1cm4gKHRoaXMub3BlbiAmIDIgLyogRW5kICovKSA+IDA7IH1cbiAgICAvLy8gQXBwbHkgYSBzZXQgb2YgZWRpdHMgdG8gYW4gYXJyYXkgb2YgZnJhZ21lbnRzLCByZW1vdmluZyBvclxuICAgIC8vLyBzcGxpdHRpbmcgZnJhZ21lbnRzIGFzIG5lY2Vzc2FyeSB0byByZW1vdmUgZWRpdGVkIHJhbmdlcywgYW5kXG4gICAgLy8vIGFkanVzdGluZyBvZmZzZXRzIGZvciBmcmFnbWVudHMgdGhhdCBtb3ZlZC5cbiAgICBzdGF0aWMgYXBwbHlDaGFuZ2VzKGZyYWdtZW50cywgY2hhbmdlcywgbWluR2FwID0gMTI4KSB7XG4gICAgICAgIGlmICghY2hhbmdlcy5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gZnJhZ21lbnRzO1xuICAgICAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgICAgIGxldCBmSSA9IDEsIG5leHRGID0gZnJhZ21lbnRzLmxlbmd0aCA/IGZyYWdtZW50c1swXSA6IG51bGw7XG4gICAgICAgIGxldCBjSSA9IDAsIHBvcyA9IDAsIG9mZiA9IDA7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGxldCBuZXh0QyA9IGNJIDwgY2hhbmdlcy5sZW5ndGggPyBjaGFuZ2VzW2NJKytdIDogbnVsbDtcbiAgICAgICAgICAgIGxldCBuZXh0UG9zID0gbmV4dEMgPyBuZXh0Qy5mcm9tQSA6IDFlOTtcbiAgICAgICAgICAgIGlmIChuZXh0UG9zIC0gcG9zID49IG1pbkdhcClcbiAgICAgICAgICAgICAgICB3aGlsZSAobmV4dEYgJiYgbmV4dEYuZnJvbSA8IG5leHRQb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGN1dCA9IG5leHRGO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zID49IGN1dC5mcm9tIHx8IG5leHRQb3MgPD0gY3V0LnRvIHx8IG9mZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZGcm9tID0gTWF0aC5tYXgoY3V0LmZyb20sIHBvcykgLSBvZmYsIGZUbyA9IE1hdGgubWluKGN1dC50bywgbmV4dFBvcykgLSBvZmY7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXQgPSBmRnJvbSA+PSBmVG8gPyBudWxsIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXcgVHJlZUZyYWdtZW50KGZGcm9tLCBmVG8sIGN1dC50cmVlLCBjdXQub2Zmc2V0ICsgb2ZmLCAoY0kgPiAwID8gMSAvKiBTdGFydCAqLyA6IDApIHwgKG5leHRDID8gMiAvKiBFbmQgKi8gOiAwKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1dClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGN1dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0Ri50byA+IG5leHRQb3MpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgbmV4dEYgPSBmSSA8IGZyYWdtZW50cy5sZW5ndGggPyBmcmFnbWVudHNbZkkrK10gOiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbmV4dEMpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBwb3MgPSBuZXh0Qy50b0E7XG4gICAgICAgICAgICBvZmYgPSBuZXh0Qy50b0EgLSBuZXh0Qy50b0I7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8vIENyZWF0ZSBhIHNldCBvZiBmcmFnbWVudHMgZnJvbSBhIGZyZXNobHkgcGFyc2VkIHRyZWUsIG9yIHVwZGF0ZVxuICAgIC8vLyBhbiBleGlzdGluZyBzZXQgb2YgZnJhZ21lbnRzIGJ5IHJlcGxhY2luZyB0aGUgb25lcyB0aGF0IG92ZXJsYXBcbiAgICAvLy8gd2l0aCBhIHRyZWUgd2l0aCBjb250ZW50IGZyb20gdGhlIG5ldyB0cmVlLiBXaGVuIGBwYXJ0aWFsYCBpc1xuICAgIC8vLyB0cnVlLCB0aGUgcGFyc2UgaXMgdHJlYXRlZCBhcyBpbmNvbXBsZXRlLCBhbmQgdGhlIHRva2VuIGF0IGl0c1xuICAgIC8vLyBlbmQgaXMgbm90IGluY2x1ZGVkIGluIFtgc2FmZVRvYF0oI3RyZWUuVHJlZUZyYWdtZW50LnNhZmVUbykuXG4gICAgc3RhdGljIGFkZFRyZWUodHJlZSwgZnJhZ21lbnRzID0gW10sIHBhcnRpYWwgPSBmYWxzZSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gW25ldyBUcmVlRnJhZ21lbnQoMCwgdHJlZS5sZW5ndGgsIHRyZWUsIDAsIHBhcnRpYWwgPyAyIC8qIEVuZCAqLyA6IDApXTtcbiAgICAgICAgZm9yIChsZXQgZiBvZiBmcmFnbWVudHMpXG4gICAgICAgICAgICBpZiAoZi50byA+IHRyZWUubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGYpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbi8vIENyZWF0ZXMgYW4gYElucHV0YCB0aGF0IGlzIGJhY2tlZCBieSBhIHNpbmdsZSwgZmxhdCBzdHJpbmcuXG5mdW5jdGlvbiBzdHJpbmdJbnB1dChpbnB1dCkgeyByZXR1cm4gbmV3IFN0cmluZ0lucHV0KGlucHV0KTsgfVxuY2xhc3MgU3RyaW5nSW5wdXQge1xuICAgIGNvbnN0cnVjdG9yKHN0cmluZywgbGVuZ3RoID0gc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnN0cmluZyA9IHN0cmluZztcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgfVxuICAgIGdldChwb3MpIHtcbiAgICAgICAgcmV0dXJuIHBvcyA8IDAgfHwgcG9zID49IHRoaXMubGVuZ3RoID8gLTEgOiB0aGlzLnN0cmluZy5jaGFyQ29kZUF0KHBvcyk7XG4gICAgfVxuICAgIGxpbmVBZnRlcihwb3MpIHtcbiAgICAgICAgaWYgKHBvcyA8IDApXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgbGV0IGVuZCA9IHRoaXMuc3RyaW5nLmluZGV4T2YoXCJcXG5cIiwgcG9zKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5nLnNsaWNlKHBvcywgZW5kIDwgMCA/IHRoaXMubGVuZ3RoIDogTWF0aC5taW4oZW5kLCB0aGlzLmxlbmd0aCkpO1xuICAgIH1cbiAgICByZWFkKGZyb20sIHRvKSB7IHJldHVybiB0aGlzLnN0cmluZy5zbGljZShmcm9tLCBNYXRoLm1pbih0aGlzLmxlbmd0aCwgdG8pKTsgfVxuICAgIGNsaXAoYXQpIHsgcmV0dXJuIG5ldyBTdHJpbmdJbnB1dCh0aGlzLnN0cmluZywgYXQpOyB9XG59XG5cbmV4cG9ydHMuRGVmYXVsdEJ1ZmZlckxlbmd0aCA9IERlZmF1bHRCdWZmZXJMZW5ndGg7XG5leHBvcnRzLk5vZGVQcm9wID0gTm9kZVByb3A7XG5leHBvcnRzLk5vZGVTZXQgPSBOb2RlU2V0O1xuZXhwb3J0cy5Ob2RlVHlwZSA9IE5vZGVUeXBlO1xuZXhwb3J0cy5UcmVlID0gVHJlZTtcbmV4cG9ydHMuVHJlZUJ1ZmZlciA9IFRyZWVCdWZmZXI7XG5leHBvcnRzLlRyZWVDdXJzb3IgPSBUcmVlQ3Vyc29yO1xuZXhwb3J0cy5UcmVlRnJhZ21lbnQgPSBUcmVlRnJhZ21lbnQ7XG5leHBvcnRzLnN0cmluZ0lucHV0ID0gc3RyaW5nSW5wdXQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmVlLmNqcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIGxlemVyVHJlZSA9IHJlcXVpcmUoJ2xlemVyLXRyZWUnKTtcblxuLy8vIEEgcGFyc2Ugc3RhY2suIFRoZXNlIGFyZSB1c2VkIGludGVybmFsbHkgYnkgdGhlIHBhcnNlciB0byB0cmFja1xuLy8vIHBhcnNpbmcgcHJvZ3Jlc3MuIFRoZXkgYWxzbyBwcm92aWRlIHNvbWUgcHJvcGVydGllcyBhbmQgbWV0aG9kc1xuLy8vIHRoYXQgZXh0ZXJuYWwgY29kZSBzdWNoIGFzIGEgdG9rZW5pemVyIGNhbiB1c2UgdG8gZ2V0IGluZm9ybWF0aW9uXG4vLy8gYWJvdXQgdGhlIHBhcnNlIHN0YXRlLlxuY2xhc3MgU3RhY2sge1xuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvLy8gQSB0aGUgcGFyc2UgdGhhdCB0aGlzIHN0YWNrIGlzIHBhcnQgb2YgQGludGVybmFsXG4gICAgcCwgXG4gICAgLy8vIEhvbGRzIHN0YXRlLCBwb3MsIHZhbHVlIHN0YWNrIHBvcyAoMTUgYml0cyBhcnJheSBpbmRleCwgMTUgYml0c1xuICAgIC8vLyBidWZmZXIgaW5kZXgpIHRyaXBsZXRzIGZvciBhbGwgYnV0IHRoZSB0b3Agc3RhdGVcbiAgICAvLy8gQGludGVybmFsXG4gICAgc3RhY2ssIFxuICAgIC8vLyBUaGUgY3VycmVudCBwYXJzZSBzdGF0ZSBAaW50ZXJuYWxcbiAgICBzdGF0ZSwgXG4gICAgLy8gVGhlIHBvc2l0aW9uIGF0IHdoaWNoIHRoZSBuZXh0IHJlZHVjZSBzaG91bGQgdGFrZSBwbGFjZS4gVGhpc1xuICAgIC8vIGNhbiBiZSBsZXNzIHRoYW4gYHRoaXMucG9zYCB3aGVuIHNraXBwZWQgZXhwcmVzc2lvbnMgaGF2ZSBiZWVuXG4gICAgLy8gYWRkZWQgdG8gdGhlIHN0YWNrICh3aGljaCBzaG91bGQgYmUgbW92ZWQgb3V0c2lkZSBvZiB0aGUgbmV4dFxuICAgIC8vIHJlZHVjdGlvbilcbiAgICAvLy8gQGludGVybmFsXG4gICAgcmVkdWNlUG9zLCBcbiAgICAvLy8gVGhlIGlucHV0IHBvc2l0aW9uIHVwIHRvIHdoaWNoIHRoaXMgc3RhY2sgaGFzIHBhcnNlZC5cbiAgICBwb3MsIFxuICAgIC8vLyBUaGUgZHluYW1pYyBzY29yZSBvZiB0aGUgc3RhY2ssIGluY2x1ZGluZyBkeW5hbWljIHByZWNlZGVuY2VcbiAgICAvLy8gYW5kIGVycm9yLXJlY292ZXJ5IHBlbmFsdGllc1xuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBzY29yZSwgXG4gICAgLy8gVGhlIG91dHB1dCBidWZmZXIuIEhvbGRzICh0eXBlLCBzdGFydCwgZW5kLCBzaXplKSBxdWFkc1xuICAgIC8vIHJlcHJlc2VudGluZyBub2RlcyBjcmVhdGVkIGJ5IHRoZSBwYXJzZXIsIHdoZXJlIGBzaXplYCBpc1xuICAgIC8vIGFtb3VudCBvZiBidWZmZXIgYXJyYXkgZW50cmllcyBjb3ZlcmVkIGJ5IHRoaXMgbm9kZS5cbiAgICAvLy8gQGludGVybmFsXG4gICAgYnVmZmVyLCBcbiAgICAvLyBUaGUgYmFzZSBvZmZzZXQgb2YgdGhlIGJ1ZmZlci4gV2hlbiBzdGFja3MgYXJlIHNwbGl0LCB0aGUgc3BsaXRcbiAgICAvLyBpbnN0YW5jZSBzaGFyZWQgdGhlIGJ1ZmZlciBoaXN0b3J5IHdpdGggaXRzIHBhcmVudCB1cCB0b1xuICAgIC8vIGBidWZmZXJCYXNlYCwgd2hpY2ggaXMgdGhlIGFic29sdXRlIG9mZnNldCAoaW5jbHVkaW5nIHRoZVxuICAgIC8vIG9mZnNldCBvZiBwcmV2aW91cyBzcGxpdHMpIGludG8gdGhlIGJ1ZmZlciBhdCB3aGljaCB0aGlzIHN0YWNrXG4gICAgLy8gc3RhcnRzIHdyaXRpbmcuXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGJ1ZmZlckJhc2UsIFxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBjdXJDb250ZXh0LCBcbiAgICAvLyBBIHBhcmVudCBzdGFjayBmcm9tIHdoaWNoIHRoaXMgd2FzIHNwbGl0IG9mZiwgaWYgYW55LiBUaGlzIGlzXG4gICAgLy8gc2V0IHVwIHNvIHRoYXQgaXQgYWx3YXlzIHBvaW50cyB0byBhIHN0YWNrIHRoYXQgaGFzIHNvbWVcbiAgICAvLyBhZGRpdGlvbmFsIGJ1ZmZlciBjb250ZW50LCBuZXZlciB0byBhIHN0YWNrIHdpdGggYW4gZXF1YWxcbiAgICAvLyBgYnVmZmVyQmFzZWAuXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHBhcmVudCkge1xuICAgICAgICB0aGlzLnAgPSBwO1xuICAgICAgICB0aGlzLnN0YWNrID0gc3RhY2s7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5yZWR1Y2VQb3MgPSByZWR1Y2VQb3M7XG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgICAgICB0aGlzLnNjb3JlID0gc2NvcmU7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICB0aGlzLmJ1ZmZlckJhc2UgPSBidWZmZXJCYXNlO1xuICAgICAgICB0aGlzLmN1ckNvbnRleHQgPSBjdXJDb250ZXh0O1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYFske3RoaXMuc3RhY2suZmlsdGVyKChfLCBpKSA9PiBpICUgMyA9PSAwKS5jb25jYXQodGhpcy5zdGF0ZSl9XUAke3RoaXMucG9zfSR7dGhpcy5zY29yZSA/IFwiIVwiICsgdGhpcy5zY29yZSA6IFwiXCJ9YDtcbiAgICB9XG4gICAgLy8gU3RhcnQgYW4gZW1wdHkgc3RhY2tcbiAgICAvLy8gQGludGVybmFsXG4gICAgc3RhdGljIHN0YXJ0KHAsIHN0YXRlLCBwb3MgPSAwKSB7XG4gICAgICAgIGxldCBjeCA9IHAucGFyc2VyLmNvbnRleHQ7XG4gICAgICAgIHJldHVybiBuZXcgU3RhY2socCwgW10sIHN0YXRlLCBwb3MsIHBvcywgMCwgW10sIDAsIGN4ID8gbmV3IFN0YWNrQ29udGV4dChjeCwgY3guc3RhcnQpIDogbnVsbCwgbnVsbCk7XG4gICAgfVxuICAgIC8vLyBUaGUgc3RhY2sncyBjdXJyZW50IFtjb250ZXh0XSgjbGV6ZXIuQ29udGV4dFRyYWNrZXIpIHZhbHVlLCBpZlxuICAgIC8vLyBhbnkuIEl0cyB0eXBlIHdpbGwgZGVwZW5kIG9uIHRoZSBjb250ZXh0IHRyYWNrZXIncyB0eXBlXG4gICAgLy8vIHBhcmFtZXRlciwgb3IgaXQgd2lsbCBiZSBgbnVsbGAgaWYgdGhlcmUgaXMgbm8gY29udGV4dFxuICAgIC8vLyB0cmFja2VyLlxuICAgIGdldCBjb250ZXh0KCkgeyByZXR1cm4gdGhpcy5jdXJDb250ZXh0ID8gdGhpcy5jdXJDb250ZXh0LmNvbnRleHQgOiBudWxsOyB9XG4gICAgLy8gUHVzaCBhIHN0YXRlIG9udG8gdGhlIHN0YWNrLCB0cmFja2luZyBpdHMgc3RhcnQgcG9zaXRpb24gYXMgd2VsbFxuICAgIC8vIGFzIHRoZSBidWZmZXIgYmFzZSBhdCB0aGF0IHBvaW50LlxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBwdXNoU3RhdGUoc3RhdGUsIHN0YXJ0KSB7XG4gICAgICAgIHRoaXMuc3RhY2sucHVzaCh0aGlzLnN0YXRlLCBzdGFydCwgdGhpcy5idWZmZXJCYXNlICsgdGhpcy5idWZmZXIubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cbiAgICAvLyBBcHBseSBhIHJlZHVjZSBhY3Rpb25cbiAgICAvLy8gQGludGVybmFsXG4gICAgcmVkdWNlKGFjdGlvbikge1xuICAgICAgICBsZXQgZGVwdGggPSBhY3Rpb24gPj4gMTkgLyogUmVkdWNlRGVwdGhTaGlmdCAqLywgdHlwZSA9IGFjdGlvbiAmIDY1NTM1IC8qIFZhbHVlTWFzayAqLztcbiAgICAgICAgbGV0IHsgcGFyc2VyIH0gPSB0aGlzLnA7XG4gICAgICAgIGxldCBkUHJlYyA9IHBhcnNlci5keW5hbWljUHJlY2VkZW5jZSh0eXBlKTtcbiAgICAgICAgaWYgKGRQcmVjKVxuICAgICAgICAgICAgdGhpcy5zY29yZSArPSBkUHJlYztcbiAgICAgICAgaWYgKGRlcHRoID09IDApIHtcbiAgICAgICAgICAgIC8vIFplcm8tZGVwdGggcmVkdWN0aW9ucyBhcmUgYSBzcGVjaWFsIGNhc2XigJR0aGV5IGFkZCBzdHVmZiB0b1xuICAgICAgICAgICAgLy8gdGhlIHN0YWNrIHdpdGhvdXQgcG9wcGluZyBhbnl0aGluZyBvZmYuXG4gICAgICAgICAgICBpZiAodHlwZSA8IHBhcnNlci5taW5SZXBlYXRUZXJtKVxuICAgICAgICAgICAgICAgIHRoaXMuc3RvcmVOb2RlKHR5cGUsIHRoaXMucmVkdWNlUG9zLCB0aGlzLnJlZHVjZVBvcywgNCwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnB1c2hTdGF0ZShwYXJzZXIuZ2V0R290byh0aGlzLnN0YXRlLCB0eXBlLCB0cnVlKSwgdGhpcy5yZWR1Y2VQb3MpO1xuICAgICAgICAgICAgdGhpcy5yZWR1Y2VDb250ZXh0KHR5cGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZpbmQgdGhlIGJhc2UgaW5kZXggaW50byBgdGhpcy5zdGFja2AsIGNvbnRlbnQgYWZ0ZXIgd2hpY2ggd2lsbFxuICAgICAgICAvLyBiZSBkcm9wcGVkLiBOb3RlIHRoYXQgd2l0aCBgU3RheUZsYWdgIHJlZHVjdGlvbnMgd2UgbmVlZCB0b1xuICAgICAgICAvLyBjb25zdW1lIHR3byBleHRyYSBmcmFtZXMgKHRoZSBkdW1teSBwYXJlbnQgbm9kZSBmb3IgdGhlIHNraXBwZWRcbiAgICAgICAgLy8gZXhwcmVzc2lvbiBhbmQgdGhlIHN0YXRlIHRoYXQgd2UnbGwgYmUgc3RheWluZyBpbiwgd2hpY2ggc2hvdWxkXG4gICAgICAgIC8vIGJlIG1vdmVkIHRvIGB0aGlzLnN0YXRlYCkuXG4gICAgICAgIGxldCBiYXNlID0gdGhpcy5zdGFjay5sZW5ndGggLSAoKGRlcHRoIC0gMSkgKiAzKSAtIChhY3Rpb24gJiAyNjIxNDQgLyogU3RheUZsYWcgKi8gPyA2IDogMCk7XG4gICAgICAgIGxldCBzdGFydCA9IHRoaXMuc3RhY2tbYmFzZSAtIDJdO1xuICAgICAgICBsZXQgYnVmZmVyQmFzZSA9IHRoaXMuc3RhY2tbYmFzZSAtIDFdLCBjb3VudCA9IHRoaXMuYnVmZmVyQmFzZSArIHRoaXMuYnVmZmVyLmxlbmd0aCAtIGJ1ZmZlckJhc2U7XG4gICAgICAgIC8vIFN0b3JlIG5vcm1hbCB0ZXJtcyBvciBgUiAtPiBSIFJgIHJlcGVhdCByZWR1Y3Rpb25zXG4gICAgICAgIGlmICh0eXBlIDwgcGFyc2VyLm1pblJlcGVhdFRlcm0gfHwgKGFjdGlvbiAmIDEzMTA3MiAvKiBSZXBlYXRGbGFnICovKSkge1xuICAgICAgICAgICAgbGV0IHBvcyA9IHBhcnNlci5zdGF0ZUZsYWcodGhpcy5zdGF0ZSwgMSAvKiBTa2lwcGVkICovKSA/IHRoaXMucG9zIDogdGhpcy5yZWR1Y2VQb3M7XG4gICAgICAgICAgICB0aGlzLnN0b3JlTm9kZSh0eXBlLCBzdGFydCwgcG9zLCBjb3VudCArIDQsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gJiAyNjIxNDQgLyogU3RheUZsYWcgKi8pIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YWNrW2Jhc2VdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGJhc2VTdGF0ZUlEID0gdGhpcy5zdGFja1tiYXNlIC0gM107XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gcGFyc2VyLmdldEdvdG8oYmFzZVN0YXRlSUQsIHR5cGUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlICh0aGlzLnN0YWNrLmxlbmd0aCA+IGJhc2UpXG4gICAgICAgICAgICB0aGlzLnN0YWNrLnBvcCgpO1xuICAgICAgICB0aGlzLnJlZHVjZUNvbnRleHQodHlwZSk7XG4gICAgfVxuICAgIC8vIFNoaWZ0IGEgdmFsdWUgaW50byB0aGUgYnVmZmVyXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHN0b3JlTm9kZSh0ZXJtLCBzdGFydCwgZW5kLCBzaXplID0gNCwgaXNSZWR1Y2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGVybSA9PSAwIC8qIEVyciAqLykgeyAvLyBUcnkgdG8gb21pdC9tZXJnZSBhZGphY2VudCBlcnJvciBub2Rlc1xuICAgICAgICAgICAgbGV0IGN1ciA9IHRoaXMsIHRvcCA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICh0b3AgPT0gMCAmJiBjdXIucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgdG9wID0gY3VyLmJ1ZmZlckJhc2UgLSBjdXIucGFyZW50LmJ1ZmZlckJhc2U7XG4gICAgICAgICAgICAgICAgY3VyID0gY3VyLnBhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0b3AgPiAwICYmIGN1ci5idWZmZXJbdG9wIC0gNF0gPT0gMCAvKiBFcnIgKi8gJiYgY3VyLmJ1ZmZlclt0b3AgLSAxXSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ID09IGVuZClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmIChjdXIuYnVmZmVyW3RvcCAtIDJdID49IHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGN1ci5idWZmZXJbdG9wIC0gMl0gPSBlbmQ7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpc1JlZHVjZSB8fCB0aGlzLnBvcyA9PSBlbmQpIHsgLy8gU2ltcGxlIGNhc2UsIGp1c3QgYXBwZW5kXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlci5wdXNoKHRlcm0sIHN0YXJ0LCBlbmQsIHNpemUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBUaGVyZSBtYXkgYmUgc2tpcHBlZCBub2RlcyB0aGF0IGhhdmUgdG8gYmUgbW92ZWQgZm9yd2FyZFxuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5idWZmZXIubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGluZGV4ID4gMCAmJiB0aGlzLmJ1ZmZlcltpbmRleCAtIDRdICE9IDAgLyogRXJyICovKVxuICAgICAgICAgICAgICAgIHdoaWxlIChpbmRleCA+IDAgJiYgdGhpcy5idWZmZXJbaW5kZXggLSAyXSA+IGVuZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIHRoaXMgcmVjb3JkIGZvcndhcmRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJbaW5kZXhdID0gdGhpcy5idWZmZXJbaW5kZXggLSA0XTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJbaW5kZXggKyAxXSA9IHRoaXMuYnVmZmVyW2luZGV4IC0gM107XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyW2luZGV4ICsgMl0gPSB0aGlzLmJ1ZmZlcltpbmRleCAtIDJdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcltpbmRleCArIDNdID0gdGhpcy5idWZmZXJbaW5kZXggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggLT0gNDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpemUgPiA0KVxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZSAtPSA0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYnVmZmVyW2luZGV4XSA9IHRlcm07XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcltpbmRleCArIDFdID0gc3RhcnQ7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcltpbmRleCArIDJdID0gZW5kO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJbaW5kZXggKyAzXSA9IHNpemU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQXBwbHkgYSBzaGlmdCBhY3Rpb25cbiAgICAvLy8gQGludGVybmFsXG4gICAgc2hpZnQoYWN0aW9uLCBuZXh0LCBuZXh0RW5kKSB7XG4gICAgICAgIGlmIChhY3Rpb24gJiAxMzEwNzIgLyogR290b0ZsYWcgKi8pIHtcbiAgICAgICAgICAgIHRoaXMucHVzaFN0YXRlKGFjdGlvbiAmIDY1NTM1IC8qIFZhbHVlTWFzayAqLywgdGhpcy5wb3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChhY3Rpb24gJiAyNjIxNDQgLyogU3RheUZsYWcgKi8pID09IDApIHsgLy8gUmVndWxhciBzaGlmdFxuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5wb3MsIG5leHRTdGF0ZSA9IGFjdGlvbiwgeyBwYXJzZXIgfSA9IHRoaXMucDtcbiAgICAgICAgICAgIGlmIChuZXh0RW5kID4gdGhpcy5wb3MgfHwgbmV4dCA8PSBwYXJzZXIubWF4Tm9kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zID0gbmV4dEVuZDtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnNlci5zdGF0ZUZsYWcobmV4dFN0YXRlLCAxIC8qIFNraXBwZWQgKi8pKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZHVjZVBvcyA9IG5leHRFbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnB1c2hTdGF0ZShuZXh0U3RhdGUsIHN0YXJ0KTtcbiAgICAgICAgICAgIGlmIChuZXh0IDw9IHBhcnNlci5tYXhOb2RlKVxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyLnB1c2gobmV4dCwgc3RhcnQsIG5leHRFbmQsIDQpO1xuICAgICAgICAgICAgdGhpcy5zaGlmdENvbnRleHQobmV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIFNoaWZ0LWFuZC1zdGF5LCB3aGljaCBtZWFucyB0aGlzIGlzIGEgc2tpcHBlZCB0b2tlblxuICAgICAgICAgICAgaWYgKG5leHQgPD0gdGhpcy5wLnBhcnNlci5tYXhOb2RlKVxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyLnB1c2gobmV4dCwgdGhpcy5wb3MsIG5leHRFbmQsIDQpO1xuICAgICAgICAgICAgdGhpcy5wb3MgPSBuZXh0RW5kO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFwcGx5IGFuIGFjdGlvblxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBhcHBseShhY3Rpb24sIG5leHQsIG5leHRFbmQpIHtcbiAgICAgICAgaWYgKGFjdGlvbiAmIDY1NTM2IC8qIFJlZHVjZUZsYWcgKi8pXG4gICAgICAgICAgICB0aGlzLnJlZHVjZShhY3Rpb24pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLnNoaWZ0KGFjdGlvbiwgbmV4dCwgbmV4dEVuZCk7XG4gICAgfVxuICAgIC8vIEFkZCBhIHByZWJ1aWx0IG5vZGUgaW50byB0aGUgYnVmZmVyLiBUaGlzIG1heSBiZSBhIHJldXNlZCBub2RlIG9yXG4gICAgLy8gdGhlIHJlc3VsdCBvZiBydW5uaW5nIGEgbmVzdGVkIHBhcnNlci5cbiAgICAvLy8gQGludGVybmFsXG4gICAgdXNlTm9kZSh2YWx1ZSwgbmV4dCkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnAucmV1c2VkLmxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgdGhpcy5wLnJldXNlZFtpbmRleF0gIT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMucC5yZXVzZWQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdGFydCA9IHRoaXMucG9zO1xuICAgICAgICB0aGlzLnJlZHVjZVBvcyA9IHRoaXMucG9zID0gc3RhcnQgKyB2YWx1ZS5sZW5ndGg7XG4gICAgICAgIHRoaXMucHVzaFN0YXRlKG5leHQsIHN0YXJ0KTtcbiAgICAgICAgdGhpcy5idWZmZXIucHVzaChpbmRleCwgc3RhcnQsIHRoaXMucmVkdWNlUG9zLCAtMSAvKiBzaXplIDwgMCBtZWFucyB0aGlzIGlzIGEgcmV1c2VkIHZhbHVlICovKTtcbiAgICAgICAgaWYgKHRoaXMuY3VyQ29udGV4dClcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29udGV4dCh0aGlzLmN1ckNvbnRleHQudHJhY2tlci5yZXVzZSh0aGlzLmN1ckNvbnRleHQuY29udGV4dCwgdmFsdWUsIHRoaXMucC5pbnB1dCwgdGhpcykpO1xuICAgIH1cbiAgICAvLyBTcGxpdCB0aGUgc3RhY2suIER1ZSB0byB0aGUgYnVmZmVyIHNoYXJpbmcgYW5kIHRoZSBmYWN0XG4gICAgLy8gdGhhdCBgdGhpcy5zdGFja2AgdGVuZHMgdG8gc3RheSBxdWl0ZSBzaGFsbG93LCB0aGlzIGlzbid0IHZlcnlcbiAgICAvLyBleHBlbnNpdmUuXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHNwbGl0KCkge1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcztcbiAgICAgICAgbGV0IG9mZiA9IHBhcmVudC5idWZmZXIubGVuZ3RoO1xuICAgICAgICAvLyBCZWNhdXNlIHRoZSB0b3Agb2YgdGhlIGJ1ZmZlciAoYWZ0ZXIgdGhpcy5wb3MpIG1heSBiZSBtdXRhdGVkXG4gICAgICAgIC8vIHRvIHJlb3JkZXIgcmVkdWN0aW9ucyBhbmQgc2tpcHBlZCB0b2tlbnMsIGFuZCBzaGFyZWQgYnVmZmVyc1xuICAgICAgICAvLyBzaG91bGQgYmUgaW1tdXRhYmxlLCB0aGlzIGNvcGllcyBhbnkgb3V0c3RhbmRpbmcgc2tpcHBlZCB0b2tlbnNcbiAgICAgICAgLy8gdG8gdGhlIG5ldyBidWZmZXIsIGFuZCBwdXRzIHRoZSBiYXNlIHBvaW50ZXIgYmVmb3JlIHRoZW0uXG4gICAgICAgIHdoaWxlIChvZmYgPiAwICYmIHBhcmVudC5idWZmZXJbb2ZmIC0gMl0gPiBwYXJlbnQucmVkdWNlUG9zKVxuICAgICAgICAgICAgb2ZmIC09IDQ7XG4gICAgICAgIGxldCBidWZmZXIgPSBwYXJlbnQuYnVmZmVyLnNsaWNlKG9mZiksIGJhc2UgPSBwYXJlbnQuYnVmZmVyQmFzZSArIG9mZjtcbiAgICAgICAgLy8gTWFrZSBzdXJlIHBhcmVudCBwb2ludHMgdG8gYW4gYWN0dWFsIHBhcmVudCB3aXRoIGNvbnRlbnQsIGlmIHRoZXJlIGlzIHN1Y2ggYSBwYXJlbnQuXG4gICAgICAgIHdoaWxlIChwYXJlbnQgJiYgYmFzZSA9PSBwYXJlbnQuYnVmZmVyQmFzZSlcbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICAgIHJldHVybiBuZXcgU3RhY2sodGhpcy5wLCB0aGlzLnN0YWNrLnNsaWNlKCksIHRoaXMuc3RhdGUsIHRoaXMucmVkdWNlUG9zLCB0aGlzLnBvcywgdGhpcy5zY29yZSwgYnVmZmVyLCBiYXNlLCB0aGlzLmN1ckNvbnRleHQsIHBhcmVudCk7XG4gICAgfVxuICAgIC8vIFRyeSB0byByZWNvdmVyIGZyb20gYW4gZXJyb3IgYnkgJ2RlbGV0aW5nJyAoaWdub3JpbmcpIG9uZSB0b2tlbi5cbiAgICAvLy8gQGludGVybmFsXG4gICAgcmVjb3ZlckJ5RGVsZXRlKG5leHQsIG5leHRFbmQpIHtcbiAgICAgICAgbGV0IGlzTm9kZSA9IG5leHQgPD0gdGhpcy5wLnBhcnNlci5tYXhOb2RlO1xuICAgICAgICBpZiAoaXNOb2RlKVxuICAgICAgICAgICAgdGhpcy5zdG9yZU5vZGUobmV4dCwgdGhpcy5wb3MsIG5leHRFbmQpO1xuICAgICAgICB0aGlzLnN0b3JlTm9kZSgwIC8qIEVyciAqLywgdGhpcy5wb3MsIG5leHRFbmQsIGlzTm9kZSA/IDggOiA0KTtcbiAgICAgICAgdGhpcy5wb3MgPSB0aGlzLnJlZHVjZVBvcyA9IG5leHRFbmQ7XG4gICAgICAgIHRoaXMuc2NvcmUgLT0gMjAwIC8qIFRva2VuICovO1xuICAgIH1cbiAgICAvLy8gQ2hlY2sgaWYgdGhlIGdpdmVuIHRlcm0gd291bGQgYmUgYWJsZSB0byBiZSBzaGlmdGVkIChvcHRpb25hbGx5XG4gICAgLy8vIGFmdGVyIHNvbWUgcmVkdWN0aW9ucykgb24gdGhpcyBzdGFjay4gVGhpcyBjYW4gYmUgdXNlZnVsIGZvclxuICAgIC8vLyBleHRlcm5hbCB0b2tlbml6ZXJzIHRoYXQgd2FudCB0byBtYWtlIHN1cmUgdGhleSBvbmx5IHByb3ZpZGUgYVxuICAgIC8vLyBnaXZlbiB0b2tlbiB3aGVuIGl0IGFwcGxpZXMuXG4gICAgY2FuU2hpZnQodGVybSkge1xuICAgICAgICBmb3IgKGxldCBzaW0gPSBuZXcgU2ltdWxhdGVkU3RhY2sodGhpcyk7Oykge1xuICAgICAgICAgICAgbGV0IGFjdGlvbiA9IHRoaXMucC5wYXJzZXIuc3RhdGVTbG90KHNpbS50b3AsIDQgLyogRGVmYXVsdFJlZHVjZSAqLykgfHwgdGhpcy5wLnBhcnNlci5oYXNBY3Rpb24oc2ltLnRvcCwgdGVybSk7XG4gICAgICAgICAgICBpZiAoKGFjdGlvbiAmIDY1NTM2IC8qIFJlZHVjZUZsYWcgKi8pID09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBpZiAoYWN0aW9uID09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgc2ltLnJlZHVjZShhY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLyBGaW5kIHRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcnVsZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBwYXJzZWQuXG4gICAgZ2V0IHJ1bGVTdGFydCgpIHtcbiAgICAgICAgZm9yIChsZXQgc3RhdGUgPSB0aGlzLnN0YXRlLCBiYXNlID0gdGhpcy5zdGFjay5sZW5ndGg7Oykge1xuICAgICAgICAgICAgbGV0IGZvcmNlID0gdGhpcy5wLnBhcnNlci5zdGF0ZVNsb3Qoc3RhdGUsIDUgLyogRm9yY2VkUmVkdWNlICovKTtcbiAgICAgICAgICAgIGlmICghKGZvcmNlICYgNjU1MzYgLyogUmVkdWNlRmxhZyAqLykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICBiYXNlIC09IDMgKiAoZm9yY2UgPj4gMTkgLyogUmVkdWNlRGVwdGhTaGlmdCAqLyk7XG4gICAgICAgICAgICBpZiAoKGZvcmNlICYgNjU1MzUgLyogVmFsdWVNYXNrICovKSA8IHRoaXMucC5wYXJzZXIubWluUmVwZWF0VGVybSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFja1tiYXNlICsgMV07XG4gICAgICAgICAgICBzdGF0ZSA9IHRoaXMuc3RhY2tbYmFzZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8vIEZpbmQgdGhlIHN0YXJ0IHBvc2l0aW9uIG9mIGFuIGluc3RhbmNlIG9mIGFueSBvZiB0aGUgZ2l2ZW4gdGVybVxuICAgIC8vLyB0eXBlcywgb3IgcmV0dXJuIGBudWxsYCB3aGVuIG5vbmUgb2YgdGhlbSBhcmUgZm91bmQuXG4gICAgLy8vXG4gICAgLy8vICoqTm90ZToqKiB0aGlzIGlzIG9ubHkgcmVsaWFibGUgd2hlbiB0aGVyZSBpcyBhdCBsZWFzdCBzb21lXG4gICAgLy8vIHN0YXRlIHRoYXQgdW5hbWJpZ3VvdXNseSBtYXRjaGVzIHRoZSBnaXZlbiBydWxlIG9uIHRoZSBzdGFjay5cbiAgICAvLy8gSS5lLiBpZiB5b3UgaGF2ZSBhIGdyYW1tYXIgbGlrZSB0aGlzLCB3aGVyZSB0aGUgZGlmZmVyZW5jZVxuICAgIC8vLyBiZXR3ZWVuIGBhYCBhbmQgYGJgIGlzIG9ubHkgYXBwYXJlbnQgYXQgdGhlIHRoaXJkIHRva2VuOlxuICAgIC8vL1xuICAgIC8vLyAgICAgYSB7IGIgfCBjIH1cbiAgICAvLy8gICAgIGIgeyBcInhcIiBcInlcIiBcInhcIiB9XG4gICAgLy8vICAgICBjIHsgXCJ4XCIgXCJ5XCIgXCJ6XCIgfVxuICAgIC8vL1xuICAgIC8vLyBUaGVuIGEgcGFyc2Ugc3RhdGUgYWZ0ZXIgYFwieFwiYCB3aWxsIG5vdCByZWxpYWJseSB0ZWxsIHlvdSB0aGF0XG4gICAgLy8vIGBiYCBpcyBvbiB0aGUgc3RhY2suIFlvdSBfY2FuXyBwYXNzIGBbYiwgY11gIHRvIHJlbGlhYmx5IGNoZWNrXG4gICAgLy8vIGZvciBlaXRoZXIgb2YgdGhvc2UgdHdvIHJ1bGVzIChhc3N1bWluZyB0aGF0IGBhYCBpc24ndCBwYXJ0IG9mXG4gICAgLy8vIHNvbWUgcnVsZSB0aGF0IGluY2x1ZGVzIG90aGVyIHRoaW5ncyBzdGFydGluZyB3aXRoIGBcInhcImApLlxuICAgIC8vL1xuICAgIC8vLyBXaGVuIGBiZWZvcmVgIGlzIGdpdmVuLCB0aGlzIGtlZXBzIHNjYW5uaW5nIHVwIHRoZSBzdGFjayB1bnRpbFxuICAgIC8vLyBpdCBmaW5kcyBhIG1hdGNoIHRoYXQgc3RhcnRzIGJlZm9yZSB0aGF0IHBvc2l0aW9uLlxuICAgIC8vL1xuICAgIC8vLyBOb3RlIHRoYXQgeW91IGhhdmUgdG8gYmUgY2FyZWZ1bCB3aGVuIHVzaW5nIHRoaXMgaW4gdG9rZW5pemVycyxcbiAgICAvLy8gc2luY2UgaXQncyByZWxhdGl2ZWx5IGVhc3kgdG8gaW50cm9kdWNlIGRhdGEgZGVwZW5kZW5jaWVzIHRoYXRcbiAgICAvLy8gYnJlYWsgaW5jcmVtZW50YWwgcGFyc2luZyBieSB1c2luZyB0aGlzIG1ldGhvZC5cbiAgICBzdGFydE9mKHR5cGVzLCBiZWZvcmUpIHtcbiAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZSwgZnJhbWUgPSB0aGlzLnN0YWNrLmxlbmd0aCwgeyBwYXJzZXIgfSA9IHRoaXMucDtcbiAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgICAgbGV0IGZvcmNlID0gcGFyc2VyLnN0YXRlU2xvdChzdGF0ZSwgNSAvKiBGb3JjZWRSZWR1Y2UgKi8pO1xuICAgICAgICAgICAgbGV0IGRlcHRoID0gZm9yY2UgPj4gMTkgLyogUmVkdWNlRGVwdGhTaGlmdCAqLywgdGVybSA9IGZvcmNlICYgNjU1MzUgLyogVmFsdWVNYXNrICovO1xuICAgICAgICAgICAgaWYgKHR5cGVzLmluZGV4T2YodGVybSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIGxldCBiYXNlID0gZnJhbWUgLSAoMyAqIChmb3JjZSA+PiAxOSAvKiBSZWR1Y2VEZXB0aFNoaWZ0ICovKSksIHBvcyA9IHRoaXMuc3RhY2tbYmFzZSArIDFdO1xuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUgPT0gbnVsbCB8fCBiZWZvcmUgPiBwb3MpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwb3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZnJhbWUgPT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGlmIChkZXB0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgZnJhbWUgLT0gMztcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHRoaXMuc3RhY2tbZnJhbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZnJhbWUgLT0gMyAqIChkZXB0aCAtIDEpO1xuICAgICAgICAgICAgICAgIHN0YXRlID0gcGFyc2VyLmdldEdvdG8odGhpcy5zdGFja1tmcmFtZSAtIDNdLCB0ZXJtLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBcHBseSB1cCB0byBSZWNvdmVyLk1heE5leHQgcmVjb3ZlcnkgYWN0aW9ucyB0aGF0IGNvbmNlcHR1YWxseVxuICAgIC8vIGluc2VydHMgc29tZSBtaXNzaW5nIHRva2VuIG9yIHJ1bGUuXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHJlY292ZXJCeUluc2VydChuZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA+PSAzMDAgLyogTWF4SW5zZXJ0U3RhY2tEZXB0aCAqLylcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgbGV0IG5leHRTdGF0ZXMgPSB0aGlzLnAucGFyc2VyLm5leHRTdGF0ZXModGhpcy5zdGF0ZSk7XG4gICAgICAgIGlmIChuZXh0U3RhdGVzLmxlbmd0aCA+IDQgLyogTWF4TmV4dCAqLyA8PCAxIHx8IHRoaXMuc3RhY2subGVuZ3RoID49IDEyMCAvKiBEYW1wZW5JbnNlcnRTdGFja0RlcHRoICovKSB7XG4gICAgICAgICAgICBsZXQgYmVzdCA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIHM7IGkgPCBuZXh0U3RhdGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKChzID0gbmV4dFN0YXRlc1tpICsgMV0pICE9IHRoaXMuc3RhdGUgJiYgdGhpcy5wLnBhcnNlci5oYXNBY3Rpb24ocywgbmV4dCkpXG4gICAgICAgICAgICAgICAgICAgIGJlc3QucHVzaChuZXh0U3RhdGVzW2ldLCBzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA8IDEyMCAvKiBEYW1wZW5JbnNlcnRTdGFja0RlcHRoICovKVxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBiZXN0Lmxlbmd0aCA8IDQgLyogTWF4TmV4dCAqLyA8PCAxICYmIGkgPCBuZXh0U3RhdGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzID0gbmV4dFN0YXRlc1tpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghYmVzdC5zb21lKCh2LCBpKSA9PiAoaSAmIDEpICYmIHYgPT0gcykpXG4gICAgICAgICAgICAgICAgICAgICAgICBiZXN0LnB1c2gobmV4dFN0YXRlc1tpXSwgcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dFN0YXRlcyA9IGJlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5leHRTdGF0ZXMubGVuZ3RoICYmIHJlc3VsdC5sZW5ndGggPCA0IC8qIE1heE5leHQgKi87IGkgKz0gMikge1xuICAgICAgICAgICAgbGV0IHMgPSBuZXh0U3RhdGVzW2kgKyAxXTtcbiAgICAgICAgICAgIGlmIChzID09IHRoaXMuc3RhdGUpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSB0aGlzLnNwbGl0KCk7XG4gICAgICAgICAgICBzdGFjay5zdG9yZU5vZGUoMCAvKiBFcnIgKi8sIHN0YWNrLnBvcywgc3RhY2sucG9zLCA0LCB0cnVlKTtcbiAgICAgICAgICAgIHN0YWNrLnB1c2hTdGF0ZShzLCB0aGlzLnBvcyk7XG4gICAgICAgICAgICBzdGFjay5zaGlmdENvbnRleHQobmV4dFN0YXRlc1tpXSk7XG4gICAgICAgICAgICBzdGFjay5zY29yZSAtPSAyMDAgLyogVG9rZW4gKi87XG4gICAgICAgICAgICByZXN1bHQucHVzaChzdGFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8gRm9yY2UgYSByZWR1Y2UsIGlmIHBvc3NpYmxlLiBSZXR1cm4gZmFsc2UgaWYgdGhhdCBjYW4ndFxuICAgIC8vIGJlIGRvbmUuXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGZvcmNlUmVkdWNlKCkge1xuICAgICAgICBsZXQgcmVkdWNlID0gdGhpcy5wLnBhcnNlci5zdGF0ZVNsb3QodGhpcy5zdGF0ZSwgNSAvKiBGb3JjZWRSZWR1Y2UgKi8pO1xuICAgICAgICBpZiAoKHJlZHVjZSAmIDY1NTM2IC8qIFJlZHVjZUZsYWcgKi8pID09IDApXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICghdGhpcy5wLnBhcnNlci52YWxpZEFjdGlvbih0aGlzLnN0YXRlLCByZWR1Y2UpKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JlTm9kZSgwIC8qIEVyciAqLywgdGhpcy5yZWR1Y2VQb3MsIHRoaXMucmVkdWNlUG9zLCA0LCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcmUgLT0gMTAwIC8qIFJlZHVjZSAqLztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlZHVjZShyZWR1Y2UpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGZvcmNlQWxsKCkge1xuICAgICAgICB3aGlsZSAoIXRoaXMucC5wYXJzZXIuc3RhdGVGbGFnKHRoaXMuc3RhdGUsIDIgLyogQWNjZXB0aW5nICovKSAmJiB0aGlzLmZvcmNlUmVkdWNlKCkpIHsgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8vIENoZWNrIHdoZXRoZXIgdGhpcyBzdGF0ZSBoYXMgbm8gZnVydGhlciBhY3Rpb25zIChhc3N1bWVkIHRvIGJlIGEgZGlyZWN0IGRlc2NlbmRhbnQgb2YgdGhlXG4gICAgLy8vIHRvcCBzdGF0ZSwgc2luY2UgYW55IG90aGVyIHN0YXRlcyBtdXN0IGJlIGFibGUgdG8gY29udGludWVcbiAgICAvLy8gc29tZWhvdykuIEBpbnRlcm5hbFxuICAgIGdldCBkZWFkRW5kKCkge1xuICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggIT0gMylcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgbGV0IHsgcGFyc2VyIH0gPSB0aGlzLnA7XG4gICAgICAgIHJldHVybiBwYXJzZXIuZGF0YVtwYXJzZXIuc3RhdGVTbG90KHRoaXMuc3RhdGUsIDEgLyogQWN0aW9ucyAqLyldID09IDY1NTM1IC8qIEVuZCAqLyAmJlxuICAgICAgICAgICAgIXBhcnNlci5zdGF0ZVNsb3QodGhpcy5zdGF0ZSwgNCAvKiBEZWZhdWx0UmVkdWNlICovKTtcbiAgICB9XG4gICAgLy8vIFJlc3RhcnQgdGhlIHN0YWNrIChwdXQgaXQgYmFjayBpbiBpdHMgc3RhcnQgc3RhdGUpLiBPbmx5IHNhZmVcbiAgICAvLy8gd2hlbiB0aGlzLnN0YWNrLmxlbmd0aCA9PSAzIChzdGF0ZSBpcyBkaXJlY3RseSBiZWxvdyB0aGUgdG9wXG4gICAgLy8vIHN0YXRlKS4gQGludGVybmFsXG4gICAgcmVzdGFydCgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuc3RhY2tbMF07XG4gICAgICAgIHRoaXMuc3RhY2subGVuZ3RoID0gMDtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHNhbWVTdGF0ZShvdGhlcikge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPSBvdGhlci5zdGF0ZSB8fCB0aGlzLnN0YWNrLmxlbmd0aCAhPSBvdGhlci5zdGFjay5sZW5ndGgpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGFjay5sZW5ndGg7IGkgKz0gMylcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrW2ldICE9IG90aGVyLnN0YWNrW2ldKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vLyBHZXQgdGhlIHBhcnNlciB1c2VkIGJ5IHRoaXMgc3RhY2suXG4gICAgZ2V0IHBhcnNlcigpIHsgcmV0dXJuIHRoaXMucC5wYXJzZXI7IH1cbiAgICAvLy8gVGVzdCB3aGV0aGVyIGEgZ2l2ZW4gZGlhbGVjdCAoYnkgbnVtZXJpYyBJRCwgYXMgZXhwb3J0ZWQgZnJvbVxuICAgIC8vLyB0aGUgdGVybXMgZmlsZSkgaXMgZW5hYmxlZC5cbiAgICBkaWFsZWN0RW5hYmxlZChkaWFsZWN0SUQpIHsgcmV0dXJuIHRoaXMucC5wYXJzZXIuZGlhbGVjdC5mbGFnc1tkaWFsZWN0SURdOyB9XG4gICAgc2hpZnRDb250ZXh0KHRlcm0pIHtcbiAgICAgICAgaWYgKHRoaXMuY3VyQ29udGV4dClcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29udGV4dCh0aGlzLmN1ckNvbnRleHQudHJhY2tlci5zaGlmdCh0aGlzLmN1ckNvbnRleHQuY29udGV4dCwgdGVybSwgdGhpcy5wLmlucHV0LCB0aGlzKSk7XG4gICAgfVxuICAgIHJlZHVjZUNvbnRleHQodGVybSkge1xuICAgICAgICBpZiAodGhpcy5jdXJDb250ZXh0KVxuICAgICAgICAgICAgdGhpcy51cGRhdGVDb250ZXh0KHRoaXMuY3VyQ29udGV4dC50cmFja2VyLnJlZHVjZSh0aGlzLmN1ckNvbnRleHQuY29udGV4dCwgdGVybSwgdGhpcy5wLmlucHV0LCB0aGlzKSk7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBlbWl0Q29udGV4dCgpIHtcbiAgICAgICAgbGV0IGN4ID0gdGhpcy5jdXJDb250ZXh0O1xuICAgICAgICBpZiAoIWN4LnRyYWNrZXIuc3RyaWN0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsZXQgbGFzdCA9IHRoaXMuYnVmZmVyLmxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChsYXN0IDwgMCB8fCB0aGlzLmJ1ZmZlcltsYXN0XSAhPSAtMilcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyLnB1c2goY3guaGFzaCwgdGhpcy5yZWR1Y2VQb3MsIHRoaXMucmVkdWNlUG9zLCAtMik7XG4gICAgfVxuICAgIHVwZGF0ZUNvbnRleHQoY29udGV4dCkge1xuICAgICAgICBpZiAoY29udGV4dCAhPSB0aGlzLmN1ckNvbnRleHQuY29udGV4dCkge1xuICAgICAgICAgICAgbGV0IG5ld0N4ID0gbmV3IFN0YWNrQ29udGV4dCh0aGlzLmN1ckNvbnRleHQudHJhY2tlciwgY29udGV4dCk7XG4gICAgICAgICAgICBpZiAobmV3Q3guaGFzaCAhPSB0aGlzLmN1ckNvbnRleHQuaGFzaClcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXRDb250ZXh0KCk7XG4gICAgICAgICAgICB0aGlzLmN1ckNvbnRleHQgPSBuZXdDeDtcbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIFN0YWNrQ29udGV4dCB7XG4gICAgY29uc3RydWN0b3IodHJhY2tlciwgY29udGV4dCkge1xuICAgICAgICB0aGlzLnRyYWNrZXIgPSB0cmFja2VyO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLmhhc2ggPSB0cmFja2VyLmhhc2goY29udGV4dCk7XG4gICAgfVxufVxudmFyIFJlY292ZXI7XG4oZnVuY3Rpb24gKFJlY292ZXIpIHtcbiAgICBSZWNvdmVyW1JlY292ZXJbXCJUb2tlblwiXSA9IDIwMF0gPSBcIlRva2VuXCI7XG4gICAgUmVjb3ZlcltSZWNvdmVyW1wiUmVkdWNlXCJdID0gMTAwXSA9IFwiUmVkdWNlXCI7XG4gICAgUmVjb3ZlcltSZWNvdmVyW1wiTWF4TmV4dFwiXSA9IDRdID0gXCJNYXhOZXh0XCI7XG4gICAgUmVjb3ZlcltSZWNvdmVyW1wiTWF4SW5zZXJ0U3RhY2tEZXB0aFwiXSA9IDMwMF0gPSBcIk1heEluc2VydFN0YWNrRGVwdGhcIjtcbiAgICBSZWNvdmVyW1JlY292ZXJbXCJEYW1wZW5JbnNlcnRTdGFja0RlcHRoXCJdID0gMTIwXSA9IFwiRGFtcGVuSW5zZXJ0U3RhY2tEZXB0aFwiO1xufSkoUmVjb3ZlciB8fCAoUmVjb3ZlciA9IHt9KSk7XG4vLyBVc2VkIHRvIGNoZWFwbHkgcnVuIHNvbWUgcmVkdWN0aW9ucyB0byBzY2FuIGFoZWFkIHdpdGhvdXQgbXV0YXRpbmdcbi8vIGFuIGVudGlyZSBzdGFja1xuY2xhc3MgU2ltdWxhdGVkU3RhY2sge1xuICAgIGNvbnN0cnVjdG9yKHN0YWNrKSB7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBzdGFjaztcbiAgICAgICAgdGhpcy50b3AgPSBzdGFjay5zdGF0ZTtcbiAgICAgICAgdGhpcy5yZXN0ID0gc3RhY2suc3RhY2s7XG4gICAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5yZXN0Lmxlbmd0aDtcbiAgICB9XG4gICAgcmVkdWNlKGFjdGlvbikge1xuICAgICAgICBsZXQgdGVybSA9IGFjdGlvbiAmIDY1NTM1IC8qIFZhbHVlTWFzayAqLywgZGVwdGggPSBhY3Rpb24gPj4gMTkgLyogUmVkdWNlRGVwdGhTaGlmdCAqLztcbiAgICAgICAgaWYgKGRlcHRoID09IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3QgPT0gdGhpcy5zdGFjay5zdGFjaylcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3QgPSB0aGlzLnJlc3Quc2xpY2UoKTtcbiAgICAgICAgICAgIHRoaXMucmVzdC5wdXNoKHRoaXMudG9wLCAwLCAwKTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ICs9IDM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCAtPSAoZGVwdGggLSAxKSAqIDM7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGdvdG8gPSB0aGlzLnN0YWNrLnAucGFyc2VyLmdldEdvdG8odGhpcy5yZXN0W3RoaXMub2Zmc2V0IC0gM10sIHRlcm0sIHRydWUpO1xuICAgICAgICB0aGlzLnRvcCA9IGdvdG87XG4gICAgfVxufVxuLy8gVGhpcyBpcyBnaXZlbiB0byBgVHJlZS5idWlsZGAgdG8gYnVpbGQgYSBidWZmZXIsIGFuZCBlbmNhcHN1bGF0ZXNcbi8vIHRoZSBwYXJlbnQtc3RhY2std2Fsa2luZyBuZWNlc3NhcnkgdG8gcmVhZCB0aGUgbm9kZXMuXG5jbGFzcyBTdGFja0J1ZmZlckN1cnNvciB7XG4gICAgY29uc3RydWN0b3Ioc3RhY2ssIHBvcywgaW5kZXgpIHtcbiAgICAgICAgdGhpcy5zdGFjayA9IHN0YWNrO1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IHN0YWNrLmJ1ZmZlcjtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPT0gMClcbiAgICAgICAgICAgIHRoaXMubWF5YmVOZXh0KCk7XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUoc3RhY2spIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGFja0J1ZmZlckN1cnNvcihzdGFjaywgc3RhY2suYnVmZmVyQmFzZSArIHN0YWNrLmJ1ZmZlci5sZW5ndGgsIHN0YWNrLmJ1ZmZlci5sZW5ndGgpO1xuICAgIH1cbiAgICBtYXliZU5leHQoKSB7XG4gICAgICAgIGxldCBuZXh0ID0gdGhpcy5zdGFjay5wYXJlbnQ7XG4gICAgICAgIGlmIChuZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLnN0YWNrLmJ1ZmZlckJhc2UgLSBuZXh0LmJ1ZmZlckJhc2U7XG4gICAgICAgICAgICB0aGlzLnN0YWNrID0gbmV4dDtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gbmV4dC5idWZmZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IGlkKCkgeyByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5pbmRleCAtIDRdOyB9XG4gICAgZ2V0IHN0YXJ0KCkgeyByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5pbmRleCAtIDNdOyB9XG4gICAgZ2V0IGVuZCgpIHsgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMuaW5kZXggLSAyXTsgfVxuICAgIGdldCBzaXplKCkgeyByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5pbmRleCAtIDFdOyB9XG4gICAgbmV4dCgpIHtcbiAgICAgICAgdGhpcy5pbmRleCAtPSA0O1xuICAgICAgICB0aGlzLnBvcyAtPSA0O1xuICAgICAgICBpZiAodGhpcy5pbmRleCA9PSAwKVxuICAgICAgICAgICAgdGhpcy5tYXliZU5leHQoKTtcbiAgICB9XG4gICAgZm9yaygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGFja0J1ZmZlckN1cnNvcih0aGlzLnN0YWNrLCB0aGlzLnBvcywgdGhpcy5pbmRleCk7XG4gICAgfVxufVxuXG4vLy8gVG9rZW5pemVycyB3cml0ZSB0aGUgdG9rZW5zIHRoZXkgcmVhZCBpbnRvIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzLlxuY2xhc3MgVG9rZW4ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLy8gVGhlIHN0YXJ0IG9mIHRoZSB0b2tlbi4gVGhpcyBpcyBzZXQgYnkgdGhlIHBhcnNlciwgYW5kIHNob3VsZCBub3RcbiAgICAgICAgLy8vIGJlIG11dGF0ZWQgYnkgdGhlIHRva2VuaXplci5cbiAgICAgICAgdGhpcy5zdGFydCA9IC0xO1xuICAgICAgICAvLy8gVGhpcyBzdGFydHMgYXQgLTEsIGFuZCBzaG91bGQgYmUgdXBkYXRlZCB0byBhIHRlcm0gaWQgd2hlbiBhXG4gICAgICAgIC8vLyBtYXRjaGluZyB0b2tlbiBpcyBmb3VuZC5cbiAgICAgICAgdGhpcy52YWx1ZSA9IC0xO1xuICAgICAgICAvLy8gV2hlbiBzZXR0aW5nIGAudmFsdWVgLCB5b3Ugc2hvdWxkIGFsc28gc2V0IGAuZW5kYCB0byB0aGUgZW5kXG4gICAgICAgIC8vLyBwb3NpdGlvbiBvZiB0aGUgdG9rZW4uIChZb3UnbGwgdXN1YWxseSB3YW50IHRvIHVzZSB0aGUgYGFjY2VwdGBcbiAgICAgICAgLy8vIG1ldGhvZC4pXG4gICAgICAgIHRoaXMuZW5kID0gLTE7XG4gICAgfVxuICAgIC8vLyBBY2NlcHQgYSB0b2tlbiwgc2V0dGluZyBgdmFsdWVgIGFuZCBgZW5kYCB0byB0aGUgZ2l2ZW4gdmFsdWVzLlxuICAgIGFjY2VwdCh2YWx1ZSwgZW5kKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgfVxufVxuLy8vIEBpbnRlcm5hbFxuY2xhc3MgVG9rZW5Hcm91cCB7XG4gICAgY29uc3RydWN0b3IoZGF0YSwgaWQpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH1cbiAgICB0b2tlbihpbnB1dCwgdG9rZW4sIHN0YWNrKSB7IHJlYWRUb2tlbih0aGlzLmRhdGEsIGlucHV0LCB0b2tlbiwgc3RhY2ssIHRoaXMuaWQpOyB9XG59XG5Ub2tlbkdyb3VwLnByb3RvdHlwZS5jb250ZXh0dWFsID0gVG9rZW5Hcm91cC5wcm90b3R5cGUuZmFsbGJhY2sgPSBUb2tlbkdyb3VwLnByb3RvdHlwZS5leHRlbmQgPSBmYWxzZTtcbi8vLyBFeHBvcnRzIHRoYXQgYXJlIHVzZWQgZm9yIGBAZXh0ZXJuYWwgdG9rZW5zYCBpbiB0aGUgZ3JhbW1hciBzaG91bGRcbi8vLyBleHBvcnQgYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcy5cbmNsYXNzIEV4dGVybmFsVG9rZW5pemVyIHtcbiAgICAvLy8gQ3JlYXRlIGEgdG9rZW5pemVyLiBUaGUgZmlyc3QgYXJndW1lbnQgaXMgdGhlIGZ1bmN0aW9uIHRoYXQsXG4gICAgLy8vIGdpdmVuIGFuIGlucHV0IHN0cmVhbSBhbmQgYSB0b2tlbiBvYmplY3QsXG4gICAgLy8vIFtmaWxsc10oI2xlemVyLlRva2VuLmFjY2VwdCkgdGhlIHRva2VuIG9iamVjdCBpZiBpdCByZWNvZ25pemVzIGFcbiAgICAvLy8gdG9rZW4uIGB0b2tlbi5zdGFydGAgc2hvdWxkIGJlIHVzZWQgYXMgdGhlIHN0YXJ0IHBvc2l0aW9uIHRvXG4gICAgLy8vIHNjYW4gZnJvbS5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvLy8gQGludGVybmFsXG4gICAgdG9rZW4sIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgICAgIHRoaXMuY29udGV4dHVhbCA9ICEhb3B0aW9ucy5jb250ZXh0dWFsO1xuICAgICAgICB0aGlzLmZhbGxiYWNrID0gISFvcHRpb25zLmZhbGxiYWNrO1xuICAgICAgICB0aGlzLmV4dGVuZCA9ICEhb3B0aW9ucy5leHRlbmQ7XG4gICAgfVxufVxuLy8gVG9rZW5pemVyIGRhdGEgaXMgc3RvcmVkIGEgYmlnIHVpbnQxNiBhcnJheSBjb250YWluaW5nLCBmb3IgZWFjaFxuLy8gc3RhdGU6XG4vL1xuLy8gIC0gQSBncm91cCBiaXRtYXNrLCBpbmRpY2F0aW5nIHdoYXQgdG9rZW4gZ3JvdXBzIGFyZSByZWFjaGFibGUgZnJvbVxuLy8gICAgdGhpcyBzdGF0ZSwgc28gdGhhdCBwYXRocyB0aGF0IGNhbiBvbmx5IGxlYWQgdG8gdG9rZW5zIG5vdCBpblxuLy8gICAgYW55IG9mIHRoZSBjdXJyZW50IGdyb3VwcyBjYW4gYmUgY3V0IG9mZiBlYXJseS5cbi8vXG4vLyAgLSBUaGUgcG9zaXRpb24gb2YgdGhlIGVuZCBvZiB0aGUgc3RhdGUncyBzZXF1ZW5jZSBvZiBhY2NlcHRpbmdcbi8vICAgIHRva2Vuc1xuLy9cbi8vICAtIFRoZSBudW1iZXIgb2Ygb3V0Z29pbmcgZWRnZXMgZm9yIHRoZSBzdGF0ZVxuLy9cbi8vICAtIFRoZSBhY2NlcHRpbmcgdG9rZW5zLCBhcyAodG9rZW4gaWQsIGdyb3VwIG1hc2spIHBhaXJzXG4vL1xuLy8gIC0gVGhlIG91dGdvaW5nIGVkZ2VzLCBhcyAoc3RhcnQgY2hhcmFjdGVyLCBlbmQgY2hhcmFjdGVyLCBzdGF0ZVxuLy8gICAgaW5kZXgpIHRyaXBsZXMsIHdpdGggZW5kIGNoYXJhY3RlciBiZWluZyBleGNsdXNpdmVcbi8vXG4vLyBUaGlzIGZ1bmN0aW9uIGludGVycHJldHMgdGhhdCBkYXRhLCBydW5uaW5nIHRocm91Z2ggYSBzdHJlYW0gYXNcbi8vIGxvbmcgYXMgbmV3IHN0YXRlcyB3aXRoIHRoZSBhIG1hdGNoaW5nIGdyb3VwIG1hc2sgY2FuIGJlIHJlYWNoZWQsXG4vLyBhbmQgdXBkYXRpbmcgYHRva2VuYCB3aGVuIGl0IG1hdGNoZXMgYSB0b2tlbi5cbmZ1bmN0aW9uIHJlYWRUb2tlbihkYXRhLCBpbnB1dCwgdG9rZW4sIHN0YWNrLCBncm91cCkge1xuICAgIGxldCBzdGF0ZSA9IDAsIGdyb3VwTWFzayA9IDEgPDwgZ3JvdXAsIGRpYWxlY3QgPSBzdGFjay5wLnBhcnNlci5kaWFsZWN0O1xuICAgIHNjYW46IGZvciAobGV0IHBvcyA9IHRva2VuLnN0YXJ0OzspIHtcbiAgICAgICAgaWYgKChncm91cE1hc2sgJiBkYXRhW3N0YXRlXSkgPT0gMClcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBsZXQgYWNjRW5kID0gZGF0YVtzdGF0ZSArIDFdO1xuICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoaXMgc3RhdGUgY2FuIGxlYWQgdG8gYSB0b2tlbiBpbiB0aGUgY3VycmVudCBncm91cFxuICAgICAgICAvLyBBY2NlcHQgdG9rZW5zIGluIHRoaXMgc3RhdGUsIHBvc3NpYmx5IG92ZXJ3cml0aW5nXG4gICAgICAgIC8vIGxvd2VyLXByZWNlZGVuY2UgLyBzaG9ydGVyIHRva2Vuc1xuICAgICAgICBmb3IgKGxldCBpID0gc3RhdGUgKyAzOyBpIDwgYWNjRW5kOyBpICs9IDIpXG4gICAgICAgICAgICBpZiAoKGRhdGFbaSArIDFdICYgZ3JvdXBNYXNrKSA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgdGVybSA9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgaWYgKGRpYWxlY3QuYWxsb3dzKHRlcm0pICYmXG4gICAgICAgICAgICAgICAgICAgICh0b2tlbi52YWx1ZSA9PSAtMSB8fCB0b2tlbi52YWx1ZSA9PSB0ZXJtIHx8IHN0YWNrLnAucGFyc2VyLm92ZXJyaWRlcyh0ZXJtLCB0b2tlbi52YWx1ZSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuLmFjY2VwdCh0ZXJtLCBwb3MpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIGxldCBuZXh0ID0gaW5wdXQuZ2V0KHBvcysrKTtcbiAgICAgICAgLy8gRG8gYSBiaW5hcnkgc2VhcmNoIG9uIHRoZSBzdGF0ZSdzIGVkZ2VzXG4gICAgICAgIGZvciAobGV0IGxvdyA9IDAsIGhpZ2ggPSBkYXRhW3N0YXRlICsgMl07IGxvdyA8IGhpZ2g7KSB7XG4gICAgICAgICAgICBsZXQgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBhY2NFbmQgKyBtaWQgKyAobWlkIDw8IDEpO1xuICAgICAgICAgICAgbGV0IGZyb20gPSBkYXRhW2luZGV4XSwgdG8gPSBkYXRhW2luZGV4ICsgMV07XG4gICAgICAgICAgICBpZiAobmV4dCA8IGZyb20pXG4gICAgICAgICAgICAgICAgaGlnaCA9IG1pZDtcbiAgICAgICAgICAgIGVsc2UgaWYgKG5leHQgPj0gdG8pXG4gICAgICAgICAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXRlID0gZGF0YVtpbmRleCArIDJdO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlIHNjYW47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuXG4vLyBTZWUgbGV6ZXItZ2VuZXJhdG9yL3NyYy9lbmNvZGUudHMgZm9yIGNvbW1lbnRzIGFib3V0IHRoZSBlbmNvZGluZ1xuLy8gdXNlZCBoZXJlXG5mdW5jdGlvbiBkZWNvZGVBcnJheShpbnB1dCwgVHlwZSA9IFVpbnQxNkFycmF5KSB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCAhPSBcInN0cmluZ1wiKVxuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgbGV0IGFycmF5ID0gbnVsbDtcbiAgICBmb3IgKGxldCBwb3MgPSAwLCBvdXQgPSAwOyBwb3MgPCBpbnB1dC5sZW5ndGg7KSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGxldCBuZXh0ID0gaW5wdXQuY2hhckNvZGVBdChwb3MrKyksIHN0b3AgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChuZXh0ID09IDEyNiAvKiBCaWdWYWxDb2RlICovKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSA2NTUzNSAvKiBCaWdWYWwgKi87XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV4dCA+PSA5MiAvKiBHYXAyICovKVxuICAgICAgICAgICAgICAgIG5leHQtLTtcbiAgICAgICAgICAgIGlmIChuZXh0ID49IDM0IC8qIEdhcDEgKi8pXG4gICAgICAgICAgICAgICAgbmV4dC0tO1xuICAgICAgICAgICAgbGV0IGRpZ2l0ID0gbmV4dCAtIDMyIC8qIFN0YXJ0ICovO1xuICAgICAgICAgICAgaWYgKGRpZ2l0ID49IDQ2IC8qIEJhc2UgKi8pIHtcbiAgICAgICAgICAgICAgICBkaWdpdCAtPSA0NiAvKiBCYXNlICovO1xuICAgICAgICAgICAgICAgIHN0b3AgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgKz0gZGlnaXQ7XG4gICAgICAgICAgICBpZiAoc3RvcClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIHZhbHVlICo9IDQ2IC8qIEJhc2UgKi87XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFycmF5KVxuICAgICAgICAgICAgYXJyYXlbb3V0KytdID0gdmFsdWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGFycmF5ID0gbmV3IFR5cGUodmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8vIEZJWE1FIGZpbmQgc29tZSB3YXkgdG8gcmVkdWNlIHJlY292ZXJ5IHdvcmsgZG9uZSB3aGVuIHRoZSBpbnB1dFxuLy8gZG9lc24ndCBtYXRjaCB0aGUgZ3JhbW1hciBhdCBhbGwuXG4vLyBFbnZpcm9ubWVudCB2YXJpYWJsZSB1c2VkIHRvIGNvbnRyb2wgY29uc29sZSBvdXRwdXRcbmNvbnN0IHZlcmJvc2UgPSB0eXBlb2YgcHJvY2VzcyAhPSBcInVuZGVmaW5lZFwiICYmIC9cXGJwYXJzZVxcYi8udGVzdChwcm9jZXNzLmVudi5MT0cpO1xubGV0IHN0YWNrSURzID0gbnVsbDtcbmZ1bmN0aW9uIGN1dEF0KHRyZWUsIHBvcywgc2lkZSkge1xuICAgIGxldCBjdXJzb3IgPSB0cmVlLmN1cnNvcihwb3MpO1xuICAgIGZvciAoOzspIHtcbiAgICAgICAgaWYgKCEoc2lkZSA8IDAgPyBjdXJzb3IuY2hpbGRCZWZvcmUocG9zKSA6IGN1cnNvci5jaGlsZEFmdGVyKHBvcykpKVxuICAgICAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgICAgICAgIGlmICgoc2lkZSA8IDAgPyBjdXJzb3IudG8gPCBwb3MgOiBjdXJzb3IuZnJvbSA+IHBvcykgJiYgIWN1cnNvci50eXBlLmlzRXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzaWRlIDwgMCA/IE1hdGgubWF4KDAsIE1hdGgubWluKGN1cnNvci50byAtIDEsIHBvcyAtIDUpKSA6IE1hdGgubWluKHRyZWUubGVuZ3RoLCBNYXRoLm1heChjdXJzb3IuZnJvbSArIDEsIHBvcyArIDUpKTtcbiAgICAgICAgICAgICAgICBpZiAoc2lkZSA8IDAgPyBjdXJzb3IucHJldlNpYmxpbmcoKSA6IGN1cnNvci5uZXh0U2libGluZygpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBpZiAoIWN1cnNvci5wYXJlbnQoKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNpZGUgPCAwID8gMCA6IHRyZWUubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIEZyYWdtZW50Q3Vyc29yIHtcbiAgICBjb25zdHJ1Y3RvcihmcmFnbWVudHMpIHtcbiAgICAgICAgdGhpcy5mcmFnbWVudHMgPSBmcmFnbWVudHM7XG4gICAgICAgIHRoaXMuaSA9IDA7XG4gICAgICAgIHRoaXMuZnJhZ21lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnNhZmVGcm9tID0gLTE7XG4gICAgICAgIHRoaXMuc2FmZVRvID0gLTE7XG4gICAgICAgIHRoaXMudHJlZXMgPSBbXTtcbiAgICAgICAgdGhpcy5zdGFydCA9IFtdO1xuICAgICAgICB0aGlzLmluZGV4ID0gW107XG4gICAgICAgIHRoaXMubmV4dEZyYWdtZW50KCk7XG4gICAgfVxuICAgIG5leHRGcmFnbWVudCgpIHtcbiAgICAgICAgbGV0IGZyID0gdGhpcy5mcmFnbWVudCA9IHRoaXMuaSA9PSB0aGlzLmZyYWdtZW50cy5sZW5ndGggPyBudWxsIDogdGhpcy5mcmFnbWVudHNbdGhpcy5pKytdO1xuICAgICAgICBpZiAoZnIpIHtcbiAgICAgICAgICAgIHRoaXMuc2FmZUZyb20gPSBmci5vcGVuU3RhcnQgPyBjdXRBdChmci50cmVlLCBmci5mcm9tICsgZnIub2Zmc2V0LCAxKSAtIGZyLm9mZnNldCA6IGZyLmZyb207XG4gICAgICAgICAgICB0aGlzLnNhZmVUbyA9IGZyLm9wZW5FbmQgPyBjdXRBdChmci50cmVlLCBmci50byArIGZyLm9mZnNldCwgLTEpIC0gZnIub2Zmc2V0IDogZnIudG87XG4gICAgICAgICAgICB3aGlsZSAodGhpcy50cmVlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQucG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleC5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudHJlZXMucHVzaChmci50cmVlKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnQucHVzaCgtZnIub2Zmc2V0KTtcbiAgICAgICAgICAgIHRoaXMuaW5kZXgucHVzaCgwKTtcbiAgICAgICAgICAgIHRoaXMubmV4dFN0YXJ0ID0gdGhpcy5zYWZlRnJvbTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubmV4dFN0YXJ0ID0gMWU5O1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIGBwb3NgIG11c3QgYmUgPj0gYW55IHByZXZpb3VzbHkgZ2l2ZW4gYHBvc2AgZm9yIHRoaXMgY3Vyc29yXG4gICAgbm9kZUF0KHBvcykge1xuICAgICAgICBpZiAocG9zIDwgdGhpcy5uZXh0U3RhcnQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgd2hpbGUgKHRoaXMuZnJhZ21lbnQgJiYgdGhpcy5zYWZlVG8gPD0gcG9zKVxuICAgICAgICAgICAgdGhpcy5uZXh0RnJhZ21lbnQoKTtcbiAgICAgICAgaWYgKCF0aGlzLmZyYWdtZW50KVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGxldCBsYXN0ID0gdGhpcy50cmVlcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgaWYgKGxhc3QgPCAwKSB7IC8vIEVuZCBvZiB0cmVlXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0RnJhZ21lbnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB0b3AgPSB0aGlzLnRyZWVzW2xhc3RdLCBpbmRleCA9IHRoaXMuaW5kZXhbbGFzdF07XG4gICAgICAgICAgICBpZiAoaW5kZXggPT0gdG9wLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJlZXMucG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydC5wb3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4LnBvcCgpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG5leHQgPSB0b3AuY2hpbGRyZW5baW5kZXhdO1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gdGhpcy5zdGFydFtsYXN0XSArIHRvcC5wb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKHN0YXJ0ID4gcG9zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0U3RhcnQgPSBzdGFydDtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0ID09IHBvcyAmJiBzdGFydCArIG5leHQubGVuZ3RoIDw9IHRoaXMuc2FmZVRvKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXJ0ID09IHBvcyAmJiBzdGFydCA+PSB0aGlzLnNhZmVGcm9tID8gbmV4dCA6IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV4dCBpbnN0YW5jZW9mIGxlemVyVHJlZS5UcmVlQnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleFtsYXN0XSsrO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dFN0YXJ0ID0gc3RhcnQgKyBuZXh0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhbbGFzdF0rKztcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnQgKyBuZXh0Lmxlbmd0aCA+PSBwb3MpIHsgLy8gRW50ZXIgdGhpcyBub2RlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlZXMucHVzaChuZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydC5wdXNoKHN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleC5wdXNoKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmNsYXNzIENhY2hlZFRva2VuIGV4dGVuZHMgVG9rZW4ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmV4dGVuZGVkID0gLTE7XG4gICAgICAgIHRoaXMubWFzayA9IDA7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IDA7XG4gICAgfVxuICAgIGNsZWFyKHN0YXJ0KSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZXh0ZW5kZWQgPSAtMTtcbiAgICB9XG59XG5jb25zdCBkdW1teVRva2VuID0gbmV3IFRva2VuO1xuY2xhc3MgVG9rZW5DYWNoZSB7XG4gICAgY29uc3RydWN0b3IocGFyc2VyKSB7XG4gICAgICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgICAgIHRoaXMubWFpblRva2VuID0gZHVtbXlUb2tlbjtcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gW107XG4gICAgICAgIHRoaXMudG9rZW5zID0gcGFyc2VyLnRva2VuaXplcnMubWFwKF8gPT4gbmV3IENhY2hlZFRva2VuKTtcbiAgICB9XG4gICAgZ2V0QWN0aW9ucyhzdGFjaywgaW5wdXQpIHtcbiAgICAgICAgbGV0IGFjdGlvbkluZGV4ID0gMDtcbiAgICAgICAgbGV0IG1haW4gPSBudWxsO1xuICAgICAgICBsZXQgeyBwYXJzZXIgfSA9IHN0YWNrLnAsIHsgdG9rZW5pemVycyB9ID0gcGFyc2VyO1xuICAgICAgICBsZXQgbWFzayA9IHBhcnNlci5zdGF0ZVNsb3Qoc3RhY2suc3RhdGUsIDMgLyogVG9rZW5pemVyTWFzayAqLyk7XG4gICAgICAgIGxldCBjb250ZXh0ID0gc3RhY2suY3VyQ29udGV4dCA/IHN0YWNrLmN1ckNvbnRleHQuaGFzaCA6IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5pemVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKCgoMSA8PCBpKSAmIG1hc2spID09IDApXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBsZXQgdG9rZW5pemVyID0gdG9rZW5pemVyc1tpXSwgdG9rZW4gPSB0aGlzLnRva2Vuc1tpXTtcbiAgICAgICAgICAgIGlmIChtYWluICYmICF0b2tlbml6ZXIuZmFsbGJhY2spXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBpZiAodG9rZW5pemVyLmNvbnRleHR1YWwgfHwgdG9rZW4uc3RhcnQgIT0gc3RhY2sucG9zIHx8IHRva2VuLm1hc2sgIT0gbWFzayB8fCB0b2tlbi5jb250ZXh0ICE9IGNvbnRleHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUNhY2hlZFRva2VuKHRva2VuLCB0b2tlbml6ZXIsIHN0YWNrLCBpbnB1dCk7XG4gICAgICAgICAgICAgICAgdG9rZW4ubWFzayA9IG1hc2s7XG4gICAgICAgICAgICAgICAgdG9rZW4uY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW4udmFsdWUgIT0gMCAvKiBFcnIgKi8pIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnRJbmRleCA9IGFjdGlvbkluZGV4O1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5leHRlbmRlZCA+IC0xKVxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25JbmRleCA9IHRoaXMuYWRkQWN0aW9ucyhzdGFjaywgdG9rZW4uZXh0ZW5kZWQsIHRva2VuLmVuZCwgYWN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgICAgIGFjdGlvbkluZGV4ID0gdGhpcy5hZGRBY3Rpb25zKHN0YWNrLCB0b2tlbi52YWx1ZSwgdG9rZW4uZW5kLCBhY3Rpb25JbmRleCk7XG4gICAgICAgICAgICAgICAgaWYgKCF0b2tlbml6ZXIuZXh0ZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIG1haW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGlvbkluZGV4ID4gc3RhcnRJbmRleClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodGhpcy5hY3Rpb25zLmxlbmd0aCA+IGFjdGlvbkluZGV4KVxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLnBvcCgpO1xuICAgICAgICBpZiAoIW1haW4pIHtcbiAgICAgICAgICAgIG1haW4gPSBkdW1teVRva2VuO1xuICAgICAgICAgICAgbWFpbi5zdGFydCA9IHN0YWNrLnBvcztcbiAgICAgICAgICAgIGlmIChzdGFjay5wb3MgPT0gaW5wdXQubGVuZ3RoKVxuICAgICAgICAgICAgICAgIG1haW4uYWNjZXB0KHN0YWNrLnAucGFyc2VyLmVvZlRlcm0sIHN0YWNrLnBvcyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWFpbi5hY2NlcHQoMCAvKiBFcnIgKi8sIHN0YWNrLnBvcyArIDEpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFpblRva2VuID0gbWFpbjtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWN0aW9ucztcbiAgICB9XG4gICAgdXBkYXRlQ2FjaGVkVG9rZW4odG9rZW4sIHRva2VuaXplciwgc3RhY2ssIGlucHV0KSB7XG4gICAgICAgIHRva2VuLmNsZWFyKHN0YWNrLnBvcyk7XG4gICAgICAgIHRva2VuaXplci50b2tlbihpbnB1dCwgdG9rZW4sIHN0YWNrKTtcbiAgICAgICAgaWYgKHRva2VuLnZhbHVlID4gLTEpIHtcbiAgICAgICAgICAgIGxldCB7IHBhcnNlciB9ID0gc3RhY2sucDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyc2VyLnNwZWNpYWxpemVkLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXIuc3BlY2lhbGl6ZWRbaV0gPT0gdG9rZW4udmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IHBhcnNlci5zcGVjaWFsaXplcnNbaV0oaW5wdXQucmVhZCh0b2tlbi5zdGFydCwgdG9rZW4uZW5kKSwgc3RhY2spO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0ID49IDAgJiYgc3RhY2sucC5wYXJzZXIuZGlhbGVjdC5hbGxvd3MocmVzdWx0ID4+IDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHJlc3VsdCAmIDEpID09IDAgLyogU3BlY2lhbGl6ZSAqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZSA9IHJlc3VsdCA+PiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuLmV4dGVuZGVkID0gcmVzdWx0ID4+IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdGFjay5wb3MgPT0gaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICB0b2tlbi5hY2NlcHQoc3RhY2sucC5wYXJzZXIuZW9mVGVybSwgc3RhY2sucG9zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRva2VuLmFjY2VwdCgwIC8qIEVyciAqLywgc3RhY2sucG9zICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHV0QWN0aW9uKGFjdGlvbiwgdG9rZW4sIGVuZCwgaW5kZXgpIHtcbiAgICAgICAgLy8gRG9uJ3QgYWRkIGR1cGxpY2F0ZSBhY3Rpb25zXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXg7IGkgKz0gMylcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGlvbnNbaV0gPT0gYWN0aW9uKVxuICAgICAgICAgICAgICAgIHJldHVybiBpbmRleDtcbiAgICAgICAgdGhpcy5hY3Rpb25zW2luZGV4KytdID0gYWN0aW9uO1xuICAgICAgICB0aGlzLmFjdGlvbnNbaW5kZXgrK10gPSB0b2tlbjtcbiAgICAgICAgdGhpcy5hY3Rpb25zW2luZGV4KytdID0gZW5kO1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIGFkZEFjdGlvbnMoc3RhY2ssIHRva2VuLCBlbmQsIGluZGV4KSB7XG4gICAgICAgIGxldCB7IHN0YXRlIH0gPSBzdGFjaywgeyBwYXJzZXIgfSA9IHN0YWNrLnAsIHsgZGF0YSB9ID0gcGFyc2VyO1xuICAgICAgICBmb3IgKGxldCBzZXQgPSAwOyBzZXQgPCAyOyBzZXQrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHBhcnNlci5zdGF0ZVNsb3Qoc3RhdGUsIHNldCA/IDIgLyogU2tpcCAqLyA6IDEgLyogQWN0aW9ucyAqLyk7OyBpICs9IDMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXSA9PSA2NTUzNSAvKiBFbmQgKi8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbaSArIDFdID09IDEgLyogTmV4dCAqLykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IHBhaXIoZGF0YSwgaSArIDIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID09IDAgJiYgZGF0YVtpICsgMV0gPT0gMiAvKiBPdGhlciAqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IHRoaXMucHV0QWN0aW9uKHBhaXIoZGF0YSwgaSArIDEpLCB0b2tlbiwgZW5kLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXSA9PSB0b2tlbilcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLnB1dEFjdGlvbihwYWlyKGRhdGEsIGkgKyAxKSwgdG9rZW4sIGVuZCwgaW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG59XG52YXIgUmVjO1xuKGZ1bmN0aW9uIChSZWMpIHtcbiAgICBSZWNbUmVjW1wiRGlzdGFuY2VcIl0gPSA1XSA9IFwiRGlzdGFuY2VcIjtcbiAgICBSZWNbUmVjW1wiTWF4UmVtYWluaW5nUGVyU3RlcFwiXSA9IDNdID0gXCJNYXhSZW1haW5pbmdQZXJTdGVwXCI7XG4gICAgUmVjW1JlY1tcIk1pbkJ1ZmZlckxlbmd0aFBydW5lXCJdID0gMjAwXSA9IFwiTWluQnVmZmVyTGVuZ3RoUHJ1bmVcIjtcbiAgICBSZWNbUmVjW1wiRm9yY2VSZWR1Y2VMaW1pdFwiXSA9IDEwXSA9IFwiRm9yY2VSZWR1Y2VMaW1pdFwiO1xufSkoUmVjIHx8IChSZWMgPSB7fSkpO1xuLy8vIEEgcGFyc2UgY29udGV4dCBjYW4gYmUgdXNlZCBmb3Igc3RlcC1ieS1zdGVwIHBhcnNpbmcuIEFmdGVyXG4vLy8gY3JlYXRpbmcgaXQsIHlvdSByZXBlYXRlZGx5IGNhbGwgYC5hZHZhbmNlKClgIHVudGlsIGl0IHJldHVybnMgYVxuLy8vIHRyZWUgdG8gaW5kaWNhdGUgaXQgaGFzIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgcGFyc2UuXG5jbGFzcyBQYXJzZSB7XG4gICAgY29uc3RydWN0b3IocGFyc2VyLCBpbnB1dCwgc3RhcnRQb3MsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5wYXJzZXIgPSBwYXJzZXI7XG4gICAgICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5zdGFydFBvcyA9IHN0YXJ0UG9zO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAvLyBUaGUgcG9zaXRpb24gdG8gd2hpY2ggdGhlIHBhcnNlIGhhcyBhZHZhbmNlZC5cbiAgICAgICAgdGhpcy5wb3MgPSAwO1xuICAgICAgICB0aGlzLnJlY292ZXJpbmcgPSAwO1xuICAgICAgICB0aGlzLm5leHRTdGFja0lEID0gMHgyNjU0O1xuICAgICAgICB0aGlzLm5lc3RlZCA9IG51bGw7XG4gICAgICAgIHRoaXMubmVzdEVuZCA9IDA7XG4gICAgICAgIHRoaXMubmVzdFdyYXAgPSBudWxsO1xuICAgICAgICB0aGlzLnJldXNlZCA9IFtdO1xuICAgICAgICB0aGlzLnRva2VucyA9IG5ldyBUb2tlbkNhY2hlKHBhcnNlcik7XG4gICAgICAgIHRoaXMudG9wVGVybSA9IHBhcnNlci50b3BbMV07XG4gICAgICAgIHRoaXMuc3RhY2tzID0gW1N0YWNrLnN0YXJ0KHRoaXMsIHBhcnNlci50b3BbMF0sIHRoaXMuc3RhcnRQb3MpXTtcbiAgICAgICAgbGV0IGZyYWdtZW50cyA9IGNvbnRleHQgPT09IG51bGwgfHwgY29udGV4dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29udGV4dC5mcmFnbWVudHM7XG4gICAgICAgIHRoaXMuZnJhZ21lbnRzID0gZnJhZ21lbnRzICYmIGZyYWdtZW50cy5sZW5ndGggPyBuZXcgRnJhZ21lbnRDdXJzb3IoZnJhZ21lbnRzKSA6IG51bGw7XG4gICAgfVxuICAgIC8vIE1vdmUgdGhlIHBhcnNlciBmb3J3YXJkLiBUaGlzIHdpbGwgcHJvY2VzcyBhbGwgcGFyc2Ugc3RhY2tzIGF0XG4gICAgLy8gYHRoaXMucG9zYCBhbmQgdHJ5IHRvIGFkdmFuY2UgdGhlbSB0byBhIGZ1cnRoZXIgcG9zaXRpb24uIElmIG5vXG4gICAgLy8gc3RhY2sgZm9yIHN1Y2ggYSBwb3NpdGlvbiBpcyBmb3VuZCwgaXQnbGwgc3RhcnQgZXJyb3ItcmVjb3ZlcnkuXG4gICAgLy9cbiAgICAvLyBXaGVuIHRoZSBwYXJzZSBpcyBmaW5pc2hlZCwgdGhpcyB3aWxsIHJldHVybiBhIHN5bnRheCB0cmVlLiBXaGVuXG4gICAgLy8gbm90LCBpdCByZXR1cm5zIGBudWxsYC5cbiAgICBhZHZhbmNlKCkge1xuICAgICAgICBpZiAodGhpcy5uZXN0ZWQpIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB0aGlzLm5lc3RlZC5hZHZhbmNlKCk7XG4gICAgICAgICAgICB0aGlzLnBvcyA9IHRoaXMubmVzdGVkLnBvcztcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaE5lc3RlZCh0aGlzLnN0YWNrc1swXSwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICB0aGlzLm5lc3RlZCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RhY2tzID0gdGhpcy5zdGFja3MsIHBvcyA9IHRoaXMucG9zO1xuICAgICAgICAvLyBUaGlzIHdpbGwgaG9sZCBzdGFja3MgYmV5b25kIGBwb3NgLlxuICAgICAgICBsZXQgbmV3U3RhY2tzID0gdGhpcy5zdGFja3MgPSBbXTtcbiAgICAgICAgbGV0IHN0b3BwZWQsIHN0b3BwZWRUb2tlbnM7XG4gICAgICAgIGxldCBtYXliZU5lc3Q7XG4gICAgICAgIC8vIEtlZXAgYWR2YW5jaW5nIGFueSBzdGFja3MgYXQgYHBvc2AgdW50aWwgdGhleSBlaXRoZXIgbW92ZVxuICAgICAgICAvLyBmb3J3YXJkIG9yIGNhbid0IGJlIGFkdmFuY2VkLiBHYXRoZXIgc3RhY2tzIHRoYXQgY2FuJ3QgYmVcbiAgICAgICAgLy8gYWR2YW5jZWQgZnVydGhlciBpbiBgc3RvcHBlZGAuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBzdGFja3NbaV0sIG5lc3Q7XG4gICAgICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrLnBvcyA+IHBvcykge1xuICAgICAgICAgICAgICAgICAgICBuZXdTdGFja3MucHVzaChzdGFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5lc3QgPSB0aGlzLmNoZWNrTmVzdChzdGFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXliZU5lc3QgfHwgbWF5YmVOZXN0LnN0YWNrLnNjb3JlIDwgc3RhY2suc2NvcmUpXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXliZU5lc3QgPSBuZXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmFkdmFuY2VTdGFjayhzdGFjaywgbmV3U3RhY2tzLCBzdGFja3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzdG9wcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wcGVkID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9wcGVkVG9rZW5zID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RvcHBlZC5wdXNoKHN0YWNrKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRvayA9IHRoaXMudG9rZW5zLm1haW5Ub2tlbjtcbiAgICAgICAgICAgICAgICAgICAgc3RvcHBlZFRva2Vucy5wdXNoKHRvay52YWx1ZSwgdG9rLmVuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXliZU5lc3QpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnROZXN0ZWQobWF5YmVOZXN0KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbmV3U3RhY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IGZpbmlzaGVkID0gc3RvcHBlZCAmJiBmaW5kRmluaXNoZWQoc3RvcHBlZCk7XG4gICAgICAgICAgICBpZiAoZmluaXNoZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tUb1RyZWUoZmluaXNoZWQpO1xuICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VyLnN0cmljdCkge1xuICAgICAgICAgICAgICAgIGlmICh2ZXJib3NlICYmIHN0b3BwZWQpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3R1Y2sgd2l0aCB0b2tlbiBcIiArIHRoaXMucGFyc2VyLmdldE5hbWUodGhpcy50b2tlbnMubWFpblRva2VuLnZhbHVlKSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiTm8gcGFyc2UgYXQgXCIgKyBwb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlY292ZXJpbmcpXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNvdmVyaW5nID0gNSAvKiBEaXN0YW5jZSAqLztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZWNvdmVyaW5nICYmIHN0b3BwZWQpIHtcbiAgICAgICAgICAgIGxldCBmaW5pc2hlZCA9IHRoaXMucnVuUmVjb3Zlcnkoc3RvcHBlZCwgc3RvcHBlZFRva2VucywgbmV3U3RhY2tzKTtcbiAgICAgICAgICAgIGlmIChmaW5pc2hlZClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFja1RvVHJlZShmaW5pc2hlZC5mb3JjZUFsbCgpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZWNvdmVyaW5nKSB7XG4gICAgICAgICAgICBsZXQgbWF4UmVtYWluaW5nID0gdGhpcy5yZWNvdmVyaW5nID09IDEgPyAxIDogdGhpcy5yZWNvdmVyaW5nICogMyAvKiBNYXhSZW1haW5pbmdQZXJTdGVwICovO1xuICAgICAgICAgICAgaWYgKG5ld1N0YWNrcy5sZW5ndGggPiBtYXhSZW1haW5pbmcpIHtcbiAgICAgICAgICAgICAgICBuZXdTdGFja3Muc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpO1xuICAgICAgICAgICAgICAgIHdoaWxlIChuZXdTdGFja3MubGVuZ3RoID4gbWF4UmVtYWluaW5nKVxuICAgICAgICAgICAgICAgICAgICBuZXdTdGFja3MucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmV3U3RhY2tzLnNvbWUocyA9PiBzLnJlZHVjZVBvcyA+IHBvcykpXG4gICAgICAgICAgICAgICAgdGhpcy5yZWNvdmVyaW5nLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobmV3U3RhY2tzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIC8vIFBydW5lIHN0YWNrcyB0aGF0IGFyZSBpbiB0aGUgc2FtZSBzdGF0ZSwgb3IgdGhhdCBoYXZlIGJlZW5cbiAgICAgICAgICAgIC8vIHJ1bm5pbmcgd2l0aG91dCBzcGxpdHRpbmcgZm9yIGEgd2hpbGUsIHRvIGF2b2lkIGdldHRpbmcgc3R1Y2tcbiAgICAgICAgICAgIC8vIHdpdGggbXVsdGlwbGUgc3VjY2Vzc2Z1bCBzdGFja3MgcnVubmluZyBlbmRsZXNzbHkgb24uXG4gICAgICAgICAgICBvdXRlcjogZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdTdGFja3MubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YWNrID0gbmV3U3RhY2tzW2ldO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IG5ld1N0YWNrcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb3RoZXIgPSBuZXdTdGFja3Nbal07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFjay5zYW1lU3RhdGUob3RoZXIpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFjay5idWZmZXIubGVuZ3RoID4gMjAwIC8qIE1pbkJ1ZmZlckxlbmd0aFBydW5lICovICYmIG90aGVyLmJ1ZmZlci5sZW5ndGggPiAyMDAgLyogTWluQnVmZmVyTGVuZ3RoUHJ1bmUgKi8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoKHN0YWNrLnNjb3JlIC0gb3RoZXIuc2NvcmUpIHx8IChzdGFjay5idWZmZXIubGVuZ3RoIC0gb3RoZXIuYnVmZmVyLmxlbmd0aCkpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YWNrcy5zcGxpY2Uoai0tLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YWNrcy5zcGxpY2UoaS0tLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvcyA9IG5ld1N0YWNrc1swXS5wb3M7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbmV3U3RhY2tzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgaWYgKG5ld1N0YWNrc1tpXS5wb3MgPCB0aGlzLnBvcylcbiAgICAgICAgICAgICAgICB0aGlzLnBvcyA9IG5ld1N0YWNrc1tpXS5wb3M7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGFuIHVwZGF0ZWQgdmVyc2lvbiBvZiB0aGUgZ2l2ZW4gc3RhY2ssIG9yIG51bGwgaWYgdGhlXG4gICAgLy8gc3RhY2sgY2FuJ3QgYWR2YW5jZSBub3JtYWxseS4gV2hlbiBgc3BsaXRgIGFuZCBgc3RhY2tzYCBhcmVcbiAgICAvLyBnaXZlbiwgc3RhY2tzIHNwbGl0IG9mZiBieSBhbWJpZ3VvdXMgb3BlcmF0aW9ucyB3aWxsIGJlIHB1c2hlZCB0b1xuICAgIC8vIGBzcGxpdGAsIG9yIGFkZGVkIHRvIGBzdGFja3NgIGlmIHRoZXkgbW92ZSBgcG9zYCBmb3J3YXJkLlxuICAgIGFkdmFuY2VTdGFjayhzdGFjaywgc3RhY2tzLCBzcGxpdCkge1xuICAgICAgICBsZXQgc3RhcnQgPSBzdGFjay5wb3MsIHsgaW5wdXQsIHBhcnNlciB9ID0gdGhpcztcbiAgICAgICAgbGV0IGJhc2UgPSB2ZXJib3NlID8gdGhpcy5zdGFja0lEKHN0YWNrKSArIFwiIC0+IFwiIDogXCJcIjtcbiAgICAgICAgaWYgKHRoaXMuZnJhZ21lbnRzKSB7XG4gICAgICAgICAgICBsZXQgc3RyaWN0Q3ggPSBzdGFjay5jdXJDb250ZXh0ICYmIHN0YWNrLmN1ckNvbnRleHQudHJhY2tlci5zdHJpY3QsIGN4SGFzaCA9IHN0cmljdEN4ID8gc3RhY2suY3VyQ29udGV4dC5oYXNoIDogMDtcbiAgICAgICAgICAgIGZvciAobGV0IGNhY2hlZCA9IHRoaXMuZnJhZ21lbnRzLm5vZGVBdChzdGFydCk7IGNhY2hlZDspIHtcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2ggPSB0aGlzLnBhcnNlci5ub2RlU2V0LnR5cGVzW2NhY2hlZC50eXBlLmlkXSA9PSBjYWNoZWQudHlwZSA/IHBhcnNlci5nZXRHb3RvKHN0YWNrLnN0YXRlLCBjYWNoZWQudHlwZS5pZCkgOiAtMTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggPiAtMSAmJiBjYWNoZWQubGVuZ3RoICYmICghc3RyaWN0Q3ggfHwgKGNhY2hlZC5jb250ZXh0SGFzaCB8fCAwKSA9PSBjeEhhc2gpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnVzZU5vZGUoY2FjaGVkLCBtYXRjaCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2ZXJib3NlKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYmFzZSArIHRoaXMuc3RhY2tJRChzdGFjaykgKyBgICh2aWEgcmV1c2Ugb2YgJHtwYXJzZXIuZ2V0TmFtZShjYWNoZWQudHlwZS5pZCl9KWApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEoY2FjaGVkIGluc3RhbmNlb2YgbGV6ZXJUcmVlLlRyZWUpIHx8IGNhY2hlZC5jaGlsZHJlbi5sZW5ndGggPT0gMCB8fCBjYWNoZWQucG9zaXRpb25zWzBdID4gMClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgbGV0IGlubmVyID0gY2FjaGVkLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgICAgIGlmIChpbm5lciBpbnN0YW5jZW9mIGxlemVyVHJlZS5UcmVlKVxuICAgICAgICAgICAgICAgICAgICBjYWNoZWQgPSBpbm5lcjtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBkZWZhdWx0UmVkdWNlID0gcGFyc2VyLnN0YXRlU2xvdChzdGFjay5zdGF0ZSwgNCAvKiBEZWZhdWx0UmVkdWNlICovKTtcbiAgICAgICAgaWYgKGRlZmF1bHRSZWR1Y2UgPiAwKSB7XG4gICAgICAgICAgICBzdGFjay5yZWR1Y2UoZGVmYXVsdFJlZHVjZSk7XG4gICAgICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhiYXNlICsgdGhpcy5zdGFja0lEKHN0YWNrKSArIGAgKHZpYSBhbHdheXMtcmVkdWNlICR7cGFyc2VyLmdldE5hbWUoZGVmYXVsdFJlZHVjZSAmIDY1NTM1IC8qIFZhbHVlTWFzayAqLyl9KWApO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFjdGlvbnMgPSB0aGlzLnRva2Vucy5nZXRBY3Rpb25zKHN0YWNrLCBpbnB1dCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aW9ucy5sZW5ndGg7KSB7XG4gICAgICAgICAgICBsZXQgYWN0aW9uID0gYWN0aW9uc1tpKytdLCB0ZXJtID0gYWN0aW9uc1tpKytdLCBlbmQgPSBhY3Rpb25zW2krK107XG4gICAgICAgICAgICBsZXQgbGFzdCA9IGkgPT0gYWN0aW9ucy5sZW5ndGggfHwgIXNwbGl0O1xuICAgICAgICAgICAgbGV0IGxvY2FsU3RhY2sgPSBsYXN0ID8gc3RhY2sgOiBzdGFjay5zcGxpdCgpO1xuICAgICAgICAgICAgbG9jYWxTdGFjay5hcHBseShhY3Rpb24sIHRlcm0sIGVuZCk7XG4gICAgICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhiYXNlICsgdGhpcy5zdGFja0lEKGxvY2FsU3RhY2spICsgYCAodmlhICR7KGFjdGlvbiAmIDY1NTM2IC8qIFJlZHVjZUZsYWcgKi8pID09IDAgPyBcInNoaWZ0XCJcbiAgICAgICAgICAgICAgICAgICAgOiBgcmVkdWNlIG9mICR7cGFyc2VyLmdldE5hbWUoYWN0aW9uICYgNjU1MzUgLyogVmFsdWVNYXNrICovKX1gfSBmb3IgJHtwYXJzZXIuZ2V0TmFtZSh0ZXJtKX0gQCAke3N0YXJ0fSR7bG9jYWxTdGFjayA9PSBzdGFjayA/IFwiXCIgOiBcIiwgc3BsaXRcIn0pYCk7XG4gICAgICAgICAgICBpZiAobGFzdClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGxvY2FsU3RhY2sucG9zID4gc3RhcnQpXG4gICAgICAgICAgICAgICAgc3RhY2tzLnB1c2gobG9jYWxTdGFjayk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc3BsaXQucHVzaChsb2NhbFN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEFkdmFuY2UgYSBnaXZlbiBzdGFjayBmb3J3YXJkIGFzIGZhciBhcyBpdCB3aWxsIGdvLiBSZXR1cm5zIHRoZVxuICAgIC8vIChwb3NzaWJseSB1cGRhdGVkKSBzdGFjayBpZiBpdCBnb3Qgc3R1Y2ssIG9yIG51bGwgaWYgaXQgbW92ZWRcbiAgICAvLyBmb3J3YXJkIGFuZCB3YXMgZ2l2ZW4gdG8gYHB1c2hTdGFja0RlZHVwYC5cbiAgICBhZHZhbmNlRnVsbHkoc3RhY2ssIG5ld1N0YWNrcykge1xuICAgICAgICBsZXQgcG9zID0gc3RhY2sucG9zO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBsZXQgbmVzdCA9IHRoaXMuY2hlY2tOZXN0KHN0YWNrKTtcbiAgICAgICAgICAgIGlmIChuZXN0KVxuICAgICAgICAgICAgICAgIHJldHVybiBuZXN0O1xuICAgICAgICAgICAgaWYgKCF0aGlzLmFkdmFuY2VTdGFjayhzdGFjaywgbnVsbCwgbnVsbCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKHN0YWNrLnBvcyA+IHBvcykge1xuICAgICAgICAgICAgICAgIHB1c2hTdGFja0RlZHVwKHN0YWNrLCBuZXdTdGFja3MpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJ1blJlY292ZXJ5KHN0YWNrcywgdG9rZW5zLCBuZXdTdGFja3MpIHtcbiAgICAgICAgbGV0IGZpbmlzaGVkID0gbnVsbCwgcmVzdGFydGVkID0gZmFsc2U7XG4gICAgICAgIGxldCBtYXliZU5lc3Q7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3RhY2sgPSBzdGFja3NbaV0sIHRva2VuID0gdG9rZW5zW2kgPDwgMV0sIHRva2VuRW5kID0gdG9rZW5zWyhpIDw8IDEpICsgMV07XG4gICAgICAgICAgICBsZXQgYmFzZSA9IHZlcmJvc2UgPyB0aGlzLnN0YWNrSUQoc3RhY2spICsgXCIgLT4gXCIgOiBcIlwiO1xuICAgICAgICAgICAgaWYgKHN0YWNrLmRlYWRFbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdGFydGVkKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICByZXN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YWNrLnJlc3RhcnQoKTtcbiAgICAgICAgICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYmFzZSArIHRoaXMuc3RhY2tJRChzdGFjaykgKyBcIiAocmVzdGFydGVkKVwiKTtcbiAgICAgICAgICAgICAgICBsZXQgZG9uZSA9IHRoaXMuYWR2YW5jZUZ1bGx5KHN0YWNrLCBuZXdTdGFja3MpO1xuICAgICAgICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb25lICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWF5YmVOZXN0ID0gZG9uZTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGZvcmNlID0gc3RhY2suc3BsaXQoKSwgZm9yY2VCYXNlID0gYmFzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBmb3JjZS5mb3JjZVJlZHVjZSgpICYmIGogPCAxMCAvKiBGb3JjZVJlZHVjZUxpbWl0ICovOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZm9yY2VCYXNlICsgdGhpcy5zdGFja0lEKGZvcmNlKSArIFwiICh2aWEgZm9yY2UtcmVkdWNlKVwiKTtcbiAgICAgICAgICAgICAgICBsZXQgZG9uZSA9IHRoaXMuYWR2YW5jZUZ1bGx5KGZvcmNlLCBuZXdTdGFja3MpO1xuICAgICAgICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkb25lICE9PSB0cnVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWF5YmVOZXN0ID0gZG9uZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2ZXJib3NlKVxuICAgICAgICAgICAgICAgICAgICBmb3JjZUJhc2UgPSB0aGlzLnN0YWNrSUQoZm9yY2UpICsgXCIgLT4gXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpbnNlcnQgb2Ygc3RhY2sucmVjb3ZlckJ5SW5zZXJ0KHRva2VuKSkge1xuICAgICAgICAgICAgICAgIGlmICh2ZXJib3NlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhiYXNlICsgdGhpcy5zdGFja0lEKGluc2VydCkgKyBcIiAodmlhIHJlY292ZXItaW5zZXJ0KVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkdmFuY2VGdWxseShpbnNlcnQsIG5ld1N0YWNrcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dC5sZW5ndGggPiBzdGFjay5wb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW5FbmQgPT0gc3RhY2sucG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuRW5kKys7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gMCAvKiBFcnIgKi87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0YWNrLnJlY292ZXJCeURlbGV0ZSh0b2tlbiwgdG9rZW5FbmQpO1xuICAgICAgICAgICAgICAgIGlmICh2ZXJib3NlKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhiYXNlICsgdGhpcy5zdGFja0lEKHN0YWNrKSArIGAgKHZpYSByZWNvdmVyLWRlbGV0ZSAke3RoaXMucGFyc2VyLmdldE5hbWUodG9rZW4pfSlgKTtcbiAgICAgICAgICAgICAgICBwdXNoU3RhY2tEZWR1cChzdGFjaywgbmV3U3RhY2tzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFmaW5pc2hlZCB8fCBmaW5pc2hlZC5zY29yZSA8IHN0YWNrLnNjb3JlKSB7XG4gICAgICAgICAgICAgICAgZmluaXNoZWQgPSBzdGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoZmluaXNoZWQpXG4gICAgICAgICAgICByZXR1cm4gZmluaXNoZWQ7XG4gICAgICAgIGlmIChtYXliZU5lc3QpXG4gICAgICAgICAgICBmb3IgKGxldCBzIG9mIHRoaXMuc3RhY2tzKVxuICAgICAgICAgICAgICAgIGlmIChzLnNjb3JlID4gbWF5YmVOZXN0LnN0YWNrLnNjb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1heWJlTmVzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICBpZiAobWF5YmVOZXN0KVxuICAgICAgICAgICAgdGhpcy5zdGFydE5lc3RlZChtYXliZU5lc3QpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZm9yY2VGaW5pc2goKSB7XG4gICAgICAgIGxldCBzdGFjayA9IHRoaXMuc3RhY2tzWzBdLnNwbGl0KCk7XG4gICAgICAgIGlmICh0aGlzLm5lc3RlZClcbiAgICAgICAgICAgIHRoaXMuZmluaXNoTmVzdGVkKHN0YWNrLCB0aGlzLm5lc3RlZC5mb3JjZUZpbmlzaCgpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tUb1RyZWUoc3RhY2suZm9yY2VBbGwoKSk7XG4gICAgfVxuICAgIC8vIENvbnZlcnQgdGhlIHN0YWNrJ3MgYnVmZmVyIHRvIGEgc3ludGF4IHRyZWUuXG4gICAgc3RhY2tUb1RyZWUoc3RhY2ssIHBvcyA9IHN0YWNrLnBvcykge1xuICAgICAgICBpZiAodGhpcy5wYXJzZXIuY29udGV4dClcbiAgICAgICAgICAgIHN0YWNrLmVtaXRDb250ZXh0KCk7XG4gICAgICAgIHJldHVybiBsZXplclRyZWUuVHJlZS5idWlsZCh7IGJ1ZmZlcjogU3RhY2tCdWZmZXJDdXJzb3IuY3JlYXRlKHN0YWNrKSxcbiAgICAgICAgICAgIG5vZGVTZXQ6IHRoaXMucGFyc2VyLm5vZGVTZXQsXG4gICAgICAgICAgICB0b3BJRDogdGhpcy50b3BUZXJtLFxuICAgICAgICAgICAgbWF4QnVmZmVyTGVuZ3RoOiB0aGlzLnBhcnNlci5idWZmZXJMZW5ndGgsXG4gICAgICAgICAgICByZXVzZWQ6IHRoaXMucmV1c2VkLFxuICAgICAgICAgICAgc3RhcnQ6IHRoaXMuc3RhcnRQb3MsXG4gICAgICAgICAgICBsZW5ndGg6IHBvcyAtIHRoaXMuc3RhcnRQb3MsXG4gICAgICAgICAgICBtaW5SZXBlYXRUeXBlOiB0aGlzLnBhcnNlci5taW5SZXBlYXRUZXJtIH0pO1xuICAgIH1cbiAgICBjaGVja05lc3Qoc3RhY2spIHtcbiAgICAgICAgbGV0IGluZm8gPSB0aGlzLnBhcnNlci5maW5kTmVzdGVkKHN0YWNrLnN0YXRlKTtcbiAgICAgICAgaWYgKCFpbmZvKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGxldCBzcGVjID0gaW5mby52YWx1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBzcGVjID09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgIHNwZWMgPSBzcGVjKHRoaXMuaW5wdXQsIHN0YWNrKTtcbiAgICAgICAgcmV0dXJuIHNwZWMgPyB7IHN0YWNrLCBpbmZvLCBzcGVjIH0gOiBudWxsO1xuICAgIH1cbiAgICBzdGFydE5lc3RlZChuZXN0KSB7XG4gICAgICAgIGxldCB7IHN0YWNrLCBpbmZvLCBzcGVjIH0gPSBuZXN0O1xuICAgICAgICB0aGlzLnN0YWNrcyA9IFtzdGFja107XG4gICAgICAgIHRoaXMubmVzdEVuZCA9IHRoaXMuc2NhbkZvck5lc3RFbmQoc3RhY2ssIGluZm8uZW5kLCBzcGVjLmZpbHRlckVuZCk7XG4gICAgICAgIHRoaXMubmVzdFdyYXAgPSB0eXBlb2Ygc3BlYy53cmFwVHlwZSA9PSBcIm51bWJlclwiID8gdGhpcy5wYXJzZXIubm9kZVNldC50eXBlc1tzcGVjLndyYXBUeXBlXSA6IHNwZWMud3JhcFR5cGUgfHwgbnVsbDtcbiAgICAgICAgaWYgKHNwZWMuc3RhcnRQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5uZXN0ZWQgPSBzcGVjLnN0YXJ0UGFyc2UodGhpcy5pbnB1dC5jbGlwKHRoaXMubmVzdEVuZCksIHN0YWNrLnBvcywgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoTmVzdGVkKHN0YWNrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzY2FuRm9yTmVzdEVuZChzdGFjaywgZW5kVG9rZW4sIGZpbHRlcikge1xuICAgICAgICBmb3IgKGxldCBwb3MgPSBzdGFjay5wb3M7IHBvcyA8IHRoaXMuaW5wdXQubGVuZ3RoOyBwb3MrKykge1xuICAgICAgICAgICAgZHVtbXlUb2tlbi5zdGFydCA9IHBvcztcbiAgICAgICAgICAgIGR1bW15VG9rZW4udmFsdWUgPSAtMTtcbiAgICAgICAgICAgIGVuZFRva2VuLnRva2VuKHRoaXMuaW5wdXQsIGR1bW15VG9rZW4sIHN0YWNrKTtcbiAgICAgICAgICAgIGlmIChkdW1teVRva2VuLnZhbHVlID4gLTEgJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKHRoaXMuaW5wdXQucmVhZChwb3MsIGR1bW15VG9rZW4uZW5kKSkpKVxuICAgICAgICAgICAgICAgIHJldHVybiBwb3M7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXQubGVuZ3RoO1xuICAgIH1cbiAgICBmaW5pc2hOZXN0ZWQoc3RhY2ssIHRyZWUpIHtcbiAgICAgICAgaWYgKHRoaXMubmVzdFdyYXApXG4gICAgICAgICAgICB0cmVlID0gbmV3IGxlemVyVHJlZS5UcmVlKHRoaXMubmVzdFdyYXAsIHRyZWUgPyBbdHJlZV0gOiBbXSwgdHJlZSA/IFswXSA6IFtdLCB0aGlzLm5lc3RFbmQgLSBzdGFjay5wb3MpO1xuICAgICAgICBlbHNlIGlmICghdHJlZSlcbiAgICAgICAgICAgIHRyZWUgPSBuZXcgbGV6ZXJUcmVlLlRyZWUobGV6ZXJUcmVlLk5vZGVUeXBlLm5vbmUsIFtdLCBbXSwgdGhpcy5uZXN0RW5kIC0gc3RhY2sucG9zKTtcbiAgICAgICAgbGV0IGluZm8gPSB0aGlzLnBhcnNlci5maW5kTmVzdGVkKHN0YWNrLnN0YXRlKTtcbiAgICAgICAgc3RhY2sudXNlTm9kZSh0cmVlLCB0aGlzLnBhcnNlci5nZXRHb3RvKHN0YWNrLnN0YXRlLCBpbmZvLnBsYWNlaG9sZGVyLCB0cnVlKSk7XG4gICAgICAgIGlmICh2ZXJib3NlKVxuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zdGFja0lEKHN0YWNrKSArIGAgKHZpYSB1bm5lc3QpYCk7XG4gICAgfVxuICAgIHN0YWNrSUQoc3RhY2spIHtcbiAgICAgICAgbGV0IGlkID0gKHN0YWNrSURzIHx8IChzdGFja0lEcyA9IG5ldyBXZWFrTWFwKSkuZ2V0KHN0YWNrKTtcbiAgICAgICAgaWYgKCFpZClcbiAgICAgICAgICAgIHN0YWNrSURzLnNldChzdGFjaywgaWQgPSBTdHJpbmcuZnJvbUNvZGVQb2ludCh0aGlzLm5leHRTdGFja0lEKyspKTtcbiAgICAgICAgcmV0dXJuIGlkICsgc3RhY2s7XG4gICAgfVxufVxuZnVuY3Rpb24gcHVzaFN0YWNrRGVkdXAoc3RhY2ssIG5ld1N0YWNrcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RhY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBvdGhlciA9IG5ld1N0YWNrc1tpXTtcbiAgICAgICAgaWYgKG90aGVyLnBvcyA9PSBzdGFjay5wb3MgJiYgb3RoZXIuc2FtZVN0YXRlKHN0YWNrKSkge1xuICAgICAgICAgICAgaWYgKG5ld1N0YWNrc1tpXS5zY29yZSA8IHN0YWNrLnNjb3JlKVxuICAgICAgICAgICAgICAgIG5ld1N0YWNrc1tpXSA9IHN0YWNrO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5ld1N0YWNrcy5wdXNoKHN0YWNrKTtcbn1cbmNsYXNzIERpYWxlY3Qge1xuICAgIGNvbnN0cnVjdG9yKHNvdXJjZSwgZmxhZ3MsIGRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLmZsYWdzID0gZmxhZ3M7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICB9XG4gICAgYWxsb3dzKHRlcm0pIHsgcmV0dXJuICF0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZWRbdGVybV0gPT0gMDsgfVxufVxuY29uc3QgaWQgPSB4ID0+IHg7XG4vLy8gQ29udGV4dCB0cmFja2VycyBhcmUgdXNlZCB0byB0cmFjayBzdGF0ZWZ1bCBjb250ZXh0IChzdWNoIGFzXG4vLy8gaW5kZW50YXRpb24gaW4gdGhlIFB5dGhvbiBncmFtbWFyLCBvciBwYXJlbnQgZWxlbWVudHMgaW4gdGhlIFhNTFxuLy8vIGdyYW1tYXIpIG5lZWRlZCBieSBleHRlcm5hbCB0b2tlbml6ZXJzLiBZb3UgZGVjbGFyZSB0aGVtIGluIGFcbi8vLyBncmFtbWFyIGZpbGUgYXMgYEBjb250ZXh0IGV4cG9ydE5hbWUgZnJvbSBcIm1vZHVsZVwiYC5cbi8vL1xuLy8vIENvbnRleHQgdmFsdWVzIHNob3VsZCBiZSBpbW11dGFibGUsIGFuZCBjYW4gYmUgdXBkYXRlZCAocmVwbGFjZWQpXG4vLy8gb24gc2hpZnQgb3IgcmVkdWNlIGFjdGlvbnMuXG5jbGFzcyBDb250ZXh0VHJhY2tlciB7XG4gICAgLy8vIFRoZSBleHBvcnQgdXNlZCBpbiBhIGBAY29udGV4dGAgZGVjbGFyYXRpb24gc2hvdWxkIGJlIG9mIHRoaXNcbiAgICAvLy8gdHlwZS5cbiAgICBjb25zdHJ1Y3RvcihzcGVjKSB7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzcGVjLnN0YXJ0O1xuICAgICAgICB0aGlzLnNoaWZ0ID0gc3BlYy5zaGlmdCB8fCBpZDtcbiAgICAgICAgdGhpcy5yZWR1Y2UgPSBzcGVjLnJlZHVjZSB8fCBpZDtcbiAgICAgICAgdGhpcy5yZXVzZSA9IHNwZWMucmV1c2UgfHwgaWQ7XG4gICAgICAgIHRoaXMuaGFzaCA9IHNwZWMuaGFzaDtcbiAgICAgICAgdGhpcy5zdHJpY3QgPSBzcGVjLnN0cmljdCAhPT0gZmFsc2U7XG4gICAgfVxufVxuLy8vIEEgcGFyc2VyIGhvbGRzIHRoZSBwYXJzZSB0YWJsZXMgZm9yIGEgZ2l2ZW4gZ3JhbW1hciwgYXMgZ2VuZXJhdGVkXG4vLy8gYnkgYGxlemVyLWdlbmVyYXRvcmAuXG5jbGFzcyBQYXJzZXIge1xuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBjb25zdHJ1Y3RvcihzcGVjKSB7XG4gICAgICAgIC8vLyBAaW50ZXJuYWxcbiAgICAgICAgdGhpcy5idWZmZXJMZW5ndGggPSBsZXplclRyZWUuRGVmYXVsdEJ1ZmZlckxlbmd0aDtcbiAgICAgICAgLy8vIEBpbnRlcm5hbFxuICAgICAgICB0aGlzLnN0cmljdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhY2hlZERpYWxlY3QgPSBudWxsO1xuICAgICAgICBpZiAoc3BlYy52ZXJzaW9uICE9IDEzIC8qIFZlcnNpb24gKi8pXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgUGFyc2VyIHZlcnNpb24gKCR7c3BlYy52ZXJzaW9ufSkgZG9lc24ndCBtYXRjaCBydW50aW1lIHZlcnNpb24gKCR7MTMgLyogVmVyc2lvbiAqL30pYCk7XG4gICAgICAgIGxldCB0b2tlbkFycmF5ID0gZGVjb2RlQXJyYXkoc3BlYy50b2tlbkRhdGEpO1xuICAgICAgICBsZXQgbm9kZU5hbWVzID0gc3BlYy5ub2RlTmFtZXMuc3BsaXQoXCIgXCIpO1xuICAgICAgICB0aGlzLm1pblJlcGVhdFRlcm0gPSBub2RlTmFtZXMubGVuZ3RoO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBzcGVjLmNvbnRleHQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BlYy5yZXBlYXROb2RlQ291bnQ7IGkrKylcbiAgICAgICAgICAgIG5vZGVOYW1lcy5wdXNoKFwiXCIpO1xuICAgICAgICBsZXQgbm9kZVByb3BzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZU5hbWVzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgbm9kZVByb3BzLnB1c2goW10pO1xuICAgICAgICBmdW5jdGlvbiBzZXRQcm9wKG5vZGVJRCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgICAgICAgIG5vZGVQcm9wc1tub2RlSURdLnB1c2goW3Byb3AsIHByb3AuZGVzZXJpYWxpemUoU3RyaW5nKHZhbHVlKSldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3BlYy5ub2RlUHJvcHMpXG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wU3BlYyBvZiBzcGVjLm5vZGVQcm9wcykge1xuICAgICAgICAgICAgICAgIGxldCBwcm9wID0gcHJvcFNwZWNbMF07XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwcm9wU3BlYy5sZW5ndGg7KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gcHJvcFNwZWNbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0UHJvcChuZXh0LCBwcm9wLCBwcm9wU3BlY1tpKytdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHByb3BTcGVjW2kgKyAtbmV4dF07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gLW5leHQ7IGogPiAwOyBqLS0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0UHJvcChwcm9wU3BlY1tpKytdLCBwcm9wLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIHRoaXMuc3BlY2lhbGl6ZWQgPSBuZXcgVWludDE2QXJyYXkoc3BlYy5zcGVjaWFsaXplZCA/IHNwZWMuc3BlY2lhbGl6ZWQubGVuZ3RoIDogMCk7XG4gICAgICAgIHRoaXMuc3BlY2lhbGl6ZXJzID0gW107XG4gICAgICAgIGlmIChzcGVjLnNwZWNpYWxpemVkKVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGVjLnNwZWNpYWxpemVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGVjaWFsaXplZFtpXSA9IHNwZWMuc3BlY2lhbGl6ZWRbaV0udGVybTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWNpYWxpemVyc1tpXSA9IHNwZWMuc3BlY2lhbGl6ZWRbaV0uZ2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlcyA9IGRlY29kZUFycmF5KHNwZWMuc3RhdGVzLCBVaW50MzJBcnJheSk7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRlY29kZUFycmF5KHNwZWMuc3RhdGVEYXRhKTtcbiAgICAgICAgdGhpcy5nb3RvID0gZGVjb2RlQXJyYXkoc3BlYy5nb3RvKTtcbiAgICAgICAgbGV0IHRvcFRlcm1zID0gT2JqZWN0LmtleXMoc3BlYy50b3BSdWxlcykubWFwKHIgPT4gc3BlYy50b3BSdWxlc1tyXVsxXSk7XG4gICAgICAgIHRoaXMubm9kZVNldCA9IG5ldyBsZXplclRyZWUuTm9kZVNldChub2RlTmFtZXMubWFwKChuYW1lLCBpKSA9PiBsZXplclRyZWUuTm9kZVR5cGUuZGVmaW5lKHtcbiAgICAgICAgICAgIG5hbWU6IGkgPj0gdGhpcy5taW5SZXBlYXRUZXJtID8gdW5kZWZpbmVkIDogbmFtZSxcbiAgICAgICAgICAgIGlkOiBpLFxuICAgICAgICAgICAgcHJvcHM6IG5vZGVQcm9wc1tpXSxcbiAgICAgICAgICAgIHRvcDogdG9wVGVybXMuaW5kZXhPZihpKSA+IC0xLFxuICAgICAgICAgICAgZXJyb3I6IGkgPT0gMCxcbiAgICAgICAgICAgIHNraXBwZWQ6IHNwZWMuc2tpcHBlZE5vZGVzICYmIHNwZWMuc2tpcHBlZE5vZGVzLmluZGV4T2YoaSkgPiAtMVxuICAgICAgICB9KSkpO1xuICAgICAgICB0aGlzLm1heFRlcm0gPSBzcGVjLm1heFRlcm07XG4gICAgICAgIHRoaXMudG9rZW5pemVycyA9IHNwZWMudG9rZW5pemVycy5tYXAodmFsdWUgPT4gdHlwZW9mIHZhbHVlID09IFwibnVtYmVyXCIgPyBuZXcgVG9rZW5Hcm91cCh0b2tlbkFycmF5LCB2YWx1ZSkgOiB2YWx1ZSk7XG4gICAgICAgIHRoaXMudG9wUnVsZXMgPSBzcGVjLnRvcFJ1bGVzO1xuICAgICAgICB0aGlzLm5lc3RlZCA9IChzcGVjLm5lc3RlZCB8fCBbXSkubWFwKChbbmFtZSwgdmFsdWUsIGVuZFRva2VuLCBwbGFjZWhvbGRlcl0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWUsIHZhbHVlLCBlbmQ6IG5ldyBUb2tlbkdyb3VwKGRlY29kZUFycmF5KGVuZFRva2VuKSwgMCksIHBsYWNlaG9sZGVyIH07XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpYWxlY3RzID0gc3BlYy5kaWFsZWN0cyB8fCB7fTtcbiAgICAgICAgdGhpcy5keW5hbWljUHJlY2VkZW5jZXMgPSBzcGVjLmR5bmFtaWNQcmVjZWRlbmNlcyB8fCBudWxsO1xuICAgICAgICB0aGlzLnRva2VuUHJlY1RhYmxlID0gc3BlYy50b2tlblByZWM7XG4gICAgICAgIHRoaXMudGVybU5hbWVzID0gc3BlYy50ZXJtTmFtZXMgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5tYXhOb2RlID0gdGhpcy5ub2RlU2V0LnR5cGVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHRoaXMuZGlhbGVjdCA9IHRoaXMucGFyc2VEaWFsZWN0KCk7XG4gICAgICAgIHRoaXMudG9wID0gdGhpcy50b3BSdWxlc1tPYmplY3Qua2V5cyh0aGlzLnRvcFJ1bGVzKVswXV07XG4gICAgfVxuICAgIC8vLyBQYXJzZSBhIGdpdmVuIHN0cmluZyBvciBzdHJlYW0uXG4gICAgcGFyc2UoaW5wdXQsIHN0YXJ0UG9zID0gMCwgY29udGV4dCA9IHt9KSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgIGlucHV0ID0gbGV6ZXJUcmVlLnN0cmluZ0lucHV0KGlucHV0KTtcbiAgICAgICAgbGV0IGN4ID0gbmV3IFBhcnNlKHRoaXMsIGlucHV0LCBzdGFydFBvcywgY29udGV4dCk7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGxldCBkb25lID0gY3guYWR2YW5jZSgpO1xuICAgICAgICAgICAgaWYgKGRvbmUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvbmU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8vIFN0YXJ0IGFuIGluY3JlbWVudGFsIHBhcnNlLlxuICAgIHN0YXJ0UGFyc2UoaW5wdXQsIHN0YXJ0UG9zID0gMCwgY29udGV4dCA9IHt9KSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgIGlucHV0ID0gbGV6ZXJUcmVlLnN0cmluZ0lucHV0KGlucHV0KTtcbiAgICAgICAgcmV0dXJuIG5ldyBQYXJzZSh0aGlzLCBpbnB1dCwgc3RhcnRQb3MsIGNvbnRleHQpO1xuICAgIH1cbiAgICAvLy8gR2V0IGEgZ290byB0YWJsZSBlbnRyeSBAaW50ZXJuYWxcbiAgICBnZXRHb3RvKHN0YXRlLCB0ZXJtLCBsb29zZSA9IGZhbHNlKSB7XG4gICAgICAgIGxldCB0YWJsZSA9IHRoaXMuZ290bztcbiAgICAgICAgaWYgKHRlcm0gPj0gdGFibGVbMF0pXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIGZvciAobGV0IHBvcyA9IHRhYmxlW3Rlcm0gKyAxXTs7KSB7XG4gICAgICAgICAgICBsZXQgZ3JvdXBUYWcgPSB0YWJsZVtwb3MrK10sIGxhc3QgPSBncm91cFRhZyAmIDE7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0ID0gdGFibGVbcG9zKytdO1xuICAgICAgICAgICAgaWYgKGxhc3QgJiYgbG9vc2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgIGZvciAobGV0IGVuZCA9IHBvcyArIChncm91cFRhZyA+PiAxKTsgcG9zIDwgZW5kOyBwb3MrKylcbiAgICAgICAgICAgICAgICBpZiAodGFibGVbcG9zXSA9PSBzdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgIGlmIChsYXN0KVxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLy8gQ2hlY2sgaWYgdGhpcyBzdGF0ZSBoYXMgYW4gYWN0aW9uIGZvciBhIGdpdmVuIHRlcm1pbmFsIEBpbnRlcm5hbFxuICAgIGhhc0FjdGlvbihzdGF0ZSwgdGVybWluYWwpIHtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgICAgIGZvciAobGV0IHNldCA9IDA7IHNldCA8IDI7IHNldCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5zdGF0ZVNsb3Qoc3RhdGUsIHNldCA/IDIgLyogU2tpcCAqLyA6IDEgLyogQWN0aW9ucyAqLyksIG5leHQ7OyBpICs9IDMpIHtcbiAgICAgICAgICAgICAgICBpZiAoKG5leHQgPSBkYXRhW2ldKSA9PSA2NTUzNSAvKiBFbmQgKi8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbaSArIDFdID09IDEgLyogTmV4dCAqLylcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQgPSBkYXRhW2kgPSBwYWlyKGRhdGEsIGkgKyAyKV07XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFbaSArIDFdID09IDIgLyogT3RoZXIgKi8pXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFpcihkYXRhLCBpICsgMik7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dCA9PSB0ZXJtaW5hbCB8fCBuZXh0ID09IDAgLyogRXJyICovKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFpcihkYXRhLCBpICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBzdGF0ZVNsb3Qoc3RhdGUsIHNsb3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGVzWyhzdGF0ZSAqIDYgLyogU2l6ZSAqLykgKyBzbG90XTtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHN0YXRlRmxhZyhzdGF0ZSwgZmxhZykge1xuICAgICAgICByZXR1cm4gKHRoaXMuc3RhdGVTbG90KHN0YXRlLCAwIC8qIEZsYWdzICovKSAmIGZsYWcpID4gMDtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGZpbmROZXN0ZWQoc3RhdGUpIHtcbiAgICAgICAgbGV0IGZsYWdzID0gdGhpcy5zdGF0ZVNsb3Qoc3RhdGUsIDAgLyogRmxhZ3MgKi8pO1xuICAgICAgICByZXR1cm4gZmxhZ3MgJiA0IC8qIFN0YXJ0TmVzdCAqLyA/IHRoaXMubmVzdGVkW2ZsYWdzID4+IDEwIC8qIE5lc3RTaGlmdCAqL10gOiBudWxsO1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgdmFsaWRBY3Rpb24oc3RhdGUsIGFjdGlvbikge1xuICAgICAgICBpZiAoYWN0aW9uID09IHRoaXMuc3RhdGVTbG90KHN0YXRlLCA0IC8qIERlZmF1bHRSZWR1Y2UgKi8pKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnN0YXRlU2xvdChzdGF0ZSwgMSAvKiBBY3Rpb25zICovKTs7IGkgKz0gMykge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVtpXSA9PSA2NTUzNSAvKiBFbmQgKi8pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW2kgKyAxXSA9PSAxIC8qIE5leHQgKi8pXG4gICAgICAgICAgICAgICAgICAgIGkgPSBwYWlyKHRoaXMuZGF0YSwgaSArIDIpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSBwYWlyKHRoaXMuZGF0YSwgaSArIDEpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLyBHZXQgdGhlIHN0YXRlcyB0aGF0IGNhbiBmb2xsb3cgdGhpcyBvbmUgdGhyb3VnaCBzaGlmdCBhY3Rpb25zIG9yXG4gICAgLy8vIGdvdG8ganVtcHMuIEBpbnRlcm5hbFxuICAgIG5leHRTdGF0ZXMoc3RhdGUpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5zdGF0ZVNsb3Qoc3RhdGUsIDEgLyogQWN0aW9ucyAqLyk7OyBpICs9IDMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbaV0gPT0gNjU1MzUgLyogRW5kICovKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVtpICsgMV0gPT0gMSAvKiBOZXh0ICovKVxuICAgICAgICAgICAgICAgICAgICBpID0gcGFpcih0aGlzLmRhdGEsIGkgKyAyKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0aGlzLmRhdGFbaSArIDJdICYgKDY1NTM2IC8qIFJlZHVjZUZsYWcgKi8gPj4gMTYpKSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdGhpcy5kYXRhW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5zb21lKCh2LCBpKSA9PiAoaSAmIDEpICYmIHYgPT0gdmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmRhdGFbaV0sIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgb3ZlcnJpZGVzKHRva2VuLCBwcmV2KSB7XG4gICAgICAgIGxldCBpUHJldiA9IGZpbmRPZmZzZXQodGhpcy5kYXRhLCB0aGlzLnRva2VuUHJlY1RhYmxlLCBwcmV2KTtcbiAgICAgICAgcmV0dXJuIGlQcmV2IDwgMCB8fCBmaW5kT2Zmc2V0KHRoaXMuZGF0YSwgdGhpcy50b2tlblByZWNUYWJsZSwgdG9rZW4pIDwgaVByZXY7XG4gICAgfVxuICAgIC8vLyBDb25maWd1cmUgdGhlIHBhcnNlci4gUmV0dXJucyBhIG5ldyBwYXJzZXIgaW5zdGFuY2UgdGhhdCBoYXMgdGhlXG4gICAgLy8vIGdpdmVuIHNldHRpbmdzIG1vZGlmaWVkLiBTZXR0aW5ncyBub3QgcHJvdmlkZWQgaW4gYGNvbmZpZ2AgYXJlXG4gICAgLy8vIGtlcHQgZnJvbSB0aGUgb3JpZ2luYWwgcGFyc2VyLlxuICAgIGNvbmZpZ3VyZShjb25maWcpIHtcbiAgICAgICAgLy8gSGlkZW91cyByZWZsZWN0aW9uLWJhc2VkIGtsdWRnZSB0byBtYWtlIGl0IGVhc3kgdG8gY3JlYXRlIGFcbiAgICAgICAgLy8gc2xpZ2h0bHkgbW9kaWZpZWQgY29weSBvZiBhIHBhcnNlci5cbiAgICAgICAgbGV0IGNvcHkgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoUGFyc2VyLnByb3RvdHlwZSksIHRoaXMpO1xuICAgICAgICBpZiAoY29uZmlnLnByb3BzKVxuICAgICAgICAgICAgY29weS5ub2RlU2V0ID0gdGhpcy5ub2RlU2V0LmV4dGVuZCguLi5jb25maWcucHJvcHMpO1xuICAgICAgICBpZiAoY29uZmlnLnRvcCkge1xuICAgICAgICAgICAgbGV0IGluZm8gPSB0aGlzLnRvcFJ1bGVzW2NvbmZpZy50b3BdO1xuICAgICAgICAgICAgaWYgKCFpbmZvKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKGBJbnZhbGlkIHRvcCBydWxlIG5hbWUgJHtjb25maWcudG9wfWApO1xuICAgICAgICAgICAgY29weS50b3AgPSBpbmZvO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25maWcudG9rZW5pemVycylcbiAgICAgICAgICAgIGNvcHkudG9rZW5pemVycyA9IHRoaXMudG9rZW5pemVycy5tYXAodCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGZvdW5kID0gY29uZmlnLnRva2VuaXplcnMuZmluZChyID0+IHIuZnJvbSA9PSB0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm91bmQgPyBmb3VuZC50byA6IHQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNvbmZpZy5kaWFsZWN0KVxuICAgICAgICAgICAgY29weS5kaWFsZWN0ID0gdGhpcy5wYXJzZURpYWxlY3QoY29uZmlnLmRpYWxlY3QpO1xuICAgICAgICBpZiAoY29uZmlnLm5lc3RlZClcbiAgICAgICAgICAgIGNvcHkubmVzdGVkID0gdGhpcy5uZXN0ZWQubWFwKG9iaiA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLm5lc3RlZCwgb2JqLm5hbWUpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IG9iai5uYW1lLCB2YWx1ZTogY29uZmlnLm5lc3RlZFtvYmoubmFtZV0sIGVuZDogb2JqLmVuZCwgcGxhY2Vob2xkZXI6IG9iai5wbGFjZWhvbGRlciB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGlmIChjb25maWcuc3RyaWN0ICE9IG51bGwpXG4gICAgICAgICAgICBjb3B5LnN0cmljdCA9IGNvbmZpZy5zdHJpY3Q7XG4gICAgICAgIGlmIChjb25maWcuYnVmZmVyTGVuZ3RoICE9IG51bGwpXG4gICAgICAgICAgICBjb3B5LmJ1ZmZlckxlbmd0aCA9IGNvbmZpZy5idWZmZXJMZW5ndGg7XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbiAgICAvLy8gUmV0dXJucyB0aGUgbmFtZSBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiB0ZXJtLiBUaGlzIHdpbGwgb25seVxuICAgIC8vLyB3b3JrIGZvciBhbGwgdGVybXMgd2hlbiB0aGUgcGFyc2VyIHdhcyBnZW5lcmF0ZWQgd2l0aCB0aGVcbiAgICAvLy8gYC0tbmFtZXNgIG9wdGlvbi4gQnkgZGVmYXVsdCwgb25seSB0aGUgbmFtZXMgb2YgdGFnZ2VkIHRlcm1zIGFyZVxuICAgIC8vLyBzdG9yZWQuXG4gICAgZ2V0TmFtZSh0ZXJtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRlcm1OYW1lcyA/IHRoaXMudGVybU5hbWVzW3Rlcm1dIDogU3RyaW5nKHRlcm0gPD0gdGhpcy5tYXhOb2RlICYmIHRoaXMubm9kZVNldC50eXBlc1t0ZXJtXS5uYW1lIHx8IHRlcm0pO1xuICAgIH1cbiAgICAvLy8gVGhlIGVvZiB0ZXJtIGlkIGlzIGFsd2F5cyBhbGxvY2F0ZWQgZGlyZWN0bHkgYWZ0ZXIgdGhlIG5vZGVcbiAgICAvLy8gdHlwZXMuIEBpbnRlcm5hbFxuICAgIGdldCBlb2ZUZXJtKCkgeyByZXR1cm4gdGhpcy5tYXhOb2RlICsgMTsgfVxuICAgIC8vLyBUZWxscyB5b3Ugd2hldGhlciB0aGlzIGdyYW1tYXIgaGFzIGFueSBuZXN0ZWQgZ3JhbW1hcnMuXG4gICAgZ2V0IGhhc05lc3RlZCgpIHsgcmV0dXJuIHRoaXMubmVzdGVkLmxlbmd0aCA+IDA7IH1cbiAgICAvLy8gVGhlIHR5cGUgb2YgdG9wIG5vZGUgcHJvZHVjZWQgYnkgdGhlIHBhcnNlci5cbiAgICBnZXQgdG9wTm9kZSgpIHsgcmV0dXJuIHRoaXMubm9kZVNldC50eXBlc1t0aGlzLnRvcFsxXV07IH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgZHluYW1pY1ByZWNlZGVuY2UodGVybSkge1xuICAgICAgICBsZXQgcHJlYyA9IHRoaXMuZHluYW1pY1ByZWNlZGVuY2VzO1xuICAgICAgICByZXR1cm4gcHJlYyA9PSBudWxsID8gMCA6IHByZWNbdGVybV0gfHwgMDtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHBhcnNlRGlhbGVjdChkaWFsZWN0KSB7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlZERpYWxlY3QgJiYgdGhpcy5jYWNoZWREaWFsZWN0LnNvdXJjZSA9PSBkaWFsZWN0KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkRGlhbGVjdDtcbiAgICAgICAgbGV0IHZhbHVlcyA9IE9iamVjdC5rZXlzKHRoaXMuZGlhbGVjdHMpLCBmbGFncyA9IHZhbHVlcy5tYXAoKCkgPT4gZmFsc2UpO1xuICAgICAgICBpZiAoZGlhbGVjdClcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnQgb2YgZGlhbGVjdC5zcGxpdChcIiBcIikpIHtcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSB2YWx1ZXMuaW5kZXhPZihwYXJ0KTtcbiAgICAgICAgICAgICAgICBpZiAoaWQgPj0gMClcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3NbaWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgbGV0IGRpc2FibGVkID0gbnVsbDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBpZiAoIWZsYWdzW2ldKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IHRoaXMuZGlhbGVjdHNbdmFsdWVzW2ldXSwgaWQ7IChpZCA9IHRoaXMuZGF0YVtqKytdKSAhPSA2NTUzNSAvKiBFbmQgKi87KVxuICAgICAgICAgICAgICAgICAgICAoZGlzYWJsZWQgfHwgKGRpc2FibGVkID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5tYXhUZXJtICsgMSkpKVtpZF0gPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWREaWFsZWN0ID0gbmV3IERpYWxlY3QoZGlhbGVjdCwgZmxhZ3MsIGRpc2FibGVkKTtcbiAgICB9XG4gICAgLy8vICh1c2VkIGJ5IHRoZSBvdXRwdXQgb2YgdGhlIHBhcnNlciBnZW5lcmF0b3IpIEBpbnRlcm5hbFxuICAgIHN0YXRpYyBkZXNlcmlhbGl6ZShzcGVjKSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2VyKHNwZWMpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHBhaXIoZGF0YSwgb2ZmKSB7IHJldHVybiBkYXRhW29mZl0gfCAoZGF0YVtvZmYgKyAxXSA8PCAxNik7IH1cbmZ1bmN0aW9uIGZpbmRPZmZzZXQoZGF0YSwgc3RhcnQsIHRlcm0pIHtcbiAgICBmb3IgKGxldCBpID0gc3RhcnQsIG5leHQ7IChuZXh0ID0gZGF0YVtpXSkgIT0gNjU1MzUgLyogRW5kICovOyBpKyspXG4gICAgICAgIGlmIChuZXh0ID09IHRlcm0pXG4gICAgICAgICAgICByZXR1cm4gaSAtIHN0YXJ0O1xuICAgIHJldHVybiAtMTtcbn1cbmZ1bmN0aW9uIGZpbmRGaW5pc2hlZChzdGFja3MpIHtcbiAgICBsZXQgYmVzdCA9IG51bGw7XG4gICAgZm9yIChsZXQgc3RhY2sgb2Ygc3RhY2tzKSB7XG4gICAgICAgIGlmIChzdGFjay5wb3MgPT0gc3RhY2sucC5pbnB1dC5sZW5ndGggJiZcbiAgICAgICAgICAgIHN0YWNrLnAucGFyc2VyLnN0YXRlRmxhZyhzdGFjay5zdGF0ZSwgMiAvKiBBY2NlcHRpbmcgKi8pICYmXG4gICAgICAgICAgICAoIWJlc3QgfHwgYmVzdC5zY29yZSA8IHN0YWNrLnNjb3JlKSlcbiAgICAgICAgICAgIGJlc3QgPSBzdGFjaztcbiAgICB9XG4gICAgcmV0dXJuIGJlc3Q7XG59XG5cbmV4cG9ydHMuTm9kZVByb3AgPSBsZXplclRyZWUuTm9kZVByb3A7XG5leHBvcnRzLk5vZGVTZXQgPSBsZXplclRyZWUuTm9kZVNldDtcbmV4cG9ydHMuTm9kZVR5cGUgPSBsZXplclRyZWUuTm9kZVR5cGU7XG5leHBvcnRzLlRyZWUgPSBsZXplclRyZWUuVHJlZTtcbmV4cG9ydHMuVHJlZUN1cnNvciA9IGxlemVyVHJlZS5UcmVlQ3Vyc29yO1xuZXhwb3J0cy5Db250ZXh0VHJhY2tlciA9IENvbnRleHRUcmFja2VyO1xuZXhwb3J0cy5FeHRlcm5hbFRva2VuaXplciA9IEV4dGVybmFsVG9rZW5pemVyO1xuZXhwb3J0cy5QYXJzZXIgPSBQYXJzZXI7XG5leHBvcnRzLlN0YWNrID0gU3RhY2s7XG5leHBvcnRzLlRva2VuID0gVG9rZW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5janMubWFwXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi93ZWJzdGFydC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==