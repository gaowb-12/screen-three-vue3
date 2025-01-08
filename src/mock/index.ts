import Mock from 'mockjs'
import type { MockParams } from "./index.d";
import MockIndex from "./mock-index"
Mock.setup({
    timeout: "300",
});
const mocks = [...MockIndex];
function mockXHR() {
    let v: MockParams;
    for (v of mocks) {
        Mock.mock(new RegExp(v.url), v.type || "get", v.response);
    }
}
mockXHR()
