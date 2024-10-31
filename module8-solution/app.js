(function() {
	'use strict';

	angular.module('NarrowItDownApp', [])
	.controller('NarrowItDownController', NarrowItDownController) 
	.service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItems);

	function FoundItems() {
		var ddo = {
			templateUrl: 'menuItemsUrl.html',
			scope: {
				itemsFound: '<',
				onRemove: '&'
			}
		};
		return ddo;
	}

	NarrowItDownController.$inject = ['MenuSearchService'];
	function NarrowItDownController(MenuSearchService) {
		var narrowItDown = this;

		narrowItDown.searchTerm = "";
		narrowItDown.found = [];

		narrowItDown.getMatchedItems = function(searchTerm){
			MenuSearchService.getMatchedMenuItems(searchTerm).then(function(menuItems) {
				narrowItDown.found = menuItems;
				console.log(narrowItDown.found);
			}).catch(function(error) {
				console.log("error");
			});
		}

		narrowItDown.removeItem = function(index) {
			narrowItDown.found.splice(index, 1);
		}
	}

	MenuSearchService.$inject = ['$http'];
	function MenuSearchService($http) {
		var service = this;

		service.getMatchedMenuItems = function(searchTerm) {
			console.log(searchTerm);
			var count = 0;
			return $http({
				method: "GET", 
				url: ("https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json")
			}).then(function(response) {
				var foundItems = [];
				var allMenuItems = []
				for (var key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        var category = response.data[key];
                        allMenuItems = allMenuItems.concat(category.menu_items);
                    }
                }
                console.log(allMenuItems);

                for (var i = 0; i < allMenuItems.length; i++) {
                	if(allMenuItems[i].description.indexOf(searchTerm) != -1) {
                		foundItems.push(allMenuItems[i]);
                	}
                }
                return foundItems;
			}).catch(function(error) {
				console.log("errored");
			})
		};
	}

})();

