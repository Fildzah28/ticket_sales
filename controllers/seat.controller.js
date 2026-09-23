const { seat } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const data = await seat.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await seat.findByPk(req.params.id);

    if (!data)
      return res.status(404).json({ message: "Seat tidak ditemukan" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await seat.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await seat.findByPk(req.params.id);

    if (!data)
      return res.status(404).json({ message: "Seat tidak ditemukan" });

    await data.update(req.body);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await seat.findByPk(req.params.id);

    if (!data)
      return res.status(404).json({ message: "Seat tidak ditemukan" });

    await data.destroy();

    res.json({ message: "Seat berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};