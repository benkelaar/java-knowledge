drake = {destroy: function() {}};

initializeDragula = function () {
  drake.destroy();
  let labelListId       = 'labelList',
      containerSelector = '#' + labelListId + ',td[data-skill],.groupLabels';
  drake = dragula($(containerSelector).toArray(), {
    copy: (el, source) => source.id === labelListId,
    accepts: (el, target) => target.id !== labelListId
  });
  drake.on('drop', (el, t, source) => {
    storeLabels('skill', 'labelSkill', el, t);
    let bonus = $(`[data-skill="${t.dataset.skill}"] [data-label="${el.dataset.label}"]`).get(0);
    if (bonus) bonus.remove();
    if ('skill' in source.dataset) Meteor.call('removeSkillLabel', source.dataset.skill, el.dataset.label);
  })
  drake.on('drop', (el, target) => {
    storeLabels('group', 'labelGroup', el, target);
    $('.new.slot .groupLabels').empty();
  })
  drake.on('over', setParentClass(true));
  drake.on('out', setParentClass(false));

  findContainersChecked(containerSelector);
};

function findContainersChecked(containerSelector) {
  // This is ugly but sometimes necessary
  if (!drake.containers.length) {
    let retries    = 1,
        addContainers = function () {
      let containers = $(containerSelector).toArray();
      if (!containers.length && retries++ < 4) {
        console.log('Still no containers, retrying');
        setTimeout(addContainers, 500);
      } else {
        containers.forEach(function (c) {if (c) drake.containers.push(c);});
      }
    };
    console.log('No containers found yet, retrying');
    setTimeout(addContainers, 500);
  }
}

function storeLabels(dataId, meteorMethod, el, target) {
  if (!target || !(dataId in target.dataset)) return;
  var labels = $(target).children().map((i, e) => e.dataset.label).toArray();
  Meteor.call(meteorMethod, target.dataset, labels, el.dataset.label);
}

function setParentClass(toggleOn) {
  return function (el, target) {
    let $target = $(target);
    if ($target.hasClass('groupLabels')
        && $target.parent().is('.new')) {
      $target.parent().toggleClass('targeted', toggleOn);
    }
  };
}
