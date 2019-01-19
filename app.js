// **********  budgetContoller  **********//
var budgetContoller = (function() {

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.precentage = -1;
  };

  var data = {
    allItems: {
      inc: [],
      exp: []
    },
    budgets: {
      delta: 0,
      inc: 0,
      exp: 0,
      expPrecentage: -1
    }
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(curr) {
      sum += curr.value;
    });
    data.budgets[type] = sum;
  };

  var calculatePercentage = function(exp) {
    var precentage;
    if(data.budgets['inc'] > 0) {
      precentage = Math.round(exp / data.budgets['inc'] * 100);
    } else {
      precentage = -1;
    }
    return precentage;

  };

  return {
    addItem: function(type, des, val) {
      var newItem, index;
      /*  ID [0, 1, 2, 3, 4]  => 5
          ID [1, 5, 8, 9]  => 10
      */
      if(data.allItems[type].length > 0) {
        index = data.allItems[type][data.allItems[type].length-1].id + 1;
      } else {
        index = 0;
      }

      if(type === 'inc') {
        newItem = new Income(index, des, val);
      } else if (type === 'exp') {
        newItem = new Expense(index, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function(type,id) {
      var idArr, index;

      idArr = data.allItems[type].map(function(curr){
        return curr.id;
      });

      index = idArr.indexOf(id);
      if(index != -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      calculateTotal('inc');
      calculateTotal('exp');
      data.budgets['delta'] = data.budgets['inc'] - data.budgets['exp'];

      data.budgets['expPrecentage'] = calculatePercentage(data.budgets['exp']);
    },

    calculateExpensePresentages: function() {
      data.allItems['exp'].forEach(function(curr){
        curr.precentage = calculatePercentage(curr.value);
      });
    },

    getBudget: function() {
      return {
        budgetDelta: data.budgets['delta'],
        totalInc: data.budgets['inc'],
        totalExp: data.budgets['exp'],
        totalExpPrecentage: data.budgets['expPrecentage']
      }
    },

    getExpenses: function() {
      return data.allItems['exp'];
    }

  };


}) ();

// **********  UIController  **********//
var UIController = (function() {

  var DOMelements = {
    addType: '.add__type',
    addDescription: '.add__description',
    addValue: '.add__value',
    addBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetDelta: '.budget__value',
    totalIncome: '.budget__income--value',
    totalExpenses: '.budget__expenses--value',
    totalExpPrecentage: '.budget__expenses--percentage',
    container: '.container',
    containerItem: '.item.clearfix',
    expPrecentageLabel: '.item__percentage',
    MonthLabel: '.budget__title--month'
  };

  var formatNumber = function(value, type) {
    var formatedValue = value.toLocaleString(undefined,
                         {minimumFractionDigits: 2, maximumFractionDigits: 2} );
    if(type === 'inc') {
      formatedValue = '+ ' + formatedValue;
    } else if(type === 'exp') {
      formatedValue = '- ' + formatedValue;
    } else if(type === 'delta') {
      if(value > 0) formatedValue = '+ ' + formatedValue;
    }
    return formatedValue;
  };

  var nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++ {
      callback(list[i], i);
    }
  };

  return {
    getDOMelements: function() {
      return DOMelements;
    },

    getInput: function() {
      return {
        inputType: document.querySelector(DOMelements.addType).value, // inc or exp
        inputDescription: document.querySelector(DOMelements.addDescription).value,
        inputValue: parseFloat(document.querySelector(DOMelements.addValue).value)
      }
    },

    addListItem: function(obj, type) {
      var locator, html, newHtml;

      if(type === 'inc') {
        locator = DOMelements.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if(type === 'exp') {
        locator = DOMelements.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      document.querySelector(locator).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(itemId) {
      var el = document.getElementById(itemId);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMelements.addDescription + ', ' + DOMelements.addValue);
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(curr) {
        curr.value = '';
      });
      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {
      document.querySelector(DOMelements.budgetDelta).textContent = formatNumber(obj.budgetDelta, 'delta');
      document.querySelector(DOMelements.totalIncome).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMelements.totalExpenses).textContent = formatNumber(obj.totalExp, 'exp');

      if(obj.totalExpPrecentage > 0) {
        document.querySelector(DOMelements.totalExpPrecentage).textContent = obj.totalExpPrecentage + '%';
      } else {
        document.querySelector(DOMelements.totalExpPrecentage).textContent = '---';
      }
    },

    displayPercentages: function(obj) {
      var elementList = document.querySelectorAll(DOMelements.expPrecentageLabel);

      nodeListForEach(elementList, function(curr, index) {
          if(obj[index].precentage > 0) {
            curr.textContent = obj[index].precentage + '%';
          } else{
            curr.textContent = '---';
          }
      });

      // for(var i = 0; i < elementList.length; i++) {
      //   if(obj[i].precentage > 0) {
      //     elementList[i].textContent = obj[i].precentage + '%';
      //   } else{
      //     elementList[i].textContent = '---';
      //   }
      // }
    },

    setMonth: function() {
      var now = new Date();
      var currYear = now.getFullYear();
      var currMonth = now.toLocaleString("en-nz", { month: "long" });
      document.querySelector(DOMelements.MonthLabel).textContent = currMonth + ' ' + currYear;
    },

    changedType: function() {
      document.querySelector(DOMelements.addType).classList.toggle('red-focus');
      document.querySelector(DOMelements.addDescription).classList.toggle('red-focus');
      document.querySelector(DOMelements.addValue).classList.toggle('red-focus');
      document.querySelector(DOMelements.addBtn).classList.toggle('red');
    }

  };

})();


// **********  AppController  **********//
var AppController = (function(budgetCtrl, UICtrl) {

  var DOMelements = UICtrl.getDOMelements();

  var setupEventListeners = function() {
    document.querySelector(DOMelements.addBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event) {
      if(event.keyCode === 13 || event.which === 13 ) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOMelements.container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(DOMelements.addType).addEventListener('change',UICtrl.changedType);

  };

  var ctrlAddItem = function() {
    // 1. Get the fields input data
    var inputData = UICtrl.getInput();

    if(inputData.inputDescription.length > 0 && inputData.inputValue > 0) {
      // 2. Add the item to the budgetCtrl
      var newItem = budgetCtrl.addItem(inputData.inputType, inputData.inputDescription, inputData.inputValue);
      // 3. Add the item to UI
      UICtrl.addListItem(newItem, inputData.inputType);
      // 4. Clear the input fields
      UICtrl.clearFields();
      // 5. Calculate and update budget
      updateBudget();
      // 6. Calculate and update each expense precentage
      updatePercentages();
    }

  };

  var ctrlDeleteItem = function(event) {
    var itemId, type, id;
    itemId = event.target.closest(DOMelements.containerItem).id;
    if(itemId) {  // income-1  expense-0
      // 1. Delete from budgetCtrl data type
      type = itemId.split('-')[0];
      id = parseInt(itemId.split('-')[1]);
      type === 'income' ? type = 'inc' : type = 'exp';
      budgetCtrl.deleteItem(type, id);
      // 2. Update budget
      updateBudget();
      // 3. Delete from UICtrl
      UICtrl.deleteListItem(itemId);
      // 4. Calculate and update each expense precentage
      updatePercentages();
    }


  };

  var updateBudget = function() {
    budgetCtrl.calculateBudget();
    var budgetData = budgetCtrl.getBudget();
    UICtrl.displayBudget(budgetData);
  };

  var updatePercentages = function () {
    // 1. calculatePercentages in budgetCtrl
    budgetCtrl.calculateExpensePresentages();
    // 2. getPercentage
    var updatedExp = budgetCtrl.getExpenses();

    if(updatedExp.length > 0) {
      // 3. displayPercentages to UICtrl
      UICtrl.displayPercentages(updatedExp);
    }
  };

  return {
    init: function() {
      console.log('Application has started.')
      setupEventListeners();
      updateBudget(); // set all to 0
      UICtrl.setMonth();

    }

  };

})(budgetContoller, UIController);

AppController.init();
