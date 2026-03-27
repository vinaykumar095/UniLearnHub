"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const compilerController_1 = require("../controllers/compilerController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/run', auth_1.protect, compilerController_1.runCode);
exports.default = router;
