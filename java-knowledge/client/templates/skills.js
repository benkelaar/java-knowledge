Template.skills.helpers({
  skills: function () {
    return Skills.findFiltered();
  },
  score: function () {
    return Skills.calculateScore(Meteor.userId());
  }
});

Template.skills.events({
  'click #addSkill img': addNew('addSkill', Skills),
  'click [type="checkbox"]': function (event) {
    var question = event.target.dataset.question,
        skill    = event.target.dataset.skill,
        value    = event.target.checked;
    Skills.setQuestion(skill, question, value);
  }
});
