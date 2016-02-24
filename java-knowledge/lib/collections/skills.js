Skills = new Mongo.Collection('skills');

function createFilteredQuery() {
  var selectedLabels = UserSettings.selectedLabels(),
      query = {userId: Meteor.userId()};
  if (selectedLabels.length) {
    query.labels = { $elemMatch: { name: { $in: selectedLabels } } }
  }
  return query;
}

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
};

Skills.findFiltered = function () {
  return Skills.find(createFilteredQuery());
}

Skills.setQuestion = function (skill, question, value) {
  var updateFields = {},
      skillToUpdate = Skills.findOne({userId: Meteor.userId(), name: skill});
  updateFields[question] = value;
  Skills.update(skillToUpdate._id, {$set: updateFields});
};

Meteor.methods({
  labelSkill: function(skill, labels) {
    var coloredLabels = Labels.toColored(labels);
    Skills.update({name: skill}, {$set: {labels: coloredLabels}}, {multi: true});
  }
});

Skills.calculateScore = function (userId) {
  function count(column) {
    var query = createFilteredQuery();
    query[column] = true;
    return Skills.find(query).count();
  }
  var whatScore = count('what'),
      howScore  = count('how')  * 2,
      whenScore = count('when') * 3;
  return whatScore + howScore + whenScore;
};
