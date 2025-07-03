const eligibilityModel = require('../models/eligibilityModel');

// kiểm tra đủ điều kiện hiến máu
exports.checkEligibility = async (req, res) => {
  const { donor_id, date } = req.query;

  try {
    const result = await eligibilityModel.checkEligibility(donor_id, date);

    if (!result.eligible) {
      return res.json({
        eligible: false,
        nextDate: result.nextDate,
        message: `Người hiến chưa đủ điều kiện, có thể hiến lại từ ${new Date(result.nextDate).toLocaleDateString('vi-VN')}`
      });
    }

    res.json({
      eligible: true,
      message: "Người hiến đủ điều kiện hiến máu"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
