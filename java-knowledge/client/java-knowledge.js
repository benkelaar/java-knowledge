Template.labels.helpers({
  labels: function () {
    return Labels.find({});
  },
  labelCount: function () {
    return Labels.find({}).count();
  }
});
