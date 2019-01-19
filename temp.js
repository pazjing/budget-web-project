// **********  budgetContoller  **********//
var budgetContoller = (function() {

  var x = 23;

  var add = function(a) {
    return x + a;
  }

  return {
    publicTest: function(b) {
      return add(b);
    }
  };

}) ();

// **********  UIController  **********//
var UIController = (function() {

  var DOMelements = {
    addType: '.add__type',
    addDescription: '.add__description',
    addValue: '.add__description',
    addBtn: '.add__btn'
  }

  return {
    getDOMelements: function() {
      return DOMelements;
    },
  };

})();


// **********  AppController  **********//
var AppController = (function(budgetCtrl, UICtrl) {

  var ctrlAddItem = function() {
    // 1. Get the fields input data
    var inputData = UICtrl.getInput();
    console.log(inputData);

    // 2. Add the item ro the budgetCtrl

    // 3. Add the item to UI

  }

  return {
    init: function() {
      console.log('Application has started.')
      setupEventListeners();
    }

  };

})(budgetContoller, UIController);

AppController.init();
