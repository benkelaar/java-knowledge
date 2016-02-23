function initializeDragula() {
  var labelListId = 'labelList';

  function isLabelList(el, interactee) {
    return interactee.id === labelListId;
  }

  function isNotLabelList(el, interactee) {
    return !isLabelList(el, interactee);
  }

  dragula($('#' + labelListId + ', td[data-skill]').toArray(), {
    copy: isLabelList,
    accepts: isNotLabelList
  }).on('drop', function (el, target) {
    if (!target) return;
    var skill  = target.dataset.skill,
        labels = $(target).children().map(function (i, e) {
      return $(e).text();
    }).toArray();
    Meteor.call('labelSkill', skill, labels);
  });
}

function addNew(id, collection) {
  return function () {
    var newValue = $('#' + id + ' input').val();
    console.log(newValue);
    if (newValue) collection.addNew(newValue);
  }
}

Template.page.onRendered(function () {
  Meteor.defer(initializeDragula);
});

Template.labels.helpers({
  labels: function () {
    return Labels.find({});
  }
});

Template.labels.events({
  'click #addLabel img': addNew('addLabel', Labels)
});

Template.skills.helpers({
  skills: function () {
    return Skills.find({userId: Meteor.userId()});
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
