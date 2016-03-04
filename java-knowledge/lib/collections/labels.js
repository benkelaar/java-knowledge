Labels = new Mongo.Collection('labels');

Labels.addNew = function (name) {
  var newLabel = {
    name: name,
    colour: Please.make_color({format: 'hex'})[0]
  };

  if (Labels.find({name}).count() > 0) {
    console.log('Ignoring new label \'' + name + '\' because it already exists');
    return;
  }

  console.log('Adding new label ' + name + ' with colour: ' + newLabel.colour);
  Labels.insert(newLabel);
}

function toColoreds(labels) {
  return _.map(_.uniq(labels), function (label) {
    var template = Labels.findOne({name: label});
    delete template._id;
    return template;
  });
};

function modifySlot(group, slot, label, modify) {
  let cLabel  = toColored(label),
      current = UserSettings.findOne({userId: Meteor.userId()});
  current.groups.forEach(function (value, i) {
    if (value.name === group) {
      modify(value.slots, slot, cLabel);
    }
  });
  UserSettings.update({userId: Meteor.userId()}, current);
}

var toColored = label => toColoreds([label])[0];

Meteor.methods({
  labelSkill({skill}, labels, newLabel) {
    Skills.update({name: skill}, {$set: {labels: toColoreds(labels)}}, {multi: true});
  },
  removeSkillLabel(skill, label) {
    Skills.update({name: skill}, {$pull: {labels: toColored(label)}}, {multi: true});
  },
  labelGroup({group, slot}, labels, newLabel) {
    function modify(slots, nr, cLabel) {
      var slotArray = slots[nr];
      if (!slotArray) slotArray = [];
      slotArray.push(cLabel);
      slots[nr] = slotArray;
    }
    modifySlot(group, slot, newLabel, modify);
  },
  removeGroupLabel({group, slot}, label) {
    modifySlot(group, slot, label,
      (slots, nr, cLabel) => {
        if (slots[nr].length == 1) {
          if (slots[nr][0].name == cLabel.name) {
            let lastIndex = slots.length - 1,
                last      = slots[lastIndex];
            delete slots[nr];
            if (nr != lastIndex) {
              delete slots[lastIndex];
              slots[nr] = last;
            }
          }
        } else {
          slots[nr] = _.filter(slots[nr], v => v.name != cLabel.name);
        }
      }
    );
  }
});

// db.userSettings.update({userId: "aNt5ZiJLARfNX2JDC", groups: {$elemMatch: {name: "Chelsea"}}}, {$addToSet: {'groups.$.slots': 'Java 8'}})
