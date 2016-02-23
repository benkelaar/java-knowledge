Template.page.onRendered(function () {
  var labelListId = 'labelList';

  function isLabelList(el, interactee) {
    return interactee.id === labelListId
  }

  function isNotLabelList(el, interactee) {
    return !isLabelList(el, interactee);
  }

  Meteor.defer(function () {
    dragula($('#' + labelListId + ', td.skillLabels').toArray(), {
      copy: isLabelList,
      accepts: isNotLabelList,
      removeOnSpill: isNotLabelList
    });
  });
});

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
        skill    = event.target.dataset.skill,
        value    = event.target.checked;
    Skills.setQuestion(skill, question, value);
  }
});
