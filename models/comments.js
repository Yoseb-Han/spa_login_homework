"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comments extends Model {
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
    Comments.init(
        {
            commentId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
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
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Users",
                    key: "userId",
                },
                onDelete: "CASCADE",
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING,
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
            modelName: "Comments",
        }
    );
    return Comments;
};
