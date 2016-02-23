Skills = new Mongo.Collection('skills');

Skills.addNew = function (name) {
  var newSkill = {
    name: name,
    what: false,
    how: false,
    when: false,
    labels: []
  };

  if (Skills.find({name: name}).count() > 0) {
    console.log('Ignoring new skill \'' + name + '\' because it already exists');
    return;
  }

  console.log('Adding new skill ' + name);
  Skills.insert(newSkill);
  Meteor.users.find({}).forEach(function (user) {
    newSkill.userId = user._id;
    Skills.insert(newSkill);
  });
}

Skills.setQuestion = function (skill, question, value) {
  var updateFields = {},
      skillToUpdate = Skills.findOne({userId: Meteor.userId(), name: skill});
  updateFields[question] = value;
  Skills.update(skillToUpdate._id, {$set: updateFields});
}

Meteor.methods({
  labelSkill: function(skill, labels) {
    var coloredLabels = Labels.toColored(labels);
    Skills.update({name: skill}, {$set: {labels: coloredLabels}}, {multi: true});
  }
});
