describe('LoginCtrl', function() {

    var controller, 
        deferredLogin,
        dinnerServiceMock,
        stateMock,
        ionicPopupMock;
    
    beforeEach(module('starter.controllers')); 

    describe('#validateLogin', function() {


        it('should call login on dinnerService', function() {
            expect(dinnerServiceMock.login).toHaveBeenCalledWith('test1', 'password1'); 
        });

        describe('when the login is executed,', function() {
            it('if successful, should change state to my-dinners', function() {

                // TODO: Mock the login response from DinnerService

                expect(stateMock.go).toHaveBeenCalledWith('user-dash.home');
            });

            it('if login is unsuccessful, should show a popup', function() {

                expect(ionicPopupMock.alert).toHaveBeenCalled();
            });
        });
    })
});
