Template.groups.helpers({
  userGroups: function () {
    return UserSettings.userGroups();
  },
  notInGroup: function () {
    return !UserSettings.userGroups().length
  }
});

Template.groups.events({
  'click #addGroup img, keyup #addGroup input': addNew(UserSettings, 'addGroup')
});

Template.group.helpers({
  newSlot: function() {
    return {};
  },
  newSlotNumber: function() {
    return this.slots.length;
  },
  groupScore: function(groupName) {
    return Skills.calculateGroupScore(groupName, this);
  }
})
