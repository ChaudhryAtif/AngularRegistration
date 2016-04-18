myApp.factory('Authentication', ['$rootScope','$firebaseAuth', '$firebaseObject', '$location', 'FIREBASE_URL', function($rootScope, $firebaseAuth, $firebaseObject, $location, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var fbAuth = $firebaseAuth(ref);

    fbAuth.$onAuth(function(authUser) {
        if (authUser) {
            var userRef = new Firebase(FIREBASE_URL + 'users/' + authUser.uid);
            var userObj = $firebaseObject(userRef);

            $rootScope.currentUser = userObj;
        } else {
            $rootScope.currentUser = '';
        }
    });

    var myObject = {
        login: function (user) {
            fbAuth.$authWithPassword({
                email: user.email,
                password: user.password
            }).then(function(regUser) {
                $location.path('/success');
            }).catch(function(error) {
                $rootScope.message = error.message;
            });
        },

        logout: function() {
            return fbAuth.$unauth();
        },

        requireAuth: function() {
            return fbAuth.$requireAuth();
        },

        register: function (user) {
            fbAuth.$createUser({
                email: user.email,
                password: user.password
            }).then(function (regUser) {
                var regRef = new Firebase(FIREBASE_URL + 'users')
                    .child(regUser.uid).set({
                        date: Firebase.ServerValue.TIMESTAMP,
                        regUser: regUser.uid,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    });

                myObject.login(user);
            }).catch(function (error) {
                $rootScope.message = error.message;
            });
        }
    }

    return myObject;

}]);