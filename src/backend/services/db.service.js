"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var Knex = require("knex");
var ServerType;
(function (ServerType) {
    ServerType["MySQL"] = "mysql";
    ServerType["PostgreSQL"] = "pg";
    ServerType["OracleDB"] = "oracledb";
    ServerType["MSSQL"] = "mssql";
})(ServerType = exports.ServerType || (exports.ServerType = {}));
exports.serverTypeIdAsEnum = function (id) {
    console.log('id=======>', id);
    if (id === '1') {
        return ServerType.MySQL;
    }
    if (id === '2') {
        return ServerType.MSSQL;
    }
    if (id === '3') {
        return ServerType.PostgreSQL;
    }
    if (id === '4') {
        return ServerType.OracleDB;
    }
    return null;
};
exports.HeartBeatQueries = (_a = {},
    _a[ServerType.OracleDB] = 'select 1 from DUAL',
    _a[ServerType.MySQL] = 'SELECT 1',
    _a[ServerType.PostgreSQL] = 'SELECT 1',
    _a[ServerType.MSSQL] = 'SELECT 1',
    _a);
exports.ListTablesQueries = (_b = {},
    _b[ServerType.OracleDB] = 'SELECT table_name FROM user_tables',
    _b[ServerType.MySQL] = 'SELECT table_name FROM information_schema.tables WHERE table_schema = ?',
    _b[ServerType.PostgreSQL] = "SELECT concat(table_schema, '.', table_name) as table_name FROM\n  information_schema.tables WHERE table_type = 'BASE TABLE' AND table_catalog = ?",
    _b[ServerType.MSSQL] = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_catalog = ?',
    _b);
exports.GetPrimaryKeyQueries = __assign(__assign({}, exports.ListTablesQueries), (_c = {}, _c[ServerType.MySQL] = "\n    SELECT\n        COLUMN_NAME as 'name',\n        COLUMN_DEFAULT as 'default',\n        IF(STRCMP(IS_NULLABLE, 'true') = 0, true, false) as 'nullable',\n        DATA_TYPE as 'type',\n        IFNULL(CHARACTER_MAXIMUM_LENGTH, 0)+IFNULL(NUMERIC_PRECISION, 0) as 'length',\n        COLUMN_KEY as 'key',\n        EXTRA as 'extra'\n    FROM information_schema.columns WHERE table_schema = ? and table_name = ?\n    ", _c[ServerType.PostgreSQL] = "select\n\ta.*,\n\tb.key\nfrom\n\t(\n\tselect\n\t\tcolumn_name as name,\n\t\tcolumn_default as default,\n\t\tis_nullable as nullable,\n\t\tudt_name as type,\n\t\tgreatest(character_maximum_length, 0) + greatest(numeric_precision, 0) as length,\n\t\t'' as extra\n\tfrom\n\t\tinformation_schema.columns\n\twhere\n\t\ttable_catalog = ?\n\t\tand table_schema = split_part(?, '.', 1)\n\t\tand table_name = split_part(?, '.', 2))a\nleft join (\n\t\tselect pg_attribute.attname as name,\n\t\t'PRI' as key\n\tfrom\n\t\tpg_index,\n\t\tpg_class,\n\t\tpg_attribute,\n\t\tpg_namespace\n\twhere\n\t\tpg_class.oid = ?::regclass\n\t\tand indrelid = pg_class.oid\n\t\tand pg_class.relnamespace = pg_namespace.oid\n\t\tand pg_attribute.attrelid = pg_class.oid\n\t\tand pg_attribute.attnum = any(pg_index.indkey)\n\t\tand indisprimary)b on\n\ta.name = b.name;", _c));
var DatabaseService = /** @class */ (function () {
    function DatabaseService() {
    }
    Object.defineProperty(DatabaseService.prototype, "connection", {
        get: function () {
            return this._connection || Knex({});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatabaseService.prototype, "activeClient", {
        get: function () {
            if (!this.connection) {
                return '';
            }
            try {
                return this.connection.client.config.client;
            }
            catch (error) {
                console.log('activeClient: ', error);
            }
            return '';
        },
        enumerable: true,
        configurable: true
    });
    DatabaseService.getInstance = function () {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    };
    DatabaseService.prototype.connect = function (client, host, port, user, password, database) {
        return __awaiter(this, void 0, void 0, function () {
            var config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.disconnect()];
                    case 1:
                        _a.sent();
                        config = {
                            client: 'mysql',
                            connection: {
                                host: host,
                                port: 3306,
                                user: user,
                                password: password,
                                database: database,
                            },
                        };
                        console.log('knex.config', config);
                        try {
                            this._connection = Knex(config);
                        }
                        catch (error) {
                            return [2 /*return*/, error];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    DatabaseService.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.connection.destroy()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService.prototype.heartbeat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var heartbeatQuery, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection || !this.activeClient) {
                            console.log('no connection or active client');
                            return [2 /*return*/, null];
                        }
                        heartbeatQuery = exports.HeartBeatQueries[this.activeClient];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.raw(heartbeatQuery)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, error_1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService.prototype.listTables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var listTablesQuery, bindings, res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listTablesQuery = exports.ListTablesQueries[this.activeClient];
                        console.log('listTablesQuery', listTablesQuery);
                        bindings = [this.connection.client.database()];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.raw(listTablesQuery, bindings)];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        if (this.activeClient === 'mysql') {
                            return [2 /*return*/, res[0].map(function (row) { return row.table_name; })];
                        }
                        if (this.activeClient === 'pg') {
                            return [2 /*return*/, res.rows.map(function (row) { return row.table_name; })];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [2 /*return*/, error_2];
                    case 4: return [2 /*return*/, []];
                }
            });
        });
    };
    DatabaseService.prototype.tableInfo = function (tableName) {
        return __awaiter(this, void 0, void 0, function () {
            var tableInfoQuery, bindings, findResult, findResultPG, res, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tableInfoQuery = exports.GetPrimaryKeyQueries[this.activeClient];
                        bindings = [tableName];
                        if (this.activeClient === 'mysql') {
                            bindings = [this.connection.client.database(), tableName];
                        }
                        if (this.activeClient === 'pg') {
                            bindings = [this.connection.client.database(), tableName, tableName, tableName];
                        }
                        findResult = (function (result) { return result[0]; });
                        findResultPG = (function (result) { return result.rows; });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.raw(tableInfoQuery, bindings)];
                    case 2:
                        res = _a.sent();
                        if (this.activeClient === 'pg') {
                            return [2 /*return*/, findResultPG(res)];
                        }
                        return [2 /*return*/, findResult(res)];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, error_3];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService.prototype.readData = function (table, columns, limit, offset, searchColumns, searchText, where, join) {
        return __awaiter(this, void 0, void 0, function () {
            var selectColumns, q_1, countRes, res, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('join', join);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        selectColumns = __spreadArrays(columns).map(function (col) { return !col.includes('.') ? table + "." + col : col + " as " + col; });
                        q_1 = (_a = this.connection).select.apply(_a, selectColumns).from(table);
                        if (join) {
                            join.forEach(function (j) {
                                // @ts-ignore
                                q_1 = q_1.leftJoin(j.table, table + "." + j.on.local, j.table + "." + j.on.target);
                            });
                        }
                        if (searchColumns && searchText) {
                            q_1 = q_1.whereWrapped(function (wq) {
                                searchColumns.forEach(function (sCol, idx) {
                                    if (!sCol.includes('.')) {
                                        sCol = table + "." + sCol;
                                    }
                                    if (idx === 0) {
                                        wq = wq.where(sCol, 'like', "%" + searchText + "%");
                                    }
                                    else {
                                        wq = wq.orWhere(sCol, 'like', "%" + searchText + "%");
                                    }
                                });
                                return wq;
                            });
                        }
                        if (where) {
                            where.forEach(function (col, idx) {
                                var wCol = col.column;
                                if (!wCol.includes('.')) {
                                    wCol = table + "." + wCol;
                                }
                                if (idx === 0) {
                                    // if we have where before (from search) we must use andWhere, if no search use where
                                    var firstWhereFunc = (searchColumns && searchText) ? 'andWhere' : 'where';
                                    q_1 = q_1[firstWhereFunc](col.column, col.opr, col.value);
                                }
                                else {
                                    var whereFunc = col.or ? 'orWhere' : 'andWhere';
                                    q_1 = q_1[whereFunc](col.column, col.opr, col.value);
                                }
                            });
                        }
                        return [4 /*yield*/, q_1.clone().clearSelect().count({ count: '*' })];
                    case 2:
                        countRes = _b.sent();
                        console.log('countRes: ', countRes);
                        return [4 /*yield*/, q_1.limit(limit).offset(offset)];
                    case 3:
                        res = _b.sent();
                        console.log('raw query: ', q_1.toQuery());
                        console.log(res);
                        return [2 /*return*/, {
                                data: res,
                                count: countRes[0]['count'],
                            }];
                    case 4:
                        error_4 = _b.sent();
                        return [2 /*return*/, error_4];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService.prototype.updateData = function (table, update, where) {
        return __awaiter(this, void 0, void 0, function () {
            var q_2, res, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        q_2 = this.connection
                            .table(table);
                        (where || []).forEach(function (col, idx) {
                            if (idx === 0) {
                                q_2 = q_2.where(col.column, col.opr, col.value);
                            }
                            else {
                                var whereFunc = col.or ? 'orWhere' : 'andWhere';
                                q_2 = q_2[whereFunc](col.column, col.opr, col.value);
                            }
                        });
                        q_2.update(update);
                        return [4 /*yield*/, q_2];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/, true];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, error_5];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService.prototype.insertData = function (table, data) {
        return __awaiter(this, void 0, void 0, function () {
            var q, res, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        q = this.connection
                            .table(table);
                        q.insert(data);
                        return [4 /*yield*/, q];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/, true];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, error_6];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService.prototype.deleteData = function (table, where) {
        return __awaiter(this, void 0, void 0, function () {
            var q_3, res, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        q_3 = this.connection
                            .table(table);
                        (where || []).forEach(function (col, idx) {
                            if (idx === 0) {
                                q_3 = q_3.where(col.column, col.opr, col.value);
                            }
                            else {
                                var whereFunc = col.or ? 'orWhere' : 'andWhere';
                                q_3 = q_3[whereFunc](col.column, col.opr, col.value);
                            }
                        });
                        return [4 /*yield*/, q_3.delete()];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/, true];
                    case 2:
                        error_7 = _a.sent();
                        return [2 /*return*/, error_7];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseService.prototype.readWidgetData = function (table, column, distinct, func, where) {
        return __awaiter(this, void 0, void 0, function () {
            var aggFunc, q_4, res, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('where', where);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        aggFunc = func.toLowerCase();
                        if (distinct) {
                            aggFunc = aggFunc + "Distinct";
                        }
                        q_4 = this.connection[aggFunc]({
                            a: column,
                        }).from(table);
                        if (where) {
                            where.forEach(function (col, idx) {
                                if (idx === 0) {
                                    q_4 = q_4.where(col.column, col.opr, col.value);
                                }
                                else {
                                    var whereFunc = col.or ? 'orWhere' : 'andWhere';
                                    q_4 = q_4[whereFunc](col.column, col.opr, col.value);
                                }
                            });
                        }
                        console.log('raw query: ', q_4.toQuery());
                        return [4 /*yield*/, q_4];
                    case 2:
                        res = _a.sent();
                        console.log(res);
                        return [2 /*return*/, {
                                data: res[0]['a'],
                            }];
                    case 3:
                        error_8 = _a.sent();
                        return [2 /*return*/, error_8];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DatabaseService;
}());
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=db.service.js.map