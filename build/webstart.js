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
function variableNames(stmts) {
    var vars = [];
    stmts.forEach(function (stmt) {
        if (stmt.tag === "assign") {
            vars.push(stmt.name);
        }
    });
    return vars;
}
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
function codeGenExpr(expr, locals) {
    var op_exps = new Map();
    op_exps.set("+", "(i32.add)");
    op_exps.set("-", "(i32.sub)");
    op_exps.set("*", "(i32.mul)");
    op_exps.set("%", "(i32.rem_s)");
    op_exps.set("<=", "(i32.le_s)");
    op_exps.set(">=", "(i32.ge_s)");
    op_exps.set("<", "(i32.lt_s)");
    op_exps.set(">", "(i32.gt_s)");
    op_exps.set("not", "(i32.not)");
    op_exps.set("==", "(i32.eq)");
    op_exps.set("!=", "(i32.ne)");
    op_exps.set("is", "(i32.eq)");
    op_exps.set("not", "(i32.xnor)");
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
        case "unary":
            var opstmts = op_exps.get(expr.op);
            var stmts = codeGenExpr(expr.expr, locals);
            if (expr.op == "not") {
                return stmts.concat("(call $not_operator)");
            }
            return ["(i32.const 0)"].concat(stmts, opstmts);
        case "binary":
            var leftstmts = codeGenExpr(expr.left, locals);
            var rightstmts = codeGenExpr(expr.right, locals);
            var opstmts = op_exps.get(expr.op);
            return leftstmts.concat(rightstmts, opstmts);
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
    }
}
exports.codeGenExpr = codeGenExpr;
function codeGenStmt(stmt, locals) {
    switch (stmt.tag) {
        case "if":
            var if_condition = codeGenExpr(stmt.if_condition, locals);
            var ifcondition = if_condition.flat().join("\n");
            var if_body = [];
            stmt.if_body.forEach(function (b, i) {
                var st = codeGenStmt(b, locals);
                if_body = if_body.concat(st);
            });
            var ifbody = if_body.flat().join("\n");
            var elif_present = false;
            var else_present = false;
            if (stmt.elif_condition != undefined) {
                var elif_condition = codeGenExpr(stmt.elif_condition, locals);
                var elifcondition = elif_condition.flat().join("\n");
                var elif_body = [];
                stmt.elif_body.forEach(function (b, i) {
                    elif_body = elif_body.concat(codeGenStmt(b, locals));
                });
                var elifbody = elif_body.flat().join("\n");
                elif_present = true;
            }
            if (stmt.else_body.length > 0) {
                var else_body = [];
                stmt.else_body.forEach(function (b, i) {
                    var st = codeGenStmt(b, locals);
                    else_body = else_body.concat(st);
                });
                var elsebody = else_body.flat().join("\n");
                else_present = true;
            }
            if (elif_present && else_present) {
                return ["".concat(ifcondition, " ( if  \n          (then\n            ").concat(ifbody, "\n          )\n          (else\n            \n            ").concat(elifcondition, " ( if\n              (then\n                ").concat(elifbody, "\n              )\n              (else\n                ").concat(elsebody, " \n              )\n            )\n          )\n        )")];
            }
            else if (else_present) {
                return ["".concat(ifcondition, " ( if  \n          (then\n            ").concat(ifbody, "\n          )\n          (else\n            \n            ").concat(elsebody, " \n          )\n        )")];
            }
            else {
                return ["".concat(ifcondition, " ( if  \n        (then\n          ").concat(ifbody, "\n        ))")];
            }
        case "while":
            var while_condition = codeGenExpr(stmt.condition, locals);
            var whilecondition = while_condition.flat().join("\n");
            var while_body = [];
            stmt.body.forEach(function (b, i) {
                var st = codeGenStmt(b, locals);
                while_body = while_body.concat(st);
            });
            var whilebody = while_body.flat().join("\n");
            return ["\n          (loop\n            \n            ".concat(whilebody, "\n            (br_if 0 ").concat(whilecondition, ")\n            )")];
        case "define":
            var withParamsAndVariables_1 = new Map(locals.entries());
            // Construct the environment for the function body
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
    }
}
exports.codeGenStmt = codeGenStmt;
function compile(source) {
    var ast = (0, parser_1.parseProgram)(source);
    var isBoolOutput = (0, tc_1.tcProgram)(ast);
    var env = new Map();
    console.log(isBoolOutput);
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
            t.firstChild(); // The child is some kind of expression, the
            // ExpressionStatement is just a wrapper with no information
            var expr = traverseExpr(s, t);
            t.parent();
            return { tag: "expr", expr: expr };
        case "IfStatement":
            t.firstChild();
            t.nextSibling();
            var ifcondition = traverseExpr(s, t);
            t.nextSibling();
            t.firstChild();
            var ifbody = [];
            while (t.nextSibling()) {
                ifbody.push(traverseStmt(s, t));
            }
            t.parent();
            t.nextSibling();
            var elifbody = [];
            var elifcondition;
            if (s.substring(t.from, t.to) == "elif") {
                t.nextSibling();
                elifcondition = traverseExpr(s, t);
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
            return {
                tag: "if", if_condition: ifcondition, elif_condition: elifcondition, if_body: ifbody,
                else_body: elsebody, elif_body: elifbody
            };
        case "WhileStatement":
            t.firstChild();
            t.nextSibling();
            var while_conditin = traverseExpr(s, t);
            t.nextSibling();
            t.firstChild();
            var while_body = [];
            while (t.nextSibling()) {
                while_body.push(traverseStmt(s, t));
            }
            t.parent();
            t.parent();
            return { tag: "while", condition: while_conditin, body: while_body };
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
    console.log(s.substring(t.from, t.to));
    switch (t.type.name) {
        case "VariableName":
            var name_1 = s.substring(t.from, t.to);
            if (!(name_1 == "int" || name_1 == "bool")) {
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
        var nextTagName = t.type.name; // NOTE(joe): a bit of a hack so the next line doesn't if-split
        if (nextTagName !== "TypeDef") {
            throw new Error("ParseError: Parameter type not mentioned " + name_2);
        }
        ;
        t.firstChild(); // Enter TypeDef
        t.nextSibling(); // Focuses on type itself
        var typ = traverseType(s, t);
        t.parent();
        t.nextSibling(); // Move on to comma or ")"
        parameters.push({ name: name_2, typ: typ });
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
            var operator = s.substring(t.from, t.to);
            var allowed_binary_operators = ["+", "-", "*", "//", "%", "==", "!=", "<=", ">=", "<", ">", "is"];
            if (!allowed_binary_operators.includes(operator)) {
                throw new Error("ParseError: Invalid binary operation (+,-,*,//,%,==,!=,<=,>=,<,> is)");
            }
            t.nextSibling();
            var right = traverseExpr(s, t);
            t.parent();
            return {
                tag: "binary",
                left: left,
                op: operator,
                right: right
            };
        case "UnaryExpression":
            t.firstChild();
            var unaryop = s.substring(t.from, t.to);
            t.nextSibling();
            var val = traverseExpr(s, t);
            var allowed_unary_operators = ["-", "+", "not"];
            if (!allowed_unary_operators.includes(unaryop)) {
                throw new Error("ParseError: Invalid unary operation (not, +, -)");
            }
            t.parent();
            return {
                tag: "unary", expr: val, op: unaryop
            };
        case "ParenthesizedExpression":
            t.firstChild();
            t.nextSibling();
            var expr = traverseExpr(s, t);
            t.parent();
            return expr;
        case "CallExpression":
            t.firstChild(); // Focus name
            var name = s.substring(t.from, t.to);
            t.nextSibling(); // Focus ArgList
            t.firstChild(); // Focus open paren
            var args = traverseArguments(t, s);
            var result = { tag: "call", name: name, args: args };
            t.parent();
            t.parent();
            return result;
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
var op_checks = new Map();
op_checks.set("+", "int");
op_checks.set("-", "int");
op_checks.set("*", "int");
op_checks.set("%", "int");
op_checks.set("<=", "int");
op_checks.set(">=", "int");
op_checks.set("<", "int");
op_checks.set(">", "int");
op_checks.set("not", "bool");
op_checks.set("==", "int");
op_checks.set("!=", "int");
op_checks.set("is", "none");
op_checks.set("not", "bool");
var op_ret = new Map();
op_ret.set("+", "int");
op_ret.set("-", "int");
op_ret.set("*", "int");
op_ret.set("%", "int");
op_ret.set("<=", "bool");
op_ret.set(">=", "bool");
op_ret.set("<", "bool");
op_ret.set(">", "bool");
op_ret.set("not", "bool");
op_ret.set("==", "bool");
op_ret.set("!=", "bool");
op_ret.set("is", "bool");
op_ret.set("not", "bool");
function tcExpr(e, functions, variables) {
    switch (e.tag) {
        case "literal": return e.value.typ;
        case "name":
            if (!variables.has(e.name)) {
                throw new Error("TypeError: Variable " + e.name + " not defined.");
            }
            return variables.get(e.name);
        case "binary":
            var operator = e.op;
            var left = tcExpr(e.left, functions, variables);
            var right = tcExpr(e.right, functions, variables);
            if (op_checks.get(operator) != left || op_checks.get(operator) != right) {
                throw new Error("TypeError: Incompatible operands in binary expression.");
            }
            return op_ret.get(operator);
        case "unary":
            var operator = e.op;
            var operand = tcExpr(e.expr, functions, variables);
            if (op_checks.get(operator) != operand) {
                throw new Error("TypeError: Incompatible operand in unary expression.");
            }
            return op_ret.get(operator);
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
    }
}
exports.tcExpr = tcExpr;
function tcStmt(s, functions, variables, currentReturn) {
    switch (s.tag) {
        case "while":
            if (tcExpr(s.condition, functions, variables) != "bool") {
                throw new Error("TypeError: Condition in while statement must be boolean");
            }
            return false;
        case "if":
            if (tcExpr(s.if_condition, functions, variables) != "bool") {
                throw new Error("TypeError: Condition in if statement must be boolean");
            }
            if (s.elif_condition != undefined && tcExpr(s.elif_condition, functions, variables) != "bool") {
                throw new Error("TypeError: Condition in elif statement must be boolean");
            }
            return false;
        case "assign": {
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
        }
        case "define": {
            var bodyvars_1 = new Map(variables.entries());
            s.parameters.forEach(function (p) { bodyvars_1.set(p.name, p.typ); });
            s.body.forEach(function (bs) { return tcStmt(bs, functions, bodyvars_1, s.ret); });
            return false;
        }
        case "expr": {
            var type = tcExpr(s.expr, functions, variables);
            console.log(type);
            if (type == "bool") {
                return true;
            }
            return false;
        }
        case "return": {
            var valTyp = tcExpr(s.value, functions, variables);
            if (valTyp !== currentReturn) {
                throw new Error("TypeError: ".concat(valTyp, " returned, ").concat(currentReturn, " expected."));
            }
            return false;
        }
    }
}
exports.tcStmt = tcStmt;
function tcProgram(p) {
    var functions = new Map();
    functions.set("print", [["int", "bool"], "none"]);
    p.forEach(function (s) {
        if (s.tag === "define") {
            functions.set(s.name, [s.parameters.map(function (p) { return p.typ; }), s.ret]);
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
        // const elt = document.createElement("pre");
        // document.getElementById("output").appendChild(elt);
        // elt.innerText = arg + "\n";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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R0FBRyxXQUFXLGFBQWEsYUFBYSxhQUFhLFlBQVksa0NBQWtDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsWUFBWSxzQ0FBc0MsUUFBUSxTQUFTLGFBQWEsYUFBYSxZQUFZLEVBQUUsbUNBQW1DLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxhQUFhLFlBQVkscUNBQXFDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsSUFBSSxLQUFLLElBQUksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLFlBQVksa0NBQWtDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsWUFBWSxrQ0FBa0MsUUFBUSxTQUFTLG9CQUFvQixhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsb0JBQW9CLGFBQWEsYUFBYSxhQUFhLFlBQVksa0NBQWtDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxhQUFhLFlBQVksc0NBQXNDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxhQUFhLFlBQVksa0NBQWtDLFFBQVEsU0FBUyxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxZQUFZLHNDQUFzQyxRQUFRLFNBQVMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsWUFBWSxxQ0FBcUMsUUFBUSxTQUFTLGFBQWEsYUFBYSxhQUFhLFlBQVkscUNBQXFDLFFBQVEsU0FBUyxhQUFhLGFBQWEsWUFBWSxFQUFFLG9DQUFvQyxRQUFRLFNBQVMsYUFBYSxhQUFhLFlBQVksRUFBRSxHQUFHLCtCQUErQixRQUFRLFNBQVMsMkJBQTJCLGFBQWEsYUFBYSxZQUFZLHFDQUFxQyxRQUFRLFNBQVMsYUFBYSxh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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsMkNBQTJDO0FBQ3pELG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsU0FBUyxhQUFhLGFBQWE7QUFDakQ7QUFDQTtBQUNBLHdCQUF3Qix1QkFBdUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0IsNEJBQTRCLCtCQUErQjtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLFdBQVc7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLG1CQUFtQjtBQUMzQztBQUNBLDJEQUEyRCx5Q0FBeUM7QUFDcEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0EsOEJBQThCLHFDQUFxQztBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQjtBQUNoQixlQUFlO0FBQ2YsZ0JBQWdCO0FBQ2hCLFlBQVk7QUFDWixrQkFBa0I7QUFDbEIsc0JBQXNCO0FBQ3RCLHlCQUF5QjtBQUN6QixjQUFjO0FBQ2QsYUFBYTtBQUNiLGFBQWE7QUFDYjs7Ozs7OztVQ3YrQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYi1hc20taml0Ly4vY29tcGlsZXIudHMiLCJ3ZWJwYWNrOi8vd2ViLWFzbS1qaXQvLi9wYXJzZXIudHMiLCJ3ZWJwYWNrOi8vd2ViLWFzbS1qaXQvLi90Yy50cyIsIndlYnBhY2s6Ly93ZWItYXNtLWppdC8uL3dlYnN0YXJ0LnRzIiwid2VicGFjazovL3dlYi1hc20taml0L2V4dGVybmFsIHZhciBcIndhYnRcIiIsIndlYnBhY2s6Ly93ZWItYXNtLWppdC8uL25vZGVfbW9kdWxlcy9sZXplci1weXRob24vZGlzdC9pbmRleC5janMiLCJ3ZWJwYWNrOi8vd2ViLWFzbS1qaXQvLi9ub2RlX21vZHVsZXMvbGV6ZXItdHJlZS9kaXN0L3RyZWUuY2pzIiwid2VicGFjazovL3dlYi1hc20taml0Ly4vbm9kZV9tb2R1bGVzL2xlemVyL2Rpc3QvaW5kZXguY2pzIiwid2VicGFjazovL3dlYi1hc20taml0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYi1hc20taml0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vd2ViLWFzbS1qaXQvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3dlYi1hc20taml0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNvbXBpbGUgPSBleHBvcnRzLmNvZGVHZW5TdG10ID0gZXhwb3J0cy5jb2RlR2VuRXhwciA9IGV4cG9ydHMucnVuID0gdm9pZCAwO1xudmFyIHdhYnRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwid2FidFwiKSk7XG52YXIgcGFyc2VyXzEgPSByZXF1aXJlKFwiLi9wYXJzZXJcIik7XG52YXIgdGNfMSA9IHJlcXVpcmUoXCIuL3RjXCIpO1xuZnVuY3Rpb24gdmFyaWFibGVOYW1lcyhzdG10cykge1xuICAgIHZhciB2YXJzID0gW107XG4gICAgc3RtdHMuZm9yRWFjaChmdW5jdGlvbiAoc3RtdCkge1xuICAgICAgICBpZiAoc3RtdC50YWcgPT09IFwiYXNzaWduXCIpIHtcbiAgICAgICAgICAgIHZhcnMucHVzaChzdG10Lm5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhcnM7XG59XG5mdW5jdGlvbiBydW4od2F0U291cmNlLCBpbXBvcnRfb2JqZWN0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd2FidEFwaSwgcGFyc2VkLCBiaW5hcnksIHdhc21Nb2R1bGU7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IHJldHVybiBbNCAvKnlpZWxkKi8sICgwLCB3YWJ0XzEuZGVmYXVsdCkoKV07XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICB3YWJ0QXBpID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBwYXJzZWQgPSB3YWJ0QXBpLnBhcnNlV2F0KFwiZXhhbXBsZVwiLCB3YXRTb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICBiaW5hcnkgPSBwYXJzZWQudG9CaW5hcnkoe30pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShiaW5hcnkuYnVmZmVyLCBpbXBvcnRfb2JqZWN0KV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICB3YXNtTW9kdWxlID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG5leHQgbGluZSBpcyB3YXNtLWludGVycFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgd2FzbU1vZHVsZS5pbnN0YW5jZS5leHBvcnRzLl9zdGFydCgpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5leHBvcnRzLnJ1biA9IHJ1bjtcbndpbmRvd1tcInJ1bldhdFwiXSA9IHJ1bjtcbmZ1bmN0aW9uIGNvZGVHZW5FeHByKGV4cHIsIGxvY2Fscykge1xuICAgIHZhciBvcF9leHBzID0gbmV3IE1hcCgpO1xuICAgIG9wX2V4cHMuc2V0KFwiK1wiLCBcIihpMzIuYWRkKVwiKTtcbiAgICBvcF9leHBzLnNldChcIi1cIiwgXCIoaTMyLnN1YilcIik7XG4gICAgb3BfZXhwcy5zZXQoXCIqXCIsIFwiKGkzMi5tdWwpXCIpO1xuICAgIG9wX2V4cHMuc2V0KFwiJVwiLCBcIihpMzIucmVtX3MpXCIpO1xuICAgIG9wX2V4cHMuc2V0KFwiPD1cIiwgXCIoaTMyLmxlX3MpXCIpO1xuICAgIG9wX2V4cHMuc2V0KFwiPj1cIiwgXCIoaTMyLmdlX3MpXCIpO1xuICAgIG9wX2V4cHMuc2V0KFwiPFwiLCBcIihpMzIubHRfcylcIik7XG4gICAgb3BfZXhwcy5zZXQoXCI+XCIsIFwiKGkzMi5ndF9zKVwiKTtcbiAgICBvcF9leHBzLnNldChcIm5vdFwiLCBcIihpMzIubm90KVwiKTtcbiAgICBvcF9leHBzLnNldChcIj09XCIsIFwiKGkzMi5lcSlcIik7XG4gICAgb3BfZXhwcy5zZXQoXCIhPVwiLCBcIihpMzIubmUpXCIpO1xuICAgIG9wX2V4cHMuc2V0KFwiaXNcIiwgXCIoaTMyLmVxKVwiKTtcbiAgICBvcF9leHBzLnNldChcIm5vdFwiLCBcIihpMzIueG5vcilcIik7XG4gICAgc3dpdGNoIChleHByLnRhZykge1xuICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgaWYgKGxvY2Fscy5oYXMoZXhwci5uYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXCIobG9jYWwuZ2V0ICRcIi5jb25jYXQoZXhwci5uYW1lLCBcIilcIildO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcIihnbG9iYWwuZ2V0ICRcIi5jb25jYXQoZXhwci5uYW1lLCBcIilcIildO1xuICAgICAgICAgICAgfVxuICAgICAgICBjYXNlIFwibGl0ZXJhbFwiOlxuICAgICAgICAgICAgaWYgKGV4cHIudmFsdWUudHlwID09IFwiaW50XCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1wiKGkzMi5jb25zdCBcIi5jb25jYXQoZXhwci52YWx1ZS52YWx1ZSwgXCIpXCIpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGV4cHIudmFsdWUudHlwID09IFwiYm9vbFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4cHIudmFsdWUudmFsdWUgPT0gXCJUcnVlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcIihpMzIuY29uc3QgMSlcIl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1wiKGkzMi5jb25zdCAwKVwiXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1wiKGkzMi5jb25zdCAwKVwiXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgY2FzZSBcInVuYXJ5XCI6XG4gICAgICAgICAgICB2YXIgb3BzdG10cyA9IG9wX2V4cHMuZ2V0KGV4cHIub3ApO1xuICAgICAgICAgICAgdmFyIHN0bXRzID0gY29kZUdlbkV4cHIoZXhwci5leHByLCBsb2NhbHMpO1xuICAgICAgICAgICAgaWYgKGV4cHIub3AgPT0gXCJub3RcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdG10cy5jb25jYXQoXCIoY2FsbCAkbm90X29wZXJhdG9yKVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXCIoaTMyLmNvbnN0IDApXCJdLmNvbmNhdChzdG10cywgb3BzdG10cyk7XG4gICAgICAgIGNhc2UgXCJiaW5hcnlcIjpcbiAgICAgICAgICAgIHZhciBsZWZ0c3RtdHMgPSBjb2RlR2VuRXhwcihleHByLmxlZnQsIGxvY2Fscyk7XG4gICAgICAgICAgICB2YXIgcmlnaHRzdG10cyA9IGNvZGVHZW5FeHByKGV4cHIucmlnaHQsIGxvY2Fscyk7XG4gICAgICAgICAgICB2YXIgb3BzdG10cyA9IG9wX2V4cHMuZ2V0KGV4cHIub3ApO1xuICAgICAgICAgICAgcmV0dXJuIGxlZnRzdG10cy5jb25jYXQocmlnaHRzdG10cywgb3BzdG10cyk7XG4gICAgICAgIGNhc2UgXCJjYWxsXCI6XG4gICAgICAgICAgICB2YXIgdmFsU3RtdHMgPSBleHByLmFyZ3MubWFwKGZ1bmN0aW9uIChlKSB7IHJldHVybiBjb2RlR2VuRXhwcihlLCBsb2NhbHMpOyB9KS5mbGF0KCk7XG4gICAgICAgICAgICB2YXIgdG9DYWxsID0gZXhwci5uYW1lO1xuICAgICAgICAgICAgaWYgKGV4cHIubmFtZSA9PT0gXCJwcmludFwiKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChleHByLmFyZ3NbMF0uYSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYm9vbFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdG9DYWxsID0gXCJwcmludF9ib29sXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImludFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdG9DYWxsID0gXCJwcmludF9udW1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibm9uZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdG9DYWxsID0gXCJwcmludF9ub25lXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWxTdG10cy5wdXNoKFwiKGNhbGwgJFwiLmNvbmNhdCh0b0NhbGwsIFwiKVwiKSk7XG4gICAgICAgICAgICByZXR1cm4gdmFsU3RtdHM7XG4gICAgfVxufVxuZXhwb3J0cy5jb2RlR2VuRXhwciA9IGNvZGVHZW5FeHByO1xuZnVuY3Rpb24gY29kZUdlblN0bXQoc3RtdCwgbG9jYWxzKSB7XG4gICAgc3dpdGNoIChzdG10LnRhZykge1xuICAgICAgICBjYXNlIFwiaWZcIjpcbiAgICAgICAgICAgIHZhciBpZl9jb25kaXRpb24gPSBjb2RlR2VuRXhwcihzdG10LmlmX2NvbmRpdGlvbiwgbG9jYWxzKTtcbiAgICAgICAgICAgIHZhciBpZmNvbmRpdGlvbiA9IGlmX2NvbmRpdGlvbi5mbGF0KCkuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgIHZhciBpZl9ib2R5ID0gW107XG4gICAgICAgICAgICBzdG10LmlmX2JvZHkuZm9yRWFjaChmdW5jdGlvbiAoYiwgaSkge1xuICAgICAgICAgICAgICAgIHZhciBzdCA9IGNvZGVHZW5TdG10KGIsIGxvY2Fscyk7XG4gICAgICAgICAgICAgICAgaWZfYm9keSA9IGlmX2JvZHkuY29uY2F0KHN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGlmYm9keSA9IGlmX2JvZHkuZmxhdCgpLmpvaW4oXCJcXG5cIik7XG4gICAgICAgICAgICB2YXIgZWxpZl9wcmVzZW50ID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgZWxzZV9wcmVzZW50ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoc3RtdC5lbGlmX2NvbmRpdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWxpZl9jb25kaXRpb24gPSBjb2RlR2VuRXhwcihzdG10LmVsaWZfY29uZGl0aW9uLCBsb2NhbHMpO1xuICAgICAgICAgICAgICAgIHZhciBlbGlmY29uZGl0aW9uID0gZWxpZl9jb25kaXRpb24uZmxhdCgpLmpvaW4oXCJcXG5cIik7XG4gICAgICAgICAgICAgICAgdmFyIGVsaWZfYm9keSA9IFtdO1xuICAgICAgICAgICAgICAgIHN0bXQuZWxpZl9ib2R5LmZvckVhY2goZnVuY3Rpb24gKGIsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxpZl9ib2R5ID0gZWxpZl9ib2R5LmNvbmNhdChjb2RlR2VuU3RtdChiLCBsb2NhbHMpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgZWxpZmJvZHkgPSBlbGlmX2JvZHkuZmxhdCgpLmpvaW4oXCJcXG5cIik7XG4gICAgICAgICAgICAgICAgZWxpZl9wcmVzZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdG10LmVsc2VfYm9keS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVsc2VfYm9keSA9IFtdO1xuICAgICAgICAgICAgICAgIHN0bXQuZWxzZV9ib2R5LmZvckVhY2goZnVuY3Rpb24gKGIsIGkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ID0gY29kZUdlblN0bXQoYiwgbG9jYWxzKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZV9ib2R5ID0gZWxzZV9ib2R5LmNvbmNhdChzdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdmFyIGVsc2Vib2R5ID0gZWxzZV9ib2R5LmZsYXQoKS5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIGVsc2VfcHJlc2VudCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZWxpZl9wcmVzZW50ICYmIGVsc2VfcHJlc2VudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXCJcIi5jb25jYXQoaWZjb25kaXRpb24sIFwiICggaWYgIFxcbiAgICAgICAgICAodGhlblxcbiAgICAgICAgICAgIFwiKS5jb25jYXQoaWZib2R5LCBcIlxcbiAgICAgICAgICApXFxuICAgICAgICAgIChlbHNlXFxuICAgICAgICAgICAgXFxuICAgICAgICAgICAgXCIpLmNvbmNhdChlbGlmY29uZGl0aW9uLCBcIiAoIGlmXFxuICAgICAgICAgICAgICAodGhlblxcbiAgICAgICAgICAgICAgICBcIikuY29uY2F0KGVsaWZib2R5LCBcIlxcbiAgICAgICAgICAgICAgKVxcbiAgICAgICAgICAgICAgKGVsc2VcXG4gICAgICAgICAgICAgICAgXCIpLmNvbmNhdChlbHNlYm9keSwgXCIgXFxuICAgICAgICAgICAgICApXFxuICAgICAgICAgICAgKVxcbiAgICAgICAgICApXFxuICAgICAgICApXCIpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGVsc2VfcHJlc2VudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXCJcIi5jb25jYXQoaWZjb25kaXRpb24sIFwiICggaWYgIFxcbiAgICAgICAgICAodGhlblxcbiAgICAgICAgICAgIFwiKS5jb25jYXQoaWZib2R5LCBcIlxcbiAgICAgICAgICApXFxuICAgICAgICAgIChlbHNlXFxuICAgICAgICAgICAgXFxuICAgICAgICAgICAgXCIpLmNvbmNhdChlbHNlYm9keSwgXCIgXFxuICAgICAgICAgIClcXG4gICAgICAgIClcIildO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtcIlwiLmNvbmNhdChpZmNvbmRpdGlvbiwgXCIgKCBpZiAgXFxuICAgICAgICAodGhlblxcbiAgICAgICAgICBcIikuY29uY2F0KGlmYm9keSwgXCJcXG4gICAgICAgICkpXCIpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgY2FzZSBcIndoaWxlXCI6XG4gICAgICAgICAgICB2YXIgd2hpbGVfY29uZGl0aW9uID0gY29kZUdlbkV4cHIoc3RtdC5jb25kaXRpb24sIGxvY2Fscyk7XG4gICAgICAgICAgICB2YXIgd2hpbGVjb25kaXRpb24gPSB3aGlsZV9jb25kaXRpb24uZmxhdCgpLmpvaW4oXCJcXG5cIik7XG4gICAgICAgICAgICB2YXIgd2hpbGVfYm9keSA9IFtdO1xuICAgICAgICAgICAgc3RtdC5ib2R5LmZvckVhY2goZnVuY3Rpb24gKGIsIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3QgPSBjb2RlR2VuU3RtdChiLCBsb2NhbHMpO1xuICAgICAgICAgICAgICAgIHdoaWxlX2JvZHkgPSB3aGlsZV9ib2R5LmNvbmNhdChzdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciB3aGlsZWJvZHkgPSB3aGlsZV9ib2R5LmZsYXQoKS5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIFtcIlxcbiAgICAgICAgICAobG9vcFxcbiAgICAgICAgICAgIFxcbiAgICAgICAgICAgIFwiLmNvbmNhdCh3aGlsZWJvZHksIFwiXFxuICAgICAgICAgICAgKGJyX2lmIDAgXCIpLmNvbmNhdCh3aGlsZWNvbmRpdGlvbiwgXCIpXFxuICAgICAgICAgICAgKVwiKV07XG4gICAgICAgIGNhc2UgXCJkZWZpbmVcIjpcbiAgICAgICAgICAgIHZhciB3aXRoUGFyYW1zQW5kVmFyaWFibGVzXzEgPSBuZXcgTWFwKGxvY2Fscy5lbnRyaWVzKCkpO1xuICAgICAgICAgICAgLy8gQ29uc3RydWN0IHRoZSBlbnZpcm9ubWVudCBmb3IgdGhlIGZ1bmN0aW9uIGJvZHlcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZXMgPSB2YXJpYWJsZU5hbWVzKHN0bXQuYm9keSk7XG4gICAgICAgICAgICB2YXJpYWJsZXMuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gd2l0aFBhcmFtc0FuZFZhcmlhYmxlc18xLnNldCh2LCB0cnVlKTsgfSk7XG4gICAgICAgICAgICBzdG10LnBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAocCkgeyByZXR1cm4gd2l0aFBhcmFtc0FuZFZhcmlhYmxlc18xLnNldChwLm5hbWUsIHRydWUpOyB9KTtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBzdG10LnBhcmFtZXRlcnMubWFwKGZ1bmN0aW9uIChwKSB7IHJldHVybiBcIihwYXJhbSAkXCIuY29uY2F0KHAubmFtZSwgXCIgaTMyKVwiKTsgfSkuam9pbihcIiBcIik7XG4gICAgICAgICAgICB2YXIgbG9jYWxEZWNscyA9IHZhcmlhYmxlcy5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIFwiKGxvY2FsICRcIi5jb25jYXQodiwgXCIgaTMyKVwiKTsgfSkuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgIHZhciBzdG10cyA9IHN0bXQuYm9keS5tYXAoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIGNvZGVHZW5TdG10KHMsIHdpdGhQYXJhbXNBbmRWYXJpYWJsZXNfMSk7IH0pLmZsYXQoKTtcbiAgICAgICAgICAgIHZhciBzdG10c0JvZHkgPSBzdG10cy5qb2luKFwiXFxuXCIpO1xuICAgICAgICAgICAgcmV0dXJuIFtcIihmdW5jICRcIi5jb25jYXQoc3RtdC5uYW1lLCBcIiBcIikuY29uY2F0KHBhcmFtcywgXCIgKHJlc3VsdCBpMzIpXFxuICAgICAgKGxvY2FsICRzY3JhdGNoIGkzMilcXG4gICAgICBcIikuY29uY2F0KGxvY2FsRGVjbHMsIFwiXFxuICAgICAgXCIpLmNvbmNhdChzdG10c0JvZHksIFwiXFxuICAgICAgKGkzMi5jb25zdCAwKSlcIildO1xuICAgICAgICBjYXNlIFwicmV0dXJuXCI6XG4gICAgICAgICAgICB2YXIgdmFsU3RtdHMgPSBjb2RlR2VuRXhwcihzdG10LnZhbHVlLCBsb2NhbHMpO1xuICAgICAgICAgICAgdmFsU3RtdHMucHVzaChcInJldHVyblwiKTtcbiAgICAgICAgICAgIHJldHVybiB2YWxTdG10cztcbiAgICAgICAgY2FzZSBcImFzc2lnblwiOlxuICAgICAgICAgICAgdmFyIHZhbFN0bXRzID0gY29kZUdlbkV4cHIoc3RtdC52YWx1ZSwgbG9jYWxzKTtcbiAgICAgICAgICAgIGlmIChsb2NhbHMuaGFzKHN0bXQubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YWxTdG10cy5wdXNoKFwiKGxvY2FsLnNldCAkXCIuY29uY2F0KHN0bXQubmFtZSwgXCIpXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbFN0bXRzLnB1c2goXCIoZ2xvYmFsLnNldCAkXCIuY29uY2F0KHN0bXQubmFtZSwgXCIpXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXS5jb25jYXQodmFsU3RtdHMpO1xuICAgICAgICBjYXNlIFwiZXhwclwiOlxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNvZGVHZW5FeHByKHN0bXQuZXhwciwgbG9jYWxzKTtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKFwiKGxvY2FsLnNldCAkc2NyYXRjaClcIik7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMuY29kZUdlblN0bXQgPSBjb2RlR2VuU3RtdDtcbmZ1bmN0aW9uIGNvbXBpbGUoc291cmNlKSB7XG4gICAgdmFyIGFzdCA9ICgwLCBwYXJzZXJfMS5wYXJzZVByb2dyYW0pKHNvdXJjZSk7XG4gICAgdmFyIGlzQm9vbE91dHB1dCA9ICgwLCB0Y18xLnRjUHJvZ3JhbSkoYXN0KTtcbiAgICB2YXIgZW52ID0gbmV3IE1hcCgpO1xuICAgIGNvbnNvbGUubG9nKGlzQm9vbE91dHB1dCk7XG4gICAgdmFyIHZhcnMgPSBbXTtcbiAgICBhc3QuZm9yRWFjaChmdW5jdGlvbiAoc3RtdCkge1xuICAgICAgICBpZiAoc3RtdC50YWcgPT09IFwiYXNzaWduXCIpIHtcbiAgICAgICAgICAgIHZhcnMucHVzaChzdG10Lm5hbWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZ1bmNzID0gW107XG4gICAgYXN0LmZvckVhY2goZnVuY3Rpb24gKHN0bXQpIHtcbiAgICAgICAgaWYgKHN0bXQudGFnID09PSBcImRlZmluZVwiKSB7XG4gICAgICAgICAgICBmdW5jcy5wdXNoKGNvZGVHZW5TdG10KHN0bXQsIGVudikuam9pbihcIlxcblwiKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgYWxsRnVucyA9IGZ1bmNzLmpvaW4oXCJcXG5cXG5cIik7XG4gICAgdmFyIHN0bXRzID0gYXN0LmZpbHRlcihmdW5jdGlvbiAoc3RtdCkgeyByZXR1cm4gc3RtdC50YWcgIT09IFwiZGVmaW5lXCI7IH0pO1xuICAgIHZhciB1bmlxVmFycyA9IHZhcnMuZmlsdGVyKGZ1bmN0aW9uIChlLCBpKSB7IHJldHVybiB2YXJzLmluZGV4T2YoZSkgPT0gaTsgfSk7XG4gICAgdmFyIGdsb2JEZWNscyA9IHVuaXFWYXJzLm1hcChmdW5jdGlvbiAodikgeyByZXR1cm4gXCIoZ2xvYmFsICRcIi5jb25jYXQodiwgXCIgKG11dCBpMzIpIChpMzIuY29uc3QgMCkpXCIpOyB9KS5qb2luKFwiXFxuXCIpO1xuICAgIHZhciBhbGxTdG10cyA9IHN0bXRzLm1hcChmdW5jdGlvbiAocykgeyByZXR1cm4gY29kZUdlblN0bXQocywgZW52KTsgfSkuZmxhdCgpO1xuICAgIHZhciBtYWluID0gX19zcHJlYWRBcnJheShbXCIobG9jYWwgJHNjcmF0Y2ggaTMyKVwiXSwgYWxsU3RtdHMsIHRydWUpLmpvaW4oXCJcXG5cIik7XG4gICAgdmFyIGxhc3RTdG10ID0gYXN0W2FzdC5sZW5ndGggLSAxXTtcbiAgICB2YXIgaXNFeHByID0gbGFzdFN0bXQudGFnID09PSBcImV4cHJcIjtcbiAgICB2YXIgcmV0VHlwZSA9IFwiXCI7XG4gICAgdmFyIHJldFZhbCA9IFwiXCI7XG4gICAgaWYgKGlzRXhwcikge1xuICAgICAgICByZXRUeXBlID0gXCIocmVzdWx0IGkzMilcIjtcbiAgICAgICAgcmV0VmFsID0gXCIobG9jYWwuZ2V0ICRzY3JhdGNoKVwiO1xuICAgIH1cbiAgICByZXR1cm4gXCJcXG4gICAgKG1vZHVsZVxcbiAgICAgIChmdW5jICRwcmludF9udW0gKGltcG9ydCBcXFwiaW1wb3J0c1xcXCIgXFxcInByaW50X251bVxcXCIpIChwYXJhbSBpMzIpIChyZXN1bHQgaTMyKSlcXG4gICAgICAoZnVuYyAkcHJpbnRfYm9vbCAoaW1wb3J0IFxcXCJpbXBvcnRzXFxcIiBcXFwicHJpbnRfYm9vbFxcXCIpIChwYXJhbSBpMzIpIChyZXN1bHQgaTMyKSlcXG4gICAgICAoZnVuYyAkcHJpbnRfbm9uZSAoaW1wb3J0IFxcXCJpbXBvcnRzXFxcIiBcXFwicHJpbnRfbm9uZVxcXCIpIChwYXJhbSBpMzIpIChyZXN1bHQgaTMyKSlcXG4gICAgICAoZnVuYyAkbm90X29wZXJhdG9yIChpbXBvcnQgXFxcImltcG9ydHNcXFwiIFxcXCJub3Rfb3BlcmF0b3JcXFwiKSAocGFyYW0gaTMyKSAocmVzdWx0IGkzMikpXFxuICAgICAgXCIuY29uY2F0KGdsb2JEZWNscywgXCJcXG4gICAgICBcIikuY29uY2F0KGFsbEZ1bnMsIFwiXFxuICAgICAgKGZ1bmMgKGV4cG9ydCBcXFwiX3N0YXJ0XFxcIikgXCIpLmNvbmNhdChyZXRUeXBlLCBcIlxcbiAgICAgICAgXCIpLmNvbmNhdChtYWluLCBcIlxcbiAgICAgICAgXCIpLmNvbmNhdChyZXRWYWwsIFwiXFxuICAgICAgKVxcbiAgICApIFxcbiAgXCIpO1xufVxuZXhwb3J0cy5jb21waWxlID0gY29tcGlsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50cmF2ZXJzZUFyZ3VtZW50cyA9IGV4cG9ydHMudHJhdmVyc2VFeHByID0gZXhwb3J0cy50cmF2ZXJzZVBhcmFtZXRlcnMgPSBleHBvcnRzLnRyYXZlcnNlVHlwZSA9IGV4cG9ydHMudHJhdmVyc2VTdG10ID0gZXhwb3J0cy50cmF2ZXJzZVN0bXRzID0gZXhwb3J0cy5wYXJzZVByb2dyYW0gPSB2b2lkIDA7XG52YXIgbGV6ZXJfcHl0aG9uXzEgPSByZXF1aXJlKFwibGV6ZXItcHl0aG9uXCIpO1xuZnVuY3Rpb24gcGFyc2VQcm9ncmFtKHNvdXJjZSkge1xuICAgIHZhciB0ID0gbGV6ZXJfcHl0aG9uXzEucGFyc2VyLnBhcnNlKHNvdXJjZSkuY3Vyc29yKCk7XG4gICAgcmV0dXJuIHRyYXZlcnNlU3RtdHMoc291cmNlLCB0KTtcbn1cbmV4cG9ydHMucGFyc2VQcm9ncmFtID0gcGFyc2VQcm9ncmFtO1xuZnVuY3Rpb24gdHJhdmVyc2VTdG10cyhzLCB0KSB7XG4gICAgLy8gVGhlIHRvcCBub2RlIGluIHRoZSBwcm9ncmFtIGlzIGEgU2NyaXB0IG5vZGUgd2l0aCBhIGxpc3Qgb2YgY2hpbGRyZW5cbiAgICAvLyB0aGF0IGFyZSB2YXJpb3VzIHN0YXRlbWVudHNcbiAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICB2YXIgc3RtdHMgPSBbXTtcbiAgICBkbyB7XG4gICAgICAgIHN0bXRzLnB1c2godHJhdmVyc2VTdG10KHMsIHQpKTtcbiAgICB9IHdoaWxlICh0Lm5leHRTaWJsaW5nKCkpOyAvLyB0Lm5leHRTaWJsaW5nKCkgcmV0dXJucyBmYWxzZSB3aGVuIGl0IHJlYWNoZXNcbiAgICAvLyAgdGhlIGVuZCBvZiB0aGUgbGlzdCBvZiBjaGlsZHJlblxuICAgIHJldHVybiBzdG10cztcbn1cbmV4cG9ydHMudHJhdmVyc2VTdG10cyA9IHRyYXZlcnNlU3RtdHM7XG4vKlxuICBJbnZhcmlhbnQg4oCTIHQgbXVzdCBmb2N1cyBvbiB0aGUgc2FtZSBub2RlIGF0IHRoZSBlbmQgb2YgdGhlIHRyYXZlcnNhbFxuKi9cbmZ1bmN0aW9uIHRyYXZlcnNlU3RtdChzLCB0KSB7XG4gICAgc3dpdGNoICh0LnR5cGUubmFtZSkge1xuICAgICAgICBjYXNlIFwiUmV0dXJuU3RhdGVtZW50XCI6XG4gICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTsgLy8gRm9jdXMgcmV0dXJuIGtleXdvcmRcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXMgZXhwcmVzc2lvblxuICAgICAgICAgICAgdmFyIHZhbHVlID0gdHJhdmVyc2VFeHByKHMsIHQpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiB7IHRhZzogXCJyZXR1cm5cIiwgdmFsdWU6IHZhbHVlIH07XG4gICAgICAgIGNhc2UgXCJBc3NpZ25TdGF0ZW1lbnRcIjpcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBmb2N1c2VkIG9uIG5hbWUgKHRoZSBmaXJzdCBjaGlsZClcbiAgICAgICAgICAgIHZhciBuYW1lID0gcy5zdWJzdHJpbmcodC5mcm9tLCB0LnRvKTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gZm9jdXNlZCBvbiA9IHNpZ24uIE1heSBuZWVkIHRoaXMgZm9yIGNvbXBsZXggdGFza3MsIGxpa2UgKz0hXG4gICAgICAgICAgICB2YXIgdHlwZSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgaWYgKHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50bykgIT0gXCI9XCIpIHtcbiAgICAgICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICAgICAgdHlwZSA9IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50byk7XG4gICAgICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7IC8vIGZvY3VzZWQgb24gdGhlIHZhbHVlIGV4cHJlc3Npb25cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRyYXZlcnNlRXhwcihzLCB0KTtcbiAgICAgICAgICAgIHQucGFyZW50KCk7XG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiB0eXBlLCB0YWc6IFwiYXNzaWduXCIsIG5hbWU6IG5hbWUsIHZhbHVlOiB2YWx1ZSB9O1xuICAgICAgICBjYXNlIFwiRXhwcmVzc2lvblN0YXRlbWVudFwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7IC8vIFRoZSBjaGlsZCBpcyBzb21lIGtpbmQgb2YgZXhwcmVzc2lvbiwgdGhlXG4gICAgICAgICAgICAvLyBFeHByZXNzaW9uU3RhdGVtZW50IGlzIGp1c3QgYSB3cmFwcGVyIHdpdGggbm8gaW5mb3JtYXRpb25cbiAgICAgICAgICAgIHZhciBleHByID0gdHJhdmVyc2VFeHByKHMsIHQpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiB7IHRhZzogXCJleHByXCIsIGV4cHI6IGV4cHIgfTtcbiAgICAgICAgY2FzZSBcIklmU3RhdGVtZW50XCI6XG4gICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIHZhciBpZmNvbmRpdGlvbiA9IHRyYXZlcnNlRXhwcihzLCB0KTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgICAgICAgICAgdmFyIGlmYm9keSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKHQubmV4dFNpYmxpbmcoKSkge1xuICAgICAgICAgICAgICAgIGlmYm9keS5wdXNoKHRyYXZlcnNlU3RtdChzLCB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgdmFyIGVsaWZib2R5ID0gW107XG4gICAgICAgICAgICB2YXIgZWxpZmNvbmRpdGlvbjtcbiAgICAgICAgICAgIGlmIChzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pID09IFwiZWxpZlwiKSB7XG4gICAgICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgICAgIGVsaWZjb25kaXRpb24gPSB0cmF2ZXJzZUV4cHIocywgdCk7XG4gICAgICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0Lm5leHRTaWJsaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxpZmJvZHkucHVzaCh0cmF2ZXJzZVN0bXQocywgdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVsaWZib2R5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZWxzZWJvZHkgPSBbXTtcbiAgICAgICAgICAgIGlmIChzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pID09IFwiZWxzZVwiKSB7XG4gICAgICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAodC5uZXh0U2libGluZygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsc2Vib2R5LnB1c2godHJhdmVyc2VTdG10KHMsIHQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQucGFyZW50KCk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRhZzogXCJpZlwiLCBpZl9jb25kaXRpb246IGlmY29uZGl0aW9uLCBlbGlmX2NvbmRpdGlvbjogZWxpZmNvbmRpdGlvbiwgaWZfYm9keTogaWZib2R5LFxuICAgICAgICAgICAgICAgIGVsc2VfYm9keTogZWxzZWJvZHksIGVsaWZfYm9keTogZWxpZmJvZHlcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgXCJXaGlsZVN0YXRlbWVudFwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB2YXIgd2hpbGVfY29uZGl0aW4gPSB0cmF2ZXJzZUV4cHIocywgdCk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgIHZhciB3aGlsZV9ib2R5ID0gW107XG4gICAgICAgICAgICB3aGlsZSAodC5uZXh0U2libGluZygpKSB7XG4gICAgICAgICAgICAgICAgd2hpbGVfYm9keS5wdXNoKHRyYXZlcnNlU3RtdChzLCB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiB7IHRhZzogXCJ3aGlsZVwiLCBjb25kaXRpb246IHdoaWxlX2NvbmRpdGluLCBib2R5OiB3aGlsZV9ib2R5IH07XG4gICAgICAgIGNhc2UgXCJGdW5jdGlvbkRlZmluaXRpb25cIjpcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBGb2N1cyBvbiBkZWZcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXMgb24gbmFtZSBvZiBmdW5jdGlvblxuICAgICAgICAgICAgdmFyIG5hbWUgPSBzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pO1xuICAgICAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBGb2N1cyBvbiBQYXJhbUxpc3RcbiAgICAgICAgICAgIHZhciBwYXJhbWV0ZXJzID0gdHJhdmVyc2VQYXJhbWV0ZXJzKHMsIHQpO1xuICAgICAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBGb2N1cyBvbiBCb2R5IG9yIFR5cGVEZWZcbiAgICAgICAgICAgIHZhciByZXQgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHZhciBtYXliZVREID0gdDtcbiAgICAgICAgICAgIGlmIChtYXliZVRELnR5cGUubmFtZSA9PT0gXCJUeXBlRGVmXCIpIHtcbiAgICAgICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgICAgICByZXQgPSB0cmF2ZXJzZVR5cGUocywgdCk7XG4gICAgICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXMgb24gc2luZ2xlIHN0YXRlbWVudCAoZm9yIG5vdylcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBGb2N1cyBvbiA6XG4gICAgICAgICAgICB2YXIgYm9keSA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKHQubmV4dFNpYmxpbmcoKSkge1xuICAgICAgICAgICAgICAgIGJvZHkucHVzaCh0cmF2ZXJzZVN0bXQocywgdCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdC5wYXJlbnQoKTsgLy8gUG9wIHRvIEJvZHlcbiAgICAgICAgICAgIHQucGFyZW50KCk7IC8vIFBvcCB0byBGdW5jdGlvbkRlZmluaXRpb25cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGFnOiBcImRlZmluZVwiLFxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyczogcGFyYW1ldGVycyxcbiAgICAgICAgICAgICAgICBib2R5OiBib2R5LFxuICAgICAgICAgICAgICAgIHJldDogcmV0XG4gICAgICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMudHJhdmVyc2VTdG10ID0gdHJhdmVyc2VTdG10O1xuZnVuY3Rpb24gdHJhdmVyc2VUeXBlKHMsIHQpIHtcbiAgICBjb25zb2xlLmxvZyhzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pKTtcbiAgICBzd2l0Y2ggKHQudHlwZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgXCJWYXJpYWJsZU5hbWVcIjpcbiAgICAgICAgICAgIHZhciBuYW1lXzEgPSBzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pO1xuICAgICAgICAgICAgaWYgKCEobmFtZV8xID09IFwiaW50XCIgfHwgbmFtZV8xID09IFwiYm9vbFwiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlRXJyb3I6IFVua25vd24gdHlwZTogXCIgKyBuYW1lXzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5hbWVfMTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlRXJyb3I6IFVua25vd24gdHlwZTogXCIgKyB0LnR5cGUubmFtZSk7XG4gICAgfVxufVxuZXhwb3J0cy50cmF2ZXJzZVR5cGUgPSB0cmF2ZXJzZVR5cGU7XG5mdW5jdGlvbiB0cmF2ZXJzZVBhcmFtZXRlcnMocywgdCkge1xuICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBGb2N1c2VzIG9uIG9wZW4gcGFyZW5cbiAgICB2YXIgcGFyYW1ldGVycyA9IFtdO1xuICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXNlcyBvbiBhIFZhcmlhYmxlTmFtZVxuICAgIHdoaWxlICh0LnR5cGUubmFtZSAhPT0gXCIpXCIpIHtcbiAgICAgICAgdmFyIG5hbWVfMiA9IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50byk7XG4gICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXNlcyBvbiBcIlR5cGVEZWZcIiwgaG9wZWZ1bGx5LCBvciBcIixcIiBpZiBtaXN0YWtlXG4gICAgICAgIHZhciBuZXh0VGFnTmFtZSA9IHQudHlwZS5uYW1lOyAvLyBOT1RFKGpvZSk6IGEgYml0IG9mIGEgaGFjayBzbyB0aGUgbmV4dCBsaW5lIGRvZXNuJ3QgaWYtc3BsaXRcbiAgICAgICAgaWYgKG5leHRUYWdOYW1lICE9PSBcIlR5cGVEZWZcIikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFyc2VFcnJvcjogUGFyYW1ldGVyIHR5cGUgbm90IG1lbnRpb25lZCBcIiArIG5hbWVfMik7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICB0LmZpcnN0Q2hpbGQoKTsgLy8gRW50ZXIgVHlwZURlZlxuICAgICAgICB0Lm5leHRTaWJsaW5nKCk7IC8vIEZvY3VzZXMgb24gdHlwZSBpdHNlbGZcbiAgICAgICAgdmFyIHR5cCA9IHRyYXZlcnNlVHlwZShzLCB0KTtcbiAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgdC5uZXh0U2libGluZygpOyAvLyBNb3ZlIG9uIHRvIGNvbW1hIG9yIFwiKVwiXG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCh7IG5hbWU6IG5hbWVfMiwgdHlwOiB0eXAgfSk7XG4gICAgICAgIHQubmV4dFNpYmxpbmcoKTsgLy8gRm9jdXNlcyBvbiBhIFZhcmlhYmxlTmFtZVxuICAgIH1cbiAgICB0LnBhcmVudCgpOyAvLyBQb3AgdG8gUGFyYW1MaXN0XG4gICAgcmV0dXJuIHBhcmFtZXRlcnM7XG59XG5leHBvcnRzLnRyYXZlcnNlUGFyYW1ldGVycyA9IHRyYXZlcnNlUGFyYW1ldGVycztcbmZ1bmN0aW9uIHRyYXZlcnNlRXhwcihzLCB0KSB7XG4gICAgc3dpdGNoICh0LnR5cGUubmFtZSkge1xuICAgICAgICBjYXNlIFwiQm9vbGVhblwiOlxuICAgICAgICAgICAgcmV0dXJuIHsgYTogXCJib29sXCIsIHRhZzogXCJsaXRlcmFsXCIsIHZhbHVlOiB7IHR5cDogXCJib29sXCIsIHZhbHVlOiBzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pIH0gfTtcbiAgICAgICAgY2FzZSBcIk51bWJlclwiOlxuICAgICAgICAgICAgcmV0dXJuIHsgYTogXCJpbnRcIiwgdGFnOiBcImxpdGVyYWxcIiwgdmFsdWU6IHsgdHlwOiBcImludFwiLCB2YWx1ZTogTnVtYmVyKHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50bykpIH0gfTtcbiAgICAgICAgY2FzZSBcIk5vbmVcIjpcbiAgICAgICAgICAgIHJldHVybiB7IGE6IFwibm9uZVwiLCB0YWc6IFwibGl0ZXJhbFwiLCB2YWx1ZTogeyB0eXA6IFwibm9uZVwiLCB2YWx1ZTogcy5zdWJzdHJpbmcodC5mcm9tLCB0LnRvKSB9IH07XG4gICAgICAgIGNhc2UgXCJWYXJpYWJsZU5hbWVcIjpcbiAgICAgICAgICAgIHJldHVybiB7IHRhZzogXCJuYW1lXCIsIG5hbWU6IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50bykgfTtcbiAgICAgICAgY2FzZSBcIkJpbmFyeUV4cHJlc3Npb25cIjpcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpO1xuICAgICAgICAgICAgdmFyIGxlZnQgPSB0cmF2ZXJzZUV4cHIocywgdCk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB2YXIgb3BlcmF0b3IgPSBzLnN1YnN0cmluZyh0LmZyb20sIHQudG8pO1xuICAgICAgICAgICAgdmFyIGFsbG93ZWRfYmluYXJ5X29wZXJhdG9ycyA9IFtcIitcIiwgXCItXCIsIFwiKlwiLCBcIi8vXCIsIFwiJVwiLCBcIj09XCIsIFwiIT1cIiwgXCI8PVwiLCBcIj49XCIsIFwiPFwiLCBcIj5cIiwgXCJpc1wiXTtcbiAgICAgICAgICAgIGlmICghYWxsb3dlZF9iaW5hcnlfb3BlcmF0b3JzLmluY2x1ZGVzKG9wZXJhdG9yKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBhcnNlRXJyb3I6IEludmFsaWQgYmluYXJ5IG9wZXJhdGlvbiAoKywtLCosLy8sJSw9PSwhPSw8PSw+PSw8LD4gaXMpXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdC5uZXh0U2libGluZygpO1xuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gdHJhdmVyc2VFeHByKHMsIHQpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGFnOiBcImJpbmFyeVwiLFxuICAgICAgICAgICAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICAgICAgICAgICAgb3A6IG9wZXJhdG9yLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiByaWdodFxuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBcIlVuYXJ5RXhwcmVzc2lvblwiOlxuICAgICAgICAgICAgdC5maXJzdENoaWxkKCk7XG4gICAgICAgICAgICB2YXIgdW5hcnlvcCA9IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50byk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7XG4gICAgICAgICAgICB2YXIgdmFsID0gdHJhdmVyc2VFeHByKHMsIHQpO1xuICAgICAgICAgICAgdmFyIGFsbG93ZWRfdW5hcnlfb3BlcmF0b3JzID0gW1wiLVwiLCBcIitcIiwgXCJub3RcIl07XG4gICAgICAgICAgICBpZiAoIWFsbG93ZWRfdW5hcnlfb3BlcmF0b3JzLmluY2x1ZGVzKHVuYXJ5b3ApKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGFyc2VFcnJvcjogSW52YWxpZCB1bmFyeSBvcGVyYXRpb24gKG5vdCwgKywgLSlcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0LnBhcmVudCgpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0YWc6IFwidW5hcnlcIiwgZXhwcjogdmFsLCBvcDogdW5hcnlvcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSBcIlBhcmVudGhlc2l6ZWRFeHByZXNzaW9uXCI6XG4gICAgICAgICAgICB0LmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgICAgIHQubmV4dFNpYmxpbmcoKTtcbiAgICAgICAgICAgIHZhciBleHByID0gdHJhdmVyc2VFeHByKHMsIHQpO1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHJldHVybiBleHByO1xuICAgICAgICBjYXNlIFwiQ2FsbEV4cHJlc3Npb25cIjpcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBGb2N1cyBuYW1lXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHMuc3Vic3RyaW5nKHQuZnJvbSwgdC50byk7XG4gICAgICAgICAgICB0Lm5leHRTaWJsaW5nKCk7IC8vIEZvY3VzIEFyZ0xpc3RcbiAgICAgICAgICAgIHQuZmlyc3RDaGlsZCgpOyAvLyBGb2N1cyBvcGVuIHBhcmVuXG4gICAgICAgICAgICB2YXIgYXJncyA9IHRyYXZlcnNlQXJndW1lbnRzKHQsIHMpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHsgdGFnOiBcImNhbGxcIiwgbmFtZTogbmFtZSwgYXJnczogYXJncyB9O1xuICAgICAgICAgICAgdC5wYXJlbnQoKTtcbiAgICAgICAgICAgIHQucGFyZW50KCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydHMudHJhdmVyc2VFeHByID0gdHJhdmVyc2VFeHByO1xuZnVuY3Rpb24gdHJhdmVyc2VBcmd1bWVudHMoYywgcykge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgYy5uZXh0U2libGluZygpO1xuICAgIHdoaWxlIChjLnR5cGUubmFtZSAhPT0gXCIpXCIpIHtcbiAgICAgICAgdmFyIGV4cHIgPSB0cmF2ZXJzZUV4cHIocywgYyk7XG4gICAgICAgIGFyZ3MucHVzaChleHByKTtcbiAgICAgICAgYy5uZXh0U2libGluZygpOyAvLyBGb2N1c2VzIG9uIGVpdGhlciBcIixcIiBvciBcIilcIlxuICAgICAgICBjLm5leHRTaWJsaW5nKCk7IC8vIEZvY3VzZXMgb24gYSBWYXJpYWJsZU5hbWVcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG59XG5leHBvcnRzLnRyYXZlcnNlQXJndW1lbnRzID0gdHJhdmVyc2VBcmd1bWVudHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudGNQcm9ncmFtID0gZXhwb3J0cy50Y1N0bXQgPSBleHBvcnRzLnRjRXhwciA9IHZvaWQgMDtcbnZhciBvcF9jaGVja3MgPSBuZXcgTWFwKCk7XG5vcF9jaGVja3Muc2V0KFwiK1wiLCBcImludFwiKTtcbm9wX2NoZWNrcy5zZXQoXCItXCIsIFwiaW50XCIpO1xub3BfY2hlY2tzLnNldChcIipcIiwgXCJpbnRcIik7XG5vcF9jaGVja3Muc2V0KFwiJVwiLCBcImludFwiKTtcbm9wX2NoZWNrcy5zZXQoXCI8PVwiLCBcImludFwiKTtcbm9wX2NoZWNrcy5zZXQoXCI+PVwiLCBcImludFwiKTtcbm9wX2NoZWNrcy5zZXQoXCI8XCIsIFwiaW50XCIpO1xub3BfY2hlY2tzLnNldChcIj5cIiwgXCJpbnRcIik7XG5vcF9jaGVja3Muc2V0KFwibm90XCIsIFwiYm9vbFwiKTtcbm9wX2NoZWNrcy5zZXQoXCI9PVwiLCBcImludFwiKTtcbm9wX2NoZWNrcy5zZXQoXCIhPVwiLCBcImludFwiKTtcbm9wX2NoZWNrcy5zZXQoXCJpc1wiLCBcIm5vbmVcIik7XG5vcF9jaGVja3Muc2V0KFwibm90XCIsIFwiYm9vbFwiKTtcbnZhciBvcF9yZXQgPSBuZXcgTWFwKCk7XG5vcF9yZXQuc2V0KFwiK1wiLCBcImludFwiKTtcbm9wX3JldC5zZXQoXCItXCIsIFwiaW50XCIpO1xub3BfcmV0LnNldChcIipcIiwgXCJpbnRcIik7XG5vcF9yZXQuc2V0KFwiJVwiLCBcImludFwiKTtcbm9wX3JldC5zZXQoXCI8PVwiLCBcImJvb2xcIik7XG5vcF9yZXQuc2V0KFwiPj1cIiwgXCJib29sXCIpO1xub3BfcmV0LnNldChcIjxcIiwgXCJib29sXCIpO1xub3BfcmV0LnNldChcIj5cIiwgXCJib29sXCIpO1xub3BfcmV0LnNldChcIm5vdFwiLCBcImJvb2xcIik7XG5vcF9yZXQuc2V0KFwiPT1cIiwgXCJib29sXCIpO1xub3BfcmV0LnNldChcIiE9XCIsIFwiYm9vbFwiKTtcbm9wX3JldC5zZXQoXCJpc1wiLCBcImJvb2xcIik7XG5vcF9yZXQuc2V0KFwibm90XCIsIFwiYm9vbFwiKTtcbmZ1bmN0aW9uIHRjRXhwcihlLCBmdW5jdGlvbnMsIHZhcmlhYmxlcykge1xuICAgIHN3aXRjaCAoZS50YWcpIHtcbiAgICAgICAgY2FzZSBcImxpdGVyYWxcIjogcmV0dXJuIGUudmFsdWUudHlwO1xuICAgICAgICBjYXNlIFwibmFtZVwiOlxuICAgICAgICAgICAgaWYgKCF2YXJpYWJsZXMuaGFzKGUubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUeXBlRXJyb3I6IFZhcmlhYmxlIFwiICsgZS5uYW1lICsgXCIgbm90IGRlZmluZWQuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhcmlhYmxlcy5nZXQoZS5uYW1lKTtcbiAgICAgICAgY2FzZSBcImJpbmFyeVwiOlxuICAgICAgICAgICAgdmFyIG9wZXJhdG9yID0gZS5vcDtcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gdGNFeHByKGUubGVmdCwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gdGNFeHByKGUucmlnaHQsIGZ1bmN0aW9ucywgdmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChvcF9jaGVja3MuZ2V0KG9wZXJhdG9yKSAhPSBsZWZ0IHx8IG9wX2NoZWNrcy5nZXQob3BlcmF0b3IpICE9IHJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBJbmNvbXBhdGlibGUgb3BlcmFuZHMgaW4gYmluYXJ5IGV4cHJlc3Npb24uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9wX3JldC5nZXQob3BlcmF0b3IpO1xuICAgICAgICBjYXNlIFwidW5hcnlcIjpcbiAgICAgICAgICAgIHZhciBvcGVyYXRvciA9IGUub3A7XG4gICAgICAgICAgICB2YXIgb3BlcmFuZCA9IHRjRXhwcihlLmV4cHIsIGZ1bmN0aW9ucywgdmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmIChvcF9jaGVja3MuZ2V0KG9wZXJhdG9yKSAhPSBvcGVyYW5kKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBJbmNvbXBhdGlibGUgb3BlcmFuZCBpbiB1bmFyeSBleHByZXNzaW9uLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcF9yZXQuZ2V0KG9wZXJhdG9yKTtcbiAgICAgICAgY2FzZSBcImNhbGxcIjpcbiAgICAgICAgICAgIGlmIChlLm5hbWUgPT09IFwicHJpbnRcIikge1xuICAgICAgICAgICAgICAgIGlmIChlLmFyZ3MubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogcHJpbnQgZXhwZWN0cyBhIHNpbmdsZSBhcmd1bWVudFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZS5hcmdzWzBdLmEgPSB0Y0V4cHIoZS5hcmdzWzBdLCBmdW5jdGlvbnMsIHZhcmlhYmxlcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGUuYXJnc1swXS5hO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFmdW5jdGlvbnMuaGFzKGUubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUeXBlRXJyb3I6IEZ1bmN0aW9uIFwiLmNvbmNhdChlLm5hbWUsIFwiIG5vdCBmb3VuZFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgX2EgPSBmdW5jdGlvbnMuZ2V0KGUubmFtZSksIGFyZ3MgPSBfYVswXSwgcmV0ID0gX2FbMV07XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IGUuYXJncy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUeXBlRXJyb3I6IEV4cGVjdGVkIFwiLmNvbmNhdChhcmdzLmxlbmd0aCwgXCIgYXJndW1lbnRzIGJ1dCBnb3QgXCIpLmNvbmNhdChlLmFyZ3MubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24gKGEsIGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJndHlwID0gdGNFeHByKGUuYXJnc1tpXSwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgICAgIGlmIChhICE9PSBhcmd0eXApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBHb3QgXCIuY29uY2F0KGFyZ3R5cCwgXCIgYXMgYXJndW1lbnQgXCIpLmNvbmNhdChpICsgMSwgXCIsIGV4cGVjdGVkIFwiKS5jb25jYXQoYSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG5leHBvcnRzLnRjRXhwciA9IHRjRXhwcjtcbmZ1bmN0aW9uIHRjU3RtdChzLCBmdW5jdGlvbnMsIHZhcmlhYmxlcywgY3VycmVudFJldHVybikge1xuICAgIHN3aXRjaCAocy50YWcpIHtcbiAgICAgICAgY2FzZSBcIndoaWxlXCI6XG4gICAgICAgICAgICBpZiAodGNFeHByKHMuY29uZGl0aW9uLCBmdW5jdGlvbnMsIHZhcmlhYmxlcykgIT0gXCJib29sXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUeXBlRXJyb3I6IENvbmRpdGlvbiBpbiB3aGlsZSBzdGF0ZW1lbnQgbXVzdCBiZSBib29sZWFuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjYXNlIFwiaWZcIjpcbiAgICAgICAgICAgIGlmICh0Y0V4cHIocy5pZl9jb25kaXRpb24sIGZ1bmN0aW9ucywgdmFyaWFibGVzKSAhPSBcImJvb2xcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogQ29uZGl0aW9uIGluIGlmIHN0YXRlbWVudCBtdXN0IGJlIGJvb2xlYW5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocy5lbGlmX2NvbmRpdGlvbiAhPSB1bmRlZmluZWQgJiYgdGNFeHByKHMuZWxpZl9jb25kaXRpb24sIGZ1bmN0aW9ucywgdmFyaWFibGVzKSAhPSBcImJvb2xcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogQ29uZGl0aW9uIGluIGVsaWYgc3RhdGVtZW50IG11c3QgYmUgYm9vbGVhblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY2FzZSBcImFzc2lnblwiOiB7XG4gICAgICAgICAgICB2YXIgcmhzID0gdGNFeHByKHMudmFsdWUsIGZ1bmN0aW9ucywgdmFyaWFibGVzKTtcbiAgICAgICAgICAgIGlmICh2YXJpYWJsZXMuaGFzKHMubmFtZSkgJiYgdmFyaWFibGVzLmdldChzLm5hbWUpICE9IHJocykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlR5cGVFcnJvcjogQ2Fubm90IGFzc2lnbiBcIi5jb25jYXQocmhzLCBcIiB0byBcIikuY29uY2F0KHZhcmlhYmxlcy5nZXQocy5uYW1lKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodmFyaWFibGVzLmhhcyhzLm5hbWUpICYmIHZhcmlhYmxlcy5nZXQocy5uYW1lKSAhPSB0Y0V4cHIocy52YWx1ZSwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBSZXR1cm4gdHlwZSBvZiBmdW5jdGlvbiBhbmQgdmFyaWFibGUgZG8gbm90IG1hdGNoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyaWFibGVzLnNldChzLm5hbWUsIHJocyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcImRlZmluZVwiOiB7XG4gICAgICAgICAgICB2YXIgYm9keXZhcnNfMSA9IG5ldyBNYXAodmFyaWFibGVzLmVudHJpZXMoKSk7XG4gICAgICAgICAgICBzLnBhcmFtZXRlcnMuZm9yRWFjaChmdW5jdGlvbiAocCkgeyBib2R5dmFyc18xLnNldChwLm5hbWUsIHAudHlwKTsgfSk7XG4gICAgICAgICAgICBzLmJvZHkuZm9yRWFjaChmdW5jdGlvbiAoYnMpIHsgcmV0dXJuIHRjU3RtdChicywgZnVuY3Rpb25zLCBib2R5dmFyc18xLCBzLnJldCk7IH0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJleHByXCI6IHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gdGNFeHByKHMuZXhwciwgZnVuY3Rpb25zLCB2YXJpYWJsZXMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codHlwZSk7XG4gICAgICAgICAgICBpZiAodHlwZSA9PSBcImJvb2xcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgXCJyZXR1cm5cIjoge1xuICAgICAgICAgICAgdmFyIHZhbFR5cCA9IHRjRXhwcihzLnZhbHVlLCBmdW5jdGlvbnMsIHZhcmlhYmxlcyk7XG4gICAgICAgICAgICBpZiAodmFsVHlwICE9PSBjdXJyZW50UmV0dXJuKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVHlwZUVycm9yOiBcIi5jb25jYXQodmFsVHlwLCBcIiByZXR1cm5lZCwgXCIpLmNvbmNhdChjdXJyZW50UmV0dXJuLCBcIiBleHBlY3RlZC5cIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy50Y1N0bXQgPSB0Y1N0bXQ7XG5mdW5jdGlvbiB0Y1Byb2dyYW0ocCkge1xuICAgIHZhciBmdW5jdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgZnVuY3Rpb25zLnNldChcInByaW50XCIsIFtbXCJpbnRcIiwgXCJib29sXCJdLCBcIm5vbmVcIl0pO1xuICAgIHAuZm9yRWFjaChmdW5jdGlvbiAocykge1xuICAgICAgICBpZiAocy50YWcgPT09IFwiZGVmaW5lXCIpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9ucy5zZXQocy5uYW1lLCBbcy5wYXJhbWV0ZXJzLm1hcChmdW5jdGlvbiAocCkgeyByZXR1cm4gcC50eXA7IH0pLCBzLnJldF0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGdsb2JhbHMgPSBuZXcgTWFwKCk7XG4gICAgdmFyIHR5cGUgPSBmYWxzZTtcbiAgICBwLmZvckVhY2goZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgdHlwZSA9IHRjU3RtdChzLCBmdW5jdGlvbnMsIGdsb2JhbHMsIFwibm9uZVwiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdHlwZTtcbn1cbmV4cG9ydHMudGNQcm9ncmFtID0gdGNQcm9ncmFtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGNvbXBpbGVyXzEgPSByZXF1aXJlKFwiLi9jb21waWxlclwiKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gZGlzcGxheShhcmcpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3V0cHV0XCIpO1xuICAgICAgICBvdXRwdXQudGV4dENvbnRlbnQgKz0gYXJnICsgXCJcXG5cIjtcbiAgICAgICAgLy8gY29uc3QgZWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcbiAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXRwdXRcIikuYXBwZW5kQ2hpbGQoZWx0KTtcbiAgICAgICAgLy8gZWx0LmlubmVyVGV4dCA9IGFyZyArIFwiXFxuXCI7XG4gICAgfVxuICAgIHZhciBpbXBvcnRPYmplY3QsIHJ1bkJ1dHRvbiwgdXNlckNvZGU7XG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICBpbXBvcnRPYmplY3QgPSB7XG4gICAgICAgICAgICBpbXBvcnRzOiB7XG4gICAgICAgICAgICAgICAgcHJpbnRfbnVtOiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2luZyBmcm9tIFdBU006IFwiLCBhcmcpO1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5KFN0cmluZyhhcmcpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG5vdF9vcGVyYXRvcjogZnVuY3Rpb24gKGFyZykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkxvZ2dpbmcgZnJvbSBXQVNNOiBcIiwgYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dnaW5nIGZyb20gV0FTTTogXCIsIGFyZyk7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkoU3RyaW5nKCFhcmcpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFhcmc7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcmludF9ib29sOiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcmcgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkoXCJGYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXkoXCJUcnVlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmc7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcmludF9ub25lOiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkoXCJOb25lXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcHJpbnRfYW55OiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXkoYXJnLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHJ1bkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnVuXCIpO1xuICAgICAgICB1c2VyQ29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXNlci1jb2RlXCIpO1xuICAgICAgICBydW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcHJvZ3JhbSwgb3V0cHV0LCB3YXQsIGNvZGUsIHJlc3VsdCwgZV8xO1xuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvZ3JhbSA9IHVzZXJDb2RlLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXRwdXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhdCA9ICgwLCBjb21waWxlcl8xLmNvbXBpbGUpKHByb2dyYW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGVkLWNvZGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlLnRleHRDb250ZW50ID0gd2F0O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgKDAsIGNvbXBpbGVyXzEucnVuKSh3YXQsIGltcG9ydE9iamVjdCldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQudGV4dENvbnRlbnQgKz0gU3RyaW5nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJjb2xvcjogYmxhY2tcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgZV8xID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlXzEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnRleHRDb250ZW50ID0gU3RyaW5nKGVfMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgXCJjb2xvcjogcmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHVzZXJDb2RlLnZhbHVlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwcm9ncmFtXCIpO1xuICAgICAgICB1c2VyQ29kZS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInByb2dyYW1cIiwgdXNlckNvZGUudmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsgfSk7XG4gICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICB9KTtcbn0pOyB9KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gd2FidDsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBsZXplciA9IHJlcXVpcmUoJ2xlemVyJyk7XG5cbi8vIFRoaXMgZmlsZSB3YXMgZ2VuZXJhdGVkIGJ5IGxlemVyLWdlbmVyYXRvci4gWW91IHByb2JhYmx5IHNob3VsZG4ndCBlZGl0IGl0LlxuY29uc3QgcHJpbnRLZXl3b3JkID0gMSxcbiAgaW5kZW50ID0gMTYyLFxuICBkZWRlbnQgPSAxNjMsXG4gIG5ld2xpbmUkMSA9IDE2NCxcbiAgbmV3bGluZUJyYWNrZXRlZCA9IDE2NSxcbiAgbmV3bGluZUVtcHR5ID0gMTY2LFxuICBlb2YgPSAxNjcsXG4gIFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uID0gMjEsXG4gIFR1cGxlRXhwcmVzc2lvbiA9IDQ3LFxuICBDb21wcmVoZW5zaW9uRXhwcmVzc2lvbiA9IDQ4LFxuICBBcnJheUV4cHJlc3Npb24gPSA1MixcbiAgQXJyYXlDb21wcmVoZW5zaW9uRXhwcmVzc2lvbiA9IDU1LFxuICBEaWN0aW9uYXJ5RXhwcmVzc2lvbiA9IDU2LFxuICBEaWN0aW9uYXJ5Q29tcHJlaGVuc2lvbkV4cHJlc3Npb24gPSA1OSxcbiAgU2V0RXhwcmVzc2lvbiA9IDYwLFxuICBTZXRDb21wcmVoZW5zaW9uRXhwcmVzc2lvbiA9IDYxLFxuICBBcmdMaXN0ID0gNjMsXG4gIFBhcmFtTGlzdCA9IDEyMTtcblxuY29uc3QgbmV3bGluZSA9IDEwLCBjYXJyaWFnZVJldHVybiA9IDEzLCBzcGFjZSA9IDMyLCB0YWIgPSA5LCBoYXNoID0gMzUsIHBhcmVuT3BlbiA9IDQwLCBkb3QgPSA0NjtcblxuY29uc3QgYnJhY2tldGVkID0gW1xuICBQYXJlbnRoZXNpemVkRXhwcmVzc2lvbiwgVHVwbGVFeHByZXNzaW9uLCBDb21wcmVoZW5zaW9uRXhwcmVzc2lvbiwgQXJyYXlFeHByZXNzaW9uLCBBcnJheUNvbXByZWhlbnNpb25FeHByZXNzaW9uLFxuICBEaWN0aW9uYXJ5RXhwcmVzc2lvbiwgRGljdGlvbmFyeUNvbXByZWhlbnNpb25FeHByZXNzaW9uLCBTZXRFeHByZXNzaW9uLCBTZXRDb21wcmVoZW5zaW9uRXhwcmVzc2lvbiwgQXJnTGlzdCwgUGFyYW1MaXN0XG5dO1xuXG5sZXQgY2FjaGVkSW5kZW50ID0gMCwgY2FjaGVkSW5wdXQgPSBudWxsLCBjYWNoZWRQb3MgPSAwO1xuZnVuY3Rpb24gZ2V0SW5kZW50KGlucHV0LCBwb3MpIHtcbiAgaWYgKHBvcyA9PSBjYWNoZWRQb3MgJiYgaW5wdXQgPT0gY2FjaGVkSW5wdXQpIHJldHVybiBjYWNoZWRJbmRlbnRcbiAgY2FjaGVkSW5wdXQgPSBpbnB1dDsgY2FjaGVkUG9zID0gcG9zO1xuICByZXR1cm4gY2FjaGVkSW5kZW50ID0gZ2V0SW5kZW50SW5uZXIoaW5wdXQsIHBvcylcbn1cblxuZnVuY3Rpb24gZ2V0SW5kZW50SW5uZXIoaW5wdXQsIHBvcykge1xuICBmb3IgKGxldCBpbmRlbnQgPSAwOzsgcG9zKyspIHtcbiAgICBsZXQgY2ggPSBpbnB1dC5nZXQocG9zKTtcbiAgICBpZiAoY2ggPT0gc3BhY2UpIGluZGVudCsrO1xuICAgIGVsc2UgaWYgKGNoID09IHRhYikgaW5kZW50ICs9IDggLSAoaW5kZW50ICUgOCk7XG4gICAgZWxzZSBpZiAoY2ggPT0gbmV3bGluZSB8fCBjaCA9PSBjYXJyaWFnZVJldHVybiB8fCBjaCA9PSBoYXNoKSByZXR1cm4gLTFcbiAgICBlbHNlIHJldHVybiBpbmRlbnRcbiAgfVxufVxuXG5jb25zdCBuZXdsaW5lcyA9IG5ldyBsZXplci5FeHRlcm5hbFRva2VuaXplcigoaW5wdXQsIHRva2VuLCBzdGFjaykgPT4ge1xuICBsZXQgbmV4dCA9IGlucHV0LmdldCh0b2tlbi5zdGFydCk7XG4gIGlmIChuZXh0IDwgMCkge1xuICAgIHRva2VuLmFjY2VwdChlb2YsIHRva2VuLnN0YXJ0KTtcbiAgfSBlbHNlIGlmIChuZXh0ICE9IG5ld2xpbmUgJiYgbmV4dCAhPSBjYXJyaWFnZVJldHVybikgOyBlbHNlIGlmIChzdGFjay5zdGFydE9mKGJyYWNrZXRlZCkgIT0gbnVsbCkge1xuICAgIHRva2VuLmFjY2VwdChuZXdsaW5lQnJhY2tldGVkLCB0b2tlbi5zdGFydCArIDEpO1xuICB9IGVsc2UgaWYgKGdldEluZGVudChpbnB1dCwgdG9rZW4uc3RhcnQgKyAxKSA8IDApIHtcbiAgICB0b2tlbi5hY2NlcHQobmV3bGluZUVtcHR5LCB0b2tlbi5zdGFydCArIDEpO1xuICB9IGVsc2Uge1xuICAgIHRva2VuLmFjY2VwdChuZXdsaW5lJDEsIHRva2VuLnN0YXJ0ICsgMSk7XG4gIH1cbn0sIHtjb250ZXh0dWFsOiB0cnVlLCBmYWxsYmFjazogdHJ1ZX0pO1xuXG5jb25zdCBpbmRlbnRhdGlvbiA9IG5ldyBsZXplci5FeHRlcm5hbFRva2VuaXplcigoaW5wdXQsIHRva2VuLCBzdGFjaykgPT4ge1xuICBsZXQgcHJldiA9IGlucHV0LmdldCh0b2tlbi5zdGFydCAtIDEpLCBkZXB0aDtcbiAgaWYgKChwcmV2ID09IG5ld2xpbmUgfHwgcHJldiA9PSBjYXJyaWFnZVJldHVybikgJiZcbiAgICAgIChkZXB0aCA9IGdldEluZGVudChpbnB1dCwgdG9rZW4uc3RhcnQpKSA+PSAwICYmXG4gICAgICBkZXB0aCAhPSBzdGFjay5jb250ZXh0LmRlcHRoICYmXG4gICAgICBzdGFjay5zdGFydE9mKGJyYWNrZXRlZCkgPT0gbnVsbClcbiAgICB0b2tlbi5hY2NlcHQoZGVwdGggPCBzdGFjay5jb250ZXh0LmRlcHRoID8gZGVkZW50IDogaW5kZW50LCB0b2tlbi5zdGFydCk7XG59KTtcblxuZnVuY3Rpb24gSW5kZW50TGV2ZWwocGFyZW50LCBkZXB0aCkge1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5kZXB0aCA9IGRlcHRoO1xuICB0aGlzLmhhc2ggPSAocGFyZW50ID8gcGFyZW50Lmhhc2ggKyBwYXJlbnQuaGFzaCA8PCA4IDogMCkgKyBkZXB0aCArIChkZXB0aCA8PCA0KTtcbn1cblxuY29uc3QgdG9wSW5kZW50ID0gbmV3IEluZGVudExldmVsKG51bGwsIDApO1xuXG5jb25zdCB0cmFja0luZGVudCA9IG5ldyBsZXplci5Db250ZXh0VHJhY2tlcih7XG4gIHN0YXJ0OiB0b3BJbmRlbnQsXG4gIHNoaWZ0KGNvbnRleHQsIHRlcm0sIGlucHV0LCBzdGFjaykge1xuICAgIHJldHVybiB0ZXJtID09IGluZGVudCA/IG5ldyBJbmRlbnRMZXZlbChjb250ZXh0LCBnZXRJbmRlbnQoaW5wdXQsIHN0YWNrLnBvcykpIDpcbiAgICAgIHRlcm0gPT0gZGVkZW50ID8gY29udGV4dC5wYXJlbnQgOiBjb250ZXh0XG4gIH0sXG4gIGhhc2goY29udGV4dCkgeyByZXR1cm4gY29udGV4dC5oYXNoIH1cbn0pO1xuXG5jb25zdCBsZWdhY3lQcmludCA9IG5ldyBsZXplci5FeHRlcm5hbFRva2VuaXplcigoaW5wdXQsIHRva2VuKSA9PiB7XG4gIGxldCBwb3MgPSB0b2tlbi5zdGFydDtcbiAgZm9yIChsZXQgcHJpbnQgPSBcInByaW50XCIsIGkgPSAwOyBpIDwgcHJpbnQubGVuZ3RoOyBpKyssIHBvcysrKVxuICAgIGlmIChpbnB1dC5nZXQocG9zKSAhPSBwcmludC5jaGFyQ29kZUF0KGkpKSByZXR1cm5cbiAgbGV0IGVuZCA9IHBvcztcbiAgaWYgKC9cXHcvLnRlc3QoU3RyaW5nLmZyb21DaGFyQ29kZShpbnB1dC5nZXQocG9zKSkpKSByZXR1cm5cbiAgZm9yICg7OyBwb3MrKykge1xuICAgIGxldCBuZXh0ID0gaW5wdXQuZ2V0KHBvcyk7XG4gICAgaWYgKG5leHQgPT0gc3BhY2UgfHwgbmV4dCA9PSB0YWIpIGNvbnRpbnVlXG4gICAgaWYgKG5leHQgIT0gcGFyZW5PcGVuICYmIG5leHQgIT0gZG90ICYmIG5leHQgIT0gbmV3bGluZSAmJiBuZXh0ICE9IGNhcnJpYWdlUmV0dXJuICYmIG5leHQgIT0gaGFzaClcbiAgICAgIHRva2VuLmFjY2VwdChwcmludEtleXdvcmQsIGVuZCk7XG4gICAgcmV0dXJuXG4gIH1cbn0pO1xuXG4vLyBUaGlzIGZpbGUgd2FzIGdlbmVyYXRlZCBieSBsZXplci1nZW5lcmF0b3IuIFlvdSBwcm9iYWJseSBzaG91bGRuJ3QgZWRpdCBpdC5cbmNvbnN0IHNwZWNfaWRlbnRpZmllciA9IHtfX3Byb3RvX186bnVsbCxhd2FpdDo0MCwgb3I6NDgsIGFuZDo1MCwgaW46NTQsIG5vdDo1NiwgaXM6NTgsIGlmOjY0LCBlbHNlOjY2LCBsYW1iZGE6NzAsIHlpZWxkOjg4LCBmcm9tOjkwLCBhc3luYzo5OCwgZm9yOjEwMCwgTm9uZToxNTIsIFRydWU6MTU0LCBGYWxzZToxNTQsIGRlbDoxNjgsIHBhc3M6MTcyLCBicmVhazoxNzYsIGNvbnRpbnVlOjE4MCwgcmV0dXJuOjE4NCwgcmFpc2U6MTkyLCBpbXBvcnQ6MTk2LCBhczoxOTgsIGdsb2JhbDoyMDIsIG5vbmxvY2FsOjIwNCwgYXNzZXJ0OjIwOCwgZWxpZjoyMTgsIHdoaWxlOjIyMiwgdHJ5OjIyOCwgZXhjZXB0OjIzMCwgZmluYWxseToyMzIsIHdpdGg6MjM2LCBkZWY6MjQwLCBjbGFzczoyNTB9O1xuY29uc3QgcGFyc2VyID0gbGV6ZXIuUGFyc2VyLmRlc2VyaWFsaXplKHtcbiAgdmVyc2lvbjogMTMsXG4gIHN0YXRlczogXCIhP3xPYFEkSVhPT08lY1EkSVtPJyNHYU9PUSRJUycjQ20nI0NtT09RJElTJyNDbicjQ25PJ1JRJElXTycjQ2xPKHRRJElbTycjR2BPT1EkSVMnI0dhJyNHYU9PUSRJUycjRFInI0RST09RJElTJyNHYCcjR2BPKWJRJElXTycjQ3FPKXJRJElXTycjRGJPKlNRJElXTycjRGZPT1EkSVMnI0RzJyNEc08qZ09gTycjRHNPKm9PcE8nI0RzTyp3TyFiTycjRHRPK1NPI3RPJyNEdE8rX08mak8nI0R0TytqTyxVTycjRHRPLWxRJElbTycjR1FPT1EkSVMnI0dRJyNHUU8nUlEkSVdPJyNHUE8vT1EkSVtPJyNHUE9PUSRJUycjRV0nI0VdTy9nUSRJV08nI0VeT09RJElTJyNHTycjR09PL3FRJElXTycjRn1PT1EkSVYnI0Z9JyNGfU8vfFEkSVdPJyNGUE9PUSRJUycjRnInI0ZyTzBSUSRJV08nI0ZPT09RJElWJyNIWicjSFpPT1EkSVYnI0Z8JyNGfE9PUSRJVCcjRlInI0ZSUWBRJElYT09PJ1JRJElXTycjQ29PMGFRJElXTycjQ3pPMGhRJElXTycjRE9PMHZRJElXTycjR2VPMVdRJElbTycjRVFPJ1JRJElXTycjRVJPT1EkSVMnI0VUJyNFVE9PUSRJUycjRVYnI0VWT09RJElTJyNFWCcjRVhPMWxRJElXTycjRVpPMlNRJElXTycjRV9PL3xRJElXTycjRWFPMmdRJElbTycjRWFPL3xRJElXTycjRWRPL2dRJElXTycjRWdPL2dRJElXTycjRWtPL2dRJElXTycjRW5PMnJRJElXTycjRXBPMnlRJElXTycjRXVPM1VRJElXTycjRXFPL2dRJElXTycjRXVPL3xRJElXTycjRXdPL3xRJElXTycjRXxPT1EkSVMnI0NjJyNDY09PUSRJUycjQ2QnI0NkT09RJElTJyNDZScjQ2VPT1EkSVMnI0NmJyNDZk9PUSRJUycjQ2cnI0NnT09RJElTJyNDaCcjQ2hPT1EkSVMnI0NqJyNDak8nUlEkSVdPLDU4fE8nUlEkSVdPLDU4fE8nUlEkSVdPLDU4fE8nUlEkSVdPLDU4fE8nUlEkSVdPLDU4fE8nUlEkSVdPLDU4fE8zWlEkSVdPJyNEbU9PUSRJUyw1OlcsNTpXTzNuUSRJV08sNTpaTzN7USUxYE8sNTpaTzRRUSRJW08sNTlXTzBhUSRJV08sNTlfTzBhUSRJV08sNTlfTzBhUSRJV08sNTlfTzZwUSRJV08sNTlfTzZ1USRJV08sNTlfTzZ8USRJV08sNTlnTzdUUSRJV08nI0dgTzhaUSRJV08nI0dfT09RJElTJyNHXycjR19PT1EkSVMnI0RYJyNEWE84clEkSVdPLDU5XU8nUlEkSVdPLDU5XU85UVEkSVdPLDU5XU85VlEkSVdPLDU6UE8nUlEkSVdPLDU6UE9PUSRJUyw1OXwsNTl8TzllUSRJV08sNTl8TzlqUSRJV08sNTpWTydSUSRJV08sNTpWTydSUSRJV08sNTpUT09RJElTLDU6USw1OlFPOXtRJElXTyw1OlFPOlFRJElXTyw1OlVPT09PJyNGWicjRlpPOlZPYE8sNTpfT09RJElTLDU6Xyw1Ol9PT09PJyNGWycjRltPOl9PcE8sNTpfTzpnUSRJV08nI0R1T09PTycjRl0nI0ZdTzp3TyFiTyw1OmBPT1EkSVMsNTpgLDU6YE9PT08nI0ZgJyNGYE87U08jdE8sNTpgT09PTycjRmEnI0ZhTztfTyZqTyw1OmBPT09PJyNGYicjRmJPO2pPLFVPLDU6YE9PUSRJUycjRmMnI0ZjTzt1USRJW08sNTpkTz5nUSRJW08sNTxrTz9RUSVHbE8sNTxrTz9xUSRJW08sNTxrT09RJElTLDU6eCw1OnhPQFlRJElYTycjRmtPQWlRJElXTyw1O1RPT1EkSVYsNTxpLDU8aU9BdFEkSVtPJyNIV09CXVEkSVdPLDU7a09PUSRJUy1FOXAtRTlwT09RJElWLDU7aiw1O2pPM1BRJElXTycjRXdPT1EkSVQtRTlQLUU5UE9CZVEkSVtPLDU5Wk9EbFEkSVtPLDU5Zk9FVlEkSVdPJyNHYk9FYlEkSVdPJyNHYk8vfFEkSVdPJyNHYk9FbVEkSVdPJyNEUU9FdVEkSVdPLDU5ak9FelEkSVdPJyNHZk8nUlEkSVdPJyNHZk8vZ1EkSVdPLDU9UE9PUSRJUyw1PVAsNT1QTy9nUSRJV08nI0R8T09RJElTJyNEfScjRH1PRmlRJElXTycjRmVPRnlRJElXTyw1OHpPR1hRJElXTyw1OHpPKWVRJElXTyw1OmpPR15RJElbTycjR2hPT1EkSVMsNTptLDU6bU9PUSRJUyw1OnUsNTp1T0dxUSRJV08sNTp5T0hTUSRJV08sNTp7T09RJElTJyNGaCcjRmhPSGJRJElbTyw1OntPSHBRJElXTyw1OntPSHVRJElXTycjSFlPT1EkSVMsNTtPLDU7T09JVFEkSVdPJyNIVk9PUSRJUyw1O1IsNTtSTzNVUSRJV08sNTtWTzNVUSRJV08sNTtZT0lmUSRJW08nI0hbTydSUSRJV08nI0hbT0lwUSRJV08sNTtbTzJyUSRJV08sNTtbTy9nUSRJV08sNTthTy98USRJV08sNTtjT0l1USRJWE8nI0VsT0tPUSRJWk8sNTtdT05hUSRJV08nI0hdTzNVUSRJV08sNTthT05sUSRJV08sNTtjT05xUSRJV08sNTtoTyEjZlEkSVtPMUcuaE8hI21RJElbTzFHLmhPISZeUSRJW08xRy5oTyEmaFEkSVtPMUcuaE8hKVJRJElbTzFHLmhPISlmUSRJW08xRy5oTyEpeVEkSVdPJyNHbk8hKlhRJElbTycjR1FPL2dRJElXTycjR25PISpjUSRJV08nI0dtT09RJElTLDU6WCw1OlhPISprUSRJV08sNTpYTyEqcFEkSVdPJyNHb08hKntRJElXTycjR29PIStgUSRJV08xRy91T09RJElTJyNEcScjRHFPT1EkSVMxRy91MUcvdU9PUSRJUzFHLnkxRy55TyEsYFEkSVtPMUcueU8hLGdRJElbTzFHLnlPMGFRJElXTzFHLnlPIS1TUSRJV08xRy9ST09RJElTJyNEVycjRFdPL2dRJElXTyw1OXFPT1EkSVMxRy53MUcud08hLVpRJElXTzFHL2NPIS1rUSRJV08xRy9jTyEtc1EkSVdPMUcvZE8nUlEkSVdPJyNHZ08hLXhRJElXTycjR2dPIS19USRJW08xRy53TyEuX1EkSVdPLDU5Zk8hL2VRJElXTyw1PVZPIS91USRJV08sNT1WTyEvfVEkSVdPMUcva08hMFNRJElbTzFHL2tPT1EkSVMxRy9oMUcvaE8hMGRRJElXTyw1PVFPITFaUSRJV08sNT1RTy9nUSRJV08xRy9vTyExeFEkSVdPMUcvcU8hMX1RJElbTzFHL3FPITJfUSRJW08xRy9vT09RJElTMUcvbDFHL2xPT1EkSVMxRy9wMUcvcE9PT08tRTlYLUU5WE9PUSRJUzFHL3kxRy95T09PTy1FOVktRTlZTyEyb1EkSVdPJyNHek8vZ1EkSVdPJyNHek8hMn1RJElXTyw1OmFPT09PLUU5Wi1FOVpPT1EkSVMxRy96MUcvek9PT08tRTleLUU5Xk9PT08tRTlfLUU5X09PT08tRTlgLUU5YE9PUSRJUy1FOWEtRTlhTyEzWVElR2xPMUcyVk8hM3lRJElbTzFHMlZPJ1JRJElXTyw1PE9PT1EkSVMsNTxPLDU8T09PUSRJUy1FOWItRTliT09RJElTLDU8Viw1PFZPT1EkSVMtRTlpLUU5aU9PUSRJVjFHMG8xRzBvTy98USRJV08nI0ZnTyE0YlEkSVtPLDU9ck9PUSRJUzFHMVYxRzFWTyE0eVEkSVdPMUcxVk9PUSRJUycjRFMnI0RTTy9nUSRJV08sNTx8T09RJElTLDU8fCw1PHxPITVPUSRJV08nI0ZTTyE1WlEkSVdPLDU5bE8hNWNRJElXTzFHL1VPITVtUSRJW08sNT1RT09RJElTMUcyazFHMmtPT1EkSVMsNTpoLDU6aE8hNl5RJElXTycjR1BPT1EkSVMsNTxQLDU8UE9PUSRJUy1FOWMtRTljTyE2b1EkSVdPMUcuZk9PUSRJUzFHMFUxRzBVTyE2fVEkSVdPLDU9U08hN19RJElXTyw1PVNPL2dRJElXTzFHMGVPL2dRJElXTzFHMGVPL3xRJElXTzFHMGdPT1EkSVMtRTlmLUU5Zk8hN3BRJElXTzFHMGdPITd7USRJV08xRzBnTyE4UVEkSVdPLDU9dE8hOGBRJElXTyw1PXRPIThuUSRJV08sNT1xTyE5VVEkSVdPLDU9cU8hOWdRJElaTzFHMHFPITx1USRJWk8xRzB0TyFAUVEkSVdPLDU9dk8hQFtRJElXTyw1PXZPIUBkUSRJW08sNT12Ty9nUSRJV08xRzB2TyFAblEkSVdPMUcwdk8zVVEkSVdPMUcwe09ObFEkSVdPMUcwfU9PUSRJViw1O1csNTtXTyFAc1EkSVlPLDU7V08hQHhRJElaTzFHMHdPIURaUSRJV08nI0ZvTzNVUSRJV08xRzB3TzNVUSRJV08xRzB3TyFEaFEkSVdPLDU9d08hRHVRJElXTyw1PXdPL3xRJElXTyw1PXdPT1EkSVYxRzB7MUcwe08hRH1RJElXTycjRXlPIUVgUSUxYE8xRzB9T09RJElWMUcxUzFHMVNPM1VRJElXTzFHMVNPT1EkSVMsNT1ZLDU9WU9PUSRJUycjRG4nI0RuTy9nUSRJV08sNT1ZTyFFaFEkSVdPLDU9WE8hRXtRJElXTyw1PVhPT1EkSVMxRy9zMUcvc08hRlRRJElXTyw1PVpPIUZlUSRJV08sNT1aTyFGbVEkSVdPLDU9Wk8hR1FRJElXTyw1PVpPIUdiUSRJV08sNT1aT09RJElTNyslYTcrJWFPT1EkSVM3KyRlNyskZU8hNWNRJElXTzcrJG1PIUlUUSRJV08xRy55TyFJW1EkSVdPMUcueU9PUSRJUzFHL10xRy9dT09RJElTLDU7cCw1O3BPJ1JRJElXTyw1O3BPT1EkSVM3KyR9NyskfU8hSWNRJElXTzcrJH1PT1EkSVMtRTlTLUU5U09PUSRJUzcrJU83KyVPTyFJc1EkSVdPLDU9Uk8nUlEkSVdPLDU9Uk9PUSRJUzcrJGM3KyRjTyFJeFEkSVdPNyskfU8hSlFRJElXTzcrJU9PIUpWUSRJV08xRzJxT09RJElTNyslVjcrJVZPIUpnUSRJV08xRzJxTyFKb1EkSVdPNyslVk9PUSRJUyw1O28sNTtvTydSUSRJV08sNTtvTyFKdFEkSVdPMUcybE9PUSRJUy1FOVItRTlSTyFLa1EkSVdPNyslWk9PUSRJUzcrJV03KyVdTyFLeVEkSVdPMUcybE8hTGhRJElXTzcrJV1PIUxtUSRJV08xRzJyTyFMfVEkSVdPMUcyck8hTVZRJElXTzcrJVpPIU1bUSRJV08sNT1mTyFNclEkSVdPLDU9Zk8hTXJRJElXTyw1PWZPIU5RTyFMUU8nI0R3TyFOXU9TTycjR3tPT09PMUcvezFHL3tPIU5iUSRJV08xRy97TyFOalElR2xPNysncU8jIFpRJElbTzFHMWpQIyB0USRJV08nI0ZkT09RJElTLDU8Uiw1PFJPT1EkSVMtRTllLUU5ZU9PUSRJUzcrJnE3KyZxT09RJElTMUcyaDFHMmhPT1EkSVMsNTtuLDU7bk9PUSRJUy1FOVEtRTlRT09RJElTNyskcDcrJHBPIyFSUSRJV08sNTxrTyMhbFEkSVdPLDU8a08jIX1RJElbTyw1O3FPIyNiUSRJV08xRzJuT09RJElTLUU5VC1FOVRPT1EkSVM3KyZQNysmUE8jI3JRJElXTzcrJlBPT1EkSVM3KyZSNysmUk8jJFFRJElXTycjSFhPL3xRJElXTzcrJlJPIyRmUSRJV083KyZST09RJElTLDU8VSw1PFVPIyRxUSRJV08xRzNgT09RJElTLUU5aC1FOWhPT1EkSVMsNTxRLDU8UU8jJVBRJElXTzFHM11PT1EkSVMtRTlkLUU5ZE8jJWdRJElaTzcrJl1PIURaUSRJV08nI0ZtTzNVUSRJV083KyZdTzNVUSRJV083KyZgTyModVEkSVtPLDU8WU8nUlEkSVdPLDU8WU8jKVBRJElXTzFHM2JPT1EkSVMtRTlsLUU5bE8jKVpRJElXTzFHM2JPM1VRJElXTzcrJmJPL2dRJElXTzcrJmJPT1EkSVY3KyZnNysmZ08hRWBRJTFgTzcrJmlPIyljUSRJWE8xRzByT09RJElWLUU5bS1FOW1PM1VRJElXTzcrJmNPM1VRJElXTzcrJmNPT1EkSVYsNTxaLDU8Wk8jK1VRJElXTyw1PFpPT1EkSVY3KyZjNysmY08jK2FRJElaTzcrJmNPIy5sUSRJV08sNTxbTyMud1EkSVdPMUczY09PUSRJUy1FOW4tRTluTyMvVVEkSVdPMUczY08jL15RJElXTycjSF9PIy9sUSRJV08nI0hfTy98USRJV08nI0hfT09RJElTJyNIXycjSF9PIy93USRJV08nI0heT09RJElTLDU7ZSw1O2VPIzBQUSRJV08sNTtlTy9nUSRJV08nI0V7T09RJElWNysmaTcrJmlPM1VRJElXTzcrJmlPT1EkSVY3KyZuNysmbk9PUSRJUzFHMnQxRzJ0T09RJElTLDU7cyw1O3NPIzBVUSRJV08xRzJzT09RJElTLUU5Vi1FOVZPIzBpUSRJV08sNTt0TyMwdFEkSVdPLDU7dE8jMVhRJElXTzFHMnVPT1EkSVMtRTlXLUU5V08jMWlRJElXTzFHMnVPIzFxUSRJV08xRzJ1TyMyUlEkSVdPMUcydU8jMWlRJElXTzFHMnVPT1EkSVM8PEhYPDxIWE8jMl5RJElbTzFHMVtPT1EkSVM8PEhpPDxIaVAjMmtRJElXTycjRlVPNnxRJElXTzFHMm1PIzJ4USRJV08xRzJtTyMyfVEkSVdPPDxIaU9PUSRJUzw8SGo8PEhqTyMzX1EkSVdPNysoXU9PUSRJUzw8SHE8PEhxTyMzb1EkSVtPMUcxWlAjNGBRJElXTycjRlRPIzRtUSRJV083KyheTyM0fVEkSVdPNysoXk8jNVZRJElXTzw8SHVPIzVbUSRJV083KyhXT09RJElTPDxIdzw8SHdPIzZSUSRJV08sNTtyTydSUSRJV08sNTtyT09RJElTLUU5VS1FOVVPT1EkSVM8PEh1PDxIdU9PUSRJUyw1O3gsNTt4Ty9nUSRJV08sNTt4TyM2V1EkSVdPMUczUU9PUSRJUy1FOVstRTlbTyM2blEkSVdPMUczUU9PT08nI0ZfJyNGX08jNnxPIUxRTyw1OmNPT09PLDU9Zyw1PWdPT09PNyslZzcrJWdPIzdYUSRJV08xRzJWTyM3clEkSVdPMUcyVlAnUlEkSVdPJyNGVk8vZ1EkSVdPPDxJa08jOFRRJElXTyw1PXNPIzhmUSRJV08sNT1zTy98USRJV08sNT1zTyM4d1EkSVdPPDxJbU9PUSRJUzw8SW08PEltTy98USRJV088PEltUC98USRJV08nI0ZqUC9nUSRJV08nI0ZmT09RJElWLUU5ay1FOWtPM1VRJElXTzw8SXdPT1EkSVYsNTxYLDU8WE8zVVEkSVdPLDU8WE9PUSRJVjw8SXc8PEl3T09RJElWPDxJejw8SXpPIzh8USRJW08xRzF0UCM5V1EkSVdPJyNGbk8jOV9RJElXTzcrKHxPIzlpUSRJWk88PEl8TzNVUSRJV088PEl8T09RJElWPDxKVDw8SlRPM1VRJElXTzw8SlRPT1EkSVYnI0ZsJyNGbE8jPHRRJElaTzcrJl5PT1EkSVY8PEl9PDxJfU8jPm1RJElaTzw8SX1PT1EkSVYxRzF1MUcxdU8vfFEkSVdPMUcxdU8zVVEkSVdPPDxJfU8vfFEkSVdPMUcxdlAvZ1EkSVdPJyNGcE8jQXhRJElXTzcrKH1PI0JWUSRJV083Kyh9T09RJElTJyNFeicjRXpPL2dRJElXTyw1PXlPI0JfUSRJV08sNT15T09RJElTLDU9eSw1PXlPI0JqUSRJV08sNT14TyNCe1EkSVdPLDU9eE9PUSRJUzFHMVAxRzFQT09RJElTLDU7Zyw1O2dQI0NUUSRJV08nI0ZYTyNDZVEkSVdPMUcxYE8jQ3hRJElXTzFHMWBPI0RZUSRJV08xRzFgUCNEZVEkSVdPJyNGWU8jRHJRJElXTzcrKGFPI0VTUSRJV083KyhhTyNFU1EkSVdPNysoYU8jRVtRJElXTzcrKGFPI0VsUSRJV083KyhYTzZ8USRJV083KyhYT09RJElTQU4+VEFOPlRPI0ZWUSRJV088PEt4T09RJElTQU4+YUFOPmFPL2dRJElXTzFHMV5PI0ZnUSRJW08xRzFeUCNGcVEkSVdPJyNGV09PUSRJUzFHMWQxRzFkUCNHT1EkSVdPJyNGXk8jR11RJElXTzcrKGxPT09PLUU5XS1FOV1PI0dzUSRJV083KydxT09RJElTQU4/VkFOP1ZPI0heUSRJV08sNTxUTyNIclEkSVdPMUczX09PUSRJUy1FOWctRTlnTyNJVFEkSVdPMUczX09PUSRJU0FOP1hBTj9YTyNJZlEkSVdPQU4/WE9PUSRJVkFOP2NBTj9jT09RJElWMUcxczFHMXNPM1VRJElXT0FOP2hPI0lrUSRJWk9BTj9oT09RJElWQU4/b0FOP29PT1EkSVYtRTlqLUU5ak9PUSRJVjw8SXg8PEl4TzNVUSRJV09BTj9pTzNVUSRJV083KydhT09RJElWQU4/aUFOP2lPT1EkSVM3KydiNysnYk8jTHZRJElXTzw8TGlPT1EkSVMxRzNlMUczZU8vZ1EkSVdPMUczZU9PUSRJUyw1PF0sNTxdTyNNVFEkSVdPMUczZE9PUSRJUy1FOW8tRTlvTyNNZlEkSVdPNysmek8jTXZRJElXTzcrJnpPT1EkSVM3KyZ6Nysmek8jTlJRJElXTzw8S3tPI05jUSRJV088PEt7TyNOY1EkSVdPPDxLe08jTmtRJElXTycjR2lPT1EkSVM8PEtzPDxLc08jTnVRJElXTzw8S3NPT1EkSVM3KyZ4NysmeE8vfFEkSVdPMUcxb1AvfFEkSVdPJyNGaU8kIGBRJElXTzcrKHlPJCBxUSRJV083Kyh5T09RJElTRzI0c0cyNHNPT1EkSVZHMjVTRzI1U08zVVEkSVdPRzI1U09PUSRJVkcyNVRHMjVUT09RJElWPDxKezw8SntPT1EkSVM3KylQNyspUFAkIVNRJElXTycjRnFPT1EkSVM8PEpmPDxKZk8kIWJRJElXTzw8SmZPJCFyUSRJV09BTkFnTyQjU1EkSVdPQU5BZ08kI1tRJElXTycjR2pPT1EkSVMnI0dqJyNHak8waFEkSVdPJyNEYU8kI3VRJElXTyw1PVRPT1EkSVNBTkFfQU5BX09PUSRJUzcrJ1o3KydaTyQkXlEkSVdPPDxMZU9PUSRJVkxEKm5MRCpuT09RJElTQU5AUUFOQFFPJCRvUSRJV09HMjdSTyQlUFEkSVdPLDU5e09PUSRJUzFHMm8xRzJvTyNOa1EkSVdPMUcvZ09PUSRJUzcrJVI3KyVSTzZ8USRJV08nI0N6TzZ8USRJV08sNTlfTzZ8USRJV08sNTlfTzZ8USRJV08sNTlfTyQlVVEkSVtPLDU8a082fFEkSVdPMUcueU8vZ1EkSVdPMUcvVU8vZ1EkSVdPNyskbVAkJWlRJElXTycjRmRPJ1JRJElXTycjR1BPJCV2USRJV08sNTlfTyQle1EkSVdPLDU5X08kJlNRJElXTyw1OWpPJCZYUSRJV08xRy9STzBoUSRJV08nI0RPTzZ8USRJV08sNTlnXCIsXG4gIHN0YXRlRGF0YTogXCIkJm9+TyRvT1MkbE9TJGtPU1FPU35PUGhPVGVPZHNPZlhPbHRPcCFTT3N1T3x2T30hUE8hUiFWTyFTIVVPIVZZTyFaWk8hZmRPIW1kTyFuZE8hb2RPIXZ4TyF4eU8henpPIXx7TyNPfE8jU31PI1UhT08jWCFRTyNZIVFPI1shUk8jYyFUTyNmIVdPI2ohWE8jbCFZTyNxIVpPI3RsTyRqcU8kelFPJHtRTyVQUk8lUVZPJWVbTyVmXU8laV5PJWxfTyVyYE8ldWFPJXdiT35PVCFhT10hYU9fIWJPZiFpTyFWIWtPIWQhbE8kdSFbTyR2IV1PJHchXk8keCFfTyR5IV9PJHohYE8keyFgTyR8IWFPJH0hYU8lTyFhT35PaCVUWGklVFhqJVRYayVUWGwlVFhtJVRYcCVUWHclVFh4JVRYIXMlVFgjXiVUWCRqJVRYJG0lVFglViVUWCFPJVRYIVIlVFghUyVUWCVXJVRYIVclVFghWyVUWH0lVFgjViVUWHElVFghaiVUWH5QJF9PZHNPZlhPIVZZTyFaWk8hZmRPIW1kTyFuZE8hb2RPJHpRTyR7UU8lUFJPJVFWTyVlW08lZl1PJWleTyVsX08lcmBPJXVhTyV3Yk9+T3clU1h4JVNYI14lU1gkaiVTWCRtJVNYJVYlU1h+T2ghb09pIXBPaiFuT2shbk9sIXFPbSFyT3Ahc08hcyVTWH5QKGBPVCF5T2wtZk9zLXRPfHZPflAnUk9UIXxPbC1mT3MtdE8hVyF9T35QJ1JPVCNRT18jUk9sLWZPcy10TyFbI1NPflAnUk8lZyNWTyVoI1hPfk8laiNZTyVrI1hPfk8hWiNbTyVtI11PJXEjX09+TyFaI1tPJXMjYE8ldCNfT35PIVojW08laCNfTyV2I2JPfk8hWiNbTyVrI19PJXgjZE9+T1QkdFhdJHRYXyR0WGYkdFhoJHRYaSR0WGokdFhrJHRYbCR0WG0kdFhwJHRYdyR0WCFWJHRYIWQkdFgkdSR0WCR2JHRYJHckdFgkeCR0WCR5JHRYJHokdFgkeyR0WCR8JHRYJH0kdFglTyR0WCFPJHRYIVIkdFghUyR0WH5PJWVbTyVmXU8laV5PJWxfTyVyYE8ldWFPJXdiT3gkdFghcyR0WCNeJHRYJGokdFgkbSR0WCVWJHRYJVckdFghVyR0WCFbJHRYfSR0WCNWJHRYcSR0WCFqJHRYflArdU93I2lPeCRzWCFzJHNYI14kc1gkaiRzWCRtJHNYJVYkc1h+T2wtZk9zLXRPflAnUk8jXiNsTyRqI25PJG0jbk9+TyVRVk9+TyFSI3NPI2whWU8jcSFaTyN0bE9+T2x0T35QJ1JPVCN4T18jeU8lUVZPeHRQfk9UI31PbC1mT3MtdE99JE9PflAnUk94JFFPIXMkVk8lViRSTyNeIXRYJGohdFgkbSF0WH5PVCN9T2wtZk9zLXRPI14hfVgkaiF9WCRtIX1YflAnUk9sLWZPcy10TyNeI1JYJGojUlgkbSNSWH5QJ1JPIWQkXU8hbSRdTyVRVk9+T1QkZ09+UCdSTyFTJGlPI2okak8jbCRrT35PeCRsT35PVCR6T18kek9sLWZPcy10TyFPJHxPflAnUk9sLWZPcy10T3glUE9+UCdSTyVkJVJPfk9fIWJPZiFpTyFWIWtPIWQhbE9UYGFdYGFoYGFpYGFqYGFrYGFsYGFtYGFwYGF3YGF4YGEhc2BhI15gYSRqYGEkbWBhJHVgYSR2YGEkd2BhJHhgYSR5YGEkemBhJHtgYSR8YGEkfWBhJU9gYSVWYGEhT2BhIVJgYSFTYGElV2BhIVdgYSFbYGF9YGEjVmBhcWBhIWpgYX5PayVXT35PbCVXT35QJ1JPbC1mT35QJ1JPaC1oT2ktaU9qLWdPay1nT2wtcE9tLXFPcC11TyFPJVNYIVIlU1ghUyVTWCVXJVNYIVclU1ghWyVTWH0lU1gjViVTWCFqJVNYflAoYE8lVyVZT3clUlghTyVSWCFSJVJYIVMlUlghVyVSWHglUlh+T3clXU8hTyVbTyFSJWFPIVMlYE9+TyFPJVtPfk93JWRPIVIlYU8hUyVgTyFXJV9Yfk8hVyVoT35PdyVpT3gla08hUiVhTyFTJWBPIVslWVh+TyFbJW9Pfk8hWyVwT35PJWcjVk8laCVyT35PJWojWU8layVyT35PVCV1T2wtZk9zLXRPfHZPflAnUk8hWiNbTyVtI11PJXEleE9+TyFaI1tPJXMjYE8ldCV4T35PIVojW08laCV4TyV2I2JPfk8hWiNbTyVrJXhPJXgjZE9+T1QhbGFdIWxhXyFsYWYhbGFoIWxhaSFsYWohbGFrIWxhbCFsYW0hbGFwIWxhdyFsYXghbGEhViFsYSFkIWxhIXMhbGEjXiFsYSRqIWxhJG0hbGEkdSFsYSR2IWxhJHchbGEkeCFsYSR5IWxhJHohbGEkeyFsYSR8IWxhJH0hbGElTyFsYSVWIWxhIU8hbGEhUiFsYSFTIWxhJVchbGEhVyFsYSFbIWxhfSFsYSNWIWxhcSFsYSFqIWxhflAjdk93JX1PeCRzYSFzJHNhI14kc2EkaiRzYSRtJHNhJVYkc2F+UCRfT1QmUE9sdE9zdU94JHNhIXMkc2EjXiRzYSRqJHNhJG0kc2ElViRzYX5QJ1JPdyV9T3gkc2EhcyRzYSNeJHNhJGokc2EkbSRzYSVWJHNhfk9QaE9UZU9sdE9zdU98dk99IVBPIXZ4TyF4eU8henpPIXx7TyNPfE8jU31PI1UhT08jWCFRTyNZIVFPI1shUk8jXiRfWCRqJF9YJG0kX1h+UCdSTyNeI2xPJGomVU8kbSZVT35PIWQmVk9mJXpYJGolelgjViV6WCNeJXpYJG0lelgjVSV6WH5PZiFpTyRqJlhPfk9oY2FpY2FqY2FrY2FsY2FtY2FwY2F3Y2F4Y2Ehc2NhI15jYSRqY2EkbWNhJVZjYSFPY2EhUmNhIVNjYSVXY2EhV2NhIVtjYX1jYSNWY2FxY2EhamNhflAkX09wbmF3bmF4bmEjXm5hJGpuYSRtbmElVm5hfk9oIW9PaSFwT2ohbk9rIW5PbCFxT20hck8hc25hflBEVE8lViZaT3clVVh4JVVYfk8lUVZPdyVVWHglVVh+T3cmXk94dFh+T3gmYE9+T3claU8jXiVZWCRqJVlYJG0lWVghTyVZWHglWVghWyVZWCFqJVlYJVYlWVh+T1Qtb09sLWZPcy10T3x2T35QJ1JPJVYkUk8jXlNhJGpTYSRtU2F+TyVWJFJPfk93JmlPI14lW1gkaiVbWCRtJVtYayVbWH5QJF9PdyZsT30ma08jXiNSYSRqI1JhJG0jUmF+TyNWJm1PI14jVGEkaiNUYSRtI1Rhfk8hZCRdTyFtJF1PI1Umb08lUVZPfk8jVSZvT35PdyZxTyNeJXxYJGolfFgkbSV8WH5PdyZzTyNeJXlYJGoleVgkbSV5WHgleVh+T3cmd09rJk9YflAkX09rJnpPfk9QaE9UZU9sdE9zdU98dk99IVBPIXZ4TyF4eU8henpPIXx7TyNPfE8jU31PI1UhT08jWCFRTyNZIVFPI1shUk8kaidQT35QJ1JPcSdUTyNnJ1JPI2gnU09QI2VhVCNlYWQjZWFmI2VhbCNlYXAjZWFzI2VhfCNlYX0jZWEhUiNlYSFTI2VhIVYjZWEhWiNlYSFmI2VhIW0jZWEhbiNlYSFvI2VhIXYjZWEheCNlYSF6I2VhIXwjZWEjTyNlYSNTI2VhI1UjZWEjWCNlYSNZI2VhI1sjZWEjYyNlYSNmI2VhI2ojZWEjbCNlYSNxI2VhI3QjZWEkZyNlYSRqI2VhJHojZWEkeyNlYSVQI2VhJVEjZWElZSNlYSVmI2VhJWkjZWElbCNlYSVyI2VhJXUjZWEldyNlYSRpI2VhJG0jZWF+T3cnVU8jVidXT3gmUFh+T2YnWU9+T2YhaU94JGxPfk9UIWFPXSFhT18hYk9mIWlPIVYha08hZCFsTyR3IV5PJHghX08keSFfTyR6IWBPJHshYE8kfCFhTyR9IWFPJU8hYU9oVWlpVWlqVWlrVWlsVWltVWlwVWl3VWl4VWkhc1VpI15VaSRqVWkkbVVpJHVVaSVWVWkhT1VpIVJVaSFTVWklV1VpIVdVaSFbVWl9VWkjVlVpcVVpIWpVaX5PJHYhXU9+UE55TyR2VWl+UE55T1QhYU9dIWFPXyFiT2YhaU8hViFrTyFkIWxPJHohYE8keyFgTyR8IWFPJH0hYU8lTyFhT2hVaWlVaWpVaWtVaWxVaW1VaXBVaXdVaXhVaSFzVWkjXlVpJGpVaSRtVWkkdVVpJHZVaSR3VWklVlVpIU9VaSFSVWkhU1VpJVdVaSFXVWkhW1VpfVVpI1ZVaXFVaSFqVWl+TyR4IV9PJHkhX09+UCEjdE8keFVpJHlVaX5QISN0T18hYk9mIWlPIVYha08hZCFsT2hVaWlVaWpVaWtVaWxVaW1VaXBVaXdVaXhVaSFzVWkjXlVpJGpVaSRtVWkkdVVpJHZVaSR3VWkkeFVpJHlVaSR6VWkke1VpJVZVaSFPVWkhUlVpIVNVaSVXVWkhV1VpIVtVaX1VaSNWVWlxVWkhalVpfk9UIWFPXSFhTyR8IWFPJH0hYU8lTyFhT35QISZyT1RVaV1VaSR8VWkkfVVpJU9VaX5QISZyTyFSJWFPIVMlYE93JWJYIU8lYlh+TyVWJ19PJVcnX09+UCt1T3cnYU8hTyVhWH5PIU8nY09+T3cnZE94J2ZPIVclY1h+T2wtZk9zLXRPdydkT3gnZ08hVyVjWH5QJ1JPIVcnaU9+T2ohbk9rIW5PbCFxT20hck9oZ2lwZ2l3Z2l4Z2khc2dpI15naSRqZ2kkbWdpJVZnaX5PaSFwT35QIStlT2lnaX5QIStlT2gtaE9pLWlPai1nT2stZ09sLXBPbS1xT35PcSdrT35QISxuT1QncE9sLWZPcy10TyFPJ3FPflAnUk93J3JPIU8ncU9+TyFPJ3RPfk8hUyd2T35PdydyTyFPJ3dPIVIlYU8hUyVgT35QJF9PaC1oT2ktaU9qLWdPay1nT2wtcE9tLXFPIU9uYSFSbmEhU25hJVduYSFXbmEhW25hfW5hI1ZuYXFuYSFqbmF+UERUT1QncE9sLWZPcy10TyFXJV9hflAnUk93J3pPIVclX2F+TyFXJ3tPfk93J3pPIVIlYU8hUyVgTyFXJV9hflAkX09UKFBPbC1mT3MtdE8hWyVZYSNeJVlhJGolWWEkbSVZYSFPJVlheCVZYSFqJVlhJVYlWWF+UCdST3coUU8hWyVZYSNeJVlhJGolWWEkbSVZYSFPJVlheCVZYSFqJVlhJVYlWWF+TyFbKFRPfk93KFFPIVIlYU8hUyVgTyFbJVlhflAkX093KFdPIVIlYU8hUyVgTyFbJWBhflAkX093KFpPeCVuWCFbJW5YIWolblh+T3goXk8hWyhgTyFqKGFPfk9UJlBPbHRPc3VPeCRzaSFzJHNpI14kc2kkaiRzaSRtJHNpJVYkc2l+UCdST3coYk94JHNpIXMkc2kjXiRzaSRqJHNpJG0kc2klViRzaX5PIWQmVk9mJXphJGolemEjViV6YSNeJXphJG0lemEjVSV6YX5PJGooZ09+T1QjeE9fI3lPJVFWT35PdyZeT3h0YX5PbHRPc3VPflAnUk93KFFPI14lWWEkaiVZYSRtJVlhIU8lWWF4JVlhIVslWWEhaiVZYSVWJVlhflAkX093KGxPI14kc1gkaiRzWCRtJHNYJVYkc1h+TyVWJFJPI15TaSRqU2kkbVNpfk8jXiVbYSRqJVthJG0lW2FrJVthflAnUk93KG9PI14lW2EkaiVbYSRtJVthayVbYX5PVChzT2YodU8lUVZPfk8jVSh2T35PJVFWTyNeJXxhJGolfGEkbSV8YX5Pdyh4TyNeJXxhJGolfGEkbSV8YX5PbC1mT3MtdE8jXiV5YSRqJXlhJG0leWF4JXlhflAnUk93KHtPI14leWEkaiV5YSRtJXlheCV5YX5PcSlQTyNhKU9PUCNfaVQjX2lkI19pZiNfaWwjX2lwI19pcyNfaXwjX2l9I19pIVIjX2khUyNfaSFWI19pIVojX2khZiNfaSFtI19pIW4jX2khbyNfaSF2I19pIXgjX2kheiNfaSF8I19pI08jX2kjUyNfaSNVI19pI1gjX2kjWSNfaSNbI19pI2MjX2kjZiNfaSNqI19pI2wjX2kjcSNfaSN0I19pJGcjX2kkaiNfaSR6I19pJHsjX2klUCNfaSVRI19pJWUjX2klZiNfaSVpI19pJWwjX2klciNfaSV1I19pJXcjX2kkaSNfaSRtI19pfk9xKVFPUCNiaVQjYmlkI2JpZiNiaWwjYmlwI2JpcyNiaXwjYml9I2JpIVIjYmkhUyNiaSFWI2JpIVojYmkhZiNiaSFtI2JpIW4jYmkhbyNiaSF2I2JpIXgjYmkheiNiaSF8I2JpI08jYmkjUyNiaSNVI2JpI1gjYmkjWSNiaSNbI2JpI2MjYmkjZiNiaSNqI2JpI2wjYmkjcSNiaSN0I2JpJGcjYmkkaiNiaSR6I2JpJHsjYmklUCNiaSVRI2JpJWUjYmklZiNiaSVpI2JpJWwjYmklciNiaSV1I2JpJXcjYmkkaSNiaSRtI2Jpfk9UKVNPayZPYX5QJ1JPdylUT2smT2F+T3cpVE9rJk9hflAkX09rKVhPfk8kaClbT35PcSlfTyNnJ1JPI2gpXk9QI2VpVCNlaWQjZWlmI2VpbCNlaXAjZWlzI2VpfCNlaX0jZWkhUiNlaSFTI2VpIVYjZWkhWiNlaSFmI2VpIW0jZWkhbiNlaSFvI2VpIXYjZWkheCNlaSF6I2VpIXwjZWkjTyNlaSNTI2VpI1UjZWkjWCNlaSNZI2VpI1sjZWkjYyNlaSNmI2VpI2ojZWkjbCNlaSNxI2VpI3QjZWkkZyNlaSRqI2VpJHojZWkkeyNlaSVQI2VpJVEjZWklZSNlaSVmI2VpJWkjZWklbCNlaSVyI2VpJXUjZWkldyNlaSRpI2VpJG0jZWl+T2wtZk9zLXRPeCRsT35QJ1JPbC1mT3MtdE94JlBhflAnUk93KWVPeCZQYX5PVClpT18pak8hTyltTyR8KWtPJVFWT35PeCRsTyZTKW9Pfk9UJHpPXyR6T2wtZk9zLXRPIU8lYWF+UCdST3cpdU8hTyVhYX5PbC1mT3MtdE94KXhPIVclY2F+UCdST3cpeU8hVyVjYX5PbC1mT3MtdE93KXlPeCl8TyFXJWNhflAnUk9sLWZPcy10T3cpeU8hVyVjYX5QJ1JPdyl5T3gpfE8hVyVjYX5Pai1nT2stZ09sLXBPbS1xT2hnaXBnaXdnaSFPZ2khUmdpIVNnaSVXZ2khV2dpeGdpIVtnaSNeZ2kkamdpJG1naX1naSNWZ2lxZ2khamdpJVZnaX5PaS1pT35QIUdtT2lnaX5QIUdtT1QncE9sLWZPcy10TyFPKlJPflAnUk9rKlRPfk93KlZPIU8qUk9+TyFPKldPfk9UJ3BPbC1mT3MtdE8hVyVfaX5QJ1JPdypYTyFXJV9pfk8hVypZT35PVChQT2wtZk9zLXRPIVslWWkjXiVZaSRqJVlpJG0lWWkhTyVZaXglWWkhaiVZaSVWJVlpflAnUk93Kl1PIVIlYU8hUyVgTyFbJWBpfk93KmBPIVslWWkjXiVZaSRqJVlpJG0lWWkhTyVZaXglWWkhaiVZaSVWJVlpfk8hWyphT35PXypjT2wtZk9zLXRPIVslYGl+UCdST3cqXU8hWyVgaX5PIVsqZU9+T1QqZ09sLWZPcy10T3glbmEhWyVuYSFqJW5hflAnUk93KmhPeCVuYSFbJW5hIWolbmF+TyFaI1tPJXAqa08hWyFrWH5PIVsqbU9+T3goXk8hWypuT35PVCZQT2x0T3N1T3gkc3EhcyRzcSNeJHNxJGokc3EkbSRzcSVWJHNxflAnUk93JFdpeCRXaSFzJFdpI14kV2kkaiRXaSRtJFdpJVYkV2l+UCRfT1QmUE9sdE9zdU9+UCdST1QmUE9sLWZPcy10TyNeJHNhJGokc2EkbSRzYSVWJHNhflAnUk93Km9PI14kc2EkaiRzYSRtJHNhJVYkc2F+T3cjeWEjXiN5YSRqI3lhJG0jeWFrI3lhflAkX08jXiVbaSRqJVtpJG0lW2lrJVtpflAnUk93KnJPI14jUnEkaiNScSRtI1Jxfk93KnNPI1YqdU8jXiV7WCRqJXtYJG0le1ghTyV7WH5PVCp3T2YqeE8lUVZPfk8lUVZPI14lfGkkaiV8aSRtJXxpfk9sLWZPcy10TyNeJXlpJGoleWkkbSV5aXgleWl+UCdST3EqfE8jYSlPT1AjX3FUI19xZCNfcWYjX3FsI19xcCNfcXMjX3F8I19xfSNfcSFSI19xIVMjX3EhViNfcSFaI19xIWYjX3EhbSNfcSFuI19xIW8jX3EhdiNfcSF4I19xIXojX3EhfCNfcSNPI19xI1MjX3EjVSNfcSNYI19xI1kjX3EjWyNfcSNjI19xI2YjX3EjaiNfcSNsI19xI3EjX3EjdCNfcSRnI19xJGojX3EkeiNfcSR7I19xJVAjX3ElUSNfcSVlI19xJWYjX3ElaSNfcSVsI19xJXIjX3EldSNfcSV3I19xJGkjX3EkbSNfcX5PayRiYXckYmF+UCRfT1QpU09rJk9pflAnUk93K1RPayZPaX5PUGhPVGVPbHRPcCFTT3N1T3x2T30hUE8hUiFWTyFTIVVPIXZ4TyF4eU8henpPIXx7TyNPfE8jU31PI1UhT08jWCFRTyNZIVFPI1shUk8jYyFUTyNmIVdPI2ohWE8jbCFZTyNxIVpPI3RsT35QJ1JPdytfT3gkbE8jVitfT35PI2grYE9QI2VxVCNlcWQjZXFmI2VxbCNlcXAjZXFzI2VxfCNlcX0jZXEhUiNlcSFTI2VxIVYjZXEhWiNlcSFmI2VxIW0jZXEhbiNlcSFvI2VxIXYjZXEheCNlcSF6I2VxIXwjZXEjTyNlcSNTI2VxI1UjZXEjWCNlcSNZI2VxI1sjZXEjYyNlcSNmI2VxI2ojZXEjbCNlcSNxI2VxI3QjZXEkZyNlcSRqI2VxJHojZXEkeyNlcSVQI2VxJVEjZXElZSNlcSVmI2VxJWkjZXElbCNlcSVyI2VxJXUjZXEldyNlcSRpI2VxJG0jZXF+TyNWK2FPdyRkYXgkZGF+T2wtZk9zLXRPeCZQaX5QJ1JPdytjT3gmUGl+T3gkUU8lVitlT3cmUlghTyZSWH5PJVFWT3cmUlghTyZSWH5PdytpTyFPJlFYfk8hTytrT35PVCR6T18kek9sLWZPcy10TyFPJWFpflAnUk94K25PdyN8YSFXI3xhfk9sLWZPcy10T3grb093I3xhIVcjfGF+UCdST2wtZk9zLXRPeCl4TyFXJWNpflAnUk93K3JPIVclY2l+T2wtZk9zLXRPdytyTyFXJWNpflAnUk93K3JPeCt1TyFXJWNpfk93I3hpIU8jeGkhVyN4aX5QJF9PVCdwT2wtZk9zLXRPflAnUk9rK3dPfk9UJ3BPbC1mT3MtdE8hTyt4T35QJ1JPVCdwT2wtZk9zLXRPIVclX3F+UCdST3cjd2khWyN3aSNeI3dpJGojd2kkbSN3aSFPI3dpeCN3aSFqI3dpJVYjd2l+UCRfT1QoUE9sLWZPcy10T35QJ1JPXypjT2wtZk9zLXRPIVslYHF+UCdST3creU8hWyVgcX5PIVsrek9+T1QoUE9sLWZPcy10TyFbJVlxI14lWXEkaiVZcSRtJVlxIU8lWXF4JVlxIWolWXElViVZcX5QJ1JPeCt7T35PVCpnT2wtZk9zLXRPeCVuaSFbJW5pIWolbml+UCdST3csUU94JW5pIVslbmkhaiVuaX5PIVojW08lcCprTyFbIWthfk9UJlBPbC1mT3MtdE8jXiRzaSRqJHNpJG0kc2klViRzaX5QJ1JPdyxTTyNeJHNpJGokc2kkbSRzaSVWJHNpfk8lUVZPI14le2EkaiV7YSRtJXthIU8le2F+T3csVk8jXiV7YSRqJXthJG0le2EhTyV7YX5PIU8sWU9+T2skYml3JGJpflAkX09UKVNPflAnUk9UKVNPayZPcX5QJ1JPcSxeT1AjZHlUI2R5ZCNkeWYjZHlsI2R5cCNkeXMjZHl8I2R5fSNkeSFSI2R5IVMjZHkhViNkeSFaI2R5IWYjZHkhbSNkeSFuI2R5IW8jZHkhdiNkeSF4I2R5IXojZHkhfCNkeSNPI2R5I1MjZHkjVSNkeSNYI2R5I1kjZHkjWyNkeSNjI2R5I2YjZHkjaiNkeSNsI2R5I3EjZHkjdCNkeSRnI2R5JGojZHkkeiNkeSR7I2R5JVAjZHklUSNkeSVlI2R5JWYjZHklaSNkeSVsI2R5JXIjZHkldSNkeSV3I2R5JGkjZHkkbSNkeX5PUGhPVGVPbHRPcCFTT3N1T3x2T30hUE8hUiFWTyFTIVVPIXZ4TyF4eU8henpPIXx7TyNPfE8jU31PI1UhT08jWCFRTyNZIVFPI1shUk8jYyFUTyNmIVdPI2ohWE8jbCFZTyNxIVpPI3RsTyRpLGJPJG0sYk9+UCdSTyNoLGNPUCNleVQjZXlkI2V5ZiNleWwjZXlwI2V5cyNleXwjZXl9I2V5IVIjZXkhUyNleSFWI2V5IVojZXkhZiNleSFtI2V5IW4jZXkhbyNleSF2I2V5IXgjZXkheiNleSF8I2V5I08jZXkjUyNleSNVI2V5I1gjZXkjWSNleSNbI2V5I2MjZXkjZiNleSNqI2V5I2wjZXkjcSNleSN0I2V5JGcjZXkkaiNleSR6I2V5JHsjZXklUCNleSVRI2V5JWUjZXklZiNleSVpI2V5JWwjZXklciNleSV1I2V5JXcjZXkkaSNleSRtI2V5fk9sLWZPcy10T3gmUHF+UCdST3csZ094JlBxfk8lVitlT3cmUmEhTyZSYX5PVClpT18pak8kfClrTyVRVk8hTyZRYX5PdyxrTyFPJlFhfk9UJHpPXyR6T2wtZk9zLXRPflAnUk9sLWZPcy10T3gsbU93I3xpIVcjfGl+UCdST2wtZk9zLXRPdyN8aSFXI3xpflAnUk94LG1PdyN8aSFXI3xpfk9sLWZPcy10T3gpeE9+UCdST2wtZk9zLXRPeCl4TyFXJWNxflAnUk93LHBPIVclY3F+T2wtZk9zLXRPdyxwTyFXJWNxflAnUk9wLHNPIVIlYU8hUyVgTyFPJVpxIVclWnEhWyVacXclWnF+UCEsbk9fKmNPbC1mT3MtdE8hWyVgeX5QJ1JPdyN6aSFbI3ppflAkX09fKmNPbC1mT3MtdE9+UCdST1QqZ09sLWZPcy10T35QJ1JPVCpnT2wtZk9zLXRPeCVucSFbJW5xIWolbnF+UCdST1QmUE9sLWZPcy10TyNeJHNxJGokc3EkbSRzcSVWJHNxflAnUk8jVix3T3ckXWEjXiRdYSRqJF1hJG0kXWEhTyRdYX5PJVFWTyNeJXtpJGole2kkbSV7aSFPJXtpfk93LHlPI14le2kkaiV7aSRtJXtpIU8le2l+TyFPLHtPfk9xLH1PUCNkIVJUI2QhUmQjZCFSZiNkIVJsI2QhUnAjZCFScyNkIVJ8I2QhUn0jZCFSIVIjZCFSIVMjZCFSIVYjZCFSIVojZCFSIWYjZCFSIW0jZCFSIW4jZCFSIW8jZCFSIXYjZCFSIXgjZCFSIXojZCFSIXwjZCFSI08jZCFSI1MjZCFSI1UjZCFSI1gjZCFSI1kjZCFSI1sjZCFSI2MjZCFSI2YjZCFSI2ojZCFSI2wjZCFSI3EjZCFSI3QjZCFSJGcjZCFSJGojZCFSJHojZCFSJHsjZCFSJVAjZCFSJVEjZCFSJWUjZCFSJWYjZCFSJWkjZCFSJWwjZCFSJXIjZCFSJXUjZCFSJXcjZCFSJGkjZCFSJG0jZCFSfk9sLWZPcy10T3gmUHl+UCdST1QpaU9fKWpPJHwpa08lUVZPIU8mUWl+T2wtZk9zLXRPdyN8cSFXI3xxflAnUk94LVRPdyN8cSFXI3xxfk9sLWZPcy10T3gpeE8hVyVjeX5QJ1JPdy1VTyFXJWN5fk9sLWZPcy1ZT35QJ1JPcCxzTyFSJWFPIVMlYE8hTyVaeSFXJVp5IVslWnl3JVp5flAhLG5PJVFWTyNeJXtxJGole3EkbSV7cSFPJXtxfk93LV5PI14le3EkaiV7cSRtJXtxIU8le3F+T1QpaU9fKWpPJHwpa08lUVZPfk9sLWZPcy10T3cjfHkhVyN8eX5QJ1JPbC1mT3MtdE94KXhPIVclYyFSflAnUk93LWFPIVclYyFSfk9wJV5YIU8lXlghUiVeWCFTJV5YIVclXlghWyVeWHclXlh+UCEsbk9wLHNPIVIlYU8hUyVgTyFPJV1hIVclXWEhWyVdYXclXWF+TyVRVk8jXiV7eSRqJXt5JG0le3khTyV7eX5PbC1mT3MtdE94KXhPIVclYyFaflAnUk94LWRPfk93Km9PI14kc2EkaiRzYSRtJHNhJVYkc2F+UCRfT1QmUE9sLWZPcy10T35QJ1JPay1rT35PbC1rT35QJ1JPeC1sT35PcS1tT35QISxuTyVmJWkldSV3JWUhWiVtJXMldiV4JWwlciVsJVF+XCIsXG4gIGdvdG86IFwiISx1JlNQUFBQJlRQJl0pbipUKmsrUytsLFZQLHFQJl0tXy1fJl1QJl1QMHBQUFBQUFAwcDNgUFAzYFA1bDV1OnlQUDp8O1s7X1BQUCZdJl1QUDtrJl1QUCZdJl1QUCZdJl0mXSZdO288YyZdUDxmUDxpPGlAT1BAZCZdUFBQQGhAbiZUUCZUJlRQJlRQJlRQJlRQJlRQJlQmVCZUUCZUUFAmVFBQJlRQQHRQQHtBUlBAe1BAe0B7UFBQQHtQQnpQQ1RDWkNhQnpQQHtDZ1BDbkN0Q3pEV0RqRHBEekVRRW5FdEV6RlFGW0ZiRmhGbkZ0RnpHXkdoR25HdEd6SFVIW0hiSGhIbkh4SU9JWUlgUFBQUFBQUFBQSWlJcUl6SlVKYVBQUFBQUFBQUFBQUE52ISBgISVuISh6UFAhKVMhKWIhKWshKmEhKlchKmohKnAhKnMhKnYhKnkhK1JQUFBQUFBQUFBQIStVIStYUFBQUFBQUFBQIStfIStrISt3ISxUISxXISxeISxkISxqISxtXWlPciNsJGwpWytaJ29kT1NYWVplaHJzdHZ4fH0hUiFTIVQhVSFYIWMhZCFlIWYhZyFoIWkhayFuIW8hcCFyIXMheSF8I1EjUiNbI2kjbCN9JE8kUSRTJFYkZyRpJGokbCR6JVAlVyVaJV0lYCVkJWklayV1JX0mUCZbJmAmaSZrJmwmcyZ3JnonUidVJ2AnYSdkJ2YnZydrJ3Ancid2J3ooUChRKFcoWihiKGQobChvKHspTylTKVQpWClbKWUpbyl1KXgpeSl8KlMqVCpWKlgqWypdKmAqYypnKmgqbypxKnIqeitTK1QrWitiK2MrZittK24rbytxK3IrdSt3K3kreyt9LFAsUSxTLGcsaSxtLHAscy1ULVUtYS1kLWYtZy1oLWktay1sLW0tbi1vLXEtdXchY1AjaCN1JFckZiViJWclbSVuJmEmeShjKG4pUipRKlorUit8LWp5IWRQI2gjdSRXJGYkciViJWclbSVuJmEmeShjKG4pUipRKlorUit8LWp7IWVQI2gjdSRXJGYkciRzJWIlZyVtJW4mYSZ5KGMobilSKlEqWitSK3wtan0hZlAjaCN1JFckZiRyJHMkdCViJWclbSVuJmEmeShjKG4pUipRKlorUit8LWohUCFnUCNoI3UkVyRmJHIkcyR0JHUlYiVnJW0lbiZhJnkoYyhuKVIqUSpaK1IrfC1qIVIhaFAjaCN1JFckZiRyJHMkdCR1JHYlYiVnJW0lbiZhJnkoYyhuKVIqUSpaK1IrfC1qIVYhaFAhbSNoI3UkVyRmJHIkcyR0JHUkdiR3JWIlZyVtJW4mYSZ5KGMobilSKlEqWitSK3wtaidvU09TWFlaZWhyc3R2eHx9IVIhUyFUIVUhWCFjIWQhZSFmIWchaCFpIWshbiFvIXAhciFzIXkhfCNRI1IjWyNpI2wjfSRPJFEkUyRWJGckaSRqJGwkeiVQJVclWiVdJWAlZCVpJWsldSV9JlAmWyZgJmkmayZsJnMmdyZ6J1InVSdgJ2EnZCdmJ2cnaydwJ3Indid6KFAoUShXKFooYihkKGwobyh7KU8pUylUKVgpWyllKW8pdSl4KXkpfCpTKlQqVipYKlsqXSpgKmMqZypoKm8qcSpyKnorUytUK1orYitjK2YrbStuK28rcStyK3Urdyt5K3srfSxQLFEsUyxnLGksbSxwLHMtVC1VLWEtZC1mLWctaC1pLWstbC1tLW4tby1xLXUmWlVPWFlaaHJ0dnx9IVIhUyFUIVghaSFrIW4hbyFwIXIhcyNbI2kjbCRPJFEkUyRWJGokbCR6JVAlVyVaJV0lZCVpJWsldSV9JlsmYCZrJmwmcyZ6J1InVSdgJ2EnZCdmJ2cnaydyJ3ooUShXKFooYihkKGwoeylPKVgpWyllKW8pdSl4KXkpfCpTKlQqVipYKlsqXSpgKmcqaCpvKnIqeitaK2IrYytmK20rbitvK3Ercit1K3creSt7K30sUCxRLFMsZyxpLG0scCxzLVQtVS1hLWQtZi1nLWgtaS1rLWwtbS1uLXEtdSVlV09YWVpocnZ8fSFSIVMhVCFYIWkhayNbI2kjbCRPJFEkUyRWJGokbCR6JVAlWiVdJWQlaSVrJXUlfSZbJmAmayZsJnMmeidSJ1UnYCdhJ2QnZidnJ2sncid6KFEoVyhaKGIoZChsKHspTylYKVspZSlvKXUpeCl5KXwqUypWKlgqWypdKmAqZypoKm8qcip6K1orYitjK2YrbStuK28rcStyK3UreSt7K30sUCxRLFMsZyxpLG0scC1ULVUtYS1sLW0tblEje3VRLWItWVItci10J2ZkT1NYWVplaHJzdHZ4fH0hUiFTIVQhVSFYIWMhZCFlIWYhZyFoIWshbiFvIXAhciFzIXkhfCNRI1IjWyNpI2wjfSRPJFEkUyRWJGckaSRqJGwkeiVQJVclWiVdJWAlZCVpJWsldSV9JlAmWyZgJmkmayZsJnMmdyZ6J1InVSdgJ2QnZidnJ2sncCdyJ3YneihQKFEoVyhaKGIoZChsKG8oeylPKVMpVClYKVspZSlvKXgpeSl8KlMqVCpWKlgqWypdKmAqYypnKmgqbypxKnIqeitTK1QrWitiK2MrZituK28rcStyK3Urdyt5K3srfSxQLFEsUyxnLGksbSxwLHMtVC1VLWEtZC1mLWctaC1pLWstbC1tLW4tby1xLXVXI29sIU8hUCReVyN3dSZeLVktdFEkYCFRUSRwIVlRJHEhWlckeSFpJ2EpdSttUyZdI3gjeVEmfSRrUShlJlZRKHMmbVcodCZvKHUodip4VSh3JnEoeCp5USlnJ1dXKWgnWStpLGstUlMraClpKWpZLFUqcyxWLHgseS1eUSxYKnVRLGQrX1EsZithUi1dLHdSJlsjd2khdlhZIVMhVCVdJWQncid6KU8qUypWKlhSJVohdVEhelhRJXYjW1EmZSRTUiZoJFZULVgscy1kIVUhalAhbSNoI3UkVyRmJHIkcyR0JHUkdiR3JWIlZyVtJW4mYSZ5KGMobilSKlEqWitSK3wtalEmWSNwUiddJHFSJ2AkeVIlUyFsJ25jT1NYWVplaHJzdHZ4fH0hUiFTIVQhVSFYIWMhZCFlIWYhZyFoIWkhayFuIW8hcCFyIXMheSF8I1EjUiNbI2kjbCN9JE8kUSRTJFYkZyRpJGokbCR6JVAlVyVaJV0lYCVkJWklayV1JX0mUCZbJmAmaSZrJmwmcyZ3JnonUidVJ2AnYSdkJ2YnZydrJ3Ancid2J3ooUChRKFcoWihiKGQobChvKHspTylTKVQpWClbKWUpbyl1KXgpeSl8KlMqVCpWKlgqWypdKmAqYypnKmgqbypxKnIqeitTK1QrWitiK2MrZittK24rbytxK3IrdSt3K3kreyt9LFAsUSxTLGcsaSxtLHAscy1ULVUtYS1kLWYtZy1oLWktay1sLW0tbi1vLXEtdVQjZmMjZ1MjXV8jXlMjYGAjYVMjYmEjY1MjZGIjZVQqayheKmxUKF8ldihhUSRVd1IrZyloWCRTdyRUJFUmZ1prT3IkbClbK1pYb09yKVsrWlEkbSFXUSZ1JGRRJnYkZVEnWCRvUSdbJHFRKVkmfFEpYCdSUSliJ1NRKWMnVFEpcCdaUSlyJ11RKn0pT1ErUClQUStRKVFRK1UpV1MrVylaKXFRK1spXlErXSlfUSteKWFRLFsqfFEsXStPUSxfK1ZRLGArWFEsZStgUSx8LF5RLU8sY1EtUCxkUi1fLH1Xb09yKVsrWlIjcm5RJ1okcFIpWiZ9UStmKWhSLGkrZ1EpcSdaUitYKVpabU9ucilbK1pRck9SI3RyUSZfI3pSKGomX1MlaiNQI3xTKFIlaihVVChVJW0mYVElXiF4USVlIXtXJ3MlXiVlJ3gnfFEneCViUid8JWdRJmokV1IocCZqUShYJW5RKl4oU1QqZChYKl5RJ2Ike1IpdidiUydlJU8lUFkpeidlKXsrcyxxLVZVKXsnZidnJ2hVK3MpfCl9Kk9TLHErdCt1Ui1WLHJRI1ddUiVxI1dRI1peUiVzI1pRI15fUiV3I15RKFsldFMqaShbKmpSKmooXVEqbCheUixSKmxRI2FgUiV5I2FRI2NhUiV6I2NRI2ViUiV7I2VRI2djUiV8I2dRI2pmUSZPI2hXJlIjaiZPKG0qcFEobSZkUipwLWpRJFR3UyZmJFQmZ1ImZyRVUSZ0JGJSKHwmdFEmVyNvUihmJldRJF4hUFImbiReUSp0KHRTLFcqdCx6Uix6LFhRJnIkYFIoeSZyUSNtalImVCNtUStaKVtSLGErWlEofSZ1Uip7KH1RJngkZlMpVSZ4KVZSKVYmeVEnUSRtUildJ1FRJ1YkblMpZidWK2RSK2QpZ1ErailsUixsK2pXbk9yKVsrWlIjcW5TcU9yVCtZKVsrWldwT3IpWytaUidPJGxZak9yJGwpWytaUiZTI2xbd09yI2wkbClbK1pSJmUkUyZZUE9YWVpocnR2fH0hUiFTIVQhWCFpIWshbiFvIXAhciFzI1sjaSNsJE8kUSRTJFYkaiRsJHolUCVXJVolXSVkJWklayV1JX0mWyZgJmsmbCZzJnonUidVJ2AnYSdkJ2YnZydrJ3IneihRKFcoWihiKGQobCh7KU8pWClbKWUpbyl1KXgpeSl8KlMqVCpWKlgqWypdKmAqZypoKm8qcip6K1orYitjK2YrbStuK28rcStyK3Urdyt5K3srfSxQLFEsUyxnLGksbSxwLHMtVC1VLWEtZC1mLWctaC1pLWstbC1tLW4tcS11USFtU1EjaGVRI3VzVSRXeCVgJ3ZTJGYhVSRpUSRyIWNRJHMhZFEkdCFlUSR1IWZRJHYhZ1EkdyFoUSViIXlRJWchfFElbSNRUSVuI1JRJmEjfVEmeSRnUShjJlBVKG4maShvKnFXKVImdylUK1MrVFEqUSdwUSpaKFBRK1IpU1ErfCpjUi1qLW9RIXhYUSF7WVEkZCFTUSRlIVReJ28lXSVkJ3IneipTKlYqWFIrTylPW2ZPciNsJGwpWytaaCF1WFkhUyFUJV0lZCdyJ3opTypTKlYqWFEjUFpRI2toUyN8dnxRJFp9VyRiIVIkViZ6KVhTJG4hWCRqVyR4IWknYSl1K21RJU8ha1EldCNbYCZRI2klfShiKGQobCpvLFMtblEmYiRPUSZjJFFRJmQkU1EnXiR6USdoJVBRJ24lWlcoTyVpKFEqWypgUShTJWtRKF0ldVEoaCZbUyhrJmAtbFEocSZrUShyJmxVKHomcyh7KnpRKWEnUlkpZCdVKWUrYitjLGdRKXMnYF4pdydkKXkrcStyLHAtVS1hUSl9J2ZRKk8nZ1MqUCdrLW1XKmIoVypdK3krfVcqZihaKmgsUCxRUStsKW9RK3ApeFErdCl8USxPKmdRLFQqclEsaCtmUSxuK25RLG8rb1Escit1USx2K3tRLVEsaVEtUyxtUi1gLVRoVE9yI2kjbCRsJX0mYCdrKGIoZClbK1okeiF0WFlaaHZ8fSFSIVMhVCFYIWkhayNbJE8kUSRTJFYkaiR6JVAlWiVdJWQlaSVrJXUmWyZrJmwmcyZ6J1InVSdgJ2EnZCdmJ2cncid6KFEoVyhaKGwoeylPKVgpZSlvKXUpeCl5KXwqUypWKlgqWypdKmAqZypoKm8qcip6K2IrYytmK20rbitvK3Ercit1K3kreyt9LFAsUSxTLGcsaSxtLHAtVC1VLWEtbC1tLW5RI3Z0VyVUIW4hci1nLXFRJVUhb1ElViFwUSVYIXNRJWMtZlMnaiVXLWtRJ2wtaFEnbS1pUSt2KlRRLHUrd1MtVyxzLWRSLXMtdVUjenUtWS10UihpJl5bZ09yI2wkbClbK1pYIXdYI1skUyRWUSNVWlEkUHZSJFl8USVfIXhRJWYhe1ElbCNQUSdeJHhRJ3klYlEnfSVnUShWJW1RKFklblEqXyhTUSx0K3ZRLVssdVItYy1aUSRYeFEndSVgUipVJ3ZRLVosc1ItZS1kUiNPWVIjVFpSJH0haVEkeyFpVil0J2EpdSttUiVRIWtSJXYjW1EoYCV2UipuKGFRJGMhUlEmaCRWUSlXJnpSK1YpWFEjcGxRJFshT1EkXyFQUiZwJF5RKHMmb1Eqdih1USp3KHZSLFoqeFIkYSFRWHBPcilbK1pRJGghVVImeyRpUSRvIVhSJnwkalIpbidZUSlsJ1lWLGoraSxrLVJcIixcbiAgbm9kZU5hbWVzOiBcIuKaoCBwcmludCBDb21tZW50IFNjcmlwdCBBc3NpZ25TdGF0ZW1lbnQgKiBCaW5hcnlFeHByZXNzaW9uIEJpdE9wIEJpdE9wIEJpdE9wIEJpdE9wIEFyaXRoT3AgQXJpdGhPcCBAIEFyaXRoT3AgKiogVW5hcnlFeHByZXNzaW9uIEFyaXRoT3AgQml0T3AgQXdhaXRFeHByZXNzaW9uIGF3YWl0IFBhcmVudGhlc2l6ZWRFeHByZXNzaW9uICggQmluYXJ5RXhwcmVzc2lvbiBvciBhbmQgQ29tcGFyZU9wIGluIG5vdCBpcyBVbmFyeUV4cHJlc3Npb24gQ29uZGl0aW9uYWxFeHByZXNzaW9uIGlmIGVsc2UgTGFtYmRhRXhwcmVzc2lvbiBsYW1iZGEgUGFyYW1MaXN0IFZhcmlhYmxlTmFtZSBBc3NpZ25PcCAsIDogTmFtZWRFeHByZXNzaW9uIEFzc2lnbk9wIFlpZWxkRXhwcmVzc2lvbiB5aWVsZCBmcm9tICkgVHVwbGVFeHByZXNzaW9uIENvbXByZWhlbnNpb25FeHByZXNzaW9uIGFzeW5jIGZvciBMYW1iZGFFeHByZXNzaW9uIEFycmF5RXhwcmVzc2lvbiBbIF0gQXJyYXlDb21wcmVoZW5zaW9uRXhwcmVzc2lvbiBEaWN0aW9uYXJ5RXhwcmVzc2lvbiB7IH0gRGljdGlvbmFyeUNvbXByZWhlbnNpb25FeHByZXNzaW9uIFNldEV4cHJlc3Npb24gU2V0Q29tcHJlaGVuc2lvbkV4cHJlc3Npb24gQ2FsbEV4cHJlc3Npb24gQXJnTGlzdCBBc3NpZ25PcCBNZW1iZXJFeHByZXNzaW9uIC4gUHJvcGVydHlOYW1lIE51bWJlciBTdHJpbmcgRm9ybWF0U3RyaW5nIEZvcm1hdFJlcGxhY2VtZW50IEZvcm1hdENvbnZlcnNpb24gRm9ybWF0U3BlYyBDb250aW51ZWRTdHJpbmcgRWxsaXBzaXMgTm9uZSBCb29sZWFuIFR5cGVEZWYgQXNzaWduT3AgVXBkYXRlU3RhdGVtZW50IFVwZGF0ZU9wIEV4cHJlc3Npb25TdGF0ZW1lbnQgRGVsZXRlU3RhdGVtZW50IGRlbCBQYXNzU3RhdGVtZW50IHBhc3MgQnJlYWtTdGF0ZW1lbnQgYnJlYWsgQ29udGludWVTdGF0ZW1lbnQgY29udGludWUgUmV0dXJuU3RhdGVtZW50IHJldHVybiBZaWVsZFN0YXRlbWVudCBQcmludFN0YXRlbWVudCBSYWlzZVN0YXRlbWVudCByYWlzZSBJbXBvcnRTdGF0ZW1lbnQgaW1wb3J0IGFzIFNjb3BlU3RhdGVtZW50IGdsb2JhbCBub25sb2NhbCBBc3NlcnRTdGF0ZW1lbnQgYXNzZXJ0IFN0YXRlbWVudEdyb3VwIDsgSWZTdGF0ZW1lbnQgQm9keSBlbGlmIFdoaWxlU3RhdGVtZW50IHdoaWxlIEZvclN0YXRlbWVudCBUcnlTdGF0ZW1lbnQgdHJ5IGV4Y2VwdCBmaW5hbGx5IFdpdGhTdGF0ZW1lbnQgd2l0aCBGdW5jdGlvbkRlZmluaXRpb24gZGVmIFBhcmFtTGlzdCBBc3NpZ25PcCBUeXBlRGVmIENsYXNzRGVmaW5pdGlvbiBjbGFzcyBEZWNvcmF0ZWRTdGF0ZW1lbnQgRGVjb3JhdG9yIEF0XCIsXG4gIG1heFRlcm06IDIzNCxcbiAgY29udGV4dDogdHJhY2tJbmRlbnQsXG4gIG5vZGVQcm9wczogW1xuICAgIFtsZXplci5Ob2RlUHJvcC5ncm91cCwgLTE0LDQsODAsODIsODMsODUsODcsODksOTEsOTMsOTQsOTUsOTcsMTAwLDEwMyxcIlN0YXRlbWVudCBTdGF0ZW1lbnRcIiwtMjIsNiwxNiwxOSwyMSwzNyw0Nyw0OCw1Miw1NSw1Niw1OSw2MCw2MSw2Miw2NSw2OCw2OSw3MCw3NCw3NSw3Niw3NyxcIkV4cHJlc3Npb25cIiwtOSwxMDUsMTA3LDExMCwxMTIsMTEzLDExNywxMTksMTI0LDEyNixcIlN0YXRlbWVudFwiXVxuICBdLFxuICBza2lwcGVkTm9kZXM6IFswLDJdLFxuICByZXBlYXROb2RlQ291bnQ6IDMyLFxuICB0b2tlbkRhdGE6IFwiJkFhTWdSIV5PWCR9WFkhI3hZWyR9W10hI3hdcCR9cHEhI3hxciEmU3JzISl5c3QhQ3t0dSR9dXYkK312dyQuYXd4JC9teHkkTGd5eiRNbXp7JE5ze3wlI2N8fSUkb30hTyUldSFPIVAlKFshUCFRJTNiIVEhUiU2USFSIVslOlMhWyFdJUVPIV0hXiVHYiFeIV8lSGghXyFgJUtXIWAhYSVMZCFhIWIkfSFiIWMmIFAhYyFkJiFfIWQhZSYkUCFlIWgmIV8haCFpJi5SIWkhdCYhXyF0IXUmN2chdSF3JiFfIXcheCYsYSF4IX0mIV8hfSNPJjlxI08jUCElYiNQI1EmOncjUSNSJjt9I1IjUyYhXyNTI1QkfSNUI1UmIV8jVSNWJiRQI1YjWSYhXyNZI1omLlIjWiNmJiFfI2YjZyY3ZyNnI2kmIV8jaSNqJixhI2ojbyYhXyNvI3AmPVojcCNxJj5QI3EjciY/XSNyI3MmQFojcyRnJH0kZ34mIV88ciVgWiVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4I08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9OVsmXlolcDdbJWdTJW1gJXYhYk9yJ1Byc0N4c3cnUHd4KFB4I08nUCNPI1A+diNQI28nUCNvI3BDVSNwI3EnUCNxI3I/WyNyfidQOVsnXlolcDdbJWdTJWpXJW1gJXYhYk9yJ1BycyZSc3cnUHd4KFB4I08nUCNPI1A+diNQI28nUCNvI3BDVSNwI3EnUCNxI3I/WyNyfidQOHooV1olcDdbJWpXT3IoeXJzKXdzdyh5d3g7YngjTyh5I08jUDJWI1Ajbyh5I28jcDduI3AjcSh5I3EjcjJrI3J+KHk4eilVWiVwN1slZ1MlalcldiFiT3IoeXJzKXdzdyh5d3goUHgjTyh5I08jUDJWI1Ajbyh5I28jcDduI3AjcSh5I3EjcjJrI3J+KHk4eipRWiVwN1slZ1MldiFiT3IoeXJzKnNzdyh5d3goUHgjTyh5I08jUDJWI1Ajbyh5I28jcDduI3AjcSh5I3EjcjJrI3J+KHk4eip8WiVwN1slZ1MldiFiT3IoeXJzK29zdyh5d3goUHgjTyh5I08jUDJWI1Ajbyh5I28jcDduI3AjcSh5I3EjcjJrI3J+KHk4cit4WCVwN1slZ1MldiFiT3crb3d4LGV4I08rbyNPI1AuViNQI28rbyNvI3AwXiNwI3ErbyNxI3IuayNyfitvOHIsalglcDdbT3crb3d4LVZ4I08rbyNPI1AuViNQI28rbyNvI3AwXiNwI3ErbyNxI3IuayNyfitvOHItW1glcDdbT3crb3d4LXd4I08rbyNPI1AuViNQI28rbyNvI3AwXiNwI3ErbyNxI3IuayNyfitvN1stfFIlcDdbTyNvLXcjcCNxLXcjcn4tdzhyLltUJXA3W08jbytvI28jcC5rI3AjcStvI3Ejci5rI3J+K28hZi5yViVnUyV2IWJPdy5rd3gvWHgjTy5rI08jUDBXI1Ajby5rI28jcDBeI3B+LmshZi9bVk93Lmt3eC9xeCNPLmsjTyNQMFcjUCNvLmsjbyNwMF4jcH4uayFmL3RVT3cua3gjTy5rI08jUDBXI1Ajby5rI28jcDBeI3B+LmshZjBaUE9+LmshZjBjViVnU093MHh3eDFeeCNPMHgjTyNQMlAjUCNvMHgjbyNwLmsjcH4weFMwfVQlZ1NPdzB4d3gxXngjTzB4I08jUDJQI1B+MHhTMWFUT3cweHd4MXB4I08weCNPI1AyUCNQfjB4UzFzU093MHh4I08weCNPI1AyUCNQfjB4UzJTUE9+MHg4ejJbVCVwN1tPI28oeSNvI3AyayNwI3EoeSNxI3IyayNyfih5IW4ydFglZ1MlalcldiFiT3Iya3JzM2FzdzJrd3g0d3gjTzJrI08jUDdoI1AjbzJrI28jcDduI3B+MmshbjNoWCVnUyV2IWJPcjJrcnM0VHN3Mmt3eDR3eCNPMmsjTyNQN2gjUCNvMmsjbyNwN24jcH4yayFuNFtYJWdTJXYhYk9yMmtycy5rc3cya3d4NHd4I08yayNPI1A3aCNQI28yayNvI3A3biNwfjJrIW40fFglaldPcjJrcnMzYXN3Mmt3eDVpeCNPMmsjTyNQN2gjUCNvMmsjbyNwN24jcH4yayFuNW5YJWpXT3Iya3JzM2FzdzJrd3g2WngjTzJrI08jUDdoI1AjbzJrI28jcDduI3B+MmtXNmBUJWpXT3I2WnJzNm9zI082WiNPI1A3YiNQfjZaVzZyVE9yNlpyczdScyNPNlojTyNQN2IjUH42Wlc3VVNPcjZacyNPNlojTyNQN2IjUH42Wlc3ZVBPfjZaIW43a1BPfjJrIW43dVglZ1MlaldPcjhicnM5T3N3OGJ3eDpVeCNPOGIjTyNQO1sjUCNvOGIjbyNwMmsjcH44Yls4aVYlZ1MlaldPcjhicnM5T3N3OGJ3eDpVeCNPOGIjTyNQO1sjUH44Yls5VFYlZ1NPcjhicnM5anN3OGJ3eDpVeCNPOGIjTyNQO1sjUH44Yls5b1YlZ1NPcjhicnMweHN3OGJ3eDpVeCNPOGIjTyNQO1sjUH44Yls6WlYlaldPcjhicnM5T3N3OGJ3eDpweCNPOGIjTyNQO1sjUH44Yls6dVYlaldPcjhicnM5T3N3OGJ3eDZaeCNPOGIjTyNQO1sjUH44Yls7X1BPfjhiOHo7aVolcDdbJWpXT3IoeXJzKXdzdyh5d3g8W3gjTyh5I08jUDJWI1Ajbyh5I28jcDduI3AjcSh5I3EjcjJrI3J+KHk3ZDxjWCVwN1slaldPcjxbcnM9T3MjTzxbI08jUD5iI1AjbzxbI28jcDZaI3AjcTxbI3EjcjZaI3J+PFs3ZD1UWCVwN1tPcjxbcnM9cHMjTzxbI08jUD5iI1AjbzxbI28jcDZaI3AjcTxbI3EjcjZaI3J+PFs3ZD11WCVwN1tPcjxbcnMtd3MjTzxbI08jUD5iI1AjbzxbI28jcDZaI3AjcTxbI3EjcjZaI3J+PFs3ZD5nVCVwN1tPI288WyNvI3A2WiNwI3E8WyNxI3I2WiNyfjxbOVs+e1QlcDdbTyNvJ1AjbyNwP1sjcCNxJ1AjcSNyP1sjcn4nUCNPP2dYJWdTJWpXJW1gJXYhYk9yP1tyc0BTc3c/W3d4NHd4I08/WyNPI1BDTyNQI28/WyNvI3BDVSNwfj9bI09AXVglZ1MlbWAldiFiT3I/W3JzQHhzdz9bd3g0d3gjTz9bI08jUENPI1Ajbz9bI28jcENVI3B+P1sjT0FSWCVnUyVtYCV2IWJPcj9bcnNBbnN3P1t3eDR3eCNPP1sjTyNQQ08jUCNvP1sjbyNwQ1UjcH4/WyF2QXdWJWdTJW1gJXYhYk93QW53eC9YeCNPQW4jTyNQQl4jUCNvQW4jbyNwQmQjcH5BbiF2QmFQT35BbiF2QmlWJWdTT3cweHd4MV54I08weCNPI1AyUCNQI28weCNvI3BBbiNwfjB4I09DUlBPfj9bI09DXVglZ1MlaldPcjhicnM5T3N3OGJ3eDpVeCNPOGIjTyNQO1sjUCNvOGIjbyNwP1sjcH44YjlbRFRaJXA3WyVnUyVtYCV2IWJPcidQcnNEdnN3J1B3eChQeCNPJ1AjTyNQPnYjUCNvJ1AjbyNwQ1UjcCNxJ1AjcSNyP1sjcn4nUDlTRVJYJXA3WyVnUyVtYCV2IWJPd0R2d3gsZXgjT0R2I08jUEVuI1Ajb0R2I28jcEJkI3AjcUR2I3EjckFuI3J+RHY5U0VzVCVwN1tPI29EdiNvI3BBbiNwI3FEdiNxI3JBbiNyfkR2PGJGX1olcDdbJWpXJXNwJXgjdE9yR1Fycyl3c3dHUXd4TV54I09HUSNPI1BIUyNQI29HUSNvI3BMaiNwI3FHUSNxI3JIaCNyfkdRPGJHYVolcDdbJWdTJWpXJXNwJXYhYiV4I3RPckdRcnMpd3N3R1F3eEZTeCNPR1EjTyNQSFMjUCNvR1EjbyNwTGojcCNxR1EjcSNySGgjcn5HUTxiSFhUJXA3W08jb0dRI28jcEhoI3AjcUdRI3EjckhoI3J+R1EmVUh1WCVnUyVqVyVzcCV2IWIleCN0T3JIaHJzM2Fzd0hod3hJYngjT0hoI08jUExkI1Ajb0hoI28jcExqI3B+SGgmVUlrWCVqVyVzcCV4I3RPckhocnMzYXN3SGh3eEpXeCNPSGgjTyNQTGQjUCNvSGgjbyNwTGojcH5IaCZVSmFYJWpXJXNwJXgjdE9ySGhyczNhc3dIaHd4Snx4I09IaCNPI1BMZCNQI29IaCNvI3BMaiNwfkhoJG5LVlglalclc3AleCN0T3JKfHJzNm9zd0p8d3hKfHgjT0p8I08jUEtyI1Ajb0p8I28jcEt4I3B+Snwkbkt1UE9+Snwkbkt9ViVqV09yNlpyczZvcyNPNlojTyNQN2IjUCNvNlojbyNwSnwjcH42WiZVTGdQT35IaCZVTHFYJWdTJWpXT3I4YnJzOU9zdzhid3g6VXgjTzhiI08jUDtbI1AjbzhiI28jcEhoI3B+OGI8Yk1pWiVwN1slalclc3AleCN0T3JHUXJzKXdzd0dRd3hOW3gjT0dRI08jUEhTI1Ajb0dRI28jcExqI3AjcUdRI3EjckhoI3J+R1E6ek5nWiVwN1slalclc3AleCN0T3JOW3JzPU9zd05bd3hOW3gjT05bI08jUCEgWSNQI29OWyNvI3BLeCNwI3FOWyNxI3JKfCNyfk5bOnohIF9UJXA3W08jb05bI28jcEp8I3AjcU5bI3Ejckp8I3J+Tls8ciEgc1QlcDdbTyNvJH0jbyNwISFTI3AjcSR9I3EjciEhUyNyfiR9JmYhIWNYJWdTJWpXJW1gJXNwJXYhYiV4I3RPciEhU3JzQFNzdyEhU3d4SWJ4I08hIVMjTyNQISNPI1AjbyEhUyNvI3AhI1UjcH4hIVMmZiEjUlBPfiEhUyZmISNdWCVnUyVqV09yOGJyczlPc3c4Ynd4OlV4I084YiNPI1A7WyNQI284YiNvI3AhIVMjcH44Yk1nISRdYSVwN1slZ1MlalckbzFzJW1gJXNwJXYhYiV4I3RPWCR9WFkhI3hZWyR9W10hI3hdcCR9cHEhI3hxciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISViI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfU1nISVnWCVwN1tPWSR9WVohI3haXSR9XV4hI3heI28kfSNvI3AhIVMjcCNxJH0jcSNyISFTI3J+JH08dSEmZWIlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgISdtIWAjTyR9I08jUCEgbiNQI1QkfSNUI1UhKHMjVSNmJH0jZiNnIShzI2cjaCEocyNoI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH08dSEoUVpqUiVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4I08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9PHUhKVdaIWpSJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyEqWV8ldHAlcDdbJWdTJWUsWCVtYCV2IWJPWSErWFlaJ1BaXSErWF1eJ1BeciErWHJzIUJQc3chK1h3eCEtZ3gjTyErWCNPI1AhPmUjUCNvIStYI28jcCFAfSNwI3EhK1gjcSNyIT55I3J+IStYRGUhK2hfJXA3WyVnUyVqVyVlLFglbWAldiFiT1khK1hZWidQWl0hK1hdXidQXnIhK1hycyEsZ3N3IStYd3ghLWd4I08hK1gjTyNQIT5lI1AjbyErWCNvI3AhQH0jcCNxIStYI3EjciE+eSNyfiErWERlISx0WiVwN1slZ1MlZSxYJW1gJXYhYk9yJ1Byc0N4c3cnUHd4KFB4I08nUCNPI1A+diNQI28nUCNvI3BDVSNwI3EnUCNxI3I/WyNyfidQRFQhLXBfJXA3WyVqVyVlLFhPWSEub1laKHlaXSEub11eKHleciEub3JzIS97c3chLm93eCE7UngjTyEubyNPI1AhMHkjUCNvIS5vI28jcCE2bSNwI3EhLm8jcSNyITFfI3J+IS5vRFQhLnxfJXA3WyVnUyVqVyVlLFgldiFiT1khLm9ZWih5Wl0hLm9dXih5XnIhLm9ycyEve3N3IS5vd3ghLWd4I08hLm8jTyNQITB5I1AjbyEubyNvI3AhNm0jcCNxIS5vI3EjciExXyNyfiEub0RUITBXWiVwN1slZ1MlZSxYJXYhYk9yKHlycypzc3coeXd4KFB4I08oeSNPI1AyViNQI28oeSNvI3A3biNwI3EoeSNxI3IyayNyfih5RFQhMU9UJXA3W08jbyEubyNvI3AhMV8jcCNxIS5vI3EjciExXyNyfiEuby13ITFqXSVnUyVqVyVlLFgldiFiT1khMV9ZWjJrWl0hMV9dXjJrXnIhMV9ycyEyY3N3ITFfd3ghM1h4I08hMV8jTyNQITZnI1AjbyExXyNvI3AhNm0jcH4hMV8tdyEybFglZ1MlZSxYJXYhYk9yMmtyczRUc3cya3d4NHd4I08yayNPI1A3aCNQI28yayNvI3A3biNwfjJrLXchM2BdJWpXJWUsWE9ZITFfWVoya1pdITFfXV4ya15yITFfcnMhMmNzdyExX3d4ITRYeCNPITFfI08jUCE2ZyNQI28hMV8jbyNwITZtI3B+ITFfLXchNGBdJWpXJWUsWE9ZITFfWVoya1pdITFfXV4ya15yITFfcnMhMmNzdyExX3d4ITVYeCNPITFfI08jUCE2ZyNQI28hMV8jbyNwITZtI3B+ITFfLGEhNWBYJWpXJWUsWE9ZITVYWVo2WlpdITVYXV42Wl5yITVYcnMhNXtzI08hNVgjTyNQITZhI1B+ITVYLGEhNlFUJWUsWE9yNlpyczdScyNPNlojTyNQN2IjUH42WixhITZkUE9+ITVYLXchNmpQT34hMV8tdyE2dl0lZ1MlalclZSxYT1khN29ZWjhiWl0hN29dXjhiXnIhN29ycyE4a3N3ITdvd3ghOVh4I08hN28jTyNQITp7I1AjbyE3byNvI3AhMV8jcH4hN28sZSE3eFolZ1MlalclZSxYT1khN29ZWjhiWl0hN29dXjhiXnIhN29ycyE4a3N3ITdvd3ghOVh4I08hN28jTyNQITp7I1B+ITdvLGUhOHJWJWdTJWUsWE9yOGJyczlqc3c4Ynd4OlV4I084YiNPI1A7WyNQfjhiLGUhOWBaJWpXJWUsWE9ZITdvWVo4YlpdITdvXV44Yl5yITdvcnMhOGtzdyE3b3d4ITpSeCNPITdvI08jUCE6eyNQfiE3byxlITpZWiVqVyVlLFhPWSE3b1laOGJaXSE3b11eOGJeciE3b3JzIThrc3chN293eCE1WHgjTyE3byNPI1AhOnsjUH4hN28sZSE7T1BPfiE3b0RUITtbXyVwN1slalclZSxYT1khLm9ZWih5Wl0hLm9dXih5XnIhLm9ycyEve3N3IS5vd3ghPFp4I08hLm8jTyNQITB5I1AjbyEubyNvI3AhNm0jcCNxIS5vI3EjciExXyNyfiEub0JtITxkXSVwN1slalclZSxYT1khPFpZWjxbWl0hPFpdXjxbXnIhPFpycyE9XXMjTyE8WiNPI1AhPlAjUCNvITxaI28jcCE1WCNwI3EhPFojcSNyITVYI3J+ITxaQm0hPWRYJXA3WyVlLFhPcjxbcnM9cHMjTzxbI08jUD5iI1AjbzxbI28jcDZaI3AjcTxbI3EjcjZaI3J+PFtCbSE+VVQlcDdbTyNvITxaI28jcCE1WCNwI3EhPFojcSNyITVYI3J+ITxaRGUhPmpUJXA3W08jbyErWCNvI3AhPnkjcCNxIStYI3EjciE+eSNyfiErWC5YIT9XXSVnUyVqVyVlLFglbWAldiFiT1khPnlZWj9bWl0hPnldXj9bXnIhPnlycyFAUHN3IT55d3ghM1h4I08hPnkjTyNQIUB3I1AjbyE+eSNvI3AhQH0jcH4hPnkuWCFAW1glZ1MlZSxYJW1gJXYhYk9yP1tyc0B4c3c/W3d4NHd4I08/WyNPI1BDTyNQI28/WyNvI3BDVSNwfj9bLlghQHpQT34hPnkuWCFBV10lZ1MlalclZSxYT1khN29ZWjhiWl0hN29dXjhiXnIhN29ycyE4a3N3ITdvd3ghOVh4I08hN28jTyNQITp7I1AjbyE3byNvI3AhPnkjcH4hN29HWiFCXlolcDdbJWdTJWUsWCVtYCV2IWJPcidQcnMhQ1BzdydQd3goUHgjTydQI08jUD52I1AjbydQI28jcENVI3AjcSdQI3Ejcj9bI3J+J1BHWiFDYFglayN8JXA3WyVnUyVpLFglbWAldiFiT3dEdnd4LGV4I09EdiNPI1BFbiNQI29EdiNvI3BCZCNwI3FEdiNxI3JBbiNyfkR2TWchRGBfUTFzJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T1khQ3tZWiR9Wl0hQ3tdXiR9XnIhQ3tycyFFX3N3IUN7d3gjSHF4I08hQ3sjTyNQJChpI1AjbyFDeyNvI3AkKnsjcCNxIUN7I3EjciQpXSNyfiFDe0pQIUVsX1ExcyVwN1slZ1MlbWAldiFiT1khRmtZWidQWl0hRmtdXidQXnIhRmtycyNFa3N3IUZrd3ghR3l4I08hRmsjTyNQIz11I1AjbyFGayNvI3AjRGkjcCNxIUZrI3EjciM+aSNyfiFGa0pQIUZ6X1ExcyVwN1slZ1MlalclbWAldiFiT1khRmtZWidQWl0hRmtdXidQXnIhRmtycyFFX3N3IUZrd3ghR3l4I08hRmsjTyNQIz11I1AjbyFGayNvI3AjRGkjcCNxIUZrI3EjciM+aSNyfiFGa0lvIUhTX1ExcyVwN1slaldPWSFJUllaKHlaXSFJUl1eKHleciFJUnJzIUpfc3chSVJ3eCM4d3gjTyFJUiNPI1AjKlIjUCNvIUlSI28jcCMyfSNwI3EhSVIjcSNyIyp1I3J+IUlSSW8hSWBfUTFzJXA3WyVnUyVqVyV2IWJPWSFJUllaKHlaXSFJUl1eKHleciFJUnJzIUpfc3chSVJ3eCFHeXgjTyFJUiNPI1AjKlIjUCNvIUlSI28jcCMyfSNwI3EhSVIjcSNyIyp1I3J+IUlSSW8hSmpfUTFzJXA3WyVnUyV2IWJPWSFJUllaKHlaXSFJUl1eKHleciFJUnJzIUtpc3chSVJ3eCFHeXgjTyFJUiNPI1AjKlIjUCNvIUlSI28jcCMyfSNwI3EhSVIjcSNyIyp1I3J+IUlSSW8hS3RfUTFzJXA3WyVnUyV2IWJPWSFJUllaKHlaXSFJUl1eKHleciFJUnJzIUxzc3chSVJ3eCFHeXgjTyFJUiNPI1AjKlIjUCNvIUlSI28jcCMyfSNwI3EhSVIjcSNyIyp1I3J+IUlSSWchTU9dUTFzJXA3WyVnUyV2IWJPWSFMc1laK29aXSFMc11eK29edyFMc3d4IU13eCNPIUxzI08jUCMheSNQI28hTHMjbyNwIyZtI3AjcSFMcyNxI3IjI20jcn4hTHNJZyFOT11RMXMlcDdbT1khTHNZWitvWl0hTHNdXitvXnchTHN3eCFOd3gjTyFMcyNPI1AjIXkjUCNvIUxzI28jcCMmbSNwI3EhTHMjcSNyIyNtI3J+IUxzSWcjIE9dUTFzJXA3W09ZIUxzWVorb1pdIUxzXV4rb153IUxzd3gjIHd4I08hTHMjTyNQIyF5I1AjbyFMcyNvI3AjJm0jcCNxIUxzI3EjciMjbSNyfiFMc0hQIyFPWFExcyVwN1tPWSMgd1laLXdaXSMgd11eLXdeI28jIHcjbyNwIyFrI3AjcSMgdyNxI3IjIWsjcn4jIHcxcyMhcFJRMXNPWSMha1pdIyFrXn4jIWtJZyMjUVhRMXMlcDdbT1khTHNZWitvWl0hTHNdXitvXiNvIUxzI28jcCMjbSNwI3EhTHMjcSNyIyNtI3J+IUxzM1ojI3ZaUTFzJWdTJXYhYk9ZIyNtWVoua1pdIyNtXV4ua153IyNtd3gjJGl4I08jI20jTyNQIyZYI1AjbyMjbSNvI3AjJm0jcH4jI20zWiMkblpRMXNPWSMjbVlaLmtaXSMjbV1eLmtedyMjbXd4IyVheCNPIyNtI08jUCMmWCNQI28jI20jbyNwIyZtI3B+IyNtM1ojJWZaUTFzT1kjI21ZWi5rWl0jI21dXi5rXncjI213eCMha3gjTyMjbSNPI1AjJlgjUCNvIyNtI28jcCMmbSNwfiMjbTNaIyZeVFExc09ZIyNtWVoua1pdIyNtXV4ua15+IyNtM1ojJnRaUTFzJWdTT1kjJ2dZWjB4Wl0jJ2ddXjB4XncjJ2d3eCMoWngjTyMnZyNPI1AjKW0jUCNvIydnI28jcCMjbSNwfiMnZzF3IyduWFExcyVnU09ZIydnWVoweFpdIydnXV4weF53Iydnd3gjKFp4I08jJ2cjTyNQIyltI1B+IydnMXcjKGBYUTFzT1kjJ2dZWjB4Wl0jJ2ddXjB4XncjJ2d3eCMoe3gjTyMnZyNPI1AjKW0jUH4jJ2cxdyMpUVhRMXNPWSMnZ1laMHhaXSMnZ11eMHhedyMnZ3d4IyFreCNPIydnI08jUCMpbSNQfiMnZzF3IylyVFExc09ZIydnWVoweFpdIydnXV4weF5+IydnSW8jKllYUTFzJXA3W09ZIUlSWVooeVpdIUlSXV4oeV4jbyFJUiNvI3AjKnUjcCNxIUlSI3EjciMqdSNyfiFJUjNjIytRXVExcyVnUyVqVyV2IWJPWSMqdVlaMmtaXSMqdV1eMmteciMqdXJzIyt5c3cjKnV3eCMtfXgjTyMqdSNPI1AjMmkjUCNvIyp1I28jcCMyfSNwfiMqdTNjIyxTXVExcyVnUyV2IWJPWSMqdVlaMmtaXSMqdV1eMmteciMqdXJzIyx7c3cjKnV3eCMtfXgjTyMqdSNPI1AjMmkjUCNvIyp1I28jcCMyfSNwfiMqdTNjIy1VXVExcyVnUyV2IWJPWSMqdVlaMmtaXSMqdV1eMmteciMqdXJzIyNtc3cjKnV3eCMtfXgjTyMqdSNPI1AjMmkjUCNvIyp1I28jcCMyfSNwfiMqdTNjIy5VXVExcyVqV09ZIyp1WVoya1pdIyp1XV4ya15yIyp1cnMjK3lzdyMqdXd4Iy59eCNPIyp1I08jUCMyaSNQI28jKnUjbyNwIzJ9I3B+Iyp1M2MjL1VdUTFzJWpXT1kjKnVZWjJrWl0jKnVdXjJrXnIjKnVycyMreXN3Iyp1d3gjL314I08jKnUjTyNQIzJpI1AjbyMqdSNvI3AjMn0jcH4jKnUxeyMwVVhRMXMlaldPWSMvfVlaNlpaXSMvfV1eNlpeciMvfXJzIzBxcyNPIy99I08jUCMyVCNQfiMvfTF7IzB2WFExc09ZIy99WVo2WlpdIy99XV42Wl5yIy99cnMjMWNzI08jL30jTyNQIzJUI1B+Iy99MXsjMWhYUTFzT1kjL31ZWjZaWl0jL31dXjZaXnIjL31ycyMha3MjTyMvfSNPI1AjMlQjUH4jL30xeyMyWVRRMXNPWSMvfVlaNlpaXSMvfV1eNlpefiMvfTNjIzJuVFExc09ZIyp1WVoya1pdIyp1XV4ya15+Iyp1M2MjM1ddUTFzJWdTJWpXT1kjNFBZWjhiWl0jNFBdXjhiXnIjNFBycyM0e3N3IzRQd3gjNm94I08jNFAjTyNQIzhjI1AjbyM0UCNvI3AjKnUjcH4jNFAyUCM0WVpRMXMlZ1MlaldPWSM0UFlaOGJaXSM0UF1eOGJeciM0UHJzIzR7c3cjNFB3eCM2b3gjTyM0UCNPI1AjOGMjUH4jNFAyUCM1U1pRMXMlZ1NPWSM0UFlaOGJaXSM0UF1eOGJeciM0UHJzIzV1c3cjNFB3eCM2b3gjTyM0UCNPI1AjOGMjUH4jNFAyUCM1fFpRMXMlZ1NPWSM0UFlaOGJaXSM0UF1eOGJeciM0UHJzIydnc3cjNFB3eCM2b3gjTyM0UCNPI1AjOGMjUH4jNFAyUCM2dlpRMXMlaldPWSM0UFlaOGJaXSM0UF1eOGJeciM0UHJzIzR7c3cjNFB3eCM3aXgjTyM0UCNPI1AjOGMjUH4jNFAyUCM3cFpRMXMlaldPWSM0UFlaOGJaXSM0UF1eOGJeciM0UHJzIzR7c3cjNFB3eCMvfXgjTyM0UCNPI1AjOGMjUH4jNFAyUCM4aFRRMXNPWSM0UFlaOGJaXSM0UF1eOGJefiM0UElvIzlRX1ExcyVwN1slaldPWSFJUllaKHlaXSFJUl1eKHleciFJUnJzIUpfc3chSVJ3eCM6UHgjTyFJUiNPI1AjKlIjUCNvIUlSI28jcCMyfSNwI3EhSVIjcSNyIyp1I3J+IUlSSFgjOlldUTFzJXA3WyVqV09ZIzpQWVo8W1pdIzpQXV48W15yIzpQcnMjO1JzI08jOlAjTyNQIz1SI1AjbyM6UCNvI3AjL30jcCNxIzpQI3EjciMvfSNyfiM6UEhYIztZXVExcyVwN1tPWSM6UFlaPFtaXSM6UF1ePFteciM6UHJzIzxScyNPIzpQI08jUCM9UiNQI28jOlAjbyNwIy99I3AjcSM6UCNxI3IjL30jcn4jOlBIWCM8WV1RMXMlcDdbT1kjOlBZWjxbWl0jOlBdXjxbXnIjOlBycyMgd3MjTyM6UCNPI1AjPVIjUCNvIzpQI28jcCMvfSNwI3EjOlAjcSNyIy99I3J+IzpQSFgjPVlYUTFzJXA3W09ZIzpQWVo8W1pdIzpQXV48W14jbyM6UCNvI3AjL30jcCNxIzpQI3EjciMvfSNyfiM6UEpQIz18WFExcyVwN1tPWSFGa1laJ1BaXSFGa11eJ1BeI28hRmsjbyNwIz5pI3AjcSFGayNxI3IjPmkjcn4hRmszcyM+dl1RMXMlZ1MlalclbWAldiFiT1kjPmlZWj9bWl0jPmldXj9bXnIjPmlycyM/b3N3Iz5pd3gjLX14I08jPmkjTyNQI0RUI1AjbyM+aSNvI3AjRGkjcH4jPmkzcyM/el1RMXMlZ1MlbWAldiFiT1kjPmlZWj9bWl0jPmldXj9bXnIjPmlycyNAc3N3Iz5pd3gjLX14I08jPmkjTyNQI0RUI1AjbyM+aSNvI3AjRGkjcH4jPmkzcyNBT11RMXMlZ1MlbWAldiFiT1kjPmlZWj9bWl0jPmldXj9bXnIjPmlycyNBd3N3Iz5pd3gjLX14I08jPmkjTyNQI0RUI1AjbyM+aSNvI3AjRGkjcH4jPmkzayNCU1pRMXMlZ1MlbWAldiFiT1kjQXdZWkFuWl0jQXddXkFuXncjQXd3eCMkaXgjTyNBdyNPI1AjQnUjUCNvI0F3I28jcCNDWiNwfiNBdzNrI0J6VFExc09ZI0F3WVpBblpdI0F3XV5Bbl5+I0F3M2sjQ2JaUTFzJWdTT1kjJ2dZWjB4Wl0jJ2ddXjB4XncjJ2d3eCMoWngjTyMnZyNPI1AjKW0jUCNvIydnI28jcCNBdyNwfiMnZzNzI0RZVFExc09ZIz5pWVo/W1pdIz5pXV4/W15+Iz5pM3MjRHJdUTFzJWdTJWpXT1kjNFBZWjhiWl0jNFBdXjhiXnIjNFBycyM0e3N3IzRQd3gjNm94I08jNFAjTyNQIzhjI1AjbyM0UCNvI3AjPmkjcH4jNFBKUCNFeF9RMXMlcDdbJWdTJW1gJXYhYk9ZIUZrWVonUFpdIUZrXV4nUF5yIUZrcnMjRndzdyFGa3d4IUd5eCNPIUZrI08jUCM9dSNQI28hRmsjbyNwI0RpI3AjcSFGayNxI3IjPmkjcn4hRmtJdyNHVV1RMXMlcDdbJWdTJW1gJXYhYk9ZI0Z3WVpEdlpdI0Z3XV5Edl53I0Z3d3ghTXd4I08jRncjTyNQI0d9I1AjbyNGdyNvI3AjQ1ojcCNxI0Z3I3EjciNBdyNyfiNGd0l3I0hVWFExcyVwN1tPWSNGd1laRHZaXSNGd11eRHZeI28jRncjbyNwI0F3I3AjcSNGdyNxI3IjQXcjcn4jRndNViNJT19RMXMlcDdbJWpXJXNwJXgjdE9ZI0l9WVpHUVpdI0l9XV5HUV5yI0l9cnMhSl9zdyNJfXd4JCVdeCNPI0l9I08jUCNLXyNQI28jSX0jbyNwJCRaI3AjcSNJfSNxI3IjTFIjcn4jSX1NViNKYF9RMXMlcDdbJWdTJWpXJXNwJXYhYiV4I3RPWSNJfVlaR1FaXSNJfV1eR1FeciNJfXJzIUpfc3cjSX13eCNIcXgjTyNJfSNPI1AjS18jUCNvI0l9I28jcCQkWiNwI3EjSX0jcSNyI0xSI3J+I0l9TVYjS2ZYUTFzJXA3W09ZI0l9WVpHUVpdI0l9XV5HUV4jbyNJfSNvI3AjTFIjcCNxI0l9I3EjciNMUiNyfiNJfTZ5I0xiXVExcyVnUyVqVyVzcCV2IWIleCN0T1kjTFJZWkhoWl0jTFJdXkhoXnIjTFJycyMreXN3I0xSd3gjTVp4I08jTFIjTyNQJCN1I1AjbyNMUiNvI3AkJFojcH4jTFI2eSNNZl1RMXMlalclc3AleCN0T1kjTFJZWkhoWl0jTFJdXkhoXnIjTFJycyMreXN3I0xSd3gjTl94I08jTFIjTyNQJCN1I1AjbyNMUiNvI3AkJFojcH4jTFI2eSNOal1RMXMlalclc3AleCN0T1kjTFJZWkhoWl0jTFJdXkhoXnIjTFJycyMreXN3I0xSd3gkIGN4I08jTFIjTyNQJCN1I1AjbyNMUiNvI3AkJFojcH4jTFI1YyQgbl1RMXMlalclc3AleCN0T1kkIGNZWkp8Wl0kIGNdXkp8XnIkIGNycyMwcXN3JCBjd3gkIGN4I08kIGMjTyNQJCFnI1AjbyQgYyNvI3AkIXsjcH4kIGM1YyQhbFRRMXNPWSQgY1laSnxaXSQgY11eSnxefiQgYzVjJCNTWlExcyVqV09ZIy99WVo2WlpdIy99XV42Wl5yIy99cnMjMHFzI08jL30jTyNQIzJUI1AjbyMvfSNvI3AkIGMjcH4jL302eSQjelRRMXNPWSNMUllaSGhaXSNMUl1eSGhefiNMUjZ5JCRkXVExcyVnUyVqV09ZIzRQWVo4YlpdIzRQXV44Yl5yIzRQcnMjNHtzdyM0UHd4IzZveCNPIzRQI08jUCM4YyNQI28jNFAjbyNwI0xSI3B+IzRQTVYkJWpfUTFzJXA3WyVqVyVzcCV4I3RPWSNJfVlaR1FaXSNJfV1eR1FeciNJfXJzIUpfc3cjSX13eCQmaXgjTyNJfSNPI1AjS18jUCNvI0l9I28jcCQkWiNwI3EjSX0jcSNyI0xSI3J+I0l9S28kJnZfUTFzJXA3WyVqVyVzcCV4I3RPWSQmaVlaTltaXSQmaV1eTlteciQmaXJzIztSc3ckJml3eCQmaXgjTyQmaSNPI1AkJ3UjUCNvJCZpI28jcCQheyNwI3EkJmkjcSNyJCBjI3J+JCZpS28kJ3xYUTFzJXA3W09ZJCZpWVpOW1pdJCZpXV5OW14jbyQmaSNvI3AkIGMjcCNxJCZpI3EjciQgYyNyfiQmaU1nJChwWFExcyVwN1tPWSFDe1laJH1aXSFDe11eJH1eI28hQ3sjbyNwJCldI3AjcSFDeyNxI3IkKV0jcn4hQ3s3WiQpbl1RMXMlZ1MlalclbWAlc3AldiFiJXgjdE9ZJCldWVohIVNaXSQpXV1eISFTXnIkKV1ycyM/b3N3JCldd3gjTVp4I08kKV0jTyNQJCpnI1AjbyQpXSNvI3AkKnsjcH4kKV03WiQqbFRRMXNPWSQpXVlaISFTWl0kKV1dXiEhU15+JCldN1okK1VdUTFzJWdTJWpXT1kjNFBZWjhiWl0jNFBdXjhiXnIjNFBycyM0e3N3IzRQd3gjNm94I08jNFAjTyNQIzhjI1AjbyM0UCNvI3AkKV0jcH4jNFBHeiQsYl0kfVElcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgJC1aIWAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeiQtblohcyxXJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeiQudF0kd1ElcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgJC1aIWAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyQvfF8lcWAlcDdbJWpXJWUsWCVzcCV4I3RPWSQwe1laR1FaXSQwe11eR1FeciQwe3JzJDJdc3ckMHt3eCRKZXgjTyQweyNPI1AkRncjUCNvJDB7I28jcCRJYyNwI3EkMHsjcSNyJEddI3J+JDB7R2skMV5fJXA3WyVnUyVqVyVlLFglc3AldiFiJXgjdE9ZJDB7WVpHUVpdJDB7XV5HUV5yJDB7cnMkMl1zdyQwe3d4JEV3eCNPJDB7I08jUCRGdyNQI28kMHsjbyNwJEljI3AjcSQweyNxI3IkR10jcn4kMHtEVCQyaF8lcDdbJWdTJWUsWCV2IWJPWSQzZ1laKHlaXSQzZ11eKHleciQzZ3JzJEJhc3ckM2d3eCQ0c3gjTyQzZyNPI1AkNW8jUCNvJDNnI28jcCQ9eyNwI3EkM2cjcSNyJDZUI3J+JDNnRFQkM3RfJXA3WyVnUyVqVyVlLFgldiFiT1kkM2dZWih5Wl0kM2ddXih5XnIkM2dycyQyXXN3JDNnd3gkNHN4I08kM2cjTyNQJDVvI1AjbyQzZyNvI3AkPXsjcCNxJDNnI3EjciQ2VCNyfiQzZ0RUJDR8WiVwN1slalclZSxYT3IoeXJzKXdzdyh5d3g7YngjTyh5I08jUDJWI1Ajbyh5I28jcDduI3AjcSh5I3EjcjJrI3J+KHlEVCQ1dFQlcDdbTyNvJDNnI28jcCQ2VCNwI3EkM2cjcSNyJDZUI3J+JDNnLXckNmBdJWdTJWpXJWUsWCV2IWJPWSQ2VFlaMmtaXSQ2VF1eMmteciQ2VHJzJDdYc3ckNlR3eCQ9UngjTyQ2VCNPI1AkPXUjUCNvJDZUI28jcCQ9eyNwfiQ2VC13JDdiXSVnUyVlLFgldiFiT1kkNlRZWjJrWl0kNlRdXjJrXnIkNlRycyQ4WnN3JDZUd3gkPVJ4I08kNlQjTyNQJD11I1AjbyQ2VCNvI3AkPXsjcH4kNlQtdyQ4ZF0lZ1MlZSxYJXYhYk9ZJDZUWVoya1pdJDZUXV4ya15yJDZUcnMkOV1zdyQ2VHd4JD1SeCNPJDZUI08jUCQ9dSNQI28kNlQjbyNwJD17I3B+JDZULW8kOWZaJWdTJWUsWCV2IWJPWSQ5XVlaLmtaXSQ5XV1eLmtedyQ5XXd4JDpYeCNPJDldI08jUCQ6cyNQI28kOV0jbyNwJDp5I3B+JDldLW8kOl5WJWUsWE93Lmt3eC9xeCNPLmsjTyNQMFcjUCNvLmsjbyNwMF4jcH4uay1vJDp2UE9+JDldLW8kO1FaJWdTJWUsWE9ZJDtzWVoweFpdJDtzXV4weF53JDtzd3gkPGd4I08kO3MjTyNQJDx7I1AjbyQ7cyNvI3AkOV0jcH4kO3MsXSQ7elglZ1MlZSxYT1kkO3NZWjB4Wl0kO3NdXjB4XnckO3N3eCQ8Z3gjTyQ7cyNPI1AkPHsjUH4kO3MsXSQ8bFQlZSxYT3cweHd4MXB4I08weCNPI1AyUCNQfjB4LF0kPU9QT34kO3MtdyQ9WVglalclZSxYT3Iya3JzM2FzdzJrd3g1aXgjTzJrI08jUDdoI1AjbzJrI28jcDduI3B+MmstdyQ9eFBPfiQ2VC13JD5VXSVnUyVqVyVlLFhPWSQ+fVlaOGJaXSQ+fV1eOGJeciQ+fXJzJD95c3ckPn13eCRBbXgjTyQ+fSNPI1AkQlojUCNvJD59I28jcCQ2VCNwfiQ+fSxlJD9XWiVnUyVqVyVlLFhPWSQ+fVlaOGJaXSQ+fV1eOGJeciQ+fXJzJD95c3ckPn13eCRBbXgjTyQ+fSNPI1AkQlojUH4kPn0sZSRAUVolZ1MlZSxYT1kkPn1ZWjhiWl0kPn1dXjhiXnIkPn1ycyRAc3N3JD59d3gkQW14I08kPn0jTyNQJEJaI1B+JD59LGUkQHpaJWdTJWUsWE9ZJD59WVo4YlpdJD59XV44Yl5yJD59cnMkO3NzdyQ+fXd4JEFteCNPJD59I08jUCRCWiNQfiQ+fSxlJEF0ViVqVyVlLFhPcjhicnM5T3N3OGJ3eDpweCNPOGIjTyNQO1sjUH44YixlJEJeUE9+JD59RFQkQmxfJXA3WyVnUyVlLFgldiFiT1kkM2dZWih5Wl0kM2ddXih5XnIkM2dycyRDa3N3JDNnd3gkNHN4I08kM2cjTyNQJDVvI1AjbyQzZyNvI3AkPXsjcCNxJDNnI3EjciQ2VCNyfiQzZ0N7JEN2XSVwN1slZ1MlZSxYJXYhYk9ZJENrWVorb1pdJENrXV4rb153JENrd3gkRG94I08kQ2sjTyNQJEVjI1AjbyRDayNvI3AkOnkjcCNxJENrI3EjciQ5XSNyfiRDa0N7JER2WCVwN1slZSxYT3crb3d4LVZ4I08rbyNPI1AuViNQI28rbyNvI3AwXiNwI3ErbyNxI3IuayNyfitvQ3skRWhUJXA3W08jbyRDayNvI3AkOV0jcCNxJENrI3EjciQ5XSNyfiRDa0drJEZVWiVwN1slalclZSxYJXNwJXgjdE9yR1Fycyl3c3dHUXd4TV54I09HUSNPI1BIUyNQI29HUSNvI3BMaiNwI3FHUSNxI3JIaCNyfkdRR2skRnxUJXA3W08jbyQweyNvI3AkR10jcCNxJDB7I3EjciRHXSNyfiQwezFfJEdsXSVnUyVqVyVlLFglc3AldiFiJXgjdE9ZJEddWVpIaFpdJEddXV5IaF5yJEddcnMkN1hzdyRHXXd4JEhleCNPJEddI08jUCRJXSNQI28kR10jbyNwJEljI3B+JEddMV8kSHBYJWpXJWUsWCVzcCV4I3RPckhocnMzYXN3SGh3eEpXeCNPSGgjTyNQTGQjUCNvSGgjbyNwTGojcH5IaDFfJElgUE9+JEddMV8kSWxdJWdTJWpXJWUsWE9ZJD59WVo4YlpdJD59XV44Yl5yJD59cnMkP3lzdyQ+fXd4JEFteCNPJD59I08jUCRCWiNQI28kPn0jbyNwJEddI3B+JD59R2skSnJaJXA3WyVqVyVlLFglc3AleCN0T3JHUXJzKXdzd0dRd3gkS2V4I09HUSNPI1BIUyNQI29HUSNvI3BMaiNwI3FHUSNxI3JIaCNyfkdRR2skS3RaJWghZiVwN1slalclZixYJXNwJXgjdE9yTltycz1Pc3dOW3d4Tlt4I09OWyNPI1AhIFkjUCNvTlsjbyNwS3gjcCNxTlsjcSNySnwjcn5OW0d7JEx6WmYsWCVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4I08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9PHUkTlFaIU9SJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyUgV19ULFglcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeHokfXp7JSFWeyFfJH0hXyFgJC1aIWAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyUhal1fUiVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JSN2XSR6LFglcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgJC1aIWAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH08dSUlU1p3UiVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4I08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9TWclJlleJHssWCVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCFhJSdVIWEjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1CXiUnaVomUyZqJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyUob18hZFElcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFPJH0hTyFQJSluIVAhUSR9IVEhWyUsTyFbI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3slKlBdJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghTyR9IU8hUCUqeCFQI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3slK11aIW0sWCVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4I08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3klLGNnIWYsViVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IVEkfSFRIVslLE8hWyFnJH0hZyFoJS16IWghbCR9IWwhbSUyWyFtI08kfSNPI1AhIG4jUCNSJH0jUiNTJSxPI1MjWCR9I1gjWSUteiNZI14kfSNeI18lMlsjXyNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3klLl1hJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3h7JH17fCUvYnx9JH19IU8lL2IhTyFRJH0hUSFbJTBsIVsjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSUvc10lcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFbJTBsIVsjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSUxUGMhZixWJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghUSR9IVEhWyUwbCFbIWwkfSFsIW0lMlshbSNPJH0jTyNQISBuI1AjUiR9I1IjUyUwbCNTI14kfSNeI18lMlsjXyNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3klMm9aIWYsViVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4I08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3slM3VfJHxSJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghUCR9IVAhUSU0dCFRIV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd6JTVYXSVPUSVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5JTZldSFmLFYlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFPJH0hTyFQJTh4IVAhUSR9IVEhWyU6UyFbIWQkfSFkIWUlPFUhZSFnJH0hZyFoJS16IWghbCR9IWwhbSUyWyFtIXEkfSFxIXIlP08hciF6JH0heiF7JUFyIXsjTyR9I08jUCEgbiNQI1IkfSNSI1MlOlMjUyNVJH0jVSNWJTxVI1YjWCR9I1gjWSUteiNZI14kfSNeI18lMlsjXyNjJH0jYyNkJT9PI2QjbCR9I2wjbSVBciNtI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSU5Wl0lcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFbJSxPIVsjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSU6Z2khZixWJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghTyR9IU8hUCU4eCFQIVEkfSFRIVslOlMhWyFnJH0hZyFoJS16IWghbCR9IWwhbSUyWyFtI08kfSNPI1AhIG4jUCNSJH0jUiNTJTpTI1MjWCR9I1gjWSUteiNZI14kfSNeI18lMlsjXyNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3klPGdgJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghUSR9IVEhUiU9aSFSIVMlPWkhUyNPJH0jTyNQISBuI1AjUiR9I1IjUyU9aSNTI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSU9fGAhZixWJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghUSR9IVEhUiU9aSFSIVMlPWkhUyNPJH0jTyNQISBuI1AjUiR9I1IjUyU9aSNTI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSU/YV8lcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFZJUBgIVkjTyR9I08jUCEgbiNQI1IkfSNSI1MlQGAjUyNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3klQHNfIWYsViVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IVEkfSFRIVklQGAhWSNPJH0jTyNQISBuI1AjUiR9I1IjUyVAYCNTI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSVCVGMlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFbJUNgIVshYyR9IWMhaSVDYCFpI08kfSNPI1AhIG4jUCNSJH0jUiNTJUNgI1MjVCR9I1QjWiVDYCNaI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeSVDc2MhZixWJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghUSR9IVEhWyVDYCFbIWMkfSFjIWklQ2AhaSNPJH0jTyNQISBuI1AjUiR9I1IjUyVDYCNTI1QkfSNUI1olQ2AjWiNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9TWclRWNdeDFzJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCVGWyFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9PHUlRm9aJVdSJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyVHdVojXixYJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1HeyVIe19qUiVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV4kfSFeIV8lSXohXyFgISdtIWAhYSEnbSFhI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3olSl9dJHhRJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCQtWiFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9R3slS2tdJVYsWCVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAhJ20hYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JUx3XmpSJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCEnbSFgIWElTXMhYSNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd6JU5XXSR5USVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd7JiBmXV1RI3RQJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3ghXyR9IV8hYCQtWiFgI08kfSNPI1AhIG4jUCNvJH0jbyNwISNVI3AjcSR9I3EjciEhUyNyfiR9TWcmIXRjJXA3WyVnUyVqVyVkJmolbWAlc3AldiFiJXgjdCVRLFhPciR9cnMmUnN3JH13eEZTeCFRJH0hUSFbJiFfIVshYyR9IWMhfSYhXyF9I08kfSNPI1AhIG4jUCNSJH0jUiNTJiFfI1MjVCR9I1QjbyYhXyNvI3AhI1UjcCNxJH0jcSNyISFTI3IkZyR9JGd+JiFfTWcmJGZnJXA3WyVnUyVqVyVkJmolbWAlc3AldiFiJXgjdCVRLFhPciR9cnMmJX1zdyR9d3gmKVR4IVEkfSFRIVsmIV8hWyFjJH0hYyF0JiFfIXQhdSYsYSF1IX0mIV8hfSNPJH0jTyNQISBuI1AjUiR9I1IjUyYhXyNTI1QkfSNUI2YmIV8jZiNnJixhI2cjbyYhXyNvI3AhI1UjcCNxJH0jcSNyISFTI3IkZyR9JGd+JiFfRGUmJltfJXA3WyVnUyVlLFglbWAldiFiT1khK1hZWidQWl0hK1hdXidQXnIhK1hycyYnWnN3IStYd3ghLWd4I08hK1gjTyNQIT5lI1AjbyErWCNvI3AhQH0jcCNxIStYI3EjciE+eSNyfiErWERlJidoWiVwN1slZ1MlZSxYJW1gJXYhYk9yJ1BycyYoWnN3J1B3eChQeCNPJ1AjTyNQPnYjUCNvJ1AjbyNwQ1UjcCNxJ1AjcSNyP1sjcn4nUERdJihoWCVwN1slZ1MlaSxYJW1gJXYhYk93RHZ3eCxleCNPRHYjTyNQRW4jUCNvRHYjbyNwQmQjcCNxRHYjcSNyQW4jcn5EdkdrJiliXyVwN1slalclZSxYJXNwJXgjdE9ZJDB7WVpHUVpdJDB7XV5HUV5yJDB7cnMkMl1zdyQwe3d4JipheCNPJDB7I08jUCRGdyNQI28kMHsjbyNwJEljI3AjcSQweyNxI3IkR10jcn4kMHtHayYqblolcDdbJWpXJWUsWCVzcCV4I3RPckdRcnMpd3N3R1F3eCYrYXgjT0dRI08jUEhTI1Ajb0dRI28jcExqI3AjcUdRI3EjckhoI3J+R1FGVCYrblolcDdbJWpXJWYsWCVzcCV4I3RPck5bcnM9T3N3Tlt3eE5beCNPTlsjTyNQISBZI1Ajb05bI28jcEt4I3AjcU5bI3Ejckp8I3J+TltNZyYsdmMlcDdbJWdTJWpXJWQmaiVtYCVzcCV2IWIleCN0JVEsWE9yJH1ycyYlfXN3JH13eCYpVHghUSR9IVEhWyYhXyFbIWMkfSFjIX0mIV8hfSNPJH0jTyNQISBuI1AjUiR9I1IjUyYhXyNTI1QkfSNUI28mIV8jbyNwISNVI3AjcSR9I3EjciEhUyNyJGckfSRnfiYhX01nJi5oZyVwN1slZ1MlalclZCZqJW1gJXNwJXYhYiV4I3QlUSxYT3IkfXJzJjBQc3ckfXd4JjJ3eCFRJH0hUSFbJiFfIVshYyR9IWMhdCYhXyF0IXUmNXUhdSF9JiFfIX0jTyR9I08jUCEgbiNQI1IkfSNSI1MmIV8jUyNUJH0jVCNmJiFfI2YjZyY1dSNnI28mIV8jbyNwISNVI3AjcSR9I3EjciEhUyNyJGckfSRnfiYhX0RlJjBeWiVwN1slZ1MlbWAldiFiJXIsWE9yJ1BycyYxUHN3J1B3eChQeCNPJ1AjTyNQPnYjUCNvJ1AjbyNwQ1UjcCNxJ1AjcSNyP1sjcn4nUERlJjFbWiVwN1slZ1MlbWAldiFiT3InUHJzJjF9c3cnUHd4KFB4I08nUCNPI1A+diNQI28nUCNvI3BDVSNwI3EnUCNxI3I/WyNyfidQRF0mMltYJXA3WyVnUyV3LFglbWAldiFiT3dEdnd4LGV4I09EdiNPI1BFbiNQI29EdiNvI3BCZCNwI3FEdiNxI3JBbiNyfkR2R2smM1VaJXA3WyVqVyVzcCV4I3QlbCxYT3JHUXJzKXdzd0dRd3gmM3d4I09HUSNPI1BIUyNQI29HUSNvI3BMaiNwI3FHUSNxI3JIaCNyfkdRR2smNFNaJXA3WyVqVyVzcCV4I3RPckdRcnMpd3N3R1F3eCY0dXgjT0dRI08jUEhTI1Ajb0dRI28jcExqI3AjcUdRI3EjckhoI3J+R1FGVCY1U1olcDdbJWpXJXUsWCVzcCV4I3RPck5bcnM9T3N3Tlt3eE5beCNPTlsjTyNQISBZI1Ajb05bI28jcEt4I3AjcU5bI3Ejckp8I3J+TltNZyY2W2MlcDdbJWdTJWpXJWQmaiVtYCVzcCV2IWIleCN0JVEsWE9yJH1ycyYwUHN3JH13eCYyd3ghUSR9IVEhWyYhXyFbIWMkfSFjIX0mIV8hfSNPJH0jTyNQISBuI1AjUiR9I1IjUyYhXyNTI1QkfSNUI28mIV8jbyNwISNVI3AjcSR9I3EjciEhUyNyJGckfSRnfiYhX01nJjd8ayVwN1slZ1MlalclZCZqJW1gJXNwJXYhYiV4I3QlUSxYT3IkfXJzJiV9c3ckfXd4JilUeCFRJH0hUSFbJiFfIVshYyR9IWMhaCYhXyFoIWkmNXUhaSF0JiFfIXQhdSYsYSF1IX0mIV8hfSNPJH0jTyNQISBuI1AjUiR9I1IjUyYhXyNTI1QkfSNUI1UmIV8jVSNWJixhI1YjWSYhXyNZI1omNXUjWiNvJiFfI28jcCEjVSNwI3EkfSNxI3IhIVMjciRnJH0kZ34mIV9HeyY6VVohVixYJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH08dSY7W1ohV1IlcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd6JjxiXSR2USVwN1slZ1MlalclbWAlc3AldiFiJXgjdE9yJH1ycyZSc3ckfXd4RlN4IV8kfSFfIWAkLVohYCNPJH0jTyNQISBuI1AjbyR9I28jcCEjVSNwI3EkfSNxI3IhIVMjcn4kfUd5Jj1kWCVnUyVqVyFaR21PcjhicnM5T3N3OGJ3eDpVeCNPOGIjTyNQO1sjUCNvOGIjbyNwISFTI3B+OGJHeiY+ZF0kdVElcDdbJWdTJWpXJW1gJXNwJXYhYiV4I3RPciR9cnMmUnN3JH13eEZTeCFfJH0hXyFgJC1aIWAjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH08dSY/blghWzdfJWdTJWpXJW1gJXNwJXYhYiV4I3RPciEhU3JzQFNzdyEhU3d4SWJ4I08hIVMjTyNQISNPI1AjbyEhUyNvI3AhI1UjcH4hIVNHeSZAblolUCxWJXA3WyVnUyVqVyVtYCVzcCV2IWIleCN0T3IkfXJzJlJzdyR9d3hGU3gjTyR9I08jUCEgbiNQI28kfSNvI3AhI1UjcCNxJH0jcSNyISFTI3J+JH1cIixcbiAgdG9rZW5pemVyczogW2xlZ2FjeVByaW50LCBpbmRlbnRhdGlvbiwgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIG5ld2xpbmVzXSxcbiAgdG9wUnVsZXM6IHtcIlNjcmlwdFwiOlswLDNdfSxcbiAgc3BlY2lhbGl6ZWQ6IFt7dGVybTogMTg2LCBnZXQ6IHZhbHVlID0+IHNwZWNfaWRlbnRpZmllclt2YWx1ZV0gfHwgLTF9XSxcbiAgdG9rZW5QcmVjOiA2NTk0XG59KTtcblxuZXhwb3J0cy5wYXJzZXIgPSBwYXJzZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbi8vLyBUaGUgZGVmYXVsdCBtYXhpbXVtIGxlbmd0aCBvZiBhIGBUcmVlQnVmZmVyYCBub2RlLlxuY29uc3QgRGVmYXVsdEJ1ZmZlckxlbmd0aCA9IDEwMjQ7XG5sZXQgbmV4dFByb3BJRCA9IDA7XG5jb25zdCBDYWNoZWROb2RlID0gbmV3IFdlYWtNYXAoKTtcbi8vLyBFYWNoIFtub2RlIHR5cGVdKCN0cmVlLk5vZGVUeXBlKSBjYW4gaGF2ZSBtZXRhZGF0YSBhc3NvY2lhdGVkIHdpdGhcbi8vLyBpdCBpbiBwcm9wcy4gSW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MgcmVwcmVzZW50IHByb3AgbmFtZXMuXG5jbGFzcyBOb2RlUHJvcCB7XG4gICAgLy8vIENyZWF0ZSBhIG5ldyBub2RlIHByb3AgdHlwZS4gWW91IGNhbiBvcHRpb25hbGx5IHBhc3MgYVxuICAgIC8vLyBgZGVzZXJpYWxpemVgIGZ1bmN0aW9uLlxuICAgIGNvbnN0cnVjdG9yKHsgZGVzZXJpYWxpemUgfSA9IHt9KSB7XG4gICAgICAgIHRoaXMuaWQgPSBuZXh0UHJvcElEKys7XG4gICAgICAgIHRoaXMuZGVzZXJpYWxpemUgPSBkZXNlcmlhbGl6ZSB8fCAoKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBub2RlIHR5cGUgZG9lc24ndCBkZWZpbmUgYSBkZXNlcmlhbGl6ZSBmdW5jdGlvblwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vLyBDcmVhdGUgYSBzdHJpbmctdmFsdWVkIG5vZGUgcHJvcCB3aG9zZSBkZXNlcmlhbGl6ZSBmdW5jdGlvbiBpc1xuICAgIC8vLyB0aGUgaWRlbnRpdHkgZnVuY3Rpb24uXG4gICAgc3RhdGljIHN0cmluZygpIHsgcmV0dXJuIG5ldyBOb2RlUHJvcCh7IGRlc2VyaWFsaXplOiBzdHIgPT4gc3RyIH0pOyB9XG4gICAgLy8vIENyZWF0ZSBhIG51bWJlci12YWx1ZWQgbm9kZSBwcm9wIHdob3NlIGRlc2VyaWFsaXplIGZ1bmN0aW9uIGlzXG4gICAgLy8vIGp1c3QgYE51bWJlcmAuXG4gICAgc3RhdGljIG51bWJlcigpIHsgcmV0dXJuIG5ldyBOb2RlUHJvcCh7IGRlc2VyaWFsaXplOiBOdW1iZXIgfSk7IH1cbiAgICAvLy8gQ3JlYXRlcyBhIGJvb2xlYW4tdmFsdWVkIG5vZGUgcHJvcCB3aG9zZSBkZXNlcmlhbGl6ZSBmdW5jdGlvblxuICAgIC8vLyByZXR1cm5zIHRydWUgZm9yIGFueSBpbnB1dC5cbiAgICBzdGF0aWMgZmxhZygpIHsgcmV0dXJuIG5ldyBOb2RlUHJvcCh7IGRlc2VyaWFsaXplOiAoKSA9PiB0cnVlIH0pOyB9XG4gICAgLy8vIFN0b3JlIGEgdmFsdWUgZm9yIHRoaXMgcHJvcCBpbiB0aGUgZ2l2ZW4gb2JqZWN0LiBUaGlzIGNhbiBiZVxuICAgIC8vLyB1c2VmdWwgd2hlbiBidWlsZGluZyB1cCBhIHByb3Agb2JqZWN0IHRvIHBhc3MgdG8gdGhlXG4gICAgLy8vIFtgTm9kZVR5cGVgXSgjdHJlZS5Ob2RlVHlwZSkgY29uc3RydWN0b3IuIFJldHVybnMgaXRzIGZpcnN0XG4gICAgLy8vIGFyZ3VtZW50LlxuICAgIHNldChwcm9wT2JqLCB2YWx1ZSkge1xuICAgICAgICBwcm9wT2JqW3RoaXMuaWRdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBwcm9wT2JqO1xuICAgIH1cbiAgICAvLy8gVGhpcyBpcyBtZWFudCB0byBiZSB1c2VkIHdpdGhcbiAgICAvLy8gW2BOb2RlU2V0LmV4dGVuZGBdKCN0cmVlLk5vZGVTZXQuZXh0ZW5kKSBvclxuICAgIC8vLyBbYFBhcnNlci53aXRoUHJvcHNgXSgjbGV6ZXIuUGFyc2VyLndpdGhQcm9wcykgdG8gY29tcHV0ZSBwcm9wXG4gICAgLy8vIHZhbHVlcyBmb3IgZWFjaCBub2RlIHR5cGUgaW4gdGhlIHNldC4gVGFrZXMgYSBbbWF0Y2hcbiAgICAvLy8gb2JqZWN0XSgjdHJlZS5Ob2RlVHlwZV5tYXRjaCkgb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHVuZGVmaW5lZFxuICAgIC8vLyBpZiB0aGUgbm9kZSB0eXBlIGRvZXNuJ3QgZ2V0IHRoaXMgcHJvcCwgYW5kIHRoZSBwcm9wJ3MgdmFsdWUgaWZcbiAgICAvLy8gaXQgZG9lcy5cbiAgICBhZGQobWF0Y2gpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtYXRjaCAhPSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICBtYXRjaCA9IE5vZGVUeXBlLm1hdGNoKG1hdGNoKTtcbiAgICAgICAgcmV0dXJuICh0eXBlKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gbWF0Y2godHlwZSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBudWxsIDogW3RoaXMsIHJlc3VsdF07XG4gICAgICAgIH07XG4gICAgfVxufVxuLy8vIFByb3AgdGhhdCBpcyB1c2VkIHRvIGRlc2NyaWJlIG1hdGNoaW5nIGRlbGltaXRlcnMuIEZvciBvcGVuaW5nXG4vLy8gZGVsaW1pdGVycywgdGhpcyBob2xkcyBhbiBhcnJheSBvZiBub2RlIG5hbWVzICh3cml0dGVuIGFzIGFcbi8vLyBzcGFjZS1zZXBhcmF0ZWQgc3RyaW5nIHdoZW4gZGVjbGFyaW5nIHRoaXMgcHJvcCBpbiBhIGdyYW1tYXIpXG4vLy8gZm9yIHRoZSBub2RlIHR5cGVzIG9mIGNsb3NpbmcgZGVsaW1pdGVycyB0aGF0IG1hdGNoIGl0LlxuTm9kZVByb3AuY2xvc2VkQnkgPSBuZXcgTm9kZVByb3AoeyBkZXNlcmlhbGl6ZTogc3RyID0+IHN0ci5zcGxpdChcIiBcIikgfSk7XG4vLy8gVGhlIGludmVyc2Ugb2YgW2BvcGVuZWRCeWBdKCN0cmVlLk5vZGVQcm9wXmNsb3NlZEJ5KS4gVGhpcyBpc1xuLy8vIGF0dGFjaGVkIHRvIGNsb3NpbmcgZGVsaW1pdGVycywgaG9sZGluZyBhbiBhcnJheSBvZiBub2RlIG5hbWVzXG4vLy8gb2YgdHlwZXMgb2YgbWF0Y2hpbmcgb3BlbmluZyBkZWxpbWl0ZXJzLlxuTm9kZVByb3Aub3BlbmVkQnkgPSBuZXcgTm9kZVByb3AoeyBkZXNlcmlhbGl6ZTogc3RyID0+IHN0ci5zcGxpdChcIiBcIikgfSk7XG4vLy8gVXNlZCB0byBhc3NpZ24gbm9kZSB0eXBlcyB0byBncm91cHMgKGZvciBleGFtcGxlLCBhbGwgbm9kZVxuLy8vIHR5cGVzIHRoYXQgcmVwcmVzZW50IGFuIGV4cHJlc3Npb24gY291bGQgYmUgdGFnZ2VkIHdpdGggYW5cbi8vLyBgXCJFeHByZXNzaW9uXCJgIGdyb3VwKS5cbk5vZGVQcm9wLmdyb3VwID0gbmV3IE5vZGVQcm9wKHsgZGVzZXJpYWxpemU6IHN0ciA9PiBzdHIuc3BsaXQoXCIgXCIpIH0pO1xuY29uc3Qgbm9Qcm9wcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4vLy8gRWFjaCBub2RlIGluIGEgc3ludGF4IHRyZWUgaGFzIGEgbm9kZSB0eXBlIGFzc29jaWF0ZWQgd2l0aCBpdC5cbmNsYXNzIE5vZGVUeXBlIHtcbiAgICAvLy8gQGludGVybmFsXG4gICAgY29uc3RydWN0b3IoXG4gICAgLy8vIFRoZSBuYW1lIG9mIHRoZSBub2RlIHR5cGUuIE5vdCBuZWNlc3NhcmlseSB1bmlxdWUsIGJ1dCBpZiB0aGVcbiAgICAvLy8gZ3JhbW1hciB3YXMgd3JpdHRlbiBwcm9wZXJseSwgZGlmZmVyZW50IG5vZGUgdHlwZXMgd2l0aCB0aGVcbiAgICAvLy8gc2FtZSBuYW1lIHdpdGhpbiBhIG5vZGUgc2V0IHNob3VsZCBwbGF5IHRoZSBzYW1lIHNlbWFudGljXG4gICAgLy8vIHJvbGUuXG4gICAgbmFtZSwgXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHByb3BzLCBcbiAgICAvLy8gVGhlIGlkIG9mIHRoaXMgbm9kZSBpbiBpdHMgc2V0LiBDb3JyZXNwb25kcyB0byB0aGUgdGVybSBpZHNcbiAgICAvLy8gdXNlZCBpbiB0aGUgcGFyc2VyLlxuICAgIGlkLCBcbiAgICAvLy8gQGludGVybmFsXG4gICAgZmxhZ3MgPSAwKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmZsYWdzID0gZmxhZ3M7XG4gICAgfVxuICAgIHN0YXRpYyBkZWZpbmUoc3BlYykge1xuICAgICAgICBsZXQgcHJvcHMgPSBzcGVjLnByb3BzICYmIHNwZWMucHJvcHMubGVuZ3RoID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IG5vUHJvcHM7XG4gICAgICAgIGxldCBmbGFncyA9IChzcGVjLnRvcCA/IDEgLyogVG9wICovIDogMCkgfCAoc3BlYy5za2lwcGVkID8gMiAvKiBTa2lwcGVkICovIDogMCkgfFxuICAgICAgICAgICAgKHNwZWMuZXJyb3IgPyA0IC8qIEVycm9yICovIDogMCkgfCAoc3BlYy5uYW1lID09IG51bGwgPyA4IC8qIEFub255bW91cyAqLyA6IDApO1xuICAgICAgICBsZXQgdHlwZSA9IG5ldyBOb2RlVHlwZShzcGVjLm5hbWUgfHwgXCJcIiwgcHJvcHMsIHNwZWMuaWQsIGZsYWdzKTtcbiAgICAgICAgaWYgKHNwZWMucHJvcHMpXG4gICAgICAgICAgICBmb3IgKGxldCBzcmMgb2Ygc3BlYy5wcm9wcykge1xuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShzcmMpKVxuICAgICAgICAgICAgICAgICAgICBzcmMgPSBzcmModHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKHNyYylcbiAgICAgICAgICAgICAgICAgICAgc3JjWzBdLnNldChwcm9wcywgc3JjWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICAgIC8vLyBSZXRyaWV2ZXMgYSBub2RlIHByb3AgZm9yIHRoaXMgdHlwZS4gV2lsbCByZXR1cm4gYHVuZGVmaW5lZGAgaWZcbiAgICAvLy8gdGhlIHByb3AgaXNuJ3QgcHJlc2VudCBvbiB0aGlzIG5vZGUuXG4gICAgcHJvcChwcm9wKSB7IHJldHVybiB0aGlzLnByb3BzW3Byb3AuaWRdOyB9XG4gICAgLy8vIFRydWUgd2hlbiB0aGlzIGlzIHRoZSB0b3Agbm9kZSBvZiBhIGdyYW1tYXIuXG4gICAgZ2V0IGlzVG9wKCkgeyByZXR1cm4gKHRoaXMuZmxhZ3MgJiAxIC8qIFRvcCAqLykgPiAwOyB9XG4gICAgLy8vIFRydWUgd2hlbiB0aGlzIG5vZGUgaXMgcHJvZHVjZWQgYnkgYSBza2lwIHJ1bGUuXG4gICAgZ2V0IGlzU2tpcHBlZCgpIHsgcmV0dXJuICh0aGlzLmZsYWdzICYgMiAvKiBTa2lwcGVkICovKSA+IDA7IH1cbiAgICAvLy8gSW5kaWNhdGVzIHdoZXRoZXIgdGhpcyBpcyBhbiBlcnJvciBub2RlLlxuICAgIGdldCBpc0Vycm9yKCkgeyByZXR1cm4gKHRoaXMuZmxhZ3MgJiA0IC8qIEVycm9yICovKSA+IDA7IH1cbiAgICAvLy8gV2hlbiB0cnVlLCB0aGlzIG5vZGUgdHlwZSBkb2Vzbid0IGNvcnJlc3BvbmQgdG8gYSB1c2VyLWRlY2xhcmVkXG4gICAgLy8vIG5hbWVkIG5vZGUsIGZvciBleGFtcGxlIGJlY2F1c2UgaXQgaXMgdXNlZCB0byBjYWNoZSByZXBldGl0aW9uLlxuICAgIGdldCBpc0Fub255bW91cygpIHsgcmV0dXJuICh0aGlzLmZsYWdzICYgOCAvKiBBbm9ueW1vdXMgKi8pID4gMDsgfVxuICAgIC8vLyBSZXR1cm5zIHRydWUgd2hlbiB0aGlzIG5vZGUncyBuYW1lIG9yIG9uZSBvZiBpdHNcbiAgICAvLy8gW2dyb3Vwc10oI3RyZWUuTm9kZVByb3BeZ3JvdXApIG1hdGNoZXMgdGhlIGdpdmVuIHN0cmluZy5cbiAgICBpcyhuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKHRoaXMubmFtZSA9PSBuYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgbGV0IGdyb3VwID0gdGhpcy5wcm9wKE5vZGVQcm9wLmdyb3VwKTtcbiAgICAgICAgICAgIHJldHVybiBncm91cCA/IGdyb3VwLmluZGV4T2YobmFtZSkgPiAtMSA6IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmlkID09IG5hbWU7XG4gICAgfVxuICAgIC8vLyBDcmVhdGUgYSBmdW5jdGlvbiBmcm9tIG5vZGUgdHlwZXMgdG8gYXJiaXRyYXJ5IHZhbHVlcyBieVxuICAgIC8vLyBzcGVjaWZ5aW5nIGFuIG9iamVjdCB3aG9zZSBwcm9wZXJ0eSBuYW1lcyBhcmUgbm9kZSBvclxuICAgIC8vLyBbZ3JvdXBdKCN0cmVlLk5vZGVQcm9wXmdyb3VwKSBuYW1lcy4gT2Z0ZW4gdXNlZnVsIHdpdGhcbiAgICAvLy8gW2BOb2RlUHJvcC5hZGRgXSgjdHJlZS5Ob2RlUHJvcC5hZGQpLiBZb3UgY2FuIHB1dCBtdWx0aXBsZVxuICAgIC8vLyBuYW1lcywgc2VwYXJhdGVkIGJ5IHNwYWNlcywgaW4gYSBzaW5nbGUgcHJvcGVydHkgbmFtZSB0byBtYXBcbiAgICAvLy8gbXVsdGlwbGUgbm9kZSBuYW1lcyB0byBhIHNpbmdsZSB2YWx1ZS5cbiAgICBzdGF0aWMgbWF0Y2gobWFwKSB7XG4gICAgICAgIGxldCBkaXJlY3QgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBmb3IgKGxldCBwcm9wIGluIG1hcClcbiAgICAgICAgICAgIGZvciAobGV0IG5hbWUgb2YgcHJvcC5zcGxpdChcIiBcIikpXG4gICAgICAgICAgICAgICAgZGlyZWN0W25hbWVdID0gbWFwW3Byb3BdO1xuICAgICAgICByZXR1cm4gKG5vZGUpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGdyb3VwcyA9IG5vZGUucHJvcChOb2RlUHJvcC5ncm91cCksIGkgPSAtMTsgaSA8IChncm91cHMgPyBncm91cHMubGVuZ3RoIDogMCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IGRpcmVjdFtpIDwgMCA/IG5vZGUubmFtZSA6IGdyb3Vwc1tpXV07XG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxufVxuLy8vIEFuIGVtcHR5IGR1bW15IG5vZGUgdHlwZSB0byB1c2Ugd2hlbiBubyBhY3R1YWwgdHlwZSBpcyBhdmFpbGFibGUuXG5Ob2RlVHlwZS5ub25lID0gbmV3IE5vZGVUeXBlKFwiXCIsIE9iamVjdC5jcmVhdGUobnVsbCksIDAsIDggLyogQW5vbnltb3VzICovKTtcbi8vLyBBIG5vZGUgc2V0IGhvbGRzIGEgY29sbGVjdGlvbiBvZiBub2RlIHR5cGVzLiBJdCBpcyB1c2VkIHRvXG4vLy8gY29tcGFjdGx5IHJlcHJlc2VudCB0cmVlcyBieSBzdG9yaW5nIHRoZWlyIHR5cGUgaWRzLCByYXRoZXIgdGhhbiBhXG4vLy8gZnVsbCBwb2ludGVyIHRvIHRoZSB0eXBlIG9iamVjdCwgaW4gYSBudW1iZXIgYXJyYXkuIEVhY2ggcGFyc2VyXG4vLy8gW2hhc10oI2xlemVyLlBhcnNlci5ub2RlU2V0KSBhIG5vZGUgc2V0LCBhbmQgW3RyZWVcbi8vLyBidWZmZXJzXSgjdHJlZS5UcmVlQnVmZmVyKSBjYW4gb25seSBzdG9yZSBjb2xsZWN0aW9ucyBvZiBub2Rlc1xuLy8vIGZyb20gdGhlIHNhbWUgc2V0LiBBIHNldCBjYW4gaGF2ZSBhIG1heGltdW0gb2YgMioqMTYgKDY1NTM2KVxuLy8vIG5vZGUgdHlwZXMgaW4gaXQsIHNvIHRoYXQgdGhlIGlkcyBmaXQgaW50byAxNi1iaXQgdHlwZWQgYXJyYXlcbi8vLyBzbG90cy5cbmNsYXNzIE5vZGVTZXQge1xuICAgIC8vLyBDcmVhdGUgYSBzZXQgd2l0aCB0aGUgZ2l2ZW4gdHlwZXMuIFRoZSBgaWRgIHByb3BlcnR5IG9mIGVhY2hcbiAgICAvLy8gdHlwZSBzaG91bGQgY29ycmVzcG9uZCB0byBpdHMgcG9zaXRpb24gd2l0aGluIHRoZSBhcnJheS5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAvLy8gVGhlIG5vZGUgdHlwZXMgaW4gdGhpcyBzZXQsIGJ5IGlkLlxuICAgIHR5cGVzKSB7XG4gICAgICAgIHRoaXMudHlwZXMgPSB0eXBlcztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIGlmICh0eXBlc1tpXS5pZCAhPSBpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiTm9kZSB0eXBlIGlkcyBzaG91bGQgY29ycmVzcG9uZCB0byBhcnJheSBwb3NpdGlvbnMgd2hlbiBjcmVhdGluZyBhIG5vZGUgc2V0XCIpO1xuICAgIH1cbiAgICAvLy8gQ3JlYXRlIGEgY29weSBvZiB0aGlzIHNldCB3aXRoIHNvbWUgbm9kZSBwcm9wZXJ0aWVzIGFkZGVkLiBUaGVcbiAgICAvLy8gYXJndW1lbnRzIHRvIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBjcmVhdGVkIHdpdGhcbiAgICAvLy8gW2BOb2RlUHJvcC5hZGRgXSgjdHJlZS5Ob2RlUHJvcC5hZGQpLlxuICAgIGV4dGVuZCguLi5wcm9wcykge1xuICAgICAgICBsZXQgbmV3VHlwZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdHlwZSBvZiB0aGlzLnR5cGVzKSB7XG4gICAgICAgICAgICBsZXQgbmV3UHJvcHMgPSBudWxsO1xuICAgICAgICAgICAgZm9yIChsZXQgc291cmNlIG9mIHByb3BzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGFkZCA9IHNvdXJjZSh0eXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoYWRkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV3UHJvcHMpXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIHR5cGUucHJvcHMpO1xuICAgICAgICAgICAgICAgICAgICBhZGRbMF0uc2V0KG5ld1Byb3BzLCBhZGRbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1R5cGVzLnB1c2gobmV3UHJvcHMgPyBuZXcgTm9kZVR5cGUodHlwZS5uYW1lLCBuZXdQcm9wcywgdHlwZS5pZCwgdHlwZS5mbGFncykgOiB0eXBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IE5vZGVTZXQobmV3VHlwZXMpO1xuICAgIH1cbn1cbi8vLyBBIHBpZWNlIG9mIHN5bnRheCB0cmVlLiBUaGVyZSBhcmUgdHdvIHdheXMgdG8gYXBwcm9hY2ggdGhlc2Vcbi8vLyB0cmVlczogdGhlIHdheSB0aGV5IGFyZSBhY3R1YWxseSBzdG9yZWQgaW4gbWVtb3J5LCBhbmQgdGhlXG4vLy8gY29udmVuaWVudCB3YXkuXG4vLy9cbi8vLyBTeW50YXggdHJlZXMgYXJlIHN0b3JlZCBhcyBhIHRyZWUgb2YgYFRyZWVgIGFuZCBgVHJlZUJ1ZmZlcmBcbi8vLyBvYmplY3RzLiBCeSBwYWNraW5nIGRldGFpbCBpbmZvcm1hdGlvbiBpbnRvIGBUcmVlQnVmZmVyYCBsZWFmXG4vLy8gbm9kZXMsIHRoZSByZXByZXNlbnRhdGlvbiBpcyBtYWRlIGEgbG90IG1vcmUgbWVtb3J5LWVmZmljaWVudC5cbi8vL1xuLy8vIEhvd2V2ZXIsIHdoZW4geW91IHdhbnQgdG8gYWN0dWFsbHkgd29yayB3aXRoIHRyZWUgbm9kZXMsIHRoaXNcbi8vLyByZXByZXNlbnRhdGlvbiBpcyB2ZXJ5IGF3a3dhcmQsIHNvIG1vc3QgY2xpZW50IGNvZGUgd2lsbCB3YW50IHRvXG4vLy8gdXNlIHRoZSBgVHJlZUN1cnNvcmAgaW50ZXJmYWNlIGluc3RlYWQsIHdoaWNoIHByb3ZpZGVzIGEgdmlldyBvblxuLy8vIHNvbWUgcGFydCBvZiB0aGlzIGRhdGEgc3RydWN0dXJlLCBhbmQgY2FuIGJlIHVzZWQgdG8gbW92ZSBhcm91bmRcbi8vLyB0byBhZGphY2VudCBub2Rlcy5cbmNsYXNzIFRyZWUge1xuICAgIC8vLyBDb25zdHJ1Y3QgYSBuZXcgdHJlZS4gWW91IHVzdWFsbHkgd2FudCB0byBnbyB0aHJvdWdoXG4gICAgLy8vIFtgVHJlZS5idWlsZGBdKCN0cmVlLlRyZWVeYnVpbGQpIGluc3RlYWQuXG4gICAgY29uc3RydWN0b3IodHlwZSwgXG4gICAgLy8vIFRoZSB0cmVlJ3MgY2hpbGQgbm9kZXMuIENoaWxkcmVuIHNtYWxsIGVub3VnaCB0byBmaXQgaW4gYVxuICAgIC8vLyBgVHJlZUJ1ZmZlciB3aWxsIGJlIHJlcHJlc2VudGVkIGFzIHN1Y2gsIG90aGVyIGNoaWxkcmVuIGNhbiBiZVxuICAgIC8vLyBmdXJ0aGVyIGBUcmVlYCBpbnN0YW5jZXMgd2l0aCB0aGVpciBvd24gaW50ZXJuYWwgc3RydWN0dXJlLlxuICAgIGNoaWxkcmVuLCBcbiAgICAvLy8gVGhlIHBvc2l0aW9ucyAob2Zmc2V0cyByZWxhdGl2ZSB0byB0aGUgc3RhcnQgb2YgdGhpcyB0cmVlKSBvZlxuICAgIC8vLyB0aGUgY2hpbGRyZW4uXG4gICAgcG9zaXRpb25zLCBcbiAgICAvLy8gVGhlIHRvdGFsIGxlbmd0aCBvZiB0aGlzIHRyZWVcbiAgICBsZW5ndGgpIHtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLnBvc2l0aW9ucyA9IHBvc2l0aW9ucztcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbi5tYXAoYyA9PiBjLnRvU3RyaW5nKCkpLmpvaW4oKTtcbiAgICAgICAgcmV0dXJuICF0aGlzLnR5cGUubmFtZSA/IGNoaWxkcmVuIDpcbiAgICAgICAgICAgICgvXFxXLy50ZXN0KHRoaXMudHlwZS5uYW1lKSAmJiAhdGhpcy50eXBlLmlzRXJyb3IgPyBKU09OLnN0cmluZ2lmeSh0aGlzLnR5cGUubmFtZSkgOiB0aGlzLnR5cGUubmFtZSkgK1xuICAgICAgICAgICAgICAgIChjaGlsZHJlbi5sZW5ndGggPyBcIihcIiArIGNoaWxkcmVuICsgXCIpXCIgOiBcIlwiKTtcbiAgICB9XG4gICAgLy8vIEdldCBhIFt0cmVlIGN1cnNvcl0oI3RyZWUuVHJlZUN1cnNvcikgcm9vdGVkIGF0IHRoaXMgdHJlZS4gV2hlblxuICAgIC8vLyBgcG9zYCBpcyBnaXZlbiwgdGhlIGN1cnNvciBpcyBbbW92ZWRdKCN0cmVlLlRyZWVDdXJzb3IubW92ZVRvKVxuICAgIC8vLyB0byB0aGUgZ2l2ZW4gcG9zaXRpb24gYW5kIHNpZGUuXG4gICAgY3Vyc29yKHBvcywgc2lkZSA9IDApIHtcbiAgICAgICAgbGV0IHNjb3BlID0gKHBvcyAhPSBudWxsICYmIENhY2hlZE5vZGUuZ2V0KHRoaXMpKSB8fCB0aGlzLnRvcE5vZGU7XG4gICAgICAgIGxldCBjdXJzb3IgPSBuZXcgVHJlZUN1cnNvcihzY29wZSk7XG4gICAgICAgIGlmIChwb3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgY3Vyc29yLm1vdmVUbyhwb3MsIHNpZGUpO1xuICAgICAgICAgICAgQ2FjaGVkTm9kZS5zZXQodGhpcywgY3Vyc29yLl90cmVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3Vyc29yO1xuICAgIH1cbiAgICAvLy8gR2V0IGEgW3RyZWUgY3Vyc29yXSgjdHJlZS5UcmVlQ3Vyc29yKSB0aGF0LCB1bmxpa2UgcmVndWxhclxuICAgIC8vLyBjdXJzb3JzLCBkb2Vzbid0IHNraXAgW2Fub255bW91c10oI3RyZWUuTm9kZVR5cGUuaXNBbm9ueW1vdXMpXG4gICAgLy8vIG5vZGVzLlxuICAgIGZ1bGxDdXJzb3IoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHJlZUN1cnNvcih0aGlzLnRvcE5vZGUsIHRydWUpO1xuICAgIH1cbiAgICAvLy8gR2V0IGEgW3N5bnRheCBub2RlXSgjdHJlZS5TeW50YXhOb2RlKSBvYmplY3QgZm9yIHRoZSB0b3Agb2YgdGhlXG4gICAgLy8vIHRyZWUuXG4gICAgZ2V0IHRvcE5vZGUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHJlZU5vZGUodGhpcywgMCwgMCwgbnVsbCk7XG4gICAgfVxuICAgIC8vLyBHZXQgdGhlIFtzeW50YXggbm9kZV0oI3RyZWUuU3ludGF4Tm9kZSkgYXQgdGhlIGdpdmVuIHBvc2l0aW9uLlxuICAgIC8vLyBJZiBgc2lkZWAgaXMgLTEsIHRoaXMgd2lsbCBtb3ZlIGludG8gbm9kZXMgdGhhdCBlbmQgYXQgdGhlXG4gICAgLy8vIHBvc2l0aW9uLiBJZiAxLCBpdCdsbCBtb3ZlIGludG8gbm9kZXMgdGhhdCBzdGFydCBhdCB0aGVcbiAgICAvLy8gcG9zaXRpb24uIFdpdGggMCwgaXQnbGwgb25seSBlbnRlciBub2RlcyB0aGF0IGNvdmVyIHRoZSBwb3NpdGlvblxuICAgIC8vLyBmcm9tIGJvdGggc2lkZXMuXG4gICAgcmVzb2x2ZShwb3MsIHNpZGUgPSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnNvcihwb3MsIHNpZGUpLm5vZGU7XG4gICAgfVxuICAgIC8vLyBJdGVyYXRlIG92ZXIgdGhlIHRyZWUgYW5kIGl0cyBjaGlsZHJlbiwgY2FsbGluZyBgZW50ZXJgIGZvciBhbnlcbiAgICAvLy8gbm9kZSB0aGF0IHRvdWNoZXMgdGhlIGBmcm9tYC9gdG9gIHJlZ2lvbiAoaWYgZ2l2ZW4pIGJlZm9yZVxuICAgIC8vLyBydW5uaW5nIG92ZXIgc3VjaCBhIG5vZGUncyBjaGlsZHJlbiwgYW5kIGBsZWF2ZWAgKGlmIGdpdmVuKSB3aGVuXG4gICAgLy8vIGxlYXZpbmcgdGhlIG5vZGUuIFdoZW4gYGVudGVyYCByZXR1cm5zIGBmYWxzZWAsIHRoZSBnaXZlbiBub2RlXG4gICAgLy8vIHdpbGwgbm90IGhhdmUgaXRzIGNoaWxkcmVuIGl0ZXJhdGVkIG92ZXIgKG9yIGBsZWF2ZWAgY2FsbGVkKS5cbiAgICBpdGVyYXRlKHNwZWMpIHtcbiAgICAgICAgbGV0IHsgZW50ZXIsIGxlYXZlLCBmcm9tID0gMCwgdG8gPSB0aGlzLmxlbmd0aCB9ID0gc3BlYztcbiAgICAgICAgZm9yIChsZXQgYyA9IHRoaXMuY3Vyc29yKCk7Oykge1xuICAgICAgICAgICAgbGV0IG11c3RMZWF2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGMuZnJvbSA8PSB0byAmJiBjLnRvID49IGZyb20gJiYgKGMudHlwZS5pc0Fub255bW91cyB8fCBlbnRlcihjLnR5cGUsIGMuZnJvbSwgYy50bykgIT09IGZhbHNlKSkge1xuICAgICAgICAgICAgICAgIGlmIChjLmZpcnN0Q2hpbGQoKSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKCFjLnR5cGUuaXNBbm9ueW1vdXMpXG4gICAgICAgICAgICAgICAgICAgIG11c3RMZWF2ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICAgICAgaWYgKG11c3RMZWF2ZSAmJiBsZWF2ZSlcbiAgICAgICAgICAgICAgICAgICAgbGVhdmUoYy50eXBlLCBjLmZyb20sIGMudG8pO1xuICAgICAgICAgICAgICAgIG11c3RMZWF2ZSA9IGMudHlwZS5pc0Fub255bW91cztcbiAgICAgICAgICAgICAgICBpZiAoYy5uZXh0U2libGluZygpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBpZiAoIWMucGFyZW50KCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBtdXN0TGVhdmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vLyBCYWxhbmNlIHRoZSBkaXJlY3QgY2hpbGRyZW4gb2YgdGhpcyB0cmVlLlxuICAgIGJhbGFuY2UobWF4QnVmZmVyTGVuZ3RoID0gRGVmYXVsdEJ1ZmZlckxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPD0gQmFsYW5jZUJyYW5jaEZhY3RvciA/IHRoaXNcbiAgICAgICAgICAgIDogYmFsYW5jZVJhbmdlKHRoaXMudHlwZSwgTm9kZVR5cGUubm9uZSwgdGhpcy5jaGlsZHJlbiwgdGhpcy5wb3NpdGlvbnMsIDAsIHRoaXMuY2hpbGRyZW4ubGVuZ3RoLCAwLCBtYXhCdWZmZXJMZW5ndGgsIHRoaXMubGVuZ3RoLCAwKTtcbiAgICB9XG4gICAgLy8vIEJ1aWxkIGEgdHJlZSBmcm9tIGEgcG9zdGZpeC1vcmRlcmVkIGJ1ZmZlciBvZiBub2RlIGluZm9ybWF0aW9uLFxuICAgIC8vLyBvciBhIGN1cnNvciBvdmVyIHN1Y2ggYSBidWZmZXIuXG4gICAgc3RhdGljIGJ1aWxkKGRhdGEpIHsgcmV0dXJuIGJ1aWxkVHJlZShkYXRhKTsgfVxufVxuLy8vIFRoZSBlbXB0eSB0cmVlXG5UcmVlLmVtcHR5ID0gbmV3IFRyZWUoTm9kZVR5cGUubm9uZSwgW10sIFtdLCAwKTtcbi8vIEZvciB0cmVlcyB0aGF0IG5lZWQgYSBjb250ZXh0IGhhc2ggYXR0YWNoZWQsIHdlJ3JlIHVzaW5nIHRoaXNcbi8vIGtsdWRnZSB3aGljaCBhc3NpZ25zIGFuIGV4dHJhIHByb3BlcnR5IGRpcmVjdGx5IGFmdGVyXG4vLyBpbml0aWFsaXphdGlvbiAoY3JlYXRpbmcgYSBzaW5nbGUgbmV3IG9iamVjdCBzaGFwZSkuXG5mdW5jdGlvbiB3aXRoSGFzaCh0cmVlLCBoYXNoKSB7XG4gICAgaWYgKGhhc2gpXG4gICAgICAgIHRyZWUuY29udGV4dEhhc2ggPSBoYXNoO1xuICAgIHJldHVybiB0cmVlO1xufVxuLy8vIFRyZWUgYnVmZmVycyBjb250YWluICh0eXBlLCBzdGFydCwgZW5kLCBlbmRJbmRleCkgcXVhZHMgZm9yIGVhY2hcbi8vLyBub2RlLiBJbiBzdWNoIGEgYnVmZmVyLCBub2RlcyBhcmUgc3RvcmVkIGluIHByZWZpeCBvcmRlciAocGFyZW50c1xuLy8vIGJlZm9yZSBjaGlsZHJlbiwgd2l0aCB0aGUgZW5kSW5kZXggb2YgdGhlIHBhcmVudCBpbmRpY2F0aW5nIHdoaWNoXG4vLy8gY2hpbGRyZW4gYmVsb25nIHRvIGl0KVxuY2xhc3MgVHJlZUJ1ZmZlciB7XG4gICAgLy8vIENyZWF0ZSBhIHRyZWUgYnVmZmVyIEBpbnRlcm5hbFxuICAgIGNvbnN0cnVjdG9yKFxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBidWZmZXIsIFxuICAgIC8vIFRoZSB0b3RhbCBsZW5ndGggb2YgdGhlIGdyb3VwIG9mIG5vZGVzIGluIHRoZSBidWZmZXIuXG4gICAgbGVuZ3RoLCBcbiAgICAvLy8gQGludGVybmFsXG4gICAgc2V0LCB0eXBlID0gTm9kZVR5cGUubm9uZSkge1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMuc2V0ID0gc2V0O1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuYnVmZmVyLmxlbmd0aDspIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuY2hpbGRTdHJpbmcoaW5kZXgpKTtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5idWZmZXJbaW5kZXggKyAzXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oXCIsXCIpO1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgY2hpbGRTdHJpbmcoaW5kZXgpIHtcbiAgICAgICAgbGV0IGlkID0gdGhpcy5idWZmZXJbaW5kZXhdLCBlbmRJbmRleCA9IHRoaXMuYnVmZmVyW2luZGV4ICsgM107XG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5zZXQudHlwZXNbaWRdLCByZXN1bHQgPSB0eXBlLm5hbWU7XG4gICAgICAgIGlmICgvXFxXLy50ZXN0KHJlc3VsdCkgJiYgIXR5cGUuaXNFcnJvcilcbiAgICAgICAgICAgIHJlc3VsdCA9IEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XG4gICAgICAgIGluZGV4ICs9IDQ7XG4gICAgICAgIGlmIChlbmRJbmRleCA9PSBpbmRleClcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IFtdO1xuICAgICAgICB3aGlsZSAoaW5kZXggPCBlbmRJbmRleCkge1xuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaCh0aGlzLmNoaWxkU3RyaW5nKGluZGV4KSk7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuYnVmZmVyW2luZGV4ICsgM107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdCArIFwiKFwiICsgY2hpbGRyZW4uam9pbihcIixcIikgKyBcIilcIjtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGZpbmRDaGlsZChzdGFydEluZGV4LCBlbmRJbmRleCwgZGlyLCBhZnRlcikge1xuICAgICAgICBsZXQgeyBidWZmZXIgfSA9IHRoaXMsIHBpY2sgPSAtMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0SW5kZXg7IGkgIT0gZW5kSW5kZXg7IGkgPSBidWZmZXJbaSArIDNdKSB7XG4gICAgICAgICAgICBpZiAoYWZ0ZXIgIT0gLTEwMDAwMDAwMCAvKiBOb25lICovKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0ID0gYnVmZmVyW2kgKyAxXSwgZW5kID0gYnVmZmVyW2kgKyAyXTtcbiAgICAgICAgICAgICAgICBpZiAoZGlyID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kID4gYWZ0ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICBwaWNrID0gaTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZCA+IGFmdGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnQgPCBhZnRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpY2sgPSBpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZW5kID49IGFmdGVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGljayA9IGk7XG4gICAgICAgICAgICAgICAgaWYgKGRpciA+IDApXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwaWNrO1xuICAgIH1cbn1cbmNsYXNzIFRyZWVOb2RlIHtcbiAgICBjb25zdHJ1Y3Rvcihub2RlLCBmcm9tLCBpbmRleCwgX3BhcmVudCkge1xuICAgICAgICB0aGlzLm5vZGUgPSBub2RlO1xuICAgICAgICB0aGlzLmZyb20gPSBmcm9tO1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IF9wYXJlbnQ7XG4gICAgfVxuICAgIGdldCB0eXBlKCkgeyByZXR1cm4gdGhpcy5ub2RlLnR5cGU7IH1cbiAgICBnZXQgbmFtZSgpIHsgcmV0dXJuIHRoaXMubm9kZS50eXBlLm5hbWU7IH1cbiAgICBnZXQgdG8oKSB7IHJldHVybiB0aGlzLmZyb20gKyB0aGlzLm5vZGUubGVuZ3RoOyB9XG4gICAgbmV4dENoaWxkKGksIGRpciwgYWZ0ZXIsIGZ1bGwgPSBmYWxzZSkge1xuICAgICAgICBmb3IgKGxldCBwYXJlbnQgPSB0aGlzOzspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHsgY2hpbGRyZW4sIHBvc2l0aW9ucyB9ID0gcGFyZW50Lm5vZGUsIGUgPSBkaXIgPiAwID8gY2hpbGRyZW4ubGVuZ3RoIDogLTE7IGkgIT0gZTsgaSArPSBkaXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dCA9IGNoaWxkcmVuW2ldLCBzdGFydCA9IHBvc2l0aW9uc1tpXSArIHBhcmVudC5mcm9tO1xuICAgICAgICAgICAgICAgIGlmIChhZnRlciAhPSAtMTAwMDAwMDAwIC8qIE5vbmUgKi8gJiYgKGRpciA8IDAgPyBzdGFydCA+PSBhZnRlciA6IHN0YXJ0ICsgbmV4dC5sZW5ndGggPD0gYWZ0ZXIpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCBpbnN0YW5jZW9mIFRyZWVCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gbmV4dC5maW5kQ2hpbGQoMCwgbmV4dC5idWZmZXIubGVuZ3RoLCBkaXIsIGFmdGVyID09IC0xMDAwMDAwMDAgLyogTm9uZSAqLyA/IC0xMDAwMDAwMDAgLyogTm9uZSAqLyA6IGFmdGVyIC0gc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQnVmZmVyTm9kZShuZXcgQnVmZmVyQ29udGV4dChwYXJlbnQsIG5leHQsIGksIHN0YXJ0KSwgbnVsbCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChmdWxsIHx8ICghbmV4dC50eXBlLmlzQW5vbnltb3VzIHx8IGhhc0NoaWxkKG5leHQpKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5uZXIgPSBuZXcgVHJlZU5vZGUobmV4dCwgc3RhcnQsIGksIHBhcmVudCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxsIHx8ICFpbm5lci50eXBlLmlzQW5vbnltb3VzID8gaW5uZXIgOiBpbm5lci5uZXh0Q2hpbGQoZGlyIDwgMCA/IG5leHQuY2hpbGRyZW4ubGVuZ3RoIC0gMSA6IDAsIGRpciwgYWZ0ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmdWxsIHx8ICFwYXJlbnQudHlwZS5pc0Fub255bW91cylcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIGkgPSBwYXJlbnQuaW5kZXggKyBkaXI7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQuX3BhcmVudDtcbiAgICAgICAgICAgIGlmICghcGFyZW50KVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBmaXJzdENoaWxkKCkgeyByZXR1cm4gdGhpcy5uZXh0Q2hpbGQoMCwgMSwgLTEwMDAwMDAwMCAvKiBOb25lICovKTsgfVxuICAgIGdldCBsYXN0Q2hpbGQoKSB7IHJldHVybiB0aGlzLm5leHRDaGlsZCh0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoIC0gMSwgLTEsIC0xMDAwMDAwMDAgLyogTm9uZSAqLyk7IH1cbiAgICBjaGlsZEFmdGVyKHBvcykgeyByZXR1cm4gdGhpcy5uZXh0Q2hpbGQoMCwgMSwgcG9zKTsgfVxuICAgIGNoaWxkQmVmb3JlKHBvcykgeyByZXR1cm4gdGhpcy5uZXh0Q2hpbGQodGhpcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCAtIDEsIC0xLCBwb3MpOyB9XG4gICAgbmV4dFNpZ25pZmljYW50UGFyZW50KCkge1xuICAgICAgICBsZXQgdmFsID0gdGhpcztcbiAgICAgICAgd2hpbGUgKHZhbC50eXBlLmlzQW5vbnltb3VzICYmIHZhbC5fcGFyZW50KVxuICAgICAgICAgICAgdmFsID0gdmFsLl9wYXJlbnQ7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIGdldCBwYXJlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQubmV4dFNpZ25pZmljYW50UGFyZW50KCkgOiBudWxsO1xuICAgIH1cbiAgICBnZXQgbmV4dFNpYmxpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQubmV4dENoaWxkKHRoaXMuaW5kZXggKyAxLCAxLCAtMSkgOiBudWxsO1xuICAgIH1cbiAgICBnZXQgcHJldlNpYmxpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQubmV4dENoaWxkKHRoaXMuaW5kZXggLSAxLCAtMSwgLTEpIDogbnVsbDtcbiAgICB9XG4gICAgZ2V0IGN1cnNvcigpIHsgcmV0dXJuIG5ldyBUcmVlQ3Vyc29yKHRoaXMpOyB9XG4gICAgcmVzb2x2ZShwb3MsIHNpZGUgPSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnNvci5tb3ZlVG8ocG9zLCBzaWRlKS5ub2RlO1xuICAgIH1cbiAgICBnZXRDaGlsZCh0eXBlLCBiZWZvcmUgPSBudWxsLCBhZnRlciA9IG51bGwpIHtcbiAgICAgICAgbGV0IHIgPSBnZXRDaGlsZHJlbih0aGlzLCB0eXBlLCBiZWZvcmUsIGFmdGVyKTtcbiAgICAgICAgcmV0dXJuIHIubGVuZ3RoID8gclswXSA6IG51bGw7XG4gICAgfVxuICAgIGdldENoaWxkcmVuKHR5cGUsIGJlZm9yZSA9IG51bGwsIGFmdGVyID0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZ2V0Q2hpbGRyZW4odGhpcywgdHlwZSwgYmVmb3JlLCBhZnRlcik7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICB0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMubm9kZS50b1N0cmluZygpOyB9XG59XG5mdW5jdGlvbiBnZXRDaGlsZHJlbihub2RlLCB0eXBlLCBiZWZvcmUsIGFmdGVyKSB7XG4gICAgbGV0IGN1ciA9IG5vZGUuY3Vyc29yLCByZXN1bHQgPSBbXTtcbiAgICBpZiAoIWN1ci5maXJzdENoaWxkKCkpXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKGJlZm9yZSAhPSBudWxsKVxuICAgICAgICB3aGlsZSAoIWN1ci50eXBlLmlzKGJlZm9yZSkpXG4gICAgICAgICAgICBpZiAoIWN1ci5uZXh0U2libGluZygpKVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgZm9yICg7Oykge1xuICAgICAgICBpZiAoYWZ0ZXIgIT0gbnVsbCAmJiBjdXIudHlwZS5pcyhhZnRlcikpXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICBpZiAoY3VyLnR5cGUuaXModHlwZSkpXG4gICAgICAgICAgICByZXN1bHQucHVzaChjdXIubm9kZSk7XG4gICAgICAgIGlmICghY3VyLm5leHRTaWJsaW5nKCkpXG4gICAgICAgICAgICByZXR1cm4gYWZ0ZXIgPT0gbnVsbCA/IHJlc3VsdCA6IFtdO1xuICAgIH1cbn1cbmNsYXNzIEJ1ZmZlckNvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKHBhcmVudCwgYnVmZmVyLCBpbmRleCwgc3RhcnQpIHtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBzdGFydDtcbiAgICB9XG59XG5jbGFzcyBCdWZmZXJOb2RlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBfcGFyZW50LCBpbmRleCkge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBfcGFyZW50O1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMudHlwZSA9IGNvbnRleHQuYnVmZmVyLnNldC50eXBlc1tjb250ZXh0LmJ1ZmZlci5idWZmZXJbaW5kZXhdXTtcbiAgICB9XG4gICAgZ2V0IG5hbWUoKSB7IHJldHVybiB0aGlzLnR5cGUubmFtZTsgfVxuICAgIGdldCBmcm9tKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LnN0YXJ0ICsgdGhpcy5jb250ZXh0LmJ1ZmZlci5idWZmZXJbdGhpcy5pbmRleCArIDFdOyB9XG4gICAgZ2V0IHRvKCkgeyByZXR1cm4gdGhpcy5jb250ZXh0LnN0YXJ0ICsgdGhpcy5jb250ZXh0LmJ1ZmZlci5idWZmZXJbdGhpcy5pbmRleCArIDJdOyB9XG4gICAgY2hpbGQoZGlyLCBhZnRlcikge1xuICAgICAgICBsZXQgeyBidWZmZXIgfSA9IHRoaXMuY29udGV4dDtcbiAgICAgICAgbGV0IGluZGV4ID0gYnVmZmVyLmZpbmRDaGlsZCh0aGlzLmluZGV4ICsgNCwgYnVmZmVyLmJ1ZmZlclt0aGlzLmluZGV4ICsgM10sIGRpciwgYWZ0ZXIgPT0gLTEwMDAwMDAwMCAvKiBOb25lICovID8gLTEwMDAwMDAwMCAvKiBOb25lICovIDogYWZ0ZXIgLSB0aGlzLmNvbnRleHQuc3RhcnQpO1xuICAgICAgICByZXR1cm4gaW5kZXggPCAwID8gbnVsbCA6IG5ldyBCdWZmZXJOb2RlKHRoaXMuY29udGV4dCwgdGhpcywgaW5kZXgpO1xuICAgIH1cbiAgICBnZXQgZmlyc3RDaGlsZCgpIHsgcmV0dXJuIHRoaXMuY2hpbGQoMSwgLTEwMDAwMDAwMCAvKiBOb25lICovKTsgfVxuICAgIGdldCBsYXN0Q2hpbGQoKSB7IHJldHVybiB0aGlzLmNoaWxkKC0xLCAtMTAwMDAwMDAwIC8qIE5vbmUgKi8pOyB9XG4gICAgY2hpbGRBZnRlcihwb3MpIHsgcmV0dXJuIHRoaXMuY2hpbGQoMSwgcG9zKTsgfVxuICAgIGNoaWxkQmVmb3JlKHBvcykgeyByZXR1cm4gdGhpcy5jaGlsZCgtMSwgcG9zKTsgfVxuICAgIGdldCBwYXJlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQgfHwgdGhpcy5jb250ZXh0LnBhcmVudC5uZXh0U2lnbmlmaWNhbnRQYXJlbnQoKTtcbiAgICB9XG4gICAgZXh0ZXJuYWxTaWJsaW5nKGRpcikge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gbnVsbCA6IHRoaXMuY29udGV4dC5wYXJlbnQubmV4dENoaWxkKHRoaXMuY29udGV4dC5pbmRleCArIGRpciwgZGlyLCAtMSk7XG4gICAgfVxuICAgIGdldCBuZXh0U2libGluZygpIHtcbiAgICAgICAgbGV0IHsgYnVmZmVyIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGxldCBhZnRlciA9IGJ1ZmZlci5idWZmZXJbdGhpcy5pbmRleCArIDNdO1xuICAgICAgICBpZiAoYWZ0ZXIgPCAodGhpcy5fcGFyZW50ID8gYnVmZmVyLmJ1ZmZlclt0aGlzLl9wYXJlbnQuaW5kZXggKyAzXSA6IGJ1ZmZlci5idWZmZXIubGVuZ3RoKSlcbiAgICAgICAgICAgIHJldHVybiBuZXcgQnVmZmVyTm9kZSh0aGlzLmNvbnRleHQsIHRoaXMuX3BhcmVudCwgYWZ0ZXIpO1xuICAgICAgICByZXR1cm4gdGhpcy5leHRlcm5hbFNpYmxpbmcoMSk7XG4gICAgfVxuICAgIGdldCBwcmV2U2libGluZygpIHtcbiAgICAgICAgbGV0IHsgYnVmZmVyIH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICAgIGxldCBwYXJlbnRTdGFydCA9IHRoaXMuX3BhcmVudCA/IHRoaXMuX3BhcmVudC5pbmRleCArIDQgOiAwO1xuICAgICAgICBpZiAodGhpcy5pbmRleCA9PSBwYXJlbnRTdGFydClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV4dGVybmFsU2libGluZygtMSk7XG4gICAgICAgIHJldHVybiBuZXcgQnVmZmVyTm9kZSh0aGlzLmNvbnRleHQsIHRoaXMuX3BhcmVudCwgYnVmZmVyLmZpbmRDaGlsZChwYXJlbnRTdGFydCwgdGhpcy5pbmRleCwgLTEsIC0xMDAwMDAwMDAgLyogTm9uZSAqLykpO1xuICAgIH1cbiAgICBnZXQgY3Vyc29yKCkgeyByZXR1cm4gbmV3IFRyZWVDdXJzb3IodGhpcyk7IH1cbiAgICByZXNvbHZlKHBvcywgc2lkZSA9IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyc29yLm1vdmVUbyhwb3MsIHNpZGUpLm5vZGU7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICB0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMuY29udGV4dC5idWZmZXIuY2hpbGRTdHJpbmcodGhpcy5pbmRleCk7IH1cbiAgICBnZXRDaGlsZCh0eXBlLCBiZWZvcmUgPSBudWxsLCBhZnRlciA9IG51bGwpIHtcbiAgICAgICAgbGV0IHIgPSBnZXRDaGlsZHJlbih0aGlzLCB0eXBlLCBiZWZvcmUsIGFmdGVyKTtcbiAgICAgICAgcmV0dXJuIHIubGVuZ3RoID8gclswXSA6IG51bGw7XG4gICAgfVxuICAgIGdldENoaWxkcmVuKHR5cGUsIGJlZm9yZSA9IG51bGwsIGFmdGVyID0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZ2V0Q2hpbGRyZW4odGhpcywgdHlwZSwgYmVmb3JlLCBhZnRlcik7XG4gICAgfVxufVxuLy8vIEEgdHJlZSBjdXJzb3Igb2JqZWN0IGZvY3VzZXMgb24gYSBnaXZlbiBub2RlIGluIGEgc3ludGF4IHRyZWUsIGFuZFxuLy8vIGFsbG93cyB5b3UgdG8gbW92ZSB0byBhZGphY2VudCBub2Rlcy5cbmNsYXNzIFRyZWVDdXJzb3Ige1xuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBjb25zdHJ1Y3Rvcihub2RlLCBmdWxsID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5mdWxsID0gZnVsbDtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBudWxsO1xuICAgICAgICB0aGlzLnN0YWNrID0gW107XG4gICAgICAgIHRoaXMuaW5kZXggPSAwO1xuICAgICAgICB0aGlzLmJ1ZmZlck5vZGUgPSBudWxsO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFRyZWVOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLnlpZWxkTm9kZShub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3RyZWUgPSBub2RlLmNvbnRleHQucGFyZW50O1xuICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBub2RlLmNvbnRleHQ7XG4gICAgICAgICAgICBmb3IgKGxldCBuID0gbm9kZS5fcGFyZW50OyBuOyBuID0gbi5fcGFyZW50KVxuICAgICAgICAgICAgICAgIHRoaXMuc3RhY2sudW5zaGlmdChuLmluZGV4KTtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyTm9kZSA9IG5vZGU7XG4gICAgICAgICAgICB0aGlzLnlpZWxkQnVmKG5vZGUuaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLyBTaG9ydGhhbmQgZm9yIGAudHlwZS5uYW1lYC5cbiAgICBnZXQgbmFtZSgpIHsgcmV0dXJuIHRoaXMudHlwZS5uYW1lOyB9XG4gICAgeWllbGROb2RlKG5vZGUpIHtcbiAgICAgICAgaWYgKCFub2RlKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLl90cmVlID0gbm9kZTtcbiAgICAgICAgdGhpcy50eXBlID0gbm9kZS50eXBlO1xuICAgICAgICB0aGlzLmZyb20gPSBub2RlLmZyb207XG4gICAgICAgIHRoaXMudG8gPSBub2RlLnRvO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgeWllbGRCdWYoaW5kZXgsIHR5cGUpIHtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICBsZXQgeyBzdGFydCwgYnVmZmVyIH0gPSB0aGlzLmJ1ZmZlcjtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZSB8fCBidWZmZXIuc2V0LnR5cGVzW2J1ZmZlci5idWZmZXJbaW5kZXhdXTtcbiAgICAgICAgdGhpcy5mcm9tID0gc3RhcnQgKyBidWZmZXIuYnVmZmVyW2luZGV4ICsgMV07XG4gICAgICAgIHRoaXMudG8gPSBzdGFydCArIGJ1ZmZlci5idWZmZXJbaW5kZXggKyAyXTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHlpZWxkKG5vZGUpIHtcbiAgICAgICAgaWYgKCFub2RlKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFRyZWVOb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy55aWVsZE5vZGUobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWZmZXIgPSBub2RlLmNvbnRleHQ7XG4gICAgICAgIHJldHVybiB0aGlzLnlpZWxkQnVmKG5vZGUuaW5kZXgsIG5vZGUudHlwZSk7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyID8gdGhpcy5idWZmZXIuYnVmZmVyLmNoaWxkU3RyaW5nKHRoaXMuaW5kZXgpIDogdGhpcy5fdHJlZS50b1N0cmluZygpO1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgZW50ZXIoZGlyLCBhZnRlcikge1xuICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMueWllbGQodGhpcy5fdHJlZS5uZXh0Q2hpbGQoZGlyIDwgMCA/IHRoaXMuX3RyZWUubm9kZS5jaGlsZHJlbi5sZW5ndGggLSAxIDogMCwgZGlyLCBhZnRlciwgdGhpcy5mdWxsKSk7XG4gICAgICAgIGxldCB7IGJ1ZmZlciB9ID0gdGhpcy5idWZmZXI7XG4gICAgICAgIGxldCBpbmRleCA9IGJ1ZmZlci5maW5kQ2hpbGQodGhpcy5pbmRleCArIDQsIGJ1ZmZlci5idWZmZXJbdGhpcy5pbmRleCArIDNdLCBkaXIsIGFmdGVyID09IC0xMDAwMDAwMDAgLyogTm9uZSAqLyA/IC0xMDAwMDAwMDAgLyogTm9uZSAqLyA6IGFmdGVyIC0gdGhpcy5idWZmZXIuc3RhcnQpO1xuICAgICAgICBpZiAoaW5kZXggPCAwKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB0aGlzLnN0YWNrLnB1c2godGhpcy5pbmRleCk7XG4gICAgICAgIHJldHVybiB0aGlzLnlpZWxkQnVmKGluZGV4KTtcbiAgICB9XG4gICAgLy8vIE1vdmUgdGhlIGN1cnNvciB0byB0aGlzIG5vZGUncyBmaXJzdCBjaGlsZC4gV2hlbiB0aGlzIHJldHVybnNcbiAgICAvLy8gZmFsc2UsIHRoZSBub2RlIGhhcyBubyBjaGlsZCwgYW5kIHRoZSBjdXJzb3IgaGFzIG5vdCBiZWVuIG1vdmVkLlxuICAgIGZpcnN0Q2hpbGQoKSB7IHJldHVybiB0aGlzLmVudGVyKDEsIC0xMDAwMDAwMDAgLyogTm9uZSAqLyk7IH1cbiAgICAvLy8gTW92ZSB0aGUgY3Vyc29yIHRvIHRoaXMgbm9kZSdzIGxhc3QgY2hpbGQuXG4gICAgbGFzdENoaWxkKCkgeyByZXR1cm4gdGhpcy5lbnRlcigtMSwgLTEwMDAwMDAwMCAvKiBOb25lICovKTsgfVxuICAgIC8vLyBNb3ZlIHRoZSBjdXJzb3IgdG8gdGhlIGZpcnN0IGNoaWxkIHRoYXQgc3RhcnRzIGF0IG9yIGFmdGVyIGBwb3NgLlxuICAgIGNoaWxkQWZ0ZXIocG9zKSB7IHJldHVybiB0aGlzLmVudGVyKDEsIHBvcyk7IH1cbiAgICAvLy8gTW92ZSB0byB0aGUgbGFzdCBjaGlsZCB0aGF0IGVuZHMgYXQgb3IgYmVmb3JlIGBwb3NgLlxuICAgIGNoaWxkQmVmb3JlKHBvcykgeyByZXR1cm4gdGhpcy5lbnRlcigtMSwgcG9zKTsgfVxuICAgIC8vLyBNb3ZlIHRoZSBub2RlJ3MgcGFyZW50IG5vZGUsIGlmIHRoaXMgaXNuJ3QgdGhlIHRvcCBub2RlLlxuICAgIHBhcmVudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnlpZWxkTm9kZSh0aGlzLmZ1bGwgPyB0aGlzLl90cmVlLl9wYXJlbnQgOiB0aGlzLl90cmVlLnBhcmVudCk7XG4gICAgICAgIGlmICh0aGlzLnN0YWNrLmxlbmd0aClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnlpZWxkQnVmKHRoaXMuc3RhY2sucG9wKCkpO1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5mdWxsID8gdGhpcy5idWZmZXIucGFyZW50IDogdGhpcy5idWZmZXIucGFyZW50Lm5leHRTaWduaWZpY2FudFBhcmVudCgpO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzLnlpZWxkTm9kZShwYXJlbnQpO1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgc2libGluZyhkaXIpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJ1ZmZlcilcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5fdHJlZS5fcGFyZW50ID8gZmFsc2VcbiAgICAgICAgICAgICAgICA6IHRoaXMueWllbGQodGhpcy5fdHJlZS5fcGFyZW50Lm5leHRDaGlsZCh0aGlzLl90cmVlLmluZGV4ICsgZGlyLCBkaXIsIC0xMDAwMDAwMDAgLyogTm9uZSAqLywgdGhpcy5mdWxsKSk7XG4gICAgICAgIGxldCB7IGJ1ZmZlciB9ID0gdGhpcy5idWZmZXIsIGQgPSB0aGlzLnN0YWNrLmxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChkaXIgPCAwKSB7XG4gICAgICAgICAgICBsZXQgcGFyZW50U3RhcnQgPSBkIDwgMCA/IDAgOiB0aGlzLnN0YWNrW2RdICsgNDtcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4ICE9IHBhcmVudFN0YXJ0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnlpZWxkQnVmKGJ1ZmZlci5maW5kQ2hpbGQocGFyZW50U3RhcnQsIHRoaXMuaW5kZXgsIC0xLCAtMTAwMDAwMDAwIC8qIE5vbmUgKi8pKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBhZnRlciA9IGJ1ZmZlci5idWZmZXJbdGhpcy5pbmRleCArIDNdO1xuICAgICAgICAgICAgaWYgKGFmdGVyIDwgKGQgPCAwID8gYnVmZmVyLmJ1ZmZlci5sZW5ndGggOiBidWZmZXIuYnVmZmVyW3RoaXMuc3RhY2tbZF0gKyAzXSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMueWllbGRCdWYoYWZ0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkIDwgMCA/IHRoaXMueWllbGQodGhpcy5idWZmZXIucGFyZW50Lm5leHRDaGlsZCh0aGlzLmJ1ZmZlci5pbmRleCArIGRpciwgZGlyLCAtMTAwMDAwMDAwIC8qIE5vbmUgKi8sIHRoaXMuZnVsbCkpIDogZmFsc2U7XG4gICAgfVxuICAgIC8vLyBNb3ZlIHRvIHRoaXMgbm9kZSdzIG5leHQgc2libGluZywgaWYgYW55LlxuICAgIG5leHRTaWJsaW5nKCkgeyByZXR1cm4gdGhpcy5zaWJsaW5nKDEpOyB9XG4gICAgLy8vIE1vdmUgdG8gdGhpcyBub2RlJ3MgcHJldmlvdXMgc2libGluZywgaWYgYW55LlxuICAgIHByZXZTaWJsaW5nKCkgeyByZXR1cm4gdGhpcy5zaWJsaW5nKC0xKTsgfVxuICAgIGF0TGFzdE5vZGUoZGlyKSB7XG4gICAgICAgIGxldCBpbmRleCwgcGFyZW50LCB7IGJ1ZmZlciB9ID0gdGhpcztcbiAgICAgICAgaWYgKGJ1ZmZlcikge1xuICAgICAgICAgICAgaWYgKGRpciA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmRleCA8IGJ1ZmZlci5idWZmZXIuYnVmZmVyLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmluZGV4OyBpKyspXG4gICAgICAgICAgICAgICAgICAgIGlmIChidWZmZXIuYnVmZmVyLmJ1ZmZlcltpICsgM10gPCB0aGlzLmluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKHsgaW5kZXgsIHBhcmVudCB9ID0gYnVmZmVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICh7IGluZGV4LCBfcGFyZW50OiBwYXJlbnQgfSA9IHRoaXMuX3RyZWUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoOyBwYXJlbnQ7IHsgaW5kZXgsIF9wYXJlbnQ6IHBhcmVudCB9ID0gcGFyZW50KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gaW5kZXggKyBkaXIsIGUgPSBkaXIgPCAwID8gLTEgOiBwYXJlbnQubm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkgIT0gZTsgaSArPSBkaXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2hpbGQgPSBwYXJlbnQubm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mdWxsIHx8ICFjaGlsZC50eXBlLmlzQW5vbnltb3VzIHx8IGNoaWxkIGluc3RhbmNlb2YgVHJlZUJ1ZmZlciB8fCBoYXNDaGlsZChjaGlsZCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbW92ZShkaXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZW50ZXIoZGlyLCAtMTAwMDAwMDAwIC8qIE5vbmUgKi8pKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNpYmxpbmcoZGlyKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0TGFzdE5vZGUoZGlyKSB8fCAhdGhpcy5wYXJlbnQoKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8vIE1vdmUgdG8gdGhlIG5leHQgbm9kZSBpbiBhXG4gICAgLy8vIFtwcmUtb3JkZXJdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1RyZWVfdHJhdmVyc2FsI1ByZS1vcmRlcl8oTkxSKSlcbiAgICAvLy8gdHJhdmVyc2FsLCBnb2luZyBmcm9tIGEgbm9kZSB0byBpdHMgZmlyc3QgY2hpbGQgb3IsIGlmIHRoZVxuICAgIC8vLyBjdXJyZW50IG5vZGUgaXMgZW1wdHksIGl0cyBuZXh0IHNpYmxpbmcgb3IgdGhlIG5leHQgc2libGluZyBvZlxuICAgIC8vLyB0aGUgZmlyc3QgcGFyZW50IG5vZGUgdGhhdCBoYXMgb25lLlxuICAgIG5leHQoKSB7IHJldHVybiB0aGlzLm1vdmUoMSk7IH1cbiAgICAvLy8gTW92ZSB0byB0aGUgbmV4dCBub2RlIGluIGEgbGFzdC10by1maXJzdCBwcmUtb3JkZXIgdHJhdmVyYWwuIEFcbiAgICAvLy8gbm9kZSBpcyBmb2xsb3dlZCBieSBpc3QgbGFzdCBjaGlsZCBvciwgaWYgaXQgaGFzIG5vbmUsIGl0c1xuICAgIC8vLyBwcmV2aW91cyBzaWJsaW5nIG9yIHRoZSBwcmV2aW91cyBzaWJsaW5nIG9mIHRoZSBmaXJzdCBwYXJlbnRcbiAgICAvLy8gbm9kZSB0aGF0IGhhcyBvbmUuXG4gICAgcHJldigpIHsgcmV0dXJuIHRoaXMubW92ZSgtMSk7IH1cbiAgICAvLy8gTW92ZSB0aGUgY3Vyc29yIHRvIHRoZSBpbm5lcm1vc3Qgbm9kZSB0aGF0IGNvdmVycyBgcG9zYC4gSWZcbiAgICAvLy8gYHNpZGVgIGlzIC0xLCBpdCB3aWxsIGVudGVyIG5vZGVzIHRoYXQgZW5kIGF0IGBwb3NgLiBJZiBpdCBpcyAxLFxuICAgIC8vLyBpdCB3aWxsIGVudGVyIG5vZGVzIHRoYXQgc3RhcnQgYXQgYHBvc2AuXG4gICAgbW92ZVRvKHBvcywgc2lkZSA9IDApIHtcbiAgICAgICAgLy8gTW92ZSB1cCB0byBhIG5vZGUgdGhhdCBhY3R1YWxseSBob2xkcyB0aGUgcG9zaXRpb24sIGlmIHBvc3NpYmxlXG4gICAgICAgIHdoaWxlICh0aGlzLmZyb20gPT0gdGhpcy50byB8fFxuICAgICAgICAgICAgKHNpZGUgPCAxID8gdGhpcy5mcm9tID49IHBvcyA6IHRoaXMuZnJvbSA+IHBvcykgfHxcbiAgICAgICAgICAgIChzaWRlID4gLTEgPyB0aGlzLnRvIDw9IHBvcyA6IHRoaXMudG8gPCBwb3MpKVxuICAgICAgICAgICAgaWYgKCF0aGlzLnBhcmVudCgpKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBUaGVuIHNjYW4gZG93biBpbnRvIGNoaWxkIG5vZGVzIGFzIGZhciBhcyBwb3NzaWJsZVxuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBpZiAoc2lkZSA8IDAgPyAhdGhpcy5jaGlsZEJlZm9yZShwb3MpIDogIXRoaXMuY2hpbGRBZnRlcihwb3MpKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgaWYgKHRoaXMuZnJvbSA9PSB0aGlzLnRvIHx8XG4gICAgICAgICAgICAgICAgKHNpZGUgPCAxID8gdGhpcy5mcm9tID49IHBvcyA6IHRoaXMuZnJvbSA+IHBvcykgfHxcbiAgICAgICAgICAgICAgICAoc2lkZSA+IC0xID8gdGhpcy50byA8PSBwb3MgOiB0aGlzLnRvIDwgcG9zKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vLyBHZXQgYSBbc3ludGF4IG5vZGVdKCN0cmVlLlN5bnRheE5vZGUpIGF0IHRoZSBjdXJzb3IncyBjdXJyZW50XG4gICAgLy8vIHBvc2l0aW9uLlxuICAgIGdldCBub2RlKCkge1xuICAgICAgICBpZiAoIXRoaXMuYnVmZmVyKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyZWU7XG4gICAgICAgIGxldCBjYWNoZSA9IHRoaXMuYnVmZmVyTm9kZSwgcmVzdWx0ID0gbnVsbCwgZGVwdGggPSAwO1xuICAgICAgICBpZiAoY2FjaGUgJiYgY2FjaGUuY29udGV4dCA9PSB0aGlzLmJ1ZmZlcikge1xuICAgICAgICAgICAgc2NhbjogZm9yIChsZXQgaW5kZXggPSB0aGlzLmluZGV4LCBkID0gdGhpcy5zdGFjay5sZW5ndGg7IGQgPj0gMDspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjID0gY2FjaGU7IGM7IGMgPSBjLl9wYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIGlmIChjLmluZGV4ID09IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gdGhpcy5pbmRleClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGM7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXB0aCA9IGQgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWsgc2NhbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluZGV4ID0gdGhpcy5zdGFja1stLWRdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBkZXB0aDsgaSA8IHRoaXMuc3RhY2subGVuZ3RoOyBpKyspXG4gICAgICAgICAgICByZXN1bHQgPSBuZXcgQnVmZmVyTm9kZSh0aGlzLmJ1ZmZlciwgcmVzdWx0LCB0aGlzLnN0YWNrW2ldKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyTm9kZSA9IG5ldyBCdWZmZXJOb2RlKHRoaXMuYnVmZmVyLCByZXN1bHQsIHRoaXMuaW5kZXgpO1xuICAgIH1cbiAgICAvLy8gR2V0IHRoZSBbdHJlZV0oI3RyZWUuVHJlZSkgdGhhdCByZXByZXNlbnRzIHRoZSBjdXJyZW50IG5vZGUsIGlmXG4gICAgLy8vIGFueS4gV2lsbCByZXR1cm4gbnVsbCB3aGVuIHRoZSBub2RlIGlzIGluIGEgW3RyZWVcbiAgICAvLy8gYnVmZmVyXSgjdHJlZS5UcmVlQnVmZmVyKS5cbiAgICBnZXQgdHJlZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyID8gbnVsbCA6IHRoaXMuX3RyZWUubm9kZTtcbiAgICB9XG59XG5mdW5jdGlvbiBoYXNDaGlsZCh0cmVlKSB7XG4gICAgcmV0dXJuIHRyZWUuY2hpbGRyZW4uc29tZShjaCA9PiAhY2gudHlwZS5pc0Fub255bW91cyB8fCBjaCBpbnN0YW5jZW9mIFRyZWVCdWZmZXIgfHwgaGFzQ2hpbGQoY2gpKTtcbn1cbmNsYXNzIEZsYXRCdWZmZXJDdXJzb3Ige1xuICAgIGNvbnN0cnVjdG9yKGJ1ZmZlciwgaW5kZXgpIHtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gICAgZ2V0IGlkKCkgeyByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5pbmRleCAtIDRdOyB9XG4gICAgZ2V0IHN0YXJ0KCkgeyByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5pbmRleCAtIDNdOyB9XG4gICAgZ2V0IGVuZCgpIHsgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMuaW5kZXggLSAyXTsgfVxuICAgIGdldCBzaXplKCkgeyByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5pbmRleCAtIDFdOyB9XG4gICAgZ2V0IHBvcygpIHsgcmV0dXJuIHRoaXMuaW5kZXg7IH1cbiAgICBuZXh0KCkgeyB0aGlzLmluZGV4IC09IDQ7IH1cbiAgICBmb3JrKCkgeyByZXR1cm4gbmV3IEZsYXRCdWZmZXJDdXJzb3IodGhpcy5idWZmZXIsIHRoaXMuaW5kZXgpOyB9XG59XG5jb25zdCBCYWxhbmNlQnJhbmNoRmFjdG9yID0gODtcbmZ1bmN0aW9uIGJ1aWxkVHJlZShkYXRhKSB7XG4gICAgdmFyIF9hO1xuICAgIGxldCB7IGJ1ZmZlciwgbm9kZVNldCwgdG9wSUQgPSAwLCBtYXhCdWZmZXJMZW5ndGggPSBEZWZhdWx0QnVmZmVyTGVuZ3RoLCByZXVzZWQgPSBbXSwgbWluUmVwZWF0VHlwZSA9IG5vZGVTZXQudHlwZXMubGVuZ3RoIH0gPSBkYXRhO1xuICAgIGxldCBjdXJzb3IgPSBBcnJheS5pc0FycmF5KGJ1ZmZlcikgPyBuZXcgRmxhdEJ1ZmZlckN1cnNvcihidWZmZXIsIGJ1ZmZlci5sZW5ndGgpIDogYnVmZmVyO1xuICAgIGxldCB0eXBlcyA9IG5vZGVTZXQudHlwZXM7XG4gICAgbGV0IGNvbnRleHRIYXNoID0gMDtcbiAgICBmdW5jdGlvbiB0YWtlTm9kZShwYXJlbnRTdGFydCwgbWluUG9zLCBjaGlsZHJlbiwgcG9zaXRpb25zLCBpblJlcGVhdCkge1xuICAgICAgICBsZXQgeyBpZCwgc3RhcnQsIGVuZCwgc2l6ZSB9ID0gY3Vyc29yO1xuICAgICAgICBsZXQgc3RhcnRQb3MgPSBzdGFydCAtIHBhcmVudFN0YXJ0O1xuICAgICAgICBpZiAoc2l6ZSA8IDApIHtcbiAgICAgICAgICAgIGlmIChzaXplID09IC0xKSB7IC8vIFJldXNlZCBub2RlXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChyZXVzZWRbaWRdKTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaChzdGFydFBvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHsgLy8gQ29udGV4dCBjaGFuZ2VcbiAgICAgICAgICAgICAgICBjb250ZXh0SGFzaCA9IGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3Vyc29yLm5leHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdHlwZSA9IHR5cGVzW2lkXSwgbm9kZSwgYnVmZmVyO1xuICAgICAgICBpZiAoZW5kIC0gc3RhcnQgPD0gbWF4QnVmZmVyTGVuZ3RoICYmIChidWZmZXIgPSBmaW5kQnVmZmVyU2l6ZShjdXJzb3IucG9zIC0gbWluUG9zLCBpblJlcGVhdCkpKSB7XG4gICAgICAgICAgICAvLyBTbWFsbCBlbm91Z2ggZm9yIGEgYnVmZmVyLCBhbmQgbm8gcmV1c2VkIG5vZGVzIGluc2lkZVxuICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgVWludDE2QXJyYXkoYnVmZmVyLnNpemUgLSBidWZmZXIuc2tpcCk7XG4gICAgICAgICAgICBsZXQgZW5kUG9zID0gY3Vyc29yLnBvcyAtIGJ1ZmZlci5zaXplLCBpbmRleCA9IGRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGN1cnNvci5wb3MgPiBlbmRQb3MpXG4gICAgICAgICAgICAgICAgaW5kZXggPSBjb3B5VG9CdWZmZXIoYnVmZmVyLnN0YXJ0LCBkYXRhLCBpbmRleCwgaW5SZXBlYXQpO1xuICAgICAgICAgICAgbm9kZSA9IG5ldyBUcmVlQnVmZmVyKGRhdGEsIGVuZCAtIGJ1ZmZlci5zdGFydCwgbm9kZVNldCwgaW5SZXBlYXQgPCAwID8gTm9kZVR5cGUubm9uZSA6IHR5cGVzW2luUmVwZWF0XSk7XG4gICAgICAgICAgICBzdGFydFBvcyA9IGJ1ZmZlci5zdGFydCAtIHBhcmVudFN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBNYWtlIGl0IGEgbm9kZVxuICAgICAgICAgICAgbGV0IGVuZFBvcyA9IGN1cnNvci5wb3MgLSBzaXplO1xuICAgICAgICAgICAgY3Vyc29yLm5leHQoKTtcbiAgICAgICAgICAgIGxldCBsb2NhbENoaWxkcmVuID0gW10sIGxvY2FsUG9zaXRpb25zID0gW107XG4gICAgICAgICAgICBsZXQgbG9jYWxJblJlcGVhdCA9IGlkID49IG1pblJlcGVhdFR5cGUgPyBpZCA6IC0xO1xuICAgICAgICAgICAgd2hpbGUgKGN1cnNvci5wb3MgPiBlbmRQb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3Vyc29yLmlkID09IGxvY2FsSW5SZXBlYXQpXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0YWtlTm9kZShzdGFydCwgZW5kUG9zLCBsb2NhbENoaWxkcmVuLCBsb2NhbFBvc2l0aW9ucywgbG9jYWxJblJlcGVhdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbENoaWxkcmVuLnJldmVyc2UoKTtcbiAgICAgICAgICAgIGxvY2FsUG9zaXRpb25zLnJldmVyc2UoKTtcbiAgICAgICAgICAgIGlmIChsb2NhbEluUmVwZWF0ID4gLTEgJiYgbG9jYWxDaGlsZHJlbi5sZW5ndGggPiBCYWxhbmNlQnJhbmNoRmFjdG9yKVxuICAgICAgICAgICAgICAgIG5vZGUgPSBiYWxhbmNlUmFuZ2UodHlwZSwgdHlwZSwgbG9jYWxDaGlsZHJlbiwgbG9jYWxQb3NpdGlvbnMsIDAsIGxvY2FsQ2hpbGRyZW4ubGVuZ3RoLCAwLCBtYXhCdWZmZXJMZW5ndGgsIGVuZCAtIHN0YXJ0LCBjb250ZXh0SGFzaCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbm9kZSA9IHdpdGhIYXNoKG5ldyBUcmVlKHR5cGUsIGxvY2FsQ2hpbGRyZW4sIGxvY2FsUG9zaXRpb25zLCBlbmQgLSBzdGFydCksIGNvbnRleHRIYXNoKTtcbiAgICAgICAgfVxuICAgICAgICBjaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgICAgICBwb3NpdGlvbnMucHVzaChzdGFydFBvcyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpbmRCdWZmZXJTaXplKG1heFNpemUsIGluUmVwZWF0KSB7XG4gICAgICAgIC8vIFNjYW4gdGhyb3VnaCB0aGUgYnVmZmVyIHRvIGZpbmQgcHJldmlvdXMgc2libGluZ3MgdGhhdCBmaXRcbiAgICAgICAgLy8gdG9nZXRoZXIgaW4gYSBUcmVlQnVmZmVyLCBhbmQgZG9uJ3QgY29udGFpbiBhbnkgcmV1c2VkIG5vZGVzXG4gICAgICAgIC8vICh3aGljaCBjYW4ndCBiZSBzdG9yZWQgaW4gYSBidWZmZXIpLlxuICAgICAgICAvLyBJZiBgaW5SZXBlYXRgIGlzID4gLTEsIGlnbm9yZSBub2RlIGJvdW5kYXJpZXMgb2YgdGhhdCB0eXBlIGZvclxuICAgICAgICAvLyBuZXN0aW5nLCBidXQgbWFrZSBzdXJlIHRoZSBlbmQgZmFsbHMgZWl0aGVyIGF0IHRoZSBzdGFydFxuICAgICAgICAvLyAoYG1heFNpemVgKSBvciBiZWZvcmUgc3VjaCBhIG5vZGUuXG4gICAgICAgIGxldCBmb3JrID0gY3Vyc29yLmZvcmsoKTtcbiAgICAgICAgbGV0IHNpemUgPSAwLCBzdGFydCA9IDAsIHNraXAgPSAwLCBtaW5TdGFydCA9IGZvcmsuZW5kIC0gbWF4QnVmZmVyTGVuZ3RoO1xuICAgICAgICBsZXQgcmVzdWx0ID0geyBzaXplOiAwLCBzdGFydDogMCwgc2tpcDogMCB9O1xuICAgICAgICBzY2FuOiBmb3IgKGxldCBtaW5Qb3MgPSBmb3JrLnBvcyAtIG1heFNpemU7IGZvcmsucG9zID4gbWluUG9zOykge1xuICAgICAgICAgICAgLy8gUHJldGVuZCBuZXN0ZWQgcmVwZWF0IG5vZGVzIG9mIHRoZSBzYW1lIHR5cGUgZG9uJ3QgZXhpc3RcbiAgICAgICAgICAgIGlmIChmb3JrLmlkID09IGluUmVwZWF0KSB7XG4gICAgICAgICAgICAgICAgLy8gRXhjZXB0IHRoYXQgd2Ugc3RvcmUgdGhlIGN1cnJlbnQgc3RhdGUgYXMgYSB2YWxpZCByZXR1cm5cbiAgICAgICAgICAgICAgICAvLyB2YWx1ZS5cbiAgICAgICAgICAgICAgICByZXN1bHQuc2l6ZSA9IHNpemU7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnNraXAgPSBza2lwO1xuICAgICAgICAgICAgICAgIHNraXAgKz0gNDtcbiAgICAgICAgICAgICAgICBzaXplICs9IDQ7XG4gICAgICAgICAgICAgICAgZm9yay5uZXh0KCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbm9kZVNpemUgPSBmb3JrLnNpemUsIHN0YXJ0UG9zID0gZm9yay5wb3MgLSBub2RlU2l6ZTtcbiAgICAgICAgICAgIGlmIChub2RlU2l6ZSA8IDAgfHwgc3RhcnRQb3MgPCBtaW5Qb3MgfHwgZm9yay5zdGFydCA8IG1pblN0YXJ0KVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgbGV0IGxvY2FsU2tpcHBlZCA9IGZvcmsuaWQgPj0gbWluUmVwZWF0VHlwZSA/IDQgOiAwO1xuICAgICAgICAgICAgbGV0IG5vZGVTdGFydCA9IGZvcmsuc3RhcnQ7XG4gICAgICAgICAgICBmb3JrLm5leHQoKTtcbiAgICAgICAgICAgIHdoaWxlIChmb3JrLnBvcyA+IHN0YXJ0UG9zKSB7XG4gICAgICAgICAgICAgICAgaWYgKGZvcmsuc2l6ZSA8IDApXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIHNjYW47XG4gICAgICAgICAgICAgICAgaWYgKGZvcmsuaWQgPj0gbWluUmVwZWF0VHlwZSlcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTa2lwcGVkICs9IDQ7XG4gICAgICAgICAgICAgICAgZm9yay5uZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFydCA9IG5vZGVTdGFydDtcbiAgICAgICAgICAgIHNpemUgKz0gbm9kZVNpemU7XG4gICAgICAgICAgICBza2lwICs9IGxvY2FsU2tpcHBlZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5SZXBlYXQgPCAwIHx8IHNpemUgPT0gbWF4U2l6ZSkge1xuICAgICAgICAgICAgcmVzdWx0LnNpemUgPSBzaXplO1xuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgICByZXN1bHQuc2tpcCA9IHNraXA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdC5zaXplID4gNCA/IHJlc3VsdCA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29weVRvQnVmZmVyKGJ1ZmZlclN0YXJ0LCBidWZmZXIsIGluZGV4LCBpblJlcGVhdCkge1xuICAgICAgICBsZXQgeyBpZCwgc3RhcnQsIGVuZCwgc2l6ZSB9ID0gY3Vyc29yO1xuICAgICAgICBjdXJzb3IubmV4dCgpO1xuICAgICAgICBpZiAoaWQgPT0gaW5SZXBlYXQpXG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIGxldCBzdGFydEluZGV4ID0gaW5kZXg7XG4gICAgICAgIGlmIChzaXplID4gNCkge1xuICAgICAgICAgICAgbGV0IGVuZFBvcyA9IGN1cnNvci5wb3MgLSAoc2l6ZSAtIDQpO1xuICAgICAgICAgICAgd2hpbGUgKGN1cnNvci5wb3MgPiBlbmRQb3MpXG4gICAgICAgICAgICAgICAgaW5kZXggPSBjb3B5VG9CdWZmZXIoYnVmZmVyU3RhcnQsIGJ1ZmZlciwgaW5kZXgsIGluUmVwZWF0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWQgPCBtaW5SZXBlYXRUeXBlKSB7IC8vIERvbid0IGNvcHkgcmVwZWF0IG5vZGVzIGludG8gYnVmZmVyc1xuICAgICAgICAgICAgYnVmZmVyWy0taW5kZXhdID0gc3RhcnRJbmRleDtcbiAgICAgICAgICAgIGJ1ZmZlclstLWluZGV4XSA9IGVuZCAtIGJ1ZmZlclN0YXJ0O1xuICAgICAgICAgICAgYnVmZmVyWy0taW5kZXhdID0gc3RhcnQgLSBidWZmZXJTdGFydDtcbiAgICAgICAgICAgIGJ1ZmZlclstLWluZGV4XSA9IGlkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gICAgbGV0IGNoaWxkcmVuID0gW10sIHBvc2l0aW9ucyA9IFtdO1xuICAgIHdoaWxlIChjdXJzb3IucG9zID4gMClcbiAgICAgICAgdGFrZU5vZGUoZGF0YS5zdGFydCB8fCAwLCAwLCBjaGlsZHJlbiwgcG9zaXRpb25zLCAtMSk7XG4gICAgbGV0IGxlbmd0aCA9IChfYSA9IGRhdGEubGVuZ3RoKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoY2hpbGRyZW4ubGVuZ3RoID8gcG9zaXRpb25zWzBdICsgY2hpbGRyZW5bMF0ubGVuZ3RoIDogMCk7XG4gICAgcmV0dXJuIG5ldyBUcmVlKHR5cGVzW3RvcElEXSwgY2hpbGRyZW4ucmV2ZXJzZSgpLCBwb3NpdGlvbnMucmV2ZXJzZSgpLCBsZW5ndGgpO1xufVxuZnVuY3Rpb24gYmFsYW5jZVJhbmdlKG91dGVyVHlwZSwgaW5uZXJUeXBlLCBjaGlsZHJlbiwgcG9zaXRpb25zLCBmcm9tLCB0bywgc3RhcnQsIG1heEJ1ZmZlckxlbmd0aCwgbGVuZ3RoLCBjb250ZXh0SGFzaCkge1xuICAgIGxldCBsb2NhbENoaWxkcmVuID0gW10sIGxvY2FsUG9zaXRpb25zID0gW107XG4gICAgaWYgKGxlbmd0aCA8PSBtYXhCdWZmZXJMZW5ndGgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCB0bzsgaSsrKSB7XG4gICAgICAgICAgICBsb2NhbENoaWxkcmVuLnB1c2goY2hpbGRyZW5baV0pO1xuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbnMucHVzaChwb3NpdGlvbnNbaV0gLSBzdGFydCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBtYXhDaGlsZCA9IE1hdGgubWF4KG1heEJ1ZmZlckxlbmd0aCwgTWF0aC5jZWlsKGxlbmd0aCAqIDEuNSAvIEJhbGFuY2VCcmFuY2hGYWN0b3IpKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCB0bzspIHtcbiAgICAgICAgICAgIGxldCBncm91cEZyb20gPSBpLCBncm91cFN0YXJ0ID0gcG9zaXRpb25zW2ldO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgZm9yICg7IGkgPCB0bzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRFbmQgPSBwb3NpdGlvbnNbaV0gKyBjaGlsZHJlbltpXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRFbmQgLSBncm91cFN0YXJ0ID4gbWF4Q2hpbGQpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGkgPT0gZ3JvdXBGcm9tICsgMSkge1xuICAgICAgICAgICAgICAgIGxldCBvbmx5ID0gY2hpbGRyZW5bZ3JvdXBGcm9tXTtcbiAgICAgICAgICAgICAgICBpZiAob25seSBpbnN0YW5jZW9mIFRyZWUgJiYgb25seS50eXBlID09IGlubmVyVHlwZSAmJiBvbmx5Lmxlbmd0aCA+IG1heENoaWxkIDw8IDEpIHsgLy8gVG9vIGJpZywgY29sbGFwc2VcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBvbmx5LmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbENoaWxkcmVuLnB1c2gob25seS5jaGlsZHJlbltqXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhbFBvc2l0aW9ucy5wdXNoKG9ubHkucG9zaXRpb25zW2pdICsgZ3JvdXBTdGFydCAtIHN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbG9jYWxDaGlsZHJlbi5wdXNoKG9ubHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaSA9PSBncm91cEZyb20gKyAxKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxDaGlsZHJlbi5wdXNoKGNoaWxkcmVuW2dyb3VwRnJvbV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGlubmVyID0gYmFsYW5jZVJhbmdlKGlubmVyVHlwZSwgaW5uZXJUeXBlLCBjaGlsZHJlbiwgcG9zaXRpb25zLCBncm91cEZyb20sIGksIGdyb3VwU3RhcnQsIG1heEJ1ZmZlckxlbmd0aCwgcG9zaXRpb25zW2kgLSAxXSArIGNoaWxkcmVuW2kgLSAxXS5sZW5ndGggLSBncm91cFN0YXJ0LCBjb250ZXh0SGFzaCk7XG4gICAgICAgICAgICAgICAgaWYgKGlubmVyVHlwZSAhPSBOb2RlVHlwZS5ub25lICYmICFjb250YWluc1R5cGUoaW5uZXIuY2hpbGRyZW4sIGlubmVyVHlwZSkpXG4gICAgICAgICAgICAgICAgICAgIGlubmVyID0gd2l0aEhhc2gobmV3IFRyZWUoTm9kZVR5cGUubm9uZSwgaW5uZXIuY2hpbGRyZW4sIGlubmVyLnBvc2l0aW9ucywgaW5uZXIubGVuZ3RoKSwgY29udGV4dEhhc2gpO1xuICAgICAgICAgICAgICAgIGxvY2FsQ2hpbGRyZW4ucHVzaChpbm5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9ucy5wdXNoKGdyb3VwU3RhcnQgLSBzdGFydCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHdpdGhIYXNoKG5ldyBUcmVlKG91dGVyVHlwZSwgbG9jYWxDaGlsZHJlbiwgbG9jYWxQb3NpdGlvbnMsIGxlbmd0aCksIGNvbnRleHRIYXNoKTtcbn1cbmZ1bmN0aW9uIGNvbnRhaW5zVHlwZShub2RlcywgdHlwZSkge1xuICAgIGZvciAobGV0IGVsdCBvZiBub2RlcylcbiAgICAgICAgaWYgKGVsdC50eXBlID09IHR5cGUpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG4vLy8gVHJlZSBmcmFnbWVudHMgYXJlIHVzZWQgZHVyaW5nIFtpbmNyZW1lbnRhbFxuLy8vIHBhcnNpbmddKCNsZXplci5QYXJzZU9wdGlvbnMuZnJhZ21lbnRzKSB0byB0cmFjayBwYXJ0cyBvZiBvbGRcbi8vLyB0cmVlcyB0aGF0IGNhbiBiZSByZXVzZWQgaW4gYSBuZXcgcGFyc2UuIEFuIGFycmF5IG9mIGZyYWdtZW50cyBpc1xuLy8vIHVzZWQgdG8gdHJhY2sgcmVnaW9ucyBvZiBhbiBvbGQgdHJlZSB3aG9zZSBub2RlcyBtaWdodCBiZSByZXVzZWRcbi8vLyBpbiBuZXcgcGFyc2VzLiBVc2UgdGhlIHN0YXRpY1xuLy8vIFtgYXBwbHlDaGFuZ2VzYF0oI3RyZWUuVHJlZUZyYWdtZW50XmFwcGx5Q2hhbmdlcykgbWV0aG9kIHRvIHVwZGF0ZVxuLy8vIGZyYWdtZW50cyBmb3IgZG9jdW1lbnQgY2hhbmdlcy5cbmNsYXNzIFRyZWVGcmFnbWVudCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgLy8vIFRoZSBzdGFydCBvZiB0aGUgdW5jaGFuZ2VkIHJhbmdlIHBvaW50ZWQgdG8gYnkgdGhpcyBmcmFnbWVudC5cbiAgICAvLy8gVGhpcyByZWZlcnMgdG8gYW4gb2Zmc2V0IGluIHRoZSBfdXBkYXRlZF8gZG9jdW1lbnQgKGFzIG9wcG9zZWRcbiAgICAvLy8gdG8gdGhlIG9yaWdpbmFsIHRyZWUpLlxuICAgIGZyb20sIFxuICAgIC8vLyBUaGUgZW5kIG9mIHRoZSB1bmNoYW5nZWQgcmFuZ2UuXG4gICAgdG8sIFxuICAgIC8vLyBUaGUgdHJlZSB0aGF0IHRoaXMgZnJhZ21lbnQgaXMgYmFzZWQgb24uXG4gICAgdHJlZSwgXG4gICAgLy8vIFRoZSBvZmZzZXQgYmV0d2VlbiB0aGUgZnJhZ21lbnQncyB0cmVlIGFuZCB0aGUgZG9jdW1lbnQgdGhhdFxuICAgIC8vLyB0aGlzIGZyYWdtZW50IGNhbiBiZSB1c2VkIGFnYWluc3QuIEFkZCB0aGlzIHdoZW4gZ29pbmcgZnJvbVxuICAgIC8vLyBkb2N1bWVudCB0byB0cmVlIHBvc2l0aW9ucywgc3VidHJhY3QgaXQgdG8gZ28gZnJvbSB0cmVlIHRvXG4gICAgLy8vIGRvY3VtZW50IHBvc2l0aW9ucy5cbiAgICBvZmZzZXQsIG9wZW4pIHtcbiAgICAgICAgdGhpcy5mcm9tID0gZnJvbTtcbiAgICAgICAgdGhpcy50byA9IHRvO1xuICAgICAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgICAgICB0aGlzLm9mZnNldCA9IG9mZnNldDtcbiAgICAgICAgdGhpcy5vcGVuID0gb3BlbjtcbiAgICB9XG4gICAgZ2V0IG9wZW5TdGFydCgpIHsgcmV0dXJuICh0aGlzLm9wZW4gJiAxIC8qIFN0YXJ0ICovKSA+IDA7IH1cbiAgICBnZXQgb3BlbkVuZCgpIHsgcmV0dXJuICh0aGlzLm9wZW4gJiAyIC8qIEVuZCAqLykgPiAwOyB9XG4gICAgLy8vIEFwcGx5IGEgc2V0IG9mIGVkaXRzIHRvIGFuIGFycmF5IG9mIGZyYWdtZW50cywgcmVtb3Zpbmcgb3JcbiAgICAvLy8gc3BsaXR0aW5nIGZyYWdtZW50cyBhcyBuZWNlc3NhcnkgdG8gcmVtb3ZlIGVkaXRlZCByYW5nZXMsIGFuZFxuICAgIC8vLyBhZGp1c3Rpbmcgb2Zmc2V0cyBmb3IgZnJhZ21lbnRzIHRoYXQgbW92ZWQuXG4gICAgc3RhdGljIGFwcGx5Q2hhbmdlcyhmcmFnbWVudHMsIGNoYW5nZXMsIG1pbkdhcCA9IDEyOCkge1xuICAgICAgICBpZiAoIWNoYW5nZXMubGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGZyYWdtZW50cztcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsZXQgZkkgPSAxLCBuZXh0RiA9IGZyYWdtZW50cy5sZW5ndGggPyBmcmFnbWVudHNbMF0gOiBudWxsO1xuICAgICAgICBsZXQgY0kgPSAwLCBwb3MgPSAwLCBvZmYgPSAwO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBsZXQgbmV4dEMgPSBjSSA8IGNoYW5nZXMubGVuZ3RoID8gY2hhbmdlc1tjSSsrXSA6IG51bGw7XG4gICAgICAgICAgICBsZXQgbmV4dFBvcyA9IG5leHRDID8gbmV4dEMuZnJvbUEgOiAxZTk7XG4gICAgICAgICAgICBpZiAobmV4dFBvcyAtIHBvcyA+PSBtaW5HYXApXG4gICAgICAgICAgICAgICAgd2hpbGUgKG5leHRGICYmIG5leHRGLmZyb20gPCBuZXh0UG9zKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXQgPSBuZXh0RjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA+PSBjdXQuZnJvbSB8fCBuZXh0UG9zIDw9IGN1dC50byB8fCBvZmYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmRnJvbSA9IE1hdGgubWF4KGN1dC5mcm9tLCBwb3MpIC0gb2ZmLCBmVG8gPSBNYXRoLm1pbihjdXQudG8sIG5leHRQb3MpIC0gb2ZmO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3V0ID0gZkZyb20gPj0gZlRvID8gbnVsbCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRyZWVGcmFnbWVudChmRnJvbSwgZlRvLCBjdXQudHJlZSwgY3V0Lm9mZnNldCArIG9mZiwgKGNJID4gMCA/IDEgLyogU3RhcnQgKi8gOiAwKSB8IChuZXh0QyA/IDIgLyogRW5kICovIDogMCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXQpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjdXQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEYudG8gPiBuZXh0UG9zKVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIG5leHRGID0gZkkgPCBmcmFnbWVudHMubGVuZ3RoID8gZnJhZ21lbnRzW2ZJKytdIDogbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIW5leHRDKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgcG9zID0gbmV4dEMudG9BO1xuICAgICAgICAgICAgb2ZmID0gbmV4dEMudG9BIC0gbmV4dEMudG9CO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vLyBDcmVhdGUgYSBzZXQgb2YgZnJhZ21lbnRzIGZyb20gYSBmcmVzaGx5IHBhcnNlZCB0cmVlLCBvciB1cGRhdGVcbiAgICAvLy8gYW4gZXhpc3Rpbmcgc2V0IG9mIGZyYWdtZW50cyBieSByZXBsYWNpbmcgdGhlIG9uZXMgdGhhdCBvdmVybGFwXG4gICAgLy8vIHdpdGggYSB0cmVlIHdpdGggY29udGVudCBmcm9tIHRoZSBuZXcgdHJlZS4gV2hlbiBgcGFydGlhbGAgaXNcbiAgICAvLy8gdHJ1ZSwgdGhlIHBhcnNlIGlzIHRyZWF0ZWQgYXMgaW5jb21wbGV0ZSwgYW5kIHRoZSB0b2tlbiBhdCBpdHNcbiAgICAvLy8gZW5kIGlzIG5vdCBpbmNsdWRlZCBpbiBbYHNhZmVUb2BdKCN0cmVlLlRyZWVGcmFnbWVudC5zYWZlVG8pLlxuICAgIHN0YXRpYyBhZGRUcmVlKHRyZWUsIGZyYWdtZW50cyA9IFtdLCBwYXJ0aWFsID0gZmFsc2UpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtuZXcgVHJlZUZyYWdtZW50KDAsIHRyZWUubGVuZ3RoLCB0cmVlLCAwLCBwYXJ0aWFsID8gMiAvKiBFbmQgKi8gOiAwKV07XG4gICAgICAgIGZvciAobGV0IGYgb2YgZnJhZ21lbnRzKVxuICAgICAgICAgICAgaWYgKGYudG8gPiB0cmVlLmxlbmd0aClcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChmKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG4vLyBDcmVhdGVzIGFuIGBJbnB1dGAgdGhhdCBpcyBiYWNrZWQgYnkgYSBzaW5nbGUsIGZsYXQgc3RyaW5nLlxuZnVuY3Rpb24gc3RyaW5nSW5wdXQoaW5wdXQpIHsgcmV0dXJuIG5ldyBTdHJpbmdJbnB1dChpbnB1dCk7IH1cbmNsYXNzIFN0cmluZ0lucHV0IHtcbiAgICBjb25zdHJ1Y3RvcihzdHJpbmcsIGxlbmd0aCA9IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIH1cbiAgICBnZXQocG9zKSB7XG4gICAgICAgIHJldHVybiBwb3MgPCAwIHx8IHBvcyA+PSB0aGlzLmxlbmd0aCA/IC0xIDogdGhpcy5zdHJpbmcuY2hhckNvZGVBdChwb3MpO1xuICAgIH1cbiAgICBsaW5lQWZ0ZXIocG9zKSB7XG4gICAgICAgIGlmIChwb3MgPCAwKVxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIGxldCBlbmQgPSB0aGlzLnN0cmluZy5pbmRleE9mKFwiXFxuXCIsIHBvcyk7XG4gICAgICAgIHJldHVybiB0aGlzLnN0cmluZy5zbGljZShwb3MsIGVuZCA8IDAgPyB0aGlzLmxlbmd0aCA6IE1hdGgubWluKGVuZCwgdGhpcy5sZW5ndGgpKTtcbiAgICB9XG4gICAgcmVhZChmcm9tLCB0bykgeyByZXR1cm4gdGhpcy5zdHJpbmcuc2xpY2UoZnJvbSwgTWF0aC5taW4odGhpcy5sZW5ndGgsIHRvKSk7IH1cbiAgICBjbGlwKGF0KSB7IHJldHVybiBuZXcgU3RyaW5nSW5wdXQodGhpcy5zdHJpbmcsIGF0KTsgfVxufVxuXG5leHBvcnRzLkRlZmF1bHRCdWZmZXJMZW5ndGggPSBEZWZhdWx0QnVmZmVyTGVuZ3RoO1xuZXhwb3J0cy5Ob2RlUHJvcCA9IE5vZGVQcm9wO1xuZXhwb3J0cy5Ob2RlU2V0ID0gTm9kZVNldDtcbmV4cG9ydHMuTm9kZVR5cGUgPSBOb2RlVHlwZTtcbmV4cG9ydHMuVHJlZSA9IFRyZWU7XG5leHBvcnRzLlRyZWVCdWZmZXIgPSBUcmVlQnVmZmVyO1xuZXhwb3J0cy5UcmVlQ3Vyc29yID0gVHJlZUN1cnNvcjtcbmV4cG9ydHMuVHJlZUZyYWdtZW50ID0gVHJlZUZyYWdtZW50O1xuZXhwb3J0cy5zdHJpbmdJbnB1dCA9IHN0cmluZ0lucHV0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dHJlZS5janMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBsZXplclRyZWUgPSByZXF1aXJlKCdsZXplci10cmVlJyk7XG5cbi8vLyBBIHBhcnNlIHN0YWNrLiBUaGVzZSBhcmUgdXNlZCBpbnRlcm5hbGx5IGJ5IHRoZSBwYXJzZXIgdG8gdHJhY2tcbi8vLyBwYXJzaW5nIHByb2dyZXNzLiBUaGV5IGFsc28gcHJvdmlkZSBzb21lIHByb3BlcnRpZXMgYW5kIG1ldGhvZHNcbi8vLyB0aGF0IGV4dGVybmFsIGNvZGUgc3VjaCBhcyBhIHRva2VuaXplciBjYW4gdXNlIHRvIGdldCBpbmZvcm1hdGlvblxuLy8vIGFib3V0IHRoZSBwYXJzZSBzdGF0ZS5cbmNsYXNzIFN0YWNrIHtcbiAgICAvLy8gQGludGVybmFsXG4gICAgY29uc3RydWN0b3IoXG4gICAgLy8vIEEgdGhlIHBhcnNlIHRoYXQgdGhpcyBzdGFjayBpcyBwYXJ0IG9mIEBpbnRlcm5hbFxuICAgIHAsIFxuICAgIC8vLyBIb2xkcyBzdGF0ZSwgcG9zLCB2YWx1ZSBzdGFjayBwb3MgKDE1IGJpdHMgYXJyYXkgaW5kZXgsIDE1IGJpdHNcbiAgICAvLy8gYnVmZmVyIGluZGV4KSB0cmlwbGV0cyBmb3IgYWxsIGJ1dCB0aGUgdG9wIHN0YXRlXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHN0YWNrLCBcbiAgICAvLy8gVGhlIGN1cnJlbnQgcGFyc2Ugc3RhdGUgQGludGVybmFsXG4gICAgc3RhdGUsIFxuICAgIC8vIFRoZSBwb3NpdGlvbiBhdCB3aGljaCB0aGUgbmV4dCByZWR1Y2Ugc2hvdWxkIHRha2UgcGxhY2UuIFRoaXNcbiAgICAvLyBjYW4gYmUgbGVzcyB0aGFuIGB0aGlzLnBvc2Agd2hlbiBza2lwcGVkIGV4cHJlc3Npb25zIGhhdmUgYmVlblxuICAgIC8vIGFkZGVkIHRvIHRoZSBzdGFjayAod2hpY2ggc2hvdWxkIGJlIG1vdmVkIG91dHNpZGUgb2YgdGhlIG5leHRcbiAgICAvLyByZWR1Y3Rpb24pXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHJlZHVjZVBvcywgXG4gICAgLy8vIFRoZSBpbnB1dCBwb3NpdGlvbiB1cCB0byB3aGljaCB0aGlzIHN0YWNrIGhhcyBwYXJzZWQuXG4gICAgcG9zLCBcbiAgICAvLy8gVGhlIGR5bmFtaWMgc2NvcmUgb2YgdGhlIHN0YWNrLCBpbmNsdWRpbmcgZHluYW1pYyBwcmVjZWRlbmNlXG4gICAgLy8vIGFuZCBlcnJvci1yZWNvdmVyeSBwZW5hbHRpZXNcbiAgICAvLy8gQGludGVybmFsXG4gICAgc2NvcmUsIFxuICAgIC8vIFRoZSBvdXRwdXQgYnVmZmVyLiBIb2xkcyAodHlwZSwgc3RhcnQsIGVuZCwgc2l6ZSkgcXVhZHNcbiAgICAvLyByZXByZXNlbnRpbmcgbm9kZXMgY3JlYXRlZCBieSB0aGUgcGFyc2VyLCB3aGVyZSBgc2l6ZWAgaXNcbiAgICAvLyBhbW91bnQgb2YgYnVmZmVyIGFycmF5IGVudHJpZXMgY292ZXJlZCBieSB0aGlzIG5vZGUuXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGJ1ZmZlciwgXG4gICAgLy8gVGhlIGJhc2Ugb2Zmc2V0IG9mIHRoZSBidWZmZXIuIFdoZW4gc3RhY2tzIGFyZSBzcGxpdCwgdGhlIHNwbGl0XG4gICAgLy8gaW5zdGFuY2Ugc2hhcmVkIHRoZSBidWZmZXIgaGlzdG9yeSB3aXRoIGl0cyBwYXJlbnQgdXAgdG9cbiAgICAvLyBgYnVmZmVyQmFzZWAsIHdoaWNoIGlzIHRoZSBhYnNvbHV0ZSBvZmZzZXQgKGluY2x1ZGluZyB0aGVcbiAgICAvLyBvZmZzZXQgb2YgcHJldmlvdXMgc3BsaXRzKSBpbnRvIHRoZSBidWZmZXIgYXQgd2hpY2ggdGhpcyBzdGFja1xuICAgIC8vIHN0YXJ0cyB3cml0aW5nLlxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBidWZmZXJCYXNlLCBcbiAgICAvLy8gQGludGVybmFsXG4gICAgY3VyQ29udGV4dCwgXG4gICAgLy8gQSBwYXJlbnQgc3RhY2sgZnJvbSB3aGljaCB0aGlzIHdhcyBzcGxpdCBvZmYsIGlmIGFueS4gVGhpcyBpc1xuICAgIC8vIHNldCB1cCBzbyB0aGF0IGl0IGFsd2F5cyBwb2ludHMgdG8gYSBzdGFjayB0aGF0IGhhcyBzb21lXG4gICAgLy8gYWRkaXRpb25hbCBidWZmZXIgY29udGVudCwgbmV2ZXIgdG8gYSBzdGFjayB3aXRoIGFuIGVxdWFsXG4gICAgLy8gYGJ1ZmZlckJhc2VgLlxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBwYXJlbnQpIHtcbiAgICAgICAgdGhpcy5wID0gcDtcbiAgICAgICAgdGhpcy5zdGFjayA9IHN0YWNrO1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMucmVkdWNlUG9zID0gcmVkdWNlUG9zO1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgdGhpcy5zY29yZSA9IHNjb3JlO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgdGhpcy5idWZmZXJCYXNlID0gYnVmZmVyQmFzZTtcbiAgICAgICAgdGhpcy5jdXJDb250ZXh0ID0gY3VyQ29udGV4dDtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGBbJHt0aGlzLnN0YWNrLmZpbHRlcigoXywgaSkgPT4gaSAlIDMgPT0gMCkuY29uY2F0KHRoaXMuc3RhdGUpfV1AJHt0aGlzLnBvc30ke3RoaXMuc2NvcmUgPyBcIiFcIiArIHRoaXMuc2NvcmUgOiBcIlwifWA7XG4gICAgfVxuICAgIC8vIFN0YXJ0IGFuIGVtcHR5IHN0YWNrXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHN0YXRpYyBzdGFydChwLCBzdGF0ZSwgcG9zID0gMCkge1xuICAgICAgICBsZXQgY3ggPSBwLnBhcnNlci5jb250ZXh0O1xuICAgICAgICByZXR1cm4gbmV3IFN0YWNrKHAsIFtdLCBzdGF0ZSwgcG9zLCBwb3MsIDAsIFtdLCAwLCBjeCA/IG5ldyBTdGFja0NvbnRleHQoY3gsIGN4LnN0YXJ0KSA6IG51bGwsIG51bGwpO1xuICAgIH1cbiAgICAvLy8gVGhlIHN0YWNrJ3MgY3VycmVudCBbY29udGV4dF0oI2xlemVyLkNvbnRleHRUcmFja2VyKSB2YWx1ZSwgaWZcbiAgICAvLy8gYW55LiBJdHMgdHlwZSB3aWxsIGRlcGVuZCBvbiB0aGUgY29udGV4dCB0cmFja2VyJ3MgdHlwZVxuICAgIC8vLyBwYXJhbWV0ZXIsIG9yIGl0IHdpbGwgYmUgYG51bGxgIGlmIHRoZXJlIGlzIG5vIGNvbnRleHRcbiAgICAvLy8gdHJhY2tlci5cbiAgICBnZXQgY29udGV4dCgpIHsgcmV0dXJuIHRoaXMuY3VyQ29udGV4dCA/IHRoaXMuY3VyQ29udGV4dC5jb250ZXh0IDogbnVsbDsgfVxuICAgIC8vIFB1c2ggYSBzdGF0ZSBvbnRvIHRoZSBzdGFjaywgdHJhY2tpbmcgaXRzIHN0YXJ0IHBvc2l0aW9uIGFzIHdlbGxcbiAgICAvLyBhcyB0aGUgYnVmZmVyIGJhc2UgYXQgdGhhdCBwb2ludC5cbiAgICAvLy8gQGludGVybmFsXG4gICAgcHVzaFN0YXRlKHN0YXRlLCBzdGFydCkge1xuICAgICAgICB0aGlzLnN0YWNrLnB1c2godGhpcy5zdGF0ZSwgc3RhcnQsIHRoaXMuYnVmZmVyQmFzZSArIHRoaXMuYnVmZmVyLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB9XG4gICAgLy8gQXBwbHkgYSByZWR1Y2UgYWN0aW9uXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHJlZHVjZShhY3Rpb24pIHtcbiAgICAgICAgbGV0IGRlcHRoID0gYWN0aW9uID4+IDE5IC8qIFJlZHVjZURlcHRoU2hpZnQgKi8sIHR5cGUgPSBhY3Rpb24gJiA2NTUzNSAvKiBWYWx1ZU1hc2sgKi87XG4gICAgICAgIGxldCB7IHBhcnNlciB9ID0gdGhpcy5wO1xuICAgICAgICBsZXQgZFByZWMgPSBwYXJzZXIuZHluYW1pY1ByZWNlZGVuY2UodHlwZSk7XG4gICAgICAgIGlmIChkUHJlYylcbiAgICAgICAgICAgIHRoaXMuc2NvcmUgKz0gZFByZWM7XG4gICAgICAgIGlmIChkZXB0aCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBaZXJvLWRlcHRoIHJlZHVjdGlvbnMgYXJlIGEgc3BlY2lhbCBjYXNl4oCUdGhleSBhZGQgc3R1ZmYgdG9cbiAgICAgICAgICAgIC8vIHRoZSBzdGFjayB3aXRob3V0IHBvcHBpbmcgYW55dGhpbmcgb2ZmLlxuICAgICAgICAgICAgaWYgKHR5cGUgPCBwYXJzZXIubWluUmVwZWF0VGVybSlcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlTm9kZSh0eXBlLCB0aGlzLnJlZHVjZVBvcywgdGhpcy5yZWR1Y2VQb3MsIDQsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5wdXNoU3RhdGUocGFyc2VyLmdldEdvdG8odGhpcy5zdGF0ZSwgdHlwZSwgdHJ1ZSksIHRoaXMucmVkdWNlUG9zKTtcbiAgICAgICAgICAgIHRoaXMucmVkdWNlQ29udGV4dCh0eXBlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaW5kIHRoZSBiYXNlIGluZGV4IGludG8gYHRoaXMuc3RhY2tgLCBjb250ZW50IGFmdGVyIHdoaWNoIHdpbGxcbiAgICAgICAgLy8gYmUgZHJvcHBlZC4gTm90ZSB0aGF0IHdpdGggYFN0YXlGbGFnYCByZWR1Y3Rpb25zIHdlIG5lZWQgdG9cbiAgICAgICAgLy8gY29uc3VtZSB0d28gZXh0cmEgZnJhbWVzICh0aGUgZHVtbXkgcGFyZW50IG5vZGUgZm9yIHRoZSBza2lwcGVkXG4gICAgICAgIC8vIGV4cHJlc3Npb24gYW5kIHRoZSBzdGF0ZSB0aGF0IHdlJ2xsIGJlIHN0YXlpbmcgaW4sIHdoaWNoIHNob3VsZFxuICAgICAgICAvLyBiZSBtb3ZlZCB0byBgdGhpcy5zdGF0ZWApLlxuICAgICAgICBsZXQgYmFzZSA9IHRoaXMuc3RhY2subGVuZ3RoIC0gKChkZXB0aCAtIDEpICogMykgLSAoYWN0aW9uICYgMjYyMTQ0IC8qIFN0YXlGbGFnICovID8gNiA6IDApO1xuICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLnN0YWNrW2Jhc2UgLSAyXTtcbiAgICAgICAgbGV0IGJ1ZmZlckJhc2UgPSB0aGlzLnN0YWNrW2Jhc2UgLSAxXSwgY291bnQgPSB0aGlzLmJ1ZmZlckJhc2UgKyB0aGlzLmJ1ZmZlci5sZW5ndGggLSBidWZmZXJCYXNlO1xuICAgICAgICAvLyBTdG9yZSBub3JtYWwgdGVybXMgb3IgYFIgLT4gUiBSYCByZXBlYXQgcmVkdWN0aW9uc1xuICAgICAgICBpZiAodHlwZSA8IHBhcnNlci5taW5SZXBlYXRUZXJtIHx8IChhY3Rpb24gJiAxMzEwNzIgLyogUmVwZWF0RmxhZyAqLykpIHtcbiAgICAgICAgICAgIGxldCBwb3MgPSBwYXJzZXIuc3RhdGVGbGFnKHRoaXMuc3RhdGUsIDEgLyogU2tpcHBlZCAqLykgPyB0aGlzLnBvcyA6IHRoaXMucmVkdWNlUG9zO1xuICAgICAgICAgICAgdGhpcy5zdG9yZU5vZGUodHlwZSwgc3RhcnQsIHBvcywgY291bnQgKyA0LCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uICYgMjYyMTQ0IC8qIFN0YXlGbGFnICovKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5zdGFja1tiYXNlXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBiYXNlU3RhdGVJRCA9IHRoaXMuc3RhY2tbYmFzZSAtIDNdO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHBhcnNlci5nZXRHb3RvKGJhc2VTdGF0ZUlELCB0eXBlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodGhpcy5zdGFjay5sZW5ndGggPiBiYXNlKVxuICAgICAgICAgICAgdGhpcy5zdGFjay5wb3AoKTtcbiAgICAgICAgdGhpcy5yZWR1Y2VDb250ZXh0KHR5cGUpO1xuICAgIH1cbiAgICAvLyBTaGlmdCBhIHZhbHVlIGludG8gdGhlIGJ1ZmZlclxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBzdG9yZU5vZGUodGVybSwgc3RhcnQsIGVuZCwgc2l6ZSA9IDQsIGlzUmVkdWNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRlcm0gPT0gMCAvKiBFcnIgKi8pIHsgLy8gVHJ5IHRvIG9taXQvbWVyZ2UgYWRqYWNlbnQgZXJyb3Igbm9kZXNcbiAgICAgICAgICAgIGxldCBjdXIgPSB0aGlzLCB0b3AgPSB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gICAgICAgICAgICBpZiAodG9wID09IDAgJiYgY3VyLnBhcmVudCkge1xuICAgICAgICAgICAgICAgIHRvcCA9IGN1ci5idWZmZXJCYXNlIC0gY3VyLnBhcmVudC5idWZmZXJCYXNlO1xuICAgICAgICAgICAgICAgIGN1ciA9IGN1ci5wYXJlbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9wID4gMCAmJiBjdXIuYnVmZmVyW3RvcCAtIDRdID09IDAgLyogRXJyICovICYmIGN1ci5idWZmZXJbdG9wIC0gMV0gPiAtMSkge1xuICAgICAgICAgICAgICAgIGlmIChzdGFydCA9PSBlbmQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoY3VyLmJ1ZmZlclt0b3AgLSAyXSA+PSBzdGFydCkge1xuICAgICAgICAgICAgICAgICAgICBjdXIuYnVmZmVyW3RvcCAtIDJdID0gZW5kO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghaXNSZWR1Y2UgfHwgdGhpcy5wb3MgPT0gZW5kKSB7IC8vIFNpbXBsZSBjYXNlLCBqdXN0IGFwcGVuZFxuICAgICAgICAgICAgdGhpcy5idWZmZXIucHVzaCh0ZXJtLCBzdGFydCwgZW5kLCBzaXplKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8gVGhlcmUgbWF5IGJlIHNraXBwZWQgbm9kZXMgdGhhdCBoYXZlIHRvIGJlIG1vdmVkIGZvcndhcmRcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IDAgJiYgdGhpcy5idWZmZXJbaW5kZXggLSA0XSAhPSAwIC8qIEVyciAqLylcbiAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPiAwICYmIHRoaXMuYnVmZmVyW2luZGV4IC0gMl0gPiBlbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSB0aGlzIHJlY29yZCBmb3J3YXJkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyW2luZGV4XSA9IHRoaXMuYnVmZmVyW2luZGV4IC0gNF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyW2luZGV4ICsgMV0gPSB0aGlzLmJ1ZmZlcltpbmRleCAtIDNdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlcltpbmRleCArIDJdID0gdGhpcy5idWZmZXJbaW5kZXggLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJbaW5kZXggKyAzXSA9IHRoaXMuYnVmZmVyW2luZGV4IC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGluZGV4IC09IDQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaXplID4gNClcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemUgLT0gNDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlcltpbmRleF0gPSB0ZXJtO1xuICAgICAgICAgICAgdGhpcy5idWZmZXJbaW5kZXggKyAxXSA9IHN0YXJ0O1xuICAgICAgICAgICAgdGhpcy5idWZmZXJbaW5kZXggKyAyXSA9IGVuZDtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyW2luZGV4ICsgM10gPSBzaXplO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFwcGx5IGEgc2hpZnQgYWN0aW9uXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHNoaWZ0KGFjdGlvbiwgbmV4dCwgbmV4dEVuZCkge1xuICAgICAgICBpZiAoYWN0aW9uICYgMTMxMDcyIC8qIEdvdG9GbGFnICovKSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hTdGF0ZShhY3Rpb24gJiA2NTUzNSAvKiBWYWx1ZU1hc2sgKi8sIHRoaXMucG9zKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoYWN0aW9uICYgMjYyMTQ0IC8qIFN0YXlGbGFnICovKSA9PSAwKSB7IC8vIFJlZ3VsYXIgc2hpZnRcbiAgICAgICAgICAgIGxldCBzdGFydCA9IHRoaXMucG9zLCBuZXh0U3RhdGUgPSBhY3Rpb24sIHsgcGFyc2VyIH0gPSB0aGlzLnA7XG4gICAgICAgICAgICBpZiAobmV4dEVuZCA+IHRoaXMucG9zIHx8IG5leHQgPD0gcGFyc2VyLm1heE5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcyA9IG5leHRFbmQ7XG4gICAgICAgICAgICAgICAgaWYgKCFwYXJzZXIuc3RhdGVGbGFnKG5leHRTdGF0ZSwgMSAvKiBTa2lwcGVkICovKSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWR1Y2VQb3MgPSBuZXh0RW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wdXNoU3RhdGUobmV4dFN0YXRlLCBzdGFydCk7XG4gICAgICAgICAgICBpZiAobmV4dCA8PSBwYXJzZXIubWF4Tm9kZSlcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlci5wdXNoKG5leHQsIHN0YXJ0LCBuZXh0RW5kLCA0KTtcbiAgICAgICAgICAgIHRoaXMuc2hpZnRDb250ZXh0KG5leHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBTaGlmdC1hbmQtc3RheSwgd2hpY2ggbWVhbnMgdGhpcyBpcyBhIHNraXBwZWQgdG9rZW5cbiAgICAgICAgICAgIGlmIChuZXh0IDw9IHRoaXMucC5wYXJzZXIubWF4Tm9kZSlcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlci5wdXNoKG5leHQsIHRoaXMucG9zLCBuZXh0RW5kLCA0KTtcbiAgICAgICAgICAgIHRoaXMucG9zID0gbmV4dEVuZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBcHBseSBhbiBhY3Rpb25cbiAgICAvLy8gQGludGVybmFsXG4gICAgYXBwbHkoYWN0aW9uLCBuZXh0LCBuZXh0RW5kKSB7XG4gICAgICAgIGlmIChhY3Rpb24gJiA2NTUzNiAvKiBSZWR1Y2VGbGFnICovKVxuICAgICAgICAgICAgdGhpcy5yZWR1Y2UoYWN0aW9uKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5zaGlmdChhY3Rpb24sIG5leHQsIG5leHRFbmQpO1xuICAgIH1cbiAgICAvLyBBZGQgYSBwcmVidWlsdCBub2RlIGludG8gdGhlIGJ1ZmZlci4gVGhpcyBtYXkgYmUgYSByZXVzZWQgbm9kZSBvclxuICAgIC8vIHRoZSByZXN1bHQgb2YgcnVubmluZyBhIG5lc3RlZCBwYXJzZXIuXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHVzZU5vZGUodmFsdWUsIG5leHQpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wLnJldXNlZC5sZW5ndGggLSAxO1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IHRoaXMucC5yZXVzZWRbaW5kZXhdICE9IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnAucmV1c2VkLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgfVxuICAgICAgICBsZXQgc3RhcnQgPSB0aGlzLnBvcztcbiAgICAgICAgdGhpcy5yZWR1Y2VQb3MgPSB0aGlzLnBvcyA9IHN0YXJ0ICsgdmFsdWUubGVuZ3RoO1xuICAgICAgICB0aGlzLnB1c2hTdGF0ZShuZXh0LCBzdGFydCk7XG4gICAgICAgIHRoaXMuYnVmZmVyLnB1c2goaW5kZXgsIHN0YXJ0LCB0aGlzLnJlZHVjZVBvcywgLTEgLyogc2l6ZSA8IDAgbWVhbnMgdGhpcyBpcyBhIHJldXNlZCB2YWx1ZSAqLyk7XG4gICAgICAgIGlmICh0aGlzLmN1ckNvbnRleHQpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRleHQodGhpcy5jdXJDb250ZXh0LnRyYWNrZXIucmV1c2UodGhpcy5jdXJDb250ZXh0LmNvbnRleHQsIHZhbHVlLCB0aGlzLnAuaW5wdXQsIHRoaXMpKTtcbiAgICB9XG4gICAgLy8gU3BsaXQgdGhlIHN0YWNrLiBEdWUgdG8gdGhlIGJ1ZmZlciBzaGFyaW5nIGFuZCB0aGUgZmFjdFxuICAgIC8vIHRoYXQgYHRoaXMuc3RhY2tgIHRlbmRzIHRvIHN0YXkgcXVpdGUgc2hhbGxvdywgdGhpcyBpc24ndCB2ZXJ5XG4gICAgLy8gZXhwZW5zaXZlLlxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBzcGxpdCgpIHtcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXM7XG4gICAgICAgIGxldCBvZmYgPSBwYXJlbnQuYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgLy8gQmVjYXVzZSB0aGUgdG9wIG9mIHRoZSBidWZmZXIgKGFmdGVyIHRoaXMucG9zKSBtYXkgYmUgbXV0YXRlZFxuICAgICAgICAvLyB0byByZW9yZGVyIHJlZHVjdGlvbnMgYW5kIHNraXBwZWQgdG9rZW5zLCBhbmQgc2hhcmVkIGJ1ZmZlcnNcbiAgICAgICAgLy8gc2hvdWxkIGJlIGltbXV0YWJsZSwgdGhpcyBjb3BpZXMgYW55IG91dHN0YW5kaW5nIHNraXBwZWQgdG9rZW5zXG4gICAgICAgIC8vIHRvIHRoZSBuZXcgYnVmZmVyLCBhbmQgcHV0cyB0aGUgYmFzZSBwb2ludGVyIGJlZm9yZSB0aGVtLlxuICAgICAgICB3aGlsZSAob2ZmID4gMCAmJiBwYXJlbnQuYnVmZmVyW29mZiAtIDJdID4gcGFyZW50LnJlZHVjZVBvcylcbiAgICAgICAgICAgIG9mZiAtPSA0O1xuICAgICAgICBsZXQgYnVmZmVyID0gcGFyZW50LmJ1ZmZlci5zbGljZShvZmYpLCBiYXNlID0gcGFyZW50LmJ1ZmZlckJhc2UgKyBvZmY7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBwYXJlbnQgcG9pbnRzIHRvIGFuIGFjdHVhbCBwYXJlbnQgd2l0aCBjb250ZW50LCBpZiB0aGVyZSBpcyBzdWNoIGEgcGFyZW50LlxuICAgICAgICB3aGlsZSAocGFyZW50ICYmIGJhc2UgPT0gcGFyZW50LmJ1ZmZlckJhc2UpXG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICByZXR1cm4gbmV3IFN0YWNrKHRoaXMucCwgdGhpcy5zdGFjay5zbGljZSgpLCB0aGlzLnN0YXRlLCB0aGlzLnJlZHVjZVBvcywgdGhpcy5wb3MsIHRoaXMuc2NvcmUsIGJ1ZmZlciwgYmFzZSwgdGhpcy5jdXJDb250ZXh0LCBwYXJlbnQpO1xuICAgIH1cbiAgICAvLyBUcnkgdG8gcmVjb3ZlciBmcm9tIGFuIGVycm9yIGJ5ICdkZWxldGluZycgKGlnbm9yaW5nKSBvbmUgdG9rZW4uXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHJlY292ZXJCeURlbGV0ZShuZXh0LCBuZXh0RW5kKSB7XG4gICAgICAgIGxldCBpc05vZGUgPSBuZXh0IDw9IHRoaXMucC5wYXJzZXIubWF4Tm9kZTtcbiAgICAgICAgaWYgKGlzTm9kZSlcbiAgICAgICAgICAgIHRoaXMuc3RvcmVOb2RlKG5leHQsIHRoaXMucG9zLCBuZXh0RW5kKTtcbiAgICAgICAgdGhpcy5zdG9yZU5vZGUoMCAvKiBFcnIgKi8sIHRoaXMucG9zLCBuZXh0RW5kLCBpc05vZGUgPyA4IDogNCk7XG4gICAgICAgIHRoaXMucG9zID0gdGhpcy5yZWR1Y2VQb3MgPSBuZXh0RW5kO1xuICAgICAgICB0aGlzLnNjb3JlIC09IDIwMCAvKiBUb2tlbiAqLztcbiAgICB9XG4gICAgLy8vIENoZWNrIGlmIHRoZSBnaXZlbiB0ZXJtIHdvdWxkIGJlIGFibGUgdG8gYmUgc2hpZnRlZCAob3B0aW9uYWxseVxuICAgIC8vLyBhZnRlciBzb21lIHJlZHVjdGlvbnMpIG9uIHRoaXMgc3RhY2suIFRoaXMgY2FuIGJlIHVzZWZ1bCBmb3JcbiAgICAvLy8gZXh0ZXJuYWwgdG9rZW5pemVycyB0aGF0IHdhbnQgdG8gbWFrZSBzdXJlIHRoZXkgb25seSBwcm92aWRlIGFcbiAgICAvLy8gZ2l2ZW4gdG9rZW4gd2hlbiBpdCBhcHBsaWVzLlxuICAgIGNhblNoaWZ0KHRlcm0pIHtcbiAgICAgICAgZm9yIChsZXQgc2ltID0gbmV3IFNpbXVsYXRlZFN0YWNrKHRoaXMpOzspIHtcbiAgICAgICAgICAgIGxldCBhY3Rpb24gPSB0aGlzLnAucGFyc2VyLnN0YXRlU2xvdChzaW0udG9wLCA0IC8qIERlZmF1bHRSZWR1Y2UgKi8pIHx8IHRoaXMucC5wYXJzZXIuaGFzQWN0aW9uKHNpbS50b3AsIHRlcm0pO1xuICAgICAgICAgICAgaWYgKChhY3Rpb24gJiA2NTUzNiAvKiBSZWR1Y2VGbGFnICovKSA9PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKGFjdGlvbiA9PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHNpbS5yZWR1Y2UoYWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLy8gRmluZCB0aGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJ1bGUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgcGFyc2VkLlxuICAgIGdldCBydWxlU3RhcnQoKSB7XG4gICAgICAgIGZvciAobGV0IHN0YXRlID0gdGhpcy5zdGF0ZSwgYmFzZSA9IHRoaXMuc3RhY2subGVuZ3RoOzspIHtcbiAgICAgICAgICAgIGxldCBmb3JjZSA9IHRoaXMucC5wYXJzZXIuc3RhdGVTbG90KHN0YXRlLCA1IC8qIEZvcmNlZFJlZHVjZSAqLyk7XG4gICAgICAgICAgICBpZiAoIShmb3JjZSAmIDY1NTM2IC8qIFJlZHVjZUZsYWcgKi8pKVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgYmFzZSAtPSAzICogKGZvcmNlID4+IDE5IC8qIFJlZHVjZURlcHRoU2hpZnQgKi8pO1xuICAgICAgICAgICAgaWYgKChmb3JjZSAmIDY1NTM1IC8qIFZhbHVlTWFzayAqLykgPCB0aGlzLnAucGFyc2VyLm1pblJlcGVhdFRlcm0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tbYmFzZSArIDFdO1xuICAgICAgICAgICAgc3RhdGUgPSB0aGlzLnN0YWNrW2Jhc2VdO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLyBGaW5kIHRoZSBzdGFydCBwb3NpdGlvbiBvZiBhbiBpbnN0YW5jZSBvZiBhbnkgb2YgdGhlIGdpdmVuIHRlcm1cbiAgICAvLy8gdHlwZXMsIG9yIHJldHVybiBgbnVsbGAgd2hlbiBub25lIG9mIHRoZW0gYXJlIGZvdW5kLlxuICAgIC8vL1xuICAgIC8vLyAqKk5vdGU6KiogdGhpcyBpcyBvbmx5IHJlbGlhYmxlIHdoZW4gdGhlcmUgaXMgYXQgbGVhc3Qgc29tZVxuICAgIC8vLyBzdGF0ZSB0aGF0IHVuYW1iaWd1b3VzbHkgbWF0Y2hlcyB0aGUgZ2l2ZW4gcnVsZSBvbiB0aGUgc3RhY2suXG4gICAgLy8vIEkuZS4gaWYgeW91IGhhdmUgYSBncmFtbWFyIGxpa2UgdGhpcywgd2hlcmUgdGhlIGRpZmZlcmVuY2VcbiAgICAvLy8gYmV0d2VlbiBgYWAgYW5kIGBiYCBpcyBvbmx5IGFwcGFyZW50IGF0IHRoZSB0aGlyZCB0b2tlbjpcbiAgICAvLy9cbiAgICAvLy8gICAgIGEgeyBiIHwgYyB9XG4gICAgLy8vICAgICBiIHsgXCJ4XCIgXCJ5XCIgXCJ4XCIgfVxuICAgIC8vLyAgICAgYyB7IFwieFwiIFwieVwiIFwielwiIH1cbiAgICAvLy9cbiAgICAvLy8gVGhlbiBhIHBhcnNlIHN0YXRlIGFmdGVyIGBcInhcImAgd2lsbCBub3QgcmVsaWFibHkgdGVsbCB5b3UgdGhhdFxuICAgIC8vLyBgYmAgaXMgb24gdGhlIHN0YWNrLiBZb3UgX2Nhbl8gcGFzcyBgW2IsIGNdYCB0byByZWxpYWJseSBjaGVja1xuICAgIC8vLyBmb3IgZWl0aGVyIG9mIHRob3NlIHR3byBydWxlcyAoYXNzdW1pbmcgdGhhdCBgYWAgaXNuJ3QgcGFydCBvZlxuICAgIC8vLyBzb21lIHJ1bGUgdGhhdCBpbmNsdWRlcyBvdGhlciB0aGluZ3Mgc3RhcnRpbmcgd2l0aCBgXCJ4XCJgKS5cbiAgICAvLy9cbiAgICAvLy8gV2hlbiBgYmVmb3JlYCBpcyBnaXZlbiwgdGhpcyBrZWVwcyBzY2FubmluZyB1cCB0aGUgc3RhY2sgdW50aWxcbiAgICAvLy8gaXQgZmluZHMgYSBtYXRjaCB0aGF0IHN0YXJ0cyBiZWZvcmUgdGhhdCBwb3NpdGlvbi5cbiAgICAvLy9cbiAgICAvLy8gTm90ZSB0aGF0IHlvdSBoYXZlIHRvIGJlIGNhcmVmdWwgd2hlbiB1c2luZyB0aGlzIGluIHRva2VuaXplcnMsXG4gICAgLy8vIHNpbmNlIGl0J3MgcmVsYXRpdmVseSBlYXN5IHRvIGludHJvZHVjZSBkYXRhIGRlcGVuZGVuY2llcyB0aGF0XG4gICAgLy8vIGJyZWFrIGluY3JlbWVudGFsIHBhcnNpbmcgYnkgdXNpbmcgdGhpcyBtZXRob2QuXG4gICAgc3RhcnRPZih0eXBlcywgYmVmb3JlKSB7XG4gICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuc3RhdGUsIGZyYW1lID0gdGhpcy5zdGFjay5sZW5ndGgsIHsgcGFyc2VyIH0gPSB0aGlzLnA7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIGxldCBmb3JjZSA9IHBhcnNlci5zdGF0ZVNsb3Qoc3RhdGUsIDUgLyogRm9yY2VkUmVkdWNlICovKTtcbiAgICAgICAgICAgIGxldCBkZXB0aCA9IGZvcmNlID4+IDE5IC8qIFJlZHVjZURlcHRoU2hpZnQgKi8sIHRlcm0gPSBmb3JjZSAmIDY1NTM1IC8qIFZhbHVlTWFzayAqLztcbiAgICAgICAgICAgIGlmICh0eXBlcy5pbmRleE9mKHRlcm0pID4gLTEpIHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZSA9IGZyYW1lIC0gKDMgKiAoZm9yY2UgPj4gMTkgLyogUmVkdWNlRGVwdGhTaGlmdCAqLykpLCBwb3MgPSB0aGlzLnN0YWNrW2Jhc2UgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAoYmVmb3JlID09IG51bGwgfHwgYmVmb3JlID4gcG9zKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZyYW1lID09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBpZiAoZGVwdGggPT0gMCkge1xuICAgICAgICAgICAgICAgIGZyYW1lIC09IDM7XG4gICAgICAgICAgICAgICAgc3RhdGUgPSB0aGlzLnN0YWNrW2ZyYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZyYW1lIC09IDMgKiAoZGVwdGggLSAxKTtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IHBhcnNlci5nZXRHb3RvKHRoaXMuc3RhY2tbZnJhbWUgLSAzXSwgdGVybSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQXBwbHkgdXAgdG8gUmVjb3Zlci5NYXhOZXh0IHJlY292ZXJ5IGFjdGlvbnMgdGhhdCBjb25jZXB0dWFsbHlcbiAgICAvLyBpbnNlcnRzIHNvbWUgbWlzc2luZyB0b2tlbiBvciBydWxlLlxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICByZWNvdmVyQnlJbnNlcnQobmV4dCkge1xuICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPj0gMzAwIC8qIE1heEluc2VydFN0YWNrRGVwdGggKi8pXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIGxldCBuZXh0U3RhdGVzID0gdGhpcy5wLnBhcnNlci5uZXh0U3RhdGVzKHRoaXMuc3RhdGUpO1xuICAgICAgICBpZiAobmV4dFN0YXRlcy5sZW5ndGggPiA0IC8qIE1heE5leHQgKi8gPDwgMSB8fCB0aGlzLnN0YWNrLmxlbmd0aCA+PSAxMjAgLyogRGFtcGVuSW5zZXJ0U3RhY2tEZXB0aCAqLykge1xuICAgICAgICAgICAgbGV0IGJlc3QgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBzOyBpIDwgbmV4dFN0YXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIGlmICgocyA9IG5leHRTdGF0ZXNbaSArIDFdKSAhPSB0aGlzLnN0YXRlICYmIHRoaXMucC5wYXJzZXIuaGFzQWN0aW9uKHMsIG5leHQpKVxuICAgICAgICAgICAgICAgICAgICBiZXN0LnB1c2gobmV4dFN0YXRlc1tpXSwgcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPCAxMjAgLyogRGFtcGVuSW5zZXJ0U3RhY2tEZXB0aCAqLylcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgYmVzdC5sZW5ndGggPCA0IC8qIE1heE5leHQgKi8gPDwgMSAmJiBpIDwgbmV4dFN0YXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcyA9IG5leHRTdGF0ZXNbaSArIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWJlc3Quc29tZSgodiwgaSkgPT4gKGkgJiAxKSAmJiB2ID09IHMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdC5wdXNoKG5leHRTdGF0ZXNbaV0sIHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5leHRTdGF0ZXMgPSBiZXN0O1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXh0U3RhdGVzLmxlbmd0aCAmJiByZXN1bHQubGVuZ3RoIDwgNCAvKiBNYXhOZXh0ICovOyBpICs9IDIpIHtcbiAgICAgICAgICAgIGxldCBzID0gbmV4dFN0YXRlc1tpICsgMV07XG4gICAgICAgICAgICBpZiAocyA9PSB0aGlzLnN0YXRlKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IHN0YWNrID0gdGhpcy5zcGxpdCgpO1xuICAgICAgICAgICAgc3RhY2suc3RvcmVOb2RlKDAgLyogRXJyICovLCBzdGFjay5wb3MsIHN0YWNrLnBvcywgNCwgdHJ1ZSk7XG4gICAgICAgICAgICBzdGFjay5wdXNoU3RhdGUocywgdGhpcy5wb3MpO1xuICAgICAgICAgICAgc3RhY2suc2hpZnRDb250ZXh0KG5leHRTdGF0ZXNbaV0pO1xuICAgICAgICAgICAgc3RhY2suc2NvcmUgLT0gMjAwIC8qIFRva2VuICovO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goc3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8vIEZvcmNlIGEgcmVkdWNlLCBpZiBwb3NzaWJsZS4gUmV0dXJuIGZhbHNlIGlmIHRoYXQgY2FuJ3RcbiAgICAvLyBiZSBkb25lLlxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBmb3JjZVJlZHVjZSgpIHtcbiAgICAgICAgbGV0IHJlZHVjZSA9IHRoaXMucC5wYXJzZXIuc3RhdGVTbG90KHRoaXMuc3RhdGUsIDUgLyogRm9yY2VkUmVkdWNlICovKTtcbiAgICAgICAgaWYgKChyZWR1Y2UgJiA2NTUzNiAvKiBSZWR1Y2VGbGFnICovKSA9PSAwKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAoIXRoaXMucC5wYXJzZXIudmFsaWRBY3Rpb24odGhpcy5zdGF0ZSwgcmVkdWNlKSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZU5vZGUoMCAvKiBFcnIgKi8sIHRoaXMucmVkdWNlUG9zLCB0aGlzLnJlZHVjZVBvcywgNCwgdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNjb3JlIC09IDEwMCAvKiBSZWR1Y2UgKi87XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWR1Y2UocmVkdWNlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBmb3JjZUFsbCgpIHtcbiAgICAgICAgd2hpbGUgKCF0aGlzLnAucGFyc2VyLnN0YXRlRmxhZyh0aGlzLnN0YXRlLCAyIC8qIEFjY2VwdGluZyAqLykgJiYgdGhpcy5mb3JjZVJlZHVjZSgpKSB7IH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vLyBDaGVjayB3aGV0aGVyIHRoaXMgc3RhdGUgaGFzIG5vIGZ1cnRoZXIgYWN0aW9ucyAoYXNzdW1lZCB0byBiZSBhIGRpcmVjdCBkZXNjZW5kYW50IG9mIHRoZVxuICAgIC8vLyB0b3Agc3RhdGUsIHNpbmNlIGFueSBvdGhlciBzdGF0ZXMgbXVzdCBiZSBhYmxlIHRvIGNvbnRpbnVlXG4gICAgLy8vIHNvbWVob3cpLiBAaW50ZXJuYWxcbiAgICBnZXQgZGVhZEVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoICE9IDMpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGxldCB7IHBhcnNlciB9ID0gdGhpcy5wO1xuICAgICAgICByZXR1cm4gcGFyc2VyLmRhdGFbcGFyc2VyLnN0YXRlU2xvdCh0aGlzLnN0YXRlLCAxIC8qIEFjdGlvbnMgKi8pXSA9PSA2NTUzNSAvKiBFbmQgKi8gJiZcbiAgICAgICAgICAgICFwYXJzZXIuc3RhdGVTbG90KHRoaXMuc3RhdGUsIDQgLyogRGVmYXVsdFJlZHVjZSAqLyk7XG4gICAgfVxuICAgIC8vLyBSZXN0YXJ0IHRoZSBzdGFjayAocHV0IGl0IGJhY2sgaW4gaXRzIHN0YXJ0IHN0YXRlKS4gT25seSBzYWZlXG4gICAgLy8vIHdoZW4gdGhpcy5zdGFjay5sZW5ndGggPT0gMyAoc3RhdGUgaXMgZGlyZWN0bHkgYmVsb3cgdGhlIHRvcFxuICAgIC8vLyBzdGF0ZSkuIEBpbnRlcm5hbFxuICAgIHJlc3RhcnQoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnN0YWNrWzBdO1xuICAgICAgICB0aGlzLnN0YWNrLmxlbmd0aCA9IDA7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBzYW1lU3RhdGUob3RoZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT0gb3RoZXIuc3RhdGUgfHwgdGhpcy5zdGFjay5sZW5ndGggIT0gb3RoZXIuc3RhY2subGVuZ3RoKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhY2subGVuZ3RoOyBpICs9IDMpXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFja1tpXSAhPSBvdGhlci5zdGFja1tpXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLy8gR2V0IHRoZSBwYXJzZXIgdXNlZCBieSB0aGlzIHN0YWNrLlxuICAgIGdldCBwYXJzZXIoKSB7IHJldHVybiB0aGlzLnAucGFyc2VyOyB9XG4gICAgLy8vIFRlc3Qgd2hldGhlciBhIGdpdmVuIGRpYWxlY3QgKGJ5IG51bWVyaWMgSUQsIGFzIGV4cG9ydGVkIGZyb21cbiAgICAvLy8gdGhlIHRlcm1zIGZpbGUpIGlzIGVuYWJsZWQuXG4gICAgZGlhbGVjdEVuYWJsZWQoZGlhbGVjdElEKSB7IHJldHVybiB0aGlzLnAucGFyc2VyLmRpYWxlY3QuZmxhZ3NbZGlhbGVjdElEXTsgfVxuICAgIHNoaWZ0Q29udGV4dCh0ZXJtKSB7XG4gICAgICAgIGlmICh0aGlzLmN1ckNvbnRleHQpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRleHQodGhpcy5jdXJDb250ZXh0LnRyYWNrZXIuc2hpZnQodGhpcy5jdXJDb250ZXh0LmNvbnRleHQsIHRlcm0sIHRoaXMucC5pbnB1dCwgdGhpcykpO1xuICAgIH1cbiAgICByZWR1Y2VDb250ZXh0KHRlcm0pIHtcbiAgICAgICAgaWYgKHRoaXMuY3VyQ29udGV4dClcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29udGV4dCh0aGlzLmN1ckNvbnRleHQudHJhY2tlci5yZWR1Y2UodGhpcy5jdXJDb250ZXh0LmNvbnRleHQsIHRlcm0sIHRoaXMucC5pbnB1dCwgdGhpcykpO1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgZW1pdENvbnRleHQoKSB7XG4gICAgICAgIGxldCBjeCA9IHRoaXMuY3VyQ29udGV4dDtcbiAgICAgICAgaWYgKCFjeC50cmFja2VyLnN0cmljdClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IGxhc3QgPSB0aGlzLmJ1ZmZlci5sZW5ndGggLSAxO1xuICAgICAgICBpZiAobGFzdCA8IDAgfHwgdGhpcy5idWZmZXJbbGFzdF0gIT0gLTIpXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlci5wdXNoKGN4Lmhhc2gsIHRoaXMucmVkdWNlUG9zLCB0aGlzLnJlZHVjZVBvcywgLTIpO1xuICAgIH1cbiAgICB1cGRhdGVDb250ZXh0KGNvbnRleHQpIHtcbiAgICAgICAgaWYgKGNvbnRleHQgIT0gdGhpcy5jdXJDb250ZXh0LmNvbnRleHQpIHtcbiAgICAgICAgICAgIGxldCBuZXdDeCA9IG5ldyBTdGFja0NvbnRleHQodGhpcy5jdXJDb250ZXh0LnRyYWNrZXIsIGNvbnRleHQpO1xuICAgICAgICAgICAgaWYgKG5ld0N4Lmhhc2ggIT0gdGhpcy5jdXJDb250ZXh0Lmhhc2gpXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0Q29udGV4dCgpO1xuICAgICAgICAgICAgdGhpcy5jdXJDb250ZXh0ID0gbmV3Q3g7XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBTdGFja0NvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKHRyYWNrZXIsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy50cmFja2VyID0gdHJhY2tlcjtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5oYXNoID0gdHJhY2tlci5oYXNoKGNvbnRleHQpO1xuICAgIH1cbn1cbnZhciBSZWNvdmVyO1xuKGZ1bmN0aW9uIChSZWNvdmVyKSB7XG4gICAgUmVjb3ZlcltSZWNvdmVyW1wiVG9rZW5cIl0gPSAyMDBdID0gXCJUb2tlblwiO1xuICAgIFJlY292ZXJbUmVjb3ZlcltcIlJlZHVjZVwiXSA9IDEwMF0gPSBcIlJlZHVjZVwiO1xuICAgIFJlY292ZXJbUmVjb3ZlcltcIk1heE5leHRcIl0gPSA0XSA9IFwiTWF4TmV4dFwiO1xuICAgIFJlY292ZXJbUmVjb3ZlcltcIk1heEluc2VydFN0YWNrRGVwdGhcIl0gPSAzMDBdID0gXCJNYXhJbnNlcnRTdGFja0RlcHRoXCI7XG4gICAgUmVjb3ZlcltSZWNvdmVyW1wiRGFtcGVuSW5zZXJ0U3RhY2tEZXB0aFwiXSA9IDEyMF0gPSBcIkRhbXBlbkluc2VydFN0YWNrRGVwdGhcIjtcbn0pKFJlY292ZXIgfHwgKFJlY292ZXIgPSB7fSkpO1xuLy8gVXNlZCB0byBjaGVhcGx5IHJ1biBzb21lIHJlZHVjdGlvbnMgdG8gc2NhbiBhaGVhZCB3aXRob3V0IG11dGF0aW5nXG4vLyBhbiBlbnRpcmUgc3RhY2tcbmNsYXNzIFNpbXVsYXRlZFN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihzdGFjaykge1xuICAgICAgICB0aGlzLnN0YWNrID0gc3RhY2s7XG4gICAgICAgIHRoaXMudG9wID0gc3RhY2suc3RhdGU7XG4gICAgICAgIHRoaXMucmVzdCA9IHN0YWNrLnN0YWNrO1xuICAgICAgICB0aGlzLm9mZnNldCA9IHRoaXMucmVzdC5sZW5ndGg7XG4gICAgfVxuICAgIHJlZHVjZShhY3Rpb24pIHtcbiAgICAgICAgbGV0IHRlcm0gPSBhY3Rpb24gJiA2NTUzNSAvKiBWYWx1ZU1hc2sgKi8sIGRlcHRoID0gYWN0aW9uID4+IDE5IC8qIFJlZHVjZURlcHRoU2hpZnQgKi87XG4gICAgICAgIGlmIChkZXB0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZXN0ID09IHRoaXMuc3RhY2suc3RhY2spXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0ID0gdGhpcy5yZXN0LnNsaWNlKCk7XG4gICAgICAgICAgICB0aGlzLnJlc3QucHVzaCh0aGlzLnRvcCwgMCwgMCk7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCArPSAzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vZmZzZXQgLT0gKGRlcHRoIC0gMSkgKiAzO1xuICAgICAgICB9XG4gICAgICAgIGxldCBnb3RvID0gdGhpcy5zdGFjay5wLnBhcnNlci5nZXRHb3RvKHRoaXMucmVzdFt0aGlzLm9mZnNldCAtIDNdLCB0ZXJtLCB0cnVlKTtcbiAgICAgICAgdGhpcy50b3AgPSBnb3RvO1xuICAgIH1cbn1cbi8vIFRoaXMgaXMgZ2l2ZW4gdG8gYFRyZWUuYnVpbGRgIHRvIGJ1aWxkIGEgYnVmZmVyLCBhbmQgZW5jYXBzdWxhdGVzXG4vLyB0aGUgcGFyZW50LXN0YWNrLXdhbGtpbmcgbmVjZXNzYXJ5IHRvIHJlYWQgdGhlIG5vZGVzLlxuY2xhc3MgU3RhY2tCdWZmZXJDdXJzb3Ige1xuICAgIGNvbnN0cnVjdG9yKHN0YWNrLCBwb3MsIGluZGV4KSB7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBzdGFjaztcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgdGhpcy5idWZmZXIgPSBzdGFjay5idWZmZXI7XG4gICAgICAgIGlmICh0aGlzLmluZGV4ID09IDApXG4gICAgICAgICAgICB0aGlzLm1heWJlTmV4dCgpO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHN0YWNrKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RhY2tCdWZmZXJDdXJzb3Ioc3RhY2ssIHN0YWNrLmJ1ZmZlckJhc2UgKyBzdGFjay5idWZmZXIubGVuZ3RoLCBzdGFjay5idWZmZXIubGVuZ3RoKTtcbiAgICB9XG4gICAgbWF5YmVOZXh0KCkge1xuICAgICAgICBsZXQgbmV4dCA9IHRoaXMuc3RhY2sucGFyZW50O1xuICAgICAgICBpZiAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5zdGFjay5idWZmZXJCYXNlIC0gbmV4dC5idWZmZXJCYXNlO1xuICAgICAgICAgICAgdGhpcy5zdGFjayA9IG5leHQ7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IG5leHQuYnVmZmVyO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBpZCgpIHsgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMuaW5kZXggLSA0XTsgfVxuICAgIGdldCBzdGFydCgpIHsgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMuaW5kZXggLSAzXTsgfVxuICAgIGdldCBlbmQoKSB7IHJldHVybiB0aGlzLmJ1ZmZlclt0aGlzLmluZGV4IC0gMl07IH1cbiAgICBnZXQgc2l6ZSgpIHsgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMuaW5kZXggLSAxXTsgfVxuICAgIG5leHQoKSB7XG4gICAgICAgIHRoaXMuaW5kZXggLT0gNDtcbiAgICAgICAgdGhpcy5wb3MgLT0gNDtcbiAgICAgICAgaWYgKHRoaXMuaW5kZXggPT0gMClcbiAgICAgICAgICAgIHRoaXMubWF5YmVOZXh0KCk7XG4gICAgfVxuICAgIGZvcmsoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3RhY2tCdWZmZXJDdXJzb3IodGhpcy5zdGFjaywgdGhpcy5wb3MsIHRoaXMuaW5kZXgpO1xuICAgIH1cbn1cblxuLy8vIFRva2VuaXplcnMgd3JpdGUgdGhlIHRva2VucyB0aGV5IHJlYWQgaW50byBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcy5cbmNsYXNzIFRva2VuIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8vIFRoZSBzdGFydCBvZiB0aGUgdG9rZW4uIFRoaXMgaXMgc2V0IGJ5IHRoZSBwYXJzZXIsIGFuZCBzaG91bGQgbm90XG4gICAgICAgIC8vLyBiZSBtdXRhdGVkIGJ5IHRoZSB0b2tlbml6ZXIuXG4gICAgICAgIHRoaXMuc3RhcnQgPSAtMTtcbiAgICAgICAgLy8vIFRoaXMgc3RhcnRzIGF0IC0xLCBhbmQgc2hvdWxkIGJlIHVwZGF0ZWQgdG8gYSB0ZXJtIGlkIHdoZW4gYVxuICAgICAgICAvLy8gbWF0Y2hpbmcgdG9rZW4gaXMgZm91bmQuXG4gICAgICAgIHRoaXMudmFsdWUgPSAtMTtcbiAgICAgICAgLy8vIFdoZW4gc2V0dGluZyBgLnZhbHVlYCwgeW91IHNob3VsZCBhbHNvIHNldCBgLmVuZGAgdG8gdGhlIGVuZFxuICAgICAgICAvLy8gcG9zaXRpb24gb2YgdGhlIHRva2VuLiAoWW91J2xsIHVzdWFsbHkgd2FudCB0byB1c2UgdGhlIGBhY2NlcHRgXG4gICAgICAgIC8vLyBtZXRob2QuKVxuICAgICAgICB0aGlzLmVuZCA9IC0xO1xuICAgIH1cbiAgICAvLy8gQWNjZXB0IGEgdG9rZW4sIHNldHRpbmcgYHZhbHVlYCBhbmQgYGVuZGAgdG8gdGhlIGdpdmVuIHZhbHVlcy5cbiAgICBhY2NlcHQodmFsdWUsIGVuZCkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIH1cbn1cbi8vLyBAaW50ZXJuYWxcbmNsYXNzIFRva2VuR3JvdXAge1xuICAgIGNvbnN0cnVjdG9yKGRhdGEsIGlkKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9XG4gICAgdG9rZW4oaW5wdXQsIHRva2VuLCBzdGFjaykgeyByZWFkVG9rZW4odGhpcy5kYXRhLCBpbnB1dCwgdG9rZW4sIHN0YWNrLCB0aGlzLmlkKTsgfVxufVxuVG9rZW5Hcm91cC5wcm90b3R5cGUuY29udGV4dHVhbCA9IFRva2VuR3JvdXAucHJvdG90eXBlLmZhbGxiYWNrID0gVG9rZW5Hcm91cC5wcm90b3R5cGUuZXh0ZW5kID0gZmFsc2U7XG4vLy8gRXhwb3J0cyB0aGF0IGFyZSB1c2VkIGZvciBgQGV4dGVybmFsIHRva2Vuc2AgaW4gdGhlIGdyYW1tYXIgc2hvdWxkXG4vLy8gZXhwb3J0IGFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3MuXG5jbGFzcyBFeHRlcm5hbFRva2VuaXplciB7XG4gICAgLy8vIENyZWF0ZSBhIHRva2VuaXplci4gVGhlIGZpcnN0IGFyZ3VtZW50IGlzIHRoZSBmdW5jdGlvbiB0aGF0LFxuICAgIC8vLyBnaXZlbiBhbiBpbnB1dCBzdHJlYW0gYW5kIGEgdG9rZW4gb2JqZWN0LFxuICAgIC8vLyBbZmlsbHNdKCNsZXplci5Ub2tlbi5hY2NlcHQpIHRoZSB0b2tlbiBvYmplY3QgaWYgaXQgcmVjb2duaXplcyBhXG4gICAgLy8vIHRva2VuLiBgdG9rZW4uc3RhcnRgIHNob3VsZCBiZSB1c2VkIGFzIHRoZSBzdGFydCBwb3NpdGlvbiB0b1xuICAgIC8vLyBzY2FuIGZyb20uXG4gICAgY29uc3RydWN0b3IoXG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHRva2VuLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgICAgICB0aGlzLmNvbnRleHR1YWwgPSAhIW9wdGlvbnMuY29udGV4dHVhbDtcbiAgICAgICAgdGhpcy5mYWxsYmFjayA9ICEhb3B0aW9ucy5mYWxsYmFjaztcbiAgICAgICAgdGhpcy5leHRlbmQgPSAhIW9wdGlvbnMuZXh0ZW5kO1xuICAgIH1cbn1cbi8vIFRva2VuaXplciBkYXRhIGlzIHN0b3JlZCBhIGJpZyB1aW50MTYgYXJyYXkgY29udGFpbmluZywgZm9yIGVhY2hcbi8vIHN0YXRlOlxuLy9cbi8vICAtIEEgZ3JvdXAgYml0bWFzaywgaW5kaWNhdGluZyB3aGF0IHRva2VuIGdyb3VwcyBhcmUgcmVhY2hhYmxlIGZyb21cbi8vICAgIHRoaXMgc3RhdGUsIHNvIHRoYXQgcGF0aHMgdGhhdCBjYW4gb25seSBsZWFkIHRvIHRva2VucyBub3QgaW5cbi8vICAgIGFueSBvZiB0aGUgY3VycmVudCBncm91cHMgY2FuIGJlIGN1dCBvZmYgZWFybHkuXG4vL1xuLy8gIC0gVGhlIHBvc2l0aW9uIG9mIHRoZSBlbmQgb2YgdGhlIHN0YXRlJ3Mgc2VxdWVuY2Ugb2YgYWNjZXB0aW5nXG4vLyAgICB0b2tlbnNcbi8vXG4vLyAgLSBUaGUgbnVtYmVyIG9mIG91dGdvaW5nIGVkZ2VzIGZvciB0aGUgc3RhdGVcbi8vXG4vLyAgLSBUaGUgYWNjZXB0aW5nIHRva2VucywgYXMgKHRva2VuIGlkLCBncm91cCBtYXNrKSBwYWlyc1xuLy9cbi8vICAtIFRoZSBvdXRnb2luZyBlZGdlcywgYXMgKHN0YXJ0IGNoYXJhY3RlciwgZW5kIGNoYXJhY3Rlciwgc3RhdGVcbi8vICAgIGluZGV4KSB0cmlwbGVzLCB3aXRoIGVuZCBjaGFyYWN0ZXIgYmVpbmcgZXhjbHVzaXZlXG4vL1xuLy8gVGhpcyBmdW5jdGlvbiBpbnRlcnByZXRzIHRoYXQgZGF0YSwgcnVubmluZyB0aHJvdWdoIGEgc3RyZWFtIGFzXG4vLyBsb25nIGFzIG5ldyBzdGF0ZXMgd2l0aCB0aGUgYSBtYXRjaGluZyBncm91cCBtYXNrIGNhbiBiZSByZWFjaGVkLFxuLy8gYW5kIHVwZGF0aW5nIGB0b2tlbmAgd2hlbiBpdCBtYXRjaGVzIGEgdG9rZW4uXG5mdW5jdGlvbiByZWFkVG9rZW4oZGF0YSwgaW5wdXQsIHRva2VuLCBzdGFjaywgZ3JvdXApIHtcbiAgICBsZXQgc3RhdGUgPSAwLCBncm91cE1hc2sgPSAxIDw8IGdyb3VwLCBkaWFsZWN0ID0gc3RhY2sucC5wYXJzZXIuZGlhbGVjdDtcbiAgICBzY2FuOiBmb3IgKGxldCBwb3MgPSB0b2tlbi5zdGFydDs7KSB7XG4gICAgICAgIGlmICgoZ3JvdXBNYXNrICYgZGF0YVtzdGF0ZV0pID09IDApXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgbGV0IGFjY0VuZCA9IGRhdGFbc3RhdGUgKyAxXTtcbiAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGlzIHN0YXRlIGNhbiBsZWFkIHRvIGEgdG9rZW4gaW4gdGhlIGN1cnJlbnQgZ3JvdXBcbiAgICAgICAgLy8gQWNjZXB0IHRva2VucyBpbiB0aGlzIHN0YXRlLCBwb3NzaWJseSBvdmVyd3JpdGluZ1xuICAgICAgICAvLyBsb3dlci1wcmVjZWRlbmNlIC8gc2hvcnRlciB0b2tlbnNcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXRlICsgMzsgaSA8IGFjY0VuZDsgaSArPSAyKVxuICAgICAgICAgICAgaWYgKChkYXRhW2kgKyAxXSAmIGdyb3VwTWFzaykgPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRlcm0gPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgIGlmIChkaWFsZWN0LmFsbG93cyh0ZXJtKSAmJlxuICAgICAgICAgICAgICAgICAgICAodG9rZW4udmFsdWUgPT0gLTEgfHwgdG9rZW4udmFsdWUgPT0gdGVybSB8fCBzdGFjay5wLnBhcnNlci5vdmVycmlkZXModGVybSwgdG9rZW4udmFsdWUpKSkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi5hY2NlcHQodGVybSwgcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBsZXQgbmV4dCA9IGlucHV0LmdldChwb3MrKyk7XG4gICAgICAgIC8vIERvIGEgYmluYXJ5IHNlYXJjaCBvbiB0aGUgc3RhdGUncyBlZGdlc1xuICAgICAgICBmb3IgKGxldCBsb3cgPSAwLCBoaWdoID0gZGF0YVtzdGF0ZSArIDJdOyBsb3cgPCBoaWdoOykge1xuICAgICAgICAgICAgbGV0IG1pZCA9IChsb3cgKyBoaWdoKSA+PiAxO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gYWNjRW5kICsgbWlkICsgKG1pZCA8PCAxKTtcbiAgICAgICAgICAgIGxldCBmcm9tID0gZGF0YVtpbmRleF0sIHRvID0gZGF0YVtpbmRleCArIDFdO1xuICAgICAgICAgICAgaWYgKG5leHQgPCBmcm9tKVxuICAgICAgICAgICAgICAgIGhpZ2ggPSBtaWQ7XG4gICAgICAgICAgICBlbHNlIGlmIChuZXh0ID49IHRvKVxuICAgICAgICAgICAgICAgIGxvdyA9IG1pZCArIDE7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGF0ZSA9IGRhdGFbaW5kZXggKyAyXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZSBzY2FuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbn1cblxuLy8gU2VlIGxlemVyLWdlbmVyYXRvci9zcmMvZW5jb2RlLnRzIGZvciBjb21tZW50cyBhYm91dCB0aGUgZW5jb2Rpbmdcbi8vIHVzZWQgaGVyZVxuZnVuY3Rpb24gZGVjb2RlQXJyYXkoaW5wdXQsIFR5cGUgPSBVaW50MTZBcnJheSkge1xuICAgIGlmICh0eXBlb2YgaW5wdXQgIT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIGxldCBhcnJheSA9IG51bGw7XG4gICAgZm9yIChsZXQgcG9zID0gMCwgb3V0ID0gMDsgcG9zIDwgaW5wdXQubGVuZ3RoOykge1xuICAgICAgICBsZXQgdmFsdWUgPSAwO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBsZXQgbmV4dCA9IGlucHV0LmNoYXJDb2RlQXQocG9zKyspLCBzdG9wID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAobmV4dCA9PSAxMjYgLyogQmlnVmFsQ29kZSAqLykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gNjU1MzUgLyogQmlnVmFsICovO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5leHQgPj0gOTIgLyogR2FwMiAqLylcbiAgICAgICAgICAgICAgICBuZXh0LS07XG4gICAgICAgICAgICBpZiAobmV4dCA+PSAzNCAvKiBHYXAxICovKVxuICAgICAgICAgICAgICAgIG5leHQtLTtcbiAgICAgICAgICAgIGxldCBkaWdpdCA9IG5leHQgLSAzMiAvKiBTdGFydCAqLztcbiAgICAgICAgICAgIGlmIChkaWdpdCA+PSA0NiAvKiBCYXNlICovKSB7XG4gICAgICAgICAgICAgICAgZGlnaXQgLT0gNDYgLyogQmFzZSAqLztcbiAgICAgICAgICAgICAgICBzdG9wID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlICs9IGRpZ2l0O1xuICAgICAgICAgICAgaWYgKHN0b3ApXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB2YWx1ZSAqPSA0NiAvKiBCYXNlICovO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcnJheSlcbiAgICAgICAgICAgIGFycmF5W291dCsrXSA9IHZhbHVlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBhcnJheSA9IG5ldyBUeXBlKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG4vLyBGSVhNRSBmaW5kIHNvbWUgd2F5IHRvIHJlZHVjZSByZWNvdmVyeSB3b3JrIGRvbmUgd2hlbiB0aGUgaW5wdXRcbi8vIGRvZXNuJ3QgbWF0Y2ggdGhlIGdyYW1tYXIgYXQgYWxsLlxuLy8gRW52aXJvbm1lbnQgdmFyaWFibGUgdXNlZCB0byBjb250cm9sIGNvbnNvbGUgb3V0cHV0XG5jb25zdCB2ZXJib3NlID0gdHlwZW9mIHByb2Nlc3MgIT0gXCJ1bmRlZmluZWRcIiAmJiAvXFxicGFyc2VcXGIvLnRlc3QocHJvY2Vzcy5lbnYuTE9HKTtcbmxldCBzdGFja0lEcyA9IG51bGw7XG5mdW5jdGlvbiBjdXRBdCh0cmVlLCBwb3MsIHNpZGUpIHtcbiAgICBsZXQgY3Vyc29yID0gdHJlZS5jdXJzb3IocG9zKTtcbiAgICBmb3IgKDs7KSB7XG4gICAgICAgIGlmICghKHNpZGUgPCAwID8gY3Vyc29yLmNoaWxkQmVmb3JlKHBvcykgOiBjdXJzb3IuY2hpbGRBZnRlcihwb3MpKSlcbiAgICAgICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgICAgICBpZiAoKHNpZGUgPCAwID8gY3Vyc29yLnRvIDwgcG9zIDogY3Vyc29yLmZyb20gPiBwb3MpICYmICFjdXJzb3IudHlwZS5pc0Vycm9yKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2lkZSA8IDAgPyBNYXRoLm1heCgwLCBNYXRoLm1pbihjdXJzb3IudG8gLSAxLCBwb3MgLSA1KSkgOiBNYXRoLm1pbih0cmVlLmxlbmd0aCwgTWF0aC5tYXgoY3Vyc29yLmZyb20gKyAxLCBwb3MgKyA1KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNpZGUgPCAwID8gY3Vyc29yLnByZXZTaWJsaW5nKCkgOiBjdXJzb3IubmV4dFNpYmxpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJzb3IucGFyZW50KCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzaWRlIDwgMCA/IDAgOiB0cmVlLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBGcmFnbWVudEN1cnNvciB7XG4gICAgY29uc3RydWN0b3IoZnJhZ21lbnRzKSB7XG4gICAgICAgIHRoaXMuZnJhZ21lbnRzID0gZnJhZ21lbnRzO1xuICAgICAgICB0aGlzLmkgPSAwO1xuICAgICAgICB0aGlzLmZyYWdtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zYWZlRnJvbSA9IC0xO1xuICAgICAgICB0aGlzLnNhZmVUbyA9IC0xO1xuICAgICAgICB0aGlzLnRyZWVzID0gW107XG4gICAgICAgIHRoaXMuc3RhcnQgPSBbXTtcbiAgICAgICAgdGhpcy5pbmRleCA9IFtdO1xuICAgICAgICB0aGlzLm5leHRGcmFnbWVudCgpO1xuICAgIH1cbiAgICBuZXh0RnJhZ21lbnQoKSB7XG4gICAgICAgIGxldCBmciA9IHRoaXMuZnJhZ21lbnQgPSB0aGlzLmkgPT0gdGhpcy5mcmFnbWVudHMubGVuZ3RoID8gbnVsbCA6IHRoaXMuZnJhZ21lbnRzW3RoaXMuaSsrXTtcbiAgICAgICAgaWYgKGZyKSB7XG4gICAgICAgICAgICB0aGlzLnNhZmVGcm9tID0gZnIub3BlblN0YXJ0ID8gY3V0QXQoZnIudHJlZSwgZnIuZnJvbSArIGZyLm9mZnNldCwgMSkgLSBmci5vZmZzZXQgOiBmci5mcm9tO1xuICAgICAgICAgICAgdGhpcy5zYWZlVG8gPSBmci5vcGVuRW5kID8gY3V0QXQoZnIudHJlZSwgZnIudG8gKyBmci5vZmZzZXQsIC0xKSAtIGZyLm9mZnNldCA6IGZyLnRvO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMudHJlZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmVlcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0LnBvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXgucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRyZWVzLnB1c2goZnIudHJlZSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0LnB1c2goLWZyLm9mZnNldCk7XG4gICAgICAgICAgICB0aGlzLmluZGV4LnB1c2goMCk7XG4gICAgICAgICAgICB0aGlzLm5leHRTdGFydCA9IHRoaXMuc2FmZUZyb207XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5leHRTdGFydCA9IDFlOTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBgcG9zYCBtdXN0IGJlID49IGFueSBwcmV2aW91c2x5IGdpdmVuIGBwb3NgIGZvciB0aGlzIGN1cnNvclxuICAgIG5vZGVBdChwb3MpIHtcbiAgICAgICAgaWYgKHBvcyA8IHRoaXMubmV4dFN0YXJ0KVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHdoaWxlICh0aGlzLmZyYWdtZW50ICYmIHRoaXMuc2FmZVRvIDw9IHBvcylcbiAgICAgICAgICAgIHRoaXMubmV4dEZyYWdtZW50KCk7XG4gICAgICAgIGlmICghdGhpcy5mcmFnbWVudClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBsZXQgbGFzdCA9IHRoaXMudHJlZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGlmIChsYXN0IDwgMCkgeyAvLyBFbmQgb2YgdHJlZVxuICAgICAgICAgICAgICAgIHRoaXMubmV4dEZyYWdtZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdG9wID0gdGhpcy50cmVlc1tsYXN0XSwgaW5kZXggPSB0aGlzLmluZGV4W2xhc3RdO1xuICAgICAgICAgICAgaWYgKGluZGV4ID09IHRvcC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWVzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQucG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleC5wb3AoKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBuZXh0ID0gdG9wLmNoaWxkcmVuW2luZGV4XTtcbiAgICAgICAgICAgIGxldCBzdGFydCA9IHRoaXMuc3RhcnRbbGFzdF0gKyB0b3AucG9zaXRpb25zW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChzdGFydCA+IHBvcykge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dFN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzdGFydCA9PSBwb3MgJiYgc3RhcnQgKyBuZXh0Lmxlbmd0aCA8PSB0aGlzLnNhZmVUbykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFydCA9PSBwb3MgJiYgc3RhcnQgPj0gdGhpcy5zYWZlRnJvbSA/IG5leHQgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5leHQgaW5zdGFuY2VvZiBsZXplclRyZWUuVHJlZUJ1ZmZlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhbbGFzdF0rKztcbiAgICAgICAgICAgICAgICB0aGlzLm5leHRTdGFydCA9IHN0YXJ0ICsgbmV4dC5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4W2xhc3RdKys7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0ICsgbmV4dC5sZW5ndGggPj0gcG9zKSB7IC8vIEVudGVyIHRoaXMgbm9kZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWVzLnB1c2gobmV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnQucHVzaChzdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXgucHVzaCgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5jbGFzcyBDYWNoZWRUb2tlbiBleHRlbmRzIFRva2VuIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5leHRlbmRlZCA9IC0xO1xuICAgICAgICB0aGlzLm1hc2sgPSAwO1xuICAgICAgICB0aGlzLmNvbnRleHQgPSAwO1xuICAgIH1cbiAgICBjbGVhcihzdGFydCkge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmV4dGVuZGVkID0gLTE7XG4gICAgfVxufVxuY29uc3QgZHVtbXlUb2tlbiA9IG5ldyBUb2tlbjtcbmNsYXNzIFRva2VuQ2FjaGUge1xuICAgIGNvbnN0cnVjdG9yKHBhcnNlcikge1xuICAgICAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgICAgICB0aGlzLm1haW5Ub2tlbiA9IGR1bW15VG9rZW47XG4gICAgICAgIHRoaXMuYWN0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLnRva2VucyA9IHBhcnNlci50b2tlbml6ZXJzLm1hcChfID0+IG5ldyBDYWNoZWRUb2tlbik7XG4gICAgfVxuICAgIGdldEFjdGlvbnMoc3RhY2ssIGlucHV0KSB7XG4gICAgICAgIGxldCBhY3Rpb25JbmRleCA9IDA7XG4gICAgICAgIGxldCBtYWluID0gbnVsbDtcbiAgICAgICAgbGV0IHsgcGFyc2VyIH0gPSBzdGFjay5wLCB7IHRva2VuaXplcnMgfSA9IHBhcnNlcjtcbiAgICAgICAgbGV0IG1hc2sgPSBwYXJzZXIuc3RhdGVTbG90KHN0YWNrLnN0YXRlLCAzIC8qIFRva2VuaXplck1hc2sgKi8pO1xuICAgICAgICBsZXQgY29udGV4dCA9IHN0YWNrLmN1ckNvbnRleHQgPyBzdGFjay5jdXJDb250ZXh0Lmhhc2ggOiAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2VuaXplcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoKDEgPDwgaSkgJiBtYXNrKSA9PSAwKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IHRva2VuaXplciA9IHRva2VuaXplcnNbaV0sIHRva2VuID0gdGhpcy50b2tlbnNbaV07XG4gICAgICAgICAgICBpZiAobWFpbiAmJiAhdG9rZW5pemVyLmZhbGxiYWNrKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKHRva2VuaXplci5jb250ZXh0dWFsIHx8IHRva2VuLnN0YXJ0ICE9IHN0YWNrLnBvcyB8fCB0b2tlbi5tYXNrICE9IG1hc2sgfHwgdG9rZW4uY29udGV4dCAhPSBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDYWNoZWRUb2tlbih0b2tlbiwgdG9rZW5pemVyLCBzdGFjaywgaW5wdXQpO1xuICAgICAgICAgICAgICAgIHRva2VuLm1hc2sgPSBtYXNrO1xuICAgICAgICAgICAgICAgIHRva2VuLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlICE9IDAgLyogRXJyICovKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0SW5kZXggPSBhY3Rpb25JbmRleDtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uZXh0ZW5kZWQgPiAtMSlcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uSW5kZXggPSB0aGlzLmFkZEFjdGlvbnMoc3RhY2ssIHRva2VuLmV4dGVuZGVkLCB0b2tlbi5lbmQsIGFjdGlvbkluZGV4KTtcbiAgICAgICAgICAgICAgICBhY3Rpb25JbmRleCA9IHRoaXMuYWRkQWN0aW9ucyhzdGFjaywgdG9rZW4udmFsdWUsIHRva2VuLmVuZCwgYWN0aW9uSW5kZXgpO1xuICAgICAgICAgICAgICAgIGlmICghdG9rZW5pemVyLmV4dGVuZCkge1xuICAgICAgICAgICAgICAgICAgICBtYWluID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3Rpb25JbmRleCA+IHN0YXJ0SW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHRoaXMuYWN0aW9ucy5sZW5ndGggPiBhY3Rpb25JbmRleClcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5wb3AoKTtcbiAgICAgICAgaWYgKCFtYWluKSB7XG4gICAgICAgICAgICBtYWluID0gZHVtbXlUb2tlbjtcbiAgICAgICAgICAgIG1haW4uc3RhcnQgPSBzdGFjay5wb3M7XG4gICAgICAgICAgICBpZiAoc3RhY2sucG9zID09IGlucHV0Lmxlbmd0aClcbiAgICAgICAgICAgICAgICBtYWluLmFjY2VwdChzdGFjay5wLnBhcnNlci5lb2ZUZXJtLCBzdGFjay5wb3MpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG1haW4uYWNjZXB0KDAgLyogRXJyICovLCBzdGFjay5wb3MgKyAxKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1haW5Ub2tlbiA9IG1haW47XG4gICAgICAgIHJldHVybiB0aGlzLmFjdGlvbnM7XG4gICAgfVxuICAgIHVwZGF0ZUNhY2hlZFRva2VuKHRva2VuLCB0b2tlbml6ZXIsIHN0YWNrLCBpbnB1dCkge1xuICAgICAgICB0b2tlbi5jbGVhcihzdGFjay5wb3MpO1xuICAgICAgICB0b2tlbml6ZXIudG9rZW4oaW5wdXQsIHRva2VuLCBzdGFjayk7XG4gICAgICAgIGlmICh0b2tlbi52YWx1ZSA+IC0xKSB7XG4gICAgICAgICAgICBsZXQgeyBwYXJzZXIgfSA9IHN0YWNrLnA7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnNlci5zcGVjaWFsaXplZC5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VyLnNwZWNpYWxpemVkW2ldID09IHRva2VuLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBwYXJzZXIuc3BlY2lhbGl6ZXJzW2ldKGlucHV0LnJlYWQodG9rZW4uc3RhcnQsIHRva2VuLmVuZCksIHN0YWNrKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA+PSAwICYmIHN0YWNrLnAucGFyc2VyLmRpYWxlY3QuYWxsb3dzKHJlc3VsdCA+PiAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChyZXN1bHQgJiAxKSA9PSAwIC8qIFNwZWNpYWxpemUgKi8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSByZXN1bHQgPj4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2tlbi5leHRlbmRlZCA9IHJlc3VsdCA+PiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RhY2sucG9zID09IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgdG9rZW4uYWNjZXB0KHN0YWNrLnAucGFyc2VyLmVvZlRlcm0sIHN0YWNrLnBvcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0b2tlbi5hY2NlcHQoMCAvKiBFcnIgKi8sIHN0YWNrLnBvcyArIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1dEFjdGlvbihhY3Rpb24sIHRva2VuLCBlbmQsIGluZGV4KSB7XG4gICAgICAgIC8vIERvbid0IGFkZCBkdXBsaWNhdGUgYWN0aW9uc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGV4OyBpICs9IDMpXG4gICAgICAgICAgICBpZiAodGhpcy5hY3Rpb25zW2ldID09IGFjdGlvbilcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIHRoaXMuYWN0aW9uc1tpbmRleCsrXSA9IGFjdGlvbjtcbiAgICAgICAgdGhpcy5hY3Rpb25zW2luZGV4KytdID0gdG9rZW47XG4gICAgICAgIHRoaXMuYWN0aW9uc1tpbmRleCsrXSA9IGVuZDtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgICBhZGRBY3Rpb25zKHN0YWNrLCB0b2tlbiwgZW5kLCBpbmRleCkge1xuICAgICAgICBsZXQgeyBzdGF0ZSB9ID0gc3RhY2ssIHsgcGFyc2VyIH0gPSBzdGFjay5wLCB7IGRhdGEgfSA9IHBhcnNlcjtcbiAgICAgICAgZm9yIChsZXQgc2V0ID0gMDsgc2V0IDwgMjsgc2V0KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBwYXJzZXIuc3RhdGVTbG90KHN0YXRlLCBzZXQgPyAyIC8qIFNraXAgKi8gOiAxIC8qIEFjdGlvbnMgKi8pOzsgaSArPSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbaV0gPT0gNjU1MzUgLyogRW5kICovKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW2kgKyAxXSA9PSAxIC8qIE5leHQgKi8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBwYWlyKGRhdGEsIGkgKyAyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAwICYmIGRhdGFbaSArIDFdID09IDIgLyogT3RoZXIgKi8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLnB1dEFjdGlvbihwYWlyKGRhdGEsIGkgKyAxKSwgdG9rZW4sIGVuZCwgaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbaV0gPT0gdG9rZW4pXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gdGhpcy5wdXRBY3Rpb24ocGFpcihkYXRhLCBpICsgMSksIHRva2VuLCBlbmQsIGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxufVxudmFyIFJlYztcbihmdW5jdGlvbiAoUmVjKSB7XG4gICAgUmVjW1JlY1tcIkRpc3RhbmNlXCJdID0gNV0gPSBcIkRpc3RhbmNlXCI7XG4gICAgUmVjW1JlY1tcIk1heFJlbWFpbmluZ1BlclN0ZXBcIl0gPSAzXSA9IFwiTWF4UmVtYWluaW5nUGVyU3RlcFwiO1xuICAgIFJlY1tSZWNbXCJNaW5CdWZmZXJMZW5ndGhQcnVuZVwiXSA9IDIwMF0gPSBcIk1pbkJ1ZmZlckxlbmd0aFBydW5lXCI7XG4gICAgUmVjW1JlY1tcIkZvcmNlUmVkdWNlTGltaXRcIl0gPSAxMF0gPSBcIkZvcmNlUmVkdWNlTGltaXRcIjtcbn0pKFJlYyB8fCAoUmVjID0ge30pKTtcbi8vLyBBIHBhcnNlIGNvbnRleHQgY2FuIGJlIHVzZWQgZm9yIHN0ZXAtYnktc3RlcCBwYXJzaW5nLiBBZnRlclxuLy8vIGNyZWF0aW5nIGl0LCB5b3UgcmVwZWF0ZWRseSBjYWxsIGAuYWR2YW5jZSgpYCB1bnRpbCBpdCByZXR1cm5zIGFcbi8vLyB0cmVlIHRvIGluZGljYXRlIGl0IGhhcyByZWFjaGVkIHRoZSBlbmQgb2YgdGhlIHBhcnNlLlxuY2xhc3MgUGFyc2Uge1xuICAgIGNvbnN0cnVjdG9yKHBhcnNlciwgaW5wdXQsIHN0YXJ0UG9zLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMucGFyc2VyID0gcGFyc2VyO1xuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuc3RhcnRQb3MgPSBzdGFydFBvcztcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgLy8gVGhlIHBvc2l0aW9uIHRvIHdoaWNoIHRoZSBwYXJzZSBoYXMgYWR2YW5jZWQuXG4gICAgICAgIHRoaXMucG9zID0gMDtcbiAgICAgICAgdGhpcy5yZWNvdmVyaW5nID0gMDtcbiAgICAgICAgdGhpcy5uZXh0U3RhY2tJRCA9IDB4MjY1NDtcbiAgICAgICAgdGhpcy5uZXN0ZWQgPSBudWxsO1xuICAgICAgICB0aGlzLm5lc3RFbmQgPSAwO1xuICAgICAgICB0aGlzLm5lc3RXcmFwID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZXVzZWQgPSBbXTtcbiAgICAgICAgdGhpcy50b2tlbnMgPSBuZXcgVG9rZW5DYWNoZShwYXJzZXIpO1xuICAgICAgICB0aGlzLnRvcFRlcm0gPSBwYXJzZXIudG9wWzFdO1xuICAgICAgICB0aGlzLnN0YWNrcyA9IFtTdGFjay5zdGFydCh0aGlzLCBwYXJzZXIudG9wWzBdLCB0aGlzLnN0YXJ0UG9zKV07XG4gICAgICAgIGxldCBmcmFnbWVudHMgPSBjb250ZXh0ID09PSBudWxsIHx8IGNvbnRleHQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbnRleHQuZnJhZ21lbnRzO1xuICAgICAgICB0aGlzLmZyYWdtZW50cyA9IGZyYWdtZW50cyAmJiBmcmFnbWVudHMubGVuZ3RoID8gbmV3IEZyYWdtZW50Q3Vyc29yKGZyYWdtZW50cykgOiBudWxsO1xuICAgIH1cbiAgICAvLyBNb3ZlIHRoZSBwYXJzZXIgZm9yd2FyZC4gVGhpcyB3aWxsIHByb2Nlc3MgYWxsIHBhcnNlIHN0YWNrcyBhdFxuICAgIC8vIGB0aGlzLnBvc2AgYW5kIHRyeSB0byBhZHZhbmNlIHRoZW0gdG8gYSBmdXJ0aGVyIHBvc2l0aW9uLiBJZiBub1xuICAgIC8vIHN0YWNrIGZvciBzdWNoIGEgcG9zaXRpb24gaXMgZm91bmQsIGl0J2xsIHN0YXJ0IGVycm9yLXJlY292ZXJ5LlxuICAgIC8vXG4gICAgLy8gV2hlbiB0aGUgcGFyc2UgaXMgZmluaXNoZWQsIHRoaXMgd2lsbCByZXR1cm4gYSBzeW50YXggdHJlZS4gV2hlblxuICAgIC8vIG5vdCwgaXQgcmV0dXJucyBgbnVsbGAuXG4gICAgYWR2YW5jZSgpIHtcbiAgICAgICAgaWYgKHRoaXMubmVzdGVkKSB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5uZXN0ZWQuYWR2YW5jZSgpO1xuICAgICAgICAgICAgdGhpcy5wb3MgPSB0aGlzLm5lc3RlZC5wb3M7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5maW5pc2hOZXN0ZWQodGhpcy5zdGFja3NbMF0sIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXN0ZWQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YWNrcyA9IHRoaXMuc3RhY2tzLCBwb3MgPSB0aGlzLnBvcztcbiAgICAgICAgLy8gVGhpcyB3aWxsIGhvbGQgc3RhY2tzIGJleW9uZCBgcG9zYC5cbiAgICAgICAgbGV0IG5ld1N0YWNrcyA9IHRoaXMuc3RhY2tzID0gW107XG4gICAgICAgIGxldCBzdG9wcGVkLCBzdG9wcGVkVG9rZW5zO1xuICAgICAgICBsZXQgbWF5YmVOZXN0O1xuICAgICAgICAvLyBLZWVwIGFkdmFuY2luZyBhbnkgc3RhY2tzIGF0IGBwb3NgIHVudGlsIHRoZXkgZWl0aGVyIG1vdmVcbiAgICAgICAgLy8gZm9yd2FyZCBvciBjYW4ndCBiZSBhZHZhbmNlZC4gR2F0aGVyIHN0YWNrcyB0aGF0IGNhbid0IGJlXG4gICAgICAgIC8vIGFkdmFuY2VkIGZ1cnRoZXIgaW4gYHN0b3BwZWRgLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHN0YWNrID0gc3RhY2tzW2ldLCBuZXN0O1xuICAgICAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgICAgICAgIGlmIChzdGFjay5wb3MgPiBwb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhY2tzLnB1c2goc3RhY2spO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChuZXN0ID0gdGhpcy5jaGVja05lc3Qoc3RhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbWF5YmVOZXN0IHx8IG1heWJlTmVzdC5zdGFjay5zY29yZSA8IHN0YWNrLnNjb3JlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWF5YmVOZXN0ID0gbmVzdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5hZHZhbmNlU3RhY2soc3RhY2ssIG5ld1N0YWNrcywgc3RhY2tzKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc3RvcHBlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcHBlZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcHBlZFRva2VucyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0b3BwZWQucHVzaChzdGFjayk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b2sgPSB0aGlzLnRva2Vucy5tYWluVG9rZW47XG4gICAgICAgICAgICAgICAgICAgIHN0b3BwZWRUb2tlbnMucHVzaCh0b2sudmFsdWUsIHRvay5lbmQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobWF5YmVOZXN0KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0TmVzdGVkKG1heWJlTmVzdCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW5ld1N0YWNrcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBmaW5pc2hlZCA9IHN0b3BwZWQgJiYgZmluZEZpbmlzaGVkKHN0b3BwZWQpO1xuICAgICAgICAgICAgaWYgKGZpbmlzaGVkKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YWNrVG9UcmVlKGZpbmlzaGVkKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlci5zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAodmVyYm9zZSAmJiBzdG9wcGVkKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN0dWNrIHdpdGggdG9rZW4gXCIgKyB0aGlzLnBhcnNlci5nZXROYW1lKHRoaXMudG9rZW5zLm1haW5Ub2tlbi52YWx1ZSkpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIk5vIHBhcnNlIGF0IFwiICsgcG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5yZWNvdmVyaW5nKVxuICAgICAgICAgICAgICAgIHRoaXMucmVjb3ZlcmluZyA9IDUgLyogRGlzdGFuY2UgKi87XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVjb3ZlcmluZyAmJiBzdG9wcGVkKSB7XG4gICAgICAgICAgICBsZXQgZmluaXNoZWQgPSB0aGlzLnJ1blJlY292ZXJ5KHN0b3BwZWQsIHN0b3BwZWRUb2tlbnMsIG5ld1N0YWNrcyk7XG4gICAgICAgICAgICBpZiAoZmluaXNoZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tUb1RyZWUoZmluaXNoZWQuZm9yY2VBbGwoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVjb3ZlcmluZykge1xuICAgICAgICAgICAgbGV0IG1heFJlbWFpbmluZyA9IHRoaXMucmVjb3ZlcmluZyA9PSAxID8gMSA6IHRoaXMucmVjb3ZlcmluZyAqIDMgLyogTWF4UmVtYWluaW5nUGVyU3RlcCAqLztcbiAgICAgICAgICAgIGlmIChuZXdTdGFja3MubGVuZ3RoID4gbWF4UmVtYWluaW5nKSB7XG4gICAgICAgICAgICAgICAgbmV3U3RhY2tzLnNvcnQoKGEsIGIpID0+IGIuc2NvcmUgLSBhLnNjb3JlKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAobmV3U3RhY2tzLmxlbmd0aCA+IG1heFJlbWFpbmluZylcbiAgICAgICAgICAgICAgICAgICAgbmV3U3RhY2tzLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5ld1N0YWNrcy5zb21lKHMgPT4gcy5yZWR1Y2VQb3MgPiBwb3MpKVxuICAgICAgICAgICAgICAgIHRoaXMucmVjb3ZlcmluZy0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG5ld1N0YWNrcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAvLyBQcnVuZSBzdGFja3MgdGhhdCBhcmUgaW4gdGhlIHNhbWUgc3RhdGUsIG9yIHRoYXQgaGF2ZSBiZWVuXG4gICAgICAgICAgICAvLyBydW5uaW5nIHdpdGhvdXQgc3BsaXR0aW5nIGZvciBhIHdoaWxlLCB0byBhdm9pZCBnZXR0aW5nIHN0dWNrXG4gICAgICAgICAgICAvLyB3aXRoIG11bHRpcGxlIHN1Y2Nlc3NmdWwgc3RhY2tzIHJ1bm5pbmcgZW5kbGVzc2x5IG9uLlxuICAgICAgICAgICAgb3V0ZXI6IGZvciAobGV0IGkgPSAwOyBpIDwgbmV3U3RhY2tzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzdGFjayA9IG5ld1N0YWNrc1tpXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gaSArIDE7IGogPCBuZXdTdGFja3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG90aGVyID0gbmV3U3RhY2tzW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhY2suc2FtZVN0YXRlKG90aGVyKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2suYnVmZmVyLmxlbmd0aCA+IDIwMCAvKiBNaW5CdWZmZXJMZW5ndGhQcnVuZSAqLyAmJiBvdGhlci5idWZmZXIubGVuZ3RoID4gMjAwIC8qIE1pbkJ1ZmZlckxlbmd0aFBydW5lICovKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKChzdGFjay5zY29yZSAtIG90aGVyLnNjb3JlKSB8fCAoc3RhY2suYnVmZmVyLmxlbmd0aCAtIG90aGVyLmJ1ZmZlci5sZW5ndGgpKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFja3Muc3BsaWNlKGotLSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFja3Muc3BsaWNlKGktLSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3MgPSBuZXdTdGFja3NbMF0ucG9zO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IG5ld1N0YWNrcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIGlmIChuZXdTdGFja3NbaV0ucG9zIDwgdGhpcy5wb3MpXG4gICAgICAgICAgICAgICAgdGhpcy5wb3MgPSBuZXdTdGFja3NbaV0ucG9zO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgLy8gUmV0dXJucyBhbiB1cGRhdGVkIHZlcnNpb24gb2YgdGhlIGdpdmVuIHN0YWNrLCBvciBudWxsIGlmIHRoZVxuICAgIC8vIHN0YWNrIGNhbid0IGFkdmFuY2Ugbm9ybWFsbHkuIFdoZW4gYHNwbGl0YCBhbmQgYHN0YWNrc2AgYXJlXG4gICAgLy8gZ2l2ZW4sIHN0YWNrcyBzcGxpdCBvZmYgYnkgYW1iaWd1b3VzIG9wZXJhdGlvbnMgd2lsbCBiZSBwdXNoZWQgdG9cbiAgICAvLyBgc3BsaXRgLCBvciBhZGRlZCB0byBgc3RhY2tzYCBpZiB0aGV5IG1vdmUgYHBvc2AgZm9yd2FyZC5cbiAgICBhZHZhbmNlU3RhY2soc3RhY2ssIHN0YWNrcywgc3BsaXQpIHtcbiAgICAgICAgbGV0IHN0YXJ0ID0gc3RhY2sucG9zLCB7IGlucHV0LCBwYXJzZXIgfSA9IHRoaXM7XG4gICAgICAgIGxldCBiYXNlID0gdmVyYm9zZSA/IHRoaXMuc3RhY2tJRChzdGFjaykgKyBcIiAtPiBcIiA6IFwiXCI7XG4gICAgICAgIGlmICh0aGlzLmZyYWdtZW50cykge1xuICAgICAgICAgICAgbGV0IHN0cmljdEN4ID0gc3RhY2suY3VyQ29udGV4dCAmJiBzdGFjay5jdXJDb250ZXh0LnRyYWNrZXIuc3RyaWN0LCBjeEhhc2ggPSBzdHJpY3RDeCA/IHN0YWNrLmN1ckNvbnRleHQuaGFzaCA6IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBjYWNoZWQgPSB0aGlzLmZyYWdtZW50cy5ub2RlQXQoc3RhcnQpOyBjYWNoZWQ7KSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hdGNoID0gdGhpcy5wYXJzZXIubm9kZVNldC50eXBlc1tjYWNoZWQudHlwZS5pZF0gPT0gY2FjaGVkLnR5cGUgPyBwYXJzZXIuZ2V0R290byhzdGFjay5zdGF0ZSwgY2FjaGVkLnR5cGUuaWQpIDogLTE7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoID4gLTEgJiYgY2FjaGVkLmxlbmd0aCAmJiAoIXN0cmljdEN4IHx8IChjYWNoZWQuY29udGV4dEhhc2ggfHwgMCkgPT0gY3hIYXNoKSkge1xuICAgICAgICAgICAgICAgICAgICBzdGFjay51c2VOb2RlKGNhY2hlZCwgbWF0Y2gpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGJhc2UgKyB0aGlzLnN0YWNrSUQoc3RhY2spICsgYCAodmlhIHJldXNlIG9mICR7cGFyc2VyLmdldE5hbWUoY2FjaGVkLnR5cGUuaWQpfSlgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghKGNhY2hlZCBpbnN0YW5jZW9mIGxlemVyVHJlZS5UcmVlKSB8fCBjYWNoZWQuY2hpbGRyZW4ubGVuZ3RoID09IDAgfHwgY2FjaGVkLnBvc2l0aW9uc1swXSA+IDApXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGxldCBpbm5lciA9IGNhY2hlZC5jaGlsZHJlblswXTtcbiAgICAgICAgICAgICAgICBpZiAoaW5uZXIgaW5zdGFuY2VvZiBsZXplclRyZWUuVHJlZSlcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVkID0gaW5uZXI7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgZGVmYXVsdFJlZHVjZSA9IHBhcnNlci5zdGF0ZVNsb3Qoc3RhY2suc3RhdGUsIDQgLyogRGVmYXVsdFJlZHVjZSAqLyk7XG4gICAgICAgIGlmIChkZWZhdWx0UmVkdWNlID4gMCkge1xuICAgICAgICAgICAgc3RhY2sucmVkdWNlKGRlZmF1bHRSZWR1Y2UpO1xuICAgICAgICAgICAgaWYgKHZlcmJvc2UpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYmFzZSArIHRoaXMuc3RhY2tJRChzdGFjaykgKyBgICh2aWEgYWx3YXlzLXJlZHVjZSAke3BhcnNlci5nZXROYW1lKGRlZmF1bHRSZWR1Y2UgJiA2NTUzNSAvKiBWYWx1ZU1hc2sgKi8pfSlgKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhY3Rpb25zID0gdGhpcy50b2tlbnMuZ2V0QWN0aW9ucyhzdGFjaywgaW5wdXQpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGlvbnMubGVuZ3RoOykge1xuICAgICAgICAgICAgbGV0IGFjdGlvbiA9IGFjdGlvbnNbaSsrXSwgdGVybSA9IGFjdGlvbnNbaSsrXSwgZW5kID0gYWN0aW9uc1tpKytdO1xuICAgICAgICAgICAgbGV0IGxhc3QgPSBpID09IGFjdGlvbnMubGVuZ3RoIHx8ICFzcGxpdDtcbiAgICAgICAgICAgIGxldCBsb2NhbFN0YWNrID0gbGFzdCA/IHN0YWNrIDogc3RhY2suc3BsaXQoKTtcbiAgICAgICAgICAgIGxvY2FsU3RhY2suYXBwbHkoYWN0aW9uLCB0ZXJtLCBlbmQpO1xuICAgICAgICAgICAgaWYgKHZlcmJvc2UpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYmFzZSArIHRoaXMuc3RhY2tJRChsb2NhbFN0YWNrKSArIGAgKHZpYSAkeyhhY3Rpb24gJiA2NTUzNiAvKiBSZWR1Y2VGbGFnICovKSA9PSAwID8gXCJzaGlmdFwiXG4gICAgICAgICAgICAgICAgICAgIDogYHJlZHVjZSBvZiAke3BhcnNlci5nZXROYW1lKGFjdGlvbiAmIDY1NTM1IC8qIFZhbHVlTWFzayAqLyl9YH0gZm9yICR7cGFyc2VyLmdldE5hbWUodGVybSl9IEAgJHtzdGFydH0ke2xvY2FsU3RhY2sgPT0gc3RhY2sgPyBcIlwiIDogXCIsIHNwbGl0XCJ9KWApO1xuICAgICAgICAgICAgaWYgKGxhc3QpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmIChsb2NhbFN0YWNrLnBvcyA+IHN0YXJ0KVxuICAgICAgICAgICAgICAgIHN0YWNrcy5wdXNoKGxvY2FsU3RhY2spO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNwbGl0LnB1c2gobG9jYWxTdGFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBBZHZhbmNlIGEgZ2l2ZW4gc3RhY2sgZm9yd2FyZCBhcyBmYXIgYXMgaXQgd2lsbCBnby4gUmV0dXJucyB0aGVcbiAgICAvLyAocG9zc2libHkgdXBkYXRlZCkgc3RhY2sgaWYgaXQgZ290IHN0dWNrLCBvciBudWxsIGlmIGl0IG1vdmVkXG4gICAgLy8gZm9yd2FyZCBhbmQgd2FzIGdpdmVuIHRvIGBwdXNoU3RhY2tEZWR1cGAuXG4gICAgYWR2YW5jZUZ1bGx5KHN0YWNrLCBuZXdTdGFja3MpIHtcbiAgICAgICAgbGV0IHBvcyA9IHN0YWNrLnBvcztcbiAgICAgICAgZm9yICg7Oykge1xuICAgICAgICAgICAgbGV0IG5lc3QgPSB0aGlzLmNoZWNrTmVzdChzdGFjayk7XG4gICAgICAgICAgICBpZiAobmVzdClcbiAgICAgICAgICAgICAgICByZXR1cm4gbmVzdDtcbiAgICAgICAgICAgIGlmICghdGhpcy5hZHZhbmNlU3RhY2soc3RhY2ssIG51bGwsIG51bGwpKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChzdGFjay5wb3MgPiBwb3MpIHtcbiAgICAgICAgICAgICAgICBwdXNoU3RhY2tEZWR1cChzdGFjaywgbmV3U3RhY2tzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBydW5SZWNvdmVyeShzdGFja3MsIHRva2VucywgbmV3U3RhY2tzKSB7XG4gICAgICAgIGxldCBmaW5pc2hlZCA9IG51bGwsIHJlc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgbWF5YmVOZXN0O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHN0YWNrID0gc3RhY2tzW2ldLCB0b2tlbiA9IHRva2Vuc1tpIDw8IDFdLCB0b2tlbkVuZCA9IHRva2Vuc1soaSA8PCAxKSArIDFdO1xuICAgICAgICAgICAgbGV0IGJhc2UgPSB2ZXJib3NlID8gdGhpcy5zdGFja0lEKHN0YWNrKSArIFwiIC0+IFwiIDogXCJcIjtcbiAgICAgICAgICAgIGlmIChzdGFjay5kZWFkRW5kKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3RhcnRlZClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgcmVzdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGFjay5yZXN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHZlcmJvc2UpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGJhc2UgKyB0aGlzLnN0YWNrSUQoc3RhY2spICsgXCIgKHJlc3RhcnRlZClcIik7XG4gICAgICAgICAgICAgICAgbGV0IGRvbmUgPSB0aGlzLmFkdmFuY2VGdWxseShzdGFjaywgbmV3U3RhY2tzKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9uZSAhPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heWJlTmVzdCA9IGRvbmU7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBmb3JjZSA9IHN0YWNrLnNwbGl0KCksIGZvcmNlQmFzZSA9IGJhc2U7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgZm9yY2UuZm9yY2VSZWR1Y2UoKSAmJiBqIDwgMTAgLyogRm9yY2VSZWR1Y2VMaW1pdCAqLzsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZlcmJvc2UpXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZvcmNlQmFzZSArIHRoaXMuc3RhY2tJRChmb3JjZSkgKyBcIiAodmlhIGZvcmNlLXJlZHVjZSlcIik7XG4gICAgICAgICAgICAgICAgbGV0IGRvbmUgPSB0aGlzLmFkdmFuY2VGdWxseShmb3JjZSwgbmV3U3RhY2tzKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9uZSAhPT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heWJlTmVzdCA9IGRvbmU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgICAgICAgICAgZm9yY2VCYXNlID0gdGhpcy5zdGFja0lEKGZvcmNlKSArIFwiIC0+IFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaW5zZXJ0IG9mIHN0YWNrLnJlY292ZXJCeUluc2VydCh0b2tlbikpIHtcbiAgICAgICAgICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYmFzZSArIHRoaXMuc3RhY2tJRChpbnNlcnQpICsgXCIgKHZpYSByZWNvdmVyLWluc2VydClcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5hZHZhbmNlRnVsbHkoaW5zZXJ0LCBuZXdTdGFja3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW5wdXQubGVuZ3RoID4gc3RhY2sucG9zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuRW5kID09IHN0YWNrLnBvcykge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbkVuZCsrO1xuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IDAgLyogRXJyICovO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGFjay5yZWNvdmVyQnlEZWxldGUodG9rZW4sIHRva2VuRW5kKTtcbiAgICAgICAgICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYmFzZSArIHRoaXMuc3RhY2tJRChzdGFjaykgKyBgICh2aWEgcmVjb3Zlci1kZWxldGUgJHt0aGlzLnBhcnNlci5nZXROYW1lKHRva2VuKX0pYCk7XG4gICAgICAgICAgICAgICAgcHVzaFN0YWNrRGVkdXAoc3RhY2ssIG5ld1N0YWNrcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghZmluaXNoZWQgfHwgZmluaXNoZWQuc2NvcmUgPCBzdGFjay5zY29yZSkge1xuICAgICAgICAgICAgICAgIGZpbmlzaGVkID0gc3RhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpbmlzaGVkKVxuICAgICAgICAgICAgcmV0dXJuIGZpbmlzaGVkO1xuICAgICAgICBpZiAobWF5YmVOZXN0KVxuICAgICAgICAgICAgZm9yIChsZXQgcyBvZiB0aGlzLnN0YWNrcylcbiAgICAgICAgICAgICAgICBpZiAocy5zY29yZSA+IG1heWJlTmVzdC5zdGFjay5zY29yZSkge1xuICAgICAgICAgICAgICAgICAgICBtYXliZU5lc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgaWYgKG1heWJlTmVzdClcbiAgICAgICAgICAgIHRoaXMuc3RhcnROZXN0ZWQobWF5YmVOZXN0KTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZvcmNlRmluaXNoKCkge1xuICAgICAgICBsZXQgc3RhY2sgPSB0aGlzLnN0YWNrc1swXS5zcGxpdCgpO1xuICAgICAgICBpZiAodGhpcy5uZXN0ZWQpXG4gICAgICAgICAgICB0aGlzLmZpbmlzaE5lc3RlZChzdGFjaywgdGhpcy5uZXN0ZWQuZm9yY2VGaW5pc2goKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YWNrVG9UcmVlKHN0YWNrLmZvcmNlQWxsKCkpO1xuICAgIH1cbiAgICAvLyBDb252ZXJ0IHRoZSBzdGFjaydzIGJ1ZmZlciB0byBhIHN5bnRheCB0cmVlLlxuICAgIHN0YWNrVG9UcmVlKHN0YWNrLCBwb3MgPSBzdGFjay5wb3MpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyc2VyLmNvbnRleHQpXG4gICAgICAgICAgICBzdGFjay5lbWl0Q29udGV4dCgpO1xuICAgICAgICByZXR1cm4gbGV6ZXJUcmVlLlRyZWUuYnVpbGQoeyBidWZmZXI6IFN0YWNrQnVmZmVyQ3Vyc29yLmNyZWF0ZShzdGFjayksXG4gICAgICAgICAgICBub2RlU2V0OiB0aGlzLnBhcnNlci5ub2RlU2V0LFxuICAgICAgICAgICAgdG9wSUQ6IHRoaXMudG9wVGVybSxcbiAgICAgICAgICAgIG1heEJ1ZmZlckxlbmd0aDogdGhpcy5wYXJzZXIuYnVmZmVyTGVuZ3RoLFxuICAgICAgICAgICAgcmV1c2VkOiB0aGlzLnJldXNlZCxcbiAgICAgICAgICAgIHN0YXJ0OiB0aGlzLnN0YXJ0UG9zLFxuICAgICAgICAgICAgbGVuZ3RoOiBwb3MgLSB0aGlzLnN0YXJ0UG9zLFxuICAgICAgICAgICAgbWluUmVwZWF0VHlwZTogdGhpcy5wYXJzZXIubWluUmVwZWF0VGVybSB9KTtcbiAgICB9XG4gICAgY2hlY2tOZXN0KHN0YWNrKSB7XG4gICAgICAgIGxldCBpbmZvID0gdGhpcy5wYXJzZXIuZmluZE5lc3RlZChzdGFjay5zdGF0ZSk7XG4gICAgICAgIGlmICghaW5mbylcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBsZXQgc3BlYyA9IGluZm8udmFsdWU7XG4gICAgICAgIGlmICh0eXBlb2Ygc3BlYyA9PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICBzcGVjID0gc3BlYyh0aGlzLmlucHV0LCBzdGFjayk7XG4gICAgICAgIHJldHVybiBzcGVjID8geyBzdGFjaywgaW5mbywgc3BlYyB9IDogbnVsbDtcbiAgICB9XG4gICAgc3RhcnROZXN0ZWQobmVzdCkge1xuICAgICAgICBsZXQgeyBzdGFjaywgaW5mbywgc3BlYyB9ID0gbmVzdDtcbiAgICAgICAgdGhpcy5zdGFja3MgPSBbc3RhY2tdO1xuICAgICAgICB0aGlzLm5lc3RFbmQgPSB0aGlzLnNjYW5Gb3JOZXN0RW5kKHN0YWNrLCBpbmZvLmVuZCwgc3BlYy5maWx0ZXJFbmQpO1xuICAgICAgICB0aGlzLm5lc3RXcmFwID0gdHlwZW9mIHNwZWMud3JhcFR5cGUgPT0gXCJudW1iZXJcIiA/IHRoaXMucGFyc2VyLm5vZGVTZXQudHlwZXNbc3BlYy53cmFwVHlwZV0gOiBzcGVjLndyYXBUeXBlIHx8IG51bGw7XG4gICAgICAgIGlmIChzcGVjLnN0YXJ0UGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMubmVzdGVkID0gc3BlYy5zdGFydFBhcnNlKHRoaXMuaW5wdXQuY2xpcCh0aGlzLm5lc3RFbmQpLCBzdGFjay5wb3MsIHRoaXMuY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaE5lc3RlZChzdGFjayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2NhbkZvck5lc3RFbmQoc3RhY2ssIGVuZFRva2VuLCBmaWx0ZXIpIHtcbiAgICAgICAgZm9yIChsZXQgcG9zID0gc3RhY2sucG9zOyBwb3MgPCB0aGlzLmlucHV0Lmxlbmd0aDsgcG9zKyspIHtcbiAgICAgICAgICAgIGR1bW15VG9rZW4uc3RhcnQgPSBwb3M7XG4gICAgICAgICAgICBkdW1teVRva2VuLnZhbHVlID0gLTE7XG4gICAgICAgICAgICBlbmRUb2tlbi50b2tlbih0aGlzLmlucHV0LCBkdW1teVRva2VuLCBzdGFjayk7XG4gICAgICAgICAgICBpZiAoZHVtbXlUb2tlbi52YWx1ZSA+IC0xICYmICghZmlsdGVyIHx8IGZpbHRlcih0aGlzLmlucHV0LnJlYWQocG9zLCBkdW1teVRva2VuLmVuZCkpKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gcG9zO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0Lmxlbmd0aDtcbiAgICB9XG4gICAgZmluaXNoTmVzdGVkKHN0YWNrLCB0cmVlKSB7XG4gICAgICAgIGlmICh0aGlzLm5lc3RXcmFwKVxuICAgICAgICAgICAgdHJlZSA9IG5ldyBsZXplclRyZWUuVHJlZSh0aGlzLm5lc3RXcmFwLCB0cmVlID8gW3RyZWVdIDogW10sIHRyZWUgPyBbMF0gOiBbXSwgdGhpcy5uZXN0RW5kIC0gc3RhY2sucG9zKTtcbiAgICAgICAgZWxzZSBpZiAoIXRyZWUpXG4gICAgICAgICAgICB0cmVlID0gbmV3IGxlemVyVHJlZS5UcmVlKGxlemVyVHJlZS5Ob2RlVHlwZS5ub25lLCBbXSwgW10sIHRoaXMubmVzdEVuZCAtIHN0YWNrLnBvcyk7XG4gICAgICAgIGxldCBpbmZvID0gdGhpcy5wYXJzZXIuZmluZE5lc3RlZChzdGFjay5zdGF0ZSk7XG4gICAgICAgIHN0YWNrLnVzZU5vZGUodHJlZSwgdGhpcy5wYXJzZXIuZ2V0R290byhzdGFjay5zdGF0ZSwgaW5mby5wbGFjZWhvbGRlciwgdHJ1ZSkpO1xuICAgICAgICBpZiAodmVyYm9zZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhY2tJRChzdGFjaykgKyBgICh2aWEgdW5uZXN0KWApO1xuICAgIH1cbiAgICBzdGFja0lEKHN0YWNrKSB7XG4gICAgICAgIGxldCBpZCA9IChzdGFja0lEcyB8fCAoc3RhY2tJRHMgPSBuZXcgV2Vha01hcCkpLmdldChzdGFjayk7XG4gICAgICAgIGlmICghaWQpXG4gICAgICAgICAgICBzdGFja0lEcy5zZXQoc3RhY2ssIGlkID0gU3RyaW5nLmZyb21Db2RlUG9pbnQodGhpcy5uZXh0U3RhY2tJRCsrKSk7XG4gICAgICAgIHJldHVybiBpZCArIHN0YWNrO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHB1c2hTdGFja0RlZHVwKHN0YWNrLCBuZXdTdGFja3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld1N0YWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgb3RoZXIgPSBuZXdTdGFja3NbaV07XG4gICAgICAgIGlmIChvdGhlci5wb3MgPT0gc3RhY2sucG9zICYmIG90aGVyLnNhbWVTdGF0ZShzdGFjaykpIHtcbiAgICAgICAgICAgIGlmIChuZXdTdGFja3NbaV0uc2NvcmUgPCBzdGFjay5zY29yZSlcbiAgICAgICAgICAgICAgICBuZXdTdGFja3NbaV0gPSBzdGFjaztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuZXdTdGFja3MucHVzaChzdGFjayk7XG59XG5jbGFzcyBEaWFsZWN0IHtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UsIGZsYWdzLCBkaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgdGhpcy5mbGFncyA9IGZsYWdzO1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgfVxuICAgIGFsbG93cyh0ZXJtKSB7IHJldHVybiAhdGhpcy5kaXNhYmxlZCB8fCB0aGlzLmRpc2FibGVkW3Rlcm1dID09IDA7IH1cbn1cbmNvbnN0IGlkID0geCA9PiB4O1xuLy8vIENvbnRleHQgdHJhY2tlcnMgYXJlIHVzZWQgdG8gdHJhY2sgc3RhdGVmdWwgY29udGV4dCAoc3VjaCBhc1xuLy8vIGluZGVudGF0aW9uIGluIHRoZSBQeXRob24gZ3JhbW1hciwgb3IgcGFyZW50IGVsZW1lbnRzIGluIHRoZSBYTUxcbi8vLyBncmFtbWFyKSBuZWVkZWQgYnkgZXh0ZXJuYWwgdG9rZW5pemVycy4gWW91IGRlY2xhcmUgdGhlbSBpbiBhXG4vLy8gZ3JhbW1hciBmaWxlIGFzIGBAY29udGV4dCBleHBvcnROYW1lIGZyb20gXCJtb2R1bGVcImAuXG4vLy9cbi8vLyBDb250ZXh0IHZhbHVlcyBzaG91bGQgYmUgaW1tdXRhYmxlLCBhbmQgY2FuIGJlIHVwZGF0ZWQgKHJlcGxhY2VkKVxuLy8vIG9uIHNoaWZ0IG9yIHJlZHVjZSBhY3Rpb25zLlxuY2xhc3MgQ29udGV4dFRyYWNrZXIge1xuICAgIC8vLyBUaGUgZXhwb3J0IHVzZWQgaW4gYSBgQGNvbnRleHRgIGRlY2xhcmF0aW9uIHNob3VsZCBiZSBvZiB0aGlzXG4gICAgLy8vIHR5cGUuXG4gICAgY29uc3RydWN0b3Ioc3BlYykge1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3BlYy5zdGFydDtcbiAgICAgICAgdGhpcy5zaGlmdCA9IHNwZWMuc2hpZnQgfHwgaWQ7XG4gICAgICAgIHRoaXMucmVkdWNlID0gc3BlYy5yZWR1Y2UgfHwgaWQ7XG4gICAgICAgIHRoaXMucmV1c2UgPSBzcGVjLnJldXNlIHx8IGlkO1xuICAgICAgICB0aGlzLmhhc2ggPSBzcGVjLmhhc2g7XG4gICAgICAgIHRoaXMuc3RyaWN0ID0gc3BlYy5zdHJpY3QgIT09IGZhbHNlO1xuICAgIH1cbn1cbi8vLyBBIHBhcnNlciBob2xkcyB0aGUgcGFyc2UgdGFibGVzIGZvciBhIGdpdmVuIGdyYW1tYXIsIGFzIGdlbmVyYXRlZFxuLy8vIGJ5IGBsZXplci1nZW5lcmF0b3JgLlxuY2xhc3MgUGFyc2VyIHtcbiAgICAvLy8gQGludGVybmFsXG4gICAgY29uc3RydWN0b3Ioc3BlYykge1xuICAgICAgICAvLy8gQGludGVybmFsXG4gICAgICAgIHRoaXMuYnVmZmVyTGVuZ3RoID0gbGV6ZXJUcmVlLkRlZmF1bHRCdWZmZXJMZW5ndGg7XG4gICAgICAgIC8vLyBAaW50ZXJuYWxcbiAgICAgICAgdGhpcy5zdHJpY3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYWNoZWREaWFsZWN0ID0gbnVsbDtcbiAgICAgICAgaWYgKHNwZWMudmVyc2lvbiAhPSAxMyAvKiBWZXJzaW9uICovKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFBhcnNlciB2ZXJzaW9uICgke3NwZWMudmVyc2lvbn0pIGRvZXNuJ3QgbWF0Y2ggcnVudGltZSB2ZXJzaW9uICgkezEzIC8qIFZlcnNpb24gKi99KWApO1xuICAgICAgICBsZXQgdG9rZW5BcnJheSA9IGRlY29kZUFycmF5KHNwZWMudG9rZW5EYXRhKTtcbiAgICAgICAgbGV0IG5vZGVOYW1lcyA9IHNwZWMubm9kZU5hbWVzLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgdGhpcy5taW5SZXBlYXRUZXJtID0gbm9kZU5hbWVzLmxlbmd0aDtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gc3BlYy5jb250ZXh0O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwZWMucmVwZWF0Tm9kZUNvdW50OyBpKyspXG4gICAgICAgICAgICBub2RlTmFtZXMucHVzaChcIlwiKTtcbiAgICAgICAgbGV0IG5vZGVQcm9wcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVOYW1lcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgIG5vZGVQcm9wcy5wdXNoKFtdKTtcbiAgICAgICAgZnVuY3Rpb24gc2V0UHJvcChub2RlSUQsIHByb3AsIHZhbHVlKSB7XG4gICAgICAgICAgICBub2RlUHJvcHNbbm9kZUlEXS5wdXNoKFtwcm9wLCBwcm9wLmRlc2VyaWFsaXplKFN0cmluZyh2YWx1ZSkpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwZWMubm9kZVByb3BzKVxuICAgICAgICAgICAgZm9yIChsZXQgcHJvcFNwZWMgb2Ygc3BlYy5ub2RlUHJvcHMpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BTcGVjWzBdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcHJvcFNwZWMubGVuZ3RoOykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dCA9IHByb3BTcGVjW2krK107XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFByb3AobmV4dCwgcHJvcCwgcHJvcFNwZWNbaSsrXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBwcm9wU3BlY1tpICsgLW5leHRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IC1uZXh0OyBqID4gMDsgai0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFByb3AocHJvcFNwZWNbaSsrXSwgcHJvcCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB0aGlzLnNwZWNpYWxpemVkID0gbmV3IFVpbnQxNkFycmF5KHNwZWMuc3BlY2lhbGl6ZWQgPyBzcGVjLnNwZWNpYWxpemVkLmxlbmd0aCA6IDApO1xuICAgICAgICB0aGlzLnNwZWNpYWxpemVycyA9IFtdO1xuICAgICAgICBpZiAoc3BlYy5zcGVjaWFsaXplZClcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3BlYy5zcGVjaWFsaXplZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlY2lhbGl6ZWRbaV0gPSBzcGVjLnNwZWNpYWxpemVkW2ldLnRlcm07XG4gICAgICAgICAgICAgICAgdGhpcy5zcGVjaWFsaXplcnNbaV0gPSBzcGVjLnNwZWNpYWxpemVkW2ldLmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZXMgPSBkZWNvZGVBcnJheShzcGVjLnN0YXRlcywgVWludDMyQXJyYXkpO1xuICAgICAgICB0aGlzLmRhdGEgPSBkZWNvZGVBcnJheShzcGVjLnN0YXRlRGF0YSk7XG4gICAgICAgIHRoaXMuZ290byA9IGRlY29kZUFycmF5KHNwZWMuZ290byk7XG4gICAgICAgIGxldCB0b3BUZXJtcyA9IE9iamVjdC5rZXlzKHNwZWMudG9wUnVsZXMpLm1hcChyID0+IHNwZWMudG9wUnVsZXNbcl1bMV0pO1xuICAgICAgICB0aGlzLm5vZGVTZXQgPSBuZXcgbGV6ZXJUcmVlLk5vZGVTZXQobm9kZU5hbWVzLm1hcCgobmFtZSwgaSkgPT4gbGV6ZXJUcmVlLk5vZGVUeXBlLmRlZmluZSh7XG4gICAgICAgICAgICBuYW1lOiBpID49IHRoaXMubWluUmVwZWF0VGVybSA/IHVuZGVmaW5lZCA6IG5hbWUsXG4gICAgICAgICAgICBpZDogaSxcbiAgICAgICAgICAgIHByb3BzOiBub2RlUHJvcHNbaV0sXG4gICAgICAgICAgICB0b3A6IHRvcFRlcm1zLmluZGV4T2YoaSkgPiAtMSxcbiAgICAgICAgICAgIGVycm9yOiBpID09IDAsXG4gICAgICAgICAgICBza2lwcGVkOiBzcGVjLnNraXBwZWROb2RlcyAmJiBzcGVjLnNraXBwZWROb2Rlcy5pbmRleE9mKGkpID4gLTFcbiAgICAgICAgfSkpKTtcbiAgICAgICAgdGhpcy5tYXhUZXJtID0gc3BlYy5tYXhUZXJtO1xuICAgICAgICB0aGlzLnRva2VuaXplcnMgPSBzcGVjLnRva2VuaXplcnMubWFwKHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PSBcIm51bWJlclwiID8gbmV3IFRva2VuR3JvdXAodG9rZW5BcnJheSwgdmFsdWUpIDogdmFsdWUpO1xuICAgICAgICB0aGlzLnRvcFJ1bGVzID0gc3BlYy50b3BSdWxlcztcbiAgICAgICAgdGhpcy5uZXN0ZWQgPSAoc3BlYy5uZXN0ZWQgfHwgW10pLm1hcCgoW25hbWUsIHZhbHVlLCBlbmRUb2tlbiwgcGxhY2Vob2xkZXJdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lLCB2YWx1ZSwgZW5kOiBuZXcgVG9rZW5Hcm91cChkZWNvZGVBcnJheShlbmRUb2tlbiksIDApLCBwbGFjZWhvbGRlciB9O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaWFsZWN0cyA9IHNwZWMuZGlhbGVjdHMgfHwge307XG4gICAgICAgIHRoaXMuZHluYW1pY1ByZWNlZGVuY2VzID0gc3BlYy5keW5hbWljUHJlY2VkZW5jZXMgfHwgbnVsbDtcbiAgICAgICAgdGhpcy50b2tlblByZWNUYWJsZSA9IHNwZWMudG9rZW5QcmVjO1xuICAgICAgICB0aGlzLnRlcm1OYW1lcyA9IHNwZWMudGVybU5hbWVzIHx8IG51bGw7XG4gICAgICAgIHRoaXMubWF4Tm9kZSA9IHRoaXMubm9kZVNldC50eXBlcy5sZW5ndGggLSAxO1xuICAgICAgICB0aGlzLmRpYWxlY3QgPSB0aGlzLnBhcnNlRGlhbGVjdCgpO1xuICAgICAgICB0aGlzLnRvcCA9IHRoaXMudG9wUnVsZXNbT2JqZWN0LmtleXModGhpcy50b3BSdWxlcylbMF1dO1xuICAgIH1cbiAgICAvLy8gUGFyc2UgYSBnaXZlbiBzdHJpbmcgb3Igc3RyZWFtLlxuICAgIHBhcnNlKGlucHV0LCBzdGFydFBvcyA9IDAsIGNvbnRleHQgPSB7fSkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICBpbnB1dCA9IGxlemVyVHJlZS5zdHJpbmdJbnB1dChpbnB1dCk7XG4gICAgICAgIGxldCBjeCA9IG5ldyBQYXJzZSh0aGlzLCBpbnB1dCwgc3RhcnRQb3MsIGNvbnRleHQpO1xuICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICBsZXQgZG9uZSA9IGN4LmFkdmFuY2UoKTtcbiAgICAgICAgICAgIGlmIChkb25lKVxuICAgICAgICAgICAgICAgIHJldHVybiBkb25lO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vLyBTdGFydCBhbiBpbmNyZW1lbnRhbCBwYXJzZS5cbiAgICBzdGFydFBhcnNlKGlucHV0LCBzdGFydFBvcyA9IDAsIGNvbnRleHQgPSB7fSkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICBpbnB1dCA9IGxlemVyVHJlZS5zdHJpbmdJbnB1dChpbnB1dCk7XG4gICAgICAgIHJldHVybiBuZXcgUGFyc2UodGhpcywgaW5wdXQsIHN0YXJ0UG9zLCBjb250ZXh0KTtcbiAgICB9XG4gICAgLy8vIEdldCBhIGdvdG8gdGFibGUgZW50cnkgQGludGVybmFsXG4gICAgZ2V0R290byhzdGF0ZSwgdGVybSwgbG9vc2UgPSBmYWxzZSkge1xuICAgICAgICBsZXQgdGFibGUgPSB0aGlzLmdvdG87XG4gICAgICAgIGlmICh0ZXJtID49IHRhYmxlWzBdKVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICBmb3IgKGxldCBwb3MgPSB0YWJsZVt0ZXJtICsgMV07Oykge1xuICAgICAgICAgICAgbGV0IGdyb3VwVGFnID0gdGFibGVbcG9zKytdLCBsYXN0ID0gZ3JvdXBUYWcgJiAxO1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IHRhYmxlW3BvcysrXTtcbiAgICAgICAgICAgIGlmIChsYXN0ICYmIGxvb3NlKVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgICAgICBmb3IgKGxldCBlbmQgPSBwb3MgKyAoZ3JvdXBUYWcgPj4gMSk7IHBvcyA8IGVuZDsgcG9zKyspXG4gICAgICAgICAgICAgICAgaWYgKHRhYmxlW3Bvc10gPT0gc3RhdGUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgICAgICBpZiAobGFzdClcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8vIENoZWNrIGlmIHRoaXMgc3RhdGUgaGFzIGFuIGFjdGlvbiBmb3IgYSBnaXZlbiB0ZXJtaW5hbCBAaW50ZXJuYWxcbiAgICBoYXNBY3Rpb24oc3RhdGUsIHRlcm1pbmFsKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICBmb3IgKGxldCBzZXQgPSAwOyBzZXQgPCAyOyBzZXQrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuc3RhdGVTbG90KHN0YXRlLCBzZXQgPyAyIC8qIFNraXAgKi8gOiAxIC8qIEFjdGlvbnMgKi8pLCBuZXh0OzsgaSArPSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKChuZXh0ID0gZGF0YVtpXSkgPT0gNjU1MzUgLyogRW5kICovKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhW2kgKyAxXSA9PSAxIC8qIE5leHQgKi8pXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0ID0gZGF0YVtpID0gcGFpcihkYXRhLCBpICsgMildO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChkYXRhW2kgKyAxXSA9PSAyIC8qIE90aGVyICovKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhaXIoZGF0YSwgaSArIDIpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgPT0gdGVybWluYWwgfHwgbmV4dCA9PSAwIC8qIEVyciAqLylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhaXIoZGF0YSwgaSArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICAvLy8gQGludGVybmFsXG4gICAgc3RhdGVTbG90KHN0YXRlLCBzbG90KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlc1soc3RhdGUgKiA2IC8qIFNpemUgKi8pICsgc2xvdF07XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBzdGF0ZUZsYWcoc3RhdGUsIGZsYWcpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnN0YXRlU2xvdChzdGF0ZSwgMCAvKiBGbGFncyAqLykgJiBmbGFnKSA+IDA7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBmaW5kTmVzdGVkKHN0YXRlKSB7XG4gICAgICAgIGxldCBmbGFncyA9IHRoaXMuc3RhdGVTbG90KHN0YXRlLCAwIC8qIEZsYWdzICovKTtcbiAgICAgICAgcmV0dXJuIGZsYWdzICYgNCAvKiBTdGFydE5lc3QgKi8gPyB0aGlzLm5lc3RlZFtmbGFncyA+PiAxMCAvKiBOZXN0U2hpZnQgKi9dIDogbnVsbDtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIHZhbGlkQWN0aW9uKHN0YXRlLCBhY3Rpb24pIHtcbiAgICAgICAgaWYgKGFjdGlvbiA9PSB0aGlzLnN0YXRlU2xvdChzdGF0ZSwgNCAvKiBEZWZhdWx0UmVkdWNlICovKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5zdGF0ZVNsb3Qoc3RhdGUsIDEgLyogQWN0aW9ucyAqLyk7OyBpICs9IDMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbaV0gPT0gNjU1MzUgLyogRW5kICovKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVtpICsgMV0gPT0gMSAvKiBOZXh0ICovKVxuICAgICAgICAgICAgICAgICAgICBpID0gcGFpcih0aGlzLmRhdGEsIGkgKyAyKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT0gcGFpcih0aGlzLmRhdGEsIGkgKyAxKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLy8gR2V0IHRoZSBzdGF0ZXMgdGhhdCBjYW4gZm9sbG93IHRoaXMgb25lIHRocm91Z2ggc2hpZnQgYWN0aW9ucyBvclxuICAgIC8vLyBnb3RvIGp1bXBzLiBAaW50ZXJuYWxcbiAgICBuZXh0U3RhdGVzKHN0YXRlKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuc3RhdGVTbG90KHN0YXRlLCAxIC8qIEFjdGlvbnMgKi8pOzsgaSArPSAzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhW2ldID09IDY1NTM1IC8qIEVuZCAqLykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbaSArIDFdID09IDEgLyogTmV4dCAqLylcbiAgICAgICAgICAgICAgICAgICAgaSA9IHBhaXIodGhpcy5kYXRhLCBpICsgMik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgodGhpcy5kYXRhW2kgKyAyXSAmICg2NTUzNiAvKiBSZWR1Y2VGbGFnICovID4+IDE2KSkgPT0gMCkge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRoaXMuZGF0YVtpICsgMV07XG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQuc29tZSgodiwgaSkgPT4gKGkgJiAxKSAmJiB2ID09IHZhbHVlKSlcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5kYXRhW2ldLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIG92ZXJyaWRlcyh0b2tlbiwgcHJldikge1xuICAgICAgICBsZXQgaVByZXYgPSBmaW5kT2Zmc2V0KHRoaXMuZGF0YSwgdGhpcy50b2tlblByZWNUYWJsZSwgcHJldik7XG4gICAgICAgIHJldHVybiBpUHJldiA8IDAgfHwgZmluZE9mZnNldCh0aGlzLmRhdGEsIHRoaXMudG9rZW5QcmVjVGFibGUsIHRva2VuKSA8IGlQcmV2O1xuICAgIH1cbiAgICAvLy8gQ29uZmlndXJlIHRoZSBwYXJzZXIuIFJldHVybnMgYSBuZXcgcGFyc2VyIGluc3RhbmNlIHRoYXQgaGFzIHRoZVxuICAgIC8vLyBnaXZlbiBzZXR0aW5ncyBtb2RpZmllZC4gU2V0dGluZ3Mgbm90IHByb3ZpZGVkIGluIGBjb25maWdgIGFyZVxuICAgIC8vLyBrZXB0IGZyb20gdGhlIG9yaWdpbmFsIHBhcnNlci5cbiAgICBjb25maWd1cmUoY29uZmlnKSB7XG4gICAgICAgIC8vIEhpZGVvdXMgcmVmbGVjdGlvbi1iYXNlZCBrbHVkZ2UgdG8gbWFrZSBpdCBlYXN5IHRvIGNyZWF0ZSBhXG4gICAgICAgIC8vIHNsaWdodGx5IG1vZGlmaWVkIGNvcHkgb2YgYSBwYXJzZXIuXG4gICAgICAgIGxldCBjb3B5ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKFBhcnNlci5wcm90b3R5cGUpLCB0aGlzKTtcbiAgICAgICAgaWYgKGNvbmZpZy5wcm9wcylcbiAgICAgICAgICAgIGNvcHkubm9kZVNldCA9IHRoaXMubm9kZVNldC5leHRlbmQoLi4uY29uZmlnLnByb3BzKTtcbiAgICAgICAgaWYgKGNvbmZpZy50b3ApIHtcbiAgICAgICAgICAgIGxldCBpbmZvID0gdGhpcy50b3BSdWxlc1tjb25maWcudG9wXTtcbiAgICAgICAgICAgIGlmICghaW5mbylcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgSW52YWxpZCB0b3AgcnVsZSBuYW1lICR7Y29uZmlnLnRvcH1gKTtcbiAgICAgICAgICAgIGNvcHkudG9wID0gaW5mbztcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uZmlnLnRva2VuaXplcnMpXG4gICAgICAgICAgICBjb3B5LnRva2VuaXplcnMgPSB0aGlzLnRva2VuaXplcnMubWFwKHQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBmb3VuZCA9IGNvbmZpZy50b2tlbml6ZXJzLmZpbmQociA9PiByLmZyb20gPT0gdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kID8gZm91bmQudG8gOiB0O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIGlmIChjb25maWcuZGlhbGVjdClcbiAgICAgICAgICAgIGNvcHkuZGlhbGVjdCA9IHRoaXMucGFyc2VEaWFsZWN0KGNvbmZpZy5kaWFsZWN0KTtcbiAgICAgICAgaWYgKGNvbmZpZy5uZXN0ZWQpXG4gICAgICAgICAgICBjb3B5Lm5lc3RlZCA9IHRoaXMubmVzdGVkLm1hcChvYmogPT4ge1xuICAgICAgICAgICAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZy5uZXN0ZWQsIG9iai5uYW1lKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBvYmoubmFtZSwgdmFsdWU6IGNvbmZpZy5uZXN0ZWRbb2JqLm5hbWVdLCBlbmQ6IG9iai5lbmQsIHBsYWNlaG9sZGVyOiBvYmoucGxhY2Vob2xkZXIgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBpZiAoY29uZmlnLnN0cmljdCAhPSBudWxsKVxuICAgICAgICAgICAgY29weS5zdHJpY3QgPSBjb25maWcuc3RyaWN0O1xuICAgICAgICBpZiAoY29uZmlnLmJ1ZmZlckxlbmd0aCAhPSBudWxsKVxuICAgICAgICAgICAgY29weS5idWZmZXJMZW5ndGggPSBjb25maWcuYnVmZmVyTGVuZ3RoO1xuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG4gICAgLy8vIFJldHVybnMgdGhlIG5hbWUgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gdGVybS4gVGhpcyB3aWxsIG9ubHlcbiAgICAvLy8gd29yayBmb3IgYWxsIHRlcm1zIHdoZW4gdGhlIHBhcnNlciB3YXMgZ2VuZXJhdGVkIHdpdGggdGhlXG4gICAgLy8vIGAtLW5hbWVzYCBvcHRpb24uIEJ5IGRlZmF1bHQsIG9ubHkgdGhlIG5hbWVzIG9mIHRhZ2dlZCB0ZXJtcyBhcmVcbiAgICAvLy8gc3RvcmVkLlxuICAgIGdldE5hbWUodGVybSkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXJtTmFtZXMgPyB0aGlzLnRlcm1OYW1lc1t0ZXJtXSA6IFN0cmluZyh0ZXJtIDw9IHRoaXMubWF4Tm9kZSAmJiB0aGlzLm5vZGVTZXQudHlwZXNbdGVybV0ubmFtZSB8fCB0ZXJtKTtcbiAgICB9XG4gICAgLy8vIFRoZSBlb2YgdGVybSBpZCBpcyBhbHdheXMgYWxsb2NhdGVkIGRpcmVjdGx5IGFmdGVyIHRoZSBub2RlXG4gICAgLy8vIHR5cGVzLiBAaW50ZXJuYWxcbiAgICBnZXQgZW9mVGVybSgpIHsgcmV0dXJuIHRoaXMubWF4Tm9kZSArIDE7IH1cbiAgICAvLy8gVGVsbHMgeW91IHdoZXRoZXIgdGhpcyBncmFtbWFyIGhhcyBhbnkgbmVzdGVkIGdyYW1tYXJzLlxuICAgIGdldCBoYXNOZXN0ZWQoKSB7IHJldHVybiB0aGlzLm5lc3RlZC5sZW5ndGggPiAwOyB9XG4gICAgLy8vIFRoZSB0eXBlIG9mIHRvcCBub2RlIHByb2R1Y2VkIGJ5IHRoZSBwYXJzZXIuXG4gICAgZ2V0IHRvcE5vZGUoKSB7IHJldHVybiB0aGlzLm5vZGVTZXQudHlwZXNbdGhpcy50b3BbMV1dOyB9XG4gICAgLy8vIEBpbnRlcm5hbFxuICAgIGR5bmFtaWNQcmVjZWRlbmNlKHRlcm0pIHtcbiAgICAgICAgbGV0IHByZWMgPSB0aGlzLmR5bmFtaWNQcmVjZWRlbmNlcztcbiAgICAgICAgcmV0dXJuIHByZWMgPT0gbnVsbCA/IDAgOiBwcmVjW3Rlcm1dIHx8IDA7XG4gICAgfVxuICAgIC8vLyBAaW50ZXJuYWxcbiAgICBwYXJzZURpYWxlY3QoZGlhbGVjdCkge1xuICAgICAgICBpZiAodGhpcy5jYWNoZWREaWFsZWN0ICYmIHRoaXMuY2FjaGVkRGlhbGVjdC5zb3VyY2UgPT0gZGlhbGVjdClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlZERpYWxlY3Q7XG4gICAgICAgIGxldCB2YWx1ZXMgPSBPYmplY3Qua2V5cyh0aGlzLmRpYWxlY3RzKSwgZmxhZ3MgPSB2YWx1ZXMubWFwKCgpID0+IGZhbHNlKTtcbiAgICAgICAgaWYgKGRpYWxlY3QpXG4gICAgICAgICAgICBmb3IgKGxldCBwYXJ0IG9mIGRpYWxlY3Quc3BsaXQoXCIgXCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlkID0gdmFsdWVzLmluZGV4T2YocGFydCk7XG4gICAgICAgICAgICAgICAgaWYgKGlkID49IDApXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzW2lkXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIGxldCBkaXNhYmxlZCA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgaWYgKCFmbGFnc1tpXSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSB0aGlzLmRpYWxlY3RzW3ZhbHVlc1tpXV0sIGlkOyAoaWQgPSB0aGlzLmRhdGFbaisrXSkgIT0gNjU1MzUgLyogRW5kICovOylcbiAgICAgICAgICAgICAgICAgICAgKGRpc2FibGVkIHx8IChkaXNhYmxlZCA9IG5ldyBVaW50OEFycmF5KHRoaXMubWF4VGVybSArIDEpKSlbaWRdID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkRGlhbGVjdCA9IG5ldyBEaWFsZWN0KGRpYWxlY3QsIGZsYWdzLCBkaXNhYmxlZCk7XG4gICAgfVxuICAgIC8vLyAodXNlZCBieSB0aGUgb3V0cHV0IG9mIHRoZSBwYXJzZXIgZ2VuZXJhdG9yKSBAaW50ZXJuYWxcbiAgICBzdGF0aWMgZGVzZXJpYWxpemUoc3BlYykge1xuICAgICAgICByZXR1cm4gbmV3IFBhcnNlcihzcGVjKTtcbiAgICB9XG59XG5mdW5jdGlvbiBwYWlyKGRhdGEsIG9mZikgeyByZXR1cm4gZGF0YVtvZmZdIHwgKGRhdGFbb2ZmICsgMV0gPDwgMTYpOyB9XG5mdW5jdGlvbiBmaW5kT2Zmc2V0KGRhdGEsIHN0YXJ0LCB0ZXJtKSB7XG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0LCBuZXh0OyAobmV4dCA9IGRhdGFbaV0pICE9IDY1NTM1IC8qIEVuZCAqLzsgaSsrKVxuICAgICAgICBpZiAobmV4dCA9PSB0ZXJtKVxuICAgICAgICAgICAgcmV0dXJuIGkgLSBzdGFydDtcbiAgICByZXR1cm4gLTE7XG59XG5mdW5jdGlvbiBmaW5kRmluaXNoZWQoc3RhY2tzKSB7XG4gICAgbGV0IGJlc3QgPSBudWxsO1xuICAgIGZvciAobGV0IHN0YWNrIG9mIHN0YWNrcykge1xuICAgICAgICBpZiAoc3RhY2sucG9zID09IHN0YWNrLnAuaW5wdXQubGVuZ3RoICYmXG4gICAgICAgICAgICBzdGFjay5wLnBhcnNlci5zdGF0ZUZsYWcoc3RhY2suc3RhdGUsIDIgLyogQWNjZXB0aW5nICovKSAmJlxuICAgICAgICAgICAgKCFiZXN0IHx8IGJlc3Quc2NvcmUgPCBzdGFjay5zY29yZSkpXG4gICAgICAgICAgICBiZXN0ID0gc3RhY2s7XG4gICAgfVxuICAgIHJldHVybiBiZXN0O1xufVxuXG5leHBvcnRzLk5vZGVQcm9wID0gbGV6ZXJUcmVlLk5vZGVQcm9wO1xuZXhwb3J0cy5Ob2RlU2V0ID0gbGV6ZXJUcmVlLk5vZGVTZXQ7XG5leHBvcnRzLk5vZGVUeXBlID0gbGV6ZXJUcmVlLk5vZGVUeXBlO1xuZXhwb3J0cy5UcmVlID0gbGV6ZXJUcmVlLlRyZWU7XG5leHBvcnRzLlRyZWVDdXJzb3IgPSBsZXplclRyZWUuVHJlZUN1cnNvcjtcbmV4cG9ydHMuQ29udGV4dFRyYWNrZXIgPSBDb250ZXh0VHJhY2tlcjtcbmV4cG9ydHMuRXh0ZXJuYWxUb2tlbml6ZXIgPSBFeHRlcm5hbFRva2VuaXplcjtcbmV4cG9ydHMuUGFyc2VyID0gUGFyc2VyO1xuZXhwb3J0cy5TdGFjayA9IFN0YWNrO1xuZXhwb3J0cy5Ub2tlbiA9IFRva2VuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguY2pzLm1hcFxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vd2Vic3RhcnQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=