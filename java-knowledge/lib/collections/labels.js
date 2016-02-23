Labels = new Mongo.Collection('labels');

Labels.addNew = function (name) {
  var newLabel = {
    name: name,
    colour: Please.make_color({format: 'hex'})
  };

  if (Labels.find({name: name}).count() > 0) {
    console.log('Ignoring new label \'' + name + '\' because it already exists');
    return;
  }

  console.log('Adding new label ' + name + ' with colour: ' + newLabel.colour);
  Labels.insert(newLabel);
}

Labels.toColored = function (labels) {
  return _.map(_.uniq(labels), function (label) {
    var template = Labels.findOne({name: label});
    delete template._id;
    return template;
  });
};
