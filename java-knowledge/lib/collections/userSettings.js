UserSettings = new Mongo.Collection('userSettings');

UserSettings.selectedLabels = function () {
  return findSetting('selectedLabels', []);
};

UserSettings.toggleLabel = function (label) {
  toggleColumnValue('selectedLabels', label);
}

UserSettings.selectedShown = function () {
  return findSetting('shown', []);
};

UserSettings.toggleShown = function (name) {
  toggleColumnValue('shown', name);
}

function findSetting(name, defaultValue) {
  var settings = UserSettings.findOne({userId: Meteor.userId()});
  return settings && settings[name] ? settings[name] : defaultValue;
}

function toggleColumnValue(column, value) {
  var settings    = UserSettings.findOne({userId: Meteor.userId()}),
      selected    = settings && _.contains(settings[column], value),
      modifier    = selected ? '$pull' : '$addToSet',
      update      = {},
      columnValue = {};
  if (!settings) {
    insertBaseSettings(column, value)
    return true;
  }
  columnValue[column] = value;
  update[modifier] = columnValue;
  UserSettings.update({_id: settings._id}, update);
  return !selected;
}

function insertBaseSettings(column, value) {
  var settings = {userId: Meteor.userId(), selectedLabels: [], shown: []};
  settings[column] = [value];
  UserSettings.insert(settings);
}
