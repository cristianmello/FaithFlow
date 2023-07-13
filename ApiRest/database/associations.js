const Member = require('../models/Member');
const Role = require('../models/Role');
const Church = require('../models/Church');
const Treasury = require('../models/Treasury');
const Meeting = require('../models/Meeting');
const SpecialTask = require('../models/SpecialTask');
const Task = require('../models/Task');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const database = require('./connection');
const { DataTypes } = require('sequelize');
const TypeTreasury = require('../models/TypeTreasury');



const MemberRole = database.define('MemberRole', {}, {
    timestamps: false
});
Member.belongsToMany(Role, { through: MemberRole, foreignKey: "member_code" });
Role.belongsToMany(Member, { through: MemberRole, foreignKey: "role_code" });

Church.hasMany(Member, { as: "member", foreignKey: "church_code" });
Member.belongsTo(Church, { as: "church", foreignKey: "church_code" });

Church.hasMany(TypeTreasury, { as: "TypeTreasury", foreignKey: "church_code" });
TypeTreasury.belongsTo(Church, { as: "church", foreignKey: "church_code" });

TypeTreasury.hasMany(Treasury, { as: "Treasury", foreignKey: "TypeTreasury_code" });
Treasury.belongsTo(TypeTreasury, { as: "TypeTreasury", foreignKey: "TypeTreasury_code" });

//Member.hasMany(Treasury, { as: "treasury", foreignKey: "member_code" });
//Treasury.belongsTo(Member, { as: "member", foreignKey: "member_code" });


Church.hasMany(Meeting, { as: "meeting", foreignKey: "church_code" });
Meeting.belongsTo(Church, { as: "church", foreignKey: "church_code" });

const MemberMeeting = database.define('MemberMeeting', {}, {
    timestamps: false
});
Member.belongsToMany(Meeting, { through: MemberMeeting, foreignKey: "member_code" });
Meeting.belongsToMany(Member, { through: MemberMeeting, foreignKey: "meeting_code" });

const MemberSpecialTask = database.define('MemberSpecialTask', {}, {
    timestamps: false
});
Member.belongsToMany(SpecialTask, { through: MemberSpecialTask, foreignKey: "member_code" });
SpecialTask.belongsToMany(Member, { through: MemberSpecialTask, foreignKey: "specialTask_code" });

Member.hasMany(Task, { as: "task", foreignKey: "member_code" });
Task.belongsTo(Member, { as: "member", foreignKey: "member_code" });

Task.hasMany(Question, { as: "question", foreignKey: "task_code" });
Question.belongsTo(Task, { as: "task", foreignKey: "task_code" });

Question.hasMany(Answer, { as: "answer", foreignKey: "question_code" });
Answer.belongsTo(Question, { as: "question", foreignKey: "question_code" });



