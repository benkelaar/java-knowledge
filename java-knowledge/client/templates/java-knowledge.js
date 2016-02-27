addNew = function (id, collection) {
  return function () {
    var newValue = $('#' + id + ' input').val();
    if (newValue) collection.addNew(newValue);
  }
};

function initializeDragula() {
  console.log('Initializing Dragula');
  var labelListId = 'labelList';

  function isLabelList(el, interactee) {
    return interactee.id === labelListId;
  }

  function isNotLabelList(el, interactee) {
    return !isLabelList(el, interactee);
  }

  dragula($('#' + labelListId + ', td[data-skill]').toArray(), {
    copy: isLabelList,
    accepts: isNotLabelList
  }).on('drop', function (el, target) {
    if (!target) return;
    var skill  = target.dataset.skill,
        labels = $(target).children().map(function (i, e) {
      return $(e).text();
    }).toArray();
    Meteor.call('labelSkill', skill, labels);
  });
}

function isShown(name) {
  return function() {
    return _.contains(UserSettings.selectedShown(), name);
  }
}

function preSelect(settingName, toSelector) {
  return function () {
    var selected = UserSettings[settingName]();
    if (selected.length) {
      this.$(toSelector(selected))
          .addClass('selected');
    }
  };
}

function toggle(settingName, valueFromElement) {
  return function (event) {
    var $target = $(event.target),
        selected = UserSettings[settingName](valueFromElement($target));
    $target.toggleClass('selected', selected);
  }
}

Template.body.onRendered(function () {
  Meteor.defer(initializeDragula);
});

Template.body.helpers({
  showLabels: isShown('labels'),
  showGroups: isShown('group'),
  showSkills: isShown('skills')
});

Template.menu.events({
  'click .toggle': toggle('toggleShown', function ($target) {
    return $target[0].id;
  })
});

Template.menu.onRendered(preSelect('selectedShown', function (selected) {
  return '#' + selected.join(',#')
}));

Template.labels.helpers({
  labels: function () {
    return Labels.find({});
  }
});

Template.labels.events({
  'click .label': toggle('toggleLabel', function ($target) {
    return $target.text();
  }),
  'click #addLabel img': addNew('addLabel', Labels),
  'click #dragula': initializeDragula
});

Template.labels.onRendered(preSelect('selectedLabels', function (selected) {
  return 'span:contains("' + selected.join('"),span:contains("') + '")';
}));
