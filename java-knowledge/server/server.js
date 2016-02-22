Meteor.startup(function () {
  console.log('here it is\n')
  var labels = Labels.find({});
  console.log('labels' + labels.count() + '\n')
  labels.forEach(function (label) {
    console.log(label.name);
  });

  if (Labels.find({}).count() > 1) {
    Labels.remove({});
  }

  if (Labels.find({}).count() < 1) {
    Labels.insert({
      id:     "java8",
      name:   "Java 8",
      colour: "#f1e05a"
    });
  }
});
