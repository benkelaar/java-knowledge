UserSettings = new Mongo.Collection('userSettings');

UserSettings.selectedLabels = function () {
  var settings = UserSettings.findOne({userId: Meteor.userId()});
  return settings && settings.selectedLabels ? settings.selectedLabels : [];
};

UserSettings.toggleLabel = function (label) {
  var settings = UserSettings.findOne({userId: Meteor.userId()}),
      selected = settings && _.contains(settings.selectedLabels, label),
      modifier = selected ? '$pull' : '$addToSet',
      update   = {};
  if (!settings) {
    UserSettings.insert({userId: Meteor.userId(), selectedLabels: [label]});
    return true;
  }
  update[modifier] = {selectedLabels: label};
  UserSettings.update({_id: settings._id}, update);
  return !selected;
}
