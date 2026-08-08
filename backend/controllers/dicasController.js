const { Dica } = require('../models/dica');

// get all dica
exports.getAllDica = async (req, res) => {
  try {
    const allDica = await Dica.findAll();
    res.status(200).json({ message: 'All Dica retrieved successfully', dica: allDica });
  } catch (error) {
    console.error('Error getting all Dica:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//get Dica by id
exports.getDicaById = async (req, res) => {
    try {
      const dicaID = req.params.idDica;
      const dica = await Dica.findByPk(dicaID);
  
      if (!dica) {
        return res.status(404).json({ message: 'Dica not found' });
      }
  
      res.status(200).json({ message: 'Dica retrieved successfully', dica });
    } catch (error) {
      console.error('Error getting Dica by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// create Dica
exports.createDica = async (req, res) => {
    try {
        const { Title, Content, Type, Author, Level, IsPremium } = req.body;

        // Check if a Dica with the same title already exists
        const existingDica = await Dica.findOne({
            where: {
                Title: Title,
            },
        });

        if (existingDica) {
            return res.status(400).json({ message: 'Dica with the same title already exists' });
        }

        const currentDate = new Date();
        const newDica = await Dica.create({
            Title,
            Content,
            Type,
            Author,
            Level,
            Date: currentDate,
            IsPremium,
        });

        res.status(201).json({ message: 'Dica created successfully', dica: newDica });
    } catch (error) {
        console.error('Error creating Dica:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.updateDica = async (req, res) => {
  try {
    const { Title, Content, Type, Date, Author, Level, IsPremium } = req.body;
    const dicaID = req.params.id;

    const dica = await Dica.findOne({
      where: { DicaID: dicaID },
    });

    if (!dica) {
      return res.status(404).json({ message: "Dica not found" });
    }

    const updateFields = {};

    if (Title !== undefined) updateFields.Title = Title;
    if (Content !== undefined) updateFields.Content = Content;
    if (Type !== undefined) updateFields.Type = Type;
    if (Date !== undefined) updateFields.Date = Date;
    if (Author !== undefined) updateFields.Author = Author;
    if (Level !== undefined) updateFields.Level = Level;
    if (IsPremium !== undefined) updateFields.IsPremium = IsPremium;

    await Dica.update(updateFields, { where: { DicaID: dicaID } });

    res.status(200).json({ message: "Dica updated successfully" });
  } catch (error) {
    console.error("Error updating Dica:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// delete Dica
exports.deleteDica = async (req, res) => {
    try {
      const dicaID = req.params.idDica;
      const deletedDica = await Dica.destroy({
        where: { DicaID: dicaID },
      });
  
      if (!deletedDica) {
        return res.status(404).json({ message: 'Dica not found' });
      }
  
      res.status(200).json({ message: 'Dica deleted successfully' });
    } catch (error) {
      console.error('Error deleting Dica:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };