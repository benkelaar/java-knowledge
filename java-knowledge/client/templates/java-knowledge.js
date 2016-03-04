function isShown(name) {
  return () => _.contains(UserSettings.selectedShown(), name);
}

function preSelect(settingName, toSelector) {
  return function () {
    var selected = UserSettings[settingName]();
    if (selected.length) {
      this.$(toSelector(selected)).addClass('selected');
    }
  };
}

function toggle(settingName, valueFromElement) {
  return function (event) {
    var $target = $(event.target),
        selected = UserSettings[settingName](valueFromElement(event.target));
    $target.toggleClass('selected', selected);
  }
}

Template.body.onRendered(() => Meteor.defer(initializeDragula));

Template.body.helpers({
  showLabels: isShown('labels'),
  showGroups: isShown('group'),
  showSkills: isShown('skills')
});

Template.menu.events({
  'click .toggle': toggle('toggleShown', target => target.id)
});

Template.menu.onRendered(preSelect('selectedShown',
  selected => '#' + selected.join(',#')
));

Template.labels.helpers({
  labels: () => Labels.find({})
});

Template.labels.events({
  'click .label': toggle('toggleLabel', target => target.dataset.label),
  'click #addLabel img, keyup #addLabel input': addNew(Labels)
});

Template.labels.onRendered(() => {
  preSelect('selectedLabels',
      selected => '#labelList span:contains("' + selected.join('"),#labelList span:contains("') + '")')();
  initializeDragula();
});
