import * as dotenv from "dotenv"
dotenv.config()

import { expect } from "chai"
import { Core } from "../src/core/core"

const { GITHUB_TOKEN } = process.env;
const core = new Core(GITHUB_TOKEN);

describe("Test link matching and fetching (core.handleMessage)", () => {
  it("GitHub single line", async () => {
    const url = "https://github.com/diogoscf/github-lines/blob/master/LICENSE#L1";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(1);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(1);
    expect(msgList[0].extension).to.equal("");
    expect(msgList[0].toDisplay).to.equal("The MIT License");
  });

  it("GitHub multi-line", async () => {
    const url = "https://github.com/diogoscf/github-lines/blob/master/LICENSE#L1-L3";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(3);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(3);
    expect(msgList[0].extension).to.equal("");
    expect(msgList[0].toDisplay).to.equal("The MIT License\n\nCopyright (c) 2020 Diogo S.C. Fernandes (@diogoscf)");
  });

  it("GitHub multi-line with tilde", async () => {
    const url = "https://github.com/diogoscf/github-lines/blob/master/LICENSE#L1~L3";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(3);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(3);
    expect(msgList[0].extension).to.equal("");
    expect(msgList[0].toDisplay).to.equal("The MIT License\n\nCopyright (c) 2020 Diogo S.C. Fernandes (@diogoscf)");
  });

  it("Gist single line", async () => {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4#file-bot-test-js-L1";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(1);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(1);
    expect(msgList[0].extension).to.equal("js");
    expect(msgList[0].toDisplay).to.equal('console.log("hello-rev")');
  });

  it("Gist multi-line", async () => {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4#file-bot-test-py-L1-L2";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(2);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(2);
    expect(msgList[0].extension).to.equal("py");
    expect(msgList[0].toDisplay).to.equal('print("test-rev")\nprint("test2")');
  });

  it("Gist revison single line", async () => {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4/3a556c88296c5ba796a8f464f3838970d689c9fd#file-bot-test-js-L1";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(1);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(1);
    expect(msgList[0].extension).to.equal("js");
    expect(msgList[0].toDisplay).to.equal('console.log("hello")');
  });

  it("Gist revision multi-line", async () => {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4/3a556c88296c5ba796a8f464f3838970d689c9fd#file-bot-test-py-L1-L2";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(2);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(2);
    expect(msgList[0].extension).to.equal("py");
    expect(msgList[0].toDisplay).to.equal('print("test")\nprint("test2")');
  });

  it("Gist revision multi-line with tilde", async () => {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4/3a556c88296c5ba796a8f464f3838970d689c9fd#file-bot-test-py-L1~L2";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(2);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(2);
    expect(msgList[0].extension).to.equal("py");
    expect(msgList[0].toDisplay).to.equal('print("test")\nprint("test2")');
  });

  it("Gitlab single line", async () => {
    const url = "https://gitlab.com/diogoscf/github-lines-test/-/blob/master/test.txt#L3";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(1);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(1);
    expect(msgList[0].extension).to.equal("txt");
    expect(msgList[0].toDisplay).to.equal("yeet");
  });

  it("Gitlab multi-line", async () => {
    const url = "https://gitlab.com/diogoscf/github-lines-test/-/blob/master/test.txt#L1-2";
    const { msgList, totalLines } = await core.handleMessage(url);
    expect(totalLines).to.equal(2);
    expect(msgList.length).to.equal(1);
    expect(msgList[0].lineLength).to.equal(2);
    expect(msgList[0].extension).to.equal("txt");
    expect(msgList[0].toDisplay).to.equal("Lorem ipsum\nidk what I'm doing");
  });

  it("Multi-snippet", async () => {
    const msg = "https://gitlab.com/diogoscf/github-lines-test/-/blob/master/test.txt#L1-2" +
      "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4#file-bot-test-js-L1";
    const { msgList, totalLines } = await core.handleMessage(msg);
    expect(totalLines).to.equal(3);
    expect(msgList.length).to.equal(2);
    expect(msgList[0].lineLength).to.equal(2);
    expect(msgList[0].extension).to.equal("txt");
    expect(msgList[0].toDisplay).to.equal("Lorem ipsum\nidk what I'm doing");
    expect(msgList[1].lineLength).to.equal(1);
    expect(msgList[1].extension).to.equal("js");
    expect(msgList[1].toDisplay).to.equal('console.log("hello-rev")');
  });
})
