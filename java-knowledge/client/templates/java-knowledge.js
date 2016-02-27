function initializeDragula() {
  console.log('Initializing Dragula');
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

addNew = function (id, collection) {
  return function () {
    var newValue = $('#' + id + ' input').val();
    if (newValue) collection.addNew(newValue);
  }
};

Template.body.onRendered(function () {
  Meteor.defer(initializeDragula);
});

Template.body.helpers({
  showSkills: function() {
    var settings = UserSettings.findOne({userId: Meteor.userId()});
    return settings && settings.shown === 'skills';
  },
  showGroups: function() {
    var settings = UserSettings.findOne({userId: Meteor.userId()});
    return settings && settings.shown === 'groups';
  }
});

Template.menu.helpers({
  showIcon: function() {
    var settings = UserSettings.findOne({userId: Meteor.userId()});
    return settings && settings.shown === 'skills' ? 'group' : 'user';
  }
});

Template.menu.events({
  'click #toggle': UserSettings.toggleShown
});

Template.labels.helpers({
  labels: function () {
    return Labels.find({});
  }
});

Template.labels.events({
  'click .label': function (event) {
    var label = $(event.target),
        selected = UserSettings.toggleLabel(label.text());
    label.toggleClass('selected', selected);
  },
  'click #addLabel img': addNew('addLabel', Labels),
  'click #dragula': initializeDragula
});

Template.labels.onRendered(function () {
  var selected = UserSettings.selectedLabels();
  if (selected.length) {
    this.$('span:contains("' + selected.join('"),span:contains("') + '")')
        .addClass('selected');
  }
});
