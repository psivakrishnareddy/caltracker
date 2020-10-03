// Storage Controller
const StorageCtrl = (function() {
  console.log("local storage loaded");
  return {
    storeItem: function(item) {
      let Items;
      if (localStorage.getItem("Items") === null) {
        Items = [];
        Items.push(item);
        localStorage.setItem("Items", JSON.stringify(Items));
      } else {
        Items = JSON.parse(localStorage.getItem("Items"));
        Items.push(item);
        localStorage.setItem("Items", JSON.stringify(Items));
      }
      console.log("item added to localStorage");
    },
    getItemsFromStorage: function() {
      let Items;
      if (localStorage.getItem("Items") === null) {
        Items = [];
      } else {
        Items = JSON.parse(localStorage.getItem("Items"));
      }
      return Items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("Items"));
      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
          console.log("storage updated");
        }
      });
      localStorage.setItem("Items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("Items"));
      items.forEach(function(item, index) {
        if (id === item.id) {
          items.splice(index, 1);
          console.log("storage item deleted");
        }
      });
      localStorage.setItem("Items", JSON.stringify(items));
    },
    clearItemFromStorage: function() {
      localStorage.removeItem("Items");
      console.log("Storage Cleared");
    }
  };
})();

// Item Cntroller

const ItemCtrl = (function() {
  const item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // DataStructure / State
  const data = {
    // items: [
    //   // { id: 0, name: "siva dinner", calories: 1200 },
    //   // { id: 1, name: "sreddy dinner", calories: 1200 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    CurrentItem: null,
    totalCalories: 0
  };

  // PUBLIC METHODS
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      console.log(name, calories);
      //CREATE IDS
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories To Number
      calories = parseInt(calories);
      // create a NewItem from Item Contrustor
      newItem = new item(ID, name, calories);
      // add to Item Array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // convert form input to real number
      calories = parseInt(calories);

      let found = null;
      // Find the item in Current id
      data.items.forEach(function(item) {
        if (item.id === data.CurrentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });
      // Get Index
      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.CurrentItem = item;
    },
    getCurrentItem: function() {
      return data.CurrentItem;
    },
    getTotalCalories: function() {
      let total = 0;
      // Loop through items and add ccalories
      data.items.forEach(item => {
        total += item.calories;
      });
      // set total calories into data structure
      data.totalCalories = total;

      //return total calories to app
      return data.totalCalories;
    },
    logData: function() {
      console.log(StorageCtrl.getStoredItems());
      return data;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    backBtn: ".back-btn",
    deleteBtn: ".delete-btn",
    clearBtn: ".clear-btn",
    listItems: "#item-list li",
    itemNameInput: "#item-name",
    itemCalorieInput: "#item-calories",
    totalCalories: ".total-calories"
  };
  // PUBLIC METHODS
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
 <strong>${item.name}: </strong><em>${item.calories} calories</em>
 <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
</li>`;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemsInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCalorieInput).value
      };
    },
    addListItem: function(item) {
      // Show list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create elemt li
      const li = document.createElement("li");
      //add class
      li.className = "collection-item";
      // Add id
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `<strong>${item.name}: </strong><em>${
        item.calories
      } calories</em>
<a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      // insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListitem: function(item) {
      // GET THE LIST FROM THE DOM
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // TURN NODE LIST INTO ARRAY
      listItems = Array.from(listItems);

      // loop
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${
            item.name
          }: </strong><em>${item.calories} calories</em>
    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deleteListItem: function(id) {
      // get id
      const itemID = `#item-${id}`;
      // get item from list
      const item = document.querySelector(itemID);
      //remove
      item.remove();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn node to arraay list
      listItems = Array.from(listItems);

      listItems.forEach(item => {
        item.remove();
      });
    },
    clearInput: function() {
      //Clear Input Fields
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCalorieInput).value = "";
    },
    hideList: function() {
      //hide list if empoty
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: function(totalCalories) {
      //set total in ui
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCalorieInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showEditState: function() {
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App Controller

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // LOAD EVENT LISTNERS
  const loadEventListners = function() {
    // Load UI Selectors from UI Module
    const UISelectors = UICtrl.getSelectors();
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable the Enter Button
    document.addEventListener("keypress", function(e) {
      if (e.keyCode == 13 || e.which == 13) {
        e.preventDefault();
        return false;
      }
    });
    // edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // update button submit event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Back Button Event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Clear All Event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemClick);
  };

  // ADD ITEM SUBMIT
  const itemAddSubmit = function(e) {
    const input = UICtrl.getItemsInput();
    // validate and add
    if (input.name !== "" && input.calories !== "") {
      console.log("added Successfully...");
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //ADD ITEM TO UI LIST
      UICtrl.addListItem(newItem);

      // get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //set Total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in Local Storage
      StorageCtrl.storeItem(newItem);

      // clear input fields
      UICtrl.clearInput();
    } else {
      alert("Please enter Items and calories...");
    }

    e.preventDefault();
  };

  // Edit event
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      console.log("edit state");
      // get list item id
      const listId = e.target.parentNode.parentNode.id;
      // Break id into array
      const listIdArr = listId.split("-");
      // Get Actual Id for Edit Item
      const id = parseInt(listIdArr[1]);

      // Get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set Curent Edit Item in UI
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to Form
      UICtrl.addItemToForm();
    }
  };

  // Update Submit Event
  const itemUpdateSubmit = function(e) {
    //  Get the input From Ui
    const input = UICtrl.getItemsInput();

    // Update the Item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update UI
    UICtrl.updateListitem(updatedItem);

    // Update to Local Storage
    StorageCtrl.updateItemStorage(updatedItem);

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //set Total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    // clear input fields
    UICtrl.clearInput();
    console.log("updated");
    e.preventDefault();
  };
  // Delete item MEthod
  const itemDeleteSubmit = function(e) {
    // Get Current Item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete From DataStructure
    ItemCtrl.deleteItem(currentItem.id);

    // DELETE FROM UI
    UICtrl.deleteListItem(currentItem.id);

    // Delete item From Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //set Total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    // clear input fields
    UICtrl.clearInput();
    console.log("Deleted...");
    e.preventDefault();
  };
  // Clear All method
  const clearAllItemClick = function() {
    //DELETE ALL ITEMS FROM DATA STRUCTURE
    ItemCtrl.clearAllItems();

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //set Total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
    // REMOVE FROM UI
    UICtrl.removeItems();

    // Clear From Local Storage all
    StorageCtrl.clearItemFromStorage();

    //hide list
    UICtrl.hideList();
  };
  // PUBLIC METHODS
  return {
    init: function() {
      console.log("initialize app...");
      // set initial state
      UICtrl.clearEditState();

      // fetch data from data Structure
      const items = ItemCtrl.getItems();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate list with items
        UICtrl.populateItemList(items);
      }
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // INITIALIZE LOAD EVENTS
      loadEventListners();

      // console.log(typeof StorageCtrl.getItemsFromStorage());
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);
// Initialize app
App.init();
