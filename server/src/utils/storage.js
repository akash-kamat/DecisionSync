// Simple in-memory store, can be replaced with a flat file or DB
let decisions = [];

exports.storeDecision = (decision) => {
  decisions.push({ ...decision, created: new Date().toISOString() });
};

exports.getAllDecisions = () => decisions.slice().reverse();