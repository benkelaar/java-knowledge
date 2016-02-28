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
  newSlot: []
})

Template.slot.helpers({
  groupScore: function(groupName) {
    console.log(groupName);
    console.log(this);
  }
})

// db.userSettings.update({userId: "aNt5ZiJLARfNX2JDC", groups: {$elemMatch: {name: "Chelsea"}}}, {$addToSet: {'groups.$.slots': 'Java 8'}})
