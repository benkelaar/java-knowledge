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
    // console.log(groupName); // = groupName
    // console.log(this); // = group labels -> Could also be queried if necessary.
    return this.length ? 5 : null;
  }
})

// db.userSettings.update({userId: "aNt5ZiJLARfNX2JDC", groups: {$elemMatch: {name: "Chelsea"}}}, {$addToSet: {'groups.$.slots': 'Java 8'}})
