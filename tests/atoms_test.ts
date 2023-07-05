import "mocha";

import assert from "assert";

import { editProfileModalState, modalState } from "../src/components/atoms/modalAtom";

describe("modalAtom", (): void => {
	it("should return 'modalState'", (): void => {
		assert.strictEqual(modalState.key, "modalState");
	});

	it("should return 'editProfileModalState'", (): void => {
		assert.strictEqual(editProfileModalState.key, "editProfileModalState");
	});
});
