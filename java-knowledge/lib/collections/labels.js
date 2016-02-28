Labels = new Mongo.Collection('labels');

Labels.addNew = function (name) {
  var newLabel = {
    name: name,
    colour: Please.make_color({format: 'hex'})[0]
  };

  if (Labels.find({name: name}).count() > 0) {
    console.log('Ignoring new label \'' + name + '\' because it already exists');
    return;
  }

  console.log('Adding new label ' + name + ' with colour: ' + newLabel.colour);
  Labels.insert(newLabel);
}

function toColored(labels) {
  return _.map(_.uniq(labels), function (label) {
    var template = Labels.findOne({name: label});
    delete template._id;
    return template;
  });
};

Meteor.methods({
  labelSkill({skill}, labels, newLabel) {
    Skills.update({name: skill}, {$set: {labels: toColored(labels)}}, {multi: true});
  },
  labelGroup({group, slot}, labels, newLabel) {
    UserSettings.update({userId: Meteor.userId()}, )
  }
});
