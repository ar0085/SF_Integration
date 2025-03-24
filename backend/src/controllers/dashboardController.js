const jsforce = require("jsforce");
const { decrypt } = require("../utils/crypto");

exports.getAccounts = async (req, res) => {
  console.log("getAccounts", {
    sfAccessToken: req?.session?.sfAccessToken,
  });
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  console.log("🔎 Incoming cookies:", req.cookies);

  const sfAccessToken = decrypt(req.cookies.sfAccessToken);
  const sfInstanceUrl = decrypt(req.cookies.sfInstanceUrl);

  if (!sfAccessToken || !sfInstanceUrl) {
    console.error(
      "❌ Unauthorized: Missing Salesforce access token in cookies."
    );
    return res
      .status(401)
      .json({ message: "Unauthorized: Please log in to Salesforce." });
  }

  try {
    const conn = new jsforce.Connection({
      accessToken: sfAccessToken,
      instanceUrl: sfInstanceUrl,
    });

    const queryStr = `SELECT Id, Name, Type, Industry FROM Account ORDER BY CreatedDate LIMIT ${limitNum} OFFSET ${offset}`;

    const result = await conn.query(queryStr);

    return res.json({
      totalSize: result.totalSize,
      done: result.done,
      records: result.records,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching accounts from Salesforce." });
  }
};
