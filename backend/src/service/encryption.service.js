const crypto = require("crypto");


exports.generateSecureRandomToken = async () => {
  return this.randomValueBase64(32);
};

exports.randomValueBase64 = async (length) => {
  return crypto
      .randomBytes(Math.ceil((length * 3) / 4))
      .toString("base64")
      .slice(0, length)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
};

exports.hashValue = async (valueToHash, base) => {
  if (typeof base === "undefined" || !base) {
      base = "hex";
  } else if (base != "hex" && base != "base64") {
      base = "hex";
  }

  valueToHash = "" + valueToHash;

  // Hash the value
  let shaHash = crypto.createHash("sha256");
  shaHash.update(valueToHash);
  let hash = shaHash.digest(base);

  if (base == "base64") {
      hash = hash
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");
  }

  return hash;
};