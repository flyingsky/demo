/**
 * Created by ramon on 1/31/16.
 */

"use strict";

angular.module('App', ['ngAnimate']).
  constant('animationTime', {
    cardCloseTime: 500  // s
  }).
  directive('card', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'card.html',
      scope: {
        card: '=',
        onClosed: '&',
        onOpened: '&',
        onRemoved: '&'
      },
      link: function($scope, $el, attrs) {
        $scope.tabName = 'tabName-' + new Date().getTime();
        $scope.getTitle = function() {
          return $scope.card.title || 'Untitled Module';
        };

        $scope.onHeaderClicked = function($event) {
          if (!$scope.card.isClosed && $event.target === $event.currentTarget) {
            $scope.onClosed($scope.card);
          }
        };

        $timeout(function() {
          $el.addClass('animation');
          $timeout(function() {
            $scope.card.isClosed = false;
          }, 100);
        }, 100);
      }
    }
  }]).
  controller('AppCtrl', ['$scope', '$timeout', 'animationTime', function($scope, $timeout, animationTime) {
    $scope.cards = [];

    $scope.addCard = function() {
      function doAddCard() {
        $scope.openedCard = {isClosed: true};
        $scope.cards.push($scope.openedCard);
      }

      if ($scope.openedCard) {
        $scope.openedCard.isClosed = true;
        $timeout(doAddCard, 0);
      } else {
        doAddCard();
      }
    };

    $scope.onCardClosed = function(card) {
      if (!card.isClosed) {
        $scope.openedCard = null;
        card.isClosed = true;
      }
    };

    $scope.onCardOpened = function(card) {
      if (card.isClosed) {
        if ($scope.openedCard) {
          $scope.openedCard.isClosed = true;
        }
        $scope.openedCard = card;
        card.isClosed = false;
      }
    };

    $scope.onCardRemoved = function(card) {
      for (var i = 0; i < $scope.cards.length; i++) {
        if ($scope.cards[i] === card) {
          $scope.cards.splice(i, 1);
          if ($scope.openedCard === card) {
            $scope.openedCard = null;
          }
          return;
        }
      }
    }
  }]);