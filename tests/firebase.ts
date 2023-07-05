import "mocha";

import assert from "assert";

import { app, db, storage } from "../src/utils/firebase";

describe("firebase", (): void => {
	it("should return 'db'", (): void => {
		assert.ok(db);
	});

	it("should return 'storage'", (): void => {
		assert.ok(storage);
	});

	it("should return 'app'", (): void => {
		assert.ok(app);
	});
});
