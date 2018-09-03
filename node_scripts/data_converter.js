const fs = require("fs");
const readline = require("readline");

const CMD_DEFAULT_LENGTH = 2;

if (process.argv.length < CMD_DEFAULT_LENGTH + 2) {
    console.log('How to use: node data_converter.js [card_data.json] [skill_data.json]');
}

let cardPath = process.argv[CMD_DEFAULT_LENGTH];
let skillPath = process.argv[CMD_DEFAULT_LENGTH + 1];

let cardData = JSON.parse(fs.readFileSync(cardPath));
let skillData = JSON.parse(fs.readFileSync(skillPath));

let cardDataOutput = [];
let skillDataOutput = [];

skillData.data.Skills.forEach(function(currentValue) {
    skillDataOutput.push({
        id: currentValue.SkillId,
        name: currentValue.Name,
        description: currentValue.Desc
    });
});

cardData.data.Cards.forEach(function(currentValue) {
    let skill0 = getSkill(currentValue.Skill);
    let skill5 = getSkill(currentValue.LockSkill1);
    let skill10 = getSkill(currentValue.LockSkill2);

    cardDataOutput.push({
        Id: currentValue.CardId,
        Name: currentValue.CardName,
        Race: getRaceString(currentValue.Race),

        Cost: parseInt(currentValue.Cost),
        EvoCost: currentValue.EvoCost,
        Cooldown: parseInt(currentValue.Wait),

        Skill0: skill0.name,
        Skill0Desc: skill0.description,
        Skill5: skill5.name,
        Skill5Desc: skill5.description,
        Skill10: skill10.name,
        Skill10Desc: skill10.description,
        SkillString: skill0.name + skill5.name + skill10.name,

        subGridOptions: {
            data: getStatArray(currentValue)
        },

        card: currentValue,
        ExpArray: currentValue.ExpArray,
        Image: `https://0eabc54bb140e84b34eb-c97fac0b01f2b85bd280c0b0242e4e49.ssl.cf1.rackcdn.com/20150504loawebtestcdn/public/swf/card/80_80/img_photoCard_${currentValue.CardId}.jpg`
    });
});

skillDataOutput.forEach(function(currentValue) {
    delete currentValue.id;
});

fs.writeFileSync('card_data.json', JSON.stringify(cardDataOutput));
fs.writeFileSync('skill_data.json', JSON.stringify(skillDataOutput));

function getRaceString(raceId) {
    switch(parseInt(raceId)) {
        case 1:
            return 'Kingdom';
        case 2:
            return 'Forest';
        case 3:
            return 'Wilderness';
        case 4:
            return 'Hell';
        case 5:
            return 'undefined';
        case 98:
            return 'Universal Cards';
        case 99:
            return 'Prop';
        case 97:
        case 100:
            return 'Demon';
        default:
            throw new RangeError("Unsupported race ID: " + raceId);
    }
}

function getSkill(skillId) {
    if(!skillId) {
        return { name: '', description: '' };
    }

    skillId = parseInt(skillId);

    let returnObject = skillDataOutput[skillId];

    if(!returnObject || returnObject.id !== skillId) {
        for(let i = 0; i < skillDataOutput.length; ++i) {
            let currentValue = skillDataOutput[i];

            if(currentValue.id === skillId) {
                returnObject = { name: currentValue.name, description: currentValue.description };
                break;
            }
        }

        if(!returnObject) {
            return { name: '', description: '' };
        }
    }

    return returnObject;
}

function getStatArray(card) {
    let statArray = [];

    for(let i = 0; i < card.HpArray.length; ++i) {
        statArray.push({
            Level: i,
            Hp: card.HpArray[i],
            Attack: card.AttackArray[i]
        });
    }

    return statArray;
}