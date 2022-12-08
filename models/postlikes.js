"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Postlikes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Users, {
                foreignKey: "userId",
            });
            this.belongsTo(models.Posts, {
                foreignKey: "postId",
            });
        }
    }
    Postlikes.init(
        {
            postlikeId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "userId",
                },
                onDelete: "CASCADE",
                allowNull: false,
            },
            postId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Posts",
                    key: "postId",
                },
                onDelete: "CASCADE",
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "Postlikes",
        }
    );
    return Postlikes;
};
