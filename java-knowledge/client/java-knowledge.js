Template.labels.helpers({
  labels: function () {
    return Labels.find({});
  },
});

Template.skills.helpers({
  skills: function () {
    return Skills.find({userId: Meteor.userId()});
  }
});

Template.skills.events({
  'click #addSkill': function () {
    Skills.addNew($('#newSkill').val());
  },
  'click [type="checkbox"]': function (event) {
    var question = event.target.dataset.question,
        skill    = event.target.name
        value    = event.target.checked;
    Skills.setQuestion(skill, question, value);
  }
});
