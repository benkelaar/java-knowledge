Template.skills.helpers({
  skills: function () {
    return Skills.findFiltered();
  },
  score: function () {
    return Skills.calculateScore(Meteor.userId());
  }
});

Template.skills.events({
  'click #addSkill img, keyup #addSkill input': addNew(Skills),
  'click .remover': function (event) {
    var $label = $(event.target).parent(),
        skill = $label.parent()[0].dataset.skill;
    Meteor.call('removeSkillLabel', skill, $label[0].dataset.label);
  },
  'click [type="checkbox"]': function (event) {
    var question = event.target.dataset.question,
        skill    = event.target.dataset.skill,
        value    = event.target.checked;
    Skills.setQuestion(skill, question, value);
  }
});

Template.skills.onRendered(initializeDragula);
