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
