describe('LoginCtrl', function() {

    var controller, 
        deferredLogin,
        stateMock,
        ionicPopupMock;
    
    beforeEach(module('starter.controllers')); 

    describe('#validateLogin', function() {


        it('should call login on userDashboard', function() {
            expect(userDashboard.login).toHaveBeenCalledWith('pr3md@mail.umkc.edu', 'password1'); 
        });

        describe('when the login is executed,', function() {
            it('if successful, should change state to dashboard', function() {

                expect(stateMock.go).toHaveBeenCalledWith('user-dash.home');
            });

            it('if login is unsuccessful, should show a popup', function() {

                expect(ionicPopupMock.alert).toHaveBeenCalled();
            });
        });
    })
});