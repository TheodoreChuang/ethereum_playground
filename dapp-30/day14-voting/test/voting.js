const { expectRevert, time } = require("@openzeppelin/test-helpers");
const Voting = artifacts.require("Voting");

contract("Voting", accounts => {
  const admin = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const voter3 = accounts[3];
  const nonVoter = accounts[4];

  let voting = null;
  beforeEach(async () => {
    voting = await Voting.new();
  });

  describe("addVoters()", () => {
    it("should add voters to approved list", async () => {
      await voting.addVoters([voter1, voter2, voter3]);

      const results = await Promise.all([voter1, voter2, voter3].map(v => voting.voters(v)));
      results.forEach(result => assert(result === true));
    });
  });

  describe("createBallot()", () => {
    it("should create a new ballot", async () => {
      await voting.createBallot("B0", ["C1", "C2", "C3"], 5, { from: admin });

      const ballot = await voting.ballots(0);
      assert(ballot.name === "B0");
      // assert(ballot.choices.map(c => c.name) === ["C1", "C2", "C3"]);
    });
    it("should not create a new ballot if not admin", async () => {
      await expectRevert(voting.createBallot("B not admin", ["C1", "C2", "C3"], 5, { from: voter1 }), "Not authorized");
    });
  });

  describe("vote()", () => {
    beforeEach(async () => {
      await voting.addVoters([voter1, voter2, voter3]);
    });

    it("should not be able to vote if not an approved voter", async () => {
      await voting.createBallot("B0", ["C1", "C2", "C3"], 5, { from: admin });

      const ballot = await voting.ballots(0);
      assert(ballot.name === "B0");
      await expectRevert(voting.vote(0, 0, { from: nonVoter }), "Only approved voters can vote");
    });
    it("should not be able to vote if the ballot has ended", async () => {
      await voting.createBallot("B0", ["C1", "C2", "C3"], 5, { from: admin });

      await time.increase(6);
      await expectRevert(voting.vote(0, 0, { from: voter1 }), "Voting has ended");
    });
    it("should not be able to vote twice", async () => {
      await voting.createBallot("B0", ["C1", "C2", "C3"], 99, { from: admin });
      await voting.vote(0, 0, { from: voter1 });

      await expectRevert(voting.vote(0, 0, { from: voter1 }), "Already voted");
    });
    it("should be able to vote", async () => {
      await voting.createBallot("B0", ["C1", "C2", "C3"], 5, { from: admin });

      await voting.vote(0, 0, { from: voter1 });
      await voting.vote(0, 0, { from: voter2 });
      await voting.vote(0, 1, { from: voter3 });

      await time.increase(6);
      const results = await voting.results(0);
      assert(results[0].votes === "2");
      assert(results[1].votes === "1");
      assert(results[2].votes === "0");
    });
    it("should not be able to view results before vote has ended", async () => {
      await voting.createBallot("B0", ["C1", "C2", "C3"], 5, { from: admin });
      await voting.vote(0, 0, { from: voter1 });
      await voting.vote(0, 0, { from: voter2 });
      await voting.vote(0, 1, { from: voter3 });

      await expectRevert(voting.results(0), "Cannot see the results before voting has ended");
    });
  });
});
