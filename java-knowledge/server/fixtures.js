if (Labels.find({}).count() === 0) {
  Labels.insert({
    name:   'Java 8',
    colour: '#f1e05a'
  });
}

UserSettings.update({shown: {$exists: false}}, {$set: {shown: 'skills'}}, {multi: true});
