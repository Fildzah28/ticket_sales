module.exports = (sequelize, DataTypes) => {
    const Diskon = sequelize.define("diskon", {
        diskonID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        eventID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        nama_diskon: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        nominal: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: "diskon",
        timestamps: false
    });

    // Relasi ke tabel event
    Diskon.associate = (models) => {
        Diskon.belongsTo(models.event, {
            foreignKey: "eventID",
            as: "diskonEvent"
        });
    };

    return Diskon;
};