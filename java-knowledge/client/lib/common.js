addNew = function (collection, settingName) {
  return function (event) {
    if (event.type === 'keyup' && event.keyCode !== 13) return;
    var textElement = $(event.target).parent().find('input'),
        newValue    = textElement.val(),
        setting     = settingName ? settingName : 'addNew';
    if (newValue) collection[setting](newValue);
    textElement.val('');
  };
};

drake = {destroy: function() {}};

initializeDragula = function () {
  function storeLabels(dataId, meteorMethod) {
    return function (el, target) {
      if (!target || !(dataId in target.dataset)) return;
      var labels = $(target).children().map(function (i, e) {
            return $(e).text();
          }).toArray();
      Meteor.call(meteorMethod, target.dataset, labels, $(el).text());
    };
  }

  function setParentClass(toggleOn) {
    return function (el, target) {
      var $target = $(target);
      if ($target.hasClass('groupLabels')
          && $target.parent().is('.new')) {
        $target.parent().toggleClass('targeted', toggleOn);
      }
    };
  }

  if (drake) {
    drake.destroy();
  }

  var labelListId = 'labelList';
  drake = dragula($('#' + labelListId + ',td[data-skill],.groupLabels').toArray(), {
    copy: function (el, source) {
      return source.id === labelListId;
    },
    accepts: function (el, target) {
      return target.id !== labelListId;
    }
  })
  .on('drop', storeLabels('skill', 'labelSkill'))
  .on('drop', storeLabels('group', 'labelGroup'))
  .on('over', setParentClass(true))
  .on('out', setParentClass(false));
};
