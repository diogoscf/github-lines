const { expect } = require("chai");
const { handleMessage, bot } = require("../bot");

// mock message for testing purposes
// Note: the ping command shouldn't be tested because it will fail with this
class MockMessage {
  constructor(content) {
    this.content = content;
    this.author = {
      id: "random-id"
    };
  }
  suppressEmbeds(bool = true) { // avoids errors
    return {
      catch: () => {}
    };
  }
}

describe("Test snippet printing", function () {
  it("GitHub single line", async function () {
    const url = "https://github.com/diogoscf/github-lines/blob/master/LICENSE#L1";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```\nThe MIT License\n```")
  });

  it("GitHub multi-line", async function () {
    const url = "https://github.com/diogoscf/github-lines/blob/master/LICENSE#L1-L3";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```\nThe MIT License\n\nCopyright (c) 2020 Diogo S.C. Fernandes (@diogoscf)\n```")
  });

  it("GitHub multi-line with tilde", async function () {
    const url = "https://github.com/diogoscf/github-lines/blob/master/LICENSE#L1~L3";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```\nThe MIT License\n\nCopyright (c) 2020 Diogo S.C. Fernandes (@diogoscf)\n```")
  });

  it("Gist single line", async function () {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4#file-bot-test-js-L1";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```js\nconsole.log(\"hello-rev\")\n```")
  });

  it("Gist multi-line", async function () {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4#file-bot-test-py-L1-L2";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```py\nprint(\"test-rev\")\nprint(\"test2\")\n```")
  });

  it("Gist revison single line", async function () {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4/3a556c88296c5ba796a8f464f3838970d689c9fd#file-bot-test-js-L1";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```js\nconsole.log(\"hello\")\n```")
  });

  it("Gist revision multi-line", async function () {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4/3a556c88296c5ba796a8f464f3838970d689c9fd#file-bot-test-py-L1-L2";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```py\nprint(\"test\")\nprint(\"test2\")\n```")
  });

  it("Gist revision multi-line with tilde", async function () {
    const url = "https://gist.github.com/diogoscf/6878f91e9d5250f0a89518f0301ae1a4/3a556c88296c5ba796a8f464f3838970d689c9fd#file-bot-test-py-L1~L2";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```py\nprint(\"test\")\nprint(\"test2\")\n```")
  });

  it("Gitlab single line", async function () {
    const url = "https://gitlab.com/diogoscf/github-lines-test/-/blob/master/test.txt#L3";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```txt\nyeet\n```")
  });

  it("Gitlab multi-line", async function () {
    const url = "https://gitlab.com/diogoscf/github-lines-test/-/blob/master/test.txt#L1-2";
    const snippet = await handleMessage(new MockMessage(url))
    expect(snippet).to.equal("```txt\nLorem ipsum\nidk what I'm doing\n```")
  });
})

bot.on("ready", () => run())

setTimeout(() => bot.destroy(), 10000); // 10s should be enough
