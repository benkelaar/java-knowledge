Template.groups.helpers({
  userGroups: () => UserSettings.userGroups(),
  notInGroup: () => !UserSettings.userGroups().length
});

Template.groups.events({
  'click #addGroup img, keyup #addGroup input': addNew(UserSettings, 'addGroup'),
  'click .remover': function (event) {
    var $label = $(event.target).parent(),
        data   = $label.parent()[0].dataset;
    Meteor.call('removeGroupLabel', data, $label[0].dataset.label);
  }
});

Template.group.helpers({
  newSlot: () => {},
  newSlotNumber() {
    return this.slots.length;
  },
  groupScore(groupName) {
    return Skills.calculateGroupScore(groupName, this);
  }
})
