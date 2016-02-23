Meteor.startup(function () {
  console.log('Started up knowledge tracking server');
});

Accounts.onCreateUser(function (options, user) {
  var allSkills = Skills.find({userId: {$exists: false}});
  console.log('Initializing skills for new user \'' + user.emails[0].address +'\'');

  allSkills.forEach(function (skill) {
    skill.userId = user._id;
    delete skill._id;
    Skills.insert(skill);
  });
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  return user;
});
