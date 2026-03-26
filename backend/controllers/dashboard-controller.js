const Visitor = require("../models/visitor")
const Log = require("../models/log")
const { Parser } = require("json2csv");
exports.getStatics = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const now = new Date();

    const totalVisits = await Log.countDocuments();

    const todayCheckIns = await Log.countDocuments({
      checkInTime: { $gte: todayStart, $lte: now }
    });

    const todayCheckOuts = await Log.countDocuments({
      checkOutTime: { $gte: todayStart, $lte: now }
    });

    const activeVisitors = await Log.countDocuments({
      checkInTime: { $exists: true },
      checkOutTime: { $exists: false }
    });

    res.json({
      totalVisits,
      todayCheckIns,
      todayCheckOuts,
      activeVisitors
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getReport = async (req, res) => {
  try {
    const { search, fromDate, toDate, status } = req.query;

    let query = {};
    if (fromDate && toDate) {
      query.checkInTime = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      };
    }
    if (status === "inside") {
      query.checkOutTime = { $exists: false };
    } else if (status === "checkedout") {
      query.checkOutTime = { $exists: true };
    }

    let logs = await Log.find(query)
      .populate({
        path: "visitorId",
        select: "name email"
      })
      .populate({
        path: "passId",
        select: "status"
      })
      .sort({ createdAt: -1 });
    if (search) {
      const s = search.toLowerCase();

      logs = logs.filter(log =>
        log.visitorId &&
        (
          log.visitorId.name?.toLowerCase().includes(s) ||
          log.visitorId.email?.toLowerCase().includes(s)
        )
      );
    }

    res.json(logs);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJson = async (req, res) => {
  try {
    const data = await Log.find().populate("visitorId");

    const fields = ["visitorId.name", "visitorId.email", "status", "validFrom"];
    const parser = new Parser({ fields });

    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};