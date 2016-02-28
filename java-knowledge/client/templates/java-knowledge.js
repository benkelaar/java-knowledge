function isShown(name) {
  return function() {
    return _.contains(UserSettings.selectedShown(), name);
  }
}

function preSelect(settingName, toSelector) {
  return function () {
    var selected = UserSettings[settingName]();
    if (selected.length) {
      this.$(toSelector(selected))
          .addClass('selected');
    }
  };
}

function toggle(settingName, valueFromElement) {
  return function (event) {
    var $target = $(event.target),
        selected = UserSettings[settingName](valueFromElement($target));
    $target.toggleClass('selected', selected);
  }
}

Template.body.onRendered(function () {
  Meteor.defer(initializeDragula);
});

Template.body.helpers({
  showLabels: isShown('labels'),
  showGroups: isShown('group'),
  showSkills: isShown('skills')
});

Template.menu.events({
  'click .toggle': toggle('toggleShown', function ($target) {
    return $target[0].id;
  })
});

Template.menu.onRendered(preSelect('selectedShown', function (selected) {
  return '#' + selected.join(',#')
}));

Template.labels.helpers({
  labels: function () {
    return Labels.find({});
  }
});

Template.labels.events({
  'click .label': toggle('toggleLabel', function ($target) {
    return $target.text();
  }),
  'click #addLabel img, keyup #addLabel input': addNew(Labels),
  'click #dragula': initializeDragula
});

Template.labels.onRendered(preSelect('selectedLabels', function (selected) {
  return 'span:contains("' + selected.join('"),span:contains("') + '")';
}));
