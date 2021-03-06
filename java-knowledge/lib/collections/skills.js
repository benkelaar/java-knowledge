Skills = new Mongo.Collection('skills');

function calculateScore(baseQuery) {
  function count(column) {
    baseQuery[column] = true;
    return Skills.find(baseQuery).count();
  }
  var whatScore = count('what'),
      howScore  = count('how')  * 2,
      whenScore = count('when') * 3;
  return whatScore + howScore + whenScore;
}

function createUserQuery() {
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
    console.log(`Ignoring new skill ${name} because it already exists`);
    return;
  }

  console.log(`Adding new skill ${name}`);
  Skills.insert(newSkill);
  Meteor.users.find({}).forEach(function (user) {
    newSkill.userId = user._id;
    Skills.insert(newSkill);
  });
};

Skills.findFiltered = function () {
  return Skills.find(createUserQuery());
}

Skills.setQuestion = function (skill, question, value) {
  var updateFields = {},
      skillToUpdate = Skills.findOne({userId: Meteor.userId(), name: skill});
  updateFields[question] = value;
  Skills.update(skillToUpdate._id, {$set: updateFields});
};

Skills.calculateScore = () => calculateScore(createUserQuery());

Skills.calculateGroupScore = function (group, labels) {
  var users = UserSettings.find({groups: {$elemMatch: {name: 'Babylon 5'}}},
      {'userId': true}).map(function (v) {return v.userId}),
      query = {
        userId: { $in: users },
        labels: { $elemMatch: { name: { $in: _.map(labels, v => v.name) } } }
      };
  return calculateScore(query);
};
