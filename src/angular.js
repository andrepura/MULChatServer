

angular.module('myApp', []).controller('consoleAppController', function($scope) {
  $scope.log=[];
  
  $scope.consoleIndex=0;
  
  
  $scope.getColor = function(l){
	  if(l.indexOf('ERROR')>=0){
		  return {color:"red"};
	  }
  };
  
  socket.on('console', function(text)
  {
	  $scope.consoleIndex++;
	  var iString=''+$scope.consoleIndex;
	  while(iString.length<5){
		  iString = "0"+iString;
	  }
		  
	  $scope.log=[(iString + " " +(new Date()).toLocaleTimeString()+': '+text)].concat($scope.log);
	  $scope.$apply();
	  if($scope.log.length>50){
		  $scope.log.splice(-1,1);
	  }
  });
});