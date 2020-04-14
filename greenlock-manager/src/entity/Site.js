"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Site = /** @class */ (function () {
    function Site() {
    }
    __decorate([
        typeorm_1.ObjectIdColumn(),
        __metadata("design:type", typeorm_1.ObjectID)
    ], Site.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Site.prototype, "subject", void 0);
    __decorate([
        typeorm_1.Column("simple-array"),
        __metadata("design:type", Array)
    ], Site.prototype, "altnames", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Site.prototype, "renewAt", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Site.prototype, "deletedAt", void 0);
    Site = __decorate([
        typeorm_1.Entity()
    ], Site);
    return Site;
}());
exports.Site = Site;
