describe('RegistrationCtrl', function() {

    var controller, 
        deferredLogin,
        stateMock,
        ionicPopupMock;
    
    beforeEach(module('starter.controllers')); 

    describe('#register', function() {


        describe('when the register is executed,', function() {
            it('if successful, should change state to login', function() {

                expect(stateMock.go).toHaveBeenCalledWith('tab-login');
            });

            it('if registration is unsuccessful, should show a popup', function() {

                expect(ionicPopupMock.alert).toHaveBeenCalled();
            });
        });
    })
});