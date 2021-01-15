"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptController = void 0;
const database_1 = require("../db/database");
const response_1 = require("../lib/response");
class receiptController {
    receiptData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                database_1.sequelize.query(`CREATE OR REPLACE FUNCTION id_for_date() RETURNS trigger
				LANGUAGE plpgsql AS
		 $$DECLARE
				seqname text := 'seq_' || EXTRACT(DAY FROM(NEW.transaction_date));
		 BEGIN
				IF seqname IS NOT NULL THEN
					 EXECUTE 'CREATE SEQUENCE IF NOT EXISTS ' || seqname;
					 EXECUTE 'SELECT nextval($1)' INTO NEW.receipt_id USING seqname::regclass;
				END IF;
				RETURN NEW;
		 END;$$;`);
                const response2 = yield database_1.sequelize.query(`
	 CREATE TRIGGER id_for_date BEFORE INSERT ON orders FOR EACH ROW
     EXECUTE PROCEDURE id_for_date();`);
                return response_1.success(res, response2);
            }
            catch (err) {
                next({
                    status: false,
                    message: 'Some error occurred while sending transaction day',
                    body: err
                });
            }
        });
    }
}
exports.receiptController = receiptController;
//# sourceMappingURL=receiptController.js.map