const { Meta_de_poupança} = require('../models/meta');
const { User } = require('../models/user');


exports.getAllMetas = async (req, res) => {
    const UserID = req.userID;
    try {
        const user = await User.findOne({ where: { UserID: UserID } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const metas = await Meta_de_poupança.findAll({
            where: { UserID: UserID },
            order: [
                ['Priority', 'ASC'],
                ['EndDate', 'ASC'],
            ],
        });

        return res.status(200).json({message:"metas:",metas});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.getMetaByID = async (req, res) => {
    const UserID = req.userID;
    const Metaid  = req.params.Metaid;
    try {
        const meta = await Meta_de_poupança.findOne({
            where: { MetaID: Metaid, UserID: UserID }
        });

        if (!meta) {
            return res.status(404).json({ message: 'Meta not found' });
        }

        return res.status(200).json(meta);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


exports.createMeta = async (req, res) => {
    const UserID = req.userID;
    const { Name, StartDate, EndDate, PlannedContribution, CurrentContribution, Description, Priority } = req.body;

    try {
        const user = await User.findOne({ where: { UserID: UserID } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const meta = await Meta_de_poupança.create({
            UserID: UserID,
            Name,
            StartDate,
            EndDate,
            PlannedContribution,
            CurrentContribution,
            Description,
            Priority
        });

        return res.status(201).json(meta);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.updateMeta = async (req, res) => {
    const UserID = req.userID;
    const   Metaid  = req.params.Metaid;
    const {  PlannedContribution, CurrentContribution, Description, Priority } = req.body;

    try {
        const user = await User.findOne({ where: { UserID: UserID } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const meta = await Meta_de_poupança.findOne({
            where: { MetaID: Metaid, UserID: UserID }
        });

        if (!meta) {
            return res.status(404).json({ message: 'Meta not found' });
        }

        await meta.update({
            PlannedContribution,
            CurrentContribution,
            Description,
            Priority
        });

        return res.status(200).json(meta);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


exports.deleteMeta = async (req, res) => {
    const UserID = req.userID;
    const Metaid  = req.params.Metaid;
    try {
        const user = await User.findOne({ where: { UserID: UserID } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const meta = await Meta_de_poupança.findOne({
            where: { MetaID: Metaid, UserID: UserID }
        });

        if (!meta) {
            return res.status(404).json({ message: 'Meta not found' });
        }
        await meta.destroy();
        return res.status(200).send({ message: 'Meta deleted successfully'});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
