import Expert from "../models/Expert.js";

// GET /experts - with pagination + filter
export const getExperts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const total = await Expert.countDocuments(query);
    const experts = await Expert.find(query)
      .select("-slots")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      experts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /experts/:id
export const getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ message: "Expert not found" });
    res.json(expert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};